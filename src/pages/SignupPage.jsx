import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthStore from "../stores/authStore";
import aureaLogo from "../assets/AUREA - Logo.jpg";

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledEmail = location.state?.email || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { email: prefilledEmail },
  });
  const { signup, isLoading, isAuthenticated } = useAuthStore();

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
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const onSubmit = async (data) => {
    const result = await signup(data.name, data.email, data.password);
    // Don't navigate here - let the useEffect handle it after auth state updates
  };

  const handleBack = () => {
    navigate(-1);
  };

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

      <div className="flex-1 flex justify-center px-6 py-8">
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

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Join AUREA
            </h1>
            <p className="text-gray-600">
              Create your account and start designing
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must be less than 50 characters",
                  },
                })}
                className={`w-full border-2 rounded-md px-4 py-3 text-lg text-[#1a1a1a] bg-white focus:outline-none transition-colors ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full border-2 rounded-md px-4 py-3 pr-12 text-lg text-[#1a1a1a] bg-white focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#fb8500] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => {
                      if (watch("password") !== value) {
                        return "Passwords do not match";
                      }
                    },
                  })}
                  className={`w-full border-2 rounded-md px-4 py-3 pr-12 text-lg text-[#1a1a1a] bg-white focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#fb8500] transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                required
                className="mr-2 accent-[#fb8500]"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-[#fb8500] hover:text-[#fb8500]/80"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-[#fb8500] hover:text-[#fb8500]/80"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fb8500] text-white font-bold text-lg py-4 rounded-md tracking-wide uppercase transition-all hover:bg-[#fb8500]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#fb8500] font-medium hover:text-[#fb8500]/80"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
