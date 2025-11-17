import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { authApi } from '../lib/authApi';
import aureaLogo from '../assets/AUREA - Logo.jpg';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value && newOtp.every(digit => digit)) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();

      // Auto-submit
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (otpString = null) => {
    const otpCode = otpString || otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Verify the email OTP
      await authApi.verifyEmailOTP(email, otpCode);
      setSuccess(true);

      // Get the password from session storage (stored during signup)
      const signupPassword = sessionStorage.getItem('aurea_signup_password');

      if (signupPassword) {
        // Auto-login after successful verification
        try {
          await authApi.login({ email, password: signupPassword });

          // Clear the temporary password
          sessionStorage.removeItem('aurea_signup_password');

          // Redirect to dashboard after 1 second
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          // If auto-login fails, redirect to login page
          setTimeout(() => {
            navigate('/login', {
              state: {
                message: 'Email verified! Please log in.',
                email
              }
            });
          }, 1500);
        }
      } else {
        // No password stored, redirect to login
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Email verified! Please log in.',
              email
            }
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError('');

    try {
      await authApi.resendVerificationOTP(email);
      setCountdown(60); // 60 second cooldown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (success) {
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

        <div className="flex-1 flex justify-center items-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <FaCheckCircle className="text-4xl text-green-600" />
            </motion.div>

            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-3">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login...
            </p>
          </motion.div>
        </div>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fb8500]/10 rounded-full mb-4">
              <FaEnvelope className="text-3xl text-[#fb8500]" />
            </div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to
            </p>
            <p className="text-[#fb8500] font-medium">
              {email}
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-2 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={loading}
                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none transition-colors ${
                      error
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 focus:border-[#fb8500] focus:ring-2 focus:ring-[#fb8500]/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit()}
              disabled={loading || otp.some(digit => !digit)}
              className="w-full bg-[#fb8500] text-white font-bold text-lg py-4 rounded-md tracking-wide uppercase transition-all hover:bg-[#fb8500]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="text-[#fb8500] font-medium hover:text-[#fb8500]/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending
                  ? 'Sending...'
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : 'Resend Code'}
              </button>
            </div>

            {/* Help Text */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-600">
              <p className="font-semibold text-[#1a1a1a] mb-2">
                Tips:
              </p>
              <ul className="space-y-1">
                <li>• Check your spam folder if you don't see the email</li>
                <li>• The code expires in 10 minutes</li>
                <li>• You can paste the code directly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
