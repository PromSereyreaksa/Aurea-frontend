import React, { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

// Eagerly load only critical components (landing page)
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/PortfolioBuilder/ProtectedRoute";

// Lazy load all other pages
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const AllEventsPage = lazy(() => import("./pages/AllEventsPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PortfolioBuilderPage = lazy(() => import("./pages/PortfolioBuilderPage"));
const TemplatesShowcasePage = lazy(() =>
  import("./pages/TemplatesShowcasePage")
);
const PublishedPortfolioPage = lazy(() =>
  import("./pages/PublishedPortfolioPage")
);

// Lazy load templates (heavy components)
const EchelonPreviewPage = lazy(() => import("./pages/EchelonPreviewPage"));
const EchelonCaseStudyPage = lazy(() =>
  import("./templates/Echelon/EchelonCaseStudyPage")
);
const EchelonCaseStudyEditorPage = lazy(() =>
  import("./templates/Echelon/EchelonCaseStudyEditorPage")
);

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#fb8500] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Component to scroll to top on route change and dismiss toasts
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Dismiss all toasts when navigating to a new page
    toast.dismiss();
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white text-black font-sans">
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/templates" element={<TemplatesShowcasePage />} />
            <Route
              path="/portfolio/:slug"
              element={<PublishedPortfolioPage />}
            />
            <Route
              path="/case-study/logo-design-process"
              element={<EchelonCaseStudyPage />}
            />
            <Route
              path="/portfolio/:portfolioId/project/:projectId"
              element={<EchelonCaseStudyPage />}
            />
          </Routes>
        </Suspense>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: "#f87171",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
