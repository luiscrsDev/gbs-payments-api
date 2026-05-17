// =================================================================
// VERCEL SERVERLESS FUNCTION — API CENTRAL DE PAGAMENTOS GBS
// Hospedado em: api.globalbrasilshop.com/api/create-payment
// =================================================================
//
// Recebe POST de qualquer LP da GBS, identifica o produto pelo
// `product_id`, calcula o amount com Option 2 (fee absorption),
// autentica no ParceladoPay e retorna o paymentUrl pro front
// redirecionar.
//
// Payload esperado da LP:
// {
//   product_id: 'p1s' | 'p2s' | 'snapmaker-u1' | 'creator5' | 'creator5-pro',
//   nome, cpf, email, telefone,
//   cep, endereco, numero, complemento, bairro, cidade, estado
// }
//
// Env vars (Vercel):
//   PARCELADOPAY_PUBKEY
//   PARCELADOPAY_MERCHANT_CODE
//   PARCELADOPAY_BASE_URL  (opcional, default sandbox)
// =================================================================

import { PRODUCTS, ALLOWED_ORIGINS, computeGatewayAmount } from './_products.js';

const PUBKEY = process.env.PARCELADOPAY_PUBKEY;
const MERCHANT_CODE = process.env.PARCELADOPAY_MERCHANT_CODE;
const BASE_URL = process.env.PARCELADOPAY_BASE_URL || 'https://apisandbox.parceladousa.com';

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Em dev/local, permite tudo. Em prod, só os listados acima vão funcionar.
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      product_id,
      nome, cpf, email, telefone,
      cep, endereco, numero, complemento, bairro, cidade, estado
    } = req.body || {};

    // -------- Validação --------
    if (!product_id || !PRODUCTS[product_id]) {
      return res.status(400).json({
        error: 'product_id inválido ou ausente.',
        valid_ids: Object.keys(PRODUCTS)
      });
    }
    if (!nome || !email || !cpf || !telefone) {
      return res.status(400).json({ error: 'Dados obrigatórios faltando: nome, cpf, email e telefone.' });
    }
    if (!PUBKEY || !MERCHANT_CODE) {
      console.error('[create-payment] Missing env vars: PARCELADOPAY_PUBKEY or PARCELADOPAY_MERCHANT_CODE');
      return res.status(500).json({ error: 'Configuração de pagamento indisponível no servidor.' });
    }

    const product = PRODUCTS[product_id];
    const gatewayAmount = computeGatewayAmount(product);

    // -------- 1) AUTENTICAÇÃO --------
    const authResp = await fetch(`${BASE_URL}/v1/paymentapi/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pubKey: PUBKEY, merchantCode: MERCHANT_CODE })
    });
    const authData = await authResp.json();

    if (authData.statusType !== 'success' || !authData.token) {
      console.error('[create-payment] Auth failed:', authData);
      return res.status(502).json({ error: 'Falha de autenticação no gateway.', detail: authData.msg || null });
    }
    const token = authData.token;

    // -------- 2) CRIAR ORDEM --------
    const cleanedCpf   = String(cpf).replace(/\D/g, '');
    const cleanedPhone = String(telefone).replace(/\D/g, '');
    const cleanedCep   = String(cep || '').replace(/\D/g, '');

    const callbackUrl = `https://${product.subdomain}/?order_complete=1`;

    const orderBody = {
      amount: gatewayAmount,           // ← Option 2: já com fee absorvida
      currency: product.currency,
      invoice: `${product.invoicePrefix}-${Date.now()}`,
      description: product.description,
      client: {
        name: nome,
        email: email,
        doc: cleanedCpf,
        phone: cleanedPhone,
        cep: cleanedCep,
        address: endereco || '',
        addressNumber: numero || '',
        district: bairro || '',
        city: cidade || '',
        state: estado || ''
      },
      callback: callbackUrl
    };

    const orderResp = await fetch(`${BASE_URL}/v1/paymentapi/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderBody)
    });
    const orderData = await orderResp.json();

    if (orderData.statusType !== 'success' || !orderData.data?.url) {
      console.error('[create-payment] Order failed:', JSON.stringify(orderData), 'HTTP', orderResp.status);
      return res.status(502).json({
        error: 'Falha ao criar link de pagamento.',
        detail: orderData.msg || orderData.message || null,
        gateway_status: orderResp.status,
        gateway_response: orderData,
        sent_payload_keys: Object.keys(orderBody)
      });
    }

    // -------- 3) SUCESSO --------
    return res.status(200).json({
      success: true,
      paymentUrl: orderData.data.url,
      orderId: orderData.data.orderId,
      product_id,
      advertised_price: product.advertisedPixPrice,
      gateway_amount: gatewayAmount
    });

  } catch (err) {
    console.error('[create-payment] Unexpected error:', err);
    return res.status(500).json({
      error: 'Erro interno no servidor.',
      detail: String(err?.message || err)
    });
  }
}
