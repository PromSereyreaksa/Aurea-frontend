import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/PortfolioBuilder/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import EventsPage from "./pages/EventsPage";
import AllEventsPage from "./pages/AllEventsPage";
import TermsPage from "./pages/TermsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import PortfolioBuilderPage from "./pages/PortfolioBuilderPage";
import EchelonPreviewPage from "./pages/EchelonPreviewPage";
import TemplatesShowcasePage from "./pages/TemplatesShowcasePage";
import EchelonCaseStudyPage from "./templates/Echelon/EchelonCaseStudyPage";
import EchelonCaseStudyEditorPage from "./templates/Echelon/EchelonCaseStudyEditorPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/all" element={<AllEventsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio-builder/:id" 
            element={
              <ProtectedRoute>
                <PortfolioBuilderPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio-builder/:portfolioId/case-study/:projectId" 
            element={
              <ProtectedRoute>
                <EchelonCaseStudyEditorPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/template-preview/echelon" 
            element={<EchelonPreviewPage />} 
          />
          <Route 
            path="/templates" 
            element={<TemplatesShowcasePage />} 
          />
          <Route 
            path="/case-study/logo-design-process" 
            element={<EchelonCaseStudyPage />} 
          />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
