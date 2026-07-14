import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
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
    const hydrateDashboard = async () => {
      await auth.getMe()
      await resume.getResume()
      await job.getApplications()
      await job.getAiRecommendedJobs()
    }

    hydrateDashboard()
  }, [user?._id, user?.role])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App