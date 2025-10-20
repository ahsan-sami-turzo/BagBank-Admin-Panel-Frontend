import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const productMenu = [
  { to: '/attributes/categories', label: 'Categories' },
  { to: '/attributes/materials', label: 'Materials' },
  { to: '/attributes/styles', label: 'Styles' },
  { to: '/attributes/brands', label: 'Brands' },
  { to: '/attributes/colors', label: 'Colors' },
  { to: '/attributes/countries', label: 'Countries' },
  { to: '/suppliers', label: 'Suppliers' },
  { to: '/products', label: 'Products' }
];

export default function Sidebar({ mobileOpen = false, onClose }) {
  const [open, setOpen] = useState(true);
  // Responsive: show as drawer on mobile, fixed on desktop
  return (
    <>
      {/* Overlay for mobile drawer */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${mobileOpen ? 'block md:hidden' : 'hidden'}`}
        onClick={onClose}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={`w-64 h-[calc(100vh-64px)] fixed left-0 top-16 z-50 bg-[#343A40] flex flex-col py-6 px-0 shadow-2xl transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:top-16 md:block md:static md:fixed`}
        style={{ minHeight: 'calc(100vh - 64px)' }}
        aria-label="Sidebar"
      >
        
        <nav className="flex-1">
          <NavLink
            to="/dashboard"
            className={({isActive}) => `flex items-center gap-2 px-8 py-2 mb-1 rounded-lg font-bold text-sm font-['Courier_New',monospace] tracking-wide transition relative ${isActive ? 'bg-[#343a40] text-white' : 'text-[#dee2e6] hover:bg-[#343a40] hover:text-white'}`}
          >
            Dashboard
          </NavLink>
          <button
            className="w-full flex items-center justify-between px-8 py-2 mt-2 mb-1 rounded-lg bg-[#343a40] text-[#dee2e6] font-bold text-sm font-['Courier_New',monospace] hover:bg-[#495057] hover:text-white transition"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
          >
            <span>Product Management</span>
            <span className={`ml-2 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
          </button>
          {open && (
            <div className="pl-8 mt-1 space-y-1">
              {productMenu.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({isActive}) => `block px-4 py-2 rounded-md text-xs font-['Courier_New',monospace] font-semibold tracking-wide transition ${isActive ? 'bg-[#495057] text-white' : 'text-[#adb5bd] hover:bg-[#343a40] hover:text-white'}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
