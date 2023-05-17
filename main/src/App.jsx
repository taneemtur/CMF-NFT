import React, { useEffect, useState } from 'react'
import AppRouter from './router'
import './choices.min.css'
import { useSelector } from 'react-redux'
import axiosConfig from './axiosConfig'
import {Provider} from 'react-redux'
import store, {persistor} from './Store'
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  const theme = useSelector((state) => state.theme.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.getElementById('theme-opt').href = './css/style-dark.min.css'
    } else {
      document.getElementById('theme-opt').href = './css/style.min.css'
    }
  }, [theme])

  return (
  <Provider store={store}>
    <PersistGate persistor={persistor} >
      <AppRouter />
    </PersistGate>
  </Provider>
  )
}

export default App

