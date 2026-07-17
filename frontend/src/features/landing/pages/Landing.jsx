import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from 'react-redux'
const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mockupTab, setMockupTab] = useState('recruiter') // 'recruiter' | 'candidate'
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth)

const goToDashboard = () => {
  if (!user) {
    navigate("/login");
    return;
  }

  if (user.role === "candidate") {
    navigate("/candidate/dashboard");
  } else {
    navigate("/hr/dashboard");
  }
};
  // Standard smooth scroll helper
  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* 1. Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106m3.02 3.02 1.318 3.685a.75.75 0 0 1-1.026.965l-3.52-1.92a2.25 2.25 0 0 1-1.112-1.859V9.574c0-.573-.207-1.129-.582-1.564L8.74 3.73a.75.75 0 0 0-1.196.963l1.852 2.3a2.25 2.25 0 0 1 .494 1.414v1.895a.75.75 0 0 0 1.5 0V8.408c0-.097-.02-.19-.059-.276L9.67 4.74M9.813 15.904a8.98 8.98 0 0 1-2.302-6.33c0-2.303.867-4.404 2.302-6L14.907 6m-5.094 9.904L9.813 15.9m0 0L8.25 15.375" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">HireVibe AI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('hero')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Home</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">How It Works</button>
              <button onClick={() => scrollToSection('why-choose-us')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer">Why Choose Us</button>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
  {!user ? (
    <>
      <Link
        to="/login"
        className="text-sm font-semibold text-slate-700 hover:text-indigo-600"
      >
        Login
      </Link>

      <Link
        to="/register"
        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Register
      </Link>
    </>
  ) : (
    <button
      onClick={goToDashboard}
      className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
    >
      Dashboard
    </button>
  )}
</div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-inner">
            {!user ? (
  <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-4">
    <Link
      to="/login"
      className="flex-1 text-center py-2 text-base font-semibold text-slate-700"
    >
      Login
    </Link>

    <Link
      to="/register"
      className="flex-1 text-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-base font-semibold text-white"
    >
      Register
    </Link>
  </div>
) : (
  <div className="border-t border-slate-100 pt-3">
    <button
      onClick={goToDashboard}
      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-white font-semibold"
    >
      Dashboard
    </button>
  </div>
)}
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-white pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        {/* Soft background gradient accents */}
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-100/30 to-purple-100/40 blur-3xl" />
        <div className="absolute top-[30%] left-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-indigo-100/20 to-purple-100/20 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                Next-Gen AI Screening v2.0
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 leading-tight">
                AI Resume Screening &amp; <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Interview Recommendation</span> Platform
              </h1>

              {/* Subtitle */}
              <p className="max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-slate-500 font-normal leading-relaxed">
                Streamline your hiring process with deep AI-powered resume analysis, automated job role matching, and custom generative interview guides tailored to candidate skill gaps.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
  onClick={goToDashboard}
>
                  Get Started Free
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("/all-jobs")}
                  className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 cursor-pointer"
                >
                  Browse Jobs
                </button>
              </div>

              {/* Trust Badge */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
                    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&h=80&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80"
                  ].map((src, index) => (
                    <img key={index} className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src={src} alt="User profile" />
                  ))}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Trusted by <span className="text-slate-800 font-bold">500+</span> recruiter teams and over <span className="text-slate-800 font-bold">10,000+</span> candidates.
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Illustration */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg rounded-3xl border border-slate-150 bg-white p-4 shadow-2xl shadow-slate-200/80">
                {/* Mock Browser Title bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  {/* Interactive Dashboard Tabs */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                    <button
                      onClick={() => setMockupTab('recruiter')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${mockupTab === 'recruiter' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Recruiter View
                    </button>
                    <button
                      onClick={() => setMockupTab('candidate')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${mockupTab === 'candidate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Candidate View
                    </button>
                  </div>
                </div>

                {/* Tab Content 1: Recruiter View */}
                {mockupTab === 'recruiter' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Candidate Quick Stats */}
                    <div className="flex items-center justify-between bg-indigo-50/50 border border-indigo-100/50 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          SJ
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Sarah Jenkins</h4>
                          <p className="text-xs text-slate-500 font-medium">Senior Software Engineer</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                          98% Match
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Screened 2 mins ago</p>
                      </div>
                    </div>

                    {/* AI Assessment Result */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Screen Summary</span>
                      <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-xs text-slate-600 space-y-2 leading-relaxed">
                        <p>
                          ✨ <strong className="text-slate-800">Key Strength:</strong> 6+ years building distributed React/Node infrastructures. Shows deep knowledge in system designs and microservices.
                        </p>
                        <p>
                          ⚠️ <strong className="text-slate-800">Skill Gap:</strong> Minimal documentation on CI/CD orchestration. Recommend testing on Kubernetes and Docker deployments.
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Rating Bars */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Fit Matrix</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>Frontend Arch</span>
                            <span className="text-indigo-600">95%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '95%' }} />
                          </div>
                        </div>
                        <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>System Design</span>
                            <span className="text-indigo-600">90%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '90%' }} />
                          </div>
                        </div>
                        <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>Backend Systems</span>
                            <span className="text-indigo-600">88%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '88%' }} />
                          </div>
                        </div>
                        <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                            <span>DevOps &amp; Cloud</span>
                            <span className="text-indigo-600">65%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600/60 h-full rounded-full" style={{ width: '65%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Content 2: Candidate View */}
                {mockupTab === 'candidate' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Job Application Match */}
                    <div className="flex items-center justify-between bg-purple-50/50 border border-purple-100/50 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.1-1.125 1.1H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0a9 9 0 0 0-16.5 0m16.5 0a9 9 0 0 0-1.875-5.582m-12.75 5.582a9 9 0 0 1 1.875-5.582m0 0a9 9 0 0 1 12.75 0M9 10.5h.008v.008H9V10.5Zm6 0h.008v.008H15V10.5Z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Lead React Engineer</h4>
                          <p className="text-xs text-slate-500 font-medium">Stellar Technologies Inc.</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-lg bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">
                          Highly Recommended
                        </span>
                      </div>
                    </div>

                    {/* Tailored Interview Prep Questions */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Personalized Questions</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">2 Questions Generated</span>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm text-xs">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[9px] border border-amber-100">Scenario</span>
                            <span className="text-[10px] text-slate-400 font-medium">Voted 92% relevant</span>
                          </div>
                          <p className="text-slate-600 italic font-medium">
                            "In your last role, how did you handle state synchronization across multiple independent micro-frontends? Describe the trade-offs of your choice."
                          </p>
                        </div>
                        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm text-xs">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px] border border-blue-100">Technical Deep Dive</span>
                            <span className="text-[10px] text-slate-400 font-medium">Voted 88% relevant</span>
                          </div>
                          <p className="text-slate-600 italic font-medium">
                            "How do you approach optimizing long-standing performance bottlenecks in Next.js applications during server-side renders?"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-slate-50/40 relative">
        <div className="absolute top-0 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-blue-50/40 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Platform Features</h2>
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              Powerful Tools to Automate and Optimize Your Recruitment Pipeline
            </p>
            <p className="text-lg text-slate-500 font-normal">
              Designed for scaling HR teams, talent acquisition experts, and aspiring candidates looking to simplify and accelerate matches.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:border-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-800">AI Resume Analysis</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Automatically extract complex skills, deep work history, hidden gaps, and career progressions in seconds with advanced semantic models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:border-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-800">Smart Job Matching</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Connect candidates to optimal job descriptions based on semantic fit and logical adjacent skillsets rather than keyword matching.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:border-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.074-.765 6 6 0 0 0 1.257-3.637C4.684 15.263 4 13.71 4 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-800">AI Interview Questions</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Generate highly specialized technical, situational, and behavioral interview questions mapped precisely to candidate weakness metrics.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:border-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-800">Fast Hiring Process</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Reduce manual filtering workload from weeks to mere minutes. Eliminate unqualified screenings and accelerate final recruitment rounds.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">The Workflow</h2>
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              Simple 4-Step Automated Hiring Pipeline
            </p>
            <p className="text-lg text-slate-500 font-normal">
              How HireVibe AI automatically analyzes inputs, optimizes job paths, and accelerates candidate shortlists.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="mt-20 relative">
            {/* Desktop Connector Line */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-dashed bg-slate-100 z-0">
              <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-full opacity-30" />
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="text-center group">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-md group-hover:shadow-lg group-hover:border-indigo-100 transition-all duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 mb-2">Step 01</span>
                  <h3 className="text-lg font-bold text-slate-800">Upload Resume</h3>
                  <p className="mt-2.5 text-sm text-slate-500 px-4 leading-relaxed">
                    Upload resumes in PDF, DOCX, or text files directly. Recruiter portals support instant bulk file uploads.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-md group-hover:shadow-lg group-hover:border-indigo-100 transition-all duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106m3.02 3.02 1.318 3.685a.75.75 0 0 1-1.026.965l-3.52-1.92a2.25 2.25 0 0 1-1.112-1.859V9.574c0-.573-.207-1.129-.582-1.564L8.74 3.73a.75.75 0 0 0-1.196.963l1.852 2.3A2.25 2.25 0 0 1 9 9.914v1.895a.75.75 0 0 0 1.5 0V8.408c0-.097-.02-.19-.059-.276L9.67 4.74" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 mb-2">Step 02</span>
                  <h3 className="text-lg font-bold text-slate-800">AI Analysis</h3>
                  <p className="mt-2.5 text-sm text-slate-500 px-4 leading-relaxed">
                    AI scans profiles, structures key expertise indicators, finds skill gaps, and matches applicant backgrounds semantic-wise.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-md group-hover:shadow-lg group-hover:border-indigo-100 transition-all duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.1-1.125 1.1H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0a9 9 0 0 0-16.5 0m16.5 0a9 9 0 0 0-1.875-5.582m-12.75 5.582a9 9 0 0 1 1.875-5.582m0 0a9 9 0 0 1 12.75 0M9 10.5h.008v.008H9V10.5Zm6 0h.008v.008H15V10.5Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 mb-2">Step 03</span>
                  <h3 className="text-lg font-bold text-slate-800">Apply Jobs</h3>
                  <p className="mt-2.5 text-sm text-slate-500 px-4 leading-relaxed">
                    Instantly matches candidates to highly-compatible jobs while drafting custom recommendations to bridge matching metrics.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-md group-hover:shadow-lg group-hover:border-indigo-100 transition-all duration-300">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 mb-2">Step 04</span>
                  <h3 className="text-lg font-bold text-slate-800">Get Shortlisted</h3>
                  <p className="mt-2.5 text-sm text-slate-500 px-4 leading-relaxed">
                    Unlock highly optimized review reports, smart match scores, and automated interview guides that speed up hiring.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section id="why-choose-us" className="py-20 sm:py-28 bg-slate-50/30 relative">
        <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-purple-50/30 blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">The Advantage</h2>
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              Why Recruiting Teams &amp; Top Talent Choose Our Platform
            </p>
            <p className="text-lg text-slate-500 font-normal">
              An experience engineered around productivity, match accuracy, and modern UX guidelines.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Card 1: Faster Hiring */}
            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-100/70 transition-all duration-300">
              {/* Decorative accent top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl" />
              
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5.5 h-5.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Faster Hiring</h3>
              </div>
              
              {/* Metric Callout */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-600 tracking-tight">85%</span>
                <span className="text-sm font-semibold text-slate-500">time saved</span>
              </div>
              
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                By completely automating first-line screening analysis, hiring managers spend hours on shortlisted candidates rather than weeks reviewing generic CV formatting.
              </p>

              <ul className="mt-6 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Instant Bulk Resume Parsing
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  One-Click Shortlist Generation
                </li>
              </ul>
            </div>

            {/* Card 2: Better Candidate Matching */}
            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-100/70 transition-all duration-300">
              {/* Decorative accent top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl" />
              
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5.5 h-5.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Better Candidate Matching</h3>
              </div>
              
              {/* Metric Callout */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-600 tracking-tight">98%</span>
                <span className="text-sm font-semibold text-slate-500">accuracy rating</span>
              </div>
              
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                Utilize vector-based neural models that measure the candidate's actual contextual experience matching score against job role indicators, rather than keyword tags.
              </p>

              <ul className="mt-6 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Semantic Skill Mapping
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Unbiased Candidate Profiling
                </li>
              </ul>
            </div>

            {/* Card 3: AI Powered Recommendations */}
            <div className="relative rounded-3xl border border-slate-100 bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl hover:shadow-slate-100/70 transition-all duration-300">
              {/* Decorative accent top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl" />
              
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5.5 h-5.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">AI Recommendations</h3>
              </div>
              
              {/* Metric Callout */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-600 tracking-tight">4.2x</span>
                <span className="text-sm font-semibold text-slate-500">better interview conversion</span>
              </div>
              
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                Generate highly tailored, actionable interview guidelines that highlight exact candidate growth points, questions to ask, and predicted team cultural fit.
              </p>

              <ul className="mt-6 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Custom Interview Guides
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Personalized Candidate Feedback
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section id="cta" className="py-16 sm:py-24 bg-white relative overflow-hidden">
        {/* Ambient details */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-50/50 via-indigo-50/50 to-purple-50/50 blur-3xl" />
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16 lg:px-16 relative overflow-hidden">
            
            {/* Background design elements */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-xl" />

            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-base sm:text-lg text-indigo-100 font-normal leading-relaxed">
                Join thousands of candidates finding optimized matches and recruiters building next-gen hiring pipelines. Get screened in minutes.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                {!user ? (
  <>
    <Link
      to="/register"
      className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-600"
    >
      Register Now
    </Link>

    <Link
      to="/login"
      className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-base font-bold text-white"
    >
      Login
    </Link>
  </>
) : (
  <button
    onClick={goToDashboard}
    className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-600"
  >
    Go to Dashboard
  </button>
)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Professional Footer */}
      <footer className="border-t border-slate-100 bg-slate-50/40 py-12 sm:py-16 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
            
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-indigo-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21L14.907 18m5.19-8.906-3.02 3.02m0 0L14.07 9.106" />
                  </svg>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">HireVibe AI</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Next-generation automated resume assessment, job semantic recommendation, and generative recruiter tools.
              </p>
              <div className="flex items-center gap-3.5 pt-2">
                {/* Social icons */}
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <a key={social} href="#" className="h-8 w-8 rounded-lg bg-white border border-slate-150 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-sm hover:border-slate-200 transition-all">
                    <span className="sr-only">{social}</span>
                    <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                      {social === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                      {social === 'github' && <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><button onClick={() => scrollToSection('features')} className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">How It Works</button></li>
                <li><button onClick={() => scrollToSection('why-choose-us')} className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">Why Choose Us</button></li>
                <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Pricing Options</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Contact Sales</a></li>
                <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Stay Updated</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Subscribe to our newsletter for insights on AI hiring trends and job search strategies.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>

          </div>

          <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} HireVibe AI Inc. All rights reserved.
            </span>
            <div className="flex gap-4 text-xs text-slate-400">
              <a href="#" className="hover:text-indigo-600">Terms of Service</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-indigo-600">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Landing