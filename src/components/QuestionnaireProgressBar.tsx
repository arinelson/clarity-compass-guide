
import { motion } from "framer-motion";

interface QuestionnaireProgressBarProps {
  progress: number;
}

const QuestionnaireProgressBar = ({ progress }: QuestionnaireProgressBarProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <motion.span 
          className="text-sm font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Seu progresso
        </motion.span>
        <motion.span 
          className="text-sm font-medium"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {progress}%
        </motion.span>
      </div>
      <div className="progress-bar bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          className="progress-value bg-primary h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      {progress > 75 && (
        <motion.div 
          className="mt-1 text-xs text-right text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Quase lá!
        </motion.div>
      )}
    </div>
  );
};

export default QuestionnaireProgressBar;
