import React, { useState } from "react";
import { Link } from "react-router-dom";
import SplitText from "../components/Shared/SplitText";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const EventsPage = () => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const events = [
    {
      id: 1,
      title: "Design Leadership Bootcamp",
      description: "Master the art of leading design teams and driving creative vision in organizations",
      image: "/event-pics/EPW_24_Website-scaled.jpg",
      duration: "3 days",
      level: "Advanced",
      date: "March 15-17, 2026",
      location: "Factory Phnom Penh",
      price: "$0"
    },
    {
      id: 2,
      title: "Creative Conference 2025",
      description: "Join industry leaders for cutting-edge design trends and networking opportunities",
      image: "/event-pics/679b93cf71c53f6a4e4308f5_offf-barcelona.jpg",
      duration: "2 days",
      level: "All Levels",
      date: "April 22-23, 2026",
      location: "ACT Lab - AUPP",
      price: "$0"
    },
    {
      id: 3,
      title: "Branding Workshop",
      description: "Deep dive into brand strategy, visual identity, and storytelling techniques",
      image: "/event-pics/92457f954fd0f4c470a7a3ca8521339d72495765_944.jpg",
      duration: "1 day",
      level: "Intermediate",
      date: "May 10, 2026",
      location: "Cambodia Academy of Digital Technology",
      price: "$0"
    },
    {
      id: 4,
      title: "Business Skills Masterclass",
      description: "Learn pricing strategies, client management, and freelance business fundamentals",
      image: "/event-pics/a1.jpg",
      duration: "2 days",
      level: "Beginner",
      date: "June 5-6, 2026",
      location: "Cosmo Hall 4th Floor",
      price: "$0"
    },
    {
      id: 5,
      title: "Digital Design Workshop",
      description: "Advanced techniques in UI/UX design, prototyping, and user research methodologies",
      image: "/event-pics/flyer.jpg",
      duration: "1 day",
      level: "Intermediate",
      date: "July 12, 2026",
      location: "Factory Phnom Penh",
      price: "$0"
    },
    {
      id: 6,
      title: "Portfolio Optimization Bootcamp",
      description: "Transform your portfolio into a client-attracting powerhouse that wins projects",
      image: "/event-pics/graphic-design-for-events-branding-1024x560.webp",
      duration: "2 days",
      level: "All Levels",
      date: "August 20-21, 2026",
      location: "ACT Lab - AUPP",
      price: "$0"
    }
  ];

  const handleJoinClick = () => {
    setShowMaintenanceModal(true);
  };

  const closeMaintenanceModal = () => {
    setShowMaintenanceModal(false);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email && name) {
      setShowNewsletterModal(true);
      setEmail("");
      setName("");
    }
  };

  const closeNewsletterModal = () => {
    setShowNewsletterModal(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <SplitText
            text="EVENTS & WORKSHOPS"
            tag="h1"
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-800 tracking-wide"
            delay={80}
            duration={0.8}
            from={{ opacity: 0, y: 60 }}
            to={{ opacity: 1, y: 0 }}
            ease="power3.out"
          />
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Elevate your design career through our comprehensive training programs. From creative mastery to business excellence, we've crafted experiences that transform talented designers into industry leaders.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-lg text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#fb8500] rounded-full"></div>
              <span>Expert-Led Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#fb8500] rounded-full"></div>
              <span>Hands-On Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#fb8500] rounded-full"></div>
              <span>Industry Networking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#fb8500] rounded-full"></div>
              <span>Career Growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Our Events Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Why Join Our Events?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our carefully curated workshops and events are designed to bridge the gap between creative talent and business success. Whether you're a seasoned designer looking to lead or a newcomer seeking foundational skills, our programs offer practical knowledge you can immediately apply to your career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#fb8500] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Expert-Led Learning</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of real-world experience in design leadership and creative business management.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#fb8500] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Networking Opportunities</h3>
              <p className="text-gray-600">
                Connect with like-minded creatives, potential collaborators, and industry leaders who can accelerate your career growth.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#fb8500] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Practical Skills</h3>
              <p className="text-gray-600">
                Gain actionable insights and tools that you can immediately implement in your current projects and career development.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4 text-center">What You'll Take Away</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fb8500] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Strategic thinking approaches for creative problem-solving</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fb8500] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Business fundamentals every creative professional needs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fb8500] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Portfolio optimization techniques that attract clients</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fb8500] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Leadership skills for managing creative teams</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fb8500] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Pricing strategies that reflect your true value</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fb8500] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Industry connections and mentorship opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="events" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#1a1a1a] mb-4">
            Upcoming Events
          </h2>
          
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Join our carefully curated workshops and bootcamps designed to push the boundaries of your creative potential and business acumen.
          </p>

          {/* See All Link */}
          <div className="text-center mb-16">
            <Link 
              to="/events/all"
              className="inline-flex items-center gap-2 text-[#fb8500] hover:text-[#e6780e] font-semibold text-lg transition-colors duration-300 hover:underline"
            >
              See All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div key={event.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#fb8500]/30 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#fb8500] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {event.level}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#fb8500] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {event.duration}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-[#fb8500]">
                      {event.price}
                    </span>
                    <button
                      onClick={handleJoinClick}
                      className="bg-[#fb8500] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#e6780e] transition-all duration-300 shadow-md hover:shadow-lg hover:transform hover:-translate-y-1"
                    >
                      Join Workshop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-20 px-6 bg-gradient-to-br from-blue-50/30 to-purple-50/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            Stay Updated with Upcoming Events
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Be the first to know about our latest workshops, bootcamps, and creative events. Get exclusive access to early bird registration and special offers delivered straight to your inbox.
          </p>
          
          {/* Newsletter Signup Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">
              Subscribe to Our Newsletter
            </h3>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-left text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent outline-none transition-all duration-300"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-left text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fb8500] focus:border-transparent outline-none transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#fb8500] text-white py-4 px-8 rounded-2xl font-semibold hover:bg-[#e6780e] transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1"
              >
                Subscribe to Newsletter
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              Join our community of creative professionals and never miss an opportunity to level up your design career.
            </p>
          </div>
        </div>
      </section>

            {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-white bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button 
              onClick={closeMaintenanceModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">Under Development</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our workshop registration system is currently being enhanced to provide you with the best experience. Please check back soon!
              </p>
              <button 
                onClick={closeMaintenanceModal}
                className="bg-[#fb8500] text-white px-6 py-2 rounded-lg hover:bg-[#e6780e] transition-colors duration-300"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Subscription Success Modal */}
      {showNewsletterModal && (
        <div className="fixed inset-0 bg-white bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button 
              onClick={closeNewsletterModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">Thank You for Subscribing!</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                <strong>Welcome to our community!</strong> We'll be informing you about upcoming workshops, exclusive events, and creative opportunities. Stay tuned for exciting updates!
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-orange-700 text-sm">
                  <strong>What's next?</strong> Check your email for a welcome message and be ready for amazing design events coming your way.
                </p>
              </div>
              <button 
                onClick={closeNewsletterModal}
                className="bg-[#fb8500] text-white px-6 py-2 rounded-lg hover:bg-[#e6780e] transition-colors duration-300"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventsPage;