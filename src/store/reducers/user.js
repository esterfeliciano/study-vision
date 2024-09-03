import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: "",
  lastName:"",
  imageUrl:""
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
   setName: (state, action)=>{
    state.name = action.payload
   },
   setLastName: (state, action) => {
    state.lastName = action.payload
   },
   setImageUrl: (state, action) => {
    state.imageUrl = action.payload
   }

  },
})

export const { } = counterSlice.actions

export default counterSlice.reducer