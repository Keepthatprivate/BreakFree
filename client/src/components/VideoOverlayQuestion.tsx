import { motion } from 'framer-motion';
import { introConfig, Gender } from '@/data/introConfig';

interface VideoOverlayQuestionProps {
  onSelect: (gender: Gender) => void;
  show: boolean;
}

export default function VideoOverlayQuestion({ onSelect, show }: VideoOverlayQuestionProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 border border-white/20 p-6 sm:p-8 rounded-2xl text-center text-white max-w-sm mx-4 shadow-2xl"
      >
        <p className="text-lg sm:text-xl font-lora mb-6 leading-relaxed">
          Which child feels more like you?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onSelect('boy')}
            data-testid="button-select-boy"
            className="bg-[#54d3bb] hover:bg-[#45c4ac] active:scale-95 px-6 py-3 rounded-lg font-inter font-medium text-white transition-all duration-200 shadow-lg min-w-[100px]"
          >
            Boy
          </button>
          <button
            onClick={() => onSelect('girl')}
            data-testid="button-select-girl"
            className="bg-[#54d3bb] hover:bg-[#45c4ac] active:scale-95 px-6 py-3 rounded-lg font-inter font-medium text-white transition-all duration-200 shadow-lg min-w-[100px]"
          >
            Girl
          </button>
        </div>
      </motion.div>
    </div>
  );
}
