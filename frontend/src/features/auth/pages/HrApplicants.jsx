import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { getJobByIdApi, getOneJobAllDetailsForHr, updateApplicationStatus, aiMatch, interviewQuestions, getAllApplicationofHr } from "../../jobs/api/job.api";


const STATUS_OPTIONS = ["applied", "shortlisted", "rejected"];

const STATUS_COLORS = {
  applied:     { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
  shortlisted: { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
  rejected:    { bg: "#FFF1F2", text: "#E11D48", border: "#FECDD3" },
  interview:   { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" },
};

const SKILL_COLORS = [
  ["#EFF6FF","#2563EB"], ["#F0FDF4","#16A34A"], ["#FFF7ED","#EA580C"],
  ["#FDF4FF","#9333EA"], ["#FFFBEB","#D97706"],
];

const SkillBadge = ({ skill, idx }) => {
  const [bg, text] = SKILL_COLORS[idx % SKILL_COLORS.length];
  return (
    <span style={{
      background: bg, color: text, border: `1px solid ${text}33`,
      padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600
    }}>{skill}</span>
  );
};

const ScoreRing = ({ score }) => {
  const radius = 28, stroke = 5;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score || 0));
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "#16A34A" : pct >= 60 ? "#EA580C" : "#E11D48";
  return (
    <svg width={74} height={74}>
      <circle cx={37} cy={37} r={radius} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
      <circle cx={37} cy={37} r={radius} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transform:"rotate(-90deg)", transformOrigin:"50% 50%", transition:"stroke-dashoffset 0.7s ease" }} />
      <text x={37} y={42} textAnchor="middle" fontSize={15} fontWeight={700} fill={color}>{pct}%</text>
    </svg>
  );
};

const Modal = ({ isOpen, onClose, title, children, maxWidth = 680 }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(15,23,42,0.55)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"#fff", borderRadius:20, width:"100%", maxWidth,
        maxHeight:"88vh", overflowY:"auto", boxShadow:"0 30px 60px rgba(0,0,0,0.22)"
      }}>
        <div style={{ padding:"26px 30px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ margin:0, fontSize:19, fontWeight:700, color:"#0F172A" }}>{title}</h2>
          <button onClick={onClose} style={{
            background:"#F1F5F9", border:"none", width:34, height:34, borderRadius:"50%",
            cursor:"pointer", fontSize:20, color:"#64748B", lineHeight:1
          }}>×</button>
        </div>
        <div style={{ padding:"20px 30px 30px" }}>{children}</div>
      </div>
    </div>
  );
};

const Spinner = ({ color = "#2563EB", size = 44 }) => (
  <>
    <div style={{
      width:size, height:size, border:`4px solid #E2E8F0`, borderTopColor:color,
      borderRadius:"50%", margin:"0 auto 16px", animation:"spin 0.8s linear infinite"
    }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </>
);

function ActionBtn({ label, onClick, color, bg, border, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:disabled?"#F1F5F9":bg, color:disabled?"#94A3B8":color,
      border:`1px solid ${disabled?"#E2E8F0":border}`,
      borderRadius:8, padding:"7px 13px", fontSize:12, fontWeight:600,
      cursor:disabled?"not-allowed":"pointer", whiteSpace:"nowrap", transition:"opacity 0.15s"
    }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.opacity="0.8" }}
      onMouseLeave={e => { e.currentTarget.style.opacity="1" }}>
      {label}
    </button>
  );
}

function InfoBox({ label, text, color, bg }) {
  return (
    <div style={{ background:bg, borderRadius:10, padding:"14px 18px", marginBottom:12, border:`1px solid ${color}22` }}>
      <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
      <p style={{ margin:0, fontSize:13, color:"#475569", lineHeight:1.6 }}>{text}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
export default function HrApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobDetails, setJobDetails]   = useState(null);   // from GET /:id/job/details
  const [applicants, setApplicants]   = useState([]);      // from GET /:id/applicants
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [resumeModal,    setResumeModal]    = useState({ open:false, applicant:null });
  const [aiModal,        setAiModal]        = useState({ open:false, data:null, loading:false, error:null });
  const [interviewModal, setInterviewModal] = useState({ open:false, data:null, loading:false, error:null });
  const [statusLoading,  setStatusLoading]  = useState({});

  // ── fetch both job details & applicants ──
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetch with catch handler for job details in case of role protection/issues
      const [jobRes, appRes, hrAppsRes] = await Promise.all([
        getJobByIdApi(jobId).catch(() => null),
        getOneJobAllDetailsForHr(jobId),   // → { applicants: [...], totalApplicants: N }
        getAllApplicationofHr().catch(() => null), // Get all applications of HR to find matching applicationId
      ]);

      // Resolve job details with multiple fallbacks
      let resolvedJob = jobRes?.job || null;
      
      if (!resolvedJob && appRes?.job) {
        resolvedJob = appRes.job;
      }
      
      if (!resolvedJob && appRes?.applicants?.[0]?.job) {
        // If the backend populated the job on applicants, we extract it
        resolvedJob = appRes.applicants[0].job;
      }

      setJobDetails(resolvedJob);

      const rawApplicantsList = appRes?.applicants || [];
      const hrAppsList = hrAppsRes?.applications || [];

      // Map application status and set matching applicationId
      const mapped = rawApplicantsList.map(applicant => {
        // Match application by job ID and candidate ID
        const matchedApp = hrAppsList.find(a => {
          const appJobId = typeof a.job === 'object' ? a.job?._id : a.job;
          const appCandId = typeof a.candidate === 'object' ? a.candidate?._id : a.candidate;
          const targetCandId = typeof applicant.candidate === 'object' ? applicant.candidate?._id : applicant.candidate;
          const targetJobId = typeof applicant.job === 'object' ? applicant.job?._id : applicant.job;

          return String(appJobId) === String(targetJobId) && String(appCandId) === String(targetCandId);
        });

        return {
          ...applicant,
          applicationId: matchedApp?._id || applicant.applicationId || applicant._id || null
        };
      });

      setApplicants(mapped);
    } catch (e) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Status Change ──
  const handleStatusChange = async (applicant, newStatus) => {
    const appId = applicant.applicationId || applicant._id;
    if (!appId) {
      alert("⚠️ Cannot update status: application ID not returned by backend.\nAsk your backend dev to add `applicationId: application._id` in the getJobAllDetails controller.");
      return;
    }
    setStatusLoading(prev => ({ ...prev, [appId]:true }));
    try {
      await updateApplicationStatus(appId, { status: newStatus });
      setApplicants(prev => prev.map(a =>
        (a.applicationId || a._id) === appId ? { ...a, applicationStatus:newStatus } : a
      ));
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setStatusLoading(prev => ({ ...prev, [appId]:false }));
    }
  };

  // ── AI Match ──
  const handleAiMatch = async (applicant) => {
    const appId = applicant.applicationId || applicant._id;
    if (!appId) {
      alert("⚠️ Cannot run AI Match: application ID not returned by backend.\nAsk backend dev to add `applicationId: application._id` in getJobAllDetails controller.");
      return;
    }
    setAiModal({ open:true, data:null, loading:true, error:null });
    try {
      const res = await aiMatch(appId);
      setAiModal({ open:true, data:res, loading:false, error:null });
    } catch {
      setAiModal({ open:true, data:null, loading:false, error:"AI Match failed. Please try again." });
    }
  };

  // ── Interview Questions ──
  const handleInterviewQuestions = async (applicant) => {
    const appId = applicant.applicationId || applicant._id;
    if (!appId) {
      alert("⚠️ Cannot generate questions: application ID not returned by backend.\nAsk backend dev to add `applicationId: application._id` in getJobAllDetails controller.");
      return;
    }
    setInterviewModal({ open:true, data:null, loading:true, error:null });
    try {
      const res = await interviewQuestions(appId);
      setInterviewModal({ open:true, data:res, loading:false, error:null });
    } catch {
      setInterviewModal({ open:true, data:null, loading:false, error:"Failed to generate questions. Please try again." });
    }
  };

  const shortlistedCount = applicants.filter(a => a.applicationStatus === "shortlisted").length;
  const rejectedCount    = applicants.filter(a => a.applicationStatus === "rejected").length;

  return (
    <div style={{ minHeight:"100vh", background:"#F8FAFC", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        background:"#fff", borderBottom:"1px solid #E2E8F0",
        padding:"0 32px", height:64, display:"flex", alignItems:"center", gap:12,
        position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 4px rgba(0,0,0,0.06)"
      }}>
        <button onClick={() => navigate("/hr/dashboard")} style={{
          display:"flex", alignItems:"center", gap:6, background:"#EFF6FF",
          border:"1px solid #BFDBFE", color:"#2563EB", borderRadius:8,
          padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer"
        }}>
          ← Dashboard
        </button>
        <span style={{ color:"#CBD5E1" }}>/</span>
        <span style={{ color:"#64748B", fontSize:14 }}>Applicants</span>
        {jobDetails?.title && (
          <>
            <span style={{ color:"#CBD5E1" }}>/</span>
            <span style={{ color:"#0F172A", fontSize:14, fontWeight:700 }}>{jobDetails.title}</span>
          </>
        )}
      </header>

      <main style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <Spinner color="#2563EB" />
            <p style={{ color:"#64748B", fontSize:15 }}>Loading applicants…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            background:"#FFF1F2", border:"1px solid #FECDD3", borderRadius:12,
            padding:"28px", textAlign:"center"
          }}>
            <p style={{ color:"#E11D48", fontWeight:600, marginBottom:12 }}>{error}</p>
            <button onClick={fetchData} style={{
              background:"#E11D48", color:"#fff", border:"none", borderRadius:8,
              padding:"8px 20px", cursor:"pointer", fontWeight:600
            }}>Retry</button>
          </div>
        )}

        {/* ── Content ── */}
        {!loading && !error && (
          <>
            {/* Job Info Card */}
            {jobDetails && (
              <div style={{
                background:"#fff", borderRadius:16, border:"1px solid #E2E8F0",
                boxShadow:"0 2px 12px rgba(0,0,0,0.06)", padding:"28px 32px", marginBottom:28
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
                  <div>
                    <h1 style={{ margin:"0 0 6px", fontSize:24, fontWeight:800, color:"#0F172A" }}>
                      {jobDetails.title}
                    </h1>
                    <p style={{ margin:"0 0 14px", color:"#64748B", fontSize:14 }}>
                      {jobDetails.company}
                      {jobDetails.location ? ` · ${jobDetails.location}` : ""}
                    </p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {(jobDetails.requiredSkills || []).map((s, i) => (
                        <SkillBadge key={s} skill={s} idx={i} />
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:28, alignItems:"center" }}>
                    <StatNum label="Total" value={applicants.length}    color="#2563EB" />
                    <StatNum label="Shortlisted" value={shortlistedCount} color="#16A34A" />
                    <StatNum label="Rejected"    value={rejectedCount}    color="#E11D48" />
                  </div>
                </div>
              </div>
            )}

            {/* Applicants List */}
            {applicants.length === 0 ? (
              <div style={{
                background:"#fff", borderRadius:16, border:"1px solid #E2E8F0",
                padding:"60px 32px", textAlign:"center"
              }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <h3 style={{ margin:"0 0 8px", color:"#0F172A" }}>No applicants yet</h3>
                <p style={{ color:"#64748B", fontSize:14, margin:0 }}>
                  Applications will appear here once candidates apply.
                </p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {applicants.map((app, idx) => {
                  const candidate = app.candidate || {};
                  const status    = app.applicationStatus || "applied";
                  const sc        = STATUS_COLORS[status] || STATUS_COLORS.applied;
                  const appId     = app.applicationId || app._id || null;

                  return (
                    <div key={appId || idx} style={{
                      background:"#fff", borderRadius:16, border:"1px solid #E2E8F0",
                      boxShadow:"0 2px 8px rgba(0,0,0,0.05)", padding:"22px 26px",
                      display:"flex", alignItems:"center", gap:18, flexWrap:"wrap",
                      animation:`fadeUp 0.35s ease ${idx * 0.05}s both`
                    }}>

                      {/* Avatar */}
                      <div style={{
                        width:50, height:50, borderRadius:"50%",
                        background:"linear-gradient(135deg,#2563EB,#7C3AED)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"#fff", fontSize:19, fontWeight:700, flexShrink:0
                      }}>
                        {(candidate.name || "?")[0].toUpperCase()}
                      </div>

                      {/* Info */}
                      <div style={{ flex:1, minWidth:150 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:"#0F172A", marginBottom:2 }}>
                          {candidate.name || "Unknown"}
                        </div>
                        <div style={{ fontSize:13, color:"#64748B" }}>
                          {candidate.email || "—"}
                        </div>
                        <div style={{ fontSize:11, color:"#94A3B8", marginTop:3 }}>
                          Applied {app.appliedAt
                            ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
                            : "—"}
                        </div>
                      </div>

                      {/* Status badge */}
                      <span style={{
                        background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`,
                        borderRadius:999, padding:"4px 14px", fontSize:11, fontWeight:700,
                        textTransform:"capitalize", whiteSpace:"nowrap"
                      }}>{status}</span>

                      {/* Action buttons */}
                      <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                        <ActionBtn label="📄 Resume"
                          onClick={() => setResumeModal({ open:true, applicant:app })}
                          color="#2563EB" bg="#EFF6FF" border="#BFDBFE" />
                        <ActionBtn label="🤖 AI Match"
                          onClick={() => handleAiMatch(app)}
                          disabled={!appId}
                          color="#7C3AED" bg="#F5F3FF" border="#DDD6FE" />
                        <ActionBtn label="💬 Questions"
                          onClick={() => handleInterviewQuestions(app)}
                          disabled={!appId}
                          color="#0891B2" bg="#ECFEFF" border="#A5F3FC" />
                      </div>

                      {/* Status dropdown */}
                      <div style={{ position:"relative" }}>
                        <select
                          value={status}
                          disabled={!appId || !!statusLoading[appId]}
                          onChange={e => handleStatusChange(app, e.target.value)}
                          style={{
                            border:`1px solid ${sc.border}`, borderRadius:8,
                            padding:"7px 12px", fontSize:12, fontWeight:600,
                            cursor:appId?"pointer":"not-allowed", background:sc.bg, color:sc.text,
                            outline:"none", minWidth:130,
                            opacity:statusLoading[appId] ? 0.6 : 1
                          }}>
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} style={{ color:"#0F172A", background:"#fff" }}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                        {statusLoading[appId] && (
                          <div style={{
                            position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                            width:12, height:12, border:"2px solid #E2E8F0",
                            borderTopColor:sc.text, borderRadius:"50%", animation:"spin 0.7s linear infinite"
                          }} />
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Resume Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={resumeModal.open}
        onClose={() => setResumeModal({ open:false, applicant:null })}
        title="📄 Candidate Resume"
      >
        {resumeModal.applicant && (() => {
          const app  = resumeModal.applicant;
          const resume = app.resume || {};
          const cand = app.candidate || {};
          /* resume.resumeUrl is the field from backend (not fileUrl) */
          const pdfUrl = resume.resumeUrl || null;
          const skills = resume.aiAnalysis?.skills || [];
          return (
            <div>
              {/* Candidate header */}
              <div style={{
                display:"flex", alignItems:"center", gap:16, padding:"16px 20px",
                background:"linear-gradient(135deg,#EFF6FF,#F5F3FF)", borderRadius:12, marginBottom:20
              }}>
                <div style={{
                  width:50, height:50, borderRadius:"50%",
                  background:"linear-gradient(135deg,#2563EB,#7C3AED)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:20, fontWeight:700
                }}>{(cand.name||"?")[0].toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:17, color:"#0F172A" }}>{cand.name||"Unknown"}</div>
                  <div style={{ fontSize:13, color:"#64748B" }}>{cand.email||"—"}</div>
                  {resume.title && <div style={{ fontSize:12, color:"#94A3B8", marginTop:2 }}>{resume.title}</div>}
                </div>
              </div>

              {pdfUrl ? (
                <>
                  <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                    <a href={pdfUrl} target="_blank" rel="noreferrer" style={{
                      display:"inline-flex", alignItems:"center", gap:6,
                      background:"#2563EB", color:"#fff", padding:"9px 18px",
                      borderRadius:8, textDecoration:"none", fontWeight:600, fontSize:13
                    }}>⬇ Download Resume</a>
                    <a href={pdfUrl} target="_blank" rel="noreferrer" style={{
                      display:"inline-flex", alignItems:"center", gap:6,
                      background:"#F1F5F9", color:"#0F172A", padding:"9px 18px",
                      borderRadius:8, textDecoration:"none", fontWeight:600, fontSize:13
                    }}>↗ Open in New Tab</a>
                  </div>
                  {/\.pdf$/i.test(pdfUrl) && (
                    <iframe src={pdfUrl} title="Resume Preview"
                      style={{ width:"100%", height:420, borderRadius:10, border:"1px solid #E2E8F0" }} />
                  )}
                </>
              ) : (
                <p style={{ color:"#64748B", fontSize:14, textAlign:"center", padding:"24px 0" }}>
                  No resume file attached to this application.
                </p>
              )}

              {skills.length > 0 && (
                <div style={{ marginTop:20 }}>
                  <p style={{ margin:"0 0 8px", fontWeight:600, fontSize:12, color:"#475569", textTransform:"uppercase" }}>
                    Skills from Resume
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {skills.map((s, i) => <SkillBadge key={s} skill={s} idx={i} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* ── AI Match Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={aiModal.open}
        onClose={() => setAiModal({ open:false, data:null, loading:false, error:null })}
        title="🤖 AI Match Analysis"
      >
        {aiModal.loading && (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <Spinner color="#7C3AED" />
            <p style={{ color:"#64748B" }}>Running AI analysis…</p>
          </div>
        )}
        {aiModal.error && (
          <p style={{ color:"#E11D48", textAlign:"center", padding:"24px 0" }}>{aiModal.error}</p>
        )}
        {!aiModal.loading && !aiModal.error && aiModal.data && (() => {
          /* Backend returns: { message, match: { matchScore, matchedSkills, missingSkills, recommendation, reason, ... } } */
          const m = aiModal.data.match || aiModal.data;
          return (
            <div>
              <div style={{
                display:"flex", alignItems:"center", gap:20, background:"#F8FAFC",
                borderRadius:12, padding:"20px 24px", marginBottom:20, border:"1px solid #E2E8F0"
              }}>
                <ScoreRing score={m.matchScore || m.score || 0} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:17, fontWeight:700, color:"#0F172A", marginBottom:4 }}>
                    {m.recommendation || "Match Result"}
                  </div>
                  <p style={{ margin:0, color:"#64748B", fontSize:13, lineHeight:1.6 }}>
                    {m.reason || m.summary || "Analysis complete."}
                  </p>
                </div>
              </div>

              {(m.matchedSkills||[]).length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:"#16A34A", textTransform:"uppercase" }}>
                    ✅ Matched Skills
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {m.matchedSkills.map((s,i) => <SkillBadge key={s} skill={s} idx={0} />)}
                  </div>
                </div>
              )}
              {(m.missingSkills||[]).length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:"#E11D48", textTransform:"uppercase" }}>
                    ❌ Missing Skills
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {m.missingSkills.map((s,i) => <SkillBadge key={s} skill={s} idx={3} />)}
                  </div>
                </div>
              )}
              {m.strengths        && <InfoBox label="Strengths"          text={m.strengths}         color="#16A34A" bg="#F0FDF4" />}
              {m.weaknesses       && <InfoBox label="Areas to Improve"   text={m.weaknesses}        color="#EA580C" bg="#FFF7ED" />}
              {m.overallAssessment && <InfoBox label="Overall Assessment" text={m.overallAssessment} color="#2563EB" bg="#EFF6FF" />}
            </div>
          );
        })()}
      </Modal>

      {/* ── Interview Questions Modal ─────────────────────────────── */}
      <Modal
        isOpen={interviewModal.open}
        onClose={() => setInterviewModal({ open:false, data:null, loading:false, error:null })}
        title="💬 Interview Questions"
      >
        {interviewModal.loading && (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <Spinner color="#0891B2" />
            <p style={{ color:"#64748B" }}>Generating interview questions…</p>
          </div>
        )}
        {interviewModal.error && (
          <p style={{ color:"#E11D48", textAlign:"center", padding:"24px 0" }}>{interviewModal.error}</p>
        )}
        {!interviewModal.loading && !interviewModal.error && interviewModal.data && (() => {
          /* Backend returns: { message, questions: [ { question, difficulty/type } | string ] } or nested object */
          let rawQs = interviewModal.data.questions || interviewModal.data.interviewQuestions || [];
          
          // Normalize to array if it is an object
          if (rawQs && typeof rawQs === 'object' && !Array.isArray(rawQs)) {
            if (Array.isArray(rawQs.questions)) {
              rawQs = rawQs.questions;
            } else if (Array.isArray(rawQs.interviewQuestions)) {
              rawQs = rawQs.interviewQuestions;
            } else {
              rawQs = Object.values(rawQs).find(v => Array.isArray(v)) || [];
            }
          }

          const qs = Array.isArray(rawQs) ? rawQs : [];
          
          return (
            <div>
              {qs.length === 0 ? (
                <p style={{ color:"#64748B", textAlign:"center", padding:"24px 0" }}>No questions generated.</p>
              ) : (
                <ol style={{ margin:0, padding:"0 0 0 20px" }}>
                  {qs.map((q, i) => {
                    const text = typeof q === "string" ? q : q.question || JSON.stringify(q);
                    const diff = typeof q === "object" ? (q.difficulty || q.type || null) : null;
                    return (
                      <li key={i} style={{ marginBottom:14 }}>
                        <div style={{
                          background:"#F8FAFC", borderRadius:10, padding:"14px 18px",
                          border:"1px solid #E2E8F0"
                        }}>
                          <p style={{ margin:"0 0 6px", color:"#0F172A", fontSize:14, fontWeight:500, lineHeight:1.6 }}>
                            {text}
                          </p>
                          {diff && (
                            <span style={{
                              fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.03em",
                              color:"#0891B2", background:"#ECFEFF", border:"1px solid #A5F3FC",
                              borderRadius:999, padding:"2px 8px"
                            }}>{diff}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })()}
      </Modal>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  );
}

function StatNum({ label, value, color }) {
  return (
    <div style={{ textAlign:"center", minWidth:56 }}>
      <div style={{ fontSize:26, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:10, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
    </div>
  );
}
