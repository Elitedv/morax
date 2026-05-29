import Section from '@/Shared/Seaction/Section';
import Image from 'next/image';

const MoraxImage = () => {
  return (
    <Section>
      <div className="group w-full bg-[#ff5a00] text-black overflow-hidden flex flex-col transition-all duration-300 border border-black/10">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-3.5 border-b border-black text-[11px] font-mono tracking-wider uppercase font-medium">
          <span>2026</span>
          <span>CLI Project</span>
        </div>

        {/* Title & Arrow Bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-8 md:py-10 border-b border-black">
          <h2 className="text-4xl md:text-6xl lg:text-7xl uppercase ">morax</h2>
          <span className="text-4xl md:text-6xl lg:text-7xl font-light transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 select-none">
            ↗
          </span>
        </div>

        {/* Image Area */}
        <div className="w-full relative bg-[#ff5a00] flex items-center justify-center p-6 md:p-14">
          <Image
            height={2000}
            width={2000}
            alt="Morax CLI Preview"
            src="/morax-image.png"
            className="w-full h-auto object-contain bg-black p-4 mix-blend-hard-light "
          />
        </div>
      </div>
    </Section>
  );
};

export default MoraxImage;
