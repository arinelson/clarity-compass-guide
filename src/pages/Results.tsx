
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Share, RefreshCw, Home, 
  Map, PieChart, Lightbulb, AlertTriangle,
  BarChart4, Compass, Target, Award, Heart
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
  const [vizMode, setVizMode] = useState("standard");
  
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
    // Determine decision type for more tailored results
    const decisionType = answers.responses.decision_type as string || "unknown";
    const emotionalState = answers.responses.emotional_impact as string || "confused";
    const decisionStyle = answers.responses.decision_style as string || "balanced";
    
    // More dynamic fallback results based on user's answers
    const results = {
      clarityMap: generateClarityMapBasedOn(decisionType, decisionStyle),
      priorityChart: generatePriorityChartBasedOn(decisionType, emotionalState),
      metaphor: generateMetaphorBasedOn(decisionType, emotionalState),
      riskAssessment: generateRiskAssessmentBasedOn(decisionStyle, emotionalState),
      actionSteps: generateActionStepsBasedOn(decisionType, decisionStyle),
      personalityType: generatePersonalityType(answers),
      strengthsProfile: generateStrengthsProfile(answers),
      emotionalPattern: generateEmotionalPattern(answers),
      decisionArchetype: generateDecisionArchetype(answers)
    };
    
    return results;
  };
  
  // New dynamic result generation functions
  const generateClarityMapBasedOn = (decisionType: string, decisionStyle: string) => {
    const clarityTypes = {
      career: {
        logical: {
          type: "Analista Estratégico",
          description: "Você aborda decisões de carreira de forma metódica, valorizando dados concretos e perspectivas de longo prazo.",
          strengths: ["Capacidade de análise objetiva", "Visão de longo prazo", "Foco em resultados tangíveis", "Capacidade de criar planos estruturados"],
          challenges: ["Pode ignorar aspectos emocionais", "Tende a buscar certezas em um campo imprevisível", "Pode demorar para agir enquanto analisa opções", "Desconforto com riscos não-calculados"],
          tips: ["Reserve tempo para conectar suas escolhas a valores pessoais", "Experimente pequenas ações que não comprometam sua situação atual", "Busque conversar com pessoas que fizeram transições similares", "Valorize também a intuição junto aos dados"]
        },
        emotional: {
          type: "Navegador de Propósito",
          description: "Você busca significado e realização em suas decisões profissionais, guiado por um forte senso de propósito e valores.",
          strengths: ["Conexão com seus valores pessoais", "Autenticidade nas escolhas", "Intuição desenvolvida", "Valoriza o bem-estar no trabalho"],
          challenges: ["Pode subestimar aspectos práticos", "Expectativas às vezes idealizadas", "Dificuldade em aceitar compromissos", "Impaciente com processos longos"],
          tips: ["Integre análises práticas ao seu processo intuitivo", "Crie um plano com etapas concretas", "Busque exemplos realistas de pessoas em caminhos similares", "Pratique pequenos experimentos antes de grandes mudanças"]
        },
        balanced: {
          type: "Explorador Cauteloso",
          description: "Você busca equilibrar segurança com crescimento em suas decisões de carreira, consciente tanto dos riscos quanto das oportunidades.",
          strengths: ["Capacidade de ver múltiplas perspectivas", "Flexibilidade adaptativa", "Consideração tanto de dados quanto de intuições", "Resiliência"],
          challenges: ["Pode se sentir dividido entre opções", "Ocasionalmente posterga decisões importantes", "Dúvidas recorrentes sobre o caminho escolhido", "Pode se comparar excessivamente com outros"],
          tips: ["Defina seus próprios critérios de sucesso", "Estabeleça prazos para suas decisões", "Mantenha um diário de aprendizados profissionais", "Cultive sua rede de mentores e conselheiros"]
        }
      },
      relationship: {
        logical: {
          type: "Construtor de Conexões",
          description: "Você aborda relacionamentos de forma estruturada, buscando compatibilidade e comunicação clara para construir conexões duradouras.",
          strengths: ["Comunicação direta e clara", "Capacidade de identificar padrões", "Resolução pragmática de conflitos", "Estabelece limites saudáveis"],
          challenges: ["Pode parecer excessivamente racional", "Dificuldade em lidar com emoções intensas", "Expectativa de que problemas sempre tenham soluções lógicas", "Pode analisar demais"],
          tips: ["Permita-se ser vulnerável", "Pratique escuta empática sem buscar soluções imediatas", "Valorize momentos espontâneos", "Reconheça que nem tudo em relacionamentos segue padrões previsíveis"]
        },
        // More conditions could be added here...
      },
      // More decision types could be added here...
      default: {
        type: "Bússola em Desenvolvimento",
        description: "Você está no caminho para encontrar sua direção, mas ainda precisa de mais clareza sobre suas prioridades.",
        strengths: ["Abertura a possibilidades", "Capacidade de adaptação", "Disposição para aprender", "Percepção de nuances"],
        challenges: ["Indecisão em momentos cruciais", "Tendência a postergar escolhas difíceis", "Dificuldade em priorizar", "Preocupação excessiva com opinião externa"],
        tips: ["Reserve tempo diário para refletir sobre suas metas", "Converse com pessoas que já passaram por situações semelhantes", "Pratique tomar pequenas decisões com mais confiança", "Conecte suas escolhas a seus valores fundamentais"]
      }
    };
    
    // Select appropriate clarity map or default
    return (clarityTypes[decisionType as keyof typeof clarityTypes]?.[decisionStyle as keyof typeof clarityTypes.career] || 
            clarityTypes.default);
  };
  
  const generatePriorityChartBasedOn = (decisionType: string, emotionalState: string) => {
    // Dynamic priority chart based on decision type and emotional state
    const priorityCharts = {
      career: {
        anxious: {
          values: [
            { name: "Segurança", value: 40 },
            { name: "Crescimento", value: 25 },
            { name: "Equilíbrio", value: 20 },
            { name: "Reconhecimento", value: 15 }
          ],
          focusAreas: ["Construir mais confiança em suas habilidades", "Desenvolver tolerância a riscos calculados", "Encontrar mentores que possam orientar sua jornada"]
        },
        calm: {
          values: [
            { name: "Propósito", value: 35 },
            { name: "Crescimento", value: 30 },
            { name: "Autonomia", value: 20 },
            { name: "Segurança", value: 15 }
          ],
          focusAreas: ["Alinhar suas ações com sua visão de longo prazo", "Buscar oportunidades que ampliem suas forças"]
        },
        // More emotional states...
      },
      // More decision types...
      default: {
        values: [
          { name: "Segurança", value: 30 },
          { name: "Liberdade", value: 25 },
          { name: "Crescimento", value: 25 },
          { name: "Relações", value: 20 }
        ],
        focusAreas: ["Equilíbrio entre segurança e exploração", "Desenvolvimento de autoconfiança"]
      }
    };
    
    // Select appropriate chart or default
    return (priorityCharts[decisionType as keyof typeof priorityCharts]?.[emotionalState as keyof typeof priorityCharts.career] || 
            priorityCharts.default);
  };
  
  const generateMetaphorBasedOn = (decisionType: string, emotionalState: string) => {
    // Dynamic metaphors based on decision type and emotional state
    const metaphors = {
      career: {
        anxious: {
          title: "O Alpinista na Névoa",
          description: "Você está como um alpinista subindo uma montanha coberta de névoa. Sabe que existe um pico, mas não consegue ver claramente o caminho. Cada passo requer coragem.",
          interpretation: "A névoa representa sua ansiedade atual, enquanto a montanha simboliza sua carreira. Mesmo sem ver todo o caminho, cada passo firme o levará mais perto do topo.",
          actionPrompt: "Que equipamentos (habilidades, conhecimentos) você já possui para esta escalada? Como você pode usar cordas de segurança (planos B) para avançar com mais confiança?"
        },
        confused: {
          title: "O Navegador Entre Ilhas",
          description: "Você está em um barco entre várias ilhas atraentes, cada uma oferecendo possibilidades diferentes. O vento (suas circunstâncias) empurra em direções variadas.",
          interpretation: "As diferentes ilhas representam caminhos de carreira, e seu desafio não é escolher a ilha 'perfeita', mas decidir qual explorar primeiro e aprender a ajustar seu curso.",
          actionPrompt: "Se você pudesse visitar temporariamente uma dessas ilhas antes de se comprometer, o que você mais gostaria de descobrir sobre ela?"
        },
        // More emotional states...
      },
      // More decision types...
      default: {
        title: "O Explorador na Bifurcação",
        description: "Você está como um explorador diante de uma bifurcação na trilha. Tem ferramentas e conhecimento, mas precisa escolher um caminho.",
        interpretation: "Este momento de escolha não é sobre certo ou errado, mas sobre qual caminho melhor se alinha aos seus valores e objetivos.",
        actionPrompt: "Que ferramentas na sua mochila (habilidades e experiências) podem ajudar nesta escolha?"
      }
    };
    
    // Select appropriate metaphor or default
    return (metaphors[decisionType as keyof typeof metaphors]?.[emotionalState as keyof typeof metaphors.career] || 
            metaphors.default);
  };
  
  const generateRiskAssessmentBasedOn = (decisionStyle: string, emotionalState: string) => {
    // Dynamic risk assessments based on decision style and emotional state
    const riskAssessments = {
      logical: {
        anxious: {
          level: "moderado",
          insights: [
            "Sua abordagem analítica ajuda a reduzir riscos, mas sua ansiedade pode fazê-lo ver perigos onde não existem",
            "Você tende a buscar certezas em situações inerentemente incertas",
            "Sua capacidade de planejamento é uma grande força"
          ],
          blindSpots: [
            "Pode estar superestimando riscos e subestimando sua capacidade de adaptação",
            "Análise excessiva pode levar à paralisia de decisão",
            "Pode estar ignorando oportunidades por medo de falhar"
          ]
        },
        // More emotional states...
      },
      // More decision styles...
      default: {
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
      }
    };
    
    // Select appropriate assessment or default
    return (riskAssessments[decisionStyle as keyof typeof riskAssessments]?.[emotionalState as keyof typeof riskAssessments.logical] || 
            riskAssessments.default);
  };
  
  const generateActionStepsBasedOn = (decisionType: string, decisionStyle: string) => {
    // Dynamic action steps based on decision type and style
    const actionSteps = {
      career: {
        logical: {
          immediate: [
            "Crie uma lista com prós e contras detalhada para cada opção",
            "Faça uma pesquisa aprofundada sobre tendências do mercado relacionadas às suas opções",
            "Identifique e converse com pelo menos 3 pessoas que já trilharam caminhos similares",
            "Estabeleça critérios mensuráveis para avaliar cada possibilidade"
          ],
          tools: [
            {
              name: "Matriz de Decisão Ponderada",
              description: "Crie uma tabela com suas opções e critérios importantes, atribuindo pesos (1-5) para cada critério e pontuações para cada opção"
            },
            {
              name: "Análise SWOT Pessoal",
              description: "Identifique forças, fraquezas, oportunidades e ameaças relacionadas a cada caminho de carreira possível"
            },
            {
              name: "Mapa de Cenários",
              description: "Imagine diferentes cenários futuros (melhor caso, pior caso, caso mais provável) para cada decisão possível"
            }
          ],
          resources: [
            {
              title: "Decisões Baseadas em Dados na Carreira",
              type: "Artigo",
              description: "Como usar dados e análises para tomar decisões mais estratégicas em sua trajetória profissional"
            },
            {
              title: "O Poder da Experimentação Profissional",
              type: "Vídeo",
              description: "Técnicas para testar novos caminhos profissionais com riscos calculados"
            },
            {
              title: "Planejamento de Carreira com Propósito",
              type: "Podcast",
              description: "Estratégias para alinhar decisões profissionais com objetivos de longo prazo"
            }
          ]
        },
        // More decision styles...
      },
      // More decision types...
      default: {
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
    
    // Select appropriate actions or default
    return (actionSteps[decisionType as keyof typeof actionSteps]?.[decisionStyle as keyof typeof actionSteps.career] || 
            actionSteps.default);
  };
  
  // New result generation functions
  const generatePersonalityType = (answers: UserAnswers) => {
    const decisionStyle = answers.responses.decision_style as string || "balanced";
    const emotionalImpact = answers.responses.emotional_impact as string || "calm";
    
    const personalityTypes = {
      logical: {
        anxious: {
          type: "Analista Cauteloso",
          description: "Você aborda decisões de forma metódica, mas tende a se preocupar com possíveis falhas ou consequências negativas.",
          traits: ["Analítico", "Detalhista", "Prudente", "Meticuloso"],
          strengths: ["Identificação de riscos", "Planejamento detalhado", "Consideração cuidadosa de opções"],
          growth: ["Praticar tomada de decisão mais rápida", "Desenvolver confiança em sua intuição", "Aceitar que nem tudo pode ser previsto"]
        },
        // More emotional states...
      },
      // More decision styles...
      default: {
        type: "Navegador Equilibrado",
        description: "Você busca balancear análise e intuição, adaptando sua abordagem conforme o contexto da decisão.",
        traits: ["Adaptável", "Ponderado", "Flexível", "Contextual"],
        strengths: ["Versatilidade", "Consideração de múltiplas perspectivas", "Equilíbrio entre razão e emoção"],
        growth: ["Desenvolver maior confiança em suas decisões", "Reduzir tempo de deliberação quando apropriado", "Aprofundar autoconhecimento"]
      }
    };
    
    return (personalityTypes[decisionStyle as keyof typeof personalityTypes]?.[emotionalImpact as keyof typeof personalityTypes.logical] || 
            personalityTypes.default);
  };
  
  const generateStrengthsProfile = (answers: UserAnswers) => {
    // Use respostas como learning_style, feedback_handling, etc. para gerar perfil
    return {
      primaryStrengths: [
        "Capacidade de análise",
        "Pensamento estratégico", 
        "Resiliência emocional",
        "Adaptabilidade"
      ],
      growthAreas: [
        "Confiança em decisões rápidas",
        "Tolerância à ambiguidade"
      ],
      recommendedApproaches: [
        "Combine análise estruturada com momentos de reflexão intuitiva",
        "Pratique tomada de decisão em pequenas escolhas diárias",
        "Desenvolva um grupo de confiança para discutir decisões importantes"
      ]
    };
  };
  
  const generateEmotionalPattern = (answers: UserAnswers) => {
    return {
      dominantEmotions: [
        { emotion: "Ansiedade", intensity: 65 },
        { emotion: "Esperança", intensity: 70 },
        { emotion: "Confusão", intensity: 55 },
        { emotion: "Determinação", intensity: 80 }
      ],
      pattern: "Ciclo de Determinação-Dúvida",
      description: "Você alterna entre momentos de forte clareza e determinação e períodos de dúvida e ansiedade.",
      recommendations: [
        "Reconheça que flutuações emocionais são normais durante decisões importantes",
        "Desenvolva práticas de atenção plena para observar emoções sem reagir imediatamente",
        "Use um diário para identificar gatilhos específicos de ansiedade"
      ]
    };
  };
  
  const generateDecisionArchetype = (answers: UserAnswers) => {
    const archetypes = [
      {
        name: "O Estrategista",
        description: "Você aborda decisões como um jogo de xadrez, planejando vários movimentos à frente.",
        strengths: ["Visão de longo prazo", "Pensamento sistêmico", "Capacidade de antecipação"],
        challenges: ["Pode ficar paralisado pela análise excessiva", "Dificuldade com incertezas"]
      },
      {
        name: "O Explorador",
        description: "Você vê decisões como oportunidades para descobrir novos territórios e possibilidades.",
        strengths: ["Adaptabilidade", "Abertura a novas experiências", "Resiliência"],
        challenges: ["Pode não se aprofundar o suficiente", "Dificuldade para se comprometer"]
      },
      {
        name: "O Harmonizador",
        description: "Você prioriza o impacto de suas decisões nos relacionamentos e no bem-estar coletivo.",
        strengths: ["Empatia", "Consideração dos outros", "Habilidade de construir consenso"],
        challenges: ["Pode negligenciar necessidades próprias", "Dificuldade com conflitos"]
      },
      {
        name: "O Visionário",
        description: "Você guia suas decisões por valores profundos e uma visão de futuro inspiradora.",
        strengths: ["Clareza de propósito", "Motivação intrínseca", "Criatividade"],
        challenges: ["Pode ser idealista demais", "Dificuldade com aspectos práticos"]
      }
    ];
    
    // Simplificado para exemplo - na implementação real, seria baseado em várias respostas
    const index = Math.floor(Math.random() * archetypes.length);
    return archetypes[index];
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
  
  const handleChangeVizMode = (mode: string) => {
    setVizMode(mode);
    
    toast({
      title: "Modo de visualização alterado",
      description: `Visualização alterada para modo ${mode === 'standard' ? 'Padrão' : mode === 'detailed' ? 'Detalhado' : 'Visual'}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mx-auto"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 1, ease: "linear" },
              scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }}
          />
          <motion.p 
            className="mt-4 text-lg text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Gerando seu diagnóstico personalizado...
          </motion.p>
          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-sm text-gray-500 italic">Analisando suas respostas...</p>
            <p className="text-sm text-gray-500 italic">Criando visualizações personalizadas...</p>
            <p className="text-sm text-gray-500 italic">Preparando recomendações...</p>
          </motion.div>
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
            <motion.p 
              className="text-lg text-gray-700 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Preparado especialmente para você, {userAnswers.name}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={handleDownloadPDF}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={18} />
            </motion.div>
            <span className="hidden md:inline">PDF</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={handleShareWhatsApp}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share size={18} />
            </motion.div>
            <span className="hidden md:inline">Compartilhar</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={handleRegenerateResults}
          >
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ repeat: isLoading ? Infinity : 0, duration: 1, ease: "linear" }}
            >
              <RefreshCw size={18} />
            </motion.div>
            <span className="hidden md:inline">Regenerar</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
            onClick={() => navigate('/')}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={18} />
            </motion.div>
            <span className="hidden md:inline">Início</span>
          </Button>
          
          <Button 
            variant={vizMode === "standard" ? "default" : "outline"} 
            className="flex items-center justify-center"
            onClick={() => handleChangeVizMode("standard")}
          >
            <motion.div whileHover={{ scale: 1.1 }}>
              <BarChart4 size={18} />
            </motion.div>
          </Button>
          
          <Button 
            variant={vizMode === "visual" ? "default" : "outline"} 
            className="flex items-center justify-center"
            onClick={() => handleChangeVizMode("visual")}
          >
            <motion.div whileHover={{ scale: 1.1 }}>
              <Compass size={18} />
            </motion.div>
          </Button>
        </div>

        <Tabs defaultValue="clarity-map" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="clarity-map" className="flex items-center gap-2">
              <Map size={16} /> <span className="hidden md:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="priority-chart" className="flex items-center gap-2">
              <PieChart size={16} /> <span className="hidden md:inline">Prioridades</span>
            </TabsTrigger>
            <TabsTrigger value="metaphor" className="flex items-center gap-2">
              <Lightbulb size={16} /> <span className="hidden md:inline">Metáfora</span>
            </TabsTrigger>
            <TabsTrigger value="risk-assessment" className="flex items-center gap-2">
              <AlertTriangle size={16} /> <span className="hidden md:inline">Riscos</span>
            </TabsTrigger>
            <TabsTrigger value="action-steps" className="flex items-center gap-2">
              <Target size={16} /> <span className="hidden md:inline">Ações</span>
            </TabsTrigger>
            <TabsTrigger value="personality" className="flex items-center gap-2">
              <Award size={16} /> <span className="hidden md:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="emotional" className="flex items-center gap-2">
              <Heart size={16} /> <span className="hidden md:inline">Emocional</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="clarity-map" className="mt-0">
                  <ClarityMap data={resultsData.clarityMap} />
                </TabsContent>
                
                <TabsContent value="priority-chart" className="mt-0">
                  <PriorityChart data={resultsData.priorityChart} />
                </TabsContent>
                
                <TabsContent value="metaphor" className="mt-0">
                  <MetaphorVisual data={resultsData.metaphor} />
                </TabsContent>
                
                <TabsContent value="risk-assessment" className="mt-0">
                  <RiskAssessment data={resultsData.riskAssessment} />
                </TabsContent>
                
                <TabsContent value="action-steps" className="mt-0">
                  <ActionSteps data={resultsData.actionSteps} />
                </TabsContent>
                
                <TabsContent value="personality" className="mt-0">
                  <div>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Seu Perfil de Tomada de Decisão</h2>
                      <p className="text-gray-600">Como você normalmente aborda escolhas importantes</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 text-center mb-6">
                      <motion.h3 
                        className="text-xl font-bold text-primary mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {resultsData.personalityType?.type || resultsData.decisionArchetype?.name}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {resultsData.personalityType?.description || resultsData.decisionArchetype?.description}
                      </motion.p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-lg font-medium mb-3">Suas Características Distintivas</h3>
                        <div className="flex flex-wrap gap-2">
                          {(resultsData.personalityType?.traits || resultsData.decisionArchetype?.strengths || []).map((trait: string, index: number) => (
                            <motion.span 
                              key={index} 
                              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                              whileHover={{ scale: 1.05 }}
                            >
                              {trait}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-lg font-medium mb-3">Áreas de Crescimento</h3>
                        <ul className="space-y-2">
                          {(resultsData.personalityType?.growth || resultsData.decisionArchetype?.challenges || []).map((area: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary font-bold">•</span>
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="emotional" className="mt-0">
                  <div>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Seu Padrão Emocional</h2>
                      <p className="text-gray-600">Como suas emoções influenciam suas decisões</p>
                    </div>
                    
                    {resultsData.emotionalPattern && (
                      <>
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                          <h3 className="text-xl font-bold text-center text-primary mb-4">{resultsData.emotionalPattern.pattern}</h3>
                          <p className="text-center">{resultsData.emotionalPattern.description}</p>
                          
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">PERFIL EMOCIONAL</h4>
                            <div className="space-y-3">
                              {resultsData.emotionalPattern.dominantEmotions.map((item: any, index: number) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>{item.emotion}</span>
                                    <span>{item.intensity}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <motion.div 
                                      className="bg-primary h-2 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.intensity}%` }}
                                      transition={{ duration: 1, delay: index * 0.1 }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-lg font-medium mb-4">Recomendações para Equilíbrio Emocional</h3>
                          <ul className="space-y-3">
                            {resultsData.emotionalPattern.recommendations.map((rec: string, index: number) => (
                              <motion.li 
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="flex items-start gap-3"
                              >
                                <span className="bg-primary/10 text-primary flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span>{rec}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;
