import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  job:[],
  singleJob:null,
  loading:false,
  error:null,
  application:[],
  aiRecommendJobs:[],
  hrJobs:[],
  hrJobApplicants:null
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
    },
    setApplication:(state,action)=>{
      state.application=action.payload
    },
    setAiRecommendJobs:(state,action)=>{
      state.aiRecommendJobs=action.payload
    },
    setHrJobs:(state,action)=>{
      state.hrJobs=action.payload
    },
    setHrJobApplicants:(state,action)=>{
      state.hrJobApplicants=action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setJob, setLoading, setError,setSingleJob,setApplication,setAiRecommendJobs,setHrJobs,setHrJobApplicants } = jobSlice.actions

export default jobSlice.reducer