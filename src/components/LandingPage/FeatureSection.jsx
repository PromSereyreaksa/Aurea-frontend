import React, { useEffect, useRef } from "react";

const features = [
  {
    title: "Portfolio Builder",
    desc: "Create stunning online portfolios that showcase your best work.",
    details: "Professional drag-and-drop interface with customizable templates designed by award-winning designers. Choose from minimalist, bold, or classic layouts, each optimized for different design disciplines. Upload your projects, add descriptions, and organize your work into collections that tell your design story. Built-in SEO optimization ensures your portfolio gets discovered by potential clients.",
    icon: (
      <svg className="w-16 h-16 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
        <circle cx="9" cy="11" r="1" />
        <path d="M13 13l3-3" />
      </svg>
    ),
  },
  {
    title: "Client Pitch Templates",
    desc: "Win more clients with professional presentation templates.",
    details: "Access to 50+ proven pitch deck templates that convert prospects into paying clients. Each template includes sections for project overview, timeline, pricing breakdown, and terms. Customize with your branding, add client-specific details, and export as PDF or interactive presentations. Templates are based on successful pitches from top design agencies and freelancers.",
    icon: (
      <svg className="w-16 h-16 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8M8 12h6M8 16h4" />
        <circle cx="18" cy="6" r="2" />
      </svg>
    ),
  },
  {
    title: "Smart Pricing Calculator",
    desc: "Price your projects confidently with data-driven insights.",
    details: "Intelligent pricing tool that factors in your experience level, project complexity, client budget, timeline, and current market rates. Get personalized recommendations based on industry standards and your geographic location. Track your pricing history, analyze which rates perform best, and automatically adjust for inflation and skill development over time.",
    icon: (
      <svg className="w-16 h-16 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
];

const FeatureSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slideUp');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.15}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-32 px-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-8 tracking-wide">
            Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to elevate your design practice and build a thriving creative business
          </p>
        </div>
        
        <div className="space-y-12">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className="feature-card group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 border border-white/20 hover:border-blue-200/50 opacity-0 translate-y-8"
          >
            <div 
              className={`flex items-center gap-12 ${
                index === 1 ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {React.cloneElement(feature.icon, {
                      className: "w-16 h-16 text-[#fb8500] transition-transform duration-300"
                    })}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-[#1a1a1a] mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {feature.desc}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {feature.details}
                </p>
                
                {/* Subtle accent line */}
                <div className="mt-6 h-1 w-0 bg-[#fb8500] rounded-full group-hover:w-20 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;