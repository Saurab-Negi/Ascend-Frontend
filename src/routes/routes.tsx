import { BrowserRouter, Routes as Routing, Route } from "react-router-dom";
import Index from "../components";
import LogIn from "../pages/Login/LogIn";
import Home from "../pages/Home/Home";
import Splesh from "../pages/Splesh/Splesh";
import Assesments from "../pages/Assesments/Assesments";
import Signup from "../pages/Signup/Signup";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "../utils/ProtectedRoute";
import ScoreReveal from "../pages/ScoreBoard/ScoreBoard";
import PostLoginRedirect from "../components/postRedirection/PostLoginRedirect";
import Subscription from "../pages/SubsCription/Subscription ";
import AiCoach from "../pages/AiCoach/AiCoach";
import NotFound from "../components/NotFound/NotFound";
import AssesmentRoute from "../utils/AssesmentRoute";
import Temples from "../pages/Temple/Temples";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import Microshifts from "../pages/Microshifts/Microshifts";
import SoulLogsPage from "../pages/SoulLog/SoulLogsPage";
import SoulPrint from "../pages/SoulPrint/SoulPrint";
import Profile from "../pages/Profile/Profile";

export default function Routes() {
  return (
    <BrowserRouter>
      <Routing>
          <Route path="*" element={<NotFound />} />
        <Route element={<Index />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/subscription" element={<Subscription />} />
            <Route path="/postRedirection" element={<PostLoginRedirect />} />
        </Route >
        <Route element={<AssesmentRoute />}>
        <Route element={<Index />}>
        <Route path="/assessments" element={<Assesments />} />
            <Route path="/score" element={<ScoreReveal />} />
        </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Index />}>
            <Route path="/splesh" element={<Splesh />} />
            <Route path="/temple" element={<Temples />} />
            <Route path="/soulprint" element={<SoulPrint />} />
            <Route path="/souLlog" element={<SoulLogsPage />} />
            <Route path="/microshift" element={<Microshifts />} />
            <Route path="/splesh" element={<Splesh />} />
            <Route path="/coach" element={<AiCoach />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routing>
    </BrowserRouter>
  );
}
