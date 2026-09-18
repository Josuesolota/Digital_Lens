"use client";

import { initializePaddle, type Paddle } from "@paddle/paddle-js";

/**
 * Instância única do Paddle.js, carregada uma só vez por sessão do browser
 * (o script CDN e o handshake com a Paddle não precisam de repetir-se a cada
 * abertura do carrinho).
 */
let paddleInstance: Promise<Paddle | undefined> | null = null;

function getPaddle(): Promise<Paddle | undefined> {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    return Promise.resolve(undefined);
  }
  paddleInstance ??= initializePaddle({
    token,
    environment: process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox",
  });
  return paddleInstance;
}

/**
 * Abre o overlay de checkout da Paddle para uma transacção já criada no
 * servidor (`/api/checkout`). O `transactionId` já identifica o preço e os
 * itens — o overlay só recolhe os dados de pagamento e de faturação.
 */
export async function openPaddleCheckout(input: {
  transactionId: string;
  email?: string | null;
  successUrl: string;
}): Promise<void> {
  const paddle = await getPaddle();
  if (!paddle) {
    throw new Error("Não foi possível carregar o checkout da Paddle.");
  }

  paddle.Checkout.open({
    transactionId: input.transactionId,
    ...(input.email ? { customer: { email: input.email } } : {}),
    settings: { successUrl: input.successUrl },
  });
}
