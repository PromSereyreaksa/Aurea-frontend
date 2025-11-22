import React from 'react';
import ChicProjectPage from '../templates/Chic/ChicProjectPage';

const ChicProjectPreviewPage = () => {
  // Mock data for Chic template project preview - same data as ChicPreviewPage
  const mockData = {
    work: {
      projects: [
        {
          id: 'project-1',
          title: 'PROJECT ONE',
          subtitle: 'Creative Direction',
          description: 'A comprehensive brand identity project showcasing strategic visual design.',
          detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          image: '/portfolios/1.png',
          category: 'Brand Identity',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-2',
          title: 'PROJECT TWO',
          subtitle: 'Visual Design',
          description: 'An exploration of contemporary visual language in editorial design.',
          detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
          image: '/portfolios/2.png',
          category: 'Editorial',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-3',
          title: 'PROJECT THREE',
          subtitle: 'Art Direction',
          description: 'Bold art direction combining photography and graphic design elements.',
          detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
          image: '/portfolios/3.png',
          category: 'Digital',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-4',
          title: 'PROJECT FOUR',
          subtitle: 'Brand Strategy',
          description: 'Strategic branding work focused on market positioning and visual identity.',
          detailedDescription: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
          image: '/portfolios/4.png',
          category: 'Branding',
          year: '2023',
          awards: '',
          link: ''
        },
        {
          id: 'project-5',
          title: 'PROJECT FIVE',
          subtitle: 'Design System',
          description: 'Comprehensive design system for digital product development.',
          detailedDescription: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
          image: '/portfolios/5.jpg',
          category: 'UX/UI',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-6',
          title: 'PROJECT SIX',
          subtitle: 'Print Design',
          description: 'Elegant print design exploring tactile materials and production techniques.',
          detailedDescription: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
          image: '/portfolios/6.jpg',
          category: 'Print',
          year: '2023',
          awards: '',
          link: ''
        }
      ]
    }
  };

  // Chic template styling
  const chicColors = {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#141414',
    textBody: '#282828',
    textLight: '#666666',
    textMuted: '#818181',
    accent: '#FF00A1',
    accentSecondary: '#E86223',
    hover: '#E86223',
    border: '#d6d6d6',
    borderDark: '#282828'
  };

  const chicFonts = {
    inter: '"Inter", -apple-system, system-ui, sans-serif',
    headingFont: '"Inter", -apple-system, system-ui, sans-serif',
    monoFont: '"SF Mono", monospace'
  };

  return (
    <ChicProjectPage
      content={mockData}
      styling={{ colors: chicColors, fonts: chicFonts }}
      baseUrl="/template-preview/chic"
    />
  );
};

export default ChicProjectPreviewPage;
