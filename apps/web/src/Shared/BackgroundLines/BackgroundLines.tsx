import { cn } from '@/lib/utils';
import Section from '../Seaction/Section';

interface Props {
  className?: string;
  children: React.ReactNode;
  gridCols?: number;
}

const BackgroundLines = ({ className, gridCols = 8, children }: Props) => {
  return (
    <div className={cn('relative z-10', className)}>
      <div className="bg-linear-to-b from-black to-transparent z-10 absolute inset-0" />
      <div className="z-0 absolute inset-0 grid grid-cols-2 md:grid-cols-8 pointer-events-none">
        {Array.from({ length: gridCols }).map((_, i) => (
          <div
            key={i}
            className="border-r border-zinc-300/30 h-full last:border-r-0"
          />
        ))}
      </div>
      <Section className="relative z-20">{children}</Section>
    </div>
  );
};

export default BackgroundLines;
