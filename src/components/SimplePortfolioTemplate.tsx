import React from 'react';

interface PortfolioTemplateProps {
  name?: string;
  title?: string;
  description?: string;
  profileImage?: string;
  aboutHeading?: string;
  aboutContent?: string;
  aboutImage?: string;
  skills?: string[];
  portfolioHeading?: string;
  projects?: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    tags: string[];
  }>;
  contactHeading?: string;
  contactDescription?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  isStatic?: boolean;
}

const PortfolioTemplate = ({
  name = "Your Name",
  title = "Creative Designer",
  description = "Passionate about creating beautiful, functional designs that tell stories and solve problems.",
  profileImage = "",
  aboutHeading = "About Me",
  aboutContent = "I'm a creative designer with over 5 years of experience in visual design, branding, and user experience. I believe in the power of good design to transform ideas into compelling visual narratives.",
  aboutImage = "",
  skills = ['UI/UX Design', 'Branding', 'Typography', 'Illustration', 'Figma', 'Adobe Creative Suite'],
  portfolioHeading = "My Work",
  projects = [
    {
      id: 1,
      title: 'Project One',
      description: 'Description of your amazing project',
      image: '',
      category: 'branding',
      tags: ['Branding', 'Logo Design']
    },
    {
      id: 2,
      title: 'Project Two',
      description: 'Description of your amazing project',
      image: '',
      category: 'web',
      tags: ['Web Design', 'UI/UX']
    },
    {
      id: 3,
      title: 'Project Three',
      description: 'Description of your amazing project',
      image: '',
      category: 'print',
      tags: ['Print Design', 'Typography']
    }
  ],
  contactHeading = "Let's Work Together",
  contactDescription = "I'm always interested in new projects and opportunities.",
  socialLinks = [
    { platform: 'linkedin', url: 'https://linkedin.com/in/yourname' },
    { platform: 'dribbble', url: 'https://dribbble.com/yourname' },
    { platform: 'behance', url: 'https://behance.net/yourname' }
  ],
  isStatic = true
}: PortfolioTemplateProps) => {
  
  // Helper function to replace placeholders when in static mode
  function replaceWith(key: string, actualValue: any) {
    return isStatic ? `{{${key}}}` : actualValue;
  }

  const getSocialIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      linkedin: 'fab fa-linkedin-in',
      dribbble: 'fab fa-dribbble',
      behance: 'fab fa-behance',
      github: 'fab fa-github',
      twitter: 'fab fa-twitter',
      instagram: 'fab fa-instagram'
    };
    return icons[platform] || 'fas fa-link';
  };

  return (
    <div className="font-sans text-gray-900 leading-relaxed">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
              <a href="#hero">{replaceWith('name', name)}</a>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#hero" className="text-gray-700 hover:text-gray-900 transition-colors">Home</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
              <a href="#portfolio" className="text-gray-700 hover:text-gray-900 transition-colors">Work</a>
              <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <button className="md:hidden flex flex-col space-y-1">
              <span className="w-6 h-0.5 bg-gray-900"></span>
              <span className="w-6 h-0.5 bg-gray-900"></span>
              <span className="w-6 h-0.5 bg-gray-900"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center pt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {replaceWith('name', name)}
              </h1>
              <h2 className="text-2xl lg:text-3xl text-gray-600 mb-6">
                {replaceWith('title', title)}
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                {replaceWith('description', description)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="#portfolio" 
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
                >
                  View My Work
                </a>
                <a 
                  href="#contact" 
                  className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors text-center"
                >
                  Get In Touch
                </a>
              </div>
              <div className="flex gap-4 mt-8 justify-center lg:justify-start">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={replaceWith(`social_${link.platform}_url`, link.url)} 
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <i className={getSocialIcon(link.platform)}></i>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              {profileImage ? (
                <img 
                  src={replaceWith('profileImage', profileImage)} 
                  alt={replaceWith('name', name)}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500">Profile Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {replaceWith('aboutHeading', aboutHeading)}
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                {replaceWith('aboutContent', aboutContent)}
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {replaceWith(`skill_${index}`, skill)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              {aboutImage ? (
                <img 
                  src={replaceWith('aboutImage', aboutImage)} 
                  alt="About"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500">About Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {replaceWith('portfolioHeading', portfolioHeading)}
            </h2>
            <p className="text-lg text-gray-600">
              A selection of my recent work and projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-video overflow-hidden">
                  {project.image ? (
                    <img 
                      src={replaceWith(`project_${index}_image`, project.image)} 
                      alt={replaceWith(`project_${index}_title`, project.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Project Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {replaceWith(`project_${index}_title`, project.title)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {replaceWith(`project_${index}_description`, project.description)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {replaceWith(`project_${index}_tag_${tagIndex}`, tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {replaceWith('contactHeading', contactHeading)}
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              {replaceWith('contactDescription', contactDescription)}
            </p>
            <div className="bg-gray-50 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Tell me about your project"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-xl font-bold mb-4 md:mb-0">
              {replaceWith('name', name)}
            </div>
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={replaceWith(`social_${link.platform}_url`, link.url)} 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <i className={getSocialIcon(link.platform)}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 {replaceWith('name', name)}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioTemplate;