import React, { useEffect, useRef } from "react";

const FeatureCard = ({ feature, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate visibility progress
      const cardTop = rect.top;
      const cardHeight = rect.height;
      const triggerPoint = windowHeight * 0.8; // Start animation when card is 80% visible
      
      if (cardTop < triggerPoint && cardTop + cardHeight > 0) {
        // Card is in view - animate in
        const progress = Math.min((triggerPoint - cardTop) / (cardHeight * 0.5), 1);
        const opacity = Math.max(0, Math.min(1, progress));
        const translateY = (1 - progress) * 50;
        const scale = 0.95 + (progress * 0.05);
        
        card.style.opacity = opacity;
        card.style.transform = `translateY(${translateY}px) scale(${scale})`;
      } else if (cardTop >= triggerPoint) {
        // Card not reached yet
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.95)';
      }
    };

    // Initial state
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'translateY(50px) scale(0.95)';
      cardRef.current.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    handleScroll(); // Initial call
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 border border-white/20 hover:border-blue-200/50"
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
  );
};

export default FeatureCard;