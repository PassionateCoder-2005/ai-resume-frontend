import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  job:[],
  singleJob:null,
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
    setSingleJob:(state,action)=>{
      state.singleJob=action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setJob, setLoading, setError,setSingleJob } = jobSlice.actions

export default jobSlice.reducer