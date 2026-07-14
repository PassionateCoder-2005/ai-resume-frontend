import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth'
import { useResumes } from '../../resumes/hooks/useResume'

/* ─────────────────────────────────────────
   Helper – derive logo letter + bg/text colours from company name
───────────────────────────────────────── */
const getCompanyMeta = (companyName) => {
  const name = companyName || 'Co'
  const logo = name.slice(0, 2).toUpperCase()
  const hash = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const palettes = [
    'bg-indigo-100 text-indigo-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-cyan-100 text-cyan-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
  ]
  return { logo, logoBg: palettes[hash % palettes.length] }
}

/* ─────────────────────────────────────────
   Helper – normalise backend status → UI label
───────────────────────────────────────── */
const normaliseStatus = (raw) => {
  const s = (raw || '').toLowerCase()
  if (s === 'shortlisted' || s === 'selected') return 'Shortlisted'
  if (s === 'rejected')                         return 'Rejected'
  return 'In Review'   // pending / under_review / anything else
}

const CandidateDash = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { resume: resumeState } = useSelector((state) => state.resume)
  const currentResume = Array.isArray(resumeState?.resume) ? resumeState?.resume?.[0] : resumeState?.resume;
  const displayResume = currentResume 
  const { getResume } = useResumes()
  const [resumeUploadPrompt, setResumeUploadPrompt] = useState(false)
  const application=useSelector((state)=>state.job.application)
  const aiRecommned=useSelector((state)=>state.job.aiRecommendJobs)
  // Toast notifications state
  const [notifications, setNotifications] = useState([])
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All') // 'All' | 'Shortlisted' | 'In Review' | 'Rejected'
  
  // Interactive UI modals
  const [isViewingResume, setIsViewingResume] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedAppFeedback, setSelectedAppFeedback] = useState(null)
  // console.log(resumeState)
  // Hidden file input ref
  const fileInputRef = useRef(null)

const auth=useAuth()

  useEffect(() => {
    getResume()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  // ── Derive application list from backend Redux state ──────────────────
  const applications = useMemo(() => {
    if (!Array.isArray(application) || application.length === 0) return []
    return application.map((app) => {
      const jobObj   = app.job   || {}          // populated job object
      const company  = jobObj.company  || app.company  || 'Company'
      const { logo, logoBg } = getCompanyMeta(company)
      const status   = normaliseStatus(app.status)
      const appliedDate = app.createdAt
        ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'N/A'
      return {
        id:          app._id,
        company,
        logo,
        logoBg,
        jobTitle:    jobObj.title || app.jobTitle || 'Job Position',
        appliedDate,
        fitScore:    app.fitScore ?? app.matchScore ?? null,
        status,
        feedback:    app.feedback || app.remarks || '',
      }
    })
  }, [application])

  // ── Stats derived from real application data ───────────────────────────
  const stats = useMemo(() => ({
    jobsApplied: applications.length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    rejected:    applications.filter(a => a.status === 'Rejected').length,
  }), [applications])

  // ── AI Recommended Jobs from backend (filter out already-applied ones) ──
  const recommendedJobs = useMemo(() => {
    const list = aiRecommned?.recommendedJobs || []
    return list
      .filter(job => (job.applicationStatus || '').toLowerCase() !== 'applied')
      .map(job => {
        const { logo, logoBg } = getCompanyMeta(job.company)
        return {
          id:             job._id,
          company:        job.company,
          logo,
          logoBg,
          jobTitle:       job.title,
          location:       job.location,
          fitScore:       job.matchScore ?? null,
          matchedSkills:  job.matchedSkills  || [],
          missingSkills:  job.missingSkills  || [],
          reason:         job.reason         || '',
          recommendation: job.recommendation || '',
          description:    job.description    || '',
        }
      })
  }, [aiRecommned])

  // Resume details
  const [resumeData, setResumeData] = useState({
    name: 'cv_rahul_sharma.pdf',
    uploadDate: 'July 10, 2026',
    status: 'Screening Complete',
    score: 92,
    fileSize: '1.4 MB',
    extractedSkills: ['React', 'Node.js', 'TypeScript', 'TailwindCSS', 'Redux', 'PostgreSQL', 'RESTful APIs'],
    aiRecommendations: [
      'Your React skills are exceptional. Focus applications on Senior/Mid Frontend and Product engineering roles.',
      'Consider adding Docker or AWS deployment projects to your resume to unlock full-stack developer score matches.',
      'Strong historical stability (2+ years at Vercel) is a major positive indicator for hiring managers.'
    ]
  })

  // Toast handler
  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  // Handle Logout
  const handleLogout = async () => {
    await auth.logoutUser();
    navigate("/login");
    
  }

  // Handle trigger for file upload
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Simulating a file upload and AI screening process
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0]
  //   if (!file) return

  //   setIsUploading(true)
  //   setUploadProgress(10)

  //   const interval = setInterval(() => {
  //     setUploadProgress(prev => {
  //       if (prev >= 100) {
  //         clearInterval(interval)
  //         return 100
  //       }
  //       return prev + 15
  //     })
  //   }, 250)

  //   setTimeout(() => {
  //     setIsUploading(false)
  //     const randomScore = Math.floor(Math.random() * 8) + 89 // Generate score between 89 and 97
  //     setResumeData(prev => ({
  //       ...prev,
  //       name: file.name,
  //       uploadDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  //       score: randomScore,
  //       fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
  //     }))

  //     setStats(prev => ({
  //       ...prev,
  //       resumeName: file.name,
  //       uploadDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  //     }))

  //     addToast(`Resume "${file.name}" uploaded successfully! AI analyzed a fit score of ${randomScore}%.`, 'success')
  //   }, 2000)
  // }

  // Apply Flow – show resume prompt if no resume; otherwise toast and navigate
  const handleApplyJob = (jobId) => {
    if (!currentResume) {
      setResumeUploadPrompt(true)
      return
    }
    const job = recommendedJobs.find(j => j.id === jobId)
    if (!job) return
    addToast(`Applying to ${job.jobTitle} at ${job.company}…`, 'info')
    navigate(`/job/${jobId}`)
  }

  // Search & Filtered Applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      (app.company  || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {notifications.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 animate-fadeIn transform transition-all duration-300 bg-white ${
              toast.type === 'success' ? 'border-emerald-100 text-emerald-800' :
              toast.type === 'info' ? 'border-indigo-100 text-indigo-800' :
              'border-amber-100 text-amber-800'
            }`}
          >
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.985l-.04.041a.75.75 0 01-1.084-.985zM12 21a9 9 0 100-18 9 9 0 000 18z" />
              </svg>
            )}
            <div className="text-sm font-semibold flex-1 leading-snug">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* 1. Header/Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-4.5 h-4.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">HireVibe AI</span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50/70 px-3.5 py-1.5 rounded-xl cursor-default">Dashboard</span>
              <a href="#applications-section" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">My Applications</a>
              <a href="#jobs-section" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Recommended Jobs</a>
              <Link to="/all-jobs" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Explore All Jobs</Link>
            </nav>

            {/* Profile Dropdown / Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
                  {user?.username ? user.username.slice(0, 2).toUpperCase() : 'RS'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user?.username || 'Rahul Sharma'}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">Candidate Profile</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors border border-slate-100 hover:border-red-100 bg-white hover:bg-red-50/30 px-3 py-2 rounded-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
             {/* 2. Top Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-50/70 to-indigo-50 border border-indigo-100/40 p-6 md:p-8 overflow-hidden mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Background shapes */}
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl" />
          
          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Welcome back, {user?.username || 'Rahul'} 👋
            </h1>
            <p className="text-slate-505 font-medium text-sm md:text-base leading-relaxed">
              Track your applications and AI resume insights.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
              {currentResume ? 'Update Resume' : 'Upload Resume'}
            </button>
          </div>
        </div> 

        {/* 3. Statistics Cards Grid (4) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Resume Details */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Resume</p>
                <h3 className="text-sm font-extrabold text-slate-800 truncate" title={currentResume ? currentResume.title : "No resume found"}>
                  {currentResume ? currentResume.title : "No resume found"}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  {currentResume ? `Uploaded ${new Date(currentResume.createdAt).toLocaleDateString()}` : "Please upload a resume"}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
            </div>
            {currentResume ? (
              <div className="flex gap-2 mt-3.5">
                {/* <button
                  onClick={() => setIsViewingResume(true)}
                  className="text-[10px] font-bold text-indigo-650 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100/70 px-2.5 py-1.5 rounded-xl transition-all border border-indigo-100 cursor-pointer"
                >
                  View Details
                </button> */}
                <a
                  href={currentResume.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100/70 px-2.5 py-1.5 rounded-xl transition-all border border-slate-100 text-center"
                >
                  View PDF
                </a>
              </div>
            ) : (
              <button
                onClick={() => navigate('/upload-resume')}
                className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl mt-3.5 transition-all w-full text-center cursor-pointer"
              >
                Upload Now
              </button>
            )}
          </div>

          {/* Card 2: Jobs Applied */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jobs Applied</p>
                <h3 className="text-2xl font-black text-slate-900">{stats.jobsApplied}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 19.4V14.15m16.5 0c0-1.036-.84-1.875-1.875-1.875H19.5m0 0H4.875c-1.036 0-1.875.84-1.875 1.875m16.5 0V9.825c0-1.036-.84-1.875-1.875-1.875H4.875C3.839 7.95 3 8.79 3 9.825v4.325m17.25-6.175V5.625c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125v2.025" />
                </svg>
              </div>
            </div>
           
          </div>

          {/* Card 3: Shortlisted */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted</p>
                <h3 className="text-2xl font-black text-emerald-600">{stats.shortlisted}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
            </div>
            
          </div>

          {/* Card 4: Rejected */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</p>
                <h3 className="text-2xl font-black text-rose-600">{stats.rejected}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-3.5">
              Review AI recommendations below
            </p>
          </div>

        </section>

        {/* 4. Two-Column Dashboard Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: Applications Table & Recommended Jobs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recent Applications Section */}
            <div id="applications-section" className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_18px_-6px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Applications</h2>
                  <p className="text-xs text-slate-500 font-medium">Monitor your applications status and view AI-generated feedback reports.</p>
                </div>
                
                {/* Search box & filter tabs */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none transition-all w-40 sm:w-44"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-600 focus:border-indigo-600 focus:outline-none transition-all"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="In Review">In Review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Company & Position</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Applied Date</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Fit Score</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${app.logoBg}`}>
                                {app.logo}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-800 leading-snug">{app.jobTitle}</h4>
                                <p className="text-xs text-slate-400 font-medium">{app.company}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-slate-500 font-medium hidden sm:table-cell">
                            {app.appliedDate}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col items-center gap-1 justify-center">
                              {app.fitScore != null ? (
                                <>
                                  <span className={`text-xs font-bold ${
                                    app.fitScore >= 90 ? 'text-indigo-600' :
                                    app.fitScore >= 80 ? 'text-blue-600' : 'text-slate-500'
                                  }`}>{app.fitScore}% Match</span>
                                  <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        app.fitScore >= 90 ? 'bg-indigo-600' : 'bg-blue-600'
                                      }`}
                                      style={{ width: `${app.fitScore}%` }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">Pending</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              app.status === 'Shortlisted' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                              app.status === 'In Review' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                              'bg-rose-50 border-rose-100 text-rose-700'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                app.status === 'Shortlisted' ? 'bg-emerald-500' :
                                app.status === 'In Review' ? 'bg-amber-500' :
                                'bg-rose-500'
                              }`} />
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedAppFeedback(app)}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-50 hover:border-indigo-100 transition-all cursor-pointer"
                            >
                              Feedback
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-10 text-center">
                          <div className="flex flex-col items-center gap-3 text-slate-400">
                            <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>
                            <p className="text-sm font-semibold text-slate-400">No applications yet</p>
                            <p className="text-xs text-slate-300 font-medium">Apply to jobs to see your application history here.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Jobs Section */}
            <div id="jobs-section" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">AI Recommended Jobs</h2>
                  <p className="text-xs text-slate-500 font-medium">Premium roles matched with your screening indicators and skills.</p>
                </div>
                <Link
                  to="/all-jobs"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-4 py-2.5 rounded-xl border border-indigo-100 hover:border-indigo-600 transition-all shadow-sm hover:shadow"
                >
                  Explore All Jobs
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>

              {/* AI Recommended Job Cards from backend */}
              {recommendedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {recommendedJobs.map(job => {
                    const scoreColor =
                      job.fitScore >= 85 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                      job.fitScore >= 65 ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
                                           'text-amber-600 bg-amber-50 border-amber-100'
                    const recColor =
                      job.recommendation === 'Highly Recommended' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                      job.recommendation === 'Recommended'        ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                                                                    'bg-amber-50 border-amber-100 text-amber-700'
                    return (
                      <div
                        key={job.id}
                        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between gap-4"
                      >
                        {/* Top row: logo + score badge */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm shrink-0 ${job.logoBg}`}>
                              {job.logo}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 leading-snug tracking-tight">{job.jobTitle}</h4>
                              <p className="text-[11px] text-slate-500 font-semibold">{job.company}</p>
                            </div>
                          </div>
                          {job.fitScore != null && (
                            <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${scoreColor}`}>
                              {job.fitScore}% Match
                            </span>
                          )}
                        </div>

                        {/* Recommendation tier badge + location */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${recColor}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              job.recommendation === 'Highly Recommended' ? 'bg-emerald-500' :
                              job.recommendation === 'Recommended'        ? 'bg-indigo-500' : 'bg-amber-500'
                            }`} />
                            {job.recommendation || 'Matched'}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{job.location}</span>
                          </span>
                        </div>

                        {/* AI reason */}
                        {job.reason && (
                          <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl line-clamp-2">
                            {job.reason}
                          </p>
                        )}

                        {/* Matched skills */}
                        {job.matchedSkills.length > 0 && (
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Matched Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {job.matchedSkills.map((skill, i) => (
                                <span key={i} className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                  ✓ {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing skills */}
                        {job.missingSkills.length > 0 && (
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Skills to Add</p>
                            <div className="flex flex-wrap gap-1.5">
                              {job.missingSkills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                                  + {skill}
                                </span>
                              ))}
                              {job.missingSkills.length > 3 && (
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                                  +{job.missingSkills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Apply CTA */}
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          className="w-full text-center py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 shadow-sm hover:shadow mt-auto"
                        >
                          View & Apply →
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-indigo-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-slate-600">No new recommendations</p>
                  <p className="text-xs text-slate-400 font-medium max-w-xs">You've applied to all current AI-matched jobs. Upload or update your resume to get fresh recommendations.</p>
                  <Link to="/all-jobs" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-1">
                    Browse all jobs →
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 1/3 COLUMN: Resume Insights, Score Radial, Top Skills */}
          <div className="space-y-6">
            {/* Sidebar alert removed for modal popup */}

            {!currentResume ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_18px_-6px_rgba(0,0,0,0.04)] space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Resume Status</h3>
                  <p className="text-xs text-slate-500 font-medium">{resumeState?.message || 'No resume found.'}</p>
                </div>
                <p className="text-sm text-slate-600">
                  We couldn't locate your resume. Upload one to activate AI recommendations and apply to jobs.
                </p>
                <button
                  onClick={() => navigate('/upload-resume')}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition"
                >
                  Upload Resume
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_18px_-6px_rgba(0,0,0,0.04)] space-y-5">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">AI Extracted Skills</h3>
                    <p className="text-xs text-slate-500 font-medium">Technologies scanned from your curriculum vitae.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentResume?.aiAnalysis?.skills?.map((skill, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                               {/* AI Recommendations */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_18px_-6px_rgba(0,0,0,0.04)] space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">AI Resume Summary</h3>
                    <p className="text-xs text-slate-500 font-medium mb-3">Extracted professional summary.</p>
                    <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl leading-relaxed">
                      {currentResume?.aiAnalysis?.summary || "No summary parsed."}
                    </p>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-slate-800 tracking-tight mb-2">AI Optimization Tips</h3>
                    <ul className="space-y-3">
                      {(displayResume.aiRecommendations || [
                        'Highlight React/frontend specialized roles to maximize your 95%+ match scores.',
                        'Make sure key certifications are listed to bypass automated screen filters.',
                        'Keep details of your latest experience up-to-date for direct HR routing.'
                      ]).map((rec, idx) => (
                        <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-normal">
                          <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 00-3-3H9.75M12 12.75v-3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>   </div>
              </>
            )}
          </div>

        </div>

      </main>

      {/* 5. Simulating File Uploading Overlay Loader */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-5 animate-fadeIn">
            <div className="flex justify-center">
              {/* Spinner */}
              <div className="h-10 w-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">AI Resume Screening Active</h4>
              <p className="text-xs text-slate-400 font-semibold leading-normal">HireVibe is parsing your skills and comparing fit data...</p>
            </div>
            
            {/* Progress bar inside loader */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>PROGRESS</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. View Resume Details Modal */}
      {isViewingResume && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] md:h-[80vh] flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{resumeData.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Parsed Resume Details & AI Screening Summary</p>
              </div>
              <button
                onClick={() => setIsViewingResume(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
                       {/* Content split in 2 columns */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: CV Preview Mock */}
              <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-sm space-y-6 text-xs text-slate-600 leading-relaxed font-sans font-medium">
                {/* Header */}
                <div className="text-center pb-5 border-b border-slate-100 space-y-1.5">
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">
                    {currentResume?.aiAnalysis?.candidateName || user?.username || 'Rahul Sharma'}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Parsed Curriculum Vitae
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {currentResume?.aiAnalysis?.email || user?.email || 'N/A'} | {currentResume?.aiAnalysis?.phone || 'N/A'} | {currentResume?.aiAnalysis?.location || 'N/A'}
                  </p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Professional Experience</h4>
                  <div className="space-y-3">
                    {currentResume?.aiAnalysis?.experience?.length > 0 ? (
                      currentResume.aiAnalysis.experience.map((exp, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between font-bold text-slate-850">
                            <span>{exp.jobTitle || 'Role'} {exp.company ? `@ ${exp.company}` : ''}</span>
                            <span className="text-slate-400 font-semibold text-[10px]">{exp.duration || ''}</span>
                          </div>
                          <p className="text-[11px] text-slate-505 mt-1 leading-relaxed">
                            {exp.description || 'No description parsed.'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div>
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>Frontend Engineer @ Vercel</span>
                          <span className="text-slate-400 font-semibold text-[10px]">2024 - Present</span>
                        </div>
                        <p className="text-[11px] text-slate-505 mt-1 leading-relaxed">
                          Optimized dashboard application load times by 40% utilizing Edge middleware caching. Built reusable React components using TailwindCSS and styled primitives.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Technical Competencies</h4>
                  <p className="text-[11px] text-slate-700 leading-normal font-bold">
                    {currentResume?.aiAnalysis?.skills?.join(', ') || 'React.js, Node.js, HTML5/CSS3, TypeScript, JavaScript (ES6+), Redux Toolkit, PostgreSQL, TailwindCSS.'}
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Education</h4>
                  {currentResume?.aiAnalysis?.education?.length > 0 ? (
                    currentResume.aiAnalysis.education.map((edu, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between font-bold text-slate-850">
                          <span>{edu.degree || 'Degree'}</span>
                          <span className="text-slate-400 font-semibold text-[10px]">{edu.year || ''}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 font-semibold">{edu.institution || ''}</p>
                      </div>
                    ))
                  ) : (
                    <div>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>B.Tech in Computer Science & Engineering</span>
                        <span className="text-slate-400 font-semibold text-[10px]">Graduated 2022</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400">VTU University, Bangalore | 8.9 CGPA</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Analysis details */}
              <div className="space-y-6">
                
                {/* Score and status overview */}
                <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">AI Assessment Status</p>
                    <h4 className="text-base font-black text-slate-900">Highly Recommended</h4>
                    <p className="text-xs text-slate-505 font-medium">Matching score is calculated against active vacancy benchmarks.</p>
                  </div>
                  <div className="h-16 w-16 bg-white rounded-xl shadow border border-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-indigo-600">{currentResume?.score || resumeData.score}%</span>
                  </div>
                </div>

                {/* Matching factors */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-900">Core Matching Factors</h4>
                  
                  <div className="space-y-3">
                    {/* Strengths indicator 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">Frontend Core Stack (React/Redux)</span>
                        <span className="text-indigo-600">98% Match</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '98%' }} />
                      </div>
                    </div>

                    {/* Strengths indicator 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">CSS Frameworks (Tailwind)</span>
                        <span className="text-indigo-600">95% Match</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>

                    {/* Strengths indicator 3 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">TypeScript & Node APIs</span>
                        <span className="text-blue-500">86% Match</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '86%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actionable recommendations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">AI Assessment Summary</h4>
                  <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                    {currentResume?.aiAnalysis?.summary || "No summary parsed by AI."}
                  </p>
                </div>

              </div>     </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/20 flex justify-end">
              <button
                onClick={() => setIsViewingResume(false)}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-150 transition-all cursor-pointer"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. View Feedback Modal */}
      {selectedAppFeedback && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${selectedAppFeedback.logoBg}`}>
                  {selectedAppFeedback.logo}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedAppFeedback.company} Feedback</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{selectedAppFeedback.jobTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppFeedback(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Feedback Content */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
                <span className="text-xs text-slate-400 font-medium">AI Match Fit Score</span>
                {selectedAppFeedback.fitScore != null ? (
                  <span className="text-sm font-extrabold text-indigo-600">{selectedAppFeedback.fitScore}% Fit Match</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">Score Pending</span>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Insight Analysis</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                  {selectedAppFeedback.feedback
                    ? `"${selectedAppFeedback.feedback}"`
                    : 'No AI feedback available yet. Our system is still processing your application.'}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Preparation</span>
                <div className="flex gap-2.5 text-xs text-slate-600 leading-normal">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <span>
                    {selectedAppFeedback.status === 'Shortlisted'
                      ? 'Prepare for coding round — focus on component optimization, state structures, and CSS performance metrics.'
                      : selectedAppFeedback.status === 'In Review'
                      ? 'Application is under review. Keep your profile up-to-date and check your email for next steps.'
                      : 'Review the job requirements and consider strengthening areas highlighted in the AI feedback for future applications.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/20 flex justify-end">
              <button
                onClick={() => setSelectedAppFeedback(null)}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-150 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Resume Upload Prompt Modal */}
      {resumeUploadPrompt && !currentResume && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-5 animate-fadeIn">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-slate-900">Resume Upload Required</h4>
              <p className="text-xs text-slate-500 leading-normal">
                You must upload a resume before you can apply to any job. AI screening and compatibility matching require a parsed profile.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setResumeUploadPrompt(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-650 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResumeUploadPrompt(false);
                  navigate('/upload-resume');
                }}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CandidateDash