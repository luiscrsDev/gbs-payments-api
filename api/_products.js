// =================================================================
// CATÁLOGO CENTRAL DE PRODUTOS — GlobalBrasilShop
// =================================================================
//
// `advertisedPixPrice` = preço que aparece NA LANDING (à vista no Pix).
//                        É o que o cliente DEVE pagar no checkout.
//
// `pixFeeRate` = taxa que o ParceladoPay cobra em cima do Pix (decimal).
//                Atualizar quando renegociar com PPay ou mudar de gateway.
//
// Como funciona a Option 2 (fee absorption):
//   amount enviado pra PPay = advertisedPixPrice / (1 + pixFeeRate)
//   Ex: 7970 / 1.034 = 7708,90 → PPay mostra 7708,90 × 1,034 = 7970 ✓
//   Resultado: GBS absorve a taxa de Pix (margem) → cliente paga
//   exatamente o anunciado. Transparência preservada.
//
// IMPORTANTE: outros métodos (boleto +3,5%, cartão à vista +6,4%,
// 18× +35%) ficarão LIGEIRAMENTE acima do anunciado pro Pix. Por isso
// a LP deve sempre destacar o preço Pix como o "à vista" e mostrar
// o parcelamento à parte (já é o padrão atual das LPs).
// =================================================================

export const PRODUCTS = {
  'p1s': {
    name: 'Bambu Lab P1S Combo',
    advertisedPixPrice: 7970.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'P1S',
    subdomain: 'p1s.globalbrasilshop.com',
    description: 'Bambu Lab P1S Combo — Importação direta GlobalBrasilShop'
  },
  'p2s': {
    name: 'Bambu Lab P2S Combo',
    advertisedPixPrice: 11990.00, // ⚠️ AJUSTAR pro preço real da LP P2S
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'P2S',
    subdomain: 'p2s.globalbrasilshop.com',
    description: 'Bambu Lab P2S Combo — Importação direta GlobalBrasilShop'
  },
  'snapmaker-u1': {
    name: 'Snapmaker U1',
    advertisedPixPrice: 8990.00, // ⚠️ AJUSTAR pro preço real da LP Snapmaker
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'SMK',
    subdomain: 'snapmaker.globalbrasilshop.com',
    description: 'Snapmaker U1 — Importação direta GlobalBrasilShop'
  },
  'creator5': {
    name: 'Flashforge Creator 5',
    advertisedPixPrice: 9990.00, // ⚠️ AJUSTAR pro preço real da LP Creator 5
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'C5',
    subdomain: 'creator5.globalbrasilshop.com',
    description: 'Flashforge Creator 5 — Importação direta GlobalBrasilShop'
  },
  'creator5-pro': {
    name: 'Flashforge Creator 5 Pro',
    advertisedPixPrice: 12250.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'C5P',
    subdomain: 'creator5pro.globalbrasilshop.com',
    description: 'Flashforge Creator 5 Pro — Importação direta GlobalBrasilShop'
  }
};

// Origins permitidos pro CORS — TODAS as LPs + vitrine
export const ALLOWED_ORIGINS = [
  'https://p1s.globalbrasilshop.com',
  'https://p2s.globalbrasilshop.com',
  'https://snapmaker.globalbrasilshop.com',
  'https://creator5.globalbrasilshop.com',
  'https://creator5pro.globalbrasilshop.com',
  'https://3d.globalbrasilshop.com',
  'https://globalbrasilshop.com',
  'https://www.globalbrasilshop.com'
];

/**
 * Calcula o amount a enviar pro gateway aplicando Option 2 (fee absorption).
 * Retorna o valor JÁ DESCONTADO da taxa de Pix.
 */
export function computeGatewayAmount(product) {
  const adjusted = product.advertisedPixPrice / (1 + product.pixFeeRate);
  // Arredonda pra 2 casas (centavos)
  return Math.round(adjusted * 100) / 100;
}
