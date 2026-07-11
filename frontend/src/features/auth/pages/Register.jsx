import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Register = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
const auth=useAuth()
useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      if (user.role === "candidate") {
        navigate("/candidate/dashboard", { replace: true });
      } else if (user.role === "hr") {
        navigate("/hr/dashboard", { replace: true });
      }
    }
  }, [navigate]);
const isLoading=useSelector((state)=>state.auth.loading)
  const handleRegisterSubmit = async(e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!fullName || !email || !password || !confirmPassword || !role) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }
    const register=await auth.registerUser({
      username:fullName,
      email:email,
      password:password,
      role:role
    })
    if(role==="candidate"){
      navigate("/candidate/dash")
    }
    else{
      navigate("/hr/dash")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row text-slate-800 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* LEFT SIDE: Brand presentation and AI Hiring Illustration (Visible on MD+) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-50/60 p-12 flex-col justify-between border-r border-slate-100 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-blue-100/20 to-purple-100/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-indigo-100/30 to-purple-100/20 blur-3xl" />

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 z-10 self-start cursor-pointer hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">HireVibe AI</span>
        </Link>

        {/* Central Graphic & Welcome Heading */}
        <div className="my-auto space-y-10 z-10 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Join the Future of <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-Powered Hiring</span>
            </h1>
            <p className="text-slate-500 font-medium text-base leading-relaxed">
              Create an account to search for top jobs, get analyzed by next-gen AI screening models, and stand out in the candidate pipeline.
            </p>
          </div>

          {/* Premium AI Hiring Illustration Mockup */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-xl shadow-slate-150/40 relative">
            <div className="space-y-4">
              {/* Header inside mock */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Analysis Pipeline</span>
                <span className="text-[10px] text-slate-400 font-bold">Smart parsing engine</span>
              </div>

              {/* Step indicator visualizer inside illustration */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
                  <div className="font-extrabold text-[12px] mb-0.5">1</div>
                  Upload
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                  <div className="font-extrabold text-[12px] mb-0.5">2</div>
                  AI Extract
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                  <div className="font-extrabold text-[12px] mb-0.5">3</div>
                  Match Report
                </div>
              </div>

              {/* Skills breakdown mockup */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semantic Profile Scoring</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-medium">React Arch</span>
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-medium">Node.js API</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-medium">SQL &amp; NoSQL</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-medium">Cloud Deploy</span>
                </div>
              </div>

              {/* Recruiter feedback indicator */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Database Searchable Index</span>
                <span className="text-indigo-600 font-bold">Instant Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links on left */}
        <div className="flex items-center justify-between text-xs text-slate-400 z-10">
          <span>&copy; {new Date().getFullYear()} HireVibe AI</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms</a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Register Card Form Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative overflow-y-auto">
        {/* Subtle decorative glow for mobile viewports */}
        <div className="absolute top-10 right-10 -z-10 h-[200px] w-[200px] rounded-full bg-indigo-50/50 blur-2xl md:hidden" />
        
        <div className="w-full max-w-md space-y-8 bg-white md:bg-transparent p-6 sm:p-8 md:p-0 rounded-3xl border border-slate-100 md:border-none shadow-2xl shadow-slate-100 md:shadow-none">
          
          {/* Mobile view Logo & Title */}
          <div className="md:hidden flex flex-col items-center text-center space-y-4 mb-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-4.5 h-4.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18" />
                </svg>
              </div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">HireVibe AI</span>
            </Link>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Welcome to the Future</h2>
              <p className="text-sm text-slate-500 font-medium">Join the Future of AI-Powered Hiring</p>
            </div>
          </div>

          {/* Desktop Heading */}
          <div className="hidden md:block space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-955 tracking-tight">
              Create your account
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Enter your details to register as a recruiter or candidate.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegisterSubmit}>
            
            {/* Error Message banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4.5 h-4.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/40 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/40 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/40 focus:outline-none transition-all"
                  />
                  {/* Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 0 3.15 3.15m-5.665-1.921L14.73 10.73m-3.46 3.46-1.577 1.577M10.025 10.025a3.5 3.5 0 1 1 4.95 4.95l-4.95-4.95Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/40 focus:outline-none transition-all"
                  />
                  {/* Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 0 3.15 3.15m-5.665-1.921L14.73 10.73m-3.46 3.46-1.577 1.577M10.025 10.025a3.5 3.5 0 1 1 4.95 4.95l-4.95-4.95Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="space-y-1.5">
                <label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.97 5.97 0 0 0-.75-2.906m-.75 2.906a5.97 5.97 0 0 1-.75-2.906m0 0a5.97 5.97 0 0 1-.75-2.906m0 0a5.97 5.97 0 0 0-.75-2.906m0 0a5.97 5.97 0 0 0-.75-2.906m0 0a5.97 5.97 0 0 1-.75-2.906m0 0A5.97 5.97 0 0 1 12 12m0 0a5.97 5.97 0 0 1-.75-2.906m0 0A5.97 5.97 0 0 0 12 6m0 0a5.97 5.97 0 0 0-.75-2.906m0 0a5.97 5.97 0 0 1-.75-2.906m0 0A5.97 5.97 0 0 1 12 0" />
                    </svg>
                  </div>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/40 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="candidate">Candidate</option>
                    <option value="hr">HR / Recruiter</option>
                  </select>
                  {/* Custom Chevron Icon */}
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </button>

          </form>

          {/* Footer Login prompt */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
              Login
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Register