import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    resume:null,
    loading:false,
    error:null
}

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResume: (state, action) => {
      state.resume = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { setResume, setLoading, setError } = resumeSlice.actions

export default resumeSlice.reducer