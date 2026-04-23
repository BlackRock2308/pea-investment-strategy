const numberFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
});

export function fmt(n) {
  return numberFormatter.format(n);
}

export function fmtEur(n) {
  return fmt(n) + ' €';
}
