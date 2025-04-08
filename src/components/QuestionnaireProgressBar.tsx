
import { motion } from "framer-motion";

interface QuestionnaireProgressBarProps {
  progress: number;
}

const QuestionnaireProgressBar = ({ progress }: QuestionnaireProgressBarProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Seu progresso</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <div className="progress-bar">
        <motion.div 
          className="progress-value"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default QuestionnaireProgressBar;
