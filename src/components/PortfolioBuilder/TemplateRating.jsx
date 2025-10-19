/**
 * TemplateRating Component
 *
 * Displays and allows users to rate templates
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { toast } from 'react-hot-toast';
import api from '../../lib/baseApi';
import useAuthStore from '../../stores/authStore';

const TemplateRating = ({
  templateId,
  currentRating = { average: 0, count: 0 },
  onRatingUpdate,
  size = 'md',
  showCount = true,
  allowRating = true,
  className,
}) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const starSize = sizes[size] || sizes.md;

  // Handle star click
  const handleStarClick = async (rating) => {
    if (!allowRating) return;

    if (!isAuthenticated) {
      toast.error('Please log in to rate templates');
      return;
    }

    if (rating < 1 || rating > 5) return;

    setIsSubmitting(true);

    try {
      const response = await api.post(`/api/templates/${templateId}/rating`, {
        rating,
      });

      const updatedRating = response.data?.data?.rating || currentRating;

      if (onRatingUpdate) {
        onRatingUpdate(updatedRating);
      }

      toast.success('Thank you for your rating!');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render star
  const renderStar = (index) => {
    const starNumber = index + 1;
    const isHovered = hoveredStar >= starNumber;
    const isFilled = currentRating.average >= starNumber;
    const isPartiallyFilled =
      currentRating.average > index && currentRating.average < starNumber;

    return (
      <motion.button
        key={index}
        type="button"
        disabled={!allowRating || isSubmitting}
        onClick={() => handleStarClick(starNumber)}
        onMouseEnter={() => allowRating && setHoveredStar(starNumber)}
        onMouseLeave={() => allowRating && setHoveredStar(0)}
        className={cn(
          'transition-all',
          allowRating && !isSubmitting && 'cursor-pointer hover:scale-110',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
        whileHover={allowRating && !isSubmitting ? { scale: 1.1 } : {}}
        whileTap={allowRating && !isSubmitting ? { scale: 0.95 } : {}}
      >
        <svg
          className={cn(
            starSize,
            'transition-colors',
            isHovered || isFilled
              ? 'text-yellow-400'
              : 'text-gray-300'
          )}
          fill={isHovered || isFilled || isPartiallyFilled ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isPartiallyFilled ? (
            <defs>
              <linearGradient id={`gradient-${index}`}>
                <stop
                  offset={`${((currentRating.average - index) * 100).toFixed(0)}%`}
                  stopColor="currentColor"
                  stopOpacity="1"
                />
                <stop
                  offset={`${((currentRating.average - index) * 100).toFixed(0)}%`}
                  stopColor="currentColor"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          ) : null}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            fill={isPartiallyFilled ? `url(#gradient-${index})` : undefined}
          />
        </svg>
      </motion.button>
    );
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>

      {/* Rating info */}
      {showCount && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">
            {currentRating.average > 0 ? currentRating.average.toFixed(1) : '0.0'}
          </span>
          {currentRating.count > 0 && (
            <span className="text-gray-400">
              ({currentRating.count} {currentRating.count === 1 ? 'rating' : 'ratings'})
            </span>
          )}
        </div>
      )}

      {/* Submitting indicator */}
      {isSubmitting && (
        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
};

export default TemplateRating;
