/**
 * Serene Project Preview Page Wrapper
 * Loads mock data and renders SereneProjectPage
 */

import React from 'react';
import SereneProjectPage from '../templates/Serene/SereneProjectPage';

const SereneProjectPreviewPage = () => {
  // Mock data that matches SerenePreviewPage
  const mockData = {
    navigation: {
      logo: 'Preview',
      menuItems: [
        { label: 'About', link: '/template-preview/serene/about' }
      ]
    },
    hero: {
      title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      description1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      description2: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    gallery: {
      heroText1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      heroText2: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      firstRow: [
        {
          id: 'project-1',
          image: '/portfolios/10.jpg',
          title: 'Project One',
          description: 'Creative design showcase',
          detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          span: 2
        },
        {
          id: 'project-2',
          image: '/portfolios/12.jpg',
          title: 'Project Two',
          description: 'Innovative visual concept',
          detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
          span: 1
        },
        {
          id: 'project-3',
          image: '/portfolios/13.jpg',
          title: 'Project Three',
          description: 'Modern artistic approach',
          detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
          span: 2
        }
      ],
      secondRow: [
        {
          id: 'project-4',
          image: '/portfolios/4.png',
          title: 'Project Four',
          description: 'Contemporary design study',
          detailedDescription: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
          span: 2
        },
        {
          id: 'project-5',
          image: '/portfolios/5.jpg',
          title: 'Project Five',
          description: 'Elegant composition work',
          detailedDescription: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
          span: 3
        },
        {
          id: 'project-6',
          image: '/portfolios/6.jpg',
          title: 'Project Six',
          description: 'Minimalist aesthetic vision',
          detailedDescription: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error.\n\nVoluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
          span: 2
        },
        {
          id: 'project-7',
          image: '/portfolios/7.jpg',
          title: 'Project Seven',
          description: 'Bold creative expression',
          detailedDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.\n\nQui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
          span: 2
        }
      ],
      thirdRow: [
        {
          id: 'project-8',
          image: '/portfolios/8.jpg',
          title: 'Project Eight',
          description: 'Strategic visual design',
          detailedDescription: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.\n\nQuam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus.',
          span: 2
        },
        {
          id: 'project-9',
          image: '/portfolios/9.jpg',
          title: 'Project Nine',
          description: 'Refined artistic detail',
          detailedDescription: 'Qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.\n\nId est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.',
          span: 2
        },
        {
          id: 'project-10',
          image: '/portfolios/10.jpg',
          title: 'Project Ten',
          description: 'Sophisticated visual narrative',
          detailedDescription: 'Cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.\n\nSaepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.',
          span: 1
        }
      ]
    },
    about: {
      bio1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      tagline: ' Ut enim ad minim veniam quis nostrud.',
      bio2: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      bio3: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'
    }
  };

  const sereneColors = {
    primary: '#4a5568',
    secondary: '#9ca3af',
    accent: '#e5e7eb',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#6b7280',
    textSecondary: '#9ca3af',
    border: '#e5e7eb'
  };

  const sereneFonts = {
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    monoFont: "'Inter', sans-serif"
  };

  return (
    <SereneProjectPage
      content={mockData}
      styling={{ colors: sereneColors, fonts: sereneFonts }}
      baseUrl="/template-preview/serene"
    />
  );
};

export default SereneProjectPreviewPage;
