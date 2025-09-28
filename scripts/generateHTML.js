import fs from 'fs';
import path from 'path';

// Portfolio data that will be injected into the template
const portfolioData = {
  name: "{{name}}",
  title: "{{title}}",
  description: "{{description}}",
  profileImage: "{{profileImage}}",
  aboutHeading: "{{aboutHeading}}",
  aboutContent: "{{aboutContent}}",
  aboutImage: "{{aboutImage}}",
  skills: ["{{skill_0}}", "{{skill_1}}", "{{skill_2}}", "{{skill_3}}", "{{skill_4}}", "{{skill_5}}"],
  portfolioHeading: "{{portfolioHeading}}",
  projects: [
    {
      id: 1,
      title: "{{project_0_title}}",
      description: "{{project_0_description}}",
      image: "{{project_0_image}}",
      category: "branding",
      tags: ["{{project_0_tag_0}}", "{{project_0_tag_1}}"]
    },
    {
      id: 2,
      title: "{{project_1_title}}",
      description: "{{project_1_description}}",
      image: "{{project_1_image}}",
      category: "web",
      tags: ["{{project_1_tag_0}}", "{{project_1_tag_1}}"]
    },
    {
      id: 3,
      title: "{{project_2_title}}",
      description: "{{project_2_description}}",
      image: "{{project_2_image}}",
      category: "print",
      tags: ["{{project_2_tag_0}}", "{{project_2_tag_1}}"]
    }
  ],
  contactHeading: "{{contactHeading}}",
  contactDescription: "{{contactDescription}}",
  socialLinks: [
    { platform: 'linkedin', url: '{{social_linkedin_url}}' },
    { platform: 'dribbble', url: '{{social_dribbble_url}}' },
    { platform: 'behance', url: '{{social_behance_url}}' }
  ]
};

const getSocialIcon = (platform) => {
  const icons = {
    linkedin: 'fab fa-linkedin-in',
    dribbble: 'fab fa-dribbble',
    behance: 'fab fa-behance',
    github: 'fab fa-github',
    twitter: 'fab fa-twitter',
    instagram: 'fab fa-instagram'
  };
  return icons[platform] || 'fas fa-link';
};

// Generate HTML template
const generateHTML = () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolioData.name} - ${portfolioData.title} Portfolio</title>
  <meta name="description" content="${portfolioData.description}">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            'sans': ['Inter', 'ui-sans-serif', 'system-ui']
          }
        }
      }
    }
  </script>
</head>
<body class="font-sans text-gray-900 leading-relaxed">
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="text-xl font-bold text-gray-900">
          <a href="#hero">${portfolioData.name}</a>
        </div>
        <div class="hidden md:flex space-x-8">
          <a href="#hero" class="text-gray-700 hover:text-gray-900 transition-colors">Home</a>
          <a href="#about" class="text-gray-700 hover:text-gray-900 transition-colors">About</a>
          <a href="#portfolio" class="text-gray-700 hover:text-gray-900 transition-colors">Work</a>
          <a href="#contact" class="text-gray-700 hover:text-gray-900 transition-colors">Contact</a>
        </div>
        <button class="md:hidden flex flex-col space-y-1" onclick="toggleMobileMenu()">
          <span class="w-6 h-0.5 bg-gray-900"></span>
          <span class="w-6 h-0.5 bg-gray-900"></span>
          <span class="w-6 h-0.5 bg-gray-900"></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center pt-20">
    <div class="container mx-auto px-6">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-1 text-center lg:text-left">
          <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            ${portfolioData.name}
          </h1>
          <h2 class="text-2xl lg:text-3xl text-gray-600 mb-6">
            ${portfolioData.title}
          </h2>
          <p class="text-lg text-gray-700 mb-8 max-w-2xl">
            ${portfolioData.description}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a 
              href="#portfolio" 
              class="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              View My Work
            </a>
            <a 
              href="#contact" 
              class="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors text-center"
            >
              Get In Touch
            </a>
          </div>
          <div class="flex gap-4 mt-8 justify-center lg:justify-start">
            ${portfolioData.socialLinks.map(link => `
            <a 
              href="${link.url}" 
              class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white transition-colors"
            >
              <i class="${getSocialIcon(link.platform)}"></i>
            </a>
            `).join('')}
          </div>
        </div>
        <div class="flex-1 max-w-lg">
          <div class="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center shadow-2xl">
            <span class="text-gray-500">Profile Image Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <div class="flex flex-col lg:flex-row gap-12 items-center">
        <div class="flex-1">
          <h2 class="text-4xl font-bold text-gray-900 mb-6">
            ${portfolioData.aboutHeading}
          </h2>
          <p class="text-lg text-gray-700 mb-8">
            ${portfolioData.aboutContent}
          </p>
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-gray-900">Skills & Expertise</h3>
            <div class="flex flex-wrap gap-3">
              ${portfolioData.skills.map(skill => `
              <span class="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                ${skill}
              </span>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="flex-1 max-w-lg">
          <div class="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
            <span class="text-gray-500">About Image Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Portfolio Section -->
  <section id="portfolio" class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          ${portfolioData.portfolioHeading}
        </h2>
        <p class="text-lg text-gray-600">
          A selection of my recent work and projects
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${portfolioData.projects.map(project => `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
          <div class="aspect-video overflow-hidden">
            <div class="w-full h-full bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <span class="text-gray-500">Project Image</span>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              ${project.title}
            </h3>
            <p class="text-gray-600 mb-4">
              ${project.description}
            </p>
            <div class="flex flex-wrap gap-2">
              ${project.tags.map(tag => `
              <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                ${tag}
              </span>
              `).join('')}
            </div>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-20 bg-white">
    <div class="container mx-auto px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          ${portfolioData.contactHeading}
        </h2>
        <p class="text-lg text-gray-600 mb-12">
          ${portfolioData.contactDescription}
        </p>
        <div class="bg-gray-50 rounded-2xl p-8">
          <form class="space-y-6" onsubmit="handleFormSubmit(event)">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea 
                rows="6"
                name="message"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Tell me about your project"
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              class="w-full bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="text-xl font-bold mb-4 md:mb-0">
          ${portfolioData.name}
        </div>
        <div class="flex gap-4">
          ${portfolioData.socialLinks.map(link => `
          <a 
            href="${link.url}" 
            class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <i class="${getSocialIcon(link.platform)}"></i>
          </a>
          `).join('')}
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-gray-400">
          © 2024 ${portfolioData.name}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

  <script>
    // Mobile menu toggle
    function toggleMobileMenu() {
      // Add mobile menu functionality here
      console.log('Mobile menu toggled');
    }

    // Form submission handler
    function handleFormSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);
      console.log('Form submitted:', data);
      alert('Thank you for your message! I will get back to you soon.');
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
      const nav = document.querySelector('nav');
      if (window.scrollY > 100) {
        nav.classList.add('bg-white');
        nav.classList.remove('bg-white/90');
      } else {
        nav.classList.remove('bg-white');
        nav.classList.add('bg-white/90');
      }
    });
  </script>
</body>
</html>`;

  return html;
};

// Create output directory
const outputDir = './html-output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate and write HTML file
const htmlContent = generateHTML();
fs.writeFileSync(path.join(outputDir, 'portfolio-template.html'), htmlContent);

console.log('✅ HTML template generated successfully!');
console.log('📁 Output location: ./html-output/portfolio-template.html');
console.log('🚀 Open the file in your browser to see the result');

export default generateHTML;