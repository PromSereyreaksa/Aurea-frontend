import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import aureaLogo from "../assets/AUREA - Logo.jpg";

const SignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledEmail = location.state?.email || "";
  const [formData, setFormData] = useState({ name: "", email: prefilledEmail, password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Handle signup logic here
    alert(`Account created for ${formData.email}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={aureaLogo} 
              alt="AUREA Logo" 
              className="h-8 w-auto"
            />
            <span className="text-2xl font-bold tracking-wide uppercase text-black">
              AUREA
            </span>
          </Link>
        </div>
      </nav>
      
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button 
            onClick={handleBack}
            className="text-black hover:text-gray-600 font-medium flex items-center mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">Join AUREA</h1>
            <p className="text-gray-600">Create your account and start designing</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-md px-4 py-3 text-lg text-black bg-white focus:outline-none focus:border-black transition-colors"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-md px-4 py-3 text-lg text-black bg-white focus:outline-none focus:border-black transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-md px-4 py-3 text-lg text-black bg-white focus:outline-none focus:border-black transition-colors"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-md px-4 py-3 text-lg text-black bg-white focus:outline-none focus:border-black transition-colors"
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" required className="mr-2" />
              <span className="text-sm text-gray-600">
                I agree to the <Link to="/terms" className="text-black hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-black hover:underline">Privacy Policy</Link>
              </span>
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-md tracking-wide uppercase transition-all hover:bg-gray-800"
            >
              Create Account
            </button>
          </form>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-medium hover:underline">
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