import {configureStore} from '@reduxjs/toolkit'
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import  themeSlice from './Slicers/theme';
export default configureStore({
    reducer:{
        theme:themeSlice,
    },
    middleware: (getDefaultMiddleware) =>{
        return getDefaultMiddleware({
            serializableCheck:false
        })
    },
})