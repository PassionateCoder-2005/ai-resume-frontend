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
  }
]);

