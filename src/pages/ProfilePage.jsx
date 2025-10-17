import React, { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import usePortfolioStore from "../stores/portfolioStore";
import toast from "react-hot-toast";
import {
  User,
  Upload,
  Camera,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  HardDrive,
  AlertCircle,
  ArrowLeft,
  Save,
} from "lucide-react";

const ProfilePage = () => {
  const { user: rawUser, updateProfile, uploadAvatar } = useAuthStore();
  const { portfolios, fetchUserPortfolios } = usePortfolioStore();
  
  // Handle nested user object structure
  const user = rawUser?.user || rawUser;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || user?.name || "",
    email: user?.email || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || user?.profilePicture || null
  );

  // Debug: Log user data
  useEffect(() => {
    console.log("ProfilePage - Raw user data:", rawUser);
    console.log("ProfilePage - Processed user data:", user);
    console.log("ProfilePage - Portfolios:", portfolios);
  }, [rawUser, user, portfolios]);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});
    
    try {
      // Handle avatar upload first if there's a new file
      if (avatarFile) {
        const avatarResult = await uploadAvatar(avatarFile);
        
        if (!avatarResult.success) {
          toast.error(avatarResult.error || "Failed to upload avatar");
          setIsSaving(false);
          return;
        }
      }

      // Prepare user data to update
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
      };

      // Update profile
      const result = await updateProfile(updateData);
      
      if (result.success) {
        setIsEditing(false);
        setAvatarFile(null);
        toast.success("Profile updated successfully!");
      } else {
        // Handle validation errors
        if (result.details) {
          setErrors(result.details);
          // Show field-specific errors
          Object.entries(result.details).forEach(([field, message]) => {
            toast.error(`${field}: ${message}`);
          });
        } else {
          toast.error(result.error || "Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || user?.name || "",
      email: user?.email || "",
    });
    setAvatarPreview(user?.avatar || user?.profilePicture || null);
    setAvatarFile(null);
    setErrors({});
    setIsEditing(false);
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    const name =
      user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Not available";
    }
  };

  // Fetch portfolios on component mount
  useEffect(() => {
    fetchUserPortfolios();
  }, [fetchUserPortfolios]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || user.name || "",
        email: user.email || "",
      });
      setAvatarPreview(user.avatar || user.profilePicture || null);
    }
  }, [user]);

  // Calculate portfolio statistics
  const totalProjects = portfolios?.length || 0;
  const publishedProjects = portfolios?.filter((p) => p.published)?.length || 0;

  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <div className="app-page min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb8500] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-[#fb8500] transition-colors mb-8 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#fb8500] to-[#ff9500] rounded-xl p-8 mb-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white/30">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {getInitials()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.name || user?.username || "User"}
              </h1>
              <p className="text-white/90 text-sm mb-2">
                @{user?.username || "username"}
              </p>
              <p className="text-white/80 text-sm">
                {user?.email || "email@example.com"}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-2">
                <p className="text-xs text-white/80 mb-1">Member since</p>
                <p className="font-semibold">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar Upload Section - Only visible in edit mode */}
          {isEditing && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
                <Camera size={20} className="text-[#fb8500]" />
                Update Profile Picture
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-[#fb8500]">
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  {avatarFile && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                      <Save size={12} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#1a1a1a] mb-1">
                    Upload new picture
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    JPG, PNG, GIF or WebP. Max size 5MB.
                  </p>
                  <label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium"
                  >
                    <Upload size={16} />
                    {avatarFile ? 'Change File' : 'Choose File'}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  {avatarFile && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <AlertCircle size={12} />
                      New image selected - click Save to upload
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Info Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Account Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-[#fb8500] hover:text-[#ff9500] transition-colors"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fb8500] text-white rounded-lg hover:bg-[#ff9500] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={14} />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent outline-none transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.firstName}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[#1a1a1a] py-2 px-3 bg-gray-50 rounded-lg">
                    {formData.firstName || <span className="text-gray-400 italic">Not set</span>}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent outline-none transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.lastName}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[#1a1a1a] py-2 px-3 bg-gray-50 rounded-lg">
                    {formData.lastName || <span className="text-gray-400 italic">Not set</span>}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent outline-none transition-all ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.username}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[#1a1a1a] py-2 px-3 bg-gray-50 rounded-lg">
                    @{formData.username || <span className="text-gray-400 italic">Not set</span>}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent outline-none transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-[#1a1a1a] py-2 px-3 bg-gray-50 rounded-lg">
                    {formData.email || <span className="text-gray-400 italic">Not set</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-6">
              Account Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Account created
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Published
                    </p>
                    <p className="text-sm text-gray-500">
                      {publishedProjects}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Active Projects
                    </p>
                    <p className="text-sm text-gray-500">
                      {totalProjects}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  If you wish to delete your account, please contact our support
                  team. This action cannot be undone and all your data will be
                  permanently removed.
                </p>
                <a
                  href="mailto:support@aurea.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
