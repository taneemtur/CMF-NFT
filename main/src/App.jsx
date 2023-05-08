import React, { useEffect } from 'react'
import AppRouter from './router'
import './choices.min.css'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'



const App = () => {
  const theme = useSelector((state)=>state.theme.theme)
  useEffect(() => {
    if(theme==='dark'){
      document.getElementById('theme-opt').href = './css/style-dark.min.css'
    }else{
      document.getElementById('theme-opt').href = './css/style.min.css'
    }
  }, [theme])

  return <AppRouter />
}

export default App

