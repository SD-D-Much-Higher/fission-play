import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"
import ClubDashboard from "../pages/ClubDashboard"
import ClubDetail from "../pages/ClubDetail"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/club/:clubId" element={<ClubDashboard />} />
        <Route path="/clubs/:clubId" element={<ClubDetail />} />
      </Routes>
    </BrowserRouter>
  )
}