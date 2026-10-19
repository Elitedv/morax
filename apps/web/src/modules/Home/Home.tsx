import Herosection from './Folds/Herosection';
import MoraxImage from './Folds/MoraxImage';
import Process from './Folds/Process/Process';
import Features from './Folds/Features/Features';
import Workflow from './Folds/Workflow/Workflow';
import BackgroundLines from '@/Shared/BackgroundLines/BackgroundLines';
import Navbar from '@/Shared/Navbar';
import CTA from '@/Shared/CTA/CTA';
import Footer from '@/Shared/Footer/Footer';

const Home = () => {
  const navItems = [
    { label: 'Docs', href: '/docs/installation' },
    { label: 'Github', href: 'https://github.com/Elitedv/morax' },
    { label: 'NPM', href: 'https://www.npmjs.com/package/create-morax' },
  ];

  return (
    <div className="bg-black min-h-screen">
      <BackgroundLines>
        <Navbar navItems={navItems} />
        <Herosection />
        <MoraxImage />
        <Process />
        <Features />
        <Workflow />
        <CTA />
        <Footer />
      </BackgroundLines>
    </div>
  );
};

export default Home;
