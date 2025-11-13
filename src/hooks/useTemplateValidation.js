/**
 * useTemplateValidation Hook
 *
 * Real-time validation of portfolio content against template schema
 * Integrates with backend validation endpoint
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { templateApi } from '../lib/templateApi';
import api from '../lib/baseApi';

const useTemplateValidation = (templateId, content, options = {}) => {
  const {
    debounceMs = 500,
    validateOnMount = false,
    validateOnChange = true,
  } = options;

  const [validationResult, setValidationResult] = useState({
    valid: null,
    errors: [],
    isValidating: false,
  });

  const [isValidating, setIsValidating] = useState(false);
  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Validate content against backend
  const validateContent = useCallback(async () => {
    if (!templateId || !content) {
      setValidationResult({ valid: null, errors: [], isValidating: false });
      return { valid: null, errors: [] };
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsValidating(true);

    try {
      const response = await api.post(
        `/api/templates/${templateId}/validate`,
        { content },
        { signal: abortControllerRef.current.signal }
      );

      const result = response.data?.data || response.data || {};

      setValidationResult({
        valid: result.valid,
        errors: result.errors || [],
        isValidating: false,
      });

      setIsValidating(false);

      return result;
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        // Request was aborted, ignore
        return { valid: null, errors: [] };
      }

      console.error('Validation error:', error);

      // Fallback to client-side validation
      const clientValidation = validateClientSide(content);

      setValidationResult({
        valid: clientValidation.valid,
        errors: clientValidation.errors,
        isValidating: false,
      });

      setIsValidating(false);

      return clientValidation;
    }
  }, [templateId, content]);

  // Client-side validation fallback
  const validateClientSide = (content) => {
    const errors = [];

    // Basic validation - check for empty required fields
    if (!content || typeof content !== 'object') {
      errors.push({ error: 'Content must be an object' });
      return { valid: false, errors };
    }

    // Add more client-side validation rules as needed
    // This is a simplified version

    return { valid: errors.length === 0, errors };
  };

  // Debounced validation
  const debouncedValidate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      validateContent();
    }, debounceMs);
  }, [validateContent, debounceMs]);

  // Validate immediately (no debounce)
  const validateImmediately = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    return validateContent();
  }, [validateContent]);

  // Auto-validate on content change
  useEffect(() => {
    if (validateOnChange && content) {
      debouncedValidate();
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [content, validateOnChange, debouncedValidate]);

  // Validate on mount
  useEffect(() => {
    if (validateOnMount) {
      validateImmediately();
    }
  }, [validateOnMount, validateImmediately]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    ...validationResult,
    isValidating,
    validate: validateImmediately,
    debouncedValidate,
  };
};

export default useTemplateValidation;
