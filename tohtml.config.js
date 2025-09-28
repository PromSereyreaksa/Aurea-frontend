// tohtml.config.js
export const settings = {
  content: [
    {
      path: './src/components/PortfolioTemplate.tsx',
      props: {
        name: "Your Name",
        title: "Creative Designer", 
        description: "Passionate about creating beautiful, functional designs that tell stories and solve problems.",
        profileImage: "",
        aboutHeading: "About Me",
        aboutContent: "I'm a creative designer with over 5 years of experience in visual design, branding, and user experience. I believe in the power of good design to transform ideas into compelling visual narratives.",
        aboutImage: "",
        skills: ['UI/UX Design', 'Branding', 'Typography', 'Illustration', 'Figma', 'Adobe Creative Suite'],
        portfolioHeading: "My Work",
        projects: [
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
        contactHeading: "Let's Work Together",
        contactDescription: "I'm always interested in new projects and opportunities.",
        socialLinks: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/yourname' },
          { platform: 'dribbble', url: 'https://dribbble.com/yourname' },
          { platform: 'behance', url: 'https://behance.net/yourname' }
        ],
        isStatic: true
      },
    }
  ],
  globalStyles: './src/index.css',
  pageHeight: '297mm', // A4
  pageWidth: '210mm', // A4
  outputDir: './html-output',
  outputFormat: 'pretty',
};