import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useResumes } from "../hooks/useResume";

/* ─────────────────────────────────────────
   Mock Default Resume & History Data
───────────────────────────────────────── */
const INITIAL_HISTORY = [
  {
    id: 1,
    name: "cv_rahul_sharma_v2.pdf",
    date: "July 12, 2026",
    size: "1.4 MB",
    score: 92,
    status: "Active"
  },
  {
    id: 2,
    name: "cv_rahul_sharma_v1.pdf",
    date: "June 25, 2026",
    size: "1.2 MB",
    score: 85,
    status: "Archived"
  },
  {
    id: 3,
    name: "rahul_cv_draft.pdf",
    date: "May 10, 2026",
    size: "1.1 MB",
    score: 79,
    status: "Archived"
  }
];

const INITIAL_RESUME_DETAILS = {
  name: "cv_rahul_sharma_v2.pdf",
  uploadDate: "July 12, 2026",
  fileSize: "1.4 MB",
  status: "Screening Complete",
  score: 92,
  summary: "Results-driven Software Engineer with 2+ years of hands-on experience at Vercel building scalable, optimized React and Next.js interfaces. Proven ability to reduce load latencies, design reusable component systems, and work in high-velocity agile developer environments.",
  skills: ["React", "Node.js", "TypeScript", "TailwindCSS", "Redux", "PostgreSQL", "Next.js", "GraphQL"],
  experience: [
    {
      role: "Frontend Engineer",
      company: "Vercel",
      period: "2024 - Present",
      bullets: [
        "Optimized core dashboard load times by 40% using Edge middleware architectures.",
        "Authored custom developer tools and interface components in TypeScript & React."
      ]
    },
    {
      role: "Software Developer Intern",
      company: "Stripe",
      period: "2022 - 2024",
      bullets: [
        "Maintained cross-platform JavaScript checkout widgets.",
        "Integrated Node.js microservices with PostgreSQL backend layers."
      ]
    }
  ],
  education: {
    degree: "B.Tech in Computer Science",
    school: "VTU University, Bangalore",
    graduation: "Class of 2022"
  }
};

/* ─────────────────────────────────────────
   SVG Icons (inline helpers)
───────────────────────────────────────── */
const IconUpload = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconFilePdf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ─────────────────────────────────────────
   Main Component Page
───────────────────────────────────────── */
const UploadResume = () => {
  const fileInputRef = useRef(null);

  // States
   const [uploadHistory, setUploadHistory] = useState(INITIAL_HISTORY);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsingPhase, setParsingPhase] = useState("");
  const [previewResumeModal, setPreviewResumeModal] = useState(false);
  const [notification, setNotification] = useState(null);
 const {uploadResume} =useResumes()
const { resume, loading } = useSelector((state) => state.resume);
  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };
const currentResume = resume?.resume;
  // Drag Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = async (file) => {
  if (file.type !== "application/pdf") {
    triggerToast("Only PDF files are allowed");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    triggerToast("Maximum file size is 5MB");
    return;
  }

  const formData = new FormData();
  formData.append("pdf", file);

  try {
    await uploadResume(formData);
    triggerToast("Resume uploaded successfully");
  } catch (err) {
    triggerToast("Upload Failed");
  }
};

  

  const handleChooseFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const deleteHistoryItem = (id) => {
    setUploadHistory(prev => prev.filter(item => item.id !== id));
    triggerToast("History record deleted");
  };

  return (
    <div className="relative min-h-screen bg-[#f8faff] overflow-x-hidden font-sans pb-24">
      {/* Decorative blobs */}
      <div className="fixed top-[-180px] right-[-180px] w-[560px] h-[560px] rounded-full bg-violet-300/10 blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-blue-300/8 blur-3xl pointer-events-none z-0" />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl p-4 flex items-center gap-3 border border-slate-800 animate-fadeIn">
          <span className="text-violet-400">⚡</span>
          <p className="text-xs font-bold flex-1 leading-snug">{notification}</p>
        </div>
      )}

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-10">
        
        {/* ══════════ Header ══════════ */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-50 to-blue-50 text-violet-700 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-violet-200/60 mb-3">
            <IconStar />
            Automated Resume Screening
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">My Resume</h1>
          <p className="text-slate-500 text-sm mt-1 max-w-xl">
            Upload your latest resume to get AI-powered resume analysis and immediately match with premium jobs.
          </p>
        </header>

        {/* ══════════ Layout Grid ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* LEFT 2/5 COLS: Upload & Current CV Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Large Upload Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.06)] p-6 sm:p-8">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3.5 mb-5">
                Upload Resume
              </h2>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleChooseFileClick}
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 min-h-[200px]
                  ${dragActive 
                    ? "border-violet-500 bg-violet-50/40" 
                    : "border-slate-200 hover:border-violet-400 bg-slate-50/50 hover:bg-slate-50/90"
                  }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                
                <div className="w-12 h-12 rounded-full bg-violet-100/80 text-violet-600 flex items-center justify-center mb-3">
                  <IconUpload />
                </div>
                
                <p className="text-sm font-bold text-slate-700">Drag & Drop PDF Here</p>
                <p className="text-[11px] text-slate-400 mt-1">or click to browse your files</p>

                <button
                  type="button"
                  className="mt-4 bg-white border border-slate-200 text-slate-700 hover:text-violet-600 hover:border-violet-300 font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  Choose PDF File
                </button>
              </div>

              <div className="flex justify-between items-center mt-5 text-[11px] text-slate-400 font-semibold px-1">
                <span>Supported Format: PDF only</span>
                <span>Max Size: 2 MB</span>
              </div>
            </div>

            {/* Current Resume Card */}
            {currentResume && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.06)] p-6">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  Active Resume
                </h2>

                <div className="flex items-start gap-3 bg-slate-50/50 border border-slate-150 p-4 rounded-xl mb-5">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <IconFilePdf />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-slate-800 truncate" title={currentResume.title}>
                      {currentResume.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-medium">
                      {currentResume.fileSize && (
                        <>
                          <span>{currentResume.fileSize}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Uploaded {currentResume.createdAt ? new Date(currentResume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                      currentResume.status?.toLowerCase() === "completed" || currentResume.status?.toLowerCase() === "active" || currentResume.status?.toLowerCase() === "screening complete"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : currentResume.status?.toLowerCase() === "pending"
                        ? "bg-amber-50 border-amber-100 text-amber-700"
                        : "bg-slate-50 border-slate-200 text-slate-650"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        currentResume.status?.toLowerCase() === "completed" || currentResume.status?.toLowerCase() === "active" || currentResume.status?.toLowerCase() === "screening complete"
                          ? "bg-emerald-500"
                          : currentResume.status?.toLowerCase() === "pending"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`} />
                      {currentResume.status || "Unknown"}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 my-1" />

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => currentResume?.resumeUrl && window.open(currentResume.resumeUrl, "_blank", "noopener,noreferrer")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 border border-slate-200 text-slate-700 hover:text-violet-600 hover:border-violet-300 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <IconEye />
                      View Resume
                    </button>
                    <button
                      onClick={handleChooseFileClick}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-350 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <IconRefresh />
                      Replace
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 3/5 COLS: AI Analysis Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.06)] p-6 sm:p-8">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-base font-bold text-slate-900">
                  AI Screening Assessment
                </h2>
                
                {currentResume && (
                  <div className="flex items-center gap-2">
                    {currentResume.score !== undefined && currentResume.score !== null ? (
                      <>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fit Rating:</span>
                        <span className="text-sm font-black text-indigo-600 bg-indigo-50 border border-indigo-100/60 px-2.5 py-0.5 rounded-lg"> 
                          {currentResume.score}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border capitalize ${
                          currentResume.status?.toLowerCase() === "completed" || currentResume.status?.toLowerCase() === "active" || currentResume.status?.toLowerCase() === "screening complete"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : currentResume.status?.toLowerCase() === "pending"
                            ? "bg-amber-50 border-amber-100 text-amber-700"
                            : "bg-slate-50 border-slate-200 text-slate-650"
                        }`}> 
                          {currentResume.status}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Loader overlay during parsing */}
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="h-10 w-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Processing Document</h4>
                    <p className="text-xs text-violet-600 font-semibold animate-pulse mt-1">{parsingPhase}</p>
                  </div>
                  <div className="w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : currentResume ? (
                <div className="space-y-6">
                  {/* Candidate Info Grid */}
                  {(currentResume.aiAnalysis?.candidateName || currentResume.aiAnalysis?.email || currentResume.aiAnalysis?.phone || currentResume.aiAnalysis?.location) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-150 text-xs">
                      {currentResume.aiAnalysis.candidateName && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-slate-400">👤</span>
                          <span className="font-bold">{currentResume.aiAnalysis.candidateName}</span>
                        </div>
                      )}
                      {currentResume.aiAnalysis.email && (
                        <div className="flex items-center gap-2 text-slate-700 min-w-0">
                          <span className="text-slate-400">✉️</span>
                          <a href={`mailto:${currentResume.aiAnalysis.email}`} className="text-indigo-600 hover:underline truncate font-semibold">{currentResume.aiAnalysis.email}</a>
                        </div>
                      )}
                      {currentResume.aiAnalysis.phone && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="text-slate-400">📞</span>
                          <span className="font-semibold">{currentResume.aiAnalysis.phone}</span>
                        </div>
                      )}
                      {currentResume.aiAnalysis.location && (
                        <div className="flex items-center gap-2 text-slate-700 min-w-0">
                          <span className="text-slate-400">📍</span>
                          <span className="font-semibold truncate" title={currentResume.aiAnalysis.location}>{currentResume.aiAnalysis.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Analysis Summary */}
                  {currentResume.aiAnalysis?.summary && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Summary</h3>
                      <p className="text-xs text-slate-650 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                        {currentResume.aiAnalysis.summary}
                      </p>
                    </div>
                  )}

                  {/* Skills Found */}
                  {currentResume.aiAnalysis?.skills && currentResume.aiAnalysis.skills.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Extracted Tech Stack</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {currentResume.aiAnalysis.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-semibold text-violet-700 bg-violet-50/70 border border-violet-100 px-2.5 py-1 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Timeline */}
                  {currentResume.aiAnalysis?.experience && currentResume.aiAnalysis.experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Experience Mapping</h3>
                      <div className="relative border-l border-slate-100 pl-4 ml-1 space-y-5">
                        {currentResume.aiAnalysis.experience.map((exp, index) => (
                          <div key={index} className="relative space-y-1">
                            {/* timeline dot */}
                            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white" />
                            
                            <div className="flex justify-between items-baseline text-xs font-bold">
                              <span className="text-slate-800">{exp.jobTitle} {exp.company ? `@ ${exp.company}` : ""}</span>
                              <span className="text-slate-400 font-semibold text-[10px]">{exp.duration}</span>
                            </div>
                            
                            {exp.bullets ? (
                              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-550 leading-relaxed pl-1">
                                {exp.bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[11px] text-slate-550 leading-relaxed mt-1 pl-1">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {currentResume.aiAnalysis?.projects && currentResume.aiAnalysis.projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Projects</h3>
                      <div className="space-y-3">
                        {currentResume.aiAnalysis.projects.map((proj, idx) => (
                          <div key={idx} className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-bold text-slate-800">{proj.name}</h4>
                            </div>
                            <p className="text-[11px] text-slate-550 leading-relaxed">{proj.description}</p>
                            {proj.technologies && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {proj.technologies.map((tech) => (
                                  <span key={tech} className="text-[9px] font-bold text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-lg">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {currentResume.aiAnalysis?.education && currentResume.aiAnalysis.education.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Education</h3>
                      <div className="space-y-2">
                        {currentResume.aiAnalysis.education.map((edu, idx) => (
                          <div key={idx} className="text-xs p-3 bg-slate-50/50 rounded-xl border border-slate-150 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-800">{edu.degree}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{edu.institution}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 shadow-inner">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">No Active Resume</h4>
                    <p className="text-xs text-slate-450 mt-1.5 max-w-xs mx-auto">
                      Please upload a PDF resume using the panel on the left to see your AI Screening Assessment.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ══════════ Upload History Table ══════════ */}
        {/* <section className="mt-12 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.06)] overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Upload History</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Audit log of your historical resume evaluations.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Document Name</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Upload Date</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">File Size</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Fit Score</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uploadHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-rose-500">📄</span>
                        <span className="text-xs font-bold text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-500 font-medium">{item.date}</td>
                    <td className="p-4 text-xs text-slate-500 font-medium">{item.size}</td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/60">
                        {item.score}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.status === "Active"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          item.status === "Active" ? "bg-emerald-500" : "bg-slate-300"
                        }`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50/40 transition-colors"
                        title="Delete record"
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section> */}

      </div>

      {/* ══════════ View Resume Modal ══════════ */}
      {previewResumeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{currentResume?.title || currentResume?.name}</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Active Resume Document Representation</p>
              </div>
              <button
                onClick={() => setPreviewResumeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Resume template layout */}
            <iframe
    src={currentResume?.resumeUrl}
    className="w-full h-full"
/>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/20 flex justify-end">
              <button
                onClick={() => setPreviewResumeModal(false)}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-semibold text-white shadow-sm"
              >
                Close Document
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UploadResume;