import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useJobs } from "../hooks/useJobs";
import { useResumes } from "../../resumes/hooks/useResume";

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

/* ─────────────────────────────────────────
   Mock Detailed Data matching Job.jsx IDs
───────────────────────────────────────── */
const DETAILED_JOBS = {
  1: {
    id: 1,
    company: "Anthropic",
    logo: "AN",
    logoColor: "#6d28d9",
    logoBg: "#ede9fe",
    title: "Senior AI Engineer",
    location: "San Francisco, CA",
    salary: "$160K – $220K",
    experience: "5+ years",
    skills: ["Python", "LLMs", "PyTorch", "MLOps", "Fine-tuning", "Vector Databases"],
    posted: "2 days ago",
    type: "Full-time",
    remote: true,
    industry: "Artificial Intelligence",
    website: "https://www.anthropic.com",
    companySize: "250-500 employees",
    founded: "2021",
    description: "We are seeking an experienced AI Engineer to join our core alignment team. In this role, you will design, train, and deploy next-generation large language models with a focus on safety, steering, and helpfulness. You will work on scaling reinforcement learning from human feedback (RLHF) and building robust evaluation pipelines.",
    responsibilities: [
      "Develop and optimize training pipelines for large-scale generative models.",
      "Implement and scale alignment algorithms, including RLHF and constitutional AI techniques.",
      "Collaborate with research scientists to transition novel architectures from prototype to production.",
      "Build robust testing and verification suites to evaluate safety, bias, and performance metrics."
    ],
    requirements: [
      "Master's or Ph.D. in Computer Science, Machine Learning, or a related quantitative field.",
      "5+ years of software engineering experience with at least 3 years focused on deep learning.",
      "Expertise in Python, PyTorch, and distributed training systems (e.g., Megatron-LM, DeepSpeed).",
      "Hands-on experience working with APIs, prompt engineering, and fine-tuning transformer models."
    ],
    aiScore: 94,
    aiReasoning: "Your profile shows strong alignment with transformer architectures, PyTorch, and deep learning pipelines. Your past experience with model deployment makes you an exceptional match for our training infra needs."
  },
  2: {
    id: 2,
    company: "OpenAI",
    logo: "OA",
    logoColor: "#2563eb",
    logoBg: "#dbeafe",
    title: "ML Research Scientist",
    location: "New York, NY",
    salary: "$180K – $260K",
    experience: "7+ years",
    skills: ["Deep Learning", "NLP", "Research", "Python", "Transformers", "Reinforcement Learning"],
    posted: "1 day ago",
    type: "Full-time",
    remote: false,
    industry: "AI Research & Deployment",
    website: "https://openai.com",
    companySize: "1,000+ employees",
    founded: "2015",
    description: "OpenAI is looking for research scientists who are passionate about pushing the boundaries of artificial intelligence. You will conduct fundamental research in deep learning, natural language processing, and multimodal agents, with the ultimate goal of developing safe and beneficial AGI.",
    responsibilities: [
      "Perform high-impact research to create novel algorithms and neural network architectures.",
      "Publish peer-reviewed papers at top-tier ML conferences (NeurIPS, ICML, ICLR).",
      "Collaborate across multidisciplinary teams to integrate research breakthroughs into core products.",
      "Mentor junior researchers and contribute to OpenAI's collaborative research culture."
    ],
    requirements: [
      "Ph.D. in Computer Science, Mathematics, or a related research field with a track record of publications.",
      "7+ years of deep learning research experience with demonstrated breakthroughs.",
      "Deep understanding of reinforcement learning, neural scaling laws, and generative modeling.",
      "Proficient in Python and low-level optimization of tensor operations."
    ],
    aiScore: 88,
    aiReasoning: "Excellent publication history and research track record in natural language processing. Alignment with reinforcement learning is high, though minor fine-tuning on our proprietary scale is recommended."
  },
  3: {
    id: 3,
    company: "Google DeepMind",
    logo: "GD",
    logoColor: "#059669",
    logoBg: "#d1fae5",
    title: "Product Manager – AI",
    location: "London, UK",
    salary: "$140K – $190K",
    experience: "4+ years",
    skills: ["Product Strategy", "AI/ML", "Agile", "Analytics", "UX Design"],
    posted: "3 days ago",
    type: "Full-time",
    remote: false,
    industry: "Advanced AI Research",
    website: "https://deepmind.google",
    companySize: "2,000+ employees",
    founded: "2010",
    description: "Join the product organization at Google DeepMind to guide the translation of world-class scientific breakthroughs into features that help billions of people. You will define the roadmap, lead cross-functional engineering and design groups, and define how human-centric AI behaves.",
    responsibilities: [
      "Own the end-to-end product lifecycle for AI platform tools and generative foundation models.",
      "Define product specifications, user stories, and technical requirements in collaboration with researchers.",
      "Coordinate product launches and establish key success metrics based on user feedback.",
      "Represent DeepMind's product vision in front of internal Google executives and external partners."
    ],
    requirements: [
      "4+ years of product management experience, preferably in high-growth SaaS, developer platforms, or AI.",
      "Strong technical background with the ability to discuss API design, model limits, and latency trade-offs.",
      "Outstanding communication skills with experience presenting to diverse scientific and executive teams.",
      "BA/BS in Computer Science, Engineering, or equivalent practical experience."
    ],
    aiScore: 79,
    aiReasoning: "Strong technical background and experience in SaaS product cycles. An upgrade in core AI pipeline knowledge (specifically LLM latency optimization) will maximize fit."
  },
  4: {
    id: 4,
    company: "Mistral AI",
    logo: "MS",
    logoColor: "#dc2626",
    logoBg: "#fee2e2",
    title: "Backend Engineer (AI Infra)",
    location: "Paris, France",
    salary: "€90K – €130K",
    experience: "3+ years",
    skills: ["Go", "Kubernetes", "CUDA", "Distributed Systems", "C++", "Docker"],
    posted: "5 days ago",
    type: "Full-time",
    remote: true,
    industry: "Generative AI Systems",
    website: "https://mistral.ai",
    companySize: "50-100 employees",
    founded: "2023",
    description: "Mistral AI is looking for an Infrastructure Engineer to scale our distributed training and inference platforms. You will write high-performance backend systems, interface directly with GPUs via CUDA, and manage container orchestrations across large clusters.",
    responsibilities: [
      "Optimize hardware utilization rates for GPU training clusters.",
      "Develop low-latency model serving APIs using Go, C++, and Python.",
      "Design and maintain distributed database structures and streaming pipelines.",
      "Scale Kubernetes orchestration patterns to manage multi-node training workflows."
    ],
    requirements: [
      "3+ years of experience building high-load backend applications and distributed infrastructures.",
      "Demonstrated proficiency in Go, Rust, or C++.",
      "Experience setting up Kubernetes clusters, Docker configurations, and continuous delivery.",
      "Knowledge of GPU microarchitectures and CUDA programming is highly preferred."
    ],
    aiScore: 91,
    aiReasoning: "Your background in Go, container systems, and distributed infrastructure perfectly meets Mistral's core engineering stack. Minor learning curve on direct CUDA bindings."
  },
  5: {
    id: 5,
    company: "Cohere",
    logo: "CO",
    logoColor: "#7c3aed",
    logoBg: "#ede9fe",
    title: "Full-Stack Developer",
    location: "Toronto, Canada",
    salary: "CA$120K – CA$160K",
    experience: "2+ years",
    skills: ["React", "Node.js", "TypeScript", "REST APIs", "GraphQL", "TailwindCSS"],
    posted: "1 week ago",
    type: "Full-time",
    remote: true,
    industry: "Enterprise AI Platforms",
    website: "https://cohere.com",
    companySize: "100-250 employees",
    founded: "2019",
    description: "We are looking for a Full-Stack Engineer to build intuitive interfaces that connect developers to our state-of-the-art NLP models. You will work on Cohere's Developer Dashboard, Playground, and API management portals.",
    responsibilities: [
      "Develop clean, responsive user interfaces with React and TailwindCSS.",
      "Build high-throughput backend features with Node.js and TypeScript.",
      "Implement developer-friendly interactive playgrounds for prompt prototyping.",
      "Maintain strict security standards for API key management and billing pages."
    ],
    requirements: [
      "2+ years of professional full-stack development experience.",
      "Strong proficiency in TypeScript, React, and server side JavaScript ecosystems.",
      "Experience building and documenting REST and GraphQL APIs.",
      "Familiarity with building clean layouts and interactive components."
    ],
    aiScore: 95,
    aiReasoning: "Your React/TypeScript/Tailwind CSS stack is a complete 1:1 match for Cohere's developer dashboard codebase. Excellent alignment on API building experience."
  },
  6: {
    id: 6,
    company: "Stability AI",
    logo: "SA",
    logoColor: "#d97706",
    logoBg: "#fef3c7",
    title: "Data Scientist",
    location: "Austin, TX",
    salary: "$110K – $155K",
    experience: "3+ years",
    skills: ["Python", "SQL", "Statistics", "Scikit-learn", "Pandas", "Data Visualization"],
    posted: "4 days ago",
    type: "Full-time",
    remote: false,
    industry: "Open Generative Media",
    website: "https://stability.ai",
    companySize: "150-250 employees",
    founded: "2020",
    description: "Stability AI is seeking a Data Scientist to analyze usage trends, model metrics, and dataset distributions. Your findings will directly steer model generation training targets and help us curate safer open datasets.",
    responsibilities: [
      "Perform exploratory data analysis on petabyte-scale image and text datasets.",
      "Develop statistical models to predict model success rates and user retention trends.",
      "Design metrics dashboard for internal teams to view model evaluation benchmarks.",
      "Collaborate on dataset cleaning pipelines, removing low-quality or toxic samples."
    ],
    requirements: [
      "3+ years of experience as a Data Scientist or Data Analyst in a high-volume product environment.",
      "Advanced knowledge of SQL, Python, Pandas, and Scikit-learn.",
      "Solid foundation in statistical analysis, hypothesis testing, and regression modeling.",
      "Strong visual storytelling abilities using Tableau, Looker, or Matplotlib/Seaborn."
    ],
    aiScore: 82,
    aiReasoning: "Solid Python/SQL skillset. Experience with large-scale unstructured media databases (images/video) is highly valued and will elevate match quality."
  },
  7: {
    id: 7,
    company: "Hugging Face",
    logo: "HF",
    logoColor: "#0891b2",
    logoBg: "#cffafe",
    title: "DevRel Engineer",
    location: "Remote",
    salary: "$100K – $140K",
    experience: "2+ years",
    skills: ["Python", "Transformers", "Community", "Documentation", "Gradio", "Hugging Face Hub"],
    posted: "6 days ago",
    type: "Full-time",
    remote: true,
    industry: "Collaborative Machine Learning",
    website: "https://huggingface.co",
    companySize: "150-200 employees",
    founded: "2016",
    description: "Hugging Face is on a mission to democratize good machine learning. As a Developer Relations Engineer, you will build demos, write tutorials, speak at conferences, and guide the global community in leveraging transformers for custom applications.",
    responsibilities: [
      "Build open-source spaces, Gradio applications, and developer templates.",
      "Write engaging technical blog posts, guides, and library documentations.",
      "Help community members debug issues on forums, GitHub, and Discord.",
      "Deliver technical talks, workshops, and represent Hugging Face at global events."
    ],
    requirements: [
      "2+ years of software development experience with a strong community presence (GitHub, blogging, etc.).",
      "Proficient in Python and libraries like transformers, datasets, and diffusers.",
      "Outstanding teaching ability with a passion for simplifying complex ML concepts.",
      "Empathetic communicator with strong written English capabilities."
    ],
    aiScore: 96,
    aiReasoning: "Highest match score. Your active contribution to open-source libraries, clean communication style, and familiarity with Hugging Face ecosystem matches this job perfectly."
  },
  8: {
    id: 8,
    company: "Scale AI",
    logo: "SC",
    logoColor: "#be185d",
    logoBg: "#fce7f3",
    title: "AI Solutions Architect",
    location: "Chicago, IL",
    salary: "$150K – $200K",
    experience: "6+ years",
    skills: ["Architecture", "AI/ML", "Enterprise", "Cloud", "Consulting", "AWS"],
    posted: "2 weeks ago",
    type: "Full-time",
    remote: false,
    industry: "AI Data Infrastructure",
    website: "https://scale.com",
    companySize: "500-1,000 employees",
    founded: "2016",
    description: "Scale AI provides data infrastructure for the world's leading AI companies. As a Solutions Architect, you will act as a primary technical advisor for enterprise clients, designing custom RLHF pipelines, fine-tuning setups, and retrieval augmented generation (RAG) structures.",
    responsibilities: [
      "Lead technical discovery sessions with enterprise engineering leaders.",
      "Architect custom workflows for model labeling, evaluation, and LLM fine-tuning.",
      "Write code samples, system design specs, and integrate APIs with client systems.",
      "Partner with product and engineering teams to feed customer challenges back into the product loop."
    ],
    requirements: [
      "6+ years of software architecture, engineering, or technical consulting experience.",
      "Deep practical understanding of machine learning APIs, vector storage, and RAG pipelines.",
      "Proven capability to design cloud topologies on AWS, GCP, or Azure.",
      "Exceptional client management and presentation skills."
    ],
    aiScore: 84,
    aiReasoning: "Solid enterprise cloud background and consulting experience. Expanding knowledge of RLHF iteration patterns will further boost performance."
  },
  9: {
    id: 9,
    company: "Runway ML",
    logo: "RM",
    logoColor: "#1d4ed8",
    logoBg: "#dbeafe",
    title: "Creative AI Engineer",
    location: "Los Angeles, CA",
    salary: "$120K – $170K",
    experience: "3+ years",
    skills: ["Diffusion Models", "Python", "Video AI", "APIs", "Stable Diffusion", "PyTorch"],
    posted: "3 days ago",
    type: "Full-time",
    remote: true,
    industry: "AI Creative Tools",
    website: "https://runwayml.com",
    companySize: "50-100 employees",
    founded: "2018",
    description: "Runway is building the next generation of creative tools powered by AI. We are looking for an engineer to develop and optimize generative video and image diffusion pipelines, providing artists and storytellers with magical generative capabilities.",
    responsibilities: [
      "Implement, scale, and optimize latent diffusion models for text-to-video inference.",
      "Collaborate with UX teams to create seamless, fast interfaces for video generation models.",
      "Conduct fine-tuning runs on customized artistic datasets.",
      "Deploy scalable, distributed inference endpoints with ultra-low latency."
    ],
    requirements: [
      "3+ years of PyTorch experience with a focus on computer vision or generative networks.",
      "Expertise with diffusion models, attention mechanisms, and scaling methodologies.",
      "Passion for combining technology with creative applications (art, video editing, etc.).",
      "Familiarity with containerization and cloud rendering pipelines."
    ],
    aiScore: 89,
    aiReasoning: "Strong PyTorch and machine learning foundation. Experience with latent diffusion networks is a solid match for video and image generator optimization."
  }
};

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
const JobsDets = () => {
 
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOneJob, applyJob, getApplications } = useJobs();
  const { user } = useSelector((state) => state.auth);
  const { resume: resumeState } = useSelector((state) => state.resume);
  const currentResume = Array.isArray(resumeState?.resume) ? resumeState?.resume?.[0] : resumeState?.resume;
  const { getResume } = useResumes();
  const { singleJob, loading } = useSelector((state) => state.job);
  const [resumeMissingPrompt, setResumeMissingPrompt] = useState(false);
const application=useSelector((state)=>state.job.application)
  // Fetch jobs if the store is empty
  useEffect(() => {
    getOneJob(id);
  }, [id]);

  useEffect(() => {
    getResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);
   // UI States
  const [isApplying, setIsApplying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [screeningPhase, setScreeningPhase] = useState("");
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);
  const [cvMatchedScore, setCvMatchedScore] = useState(null);

  const hasApplied = useMemo(() => {
    if (!Array.isArray(application)) return false;
    return application.some((app) => {
      const jobVal = app.job;
      if (typeof jobVal === "object" && jobVal !== null) {
        return jobVal._id === id;
      }
      return jobVal === id;
    });
  }, [application, id]);

  // Resolve current active job details (merging mock data with API database fields where necessary)
  const job = useMemo(() => {
  if (!singleJob) return null;

  const { logo, bg: logoBg, text: logoColor } =
    getCompanyColorsAndLogo(singleJob.company);

  return {
    id: singleJob._id,
    company: singleJob.company,
    logo,
    logoBg,
    logoColor,
    title: singleJob.title,
    location: singleJob.location,

    salary:
      typeof singleJob.salary === "number"
        ? `₹${(singleJob.salary / 100000).toFixed(1)} LPA`
        : singleJob.salary,

    experience: singleJob.experience || "Not specified",

    skills: singleJob.requiredSkills || [],

    description: singleJob.description,

    responsibilities:
      singleJob.responsibilities || [],

    requirements:
      singleJob.requirements || [],

    website: singleJob.website || "#",

    industry: singleJob.industry || "IT",

    companySize: singleJob.companySize || "Not specified",

    founded: singleJob.founded || "N/A",

    aiScore: 92,

    aiReasoning:
      "Your profile matches most of the required skills."
  };
}, [singleJob]);
if (loading || !job) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}


  // Simulated apply workflow
  const handleApplyClick = async () => {
    if (!currentResume) {
      setResumeMissingPrompt(true);
      return;
    }

    try {
      await applyJob(singleJob._id);
      getApplications();
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      if (msg === "You have already applied for this job") {
        getApplications();
      }
      return;
    }
    // API success — open modal & start animation
    setIsApplying(true);
    setUploadProgress(0);
    setScreeningPhase("Idle");
    setAppliedSuccessfully(false);
    startScreeningProcess();
  };

  const startScreeningProcess = () => {
    setScreeningPhase("Submitting");
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(uploadInterval);
        analyzeCV();
      }
    }, 200);
  };

  const analyzeCV = () => {
    setScreeningPhase("Analyzing");
    const steps = [
      "Analyzing profile details...",
      "Matching required skills & technologies...",
      "Evaluating experience level fit...",
      "Synthesizing recommendations..."
    ];
    let stepIndex = 0;
    
    const analysisInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setScreeningPhase(steps[stepIndex]);
        stepIndex++;
      } else {
        clearInterval(analysisInterval);
        const variance = Math.floor(Math.random() * 11) - 5;
        const finalScore = Math.max(50, Math.min(100, job.aiScore + variance));
        setCvMatchedScore(finalScore);
        setScreeningPhase("Completed");
        setAppliedSuccessfully(true);
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#f8faff] overflow-x-hidden font-sans pb-24">
      {/* Decorative background blobs */}
      <div className="fixed top-[-180px] right-[-180px] w-[560px] h-[560px] rounded-full bg-violet-300/10 blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-blue-300/8 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 pt-10">
        
        {/* ══════════ Back Button ══════════ */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/all-jobs")}
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold text-sm transition-colors duration-150 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-violet-200"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-150"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Jobs
          </button>
        </div>

        {/* ══════════ Job Header Card ══════════ */}
        <header className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(37,99,235,0.06)] p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-extrabold flex-shrink-0 tracking-wide"
                style={{ background: job.logoBg, color: job.logoColor }}
              >
                {job.logo}
              </div>
              <div>
                <span className="text-sm font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full inline-block mb-2">
                  {job.company}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  {job.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mt-3 text-slate-500 text-sm font-medium">
                  <span className="flex items-center gap-1.5">
                    <svg className="text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    {job.experience}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {/* Inline warning removed for modal popup */}
              {hasApplied ? (
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-6 py-3.5 rounded-xl">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Already Applied
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ══════════ Layout Grid ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2 COLS: Job Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <article className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5">
                Job Description
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                {job.description}
              </p>

              <h3 className="text-base font-bold text-slate-800 mb-4">Key Responsibilities</h3>
              <ul className="space-y-3 mb-8">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-base font-bold text-slate-800 mb-4">Requirements & Qualifications</h3>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Skills */}
            <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-5">
                Required Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200/60 px-3.5 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT 1 COL: Sidebar */}
          <div className="flex flex-col gap-8">
            {/* AI Insights */}
            <aside className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl text-white shadow-xl p-6 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
                    AI Match Insight
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-black">{job.aiScore}%</span>
                  <span className="text-sm font-semibold text-violet-200">Match score</span>
                </div>

                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                    style={{ width: `${job.aiScore}%` }}
                  />
                </div>

                <p className="text-xs text-violet-100 leading-relaxed mt-2 font-medium">
                  {job.aiReasoning}
                </p>

                <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-[11px] leading-relaxed text-violet-100">
                  ⚡ <strong>AI Recommendation:</strong> Top match for interview candidate cycle. Applying now will submit your profile directly to automated screen queues.
                </div>
              </div>
            </aside>

            {/* Company Info */}
            <aside className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Company Details
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{ background: job.logoBg, color: job.logoColor }}
                  >
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{job.company}</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Founded in {job.founded}</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-1" />

                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Industry</span>
                    <span className="text-slate-700 font-semibold text-right max-w-[150px] truncate">{job.industry}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Company Size</span>
                    <span className="text-slate-700 font-semibold">{job.companySize}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Headquarters</span>
                    <span className="text-slate-700 font-semibold">{job.location}</span>
                  </div>
                  <div className="flex justify-between text-xs items-center mt-1">
                    <span className="text-slate-400 font-medium">Website</span>
                    <a
                      href={job.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1"
                    >
                      Visit site
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom Bar */}
        <section className="mt-12 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900">Interested in this role?</h3>
            <p className="text-xs text-slate-505 mt-1 max-w-md">
              Apply via our smart resume screening interface to get instantaneous match ratings and queue priority.
            </p>
          </div>
          {hasApplied ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold px-8 py-4 rounded-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Already Applied
            </div>
          ) : (
            <button
              onClick={handleApplyClick}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white font-semibold px-10 py-4 rounded-xl shadow-lg shadow-violet-200/80 hover:shadow-violet-300 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Apply Now
            </button>
          )}
        </section>

      </div>

      {/* ══════════ AI Application Modal ══════════ */}
      {isApplying && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden p-6 sm:p-8 relative">
            <button
              onClick={() => setIsApplying(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-2">
              Apply to {job.company}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              AI Screen Recommendation Process: Submit your resume to parse, extract match indicators, and get immediate ratings.
            </p>

            {!appliedSuccessfully && (
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                    👤
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">Candidate Profile</p>
                    <p className="text-[10px] text-slate-400">Using Saved Resume</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-violet-600 animate-pulse">{screeningPhase}</span>
                    <span className="text-slate-600">
                      {screeningPhase === "Submitting" ? `${uploadProgress}%` : "In Progress..."}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300`}
                      style={{
                        width: screeningPhase === "Submitting" ? `${uploadProgress}%` : "75%"
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {appliedSuccessfully && (
              <div className="flex flex-col items-center text-center py-4 gap-4 animate-scaleUp">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
                  ✓
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your profile has been matching-scored and pushed directly to {job.company}'s HR review console.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 w-full flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Final AI Score Fit:</span>
                    <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md">
                      {cvMatchedScore}% Match
                    </span>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <p className="text-[11px] text-slate-600 leading-relaxed text-left">
                    💡 <strong>Smart Tip:</strong> We recommend updating your resume to spotlight <strong>{job.skills.slice(0,3).join(", ")}</strong> to improve recruitment priority for subsequent phases.
                  </p>
                </div>

                <button
                  onClick={() => setIsApplying(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors mt-2"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Resume Missing Modal */}
      {resumeMissingPrompt && !currentResume && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-5 animate-fadeIn">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-slate-900">Resume Upload Required</h4>
              <p className="text-xs text-slate-500 leading-normal">
                You must upload a resume before applying to this job. HireVibe AI uses your parsed resume to calculate compatibility and fit scores.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setResumeMissingPrompt(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-650 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setResumeMissingPrompt(false);
                  navigate('/upload-resume');
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white font-semibold px-4 py-2.5 text-xs transition-all shadow-md cursor-pointer"
              >
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsDets;