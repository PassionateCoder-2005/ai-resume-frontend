import React, { useState, useRef } from "react";

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
  const [currentResume, setCurrentResume] = useState(INITIAL_RESUME_DETAILS);
  const [uploadHistory, setUploadHistory] = useState(INITIAL_HISTORY);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsingPhase, setParsingPhase] = useState("");
  const [previewResumeModal, setPreviewResumeModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

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

  const validateAndProcessFile = (file) => {
    if (file.type !== "application/pdf") {
      triggerToast("Error: Only PDF files are supported!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      triggerToast("Error: File size exceeds the maximum limit of 2MB!");
      return;
    }
    simulateUpload(file);
  };

  // Simulated AI Parsing Process
  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setParsingPhase("Uploading file to server...");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        startAIParsing(file);
      }
    }, 150);
  };

  const startAIParsing = (file) => {
    const phases = [
      "Extracting text from PDF layers...",
      "Analyzing semantic skills match...",
      "Structuring job roles & history...",
      "Calculating AI Screening Fit Score..."
    ];
    let phaseIdx = 0;
    
    const interval = setInterval(() => {
      if (phaseIdx < phases.length) {
        setParsingPhase(phases[phaseIdx]);
        phaseIdx++;
      } else {
        clearInterval(interval);
        finalizeAnalysis(file);
      }
    }, 1000);
  };

  const finalizeAnalysis = (file) => {
    setIsUploading(false);
    
    // Generate fresh simulated values
    const calculatedScore = Math.floor(Math.random() * 16) + 82; // 82 to 97
    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    const parsedSkills = ["React", "TypeScript", "TailwindCSS", "Node.js", "Python", "Docker", "AWS", "Git"];
    
    const updatedResume = {
      name: file.name,
      uploadDate: today,
      fileSize: fileSizeFormatted,
      status: "Screening Complete",
      score: calculatedScore,
      summary: `Parsed candidate Profile for ${file.name.replace(".pdf", "")}. Shows excellent capability across modern full-stack web engineering setups, database design, and cloud workflows. Strong indicators of technical communication.`,
      skills: parsedSkills,
      experience: [
        {
          role: "Senior Software Engineer",
          company: "Enterprise AI Labs",
          period: "2024 - Present",
          bullets: [
            "Leading development of client-facing dashboards using React and TypeScript.",
            "Containerized internal services using Docker & optimized AWS deployments."
          ]
        },
        {
          role: "Frontend Engineer",
          company: "Webflow Solutions",
          period: "2022 - 2024",
          bullets: [
            "Maintained high performance user interfaces using clean modern CSS strategies.",
            "Wrote reusable components and collaborated with UI designers on design systems."
          ]
        }
      ],
      education: {
        degree: "Bachelor of Science in Engineering",
        school: "Institute of Technology",
        graduation: "Class of 2022"
      }
    };

    // Update active resume
    setCurrentResume(updatedResume);

    // Add to history
    const newHistoryItem = {
      id: Date.now(),
      name: file.name,
      date: today,
      size: fileSizeFormatted,
      score: calculatedScore,
      status: "Active"
    };

    setUploadHistory(prev => [
      newHistoryItem,
      ...prev.map(item => ({ ...item, status: "Archived" }))
    ]);

    triggerToast(`Resume uploaded & parsed successfully! Match rating: ${calculatedScore}%`);
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
                    <h3 className="text-xs font-bold text-slate-800 truncate" title={currentResume.name}>
                      {currentResume.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-medium">
                      <span>{currentResume.fileSize}</span>
                      <span>•</span>
                      <span>Uploaded {currentResume.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {currentResume.status}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 my-1" />

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewResumeModal(true)}
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
                
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fit Rating:</span>
                  <span className="text-sm font-black text-indigo-600 bg-indigo-50 border border-indigo-100/60 px-2.5 py-0.5 rounded-lg">
                    {currentResume.score}%
                  </span>
                </div>
              </div>

              {/* Loader overlay during parsing */}
              {isUploading ? (
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
              ) : (
                <div className="space-y-6">
                  {/* Analysis Summary */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Summary</h3>
                    <p className="text-xs text-slate-650 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                      {currentResume.summary}
                    </p>
                  </div>

                  {/* Skills Found */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Extracted Tech Stack</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {currentResume.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-semibold text-violet-700 bg-violet-50/70 border border-violet-100 px-2.5 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience Timeline */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Experience Mapping</h3>
                    <div className="relative border-l border-slate-100 pl-4 ml-1 space-y-5">
                      {currentResume.experience.map((exp, index) => (
                        <div key={index} className="relative space-y-1">
                          {/* timeline dot */}
                          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white" />
                          
                          <div className="flex justify-between items-baseline text-xs font-bold">
                            <span className="text-slate-800">{exp.role} @ {exp.company}</span>
                            <span className="text-slate-400 font-semibold text-[10px]">{exp.period}</span>
                          </div>
                          
                          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-550 leading-relaxed pl-1">
                            {exp.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Education</h3>
                    <div className="text-xs p-3 bg-slate-50/50 rounded-xl border border-slate-150 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{currentResume.education.degree}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{currentResume.education.school}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{currentResume.education.graduation}</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

        {/* ══════════ Upload History Table ══════════ */}
        <section className="mt-12 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.06)] overflow-hidden">
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
        </section>

      </div>

      {/* ══════════ View Resume Modal ══════════ */}
      {previewResumeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{currentResume.name}</h3>
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
            <div className="flex-1 overflow-y-auto p-8 bg-white font-sans text-xs text-slate-600 space-y-6">
              
              {/* Header block */}
              <div className="text-center pb-5 border-b border-slate-100 space-y-1">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Rahul Sharma</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Software Engineer (Frontend Specialist)</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">rahul.sharma@example.com | +1 (555) 019-2834 | Bangalore, IN</p>
              </div>

              {/* Profile Summary */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Professional Summary</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentResume.summary}
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Work History</h4>
                
                <div className="space-y-4">
                  {currentResume.experience.map((exp, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{exp.role} @ {exp.company}</span>
                        <span className="text-slate-400 font-semibold text-[10px]">{exp.period}</span>
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="leading-relaxed">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Key Tech Stack</h4>
                <p className="text-[11px] text-slate-700 leading-normal font-semibold">
                  {currentResume.skills.join(", ")}
                </p>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Education</h4>
                <div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{currentResume.education.degree}</span>
                    <span className="text-slate-400 font-semibold text-[10px]">{currentResume.education.graduation}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-450 font-medium">{currentResume.education.school}</p>
                </div>
              </div>

            </div>

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