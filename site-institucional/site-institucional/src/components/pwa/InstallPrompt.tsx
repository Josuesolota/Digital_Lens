"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Download, X } from "lucide-react";
import { LensMark } from "@/components/ui/LensMark";

/**
 * Convite para instalar a app.
 *
 * O Chrome/Edge disparam `beforeinstallprompt` quando os critérios de PWA estão
 * cumpridos; guardamos o evento e mostramos a nossa própria faixa em vez da
 * barra nativa. Uma dispensa fica registada em `localStorage` durante 30 dias.
 */

const DISMISSED_KEY = "dl.pwa.dismissed-at";
const DISMISS_DAYS = 30;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function recentlyDismissed() {
      try {
        const at = Number(window.localStorage.getItem(DISMISSED_KEY));
        if (!at) return false;
        return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
      } catch {
        return false;
      }
    }

    function onBeforeInstall(event: Event) {
      event.preventDefault();
      if (recentlyDismissed()) return;
      setDeferred(event as BeforeInstallPromptEvent);
      // Deixa o visitante ver a página antes de o interromper.
      window.setTimeout(() => setVisible(true), 8000);
    }

    function onInstalled() {
      setVisible(false);
      setDeferred(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // Sem armazenamento: o convite volta a aparecer na próxima visita.
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  }

  return (
    <AnimatePresence>
      {visible && deferred && (
        <m.div
          role="dialog"
          aria-label="Instalar a aplicação Digital Lens"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="glass fixed inset-x-4 bottom-4 z-[65] flex items-center gap-4 rounded-2xl p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] sm:left-auto sm:right-6 sm:w-[22rem]"
        >
          <LensMark size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-fog-50">Instalar Digital Lens</p>
            <p className="mt-0.5 text-xs text-fog-400">
              Acesso rápido, ecrã inteiro e funciona offline.
            </p>
          </div>
          <button
            onClick={install}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(100deg,var(--color-lens-blue-500),var(--color-lens-violet-500))] px-3.5 py-2 text-xs font-semibold text-white"
          >
            <Download size={13} />
            Instalar
          </button>
          <button
            onClick={dismiss}
            aria-label="Agora não"
            className="shrink-0 rounded-full p-1.5 text-fog-600 transition-colors hover:text-fog-200"
          >
            <X size={15} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
