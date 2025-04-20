import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { BookProvider } from './context/BookContext'

function App() {


  return (
    <>
    <BookProvider>
      <Navbar/>
      <main className='min-h-[calc(100vh-100px)] mt-16'>
        <Outlet/>
      </main>
      <Footer/>
    </BookProvider>
    </>
  )
}

export default App
