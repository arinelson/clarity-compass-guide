
import { motion } from "framer-motion";
import { AlertTriangle, Check, AlertCircle } from "lucide-react";

interface RiskAssessmentProps {
  data: {
    level: "baixo" | "moderado" | "alto";
    insights: string[];
    blindSpots: string[];
  };
}

const RiskAssessment = ({ data }: RiskAssessmentProps) => {
  const getRiskColor = () => {
    switch (data.level) {
      case "baixo": return "green";
      case "moderado": return "amber";
      case "alto": return "red";
      default: return "amber";
    }
  };
  
  const getRiskLabel = () => {
    switch (data.level) {
      case "baixo": return "Baixo";
      case "moderado": return "Moderado";
      case "alto": return "Alto";
      default: return "Moderado";
    }
  };
  
  const riskColor = getRiskColor();
  const riskLabel = getRiskLabel();

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Avaliação de Risco Emocional</h2>
        <p className="text-gray-600">Como você lida com a incerteza nas decisões</p>
      </div>
      
      <motion.div 
        className={`bg-${riskColor}-50 border border-${riskColor}-200 rounded-lg p-6 text-center mb-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className={`text-xl font-bold text-${riskColor}-600 mb-2`}>
          Nível de Risco: {riskLabel}
        </h3>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
          <motion.div 
            className={`bg-${riskColor}-500 h-4 rounded-full`}
            initial={{ width: 0 }}
            animate={{ 
              width: data.level === "baixo" ? "33%" : 
                    data.level === "moderado" ? "66%" : "100%" 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
            <Check size={20} className="text-green-500" />
            <span>Insights Principais</span>
          </h3>
          <ul className="space-y-2">
            {data.insights.map((insight, index) => (
              <li key={index} className="text-gray-700 flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          className="bg-amber-50 border border-amber-200 rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium flex items-center gap-2 text-amber-700 mb-3">
            <AlertCircle size={20} />
            <span>Possíveis Pontos Cegos</span>
          </h3>
          <ul className="space-y-2">
            {data.blindSpots.map((blindSpot, index) => (
              <li key={index} className="text-gray-700 flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{blindSpot}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AlertTriangle size={18} className="text-blue-500 flex-shrink-0" />
        <p className="text-sm text-gray-700">
          Esta avaliação não substitui aconselhamento profissional. Se você estiver enfrentando decisões que afetam significativamente sua saúde ou bem-estar, considere buscar apoio especializado.
        </p>
      </motion.div>
    </div>
  );
};

export default RiskAssessment;
