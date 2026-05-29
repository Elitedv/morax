import Section from '@/Shared/Seaction/Section';
import SectionHeading from '../../components/SectionHeading';
import FeatureCards from './FeatureCards';

const Features = () => {
  return (
    <Section id="feature" className="py-24 text-white">
      <SectionHeading
        badge="FEATURES"
        title="Powerful Scaffolding. Zero Manual Setup"
        description="Six custom workspace engines working in parallel to orchestrate your entire monorepo"
      />
      <FeatureCards />
    </Section>
  );
};

export default Features;
