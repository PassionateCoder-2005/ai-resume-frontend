import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useJobs } from "../hooks/useJobs";

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


const IconSearch = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMapPin = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const IconDollar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconBriefcase = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const IconCode = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconChevronLeft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconReset = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4" />
  </svg>
);

const IconStar = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ─────────────────────────────────────────
   Skill Badge
───────────────────────────────────────── */
const SkillBadge = ({ skill }) => (
  <span className="inline-block text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full transition-colors duration-200 group-hover:bg-violet-100">
    {skill}
  </span>
);

/* ─────────────────────────────────────────
   Skeleton Loader Card
───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200/50 p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 rounded-xl bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
    <div className="h-5 bg-slate-200 rounded w-3/4 mt-2" />
    <div className="flex gap-2">
      <div className="h-4 bg-slate-200 rounded w-16" />
      <div className="h-4 bg-slate-200 rounded w-16" />
      <div className="h-4 bg-slate-200 rounded w-16" />
    </div>
    <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
  </div>
);

/* ─────────────────────────────────────────
   Job Card
───────────────────────────────────────── */
const JobCard = ({ job, onViewDetails }) => {
  const { logo, bg: logoBg, text: logoColor } = getCompanyColorsAndLogo(job.company);
  const skills = job.requiredSkills || job.skills || [];

  // Helper formatting for salary
  const formatSalary = (val) => {
    if (!val) return "Not specified";
    if (typeof val === "number") {
      if (val >= 100000) {
        return `₹${(val / 100000).toFixed(0)} LPA`;
      }
      return `₹${val.toLocaleString()}`;
    }
    return val;
  };

  // Helper for relative dates
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "Recent";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-1 hover:border-violet-200 transition-all duration-200 p-6 flex flex-col gap-3.5 overflow-hidden cursor-pointer text-left">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/0 to-violet-50/0 group-hover:from-blue-50/40 group-hover:to-violet-50/30 transition-all duration-200 pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-start gap-3 relative">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 tracking-wide transition-transform duration-200 group-hover:scale-105"
          style={{ background: logoBg, color: logoColor }}
        >
          {logo}
        </div>

        <div className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-slate-700 mb-1 truncate">
            {job.company}
          </span>
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {job.type || "Full-time"}
            </span>
            {job.remote && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Remote
              </span>
            )}
          </div>
        </div>

        <span className="text-[11.5px] text-slate-400 flex-shrink-0 font-normal">
          {getRelativeTime(job.createdAt)}
        </span>
      </div>

      {/* Job Title */}
      <h3 className="text-[1.08rem] font-bold text-slate-900 leading-snug group-hover:text-violet-700 transition-colors duration-200 relative">
        {job.title}
      </h3>

      {/* Details */}
      <div className="flex flex-wrap gap-3 relative">
        <span className="flex items-center gap-1.5 text-[0.8rem] text-slate-500 font-medium">
          <span className="text-slate-400"><IconMapPin /></span>
          {job.location}
        </span>
        <span className="flex items-center gap-1.5 text-[0.8rem] text-slate-500 font-medium">
          <span className="text-slate-400"><IconDollar /></span>
          {formatSalary(job.salary)}
        </span>
        <span className="flex items-center gap-1.5 text-[0.8rem] text-slate-500 font-medium">
          <span className="text-slate-400"><IconBriefcase /></span>
          {job.experience || "2+ years"}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 relative">
        {skills.slice(0, 5).map((s) => (
          <SkillBadge key={s} skill={s} />
        ))}
        {skills.length > 5 && (
          <span className="text-[10px] text-slate-400 font-bold self-center">+{skills.length - 5} more</span>
        )}
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(job._id || job.id)}
        className="mt-auto flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-violet-600 group-hover:from-violet-600 group-hover:to-blue-600 text-white rounded-xl py-3 text-[0.92rem] font-semibold tracking-wide shadow-md shadow-violet-200 group-hover:shadow-lg group-hover:shadow-violet-300 group-hover:-translate-y-0.5 transition-all duration-200 relative text-center hover:cursor-pointer"
      >
        View Details
        <IconArrowRight />
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────
   Filter Dropdown Select
───────────────────────────────────────── */
const FilterSelect = ({ icon, value, onChange, options }) => (
  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[140px] focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all duration-150">
    <span className="text-violet-600 flex-shrink-0">{icon}</span>
    <select
      className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 cursor-pointer appearance-none"
      value={value}
      onChange={onChange}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

/* ─────────────────────────────────────────
   Main Component Page
───────────────────────────────────────── */
const Job = () => {
  const navigate = useNavigate();
  const dispatchJobs = useJobs();

  // Redux active jobs list state
  const { job: jobsFromState, loading } = useSelector((state) => state.job);
   const user=useSelector((state)=>state.auth.user)
  // Load jobs from API endpoint
  useEffect(() => {
    dispatchJobs.getAllJobs();
  }, []);

  // UI Filters states
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [experience, setExperience] = useState("All Experience");
  const [skill, setSkill] = useState("All Skills");
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Pagination config
  const JOBS_PER_PAGE = 6;

  // Extract unique locations from the active fetched jobs
  const locationsList = useMemo(() => {
    const list = new Set(jobsFromState?.map((j) => j.location).filter(Boolean) || []);
    return ["All Locations", ...Array.from(list)];
  }, [jobsFromState]);

  // Extract unique skills from active fetched jobs
  const skillsList = useMemo(() => {
    const list = new Set();
    jobsFromState?.forEach((j) => {
      const arr = j.requiredSkills || j.skills || [];
      arr.forEach((s) => list.add(s));
    });
    return ["All Skills", ...Array.from(list)];
  }, [jobsFromState]);

  // Static fallback experience
  const experiencesList = [
    "All Experience",
    "0-2 years",
    "2+ years",
    "3+ years",
    "5+ years"
  ];

  // Perform search / filters on live array
  const filtered = useMemo(() => {
    const activeList = jobsFromState || [];
    return activeList.filter((j) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        (j.requiredSkills || j.skills || []).some((s) => s.toLowerCase().includes(q));

      const matchLocation =
        location === "All Locations" || j.location === location;

      // Handle experience safely if it's in the DB, otherwise don't filter it out
      const matchExperience =
        experience === "All Experience" || !j.experience || j.experience === experience;

      const skillArr = j.requiredSkills || j.skills || [];
      const matchSkill =
        skill === "All Skills" || skillArr.includes(skill);

      return matchSearch && matchLocation && matchExperience && matchSkill;
    });
  }, [jobsFromState, search, location, experience, skill]);

  // Pagination limits
  const totalPages = Math.max(1, Math.ceil(filtered.length / JOBS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * JOBS_PER_PAGE,
    safePage * JOBS_PER_PAGE
  );

  const handleSearch = () => setCurrentPage(1);
  const handleReset = () => {
    setSearch("");
    setLocation("All Locations");
    setExperience("All Experience");
    setSkill("All Skills");
    setCurrentPage(1);
  };

  const handleViewDetails = async(id) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    navigate(`/job/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-[#f8faff] overflow-x-hidden font-sans">
      {/* Background blobs */}
      <div className="fixed top-[-180px] right-[-180px] w-[560px] h-[560px] rounded-full bg-violet-300/10 blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-blue-300/8 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-20">
        
        {/* ══════════ Header ══════════ */}
        <header className="text-center pt-16 pb-12">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-50 to-blue-50 text-violet-700 text-[11.5px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-violet-200/60 mb-5">
            <IconStar />
            AI-Matched Opportunities
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-blue-900 to-violet-600 bg-clip-text text-transparent">
            Available Jobs
          </h1>
          <p className="text-slate-500 text-[1.05rem] max-w-lg mx-auto leading-relaxed">
            Find the best opportunities that match your skills — powered by intelligent resume screening.
          </p>
        </header>

        {/* ══════════ Search / Filters Section ══════════ */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.08)] p-2">
            
            {/* Input search */}
            <div className="flex items-center gap-2.5 px-4 py-3.5">
              <span className="text-slate-400 flex-shrink-0">
                <IconSearch size={18} />
              </span>
              <input
                type="text"
                className="flex-1 border-none outline-none text-base text-slate-900 placeholder-slate-400 bg-transparent caret-violet-600"
                placeholder="Job title, company, or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="h-px bg-slate-100 mx-2" />

            {/* Dropdown Filters Row */}
            <div className="flex flex-wrap items-center gap-2 p-3">
              <FilterSelect
                icon={<IconMapPin size={14} />}
                value={location}
                onChange={(e) => { setLocation(e.target.value); setCurrentPage(1); }}
                options={locationsList}
              />
              <FilterSelect
                icon={<IconBriefcase size={14} />}
                value={experience}
                onChange={(e) => { setExperience(e.target.value); setCurrentPage(1); }}
                options={experiencesList}
              />
              <FilterSelect
                icon={<IconCode size={14} />}
                value={skill}
                onChange={(e) => { setSkill(e.target.value); setCurrentPage(1); }}
                options={skillsList}
              />

              <button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-violet-200/60 hover:shadow-violet-300/70 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >
                <IconSearch size={15} />
                Search
              </button>

              <button
                onClick={handleReset}
                title="Reset filters"
                className="flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-violet-50 hover:text-violet-600 border border-slate-200 hover:border-violet-300 rounded-xl p-2.5 transition-all duration-150"
              >
                <IconReset size={15} />
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-400 pl-1">
            Showing <strong className="text-slate-700 font-bold">{filtered.length}</strong> {filtered.length === 1 ? "opportunity" : "opportunities"} found
          </p>
        </section>

        {/* ══════════ Jobs Grid / Loaders ══════════ */}
        {loading ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>
        ) : paginated.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((j) => (
              <JobCard key={j._id || j.id} job={j} onViewDetails={handleViewDetails} />
            ))}
          </section>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center text-center py-20 gap-3">
            <div className="w-24 h-24 rounded-full bg-violet-50 flex items-center justify-center mb-2">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700">No jobs found</h3>
            <p className="text-sm text-slate-400">Try adjusting your filters or search term.</p>
            <button
              onClick={handleReset}
              className="mt-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white text-sm font-semibold px-7 py-2.5 rounded-xl shadow-md shadow-violet-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ══════════ Pagination ══════════ */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-1.5 mt-14">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all duration-150"
            >
              <IconChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium shadow-sm transition-all duration-150 border
                  ${safePage === p
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-violet-300/60 font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all duration-150"
            >
              <IconChevronRight />
            </button>
          </div>
        )}

        {/* ══════════ Login Dialog PopUp ══════════ */}
        {showLoginPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[360px] shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
                  ⚠
                </div>
                <h2 className="text-xl font-bold">Login Required</h2>
              </div>
              <p className="text-gray-600">Please login first to view job details.</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    navigate("/login");
                  }}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;