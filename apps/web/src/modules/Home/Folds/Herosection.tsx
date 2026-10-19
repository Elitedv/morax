import Section from '@/Shared/Seaction/Section';
import InstallCommand from '../components/InstallCommand';

const Herosection = () => {
  return (
    <Section>
      <div className="min-h-[500px] flex flex-col justify-center py-10">
        <div className="text-2xl md:text-5xl lg:text-6xl lg:leading-18">
          <h1 className="text-white">The Fastest Way to Start a</h1>
          <h2 className="text-white">
            <span className="text-orange-500 mr-2 md:mr-4 font-semibold">
              PNPM Workspaces
            </span>
            Monorepo
          </h2>
        </div>

        {/* CLI Download Btn */}
        <InstallCommand className="mt-10" />
      </div>
    </Section>
  );
};

export default Herosection;
