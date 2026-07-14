import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useJobs } from '../../jobs/hooks/useJobs'
import { useAuth } from '../hooks/useAuth'

const getCompanyColors = (name = 'C') => {
  const logo = name.slice(0, 2).toUpperCase()
  const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0)
  const palette = [
    { bg: '#ede9fe', text: '#6d28d9' },
    { bg: '#dbeafe', text: '#2563eb' },
    { bg: '#d1fae5', text: '#059669' },
    { bg: '#fee2e2', text: '#dc2626' },
    { bg: '#fef3c7', text: '#d97706' },
    { bg: '#cffafe', text: '#0891b2' },
    { bg: '#fce7f3', text: '#be185d' },
  ]
  const { bg, text } = palette[hash % palette.length]
  return { logo, bg, text }
}

export default function HrDash() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { user } = useSelector(s => s.auth)
  const { getHrJobs, createHrJob, getHrApplications, deleteHrJob } = useJobs()

  const hrJobs = useSelector(s => s.job.hrJobs) || []
  const rawApplications = useSelector(s => s.job.application) || []

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [toasts, setToasts] = useState([])
  const [newJobForm, setNewJobForm] = useState({
    title: '', company: '', location: '', salary: '', experience: '', skills: '', description: ''
  })

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000)
  }

  useEffect(() => {
    getHrJobs()
    getHrApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Normalise applications
  const applications = useMemo(() => {
    if (!Array.isArray(rawApplications)) return []
    return rawApplications.map(app => {
      const jobObj = app.job || {}
      const candidateObj = app.candidate || app.user || {}
      return {
        id: app._id || Math.random().toString(),
        candidateName: candidateObj.name || candidateObj.username || 'Candidate',
        candidateEmail: candidateObj.email || '—',
        jobTitle: jobObj.title || app.jobTitle || 'Position',
        company: jobObj.company || app.company || '—',
        status: app.status || 'applied',
        appliedDate: app.createdAt
          ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Just now',
      }
    })
  }, [rawApplications])

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const q = searchTerm.toLowerCase()
      const matchSearch = app.candidateName.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q)
      const s = app.status.toLowerCase()
      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Shortlisted' && s === 'shortlisted') ||
        (statusFilter === 'Applied' && s === 'applied') ||
        (statusFilter === 'Rejected' && s === 'rejected') 
      return matchSearch && matchStatus
    })
  }, [applications, searchTerm, statusFilter])

  const stats = useMemo(() => ({
    totalJobs: hrJobs.length,
    totalApps: applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }), [hrJobs, applications])

  const handleLogout = async () => {
    await auth.logoutUser()
    navigate('/login')
  }

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return
    try {
      await deleteHrJob(job._id)
      await getHrJobs()        // refresh list
      await getHrApplications() // refresh app counts
      addToast(`Job "${job.title}" deleted.`)
    } catch {
      addToast('Failed to delete job. Please try again.', 'error')
    }
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    if (!newJobForm.title || !newJobForm.company) {
      addToast('Please fill out Title and Company.', 'warning')
      return
    }
    setCreateLoading(true)
    try {
      await createHrJob({
        title: newJobForm.title,
        company: newJobForm.company,
        location: newJobForm.location || 'Remote',
        salary: newJobForm.salary,
        experience: newJobForm.experience,
        requiredSkills: newJobForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        description: newJobForm.description,
      })
      await getHrJobs()  // refresh HR jobs from backend
      setIsCreateJobOpen(false)
      setNewJobForm({ title: '', company: '', location: '', salary: '', experience: '', skills: '', description: '' })
      addToast(`Job "${newJobForm.title}" created successfully!`)
    } catch {
      addToast('Failed to create job. Please try again.', 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const STATUS_CHIP = {
    shortlisted: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    rejected: 'bg-rose-50 border-rose-100 text-rose-700',
    applied: 'bg-blue-50 border-blue-100 text-blue-700',
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>

      {/* Toast */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map(t => (
          <div key={t.id} className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 bg-white ${t.type === 'success' ? 'border-emerald-100 text-emerald-800' : t.type === 'error' ? 'border-rose-100 text-rose-800' : 'border-amber-100 text-amber-800'}`}>
            <div className="text-sm font-semibold flex-1 leading-snug">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106" />
                </svg>
              </div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">HireVibe AI</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-xl">HR Dashboard</span>
              <a href="#jobs-section" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">My Jobs</a>
              <a href="#applications-section" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Applications</a>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                  {user?.username ? user.username.slice(0, 2).toUpperCase() : 'HR'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user?.username || 'HR Recruiter'}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">Recruiter Console</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-100 bg-white hover:bg-red-50 px-3 py-2 rounded-xl cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 md:p-8 overflow-hidden mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl" />
          <div className="relative z-10 space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {user?.username || 'Hiring Manager'} 👋
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base">
              Manage jobs and track candidates with AI-powered insights.
            </p>
          </div>
          <div className="relative z-10">
            <button onClick={() => setIsCreateJobOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-md shadow-blue-100 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create New Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Jobs" value={stats.totalJobs} icon="💼" color="blue" sub="Active vacancies" />
          <StatCard label="Total Applications" value={stats.totalApps} icon="👥" color="indigo" sub="Candidates match-rated" />
          <StatCard label="Shortlisted" value={stats.shortlisted} icon="✅" color="emerald" sub="Ready for round 2" valueClass="text-emerald-600" />
          <StatCard label="Rejected" value={stats.rejected} icon="❌" color="rose" sub="Screened out" valueClass="text-rose-600" />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Applications Table */}
          <div className="lg:col-span-2" id="applications-section">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Applications</h2>
                  <p className="text-xs text-slate-500 font-medium">All candidate applications across your jobs.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input type="text" placeholder="Search candidates..."
                      value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition-all w-40 sm:w-44" />
                  </div>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-600 focus:border-blue-600 focus:outline-none transition-all">
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Job Applied</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.length > 0 ? filteredApplications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
                              {(app.candidateName || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-snug">{app.candidateName}</p>
                              <p className="text-xs text-slate-400 font-medium">{app.candidateEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-bold text-slate-700">{app.jobTitle}</p>
                          <p className="text-xs text-slate-400">{app.company}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_CHIP[app.status] || STATUS_CHIP.applied}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-medium">{app.appliedDate}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-slate-400 font-medium text-sm">
                          <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          No applications match this criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: My Jobs */}
          <div className="space-y-4" id="jobs-section">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">My Jobs</h3>
                  <p className="text-xs text-slate-500 font-medium">Jobs you have posted</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {hrJobs.length} Posted
                </span>
              </div>

              {hrJobs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm font-medium">No jobs posted yet.</p>
                  <button onClick={() => setIsCreateJobOpen(true)}
                    className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                    + Post your first job
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto space-y-1 pr-1">
                  {hrJobs.map(job => {
                    const cc = getCompanyColors(job.company)
                    const appCount = rawApplications.filter(app => {
                      const appJobId = typeof app.job === 'object' ? app.job?._id : app.job;
                      return String(appJobId) === String(job._id);
                    }).length;
                    return (
                      <div key={job._id} className="pt-4 pb-2 first:pt-0 group">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0"
                            style={{ backgroundColor: cc.bg, color: cc.text }}>
                            {cc.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                              {job.company} · {job.location}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {appCount} Applicant{appCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteJob(job)}
                            title="Delete job"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2.5 flex gap-2">
                          <button
                            onClick={() => navigate(`/hr/jobs/${job._id}/applicants`)}
                            className="flex-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 px-3 py-2 rounded-xl transition-all cursor-pointer text-center">
                            View Applicants →
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Create Job Modal */}
      {isCreateJobOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Create New Job</h3>
                <p className="text-xs text-slate-500 font-medium">Post a new vacancy for AI-powered screening.</p>
              </div>
              <button onClick={() => setIsCreateJobOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <FormField label="Job Title *" placeholder="e.g. Senior React Developer"
                  value={newJobForm.title} onChange={v => setNewJobForm(p => ({ ...p, title: v }))} required />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Company *" placeholder="e.g. Innovate Labs"
                    value={newJobForm.company} onChange={v => setNewJobForm(p => ({ ...p, company: v }))} required />
                  <FormField label="Location" placeholder="e.g. Bangalore"
                    value={newJobForm.location} onChange={v => setNewJobForm(p => ({ ...p, location: v }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Salary Range" placeholder="e.g. ₹12-18 LPA"
                    value={newJobForm.salary} onChange={v => setNewJobForm(p => ({ ...p, salary: v }))} />
                  <FormField label="Experience" placeholder="e.g. 3+ years"
                    value={newJobForm.experience} onChange={v => setNewJobForm(p => ({ ...p, experience: v }))} />
                </div>
                <FormField label="Required Skills (comma-separated)" placeholder="React, Node.js, MongoDB"
                  value={newJobForm.skills} onChange={v => setNewJobForm(p => ({ ...p, skills: v }))} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                  <textarea rows="3" placeholder="Describe responsibilities..."
                    value={newJobForm.description}
                    onChange={e => setNewJobForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none resize-none" />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateJobOpen(false)}
                  className="rounded-xl border border-slate-200 hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={createLoading}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all cursor-pointer min-w-[100px]">
                  {createLoading ? 'Creating...' : 'Submit Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

function StatCard({ label, value, icon, sub, valueClass = 'text-slate-900' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <h3 className={`text-2xl font-black ${valueClass}`}>{value}</h3>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-[10px] text-slate-400 font-medium mt-3">{sub}</p>
    </div>
  )
}

function FormField({ label, placeholder, value, onChange, required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input type="text" required={required} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:border-blue-600 focus:outline-none" />
    </div>
  )
}