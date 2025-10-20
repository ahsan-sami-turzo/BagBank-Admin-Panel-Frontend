import React from 'react'

export default function Pagination({ page=1, total=0, pageSize=20, onPageChange }){
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize))
  const prev = ()=> onPageChange(Math.max(1, page-1))
  const next = ()=> onPageChange(Math.min(totalPages, page+1))
  if (!total || totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-sm text-gray-600">Page {page} of {totalPages} — {total} items</div>
      <div className="flex items-center gap-2">
        <button onClick={prev} disabled={page<=1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
        <button onClick={next} disabled={page>=totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  )
}
