/**
 * 判断 url 是否为绝对路径
 */
export const isAbsoluteURL = (url: string): boolean => /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(url)

/**
 * 判断 val 是否为 URLSearchParams
 */
export const isSearchParams = (val: unknown): val is URLSearchParams => val instanceof URLSearchParams

export function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
