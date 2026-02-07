export function buildWishShareUrl(wishId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/wish/${wishId}`;
}

export function buildBouquetShareUrl(bouquetId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/bouquet/${bouquetId}`;
}
