import React from "react";
import Masonry from "../Shared/Masonry";

const events = [
  {
    id: 1,
    img: "/event-pics/EPW_24_Website-scaled.jpg",
    title: "Design Leadership Bootcamp",
    description: "Master the art of leading design teams and driving creative vision in organizations"
  },
  {
    id: 2,
    img: "/event-pics/679b93cf71c53f6a4e4308f5_offf-barcelona.jpg",
    title: "Creative Conference 2025",
    description: "Join industry leaders for cutting-edge design trends and networking opportunities"
  },
  {
    id: 3,
    img: "/event-pics/92457f954fd0f4c470a7a3ca8521339d72495765_944.jpg",
    title: "Branding Workshop",
    description: "Deep dive into brand strategy, visual identity, and storytelling techniques"
  },
  {
    id: 4,
    img: "/event-pics/a1.jpg",
    title: "Business Skills Masterclass",
    description: "Learn pricing strategies, client management, and freelance business fundamentals"
  },
  {
    id: 5,
    img: "/event-pics/flyer.jpg",
    title: "Digital Design Workshop",
    description: "Advanced techniques in UI/UX design, prototyping, and user research methodologies"
  },
  {
    id: 6,
    img: "/event-pics/graphic-design-for-events-branding-1024x560.webp",
    title: "Portfolio Optimization Bootcamp",
    description: "Transform your portfolio into a client-attracting powerhouse that wins projects"
  },
  {
    id: 7,
    img: "/event-pics/top-web-design-events-2025.jpg",
    title: "Web Design Trends 2025",
    description: "Stay ahead with the latest web design trends, tools, and implementation strategies"
  },
  {
    id: 8,
    img: "/event-pics/upcoming_design_conferences.webp",
    title: "Design Conference Series",
    description: "Monthly gatherings featuring workshops, talks, and collaborative design sessions"
  },
  {
    id: 9,
    img: "/event-pics/web-design-conference.jpg",
    title: "Advanced Web Development",
    description: "Bridge the gap between design and development with practical coding skills"
  }
];

const EventsSection = () => {
  // Use 9 events for better layout spacing with full aspect ratios
  const heightVariations = [200, 280, 240, 320, 260, 300, 220, 340, 270];
  
  const masonryItems = events.map((event, index) => ({
    id: event.id,
    img: event.img,
    height: heightVariations[index] || 250, // Use predefined heights for better distribution
    title: event.title,
    description: event.description,
    url: "#" // Add URL for click functionality
  }));

  return (
    <section id="events" className="py-32 px-6 bg-gradient-to-br from-blue-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-8 tracking-wide">
            Events & Training
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Elevate your design practice through our comprehensive bootcamps, workshops, and masterclasses.
          </p>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Why Attend Our Events */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">
                Why Attend Our Events?
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#fb8500]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] mb-2">Skill Mastery</h4>
                    <p className="text-gray-600">Learn advanced design techniques, industry best practices, and cutting-edge tools from expert practitioners.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#fb8500]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] mb-2">Business Acumen</h4>
                    <p className="text-gray-600">Master pricing strategies, client management, contract negotiation, and building sustainable creative businesses.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#fb8500]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] mb-2">Network Growth</h4>
                    <p className="text-gray-600">Connect with like-minded designers, potential collaborators, mentors, and industry leaders in your field.</p>
                  </div>
                </div>
              </div>
              
              {/* Explore Button */}
              <div className="pt-4">
                <a 
                  href="/events"
                  className="inline-flex items-center gap-2 bg-[#fb8500] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e6780e] transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  Explore Events
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M7 17l9.2-9.2M17 17V7H7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Custom Image Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
            {events.map((event, index) => (
              <div 
                key={event.id}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                style={{ 
                  gridRowEnd: `span ${Math.ceil(heightVariations[index] / 80)}` // Dynamic row span
                }}
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;