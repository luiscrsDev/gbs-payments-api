# Migração das 5 LPs → API central

## Estado atual

- **P1S** → já migrado neste commit ✅
- **P2S, Snapmaker U1, Creator 5, Creator 5 Pro** → checkout ainda só vai pro WhatsApp

## Passo a passo pra subir a API central

### 1. Criar o repo `gbs-payments-api`

1. No GitHub, criar repo novo `gbs-payments-api` (privado).
2. Upload do conteúdo da pasta `gbs-payments-api/` (todos os arquivos).
3. No Vercel: **Add New… → Project → Import `gbs-payments-api`**.
4. Em **Environment Variables**, adicionar (Production + Preview):
   - `PARCELADOPAY_PUBKEY` = `<sua pub key>`
   - `PARCELADOPAY_MERCHANT_CODE` = `6781` (sandbox) ou o de produção
   - `PARCELADOPAY_BASE_URL` = (em branco pra sandbox) ou `https://api.parceladousa.com` (prod)
5. **Deploy**.
6. Em **Settings → Domains**, adicionar `api.globalbrasilshop.com`. Configurar o DNS na Hostinger:
   - Tipo: `CNAME`
   - Nome: `api`
   - Aponta pra: `cname.vercel-dns.com`
7. Aguardar HTTPS propagar (~1 min).

### 2. No painel ParceladoPay

Atualizar o webhook pra URL central:
**Integrações → URL de webhook**: `https://api.globalbrasilshop.com/api/webhook`
(remover o webhook antigo `https://p1s.globalbrasilshop.com/api/webhook`).

### 3. Limpar o repo p1s-landing (DEPOIS que a API central estiver no ar)

No GitHub, no repo `p1s-landing`:
- Deletar `p1s/api/create-payment.js`
- Deletar `p1s/api/webhook.js`
- Deletar `p1s/package.json`
- Subir o `p1s/index.html` atualizado (já tá nessa branch local — agora chama `api.globalbrasilshop.com`)
- Apagar as env vars `PARCELADOPAY_*` do projeto Vercel da P1S (não são mais usadas aqui)

### 4. Migrar P2S, Snapmaker, Creator 5, Creator 5 Pro

Em cada `index.html`, achar a função `submitCheckout` (procurar pelo `wa.me/13053152155`) e substituir o bloco do submit pelo snippet abaixo — **mudando só `PRODUCT_ID` e o texto de produto no track()**.

```js
// --------- SUBSTITUIR O BLOCO try/catch DO SUBMIT POR ESTE ---------
const PAYMENTS_API = 'https://api.globalbrasilshop.com/api/create-payment';
const PRODUCT_ID = '<PUT_PRODUCT_ID_HERE>';  // ⚠️ trocar por: p2s | snapmaker-u1 | creator5 | creator5-pro

try {
  const resp = await fetch(PAYMENTS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: PRODUCT_ID, ...clientData })
  });
  const data = await resp.json();

  if (resp.ok && data.success && data.paymentUrl) {
    track('begin_checkout_redirect', { orderId: data.orderId, product: '<NOME LEGÍVEL DO PRODUTO>' });
    window.location.href = data.paymentUrl;
    return;
  }

  console.warn('Falha ao gerar link de pagamento, fallback WhatsApp:', data);
  track('payment_link_fallback_wa', { reason: data.error || 'unknown' });
  window.open('https://wa.me/13053152155?text=' + encodeURIComponent(whatsappMsg), '_blank');

} catch (err) {
  console.error('Erro de rede ao chamar API central de pagamentos:', err);
  track('payment_link_fallback_wa', { reason: 'network_error' });
  window.open('https://wa.me/13053152155?text=' + encodeURIComponent(whatsappMsg), '_blank');
} finally {
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}
```

Mapeamento PRODUCT_ID por LP:

| LP                                | PRODUCT_ID        | Anunciado Pix (R$) |
|-----------------------------------|-------------------|--------------------|
| `p1s.globalbrasilshop.com`        | `p1s`             | 7.970              |
| `p2s.globalbrasilshop.com`        | `p2s`             | (ajustar) 11.990   |
| `snapmaker.globalbrasilshop.com`  | `snapmaker-u1`    | (ajustar) 8.990    |
| `creator5.globalbrasilshop.com`   | `creator5`        | (ajustar) 9.990    |
| `creator5pro.globalbrasilshop.com`| `creator5-pro`    | 12.250             |

⚠️ **Atenção:** os preços de P2S, Snapmaker e Creator 5 que coloquei em `_products.js`
são suposições. Antes de subir, **confirmar com o que está anunciado em cada LP**
e ajustar `advertisedPixPrice` em `gbs-payments-api/api/_products.js`.

## Option 2 — verificação matemática

Com `pixFeeRate = 0.034` e a fórmula `amount = advertisedPixPrice / 1.034`:

| Produto         | Anunciado | Amount enviado | Pix mostrado | Boleto mostrado |
|-----------------|-----------|----------------|--------------|-----------------|
| P1S             | 7.970,00  | 7.707,93       | **7.970,00** | 7.977,71        |
| P2S             | 11.990,00 | 11.595,74      | **11.990,00**| 12.001,59       |
| Snapmaker U1    | 8.990,00  | 8.694,39       | **8.990,00** | 8.998,69        |
| Creator 5       | 9.990,00  | 9.661,51       | **9.990,00** | 9.999,66        |
| Creator 5 Pro   | 12.250,00 | 11.847,20      | **12.250,00**| 12.261,85       |

Margem absorvida pela GBS no Pix: ~3,3% do ticket
(P1S: R$ 262 · C5 Pro: R$ 403 por venda).

**Próximo passo de negócio:** renegociar a taxa Pix com a ParceladoPay.
3,4% é caro vs. mercado (Pix gateway típico 0,99-1,99%). Se conseguir
baixar pra 1,5%, recupera quase metade da margem absorvida.
