// Available romantic couple GIF options
export interface RomanticGifOption {
  id: string;
  name: string;
  url: string;
}

export const ROMANTIC_GIFS: RomanticGifOption[] = [
  {
    id: 'option-1',
    name: 'Romantic Embrace',
    url: '/assets/generated/couple-romance-option-1.dim_900x600.gif',
  },
  {
    id: 'option-2',
    name: 'Sweet Moments',
    url: '/assets/generated/couple-romance-option-2.dim_900x600.gif',
  },
  {
    id: 'option-3',
    name: 'Love & Joy',
    url: '/assets/generated/couple-romance-option-3.dim_900x600.gif',
  },
];

export const DEFAULT_GIF = ROMANTIC_GIFS[0];

export function getGifByUrl(url: string | null | undefined): RomanticGifOption {
  if (!url) return DEFAULT_GIF;
  return ROMANTIC_GIFS.find((gif) => gif.url === url) || DEFAULT_GIF;
}
