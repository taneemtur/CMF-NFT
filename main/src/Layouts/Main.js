import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Main = ({children}) => {
  return (
    <>
    <Navbar />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      theme='dark'
    />
    {children}
    <Footer />
    </>
  )
}

export default Main