import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { listAttributes, createAttribute, updateAttribute, deleteAttribute } from '../api/attributes'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Badge from '../components/Badge'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'

function debounce(fn, wait=300){
  let t
  return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait) }
}

function formatDate(d){ return new Date(d).toLocaleString() }

export default function AttributesList(){
  const { type } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const load = async ()=>{
    setLoading(true)
    try{
      const params = { q: query || undefined, page, page_size: pageSize }
      const data = await listAttributes(type, params)
      // assume backend returns { items: [], total }
      setItems(data.items || data)
      setTotal(data.total || (data.items? data.items.length : data.length))
    }catch(e){
      toast.error('Failed to load')
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [type, query, page])

  const openCreate = ()=>{ setEditing({ name: '', is_active: true }); setModalOpen(true) }

  const save = async (payload)=>{
    try{
      if (editing && editing.id) {
        await updateAttribute(type, editing.id, payload)
        toast.success('Updated')
      } else {
        await createAttribute(type, payload)
        toast.success('Created')
      }
      setModalOpen(false)
      load()
    }catch(e){ toast.error('Save failed') }
  }

  const confirmDelete = (item)=>{ setToDelete(item); setConfirmOpen(true) }
  const doDelete = async ()=>{
    try{
      await deleteAttribute(type, toDelete.id)
      toast.success('Deleted successfully')
      setConfirmOpen(false)
      setToDelete(null)
      load()
    }catch(e){ toast.error('Delete failed') }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{type}</h2>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} className="border p-2 rounded" placeholder={`Search ${type}`} />
          <button onClick={openCreate} className="bg-blue-600 text-white px-3 py-2 rounded">New</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Updated</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="p-4">Loading...</td></tr>}
            {!loading && items.length===0 && <tr><td colSpan={5} className="p-4">No items</td></tr>}
            {items.map(it=> (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.name}</td>
                <td className="p-2"><Badge active={it.is_active} /></td>
                <td className="p-2">{formatDate(it.created_at)}</td>
                <td className="p-2">{formatDate(it.updated_at)}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button onClick={()=>{ setEditing(it); setModalOpen(true) }} className="text-sm text-blue-600">Edit</button>
                    <button onClick={()=>confirmDelete(it)} className="text-sm text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
      </div>

      <Modal open={modalOpen} title={editing && editing.id? 'Edit' : 'Create'} onClose={()=>setModalOpen(false)}>
        <AttributeForm editing={editing} onChange={setEditing} onSubmit={()=>save({ name: (editing.name||'').trim(), is_active: !!editing.is_active, hex: editing.hex?.trim?.(), rgb: editing.rgb?.trim?.() })} onCancel={()=>setModalOpen(false)} type={type} />
      </Modal>

      <ConfirmDialog open={confirmOpen} title="Delete" message={`Delete ${toDelete?.name}?`} onCancel={()=>setConfirmOpen(false)} onConfirm={doDelete} />
    </div>
  )
}

function AttributeForm({ editing, onChange, onSubmit, onCancel, type }){
  if (!editing) return null
  return (
    <form onSubmit={e=>{ e.preventDefault(); const name = (editing.name||'').trim(); if (!name){ toast.error('Name is required'); return } onSubmit() }} className="space-y-3">
      <div>
        <label className="block text-sm">Name</label>
        <input value={editing.name} onChange={e=>onChange({...editing, name: e.target.value})} className="w-full border p-2 rounded" />
      </div>
      {type === 'colors' && (
        <>
          <div>
            <label className="block text-sm">Hex Code</label>
            <input value={editing.hex || ''} onChange={e=>onChange({...editing, hex: e.target.value.trim()})} className="w-full border p-2 rounded" placeholder="#FFFFFF" />
          </div>
          <div>
            <label className="block text-sm">RGB</label>
            <input value={editing.rgb || ''} onChange={e=>onChange({...editing, rgb: e.target.value.trim()})} className="w-full border p-2 rounded" placeholder="255,255,255" />
          </div>
        </>
      )}
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={!!editing.is_active} onChange={e=>onChange({...editing, is_active: e.target.checked})} />
        <label className="text-sm">Is Active</label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}
