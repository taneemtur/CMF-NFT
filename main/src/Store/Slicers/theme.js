import {createSlice} from "@reduxjs/toolkit"

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme:'dark',
        account: null,
        chain: null,
        user: null
    },
    reducers:{
        setTheme: (state, action) => {
            state.theme = action.payload
        },
        setAccount: (state, action) => {
            state.account = action.payload
        },
        setChain: (state, action) => {
            state.chain = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { setTheme, setAccount, setChain, setUser } = themeSlice.actions
export default themeSlice.reducer