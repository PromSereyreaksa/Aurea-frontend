import React, { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// Eagerly load only critical components (landing page)
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/PortfolioBuilder/ProtectedRoute";

// Template migration utilities
import { autoMigrateIfNeeded, migrateSingleTemplate, migrateAllTemplates } from "./utils/templateMigration";

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
const StaticHTMLViewer = lazy(() => import("./pages/StaticHTMLViewer"));
const StaticCaseStudyViewer = lazy(() => import("./pages/StaticCaseStudyViewer"));

// Lazy load templates (heavy components)
const EchelonPreviewPage = lazy(() => import("./pages/EchelonPreviewPage"));
const SerenePreviewPage = lazy(() => import("./pages/SerenePreviewPage"));
const SereneAboutPreviewPage = lazy(() => import("./pages/SereneAboutPreviewPage"));
const ChicPreviewPage = lazy(() => import("./pages/ChicPreviewPage"));
const BoldFolioPreviewPage = lazy(() => import("./pages/BoldFolioPreviewPage"));
const EchelonCaseStudyPage = lazy(() =>
  import("./templates/Echelon/EchelonCaseStudyPage")
);
const EchelonCaseStudyEditorPage = lazy(() =>
  import("./templates/Echelon/EchelonCaseStudyEditorPage")
);
const SereneAboutEditorPage = lazy(() =>
  import("./templates/Serene/SereneAboutEditorPage")
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
  // Auto-migrate templates on app startup (only in development)
  // DISABLED TEMPORARILY - causing fetch errors
  useEffect(() => {
    // Only run auto-migration in development mode
    // if (import.meta.env.DEV) {
    //   autoMigrateIfNeeded().catch(err => {
    //     console.error('Template auto-migration failed:', err);
    //   });
    // }
    console.log('🔄 Template auto-migration DISABLED');
    
    // Expose template migration functions to window for manual triggering
    // Usage in console:
    //   window.resyncTemplates() - re-sync all templates
    //   window.resyncEchelon() - re-sync just Echelon template
    window.resyncTemplates = async () => {
      console.log('🔄 Re-syncing all templates...');
      try {
        const result = await migrateAllTemplates();
        console.log('✅ Templates re-synced successfully:', result);
        toast.success('Templates re-synced! Refresh the page.');
        return result;
      } catch (error) {
        console.error('❌ Failed to re-sync templates:', error);
        toast.error('Failed to re-sync templates');
        throw error;
      }
    };
    
    window.resyncEchelon = async () => {
      console.log('🔄 Re-syncing Echelon template...');
      try {
        const result = await migrateSingleTemplate('echelon');
        console.log('✅ Echelon template re-synced successfully:', result);
        toast.success('Echelon template re-synced! Refresh the page.');
        return result;
      } catch (error) {
        console.error('❌ Failed to re-sync Echelon:', error);
        toast.error('Failed to re-sync Echelon template');
        throw error;
      }
    };
    
    console.log('💡 Template re-sync functions available:');
    console.log('   window.resyncTemplates() - re-sync all templates');
    console.log('   window.resyncEchelon() - re-sync just Echelon template');
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <SpeedInsights />
      <Analytics />
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
              path="/portfolio-builder/:portfolioId/about"
              element={
                <ProtectedRoute>
                  <SereneAboutEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/template-preview/echelon"
              element={<EchelonPreviewPage />}
            />
            <Route
              path="/template-preview/serene"
              element={<SerenePreviewPage />}
            />
            <Route
              path="/template-preview/serene/about"
              element={<SereneAboutPreviewPage />}
            />
            <Route
              path="/template-preview/chic"
              element={<ChicPreviewPage />}
            />
            <Route
              path="/template-preview/boldfolio"
              element={<BoldFolioPreviewPage />}
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

            {/* Static HTML Routes - Must come after other routes to avoid conflicts */}
            <Route
              path="/:subdomain/html"
              element={<StaticHTMLViewer />}
            />
            <Route
              path="/:subdomain/case-study-:projectId.html"
              element={<StaticCaseStudyViewer />}
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
