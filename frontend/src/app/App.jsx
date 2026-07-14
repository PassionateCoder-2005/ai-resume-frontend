import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from '../routes/Routes'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useResumes } from '../features/resumes/hooks/useResume'
import { useJobs } from '../features/jobs/hooks/useJobs'

const App = () => {
  const auth = useAuth()
  const resume = useResumes()
  const job = useJobs()
  const { user } = useSelector((state) => state.auth)  

  useEffect(() => {
    auth.getMe()
  }, [])

  useEffect(() => {
    if (user?._id) {
      resume.getResume()
      job.getApplications()
      job.getAiRecommendedJobs()
    }
  }, [user?._id])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App