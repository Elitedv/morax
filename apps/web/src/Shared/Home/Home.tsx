import Navbar from '../Navbar';
import Herosection from './Sections/Herosection';
import MoraxImage from './Sections/MoraxImage';

const Home = () => {
  const navItems = [
    { label: 'Github', href: 'https://github.com/Elitedv/morax' },
    { label: 'NPM', href: 'https://www.npmjs.com/package/create-morax' },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar navItems={navItems} />
      <Herosection />
      <MoraxImage />
    </div>
  );
};

export default Home;
