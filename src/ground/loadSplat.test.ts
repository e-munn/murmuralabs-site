import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSplatBlob } from './loadSplat'

test('decoded response without Content-Length becomes a size-bearing Blob URL', async t => {
  const nativeFetch = globalThis.fetch
  t.mock.method(globalThis, 'fetch', async () => new Response(new Uint8Array(64), { headers: { 'Content-Type': 'application/octet-stream', 'Content-Encoding': 'gzip' } }))
  const blob = await loadSplatBlob('/capture.splat')
  const url = URL.createObjectURL(blob)
  try {
    const response = await nativeFetch(url)
    assert.equal(response.headers.get('Content-Length'), '64')
    assert.equal((await response.arrayBuffer()).byteLength, 64)
  } finally { URL.revokeObjectURL(url) }
})
test('HTTP errors never reach the splat parser', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('Not found', { status: 404 }))
  await assert.rejects(loadSplatBlob('/missing.splat'), /404/)
})
test('rejects truncated bytes and HTML fallback pages', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(new Uint8Array(31)))
  await assert.rejects(loadSplatBlob('/truncated.splat'), /invalid format/)
  t.mock.method(globalThis, 'fetch', async () => new Response('x'.repeat(64), { headers: { 'Content-Type': 'text/html' } }))
  await assert.rejects(loadSplatBlob('/fallback.splat'), /invalid format/)
})
test('forwards cancellation to the download', async t => {
  const controller = new AbortController()
  controller.abort()
  t.mock.method(globalThis, 'fetch', async (_url: unknown, init?: RequestInit) => {
    assert.equal(init?.signal, controller.signal)
    init?.signal?.throwIfAborted()
    return new Response()
  })
  await assert.rejects(loadSplatBlob('/capture.splat', controller.signal), { name: 'AbortError' })
})
