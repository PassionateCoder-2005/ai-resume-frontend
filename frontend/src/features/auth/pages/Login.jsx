import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const isLoading=useSelector((state) => state.auth.loading);
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
const auth=useAuth()
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    const res=await auth.loginUser({
      email:email,
      password:password
    })
    if(res.user.role==="candidate"){
      navigate("/candidate/dashboard")
    }
    else if(res.user.role==="hr"){
      navigate("/hr/dashboard")
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
              Welcome Back
            </h1>
            <p className="text-slate-500 font-medium text-base leading-relaxed">
              Login to continue your AI-powered hiring journey. Access screening stats, review candidate portfolios, and generate custom interview guides.
            </p>
          </div>

          {/* Premium AI Hiring Illustration Mockup */}
          <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-xl shadow-slate-150/40 relative">
            <div className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.688Z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="space-y-4">
              {/* Header inside mock */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">AI Active Matcher</span>
                <span className="text-[10px] text-slate-400 font-bold">12 Active Positions</span>
              </div>

              {/* Progress visual bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-bold">Senior UX Designer</span>
                  <span className="text-indigo-600 font-bold">94% Fit</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              {/* Candidate Info Card Mock */}
              <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-100 p-2.5 rounded-xl">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  EL
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">Emily Larson</h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate">Matched with 8 core skill indicators</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                  Shortlisted
                </span>
              </div>

              {/* Mini-graphic representing stats */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 font-bold">Screening complete</span>
                </div>
                <span className="text-[10.5px] text-indigo-600 font-bold hover:underline cursor-pointer">View analysis report &rarr;</span>
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

      {/* RIGHT SIDE: Interactive Login Card Form Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
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
              <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-sm text-slate-500 font-medium">Login to continue your AI-powered hiring journey.</p>
            </div>
          </div>

          {/* Desktop Heading */}
          <div className="hidden md:block space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Enter your credentials to manage your AI screening workspace.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            
            {/* Error Message banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
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
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                </div>
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Sign in to Account</span>
              )}
            </button>

          </form>

          {/* Footer Register prompt */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login