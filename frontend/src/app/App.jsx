import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from '../routes/Routes'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useResumes } from '../features/resumes/hooks/useResume'

const App = () => {
  const auth=useAuth()
  const resume=useResumes()
  useEffect(()=>{
    auth.getMe()
    resume.getResume()
  },[])
  return (
   <>
   <RouterProvider router={router}/>
   </>
  )
}

export default App