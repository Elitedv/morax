interface SectionHeadingProps {
  title?: string;
  badge?: string;
  description?: string;
}

const SectionHeading = ({
  title = 'Process',
  badge = 'Process',
  description = 'Your complete sales engine in three simple phases',
}: SectionHeadingProps) => {
  return (
    <>
      {/* 1. Header Section */}
      <div className="flex flex-col items-center justify-center mb-16">
        {/* Centered Badge */}
        <div className="flex items-center gap-2 mb-4 font-mono text-sm">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-caret-blink shadow-[0_0_8px_#f97316]"></span>{' '}
          {badge}
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-center max-w-4xl leading-tight">
          {title}
        </h2>

        {/* Monospace Sub-heading */}
        <p className="font-mono text-xs md:text-[13px] text-zinc-500 mt-4 tracking-wider text-center uppercase select-none">
          {description}
        </p>
      </div>
    </>
  );
};

export default SectionHeading;
