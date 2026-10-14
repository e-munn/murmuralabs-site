/** Decode the HTTP response before giving it to drei, whose loader requires
 * Content-Length. CDNs may omit that header when compressing the response.
 * Fetching a Blob URL supplies the actual decoded size instead.
 */
export async function loadSplatBlob(url: string, signal?: AbortSignal): Promise<Blob> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Street capture download failed (${response.status}).`)
  const blob = await response.blob()
  if (!blob.size || blob.size % 32 !== 0 || blob.type.includes('text') || blob.type.includes('json')) {
    throw new Error('The street capture download is incomplete or has an invalid format.')
  }
  return new Blob([blob], { type: 'application/octet-stream' })
}
