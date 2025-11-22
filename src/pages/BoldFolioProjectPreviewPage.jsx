import React from 'react';
import BoldFolioProjectPage from '../templates/BoldFolio/BoldFolioProjectPage';

const BoldFolioProjectPreviewPage = () => {
  // Mock data for BoldFolio template project preview - same data as BoldFolioPreviewPage
  const mockData = {
    work: {
      projects: [
        {
          id: 'project-1',
          title: 'Alpine Vision',
          description: 'A flexible design identity that<br />strengthens the overall image<br />through bold typography and<br />striking visual elements.',
          detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          images: [
            {
              width: '580px',
              height: '380px',
              src: '/portfolios/1.png'
            },
            {
              width: '450px',
              height: '280px',
              src: '/portfolios/2.png'
            }
          ],
          logo: '<span style="font-size: 60px; letter-spacing: 8px; font-weight: 700;">ALPINE</span>',
          link: ''
        },
        {
          id: 'project-2',
          title: 'Creative Studio',
          description: 'Brand identity and<br />creative campaign showcasing<br />contemporary design thinking<br />and visual innovation.',
          detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.',
          images: [
            {
              width: '250px',
              height: '280px',
              src: '/portfolios/3.png'
            },
            {
              width: '580px',
              height: '380px',
              src: '/portfolios/4.png'
            }
          ],
          logo: '',
          link: ''
        },
        {
          id: 'project-3',
          title: 'Modern Elegance',
          description: 'Identity and visual system<br />combining minimalism with<br />bold design statements.',
          detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
          images: [
            {
              width: '250px',
              height: '280px',
              src: '/portfolios/5.jpg'
            },
            {
              width: '500px',
              height: '500px',
              src: '/portfolios/6.jpg'
            }
          ],
          logo: '',
          link: ''
        }
      ]
    }
  };

  // BoldFolio template styling
  const boldFolioColors = {
    primary: '#ff0080',
    secondary: '#000000',
    accent: '#ff0080',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666'
  };

  const boldFolioFonts = {
    heading: 'Graphik, sans-serif',
    body: 'Graphik, sans-serif'
  };

  return (
    <BoldFolioProjectPage
      content={mockData}
      styling={{ colors: boldFolioColors, fonts: boldFolioFonts }}
      baseUrl="/template-preview/boldfolio"
    />
  );
};

export default BoldFolioProjectPreviewPage;
