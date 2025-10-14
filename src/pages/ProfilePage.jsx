import React, { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { User, Edit3, Settings, Camera, Mail, Calendar, MapPin, X, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleCustomizationClick = () => {
    setShowComingSoon(true);
  };

  const closeComingSoon = () => {
    setShowComingSoon(false);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Not specified';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-[#fb8500] transition-colors mb-4 sm:mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative px-4 sm:px-6 py-4 sm:py-6">
            {/* Profile Picture */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-100">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#fb8500]/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#fb8500]">
                        {getInitials(user?.name || user?.firstName + ' ' + user?.lastName)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCustomizationClick}
                  className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#fb8500] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#fb8500]/90 transition-colors"
                >
                  <Camera size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                  {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {user?.email || 'No email provided'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <button
                    onClick={handleCustomizationClick}
                    className="px-4 py-2 bg-[#fb8500] text-white rounded-lg text-sm sm:text-base font-medium hover:bg-[#fb8500]/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleCustomizationClick}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-4 sm:mb-6 flex items-center gap-2">
                <User size={18} className="sm:w-5 sm:h-5" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-[#1a1a1a] font-medium">
                      {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-[#1a1a1a] font-medium flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      {user?.email || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-[#1a1a1a] font-medium">
                      {user?.phone || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-[#1a1a1a] font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      {user?.location || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <p className="text-[#1a1a1a]">
                    {user?.bio || 'No bio added yet. Tell us about yourself!'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-[#1a1a1a] font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Development Disclaimer */}
            <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>Note:</strong> This profile page is still under development. Some of your information may not be displayed correctly or may be missing. We're working to improve this experience.
              </p>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#1a1a1a] mb-3 sm:mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium text-[#fb8500]">
                    {user?.accountType || 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Portfolios</span>
                  <span className="font-medium text-[#1a1a1a]">
                    {user?.portfolioCount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleCustomizationClick}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Update Profile Picture
                </button>
                <button
                  onClick={handleCustomizationClick}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Change Password
                </button>
                <button
                  onClick={handleCustomizationClick}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Privacy Settings
                </button>
                <button
                  onClick={handleCustomizationClick}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Notification Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl relative">
            <button
              onClick={closeComingSoon}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            <div className="w-16 h-16 bg-[#fb8500]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings size={24} className="text-[#fb8500]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
              We're Working On It!
            </h3>
            <p className="text-gray-600 mb-6">
              This feature is currently under development. Stay tuned for updates!
            </p>
            <button
              onClick={closeComingSoon}
              className="px-6 py-2 bg-[#fb8500] text-white rounded-lg font-medium hover:bg-[#fb8500]/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
