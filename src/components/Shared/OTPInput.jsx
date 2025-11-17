import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * OTPInput Component
 * Reusable 6-digit OTP input with auto-focus and paste support
 *
 * @param {Object} props
 * @param {number} props.length - Number of digits (default: 6)
 * @param {function} props.onComplete - Callback when OTP is complete
 * @param {function} props.onChange - Callback on each digit change
 * @param {boolean} props.disabled - Disable input
 * @param {string} props.error - Error message to display
 */
const OTPInput = ({
  length = 6,
  onComplete,
  onChange,
  disabled = false,
  error = ''
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    // Handle multiple character paste
    if (value.length > 1) {
      const pastedData = value.slice(0, length).split('');
      pastedData.forEach((char, i) => {
        if (index + i < length) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);

      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      // Check if complete
      const otpValue = newOtp.join('');
      if (onChange) onChange(otpValue);
      if (otpValue.length === length && onComplete) {
        onComplete(otpValue);
      }
      return;
    }

    // Handle single character
    newOtp[index] = value;
    setOtp(newOtp);

    const otpValue = newOtp.join('');
    if (onChange) onChange(otpValue);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all digits filled
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        if (onChange) onChange(newOtp.join(''));
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only process if all digits
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    const digits = pastedData.slice(0, length).split('');

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    const otpValue = newOtp.join('');
    if (onChange) onChange(otpValue);

    // Focus last input
    if (digits.length === length) {
      inputRefs.current[length - 1]?.focus();
      if (onComplete) onComplete(otpValue);
    } else {
      inputRefs.current[digits.length]?.focus();
    }
  };

  const handleFocus = (index) => {
    // Select text on focus for easy replacement
    inputRefs.current[index]?.select();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 md:gap-3 justify-center">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={`
              w-12 h-14 md:w-14 md:h-16
              text-center text-2xl md:text-3xl font-bold
              border-2 rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }
              ${disabled
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-white hover:border-gray-400'
              }
              ${digit ? 'border-blue-500' : ''}
            `}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-red-600 text-center"
        >
          {error}
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-sm text-gray-500 text-center"
      >
        Enter the {length}-digit code sent to your email
      </motion.p>
    </div>
  );
};

export default OTPInput;
