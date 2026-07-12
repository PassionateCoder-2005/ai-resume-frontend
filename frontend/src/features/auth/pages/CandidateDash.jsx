import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const CandidateDash = () => {
  const navigate = useNavigate()
  
  // Stored state for current user
  const [user, setUser] = useState(null)
  
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
  
  // Hidden file input ref
  const fileInputRef = useRef(null)

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Error parsing user data", e)
      }
    }
  }, [])
const auth=useAuth()
  // Dynamic statistics state
  const [stats, setStats] = useState({
    resumeName: 'cv_rahul_sharma.pdf',
    uploadDate: 'July 10, 2026',
    jobsApplied: 12,
    shortlisted: 4,
    rejected: 2
  })

  // Recent applications state
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: 'Stripe',
      logo: 'S',
      logoBg: 'bg-indigo-100 text-indigo-700',
      jobTitle: 'Software Engineer II (React)',
      appliedDate: 'July 10, 2026',
      fitScore: 95,
      status: 'Shortlisted',
      feedback: 'Excellent technical alignment. Your background in performance-oriented React interfaces at Vercel perfectly matches Stripe\'s frontend system needs.'
    },
    {
      id: 2,
      company: 'Vercel',
      logo: '▲',
      logoBg: 'bg-black text-white',
      jobTitle: 'Senior Frontend Developer',
      appliedDate: 'July 08, 2026',
      fitScore: 91,
      status: 'In Review',
      feedback: 'Strong CSS optimization skills. Next steps include a system design interview around edge rendering models.'
    },
    {
      id: 3,
      company: 'Linear',
      logo: 'L',
      logoBg: 'bg-slate-900 text-slate-100',
      jobTitle: 'Product Engineer',
      appliedDate: 'July 05, 2026',
      fitScore: 88,
      status: 'In Review',
      feedback: 'Great focus on micro-interactions. Resume highlights custom UI toolkits.'
    },
    {
      id: 4,
      company: 'Meta',
      logo: '∞',
      logoBg: 'bg-blue-100 text-blue-700',
      jobTitle: 'React Native Developer',
      appliedDate: 'June 28, 2026',
      fitScore: 72,
      status: 'Rejected',
      feedback: 'Role requires 4+ years of native iOS/Android development. Your profile is heavily web-focused.'
    }
  ])

  // Recommended jobs state
  const [recommendedJobs, setRecommendedJobs] = useState([
    {
      id: 101,
      company: 'Airbnb',
      logo: 'A',
      logoBg: 'bg-rose-100 text-rose-600',
      jobTitle: 'Frontend Engineer (Design Systems)',
      location: 'San Francisco, CA (Remote)',
      salary: '$140k - $170k',
      fitScore: 96,
      applied: false
    },
    {
      id: 102,
      company: 'Clerk',
      logo: 'C',
      logoBg: 'bg-purple-100 text-purple-700',
      jobTitle: 'Developer Advocate',
      location: 'Boston, MA (Hybrid)',
      salary: '$130k - $155k',
      fitScore: 93,
      applied: false
    },
    {
      id: 103,
      company: 'Retool',
      logo: 'R',
      logoBg: 'bg-orange-100 text-orange-700',
      jobTitle: 'Full Stack Engineer (React/Node)',
      location: 'San Francisco, CA',
      salary: '$150k - $185k',
      fitScore: 90,
      applied: false
    }
  ])

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

  // Simulating Apply Flow
  const handleApplyJob = (jobId) => {
    const job = recommendedJobs.find(j => j.id === jobId)
    if (!job || job.applied) return

    // Set job state to applied
    setRecommendedJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j))

    // Increment jobs applied statistic
    setStats(prev => ({ ...prev, jobsApplied: prev.jobsApplied + 1 }))

    // Add to applications table
    const newApp = {
      id: Date.now(),
      company: job.company,
      logo: job.logo,
      logoBg: job.logoBg,
      jobTitle: job.jobTitle,
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      fitScore: job.fitScore,
      status: 'In Review',
      feedback: `Successfully applied to ${job.jobTitle} position at ${job.company}. AI screening check queued. In review workflow has started.`
    }

    setApplications(prev => [newApp, ...prev])
    addToast(`Applied to ${job.jobTitle} at ${job.company} successfully!`, 'success')
  }

  // Search & Filtered Applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
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
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
              Track your applications and AI resume insights.
            </p>
          </div>

        </div>

        {/* 3. Statistics Cards Grid (4) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
         

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
            <p className="text-[10px] text-slate-400 font-medium mt-3.5">
              Avg. score match: <strong className="text-slate-700 font-bold">93% Fit</strong>
            </p>
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
                        <td colSpan="5" className="p-8 text-center text-slate-400 font-medium text-sm">
                          No applications found matching filters.
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

              {/* 3 Premium Job Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recommendedJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Logo and Match Badge */}
                      <div className="flex justify-between items-center mb-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${job.logoBg}`}>
                          {job.logo}
                        </div>
                        <span className="inline-flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                          {job.fitScore}% Fit Match
                        </span>
                      </div>

                      {/* Job Info */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 leading-snug tracking-tight hover:text-indigo-600 cursor-pointer">{job.jobTitle}</h4>
                        <p className="text-xs text-slate-600 font-semibold">{job.company}</p>
                      </div>

                      {/* Location & Details */}
                      <div className="mt-4 space-y-1.5 text-slate-400 font-medium text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => handleApplyJob(job.id)}
                      disabled={job.applied}
                      className={`w-full text-center py-2 px-3 text-xs font-bold rounded-xl mt-5 transition-all cursor-pointer ${
                        job.applied 
                          ? 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed'
                          : 'bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 shadow-sm hover:shadow'
                      }`}
                    >
                      {job.applied ? 'Applied ✓' : 'Apply Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 1/3 COLUMN: Resume Insights, Score Radial, Top Skills */}
          <div className="space-y-6">
            
            {/* Resume Details Card */}
            

            {/* Extracted Skills */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_18px_-6px_rgba(0,0,0,0.04)] space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">AI Extracted Skills</h3>
                <p className="text-xs text-slate-500 font-medium">Technologies scanned from your curriculum vitae.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {resumeData.extractedSkills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_18px_-6px_rgba(0,0,0,0.04)] space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">AI Recommendations</h3>
                <p className="text-xs text-slate-500 font-medium">Actionable insights to boost match scores.</p>
              </div>

              <ul className="space-y-3">
                {resumeData.aiRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-normal">
                    <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 00-3-3H9.75M12 12.75v-3.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

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
            </div>

            {/* Content split in 2 columns */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: CV Preview Mock */}
              <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-sm space-y-6 text-xs text-slate-600 leading-relaxed font-sans">
                {/* Header */}
                <div className="text-center pb-5 border-b border-slate-100 space-y-1.5">
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">{user?.username || 'Rahul Sharma'}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Software Engineer (Frontend Specialist)</p>
                  <p className="text-[10px] text-slate-400 font-semibold">rahul.sharma@example.com | +1 (555) 019-2834 | Bangalore, IN</p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Professional Experience</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Frontend Engineer @ Vercel</span>
                        <span className="text-slate-400 font-semibold text-[10px]">2024 - Present</span>
                      </div>
                      <p className="text-[11px] text-slate-505 mt-1 font-medium">
                        Optimized dashboard application load times by 40% utilizing Edge middleware caching. Built reusable React components using TailwindCSS and styled primitives.
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Software Engineer @ Stripe</span>
                        <span className="text-slate-400 font-semibold text-[10px]">2022 - 2024</span>
                      </div>
                      <p className="text-[11px] text-slate-505 mt-1 font-medium">
                        Maintained merchant checkout experience widgets in React. Wrote secure billing integration endpoints using Node.js and TypeScript.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Technical Competencies</h4>
                  <p className="text-[11px] text-slate-700 leading-normal font-semibold">
                    React.js, Next.js, HTML5/CSS3, TypeScript, JavaScript (ES6+), Node.js, Redux Toolkit, PostgreSQL, TailwindCSS, AWS, Docker.
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Education</h4>
                  <div>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>B.Tech in Computer Science & Engineering</span>
                      <span className="text-slate-400 font-semibold text-[10px]">Graduated 2022</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 font-medium">VTU University, Bangalore | 8.9 CGPA</p>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Analysis details */}
              <div className="space-y-6">
                
                {/* Score and status overview */}
                <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">AI Assessment Status</p>
                    <h4 className="text-base font-black text-slate-900">Highly Recommended</h4>
                    <p className="text-xs text-slate-505 font-medium">Matching score is higher than 92% of local applicants.</p>
                  </div>
                  <div className="h-16 w-16 bg-white rounded-xl shadow border border-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-indigo-600">{resumeData.score}%</span>
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
                  <h4 className="text-xs font-bold text-slate-900">Actionable Suggestions</h4>
                  <ul className="space-y-2.5">
                    {resumeData.aiRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-600 leading-normal">
                        <span className="text-indigo-600 shrink-0 select-none">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

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
                <span className="text-sm font-extrabold text-indigo-600">{selectedAppFeedback.fitScore}% Fit Match</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Insight Analysis</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                  "{selectedAppFeedback.feedback}"
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
                      ? 'Prepare for coding round focus on component optimization, state structures, and CSS performance metrics.'
                      : selectedAppFeedback.status === 'In Review'
                      ? 'Check core skills matched and review general Edge middleware capabilities.'
                      : 'Review requirements match specs to ensure native core experience indicators are highlighted in your next CV revisions.'}
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

    </div>
  )
}

export default CandidateDash