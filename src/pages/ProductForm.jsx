import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, updateProduct, getProduct } from '../api/products'
import { listAttributes } from '../api/attributes'
import { listSuppliers } from '../api/suppliers'
import toast from 'react-hot-toast'

const defaultVariation = { color: '', sku: '', barcode: '', additional_price: 0, stock_quantity: 0 }

export default function ProductForm({ editMode = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [attributes, setAttributes] = useState({ categories: [], materials: [], brands: [], styles: [], countries: [], colors: [] })
  const [suppliers, setSuppliers] = useState([])
  const [form, setForm] = useState({
    name: '',
    category: '',
    material: '',
    brand: '',
    style: '',
    country: '',
    ownership_status: 'Yes',
    supplier: '',
    purchase_price: '',
    selling_price: '',
    description: '',
    keywords: '',
    youtube_url: '',
    facebook_url: '',
    is_active: true,
    variations: [ { ...defaultVariation } ]
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    async function loadAttributes() {
      const types = ['categories', 'materials', 'brands', 'styles', 'countries', 'colors']
      const result = {}
      for (const t of types) {
        const d = await listAttributes(t)
        result[t] = d.items || d
      }
      setAttributes(result)
    }
    loadAttributes()
    listSuppliers().then(d => setSuppliers(d.items || d))
  }, [])

  useEffect(() => {
    if (editMode && id) {
      setLoading(true)
      getProduct(id).then(data => {
        setForm({
          ...data,
          category: data.category?.id || '',
          material: data.material?.id || '',
          brand: data.brand?.id || '',
          style: data.style?.id || '',
          country: data.country?.id || '',
          supplier: data.supplier?.id || '',
          variations: data.variations?.length ? data.variations : [ { ...defaultVariation } ]
        })
      }).catch(() => toast.error('Failed to load product')).finally(() => setLoading(false))
    }
  }, [editMode, id])

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleVariationChange(idx, field, value) {
    setForm(f => ({
      ...f,
      variations: f.variations.map((v, i) => i === idx ? { ...v, [field]: value } : v)
    }))
  }

  function addVariation() {
    setForm(f => ({ ...f, variations: [ ...f.variations, { ...defaultVariation } ] }))
  }

  function removeVariation(idx) {
    setForm(f => ({ ...f, variations: f.variations.length > 1 ? f.variations.filter((_, i) => i !== idx) : f.variations }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.category) errs.category = 'Category is required'
    if (!form.material) errs.material = 'Material is required'
    if (!form.brand) errs.brand = 'Brand is required'
    if (!form.style) errs.style = 'Style is required'
    if (!form.country) errs.country = 'Country is required'
    if (!form.purchase_price || Number(form.purchase_price) <= 0) errs.purchase_price = 'Purchase price must be > 0'
    if (!form.selling_price || Number(form.selling_price) <= 0) errs.selling_price = 'Selling price must be > 0'
    if (!form.variations.length) errs.variations = 'At least one variation required'
    form.variations.forEach((v, i) => {
      if (!v.color) errs[`variation_color_${i}`] = 'Color required'
      if (!v.sku) errs[`variation_sku_${i}`] = 'SKU required'
      if (v.stock_quantity === '' || Number(v.stock_quantity) < 0) errs[`variation_stock_${i}`] = 'Stock required'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        variations: form.variations.map(v => ({
          ...v,
          color: v.color,
          sku: v.sku.trim(),
          barcode: v.barcode?.trim(),
          additional_price: Number(v.additional_price) || 0,
          stock_quantity: Number(v.stock_quantity) || 0
        }))
      }
      if (editMode && id) {
        await updateProduct(id, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product created')
      }
      navigate('/products')
    } catch (e) {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="loader" /> Loading...</div>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Product' : 'Create Product'}</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Name *</label>
            <input value={form.name} onChange={e => handleChange('name', e.target.value)} className={`w-full border p-2 rounded ${errors.name? 'border-red-500' : ''}`} required />
            {errors.name && <div className="text-xs text-red-600">{errors.name}</div>}
          </div>
          <div>
            <label className="block text-sm">Category *</label>
            <select value={form.category} onChange={e => handleChange('category', e.target.value)} className={`w-full border p-2 rounded ${errors.category? 'border-red-500' : ''}`} required>
              <option value="">Select</option>
              {attributes.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category && <div className="text-xs text-red-600">{errors.category}</div>}
          </div>
          <div>
            <label className="block text-sm">Material *</label>
            <select value={form.material} onChange={e => handleChange('material', e.target.value)} className={`w-full border p-2 rounded ${errors.material? 'border-red-500' : ''}`} required>
              <option value="">Select</option>
              {attributes.materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            {errors.material && <div className="text-xs text-red-600">{errors.material}</div>}
          </div>
          <div>
            <label className="block text-sm">Brand *</label>
            <select value={form.brand} onChange={e => handleChange('brand', e.target.value)} className={`w-full border p-2 rounded ${errors.brand? 'border-red-500' : ''}`} required>
              <option value="">Select</option>
              {attributes.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {errors.brand && <div className="text-xs text-red-600">{errors.brand}</div>}
          </div>
          <div>
            <label className="block text-sm">Style *</label>
            <select value={form.style} onChange={e => handleChange('style', e.target.value)} className={`w-full border p-2 rounded ${errors.style? 'border-red-500' : ''}`} required>
              <option value="">Select</option>
              {attributes.styles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.style && <div className="text-xs text-red-600">{errors.style}</div>}
          </div>
          <div>
            <label className="block text-sm">Country of Origin *</label>
            <select value={form.country} onChange={e => handleChange('country', e.target.value)} className={`w-full border p-2 rounded ${errors.country? 'border-red-500' : ''}`} required>
              <option value="">Select</option>
              {attributes.countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.country && <div className="text-xs text-red-600">{errors.country}</div>}
          </div>
          <div>
            <label className="block text-sm">Ownership Status *</label>
            <select value={form.ownership_status} onChange={e => handleChange('ownership_status', e.target.value)} className="w-full border p-2 rounded" required>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Supplier</label>
            <select value={form.supplier} onChange={e => handleChange('supplier', e.target.value)} className="w-full border p-2 rounded">
              <option value="">Select</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm">Purchase Price *</label>
            <input type="number" min="0" value={form.purchase_price} onChange={e => handleChange('purchase_price', e.target.value)} className={`w-full border p-2 rounded ${errors.purchase_price? 'border-red-500' : ''}`} required />
            {errors.purchase_price && <div className="text-xs text-red-600">{errors.purchase_price}</div>}
          </div>
          <div>
            <label className="block text-sm">Selling Price *</label>
            <input type="number" min="0" value={form.selling_price} onChange={e => handleChange('selling_price', e.target.value)} className={`w-full border p-2 rounded ${errors.selling_price? 'border-red-500' : ''}`} required />
            {errors.selling_price && <div className="text-xs text-red-600">{errors.selling_price}</div>}
          </div>
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} className="w-full border p-2 rounded" rows={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Keywords</label>
            <input value={form.keywords} onChange={e => handleChange('keywords', e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">YouTube Video URL</label>
            <input value={form.youtube_url} onChange={e => handleChange('youtube_url', e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Facebook Post URL</label>
            <input value={form.facebook_url} onChange={e => handleChange('facebook_url', e.target.value)} className="w-full border p-2 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.is_active} onChange={e => handleChange('is_active', e.target.checked)} />
          <label className="text-sm">Is Active</label>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Variations</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2">Color</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Barcode</th>
                  <th className="p-2">Additional Price</th>
                  <th className="p-2">Stock Qty</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {form.variations.map((v, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">
                      <select value={v.color} onChange={e => handleVariationChange(idx, 'color', e.target.value)} className={`border p-2 rounded ${errors[`variation_color_${idx}`]? 'border-red-500' : ''}`}>
                        <option value="">Select</option>
                        {attributes.colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {errors[`variation_color_${idx}`] && <div className="text-xs text-red-600">{errors[`variation_color_${idx}`]}</div>}
                    </td>
                    <td className="p-2">
                      <input value={v.sku} onChange={e => handleVariationChange(idx, 'sku', e.target.value)} className={`border p-2 rounded ${errors[`variation_sku_${idx}`]? 'border-red-500' : ''}`} required />
                      {errors[`variation_sku_${idx}`] && <div className="text-xs text-red-600">{errors[`variation_sku_${idx}`]}</div>}
                    </td>
                    <td className="p-2">
                      <input value={v.barcode || ''} onChange={e => handleVariationChange(idx, 'barcode', e.target.value)} className="border p-2 rounded" />
                    </td>
                    <td className="p-2">
                      <input type="number" min="0" value={v.additional_price} onChange={e => handleVariationChange(idx, 'additional_price', e.target.value)} className="border p-2 rounded" />
                    </td>
                    <td className="p-2">
                      <input type="number" min="0" value={v.stock_quantity} onChange={e => handleVariationChange(idx, 'stock_quantity', e.target.value)} className={`border p-2 rounded ${errors[`variation_stock_${idx}`]? 'border-red-500' : ''}`} required />
                      {errors[`variation_stock_${idx}`] && <div className="text-xs text-red-600">{errors[`variation_stock_${idx}`]}</div>}
                    </td>
                    <td className="p-2">
                      <button type="button" onClick={() => removeVariation(idx)} className="text-sm text-red-600" disabled={form.variations.length === 1}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addVariation} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Add Variation</button>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate('/products')} className="px-3 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : (editMode ? 'Update' : 'Create')}</button>
        </div>
      </form>
    </div>
  )
}
