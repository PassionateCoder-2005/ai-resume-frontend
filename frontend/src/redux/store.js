import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../redux/auth.slice"
import jobReducer from "../redux/job.slice"
import resumeReducer from "../redux/resume.slice"
export const store = configureStore({
  reducer: {
    auth:authReducer,
    job:jobReducer,
    resume:resumeReducer
  },
})