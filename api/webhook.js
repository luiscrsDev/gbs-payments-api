// =================================================================
// VERCEL SERVERLESS FUNCTION — WEBHOOK CENTRAL PARCELADOPAY
// Hospedado em: api.globalbrasilshop.com/api/webhook
// =================================================================
//
// URL única pra registrar no painel ParceladoPay (Integrações →
// URL de webhook):
//   https://api.globalbrasilshop.com/api/webhook
//
// Status possíveis:
//   open      — transação aberta, aguardando pagamento
//   pending   — boleto gerado, aguardando quitação
//   analysis  — em análise de segurança
//   approved  — pagamento aprovado ✓
//   delivered — valor transferido pro merchant
//   canceled  — cancelado
//   aborted   — cliente abortou na tela
//
// Identificamos o produto pelo prefixo do `invoice`:
//   P1S-* → p1s   |  P2S-* → p2s
//   SMK-* → snapmaker-u1
//   C5-*  → creator5  |  C5P-* → creator5-pro
// =================================================================

import { PRODUCTS } from './_products.js';

function productIdFromInvoice(invoice) {
  if (!invoice) return null;
  const prefix = String(invoice).split('-')[0];
  for (const [id, p] of Object.entries(PRODUCTS)) {
    if (p.invoicePrefix === prefix) return id;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body || {};
    const { orderId, status, amount, invoice, client } = event;
    const productId = productIdFromInvoice(invoice);

    console.log('[webhook]', JSON.stringify({
      orderId, status, amount, invoice, productId, client_email: client?.email
    }));

    // TODO (próximas iterações):
    //   - Persistir evento no Supabase (tabela `payment_events`)
    //   - Disparar GA4 Measurement Protocol (purchase server-side, sem ad blockers)
    //   - Email/WhatsApp pro cliente quando approved
    //   - Notificar GBS no Slack/Telegram quando approved
    //   - Disparar fluxo de fulfillment (criar pedido no Shopify, etc.)

    return res.status(200).json({ received: true, orderId, status, productId });
  } catch (err) {
    console.error('[webhook] Error:', err);
    return res.status(500).json({ error: 'Erro ao processar webhook.' });
  }
}
