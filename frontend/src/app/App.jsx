import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from '../routes/Routes'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useResumes } from '../features/resumes/hooks/useResume'
import { useJobs } from '../features/jobs/hooks/useJobs'

const App = () => {
  const auth=useAuth()
  const resume=useResumes()
  const job=useJobs()
  useEffect(()=>{
    auth.getMe()
    resume.getResume()
    job.getApplications()
    job.getAiRecommendedJobs()
},[])
  return (
   <>
   <RouterProvider router={router}/>
   </>
  )
}

export default App