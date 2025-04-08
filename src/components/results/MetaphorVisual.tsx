
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface MetaphorVisualProps {
  data: {
    title: string;
    description: string;
    interpretation: string;
    actionPrompt: string;
  };
}

const MetaphorVisual = ({ data }: MetaphorVisualProps) => {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Sua Metáfora Visual</h2>
        <p className="text-gray-600">Uma representação simbólica da sua situação atual</p>
      </div>
      
      <motion.div 
        className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-lg mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-primary mb-4">{data.title}</h3>
        <p className="text-lg italic">{data.description}</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
            <Lightbulb size={20} className="text-yellow-500" />
            <span>O que isso significa</span>
          </h3>
          <p className="text-gray-700">{data.interpretation}</p>
        </motion.div>
        
        <motion.div 
          className="bg-primary/10 border border-primary/20 rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-primary mb-3">Reflita sobre isso</h3>
          <p className="text-gray-700">{data.actionPrompt}</p>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p>As metáforas nos ajudam a entender situações complexas de maneira intuitiva</p>
      </motion.div>
    </div>
  );
};

export default MetaphorVisual;
