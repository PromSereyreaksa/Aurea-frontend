import React, { useState } from "react";

const EmailCapture = ({ onRegisterLogin }) => {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("register");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setShowForm(true);
    setFormData({ ...formData, email });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormType = (type) => {
    setFormType(type);
    setFormData({ name: "", email: formData.email, password: "" });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onRegisterLogin(formType, formData);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">Let's get started</h2>
        <p className="text-gray-600">Join thousands of designers already using AUREA</p>
      </div>
      
      {!showForm ? (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-none px-6 py-4 text-lg font-medium text-black bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold text-lg py-4 px-6 tracking-wide uppercase transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20"
          >
            Continue
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              className={`flex-1 py-4 text-lg font-bold tracking-wide uppercase transition-colors ${
                formType === "register" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => handleFormType("register")}
            >
              Register
            </button>
            <button
              type="button"
              className={`flex-1 py-4 text-lg font-bold tracking-wide uppercase transition-colors ${
                formType === "login" 
                  ? "text-black border-b-2 border-black" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => handleFormType("login")}
            >
              Login
            </button>
          </div>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {formType === "register" && (
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border-2 border-gray-200 rounded-none px-6 py-4 text-lg font-medium text-black bg-white focus:outline-none focus:border-black transition-colors"
              />
            )}
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full border-2 border-gray-200 rounded-none px-6 py-4 text-lg font-medium text-black bg-white focus:outline-none focus:border-black transition-colors"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full border-2 border-gray-200 rounded-none px-6 py-4 text-lg font-medium text-black bg-white focus:outline-none focus:border-black transition-colors"
            />
            <button 
              type="submit" 
              className="w-full bg-black text-white font-bold text-lg py-4 px-6 tracking-wide uppercase transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-20"
            >
              {formType === "register" ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmailCapture;
