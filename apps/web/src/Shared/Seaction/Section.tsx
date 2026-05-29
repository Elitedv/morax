import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section = ({ children, className, id }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn('max-w-[1800px] mx-auto px-6 md:px-20 py-4', className)}
    >
      {children}
    </section>
  );
};

export default Section;
