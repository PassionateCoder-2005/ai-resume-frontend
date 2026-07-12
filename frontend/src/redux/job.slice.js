import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  job:[],
  loading:false,
  error:null
}

export const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJob: (state, action) => {
      state.job = action.payload
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
export const { setJob, setLoading, setError } = jobSlice.actions

export default jobSlice.reducer