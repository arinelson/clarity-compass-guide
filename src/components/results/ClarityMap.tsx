
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface ClarityMapProps {
  data: {
    type: string;
    description: string;
    strengths: string[];
    challenges: string[];
    tips: string[];
  };
}

const ClarityMap = ({ data }: ClarityMapProps) => {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Mapa da Clareza</h2>
        <p className="text-lg font-medium text-primary">{data.type}</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700">{data.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-green-50 border border-green-200 rounded-lg p-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-medium text-green-700 mb-3">Seus Pontos Fortes</h3>
          <ul className="space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5 bg-green-100 p-1 rounded-full">
                  <Check size={14} className="text-green-600" />
                </span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          className="bg-amber-50 border border-amber-200 rounded-lg p-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium text-amber-700 mb-3">Seus Desafios</h3>
          <ul className="space-y-2">
            {data.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5 bg-amber-100 p-1 rounded-full">
                  <X size={14} className="text-amber-600" />
                </span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium text-blue-700 mb-3">Dicas para Aumentar sua Clareza</h3>
        <ul className="space-y-2">
          {data.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-0.5 bg-blue-100 p-1 rounded-full text-blue-600 font-bold text-xs flex items-center justify-center h-5 w-5">
                {index + 1}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default ClarityMap;
