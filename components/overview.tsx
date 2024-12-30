import { motion } from 'framer-motion';

import { MessageIcon, } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <MessageIcon size={24} />
        </p>
        <p>
          Hello, I am OliveAI.
        </p>
        <p>
          I am here to help you share your dining experience at one of our Olive Garden restaurants. Feel free to:
        </p>
        <ul className="list-disc text-left max-w-md mx-auto space-y-2">
          <li>Share feedback about your recent visit</li>
          <li>Report any concerns</li>
          <li>Suggest improvements to our service</li>
        </ul>
        <p>
          Feel free to chat with me naturally, just as you would with any of our team members.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Do not share any sensitive personal information, payment details, or private data.
        </p>
      </div>
    </motion.div>
  );
};
