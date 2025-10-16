import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthStore from "../stores/authStore";
import aureaLogo from "../assets/AUREA - Logo.jpg";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  // Get return URL from query params or state
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get("return");
  const template = searchParams.get("template");

  // Build redirect URL with template parameter if present
  let redirectUrl = returnUrl || location.state?.from?.pathname || "/dashboard";
  if (template && redirectUrl.includes("/portfolio-builder/new")) {
    redirectUrl = `${redirectUrl}?template=${template}`;
  }

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        // Error handled in store
      } finally {
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log(
      "Auth effect - authChecked:",
      authChecked,
      "isAuthenticated:",
      isAuthenticated
    ); // Debug log
    if (authChecked && isAuthenticated) {
      console.log("Auto-navigating to:", redirectUrl); // Debug log
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl, authChecked]);

  const onSubmit = async (data) => {
    console.log("Submitting login..."); // Debug log
    const result = await login(data.email, data.password);
    console.log("Login result in component:", result); // Debug log

    if (result.success) {
      console.log("Login successful, navigating to:", redirectUrl); // Debug log
      navigate(redirectUrl, { replace: true });
    } else {
      console.log("Login failed:", result.error); // Debug log
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="app-page min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src={aureaLogo} alt="AUREA Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold tracking-wide uppercase text-[#1a1a1a]">
              AUREA
            </span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={handleBack}
            className="text-[#1a1a1a] hover:text-[#fb8500] font-medium flex items-center mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your AUREA account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full border-2 rounded-md px-4 py-3 text-lg text-[#1a1a1a] bg-white focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full border-2 rounded-md px-4 py-3 text-lg text-[#1a1a1a] bg-white focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20"
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-[#fb8500]" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#fb8500] hover:text-[#fb8500]/80"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fb8500] text-white font-bold text-lg py-4 rounded-md tracking-wide uppercase transition-all hover:bg-[#fb8500]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#fb8500] font-medium hover:text-[#fb8500]/80"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
