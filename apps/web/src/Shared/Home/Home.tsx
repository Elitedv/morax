import BackgroundLines from '../BackgroundLines/BackgroundLines';
import Navbar from '../Navbar';
import Herosection from './Sections/Herosection';
import MoraxImage from './Sections/MoraxImage';
import Process from './Sections/Process/Process';

const Home = () => {
  const navItems = [
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
      </BackgroundLines>
    </div>
  );
};

export default Home;
