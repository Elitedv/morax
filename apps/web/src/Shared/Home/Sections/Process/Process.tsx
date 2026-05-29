'use client';
import Section from '@/Shared/Seaction/Section';
import SectionHeading from '../../components/SectionHeading';
import ProcessCards from './ProcessCards';

const Process = () => {
  return (
    <Section className="py-24 text-white">
      <SectionHeading
        badge="PROCESS"
        title="How Morax Works"
        description="THE 3-PHASE PROCESS"
      />
      <ProcessCards />
    </Section>
  );
};

export default Process;
