import {
  createBrowserRouter,
} from "react-router";
import Landing from "../features/landing/pages/Landing";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CandidateProtected from "../features/auth/pages/CandidateProtected";
import CandidateDash from "../features/auth/pages/CandidateDash";
import HrProtected from "../features/auth/pages/HrProtected";
import HrDash from "../features/auth/pages/HrDash";
import Job from "../features/jobs/pages/Job";
import JobsDets from "../features/jobs/pages/JobsDets";
import UploadResume from "../features/resumes/pages/UploadResume";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<Landing/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/candidate/dashboard",
    element:<CandidateProtected>
      <CandidateDash/>
    </CandidateProtected>
  },
  {
    path:"/hr/dashboard",
    element:<HrProtected>
      <HrDash/>
    </HrProtected>
  },
  {
    path:"/all-jobs",
    element:<Job/>
  },
  {
    
    path:"/job/:id",
    element:<CandidateProtected>
    <JobsDets/>
    </CandidateProtected>
  },
  {
    path:"/upload-resume",
    element:<CandidateProtected>
      <UploadResume/>
    </CandidateProtected>
  }
]);

