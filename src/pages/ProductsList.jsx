import React, { useEffect, useState } from 'react'
import { listProducts, deleteProduct } from '../api/products'
import { listAttributes } from '../api/attributes'
import { listSuppliers } from '../api/suppliers'
import Pagination from '../components/Pagination'
import Badge from '../components/Badge'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function formatDate(d){ return d ? new Date(d).toLocaleString() : '' }

export default function ProductsList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [ownership, setOwnership] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    listAttributes('categories').then(d => setCategories(d.items || d))
    listAttributes('brands').then(d => setBrands(d.items || d))
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const params = {
        q: query || undefined,
        category: category || undefined,
        brand: brand || undefined,
        ownership_status: ownership || undefined,
        is_active: status || undefined,
        page,
        page_size: pageSize
      }
      const data = await listProducts(params)
      setProducts(data.items || data)
      setTotal(data.total || (data.items ? data.items.length : data.length))
    } catch (e) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [query, category, brand, ownership, status, page])

  const confirmDelete = (item) => { setToDelete(item); setConfirmOpen(true) }
  const doDelete = async () => {
    try {
      await deleteProduct(toDelete.id)
      toast.success('Deleted successfully')
      setConfirmOpen(false)
      setToDelete(null)
      load()
    } catch (e) { toast.error('Delete failed') }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex gap-2 flex-wrap">
          <input value={query} onChange={e => setQuery(e.target.value)} className="border p-2 rounded" placeholder="Search products" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={brand} onChange={e => setBrand(e.target.value)} className="border p-2 rounded">
            <option value="">All Brands</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select value={ownership} onChange={e => setOwnership(e.target.value)} className="border p-2 rounded">
            <option value="">All Ownership</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 rounded">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button onClick={() => navigate('/products/create')} className="bg-blue-600 text-white px-3 py-2 rounded">New Product</button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Brand</th>
              <th className="p-2 text-left">Supplier</th>
              <th className="p-2 text-left">Ownership</th>
              <th className="p-2 text-left">Selling Price</th>
              <th className="p-2 text-left">Variations</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={10} className="p-4">Loading...</td></tr>}
            {!loading && products.length === 0 && <tr><td colSpan={10} className="p-4">No products</td></tr>}
            {products.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.category?.name || ''}</td>
                <td className="p-2">{it.brand?.name || ''}</td>
                <td className="p-2">{it.supplier?.name || ''}</td>
                <td className="p-2">{it.ownership_status}</td>
                <td className="p-2">{it.selling_price}</td>
                <td className="p-2">{it.variations?.length || 0}</td>
                <td className="p-2"><Badge active={it.is_active} /></td>
                <td className="p-2">{formatDate(it.created_at)}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/products/${it.id}`)} className="text-sm text-blue-600">View</button>
                    <button onClick={() => navigate(`/products/${it.id}/edit`)} className="text-sm text-green-600">Edit</button>
                    <button onClick={() => confirmDelete(it)} className="text-sm text-red-600">Delete</button>
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

      <ConfirmDialog open={confirmOpen} title="Delete" message={`Delete ${toDelete?.name}?`} onCancel={() => setConfirmOpen(false)} onConfirm={doDelete} />
    </div>
  )
}
