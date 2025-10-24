import { create } from "zustand";
import { nanoid } from "nanoid";

/**
 * Upload Store
 *
 * Centralized state management for image uploads with:
 * - Instant local preview via blob URLs
 * - Background upload to Cloudinary
 * - Progress tracking per upload
 * - Error handling
 * - Memory management (blob cleanup)
 * - Perceived performance optimizations (fake fast progress)
 */
const useUploadStore = create((set, get) => ({
  // State: { [uploadId]: { file, preview, progress, url, error, status } }
  uploads: {},

  /**
   * Start a new upload
   * Creates local preview immediately and sets up upload tracking
   * Immediately shows 0-30% progress for instant feedback (perceived performance)
   */
  startUpload: (file, uploadId = nanoid()) => {
    // Create local preview URL immediately
    const preview = URL.createObjectURL(file);

    set((state) => ({
      uploads: {
        ...state.uploads,
        [uploadId]: {
          file,
          preview,
          progress: 0,
          url: null,
          error: null,
          status: "uploading", // uploading | success | error
          startedAt: Date.now(),
        },
      },
    }));

    // Fake fast progress: animate 0 → 30% over 300ms for instant feedback
    // This creates perception of immediate action before real upload starts
    let currentProgress = 0;
    const targetProgress = 30;
    const steps = 15; // 15 steps over 300ms = 20ms per step
    const progressIncrement = targetProgress / steps;

    const fakeProgressInterval = setInterval(() => {
      currentProgress += progressIncrement;

      if (currentProgress >= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(fakeProgressInterval);
      }

      set((state) => {
        const upload = state.uploads[uploadId];
        if (!upload || upload.progress > currentProgress) {
          clearInterval(fakeProgressInterval);
          return state;
        }

        return {
          uploads: {
            ...state.uploads,
            [uploadId]: {
              ...upload,
              progress: Math.round(currentProgress),
            },
          },
        };
      });
    }, 20); // Update every 20ms for smooth animation

    return uploadId;
  },

  /**
   * Update upload progress (0-100)
   * Ensures smooth transition from fake progress (0-30%) to real progress (30-100%)
   */
  updateProgress: (uploadId, progress) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;

      // Normalize progress to 0-100 range
      let normalizedProgress = Math.min(100, Math.max(0, progress));

      // If real progress is less than 30%, map it to 30-100% range
      // This ensures smooth continuation from fake progress
      if (normalizedProgress < 30 && upload.progress >= 30) {
        // Real upload just started but fake progress already at 30%
        // Map 0-30 to 30-40 for smooth transition
        normalizedProgress = 30 + (normalizedProgress / 30) * 10;
      }

      // Don't allow progress to go backwards
      const finalProgress = Math.max(upload.progress, Math.round(normalizedProgress));

      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...upload,
            progress: finalProgress,
          },
        },
      };
    });
  },

  /**
   * Mark upload as successful
   * Cleans up blob URL and stores Cloudinary URL
   */
  completeUpload: (uploadId, cloudinaryUrl) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;

      // Clean up blob URL to free memory
      if (upload.preview) {
        URL.revokeObjectURL(upload.preview);
      }

      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...upload,
            url: cloudinaryUrl,
            progress: 100,
            status: "success",
            completedAt: Date.now(),
          },
        },
      };
    });
  },

  /**
   * Mark upload as failed
   */
  failUpload: (uploadId, error) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;

      // Keep preview URL so user can retry
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...upload,
            error: error || "Upload failed",
            status: "error",
            failedAt: Date.now(),
          },
        },
      };
    });
  },

  /**
   * Retry a failed upload
   */
  retryUpload: (uploadId) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;

      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...upload,
            error: null,
            progress: 0,
            status: "uploading",
          },
        },
      };
    });
  },

  /**
   * Cancel and remove an upload
   * Cleans up blob URL
   */
  removeUpload: (uploadId) => {
    set((state) => {
      const upload = state.uploads[uploadId];
      if (!upload) return state;

      // Clean up blob URL
      if (upload.preview) {
        URL.revokeObjectURL(upload.preview);
      }

      const { [uploadId]: _removed, ...rest } = state.uploads;
      return { uploads: rest };
    });
  },

  /**
   * Get upload by ID
   */
  getUpload: (uploadId) => {
    return get().uploads[uploadId];
  },

  /**
   * Get current preview URL (blob or Cloudinary)
   * Returns the final URL if available, otherwise the local preview
   */
  getPreviewUrl: (uploadId) => {
    const upload = get().uploads[uploadId];
    if (!upload) return null;
    return upload.url || upload.preview;
  },

  /**
   * Get final Cloudinary URL
   */
  getFinalUrl: (uploadId) => {
    const upload = get().uploads[uploadId];
    return upload?.url || null;
  },

  /**
   * Clean up all uploads
   * Useful for component unmount
   */
  clearAllUploads: () => {
    const uploads = get().uploads;

    // Clean up all blob URLs
    Object.values(uploads).forEach((upload) => {
      if (upload.preview) {
        URL.revokeObjectURL(upload.preview);
      }
    });

    set({ uploads: {} });
  },

  /**
   * Clean up old completed/failed uploads
   * Keeps only uploads from last 5 minutes
   */
  cleanupOldUploads: () => {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    set((state) => {
      const uploads = { ...state.uploads };
      let hasChanges = false;

      Object.entries(uploads).forEach(([uploadId, upload]) => {
        const isOld =
          (upload.completedAt && now - upload.completedAt > maxAge) ||
          (upload.failedAt && now - upload.failedAt > maxAge);

        if (isOld) {
          if (upload.preview) {
            URL.revokeObjectURL(upload.preview);
          }
          delete uploads[uploadId];
          hasChanges = true;
        }
      });

      return hasChanges ? { uploads } : state;
    });
  },
}));

export default useUploadStore;
