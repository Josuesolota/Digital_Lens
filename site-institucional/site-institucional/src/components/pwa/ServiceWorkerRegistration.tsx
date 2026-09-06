"use client";

import { useEffect } from "react";

/**
 * Regista o service worker depois de a página carregar, para não competir com
 * os recursos críticos do primeiro paint. Em desenvolvimento fica desligado —
 * caches locais durante o `next dev` só causam confusão.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((error) => console.error("[pwa] falha ao registar o SW:", error));
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
