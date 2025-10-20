import client from './client'

const BASE = '/attributes'

export async function listAttributes(type, params={}){
  const res = await client.get(`${BASE}/${type}`, { params })
  return res.data
}

export async function getAttribute(type, id){
  const res = await client.get(`${BASE}/${type}/${id}`)
  return res.data
}

export async function createAttribute(type, payload){
  const res = await client.post(`${BASE}/${type}`, payload)
  return res.data
}

export async function updateAttribute(type, id, payload){
  const res = await client.put(`${BASE}/${type}/${id}`, payload)
  return res.data
}

export async function deleteAttribute(type, id){
  const res = await client.delete(`${BASE}/${type}/${id}`)
  return res.data
}
