import React from 'react'
import Header from '../components/Header'

export default function Dashboard(){
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p>Welcome to BagBank POS dashboard.</p>
      </main>
    </div>
  )
}
