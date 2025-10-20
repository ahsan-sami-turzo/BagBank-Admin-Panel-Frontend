import React, { useEffect, useState } from 'react'
import { listSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/suppliers'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Badge from '../components/Badge'
import toast from 'react-hot-toast'
import Pagination from '../components/Pagination'

function formatDate(d){ return d ? new Date(d).toLocaleString() : '' }

export default function SuppliersList(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const load = async ()=>{
    setLoading(true)
    try{
      const params = { q: query || undefined, supplier_type: filterType || undefined, page, page_size: pageSize }
      const data = await listSuppliers(params)
      setItems(data.items || data)
    }catch(e){ toast.error('Failed to load suppliers') }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [query, filterType, page])

  const openCreate = ()=>{ setEditing({ name: '', supplier_type: 'Wholesaler', is_active: true }); setModalOpen(true) }

  const save = async (payload)=>{
    try{
      const body = {
        ...payload,
        name: (payload.name||'').trim(),
        email: payload.email? payload.email.trim() : undefined,
        phone: payload.phone? payload.phone.trim() : undefined
      }
      if (!body.name) { toast.error('Name is required'); return }
      if (body.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) { toast.error('Invalid email'); return }
      if (editing && editing.id){ await updateSupplier(editing.id, body); toast.success('Updated') }
      else { await createSupplier(body); toast.success('Created') }
      setModalOpen(false)
      load()
    }catch(e){ toast.error('Save failed') }
  }

  const confirmDelete = (item)=>{ setToDelete(item); setConfirmOpen(true) }
  const doDelete = async ()=>{
    try{
      await deleteSupplier(toDelete.id)
      toast.success('Deleted successfully')
      setConfirmOpen(false)
      setToDelete(null)
      load()
    }catch(e){ toast.error('Delete failed') }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Suppliers</h2>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} className="border p-2 rounded" placeholder="Search suppliers" />
          <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="border p-2 rounded">
            <option value="">All Types</option>
            <option value="Wholesaler">Wholesaler</option>
            <option value="Factory">Factory</option>
          </select>
          <button onClick={openCreate} className="bg-blue-600 text-white px-3 py-2 rounded">New</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Contact Person</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="p-4">Loading...</td></tr>}
            {!loading && items.length===0 && <tr><td colSpan={7} className="p-4">No suppliers</td></tr>}
            {items.map(it=> (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.supplier_type}</td>
                <td className="p-2">{it.contact_person}</td>
                <td className="p-2">{it.phone}</td>
                <td className="p-2"><Badge active={it.is_active} /></td>
                <td className="p-2">{formatDate(it.created_at)}</td>
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

      <Modal open={modalOpen} title={editing && editing.id? 'Edit Supplier' : 'Create Supplier'} onClose={()=>setModalOpen(false)}>
        <SupplierForm editing={editing} onChange={setEditing} onSubmit={()=>save(editing)} onCancel={()=>setModalOpen(false)} />
      </Modal>

      <div className="mt-2">
        <Pagination page={page} total={/* unknown total, backend should return */ 0} pageSize={pageSize} onPageChange={setPage} />
      </div>

      <ConfirmDialog open={confirmOpen} title="Delete" message={`Delete ${toDelete?.name}?`} onCancel={()=>setConfirmOpen(false)} onConfirm={doDelete} />
    </div>
  )
}

function SupplierForm({ editing, onChange, onSubmit, onCancel }){
  if (!editing) return null
  return (
    <form onSubmit={e=>{ e.preventDefault(); onSubmit() }} className="space-y-3">
      <div>
        <label className="block text-sm">Supplier Type</label>
        <select className="w-full border p-2 rounded" value={editing.supplier_type} onChange={e=>onChange({...editing, supplier_type: e.target.value})}>
          <option>Wholesaler</option>
          <option>Factory</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">Name</label>
        <input value={editing.name || ''} onChange={e=>onChange({...editing, name: e.target.value})} className="w-full border p-2 rounded" required />
      </div>
      <div>
        <label className="block text-sm">Address</label>
        <input value={editing.address || ''} onChange={e=>onChange({...editing, address: e.target.value})} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm">Contact Person</label>
        <input value={editing.contact_person || ''} onChange={e=>onChange({...editing, contact_person: e.target.value})} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm">Phone</label>
        <input value={editing.phone || ''} onChange={e=>onChange({...editing, phone: e.target.value})} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-sm">Email</label>
        <input value={editing.email || ''} onChange={e=>onChange({...editing, email: e.target.value})} className="w-full border p-2 rounded" type="email" />
      </div>
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
