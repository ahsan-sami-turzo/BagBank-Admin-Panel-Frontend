import client from './client'

const BASE = '/products'

export async function listProducts(params={}) {
  const res = await client.get(BASE, { params })
  return res.data
}

export async function getProduct(id) {
  const res = await client.get(`${BASE}/${id}`)
  return res.data
}

export async function createProduct(payload) {
  const res = await client.post(BASE, payload)
  return res.data
}

export async function updateProduct(id, payload) {
  const res = await client.put(`${BASE}/${id}`, payload)
  return res.data
}

export async function deleteProduct(id) {
  const res = await client.delete(`${BASE}/${id}`)
  return res.data
}
