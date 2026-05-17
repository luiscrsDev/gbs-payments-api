# GBS Payments API

API central de pagamentos da **GlobalBrasilShop**. Recebe POST de qualquer
LP (p1s, p2s, snapmaker, creator5, creator5pro), gera link ParceladoPay
e devolve `paymentUrl` pro front redirecionar.

## Endpoints

| Método | URL                            | Descrição                                     |
|--------|--------------------------------|-----------------------------------------------|
| POST   | `/api/create-payment`          | Cria ordem ParceladoPay e devolve paymentUrl  |
| POST   | `/api/webhook`                 | Recebe notificação de status do ParceladoPay  |

## Deploy

1. Criar repo `gbs-payments-api` no GitHub.
2. Subir conteúdo desta pasta.
3. Importar no Vercel.
4. Configurar env vars no Vercel (**Settings → Environment Variables**):
   - `PARCELADOPAY_PUBKEY` = chave pública (sandbox ou prod)
   - `PARCELADOPAY_MERCHANT_CODE` = código do merchant (sandbox: `6781`)
   - `PARCELADOPAY_BASE_URL` (opcional) =
     - Sandbox: `https://apisandbox.parceladousa.com` (default)
     - Prod: `https://api.parceladousa.com`
5. Apontar custom domain no Vercel: `api.globalbrasilshop.com`.
6. Cadastrar o webhook no painel ParceladoPay:
   `https://api.globalbrasilshop.com/api/webhook`

## Como uma LP chama esta API

```js
const resp = await fetch('https://api.globalbrasilshop.com/api/create-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product_id: 'p1s',  // ← identificador do produto
    nome, cpf, email, telefone,
    cep, endereco, numero, complemento, bairro, cidade, estado
  })
});
const data = await resp.json();
if (data.success) window.location.href = data.paymentUrl;
```

## Catálogo de produtos

Editar `api/_products.js` para alterar preço, adicionar produto novo
ou ajustar `pixFeeRate` quando renegociar com ParceladoPay.

`product_id` válidos atuais:
- `p1s` — Bambu Lab P1S Combo
- `p2s` — Bambu Lab P2S Combo
- `snapmaker-u1` — Snapmaker U1
- `creator5` — Flashforge Creator 5
- `creator5-pro` — Flashforge Creator 5 Pro

## Option 2 — Fee Absorption

O ParceladoPay cobra taxa em cima do `amount` enviado (Pix ~3,4%).
Pra preservar transparência (LP anuncia X → cliente paga X), enviamos:

```
amount = advertisedPixPrice / (1 + pixFeeRate)
```

Resultado: Pix mostra exatamente o preço anunciado. GBS absorve a taxa
como custo de aquisição. Boleto/cartão ficam ligeiramente acima do Pix —
por isso a LP sempre destaca o preço Pix como "à vista".

## CORS

Aceita apenas as origens listadas em `ALLOWED_ORIGINS` (`api/_products.js`).
Adicionar nova LP = adicionar 1 linha lá.
