import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Move InputField component outside to prevent re-creation on every render
const InputField = ({ 
  label, 
  type = 'text', 
  field, 
  placeholder, 
  required = false, 
  rows = null,
  value,
  onChange,
  hasError
}) => {
  const Component = rows ? 'textarea' : 'input';
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Component
        type={type}
        value={value || ''}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 ${
          hasError 
            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-[#fb8500] focus:ring-[#fb8500]/20 focus:ring-2'
        }`}
        placeholder={placeholder}
      />
      {hasError && (
        <div className="flex items-center gap-1 mt-2">
          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-600">{hasError}</p>
        </div>
      )}
    </div>
  );
};

const TemplateSetupForm = ({ template, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    bio: '',
  });

  const [selectedColor, setSelectedColor] = useState('#fb8500'); // Default to brand orange
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [showShakeAnimation, setShowShakeAnimation] = useState(false);
  
  // Tag input state
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Common UX/Design categories and skills
  const skillSuggestions = [
    // UX Design
    'User Experience Design', 'User Research', 'Usability Testing', 'User Personas', 'User Journey Mapping',
    'Information Architecture', 'Wireframing', 'Prototyping', 'Interaction Design', 'Accessibility Design',
    
    // UI Design
    'User Interface Design', 'Visual Design', 'Design Systems', 'Component Libraries', 'Brand Design',
    'Typography', 'Color Theory', 'Icon Design', 'Illustration', 'Mobile Design',
    
    // Tools
    'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Principle', 'Framer', 'Adobe Creative Suite',
    'Adobe Photoshop', 'Adobe Illustrator', 'Miro', 'FigJam', 'Notion', 'Zeplin',
    
    // Frontend
    'HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript', 'SCSS/Sass',
    'Tailwind CSS', 'Bootstrap', 'Responsive Design', 'CSS Animations', 'Web Accessibility',
    
    // Research & Strategy
    'Design Strategy', 'Product Strategy', 'Design Thinking', 'Service Design', 'Customer Journey Mapping',
    'Competitive Analysis', 'A/B Testing', 'Analytics', 'Heuristic Evaluation', 'Card Sorting',
    
    // Collaboration
    'Cross-functional Collaboration', 'Agile Methodology', 'Design Leadership', 'Mentoring',
    'Stakeholder Management', 'Design Workshops', 'Presentation Skills', 'Client Communication',
    
    // Industries
    'E-commerce', 'SaaS', 'Mobile Apps', 'Web Applications', 'Enterprise Software',
    'Healthcare', 'Fintech', 'Education Technology', 'Consumer Products', 'B2B Software'
  ];

  // Steps configuration
  const steps = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Tell us about yourself',
      fields: ['name', 'title', 'description']
    },
    {
      id: 'contact',
      title: 'Contact Details',
      description: 'How can people reach you?',
      fields: ['email', 'phone', 'location']
    },
    {
      id: 'skills',
      title: 'Skills & Bio',
      description: 'Showcase your expertise',
      fields: ['skills', 'bio']
    },
    {
      id: 'styling',
      title: 'Visual Style',
      description: 'Choose your colors and fonts',
      fields: ['color', 'font']
    }
  ];

  // Color presets
  const colorPresets = [
    { name: 'Brand Orange', color: '#fb8500' },
    { name: 'Deep Black', color: '#1a1a1a' },
    { name: 'Pure White', color: '#ffffff' },
    { name: 'Ocean Blue', color: '#3b82f6' },
    { name: 'Forest Green', color: '#22c55e' },
    { name: 'Royal Purple', color: '#a855f7' },
    { name: 'Rose Pink', color: '#f43f5e' },
    { name: 'Emerald', color: '#10b981' },
  ];

  // Font options
  const fontOptions = [
    { name: 'Inter', family: 'Inter, sans-serif', description: 'Modern and clean' },
    { name: 'Poppins', family: 'Poppins, sans-serif', description: 'Friendly and approachable' },
    { name: 'Roboto', family: 'Roboto, sans-serif', description: 'Professional and readable' },
    { name: 'Playfair Display', family: 'Playfair Display, serif', description: 'Elegant and sophisticated' },
    { name: 'Lato', family: 'Lato, sans-serif', description: 'Warm and humanist' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif', description: 'Strong and versatile' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Tag management functions
  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
    }
    setSkillInput('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillInputChange = (value) => {
    setSkillInput(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkill(skillInput);
      }
    } else if (e.key === 'Backspace' && !skillInput && formData.skills.length > 0) {
      // Remove last skill if input is empty and backspace is pressed
      removeSkill(formData.skills[formData.skills.length - 1]);
    }
  };

  const getFilteredSuggestions = () => {
    if (!skillInput) return [];
    
    const input = skillInput.toLowerCase();
    return skillSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(input) && 
        !formData.skills.includes(suggestion)
      )
      .slice(0, 6); // Limit to 6 suggestions
  };

  const validateCurrentStep = () => {
    const currentStepConfig = steps[currentStep];
    const stepErrors = {};
    
    switch (currentStepConfig.id) {
      case 'basic':
        if (!formData.name.trim()) {
          stepErrors.name = 'Please enter your full name';
        }
        if (!formData.title.trim()) {
          stepErrors.title = 'Please enter your professional title';
        }
        break;
      
      case 'contact':
        // Email validation if provided
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          stepErrors.email = 'Please enter a valid email address';
        }
        // Phone validation if provided (basic check)
        if (formData.phone && formData.phone.length < 10) {
          stepErrors.phone = 'Please enter a valid phone number';
        }
        break;
        
      case 'skills':
        // No required fields, but we can validate format
        break;
        
      case 'styling':
        // Color and font are pre-selected, so always valid
        break;
        
      default:
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = async () => {
    setIsValidating(true);
    
    // Add a small delay to show the validation state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      // Trigger shake animation for invalid form
      setShowShakeAnimation(true);
      setTimeout(() => setShowShakeAnimation(false), 600);
    }
    
    setIsValidating(false);
  };

  const handleSkipSetup = () => {
    // Provide minimal default data to skip the setup process
    const defaultSetupData = {
      personalInfo: {
        name: 'Your Name',
        title: 'Professional Title',
        email: 'your.email@example.com',
        bio: 'Add your professional bio here. You can edit this later.',
        skills: ['Skill 1', 'Skill 2', 'Skill 3']
      },
      skillsArray: ['Skill 1', 'Skill 2', 'Skill 3'], // For backwards compatibility
      styling: {
        colors: {
          primary: '#1f2937',
          accent: '#1f2937',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
          accent: 'Inter',
        }
      }
    };

    onComplete(defaultSetupData);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Prepare the setup data
    const setupData = {
      personalInfo: { ...formData, skills: formData.skills }, // skills is already an array
      skillsArray: formData.skills, // For backwards compatibility
      styling: {
        colors: {
          primary: selectedColor,
          accent: selectedColor,
          // Keep other colors from template defaults but update primary/accent
        },
        fonts: {
          heading: selectedFont,
          body: selectedFont,
          accent: selectedFont,
        }
      }
    };

    onComplete(setupData);
  };

  const renderBasicInfo = () => (
    <motion.div
      key="basic"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <InputField
        label="Full Name"
        field="name"
        placeholder="e.g., Sarah Johnson"
        required={true}
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        hasError={errors.name}
      />

      <InputField
        label="Professional Title"
        field="title"
        placeholder="e.g., UI/UX Designer, Web Developer, Creative Director"
        required={true}
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        hasError={errors.title}
      />

      <InputField
        label="Professional Description"
        field="description"
        placeholder="Brief description of what you do and your passion..."
        rows={4}
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        hasError={errors.description}
      />
    </motion.div>
  );

  const renderContactDetails = () => (
    <motion.div
      key="contact"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Email Address"
          type="email"
          field="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          hasError={errors.email}
        />

        <InputField
          label="Phone Number"
          type="tel"
          field="phone"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          hasError={errors.phone}
        />

        <InputField
          label="Location"
          field="location"
          placeholder="City, State/Country"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          hasError={errors.location}
        />
      </div>
    </motion.div>
  );

  const renderSkillsBio = () => (
    <motion.div
      key="skills"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Skills Tag Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Skills
        </label>
        
        {/* Skills Display Area */}
        <div className="border border-gray-300 rounded-lg p-3 min-h-[120px] focus-within:ring-2 focus-within:ring-[#fb8500]/20 focus-within:border-[#fb8500] transition-all duration-200">
          {/* Selected Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 bg-[#fb8500] text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.span>
            ))}
          </div>
          
          {/* Input Field */}
          <div className="relative">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => handleSkillInputChange(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onFocus={() => setShowSuggestions(skillInput.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={formData.skills.length === 0 ? "Type a skill and press Enter (e.g., UX Design, React, Figma)" : "Add another skill..."}
              className="w-full border-none outline-none text-sm placeholder-gray-400"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && getFilteredSuggestions().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto"
              >
                {getFilteredSuggestions().map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addSkill(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-[#fb8500]/10 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium text-[#1a1a1a]">{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-2 mt-2">
          <div className="text-[#fb8500] mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Type to see suggestions or add custom skills. Press Enter or comma to add a skill. Click the × to remove skills.
          </p>
        </div>
        
        {/* Popular Skills Quick Add */}
        {formData.skills.length < 3 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Popular skills:</p>
            <div className="flex flex-wrap gap-2">
              {['User Experience Design', 'Figma', 'React', 'User Research', 'Prototyping', 'JavaScript'].map((skill) => (
                !formData.skills.includes(skill) && (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="text-xs bg-gray-100 hover:bg-[#fb8500]/10 text-gray-700 hover:text-[#fb8500] px-3 py-1 rounded-full transition-colors border border-gray-200 hover:border-[#fb8500]/30"
                  >
                    + {skill}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      <InputField
        label="About Me Bio"
        field="bio"
        placeholder="Tell your story, share your background, experience, and what makes you unique..."
        rows={6}
        value={formData.bio}
        onChange={(e) => handleInputChange('bio', e.target.value)}
        hasError={errors.bio}
      />
      <p className="text-sm text-gray-500 -mt-4">
        This will appear in your "About" section. Share your journey, passions, and what drives you professionally.
      </p>
    </motion.div>
  );

  const renderStyling = () => (
    <motion.div
      key="styling"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Choose Your Brand Color</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colorPresets.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedColor(preset.color)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedColor === preset.color
                  ? 'border-[#1a1a1a] scale-105 bg-[#fb8500]/10'
                  : 'border-gray-200 hover:border-[#fb8500]/50'
              }`}
            >
              <div
                className="w-full h-12 rounded-lg mb-3"
                style={{ backgroundColor: preset.color }}
              ></div>
              <p className="text-sm font-medium text-[#1a1a1a]">{preset.name}</p>
            </button>
          ))}
        </div>
        
        {/* Custom Color Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
            Or choose a custom color:
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-12 h-12 border-2 border-[#1a1a1a] rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500]/20 focus:border-[#fb8500]"
              placeholder="#3b82f6"
            />
          </div>
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Choose Your Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fontOptions.map((font, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedFont(font.name)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedFont === font.name
                  ? 'border-[#1a1a1a] bg-[#fb8500]/10'
                  : 'border-gray-200 hover:border-[#fb8500]/50'
              }`}
            >
              <div style={{ fontFamily: font.family }}>
                <h4 className="text-xl font-bold mb-2">{font.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{font.description}</p>
                <p className="text-lg">
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
            Set up your {template.name} portfolio
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Let's personalize your portfolio step by step
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index <= currentStep
                      ? 'bg-[#fb8500] text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-all ${
                      index < currentStep ? 'bg-[#fb8500]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Info */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 mt-1">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className={`bg-white rounded-xl shadow-sm p-8 mb-8 transition-all duration-200 ${
          showShakeAnimation ? 'animate-pulse border-2 border-red-200' : ''
        }`}>
          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Please fix the following {Object.keys(errors).length === 1 ? 'issue' : 'issues'}:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className={showShakeAnimation ? 'animate-bounce' : ''}>
            {currentStep === 0 && renderBasicInfo()}
            {currentStep === 1 && renderContactDetails()}
            {currentStep === 2 && renderSkillsBio()}
            {currentStep === 3 && renderStyling()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={currentStep === 0 ? onBack : handlePrevious}
              className="px-6 py-3 border-2 border-[#1a1a1a] text-[#1a1a1a] bg-white rounded-lg hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {currentStep === 0 ? 'Back to Templates' : 'Previous'}
            </button>
            
            <button
              type="button"
              onClick={handleSkipSetup}
              className="px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 flex items-center gap-2 text-sm"
              title="Skip setup and use default values"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3-3 3m0 0l-3-3m3 3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Skip Setup
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={isValidating}
              className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isValidating 
                  ? 'bg-[#fb8500]/60 text-white cursor-not-allowed'
                  : 'bg-[#fb8500] text-white hover:bg-[#fb8500]/90 shadow-lg hover:shadow-xl'
              }`}
            >
              {isValidating && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              
              {currentStep === steps.length - 1 ? (
                <>
                  {isValidating ? 'Creating Portfolio...' : 'Create Portfolio'}
                  {!isValidating && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </>
              ) : (
                <>
                  {isValidating ? 'Validating...' : 'Next'}
                  {!isValidating && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-3">
            <div className="text-[#fb8500] mt-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#1a1a1a] mb-1">Need help?</h3>
              <p className="text-sm text-gray-600">
                {currentStep === 0 && "Start with your full name and professional title. These will be prominently displayed on your portfolio."}
                {currentStep === 1 && "Add your contact information so potential clients or employers can reach you. All fields are optional."}
                {currentStep === 2 && "Add your key skills by typing and pressing Enter. Use the suggestions to find common UX/Design skills, or add your own custom skills."}
                {currentStep === 3 && "Choose colors and fonts that reflect your personal brand. You can always change these later."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSetupForm;