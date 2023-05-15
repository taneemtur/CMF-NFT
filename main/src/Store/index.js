import {configureStore} from '@reduxjs/toolkit'
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import  themeSlice from './Slicers/theme';
import { persistStore, persistReducer } from 'redux-persist'
import sessionStorage from "redux-persist/es/storage/session";


const persistConfig = {
    key: 'root',
    storage: sessionStorage,
}

const persistedReducer = persistReducer(persistConfig, themeSlice)

const store = configureStore({
    reducer: { theme: persistedReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

const persistor = persistStore(store)

export default store;
export {persistor};