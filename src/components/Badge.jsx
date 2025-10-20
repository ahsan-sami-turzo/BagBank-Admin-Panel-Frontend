import React from 'react'

export default function Badge({ active }){
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${active? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
      {active? 'Active' : 'Inactive'}
    </span>
  )
}
