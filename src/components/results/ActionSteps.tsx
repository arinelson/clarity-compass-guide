
import { motion } from "framer-motion";
import { CheckCircle, FileText, Video } from "lucide-react";

interface ActionStepsProps {
  data: {
    immediate: string[];
    tools: {
      name: string;
      description: string;
    }[];
    resources: {
      title: string;
      type: string;
      description: string;
    }[];
  };
}

const ActionSteps = ({ data }: ActionStepsProps) => {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Recomendações Personalizadas</h2>
        <p className="text-gray-600">Próximos passos para avançar com confiança</p>
      </div>
      
      <div className="space-y-8">
        <motion.div 
          className="bg-green-50 border border-green-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Ações Imediatas</span>
          </h3>
          
          <ul className="space-y-3">
            {data.immediate.map((action, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="bg-green-100 text-green-800 flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700">{action}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Ferramentas Gratuitas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.tools.map((tool, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-medium text-primary mb-2">{tool.name}</h4>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-purple-50 border border-purple-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-purple-700 mb-4">Conteúdos Recomendados</h3>
          
          <div className="space-y-4">
            {data.resources.map((resource, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0">
                  {resource.type === "Artigo" ? (
                    <FileText size={24} className="text-primary" />
                  ) : (
                    <Video size={24} className="text-secondary" />
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-gray-500">{resource.type}</p>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActionSteps;
