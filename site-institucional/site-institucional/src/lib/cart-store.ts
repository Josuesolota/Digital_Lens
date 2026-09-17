import type { ConfigSelection } from "@/lib/products";

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
 * Guardamos apenas `{ productId, quantity, selection? }`; o preço é sempre
 * recalculado a partir do catálogo (`resolvePrice`, em `@/lib/products`), e o
 * servidor volta a validá-lo no checkout — nunca confiamos num preço vindo do
 * cliente ou do localStorage.
 *
 * Uma linha do carrinho é identificada por `productId` **e** pela
 * configuração escolhida: o mesmo produto com dois conjuntos de extras
 * diferentes são duas linhas distintas, não uma quantidade de duas.
 */

const STORAGE_KEY = "dl.cart.v2";
const MAX_QUANTITY = 20;

export type StoredLine = {
  productId: string;
  quantity: number;
  /** Ausente para produtos sem configurador (preço fixo de nível único) */
  selection?: ConfigSelection;
};

/** Identifica univocamente uma linha — usado para juntar/encontrar linhas. */
export function lineKey(productId: string, selection?: ConfigSelection): string {
  if (!selection) return productId;
  if (selection.kind === "tier") return `${productId}::tier:${selection.levelIndex}`;
  // Ordenar os ids torna a chave insensível à ordem em que as opções foram
  // marcadas — a mesma escolha produz sempre a mesma chave.
  return `${productId}::features:${[...selection.optionIds].sort().join(",")}`;
}

export type CartAction =
  | { type: "add"; productId: string; quantity: number; selection?: ConfigSelection }
  | {
      type: "setQuantity";
      productId: string;
      selection: ConfigSelection | undefined;
      quantity: number;
    }
  | { type: "remove"; productId: string; selection?: ConfigSelection }
  | { type: "clear" };

/** Referência estável partilhada por todos os `getServerSnapshot`. */
const EMPTY: StoredLine[] = [];

let lines: StoredLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function isValidSelection(value: unknown): value is ConfigSelection {
  const selection = value as ConfigSelection | null;
  if (!selection || typeof selection !== "object") return false;
  if (selection.kind === "tier") {
    return Number.isInteger(selection.levelIndex) && selection.levelIndex >= 0;
  }
  if (selection.kind === "features") {
    return (
      Array.isArray(selection.optionIds) &&
      selection.optionIds.every((id) => typeof id === "string")
    );
  }
  return false;
}

function isValidLine(value: unknown): value is StoredLine {
  const line = value as StoredLine | null;
  if (
    typeof line?.productId !== "string" ||
    !Number.isFinite(line?.quantity) ||
    line.quantity <= 0
  ) {
    return false;
  }
  // `selection` é opcional, mas se estiver presente tem de ter forma válida —
  // o catálogo pode já não reconhecer os ids (produto/opções removidos desde
  // a última visita); isso é tratado mais tarde por `resolvePrice`, que
  // devolve `{ ok: false }` e a linha é descartada na leitura do contexto.
  if (line.selection !== undefined && !isValidSelection(line.selection)) return false;
  return true;
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
      const key = lineKey(action.productId, action.selection);
      const existing = state.find((line) => lineKey(line.productId, line.selection) === key);
      if (!existing) {
        return [
          ...state,
          { productId: action.productId, quantity: action.quantity, selection: action.selection },
        ];
      }
      return state.map((line) =>
        lineKey(line.productId, line.selection) === key
          ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + action.quantity) }
          : line
      );
    }

    case "setQuantity": {
      const key = lineKey(action.productId, action.selection);
      if (action.quantity <= 0) {
        return state.filter((line) => lineKey(line.productId, line.selection) !== key);
      }
      return state.map((line) =>
        lineKey(line.productId, line.selection) === key
          ? { ...line, quantity: Math.min(MAX_QUANTITY, action.quantity) }
          : line
      );
    }

    case "remove": {
      const key = lineKey(action.productId, action.selection);
      return state.filter((line) => lineKey(line.productId, line.selection) !== key);
    }

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
