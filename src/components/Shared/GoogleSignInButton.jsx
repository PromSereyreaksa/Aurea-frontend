import React from 'react';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

/**
 * GoogleSignInButton Component
 * Styled button to initiate Google OAuth flow
 *
 * @param {Object} props
 * @param {function} props.onClick - Optional click handler (default: redirects to OAuth)
 * @param {boolean} props.disabled - Disable button
 * @param {string} props.text - Button text
 * @param {boolean} props.fullWidth - Full width button
 */
const GoogleSignInButton = ({
  onClick,
  disabled = false,
  text = 'Continue with Google',
  fullWidth = true
}) => {
  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
    } else {
      // Default: redirect to backend OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/google`;
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-3
        px-6 py-3
        bg-white
        border-2 border-gray-300
        rounded-lg
        font-medium text-gray-700
        transition-all duration-200
        hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
      `}
    >
      <FaGoogle className="text-xl text-red-500" />
      <span>{text}</span>
    </motion.button>
  );
};

export default GoogleSignInButton;
