import React from 'react'
import { NavLink } from 'react-router-dom'

const sections = [
  { title: 'Product Management', items: [
    { to: '/dashboard', label: 'Dashboard', isDashboard: true },
    { to: '/attributes/categories', label: 'Categories' },
    { to: '/attributes/materials', label: 'Materials' },
    { to: '/attributes/styles', label: 'Styles' },
    { to: '/attributes/brands', label: 'Brands' },
    { to: '/attributes/colors', label: 'Colors' },
    { to: '/attributes/countries', label: 'Countries' },
    { to: '/suppliers', label: 'Suppliers' },
    { to: '/products', label: 'Products' }
  ] }
]

export default function Sidebar(){
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-4 font-bold">Product Management</div>
      <nav className="p-2">
        {sections[0].items.map(item=> (
          <NavLink key={item.to} to={item.to} className={({isActive}) => `block px-4 py-2 rounded hover:bg-gray-100 ${isActive? 'bg-gray-100 font-semibold' : 'text-gray-700'} ${item.isDashboard? 'mb-2 border-b' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
