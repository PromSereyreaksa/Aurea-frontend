import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import aureaLogo from "../assets/AUREA - Logo.jpg";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    alert(`Logged in as ${formData.email}`);
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
            <h1 className="text-4xl font-bold text-black mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your AUREA account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-black hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-md tracking-wide uppercase transition-all hover:bg-gray-800"
            >
              Sign In
            </button>
          </form>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-black font-medium hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;