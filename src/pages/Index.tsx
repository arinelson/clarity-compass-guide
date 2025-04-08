
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Lightbulb, Brain, Map } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center">
      <main className="container max-w-5xl px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            DecisionScope
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Seu Guia Visual para Decisões com Clareza
          </motion.p>
        </div>

        <motion.div 
          className="grid gap-8 md:grid-cols-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Compass size={40} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">Ganhe Clareza</h2>
            <p className="text-gray-600 text-center">
              Transformamos suas dúvidas em representações visuais que ajudam a entender melhor suas decisões.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                <Lightbulb size={40} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">Encontre Direção</h2>
            <p className="text-gray-600 text-center">
              Nosso questionário personalizado ajuda a mapear suas prioridades e valores mais importantes.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-accent/10 text-accent">
                <Brain size={40} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">Entenda Padrões</h2>
            <p className="text-gray-600 text-center">
              Identifique comportamentos decisórios e descubra como eles afetam suas escolhas.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-ds-purple/10 text-ds-purple">
                <Map size={40} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">Aja com Confiança</h2>
            <p className="text-gray-600 text-center">
              Receba um plano de ação personalizado com os próximos passos a seguir.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
            onClick={() => navigate('/questionnaire')}
          >
            Iniciar Jornada de Clareza
          </Button>
        </motion.div>

        <motion.div 
          className="mt-16 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <p className="max-w-2xl mx-auto">
            O DecisionScope usa metáforas visuais e inteligência artificial para transformar
            suas incertezas em um mapa claro para tomar decisões melhores.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
