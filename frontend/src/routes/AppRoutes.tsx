import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"
import ClubDashboard from "../pages/ClubDashboard"
import ClubDetail from "../pages/ClubDetail"
import ForgotPassword from "../pages/ForgotPassword"
import RequestSubmitted from "../pages/RequestSubmitted"
import Unauthorized from "../pages/Unauthorized"
import SubmitStats from "../pages/SubmitStats"
import AdminDashboard from "../pages/AdminDashboard"
import PlayerDetail from "../pages/PlayerDetail"

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
        <Route path="/clubs/:clubId" element={<ClubDetail />} />
        <Route path="/clubs/:clubId/submit-stats" element={<SubmitStats />} />
        <Route path="/dashboard/club/:clubId" element={<ClubDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/players/:playerId" element={<PlayerDetail />} />
      </Routes>
    </BrowserRouter>
  )
}