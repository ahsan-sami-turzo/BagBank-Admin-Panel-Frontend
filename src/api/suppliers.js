import client from './client'

const BASE = '/suppliers'

export async function listSuppliers(params={}){
  const res = await client.get(BASE, { params })
  return res.data
}

export async function getSupplier(id){
  const res = await client.get(`${BASE}/${id}`)
  return res.data
}

export async function createSupplier(payload){
  const res = await client.post(BASE, payload)
  return res.data
}

export async function updateSupplier(id, payload){
  const res = await client.put(`${BASE}/${id}`, payload)
  return res.data
}

export async function deleteSupplier(id){
  const res = await client.delete(`${BASE}/${id}`)
  return res.data
}
