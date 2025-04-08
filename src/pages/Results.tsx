
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { 
  Download, Share, RefreshCw, Home, 
  Map, PieChart, Lightbulb, AlertTriangle 
} from 'lucide-react';
import { UserAnswers } from '@/types/questionnaire';
import { generateResultsPDF } from '@/lib/pdf-generator';
import ClarityMap from '@/components/results/ClarityMap';
import PriorityChart from '@/components/results/PriorityChart';
import MetaphorVisual from '@/components/results/MetaphorVisual';
import RiskAssessment from '@/components/results/RiskAssessment';
import ActionSteps from '@/components/results/ActionSteps';
import { useGeminiAI } from '@/hooks/use-gemini-ai';

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userAnswers, setUserAnswers] = useState<UserAnswers | null>(null);
  const [resultsData, setResultsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("clarity-map");
  
  const { generatePersonalizedInsights, isAPIKeySet } = useGeminiAI();

  useEffect(() => {
    // Retrieve answers from localStorage
    const savedAnswers = localStorage.getItem('decisionScopeAnswers');
    
    if (!savedAnswers) {
      toast({
        title: "Sessão expirada",
        description: "Não encontramos suas respostas. Por favor, refaça o questionário.",
        variant: "destructive",
      });
      navigate('/questionnaire');
      return;
    }
    
    const parsedAnswers = JSON.parse(savedAnswers);
    setUserAnswers(parsedAnswers);
    
    // Generate results when answers are loaded
    generateResults(parsedAnswers);
  }, [navigate, toast]);

  const generateResults = async (answers: UserAnswers) => {
    setIsLoading(true);
    
    try {
      let insights = null;
      
      // Try to generate personalized insights with Gemini
      if (isAPIKeySet) {
        insights = await generatePersonalizedInsights(answers);
      }
      
      // If Gemini API is not available or fails, use fallback data
      if (!insights) {
        insights = generateFallbackResults(answers);
      }
      
      setResultsData(insights);
    } catch (error) {
      console.error("Error generating results:", error);
      
      // Use fallback data in case of error
      const fallbackData = generateFallbackResults(answers);
      setResultsData(fallbackData);
      
      toast({
        title: "Erro ao processar resultados",
        description: "Estamos usando resultados básicos. Algumas funcionalidades podem estar limitadas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResults = (answers: UserAnswers) => {
    // Default results in case the AI is not available
    return {
      clarityMap: {
        type: "Bússola em Desenvolvimento",
        description: "Você está no caminho para encontrar sua direção, mas ainda precisa de mais clareza sobre suas prioridades.",
        strengths: ["Boa capacidade de análise", "Abertura a novas perspectivas"],
        challenges: ["Indecisão em momentos cruciais", "Tendência a postergar decisões"],
        tips: ["Reserve tempo diário para refletir sobre suas metas", "Converse com pessoas que já passaram por situações semelhantes"]
      },
      priorityChart: {
        values: [
          { name: "Segurança", value: 35 },
          { name: "Liberdade", value: 25 },
          { name: "Crescimento", value: 20 },
          { name: "Relações", value: 20 }
        ],
        focusAreas: ["Equilíbrio entre segurança e exploração", "Desenvolvimento de autoconfiança"]
      },
      metaphor: {
        title: "O Explorador na Bifurcação",
        description: "Você está como um explorador diante de uma bifurcação na trilha. Tem ferramentas e conhecimento, mas precisa escolher um caminho.",
        interpretation: "Este momento de escolha não é sobre certo ou errado, mas sobre qual caminho melhor se alinha aos seus valores e objetivos.",
        actionPrompt: "Que ferramentas na sua mochila (habilidades e experiências) podem ajudar nesta escolha?"
      },
      riskAssessment: {
        level: "moderado",
        insights: [
          "Você tende a analisar bem as situações, mas às vezes se perde em detalhes",
          "Há um equilíbrio entre cautela e coragem em suas decisões",
          "Pode se beneficiar de estruturar melhor suas análises"
        ],
        blindSpots: [
          "Tendência a superestimar riscos em áreas desconhecidas",
          "Pode estar subestimando sua capacidade de adaptação"
        ]
      },
      actionSteps: {
        immediate: [
          "Liste todas as opções disponíveis sem julgar",
          "Identifique o que você realmente valoriza nesta decisão",
          "Converse com alguém de confiança sobre suas opções"
        ],
        tools: [
          {
            name: "Matriz de Decisão",
            description: "Avalie cada opção com base em critérios importantes para você"
          },
          {
            name: "Diário de Reflexão",
            description: "Registre pensamentos e sentimentos sobre cada caminho possível"
          }
        ],
        resources: [
          {
            title: "Decidindo com Clareza",
            type: "Artigo",
            description: "Técnicas para filtrar o ruído mental durante decisões importantes"
          },
          {
            title: "O Poder da Intuição Informada",
            type: "Vídeo",
            description: "Como equilibrar análise e intuição nas suas decisões"
          }
        ]
      }
    };
  };

  const handleDownloadPDF = async () => {
    if (!userAnswers || !resultsData) return;
    
    try {
      await generateResultsPDF(userAnswers, resultsData);
      
      toast({
        title: "PDF Gerado com Sucesso",
        description: "Seu relatório foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (!userAnswers) return;
    
    const userName = userAnswers.name;
    const shareText = `Olá! Acabei de descobrir minhas tendências de tomada de decisão no DecisionScope. Confira você também: ${window.location.origin}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Link Copiado",
      description: "Link compartilhável copiado para o WhatsApp.",
    });
  };

  const handleRegenerateResults = async () => {
    if (!userAnswers) return;
    
    toast({
      title: "Regenerando resultados",
      description: "Por favor, aguarde enquanto processamos suas respostas novamente.",
    });
    
    await generateResults(userAnswers);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Gerando seu diagnóstico personalizado...</p>
        </div>
      </div>
    );
  }

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Erro ao carregar resultados</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Não foi possível gerar seus resultados. Por favor, tente novamente.</p>
            <Button onClick={() => navigate('/questionnaire')}>
              Refazer Questionário
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="container max-w-5xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Seu Diagnóstico de Clareza
          </h1>
          {userAnswers && (
            <p className="text-lg text-gray-700 mt-2">
              Preparado especialmente para você, {userAnswers.name}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={handleDownloadPDF}
          >
            <Download size={18} />
            Baixar PDF
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={handleShareWhatsApp}
          >
            <Share size={18} />
            Compartilhar
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={handleRegenerateResults}
          >
            <RefreshCw size={18} />
            Regenerar
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => navigate('/')}
          >
            <Home size={18} />
            Início
          </Button>
        </div>

        <Tabs defaultValue="clarity-map" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="clarity-map" className="flex items-center gap-2">
              <Map size={16} /> Mapa
            </TabsTrigger>
            <TabsTrigger value="priority-chart" className="flex items-center gap-2">
              <PieChart size={16} /> Prioridades
            </TabsTrigger>
            <TabsTrigger value="metaphor" className="flex items-center gap-2">
              <Lightbulb size={16} /> Metáfora
            </TabsTrigger>
            <TabsTrigger value="risk-assessment" className="flex items-center gap-2">
              <AlertTriangle size={16} /> Riscos
            </TabsTrigger>
            <TabsTrigger value="action-steps" className="flex items-center gap-2">
              <RefreshCw size={16} /> Ações
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <TabsContent value="clarity-map" className="animate-fade-in focus:outline-none mt-0">
              <ClarityMap data={resultsData.clarityMap} />
            </TabsContent>
            
            <TabsContent value="priority-chart" className="animate-fade-in focus:outline-none mt-0">
              <PriorityChart data={resultsData.priorityChart} />
            </TabsContent>
            
            <TabsContent value="metaphor" className="animate-fade-in focus:outline-none mt-0">
              <MetaphorVisual data={resultsData.metaphor} />
            </TabsContent>
            
            <TabsContent value="risk-assessment" className="animate-fade-in focus:outline-none mt-0">
              <RiskAssessment data={resultsData.riskAssessment} />
            </TabsContent>
            
            <TabsContent value="action-steps" className="animate-fade-in focus:outline-none mt-0">
              <ActionSteps data={resultsData.actionSteps} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;
