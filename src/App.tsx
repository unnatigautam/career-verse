
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AssessmentPage from "./pages/AssessmentPage";
import AssessmentResultsPage from "./pages/AssessmentResultsPage";
import DashboardPage from "./pages/DashboardPage";
import CareerExplorerPage from "./pages/CareerExplorerPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import SkillAnalysisPage from "./pages/SkillAnalysisPage";
import LearningRoadmapPage from "./pages/LearningRoadmapPage";
import ProfilePage from "./pages/ProfilePage";
import CareerComparisonPage from "./pages/CareerComparisonPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route
              path="/assessment/results"
              element={<AssessmentResultsPage />}
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/careers" element={<CareerExplorerPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/skills" element={<SkillAnalysisPage />} />
            <Route path="/roadmap" element={<LearningRoadmapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/compare" element={<CareerComparisonPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
