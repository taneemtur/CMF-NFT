import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';



const Main = ({children}) => {
  const {theme} = useSelector(state => state.theme)
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
      theme={theme}
    />
    {children}
    <Footer />
    </>
  )
}

export default Main