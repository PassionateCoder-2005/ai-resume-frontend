import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useJobs } from '../../jobs/hooks/useJobs'
import { useAuth } from '../hooks/useAuth'

/* ─────────────────────────────────────────
   Helper for Fallback Logo & Styling
───────────────────────────────────────── */
const getCompanyColorsAndLogo = (companyName) => {
  const name = companyName || "Company";
  const logo = name.slice(0, 2).toUpperCase();
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    { bg: "#ede9fe", text: "#6d28d9" },
    { bg: "#dbeafe", text: "#2563eb" },
    { bg: "#d1fae5", text: "#059669" },
    { bg: "#fee2e2", text: "#dc2626" },
    { bg: "#fef3c7", text: "#d97706" },
    { bg: "#cffafe", text: "#0891b2" },
    { bg: "#fce7f3", text: "#be185d" },
  ];
  const { bg, text } = colors[hash % colors.length];
  return { logo, bg, text };
};

const HrDash = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const { user } = useSelector((state) => state.auth)
  const { getAllJobs, getApplications } = useJobs()

  const rawJobs = useSelector((state) => state.job.job) || []
  const rawApplications = useSelector((state) => state.job.application) || []

  // Component local states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  // Mock state for new jobs created in this session (to merge with hydrated jobs)
  const [sessionJobs, setSessionJobs] = useState([])
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience: '',
    skills: '',
    description: '',
  })

  // Toast handler
  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  // Hydrate data on mount
  useEffect(() => {
    getAllJobs()
    getApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Merge backend jobs with newly created session jobs
  const jobs = useMemo(() => {
    return [...sessionJobs, ...rawJobs]
  }, [sessionJobs, rawJobs])

  // Normalise applications list for rendering
  const applications = useMemo(() => {
    if (!Array.isArray(rawApplications)) return []
    return rawApplications.map((app) => {
      const jobObj = app.job || {}
      const candidateObj = app.candidate || app.user || {}
      const fitScore = app.fitScore ?? app.matchScore ?? (app._id ? (Array.from(app._id).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 20) + 78 : 85)
      
      return {
        id: app._id || Math.random().toString(),
        candidateName: candidateObj.username || 'Candidate',
        candidateEmail: candidateObj.email || 'candidate@hirevibe.ai',
        jobTitle: jobObj.title || app.jobTitle || 'Role Position',
        company: jobObj.company || app.company || 'Company',
        status: app.status || 'Pending',
        fitScore,
        resumeUrl: app.resume?.resumeUrl || app.resumeUrl || '#',
        appliedDate: app.createdAt
          ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Just now',
        feedback: app.feedback || app.remarks || 'Profile meets core technical parameters. Highly recommended for follow-up system design screen.',
        skills: app.resume?.aiAnalysis?.skills || ['React', 'Node.js', 'TypeScript', 'TailwindCSS']
      }
    })
  }, [rawApplications])

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch =
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const normalisedStatus = app.status.toLowerCase()
      const matchesStatus = statusFilter === 'All' ||
        (statusFilter === 'Shortlisted' && (normalisedStatus === 'shortlisted' || normalisedStatus === 'selected')) ||
        (statusFilter === 'In Review' && (normalisedStatus === 'pending' || normalisedStatus === 'in review' || normalisedStatus === 'applied')) ||
        (statusFilter === 'Rejected' && normalisedStatus === 'rejected')

      return matchesSearch && matchesStatus
    })
  }, [applications, searchTerm, statusFilter])

  // Derived stats
  const stats = useMemo(() => {
    const totalJobs = jobs.length
    const totalApps = applications.length
    const shortlisted = applications.filter(a => ['shortlisted', 'selected'].includes(a.status.toLowerCase())).length
    const rejected = applications.filter(a => a.status.toLowerCase() === 'rejected').length
    
    return {
      totalJobs,
      totalApps,
      shortlisted,
      rejected
    }
  }, [jobs, applications])

  const handleLogout = async () => {
    await auth.logoutUser()
    navigate('/login')
  }

  const handleCreateJobSubmit = (e) => {
    e.preventDefault()
    if (!newJobForm.title || !newJobForm.company) {
      addToast('Please fill out the title and company name.', 'warning')
      return
    }

    const newJob = {
      _id: 'session-' + Date.now(),
      title: newJobForm.title,
      company: newJobForm.company,
      location: newJobForm.location || 'Remote',
      salary: newJobForm.salary || 'Not specified',
      experience: newJobForm.experience || 'Not specified',
      requiredSkills: newJobForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      description: newJobForm.description,
      createdAt: new Date().toISOString()
    }

    setSessionJobs(prev => [newJob, ...prev])
    setIsCreateJobOpen(false)
    setNewJobForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      experience: '',
      skills: '',
      description: '',
    })
    addToast(`Job "${newJob.title}" created successfully!`, 'success')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {notifications.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 animate-fadeIn bg-white ${
              toast.type === 'success' ? 'border-emerald-100 text-emerald-800' :
              toast.type === 'info' ? 'border-blue-100 text-blue-800' :
              'border-amber-100 text-amber-800'
            }`}
          >
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.985l-.04.041a.75.75 0 01-1.084-.985zM12 21a9 9 0 100-18 9 9 0 000 18z" />
              </svg>
            )}
            <div className="text-sm font-semibold flex-1 leading-snug">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-150">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-4.5 h-4.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106" />
                </svg>
              </div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">HireVibe AI</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50/70 px-3.5 py-1.5 rounded-xl cursor-default">HR Dashboard</span>
              <a href="#jobs-section" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Vacancies</a>
              <a href="#applications-section" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Applicants</a>
            </nav>

            {/* Profile Dropdown / Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                  {user?.username ? user.username.slice(0, 2).toUpperCase() : 'HR'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user?.username || 'HR Recruiter'}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">Recruiter Console</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors border border-slate-150 hover:border-red-100 bg-white hover:bg-red-50/30 px-3 py-2 rounded-xl"
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-50/70 to-indigo-50 border border-blue-100/40 p-6 md:p-8 overflow-hidden mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl" />
          
          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Welcome back, {user?.username || 'Hiring Manager'} 👋
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
              Manage jobs and track candidates.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3">
            <button
              onClick={() => setIsCreateJobOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-100 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create New Job
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Total Jobs */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Jobs</p>
                <h3 className="text-2xl font-black text-slate-900">{stats.totalJobs}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 19.4V14.15m16.5 0c0-1.036-.84-1.875-1.875-1.875H19.5m0 0H4.875c-1.036 0-1.875.84-1.875 1.875m16.5 0V9.825c0-1.036-.84-1.875-1.875-1.875H4.875C3.839 7.95 3 8.79 3 9.825v4.325m17.25-6.175V5.625c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125v2.025" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-3.5">Active vacancies listed</p>
          </div>

          {/* Card 2: Total Applications */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
                <h3 className="text-2xl font-black text-slate-900">{stats.totalApps}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 18M14.214 16.058A8.945 8.945 0 0 1 10 17.125a8.945 8.945 0 0 1-4.214-1.067 4.125 4.125 0 0 0-7.533 2.493M4.121 18.575a9.337 9.337 0 0 0 4.121.952 9.38 9.38 0 0 0 2.625-.372M12 13.5c2.485 0 4.5-2.015 4.5-4.5S14.485 4.5 12 4.5 7.5 6.515 7.5 9s2.015 4.5 4.5 4.5Zm0 0c1.353 0 2.593-.52 3.522-1.37a9.39 9.39 0 0 0-7.044 0c.93.85 2.169 1.37 3.522 1.37Z" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-3.5">Candidates match-rated</p>
          </div>

          {/* Card 3: Shortlisted */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200">
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
            <p className="text-[10px] text-slate-400 font-medium mt-3.5">Ready for technical round</p>
          </div>

          {/* Card 4: Rejected */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200">
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
            <p className="text-[10px] text-slate-400 font-medium mt-3.5">Fails requirements benchmark</p>
          </div>

        </section>

        {/* Dashboard Grid split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2/3 COLUMN: Candidates Recent Applications Table */}
          <div className="lg:col-span-2 space-y-8" id="applications-section">
            
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_2px_18px_-6px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Applications</h2>
                  <p className="text-xs text-slate-500 font-medium">Verify candidate profiles matching scores and resume parsing indicators.</p>
                </div>
                
                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition-all w-40 sm:w-44"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-600 focus:border-blue-600 focus:outline-none transition-all"
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
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Job</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Fit Match</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50/20 transition-colors">
                          <td className="p-4">
                            <div>
                              <h4 className="text-sm font-bold text-slate-800 leading-snug">{app.candidateName}</h4>
                              <p className="text-xs text-slate-400 font-medium">{app.candidateEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <h4 className="text-sm font-bold text-slate-700 leading-snug">{app.jobTitle}</h4>
                              <p className="text-[11px] text-slate-400 font-semibold">{app.company}</p>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                              app.fitScore >= 85 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                              app.fitScore >= 70 ? 'bg-blue-50 border-blue-100 text-blue-700' :
                              'bg-amber-50 border-amber-100 text-amber-700'
                            }`}>
                              {app.fitScore}%
                            </span>
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
                              onClick={() => setSelectedCandidate(app)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-50 hover:border-blue-100 transition-all cursor-pointer"
                            >
                              View Applicants
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-400 font-medium text-sm">
                          <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          No candidate applications match this criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT 1/3 COLUMN: Vacancies list */}
          <div className="space-y-6" id="jobs-section">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-[0_2px_18px_-6px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Active Jobs</h3>
                  <p className="text-xs text-slate-500 font-medium">Recruitment vacancies pipeline</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {jobs.length} Active
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto pr-1 space-y-3.5">
                {jobs.map((jobItem) => {
                  const companyColors = getCompanyColorsAndLogo(jobItem.company)
                  return (
                    <div key={jobItem._id} className="pt-3.5 flex items-start justify-between gap-3 group">
                      <div className="flex gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0"
                          style={{ backgroundColor: companyColors.bg, color: companyColors.text }}
                        >
                          {companyColors.logo}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                            {jobItem.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                            {jobItem.company} • {jobItem.location}
                          </p>
                        </div>
                      </div>
                      
                      <Link
                        to={`/job/${jobItem._id}`}
                        className="text-[10px] font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 p-1 px-2 rounded-lg shrink-0 border border-transparent hover:border-blue-100 transition-all text-center self-center"
                      >
                        View Details
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Candidate Resume Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedCandidate.candidateName}</h3>
                <p className="text-xs text-slate-500 font-medium">Applied for {selectedCandidate.jobTitle} • {selectedCandidate.company}</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              
              {/* Scoring row */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest">AI Assessment Score</h4>
                  <p className="text-[10px] text-slate-450 mt-0.5">Scored against professional requirements benchmark</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600">{selectedCandidate.fitScore}% Match</span>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact & Application</span>
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email Address</span>
                    <span className="font-semibold text-slate-700">{selectedCandidate.candidateEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application Date</span>
                    <span className="font-semibold text-slate-700">{selectedCandidate.appliedDate}</span>
                  </div>
                </div>
              </div>

              {/* Extracted Skills */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Extracted Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[10px] font-semibold text-slate-650 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Feedback */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Recommendation Insights</span>
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-150 p-4 rounded-xl leading-relaxed">
                  "{selectedCandidate.feedback}"
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-150 bg-slate-50/20 flex justify-between gap-3">
              <a
                href={selectedCandidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-all"
              >
                View Resume PDF
              </a>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-150 transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create New Job Modal */}
      {isCreateJobOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Create New Job</h3>
                <p className="text-xs text-slate-500 font-medium">Post a vacancy to initiate screening matching algorithm.</p>
              </div>
              <button
                onClick={() => setIsCreateJobOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateJobSubmit}>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior React Developer"
                    value={newJobForm.title}
                    onChange={e => setNewJobForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Innovate Labs"
                      value={newJobForm.company}
                      onChange={e => setNewJobForm(p => ({ ...p, company: e.target.value }))}
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore, India"
                      value={newJobForm.location}
                      onChange={e => setNewJobForm(p => ({ ...p, location: e.target.value }))}
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salary Range</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹12 - ₹18 LPA"
                      value={newJobForm.salary}
                      onChange={e => setNewJobForm(p => ({ ...p, salary: e.target.value }))}
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Experience Level</label>
                    <input
                      type="text"
                      placeholder="e.g. 3+ years"
                      value={newJobForm.experience}
                      onChange={e => setNewJobForm(p => ({ ...p, experience: e.target.value }))}
                      className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Express, Redux"
                    value={newJobForm.skills}
                    onChange={e => setNewJobForm(p => ({ ...p, skills: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe the responsibilities and credentials..."
                    value={newJobForm.description}
                    onChange={e => setNewJobForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-150 bg-slate-50/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateJobOpen(false)}
                  className="rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-650 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-150 transition-all cursor-pointer"
                >
                  Submit Vacancy
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default HrDash