import React from 'react'
import { ChatWindow } from './compoenents/ChatWindow'

export function App() {
  return (
    <div className='max-w-7xl bg-gray-200 min-h-screen mx-auto'>
      <Header />
      <ChatWindow />
    </div>
  )
}

const Header = () => {
  return (
    <div className='w-full fixed text-start font-semibold p-4 bg-gray-300'>
      <p>🟢 | Live Chat Room</p>
    </div>
  )
}

