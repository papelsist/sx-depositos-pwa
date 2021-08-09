export type Cartera = 'CRE' | 'CON' | 'CHE' | 'JUR' | 'CHO';

export function carteraDisplayName(cartera: Cartera): string {
  switch (cartera) {
    case 'CRE':
      return 'Crédito';
    case 'CON':
      return 'Contado';
    case 'CHE':
      return 'Cheques';
    case 'JUR':
      return 'Jurídico';
    case 'CHO':
      return 'Choferes';
    default:
      return '';
  }
}

export function resolveCarteraPath(tipoCartera: Cartera): string {
  switch (tipoCartera) {
    case 'CRE':
      return 'credito';
    case 'CON':
      return 'contado';
    case 'CHE':
      return 'cheque';
    case 'JUR':
      return 'juridico';
    case 'CHO':
      return 'choferes';
    default:
      return '';
  }
}
