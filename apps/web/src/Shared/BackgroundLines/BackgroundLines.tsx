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
      <div className="bg-linear-to-b from-black via-transparent to-transparent z-10 fixed top-0 left-0 w-full h-full" />
      <div className="z-0 absolute inset-0 grid grid-cols-4 md:grid-cols-8 pointer-events-none">
        {Array.from({ length: gridCols }).map((_, i) => (
          <div
            key={i}
            className="border-r border-zinc-300/30 h-full last:border-r-0"
          />
        ))}
      </div>
      <div className="relative z-20 ">{children}</div>
    </div>
  );
};

export default BackgroundLines;
