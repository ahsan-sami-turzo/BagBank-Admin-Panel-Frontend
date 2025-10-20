import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products'
import Badge from '../components/Badge'

function formatDate(d){ return d ? new Date(d).toLocaleString() : '' }

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)
  const [tab, setTab] = useState('general')

  useEffect(() => {
    getProduct(id).then(data => setProduct(data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="loader mr-2" /> Loading...</div>
  if (!product) return <div className="p-8">Product not found</div>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Details</h2>
        <button onClick={() => navigate('/products')} className="px-3 py-1 border rounded">Back to Products</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setTab('general')} className={`px-3 py-1 rounded transition ${tab==='general'? 'bg-blue-600 text-white shadow' : 'bg-gray-100 hover:bg-blue-50'}`}>General</button>
        <button onClick={() => setTab('variations')} className={`px-3 py-1 rounded transition ${tab==='variations'? 'bg-blue-600 text-white shadow' : 'bg-gray-100 hover:bg-blue-50'}`}>Variations</button>
        <button onClick={() => setTab('pricing')} className={`px-3 py-1 rounded transition ${tab==='pricing'? 'bg-blue-600 text-white shadow' : 'bg-gray-100 hover:bg-blue-50'}`}>Pricing</button>
        <button onClick={() => setTab('audit')} className={`px-3 py-1 rounded transition ${tab==='audit'? 'bg-blue-600 text-white shadow' : 'bg-gray-100 hover:bg-blue-50'}`}>Audit</button>
      </div>
      {tab === 'general' && (
        <div className="space-y-2">
          <div><b>Name:</b> {product.name}</div>
          <div><b>Category:</b> {product.category?.name}</div>
          <div><b>Material:</b> {product.material?.name}</div>
          <div><b>Brand:</b> {product.brand?.name}</div>
          <div><b>Style:</b> {product.style?.name}</div>
          <div><b>Country:</b> {product.country?.name}</div>
          <div><b>Supplier:</b> {product.supplier?.name}</div>
          <div><b>Ownership:</b> {product.ownership_status}</div>
          <div><b>Description:</b> {product.description}</div>
          <div><b>Keywords:</b> {product.keywords}</div>
          <div><b>YouTube:</b> {product.youtube_url}</div>
          <div><b>Facebook:</b> {product.facebook_url}</div>
          <div><b>Status:</b> <Badge active={product.is_active} /></div>
        </div>
      )}
      {tab === 'variations' && (
        <div>
          <h3 className="font-semibold mb-2">Variations</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">Color</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Barcode</th>
                <th className="p-2">Additional Price</th>
                <th className="p-2">Stock Qty</th>
              </tr>
            </thead>
            <tbody>
              {product.variations?.map((v, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{v.color_name || v.color}</td>
                  <td className="p-2">{v.sku}</td>
                  <td className="p-2">{v.barcode}</td>
                  <td className="p-2">{v.additional_price}</td>
                  <td className="p-2">{v.stock_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'pricing' && (
        <div className="space-y-2">
          <div><b>Purchase Price:</b> {product.purchase_price}</div>
          <div><b>Selling Price:</b> {product.selling_price}</div>
        </div>
      )}
      {tab === 'audit' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="text-sm text-gray-600"><b>Created:</b> <span className="font-mono">{formatDate(product.created_at)}</span></div>
          <div className="text-sm text-gray-600"><b>Updated:</b> <span className="font-mono">{formatDate(product.updated_at)}</span></div>
          {product.created_by && <div className="text-sm text-gray-600"><b>Created by:</b> <span className="font-mono">{product.created_by}</span></div>}
          {product.updated_by && <div className="text-sm text-gray-600"><b>Updated by:</b> <span className="font-mono">{product.updated_by}</span></div>}
        </div>
      )}
    </div>
  )
}
