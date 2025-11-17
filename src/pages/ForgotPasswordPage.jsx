import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import authApi from '../lib/authApi';
import aureaLogo from '../assets/AUREA - Logo.jpg';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await authApi.forgotPassword(email);
      setEmailSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      // Generic error message (don't reveal if email exists)
      setError('If an account with that email exists, you will receive a password reset link.');
      setEmailSent(true); // Show success even on error to prevent email enumeration
    } finally {
      setLoading(false);
    }
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
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!emailSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#1a1a1a] mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                      className={`w-full border-2 rounded-md px-4 py-3 text-lg text-[#1a1a1a] bg-white focus:outline-none transition-colors ${
                        error
                          ? "border-red-500"
                          : "border-gray-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-[#fb8500] text-white font-bold text-lg py-4 rounded-md tracking-wide uppercase transition-all hover:bg-[#fb8500]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                {/* Help Text */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Remember your password?{' '}
                    <Link
                      to="/login"
                      className="text-[#fb8500] font-medium hover:text-[#fb8500]/80"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
                >
                  <FaCheckCircle className="text-4xl text-green-600" />
                </motion.div>

                {/* Success Message */}
                <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-8">
                  If an account exists for <span className="font-medium text-[#1a1a1a]">{email}</span>,
                  you will receive a password reset link shortly.
                </p>

                {/* Instructions */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 text-left">
                  <h3 className="text-sm font-semibold text-[#1a1a1a] mb-2">
                    What to do next:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your inbox for the reset email</li>
                    <li>• Click the reset link (valid for 1 hour)</li>
                    <li>• Create a new password</li>
                    <li>• Check spam folder if you don't see it</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full bg-[#fb8500] text-white font-bold text-lg py-4 rounded-md tracking-wide uppercase transition-all hover:bg-[#fb8500]/90 hover:shadow-lg text-center"
                  >
                    Back to Login
                  </Link>

                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                      setError('');
                    }}
                    className="w-full py-3 px-6 border-2 border-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Try Another Email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Note */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              For security reasons, we can't confirm if an email is registered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
