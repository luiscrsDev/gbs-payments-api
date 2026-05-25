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
  // ----- Bambu Lab -----
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
    advertisedPixPrice: 9970.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'P2S',
    subdomain: 'p2s.globalbrasilshop.com',
    description: 'Bambu Lab P2S Combo — Importação direta GlobalBrasilShop'
  },
  'h2c': {
    name: 'Bambu Lab H2C',
    advertisedPixPrice: 27850.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'H2C',
    subdomain: 'h2c.globalbrasilshop.com',
    description: 'Bambu Lab H2C — Importação direta GlobalBrasilShop'
  },
  'h2c-reservation': {
    name: 'Reserva Bambu Lab H2C',
    advertisedPixPrice: 2850.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'H2C-RES',
    subdomain: 'h2c.globalbrasilshop.com',
    description: 'Reserva Bambu Lab H2C — Sinal R$ 2.850 (não reembolsável). Saldo de R$ 25.000 ou 10× R$ 3.050 na entrega em SP-Capital (20-30 dias).'
  },
  'h2d': {
    name: 'Bambu Lab H2D',
    advertisedPixPrice: 23400.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'H2D',
    subdomain: 'h2d.globalbrasilshop.com',
    description: 'Bambu Lab H2D — Importação direta GlobalBrasilShop'
  },
  'x2d': {
    name: 'Bambu Lab X2D Combo',
    advertisedPixPrice: 12970.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'X2D',
    subdomain: 'x2d.globalbrasilshop.com',
    description: 'Bambu Lab X2D Combo — Importação direta GlobalBrasilShop'
  },
  'x2d-reservation': {
    name: 'Reserva Bambu Lab X2D Combo',
    advertisedPixPrice: 750.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'X2D-RES',
    subdomain: 'x2d.globalbrasilshop.com',
    description: 'Reserva Bambu Lab X2D Combo — Sinal R$ 750 (premium pela reserva, não reembolsável). Saldo de R$ 12.970 ou 10× R$ 1.582,82 na entrega em SP-Capital (20-30 dias).'
  },

  // ----- Snapmaker -----
  'snapmaker-u1': {
    name: 'Snapmaker U1',
    advertisedPixPrice: 12970.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'SMK',
    subdomain: 'snapmaker.globalbrasilshop.com',
    description: 'Snapmaker U1 — Importação direta GlobalBrasilShop'
  },
  'snapmaker-u1-reservation': {
    name: 'Reserva Snapmaker U1',
    advertisedPixPrice: 750.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'SMK-RES',
    subdomain: 'snapmaker.globalbrasilshop.com',
    description: 'Reserva Snapmaker U1 — Sinal R$ 750 (premium pela reserva, não reembolsável). Saldo de R$ 12.970 ou 10× R$ 1.582,82 na entrega em SP-Capital (20-30 dias).'
  },
  'snapmaker-artisan': {
    name: 'Snapmaker Artisan 3-em-1',
    advertisedPixPrice: 28300.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'ARTISAN',
    subdomain: 'artisan.globalbrasilshop.com',
    description: 'Snapmaker Artisan 3-em-1 (3D + Laser + CNC) — Importação direta GlobalBrasilShop'
  },

  // ----- Flashforge -----
  'creator5': {
    name: 'Flashforge Creator 5',
    advertisedPixPrice: 10970.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'C5',
    subdomain: 'creator5.globalbrasilshop.com',
    description: 'Flashforge Creator 5 — Importação direta GlobalBrasilShop'
  },
  'creator5-pro': {
    name: 'Flashforge Creator 5 Pro',
    advertisedPixPrice: 12970.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'C5P',
    subdomain: 'creator5pro.globalbrasilshop.com',
    description: 'Flashforge Creator 5 Pro — Importação direta GlobalBrasilShop'
  },
  'creator5-pro-reservation': {
    name: 'Reserva Flashforge Creator 5 Pro',
    advertisedPixPrice: 750.00,
    pixFeeRate: 0.034,
    currency: 'BRL',
    invoicePrefix: 'C5P-RES',
    subdomain: 'creator5pro.globalbrasilshop.com',
    description: 'Reserva Flashforge Creator 5 Pro — Sinal R$ 750 (premium pela reserva, não reembolsável). Saldo de R$ 12.970 ou 10× R$ 1.582,82 na entrega em SP-Capital (20-30 dias).'
  }
};

// Origins permitidos pro CORS — TODAS as LPs + vitrine
export const ALLOWED_ORIGINS = [
  // Bambu
  'https://p1s.globalbrasilshop.com',
  'https://p2s.globalbrasilshop.com',
  'https://h2c.globalbrasilshop.com',
  'https://h2d.globalbrasilshop.com',
  'https://x2d.globalbrasilshop.com',
  // Snapmaker
  'https://snapmaker.globalbrasilshop.com',
  'https://artisan.globalbrasilshop.com',
  // Flashforge
  'https://creator5.globalbrasilshop.com',
  'https://creator5pro.globalbrasilshop.com',
  // Vitrine + raiz
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
