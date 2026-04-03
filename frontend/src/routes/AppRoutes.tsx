import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"
import TeamDashboard from "../pages/TeamDashboard"
import TeamProfile from "../pages/TeamProfile"
import ForgotPassword from "../pages/ForgotPassword"
import RequestSubmitted from "../pages/RequestSubmitted"
import Unauthorized from "../pages/Unauthorized"
import SubmitStats from "../pages/SubmitStats"
import AdminDashboard from "../pages/AdminDashboard"
import PlayerProfile from "../pages/PlayerProfile"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/request-submitted" element={<RequestSubmitted />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/teams/:teamId" element={<TeamProfile />} />
        <Route path="/players/:playerId" element={<PlayerProfile />} />
        <Route path="/teams/:teamId/submit-stats" element={<SubmitStats />} />
        <Route path="/dashboard/team/:teamId" element={<TeamDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}