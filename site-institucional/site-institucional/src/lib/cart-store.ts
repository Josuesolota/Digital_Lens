/**
 * Store externo do carrinho.
 *
 * Vive fora do React e é consumido com `useSyncExternalStore`. Foi esta a
 * escolha em vez de `useState` + `useEffect` de hidratação porque:
 *
 *  1. Elimina o efeito que lê o `localStorage` depois da montagem (e o
 *     re-render em cascata que o React 19 sinaliza como anti-padrão).
 *  2. Dá sincronização entre separadores de graça, através do evento `storage`.
 *  3. `getServerSnapshot` devolve sempre a lista vazia, pelo que o HTML do
 *     servidor e a primeira renderização no cliente coincidem — sem mismatch.
 *
 * Guardamos apenas `{ productId, quantity }`; o preço e o nome são resolvidos
 * a partir do catálogo em código, e o servidor volta a validá-los no checkout.
 */

const STORAGE_KEY = "dl.cart.v1";
const MAX_QUANTITY = 20;

export type StoredLine = { productId: string; quantity: number };

export type CartAction =
  | { type: "add"; productId: string; quantity: number }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

/** Referência estável partilhada por todos os `getServerSnapshot`. */
const EMPTY: StoredLine[] = [];

let lines: StoredLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function isValidLine(value: unknown): value is StoredLine {
  const line = value as StoredLine | null;
  return (
    typeof line?.productId === "string" &&
    Number.isFinite(line?.quantity) &&
    line.quantity > 0
  );
}

function readStorage(): StoredLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const valid = parsed.filter(isValidLine);
    return valid.length > 0 ? valid : EMPTY;
  } catch {
    // Modo privado, armazenamento cheio ou JSON corrompido.
    return EMPTY;
  }
}

function writeStorage(value: StoredLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Sem persistência: o carrinho continua a funcionar nesta sessão.
  }
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  lines = readStorage();
}

function emit() {
  for (const listener of listeners) listener();
}

function reduce(state: StoredLine[], action: CartAction): StoredLine[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((line) => line.productId === action.productId);
      if (!existing) {
        return [...state, { productId: action.productId, quantity: action.quantity }];
      }
      return state.map((line) =>
        line.productId === action.productId
          ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + action.quantity) }
          : line
      );
    }

    case "setQuantity": {
      if (action.quantity <= 0) {
        return state.filter((line) => line.productId !== action.productId);
      }
      return state.map((line) =>
        line.productId === action.productId
          ? { ...line, quantity: Math.min(MAX_QUANTITY, action.quantity) }
          : line
      );
    }

    case "remove":
      return state.filter((line) => line.productId !== action.productId);

    case "clear":
      return EMPTY;
  }
}

function onStorageEvent(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  lines = readStorage();
  emit();
}

export const cartStore = {
  subscribe(listener: () => void) {
    hydrate();
    listeners.add(listener);
    if (listeners.size === 1) {
      window.addEventListener("storage", onStorageEvent);
    }
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        window.removeEventListener("storage", onStorageEvent);
      }
    };
  },

  /** No cliente. A referência só muda quando o conteúdo muda. */
  getSnapshot(): StoredLine[] {
    hydrate();
    return lines;
  },

  /** No servidor e durante a hidratação. */
  getServerSnapshot(): StoredLine[] {
    return EMPTY;
  },

  dispatch(action: CartAction) {
    const next = reduce(lines, action);
    if (next === lines) return;
    lines = next;
    writeStorage(next);
    emit();
  },
};

/** `true` no cliente depois da hidratação, `false` no HTML do servidor. */
export const hydrationStore = {
  subscribe: cartStore.subscribe,
  getSnapshot: () => true,
  getServerSnapshot: () => false,
};
