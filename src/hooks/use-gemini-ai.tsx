
import { useState, useEffect } from 'react';
import { UserAnswers } from '@/types/questionnaire';
import { useToast } from '@/hooks/use-toast';

interface GeminiAIConfig {
  apiKey: string | null;
}

export const useGeminiAI = () => {
  const [config, setConfig] = useState<GeminiAIConfig>({
    apiKey: null,
  });
  const [isAPIKeySet, setIsAPIKeySet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for API key in environment variables
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (geminiApiKey) {
      setConfig({ apiKey: geminiApiKey });
      setIsAPIKeySet(true);
    } else {
      // Check for stored API key in localStorage
      const storedApiKey = localStorage.getItem('gemini_api_key');
      if (storedApiKey) {
        setConfig({ apiKey: storedApiKey });
        setIsAPIKeySet(true);
      }
    }
  }, []);

  const setApiKey = (apiKey: string) => {
    localStorage.setItem('gemini_api_key', apiKey);
    setConfig({ apiKey });
    setIsAPIKeySet(true);
    
    toast({
      title: "API Key Configurada",
      description: "Sua chave da API Gemini foi configurada com sucesso.",
    });
  };

  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setConfig({ apiKey: null });
    setIsAPIKeySet(false);
    
    toast({
      title: "API Key Removida",
      description: "Sua chave da API Gemini foi removida.",
    });
  };

  const createGeminiPrompt = (answers: UserAnswers) => {
    return `
      Analise as respostas de um questionário sobre tomada de decisões e gere um diagnóstico visual e metafórico personalizado para ajudar o usuário a ganhar clareza. 
      
      Sobre o usuário:
      Nome: ${answers.name}
      Idade: ${answers.age}
      
      Respostas do questionário:
      ${Object.entries(answers.responses)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')}
      
      Gere um diagnóstico completo no formato JSON com as seguintes seções:
      
      1. clarityMap: Um mapa visual da situação atual do usuário
         - type: O tipo de clareza que o usuário possui (ex: "Bússola em Desenvolvimento", "Modo Confusão", "Focado em Valores")
         - description: Uma descrição da situação atual do usuário em relação à tomada de decisão
         - strengths: Um array com 3-4 pontos fortes do usuário na tomada de decisão
         - challenges: Um array com 3-4 desafios que o usuário enfrenta na tomada de decisão
         - tips: Um array com 3-4 dicas para o usuário aumentar sua clareza
      
      2. priorityChart: Um gráfico de prioridades baseado nos valores do usuário
         - values: Um array com objetos contendo name (nome da prioridade) e value (porcentagem de importância, somando 100%)
         - focusAreas: Array com 2-3 áreas em que o usuário deve focar
      
      3. metaphor: Uma metáfora visual que represente a situação do usuário
         - title: Título da metáfora (ex: "O Explorador na Bifurcação", "O Labirinto das Possibilidades")
         - description: Uma descrição visual e metafórica da situação do usuário
         - interpretation: O que a metáfora significa no contexto da decisão
         - actionPrompt: Uma pergunta reflexiva baseada na metáfora
      
      4. riskAssessment: Uma avaliação de risco emocional
         - level: O nível de risco emocional (baixo, moderado ou alto)
         - insights: Um array com 3-4 insights sobre como o usuário lida com a incerteza
         - blindSpots: Um array com 2-3 pontos cegos que o usuário pode ter em seu processo decisório
      
      5. actionSteps: Recomendações personalizadas para ajudar o usuário
         - immediate: Um array com 3-5 ações imediatas que o usuário pode tomar
         - tools: Um array com 2-3 objetos contendo name (nome da ferramenta) e description (como usar)
         - resources: Um array com 2-3 objetos contendo title (título do recurso), type (Artigo ou Vídeo) e description (do que se trata)
      
      Seja criativo, empático e personalizado. Use metáforas visuais fortes e linguagem acessível. Baseie-se nas respostas para criar um diagnóstico que realmente ajude o usuário a ter mais clareza sobre sua situação.
    `;
  };

  const generatePersonalizedInsights = async (answers: UserAnswers) => {
    if (!config.apiKey) {
      toast({
        title: "API Key não configurada",
        description: "Por favor, configure sua chave de API do Gemini para obter insights personalizados.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const prompt = createGeminiPrompt(answers);
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': config.apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(`Erro na API Gemini: ${errorData.error?.message || 'Erro desconhecido'}`);
      }

      const data = await response.json();
      const textContent = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = textContent.match(/```json\s*({[\s\S]*?})\s*```/) || 
                        textContent.match(/{[\s\S]*}/);
                        
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      } else if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Não foi possível extrair dados JSON da resposta");
      }
    } catch (error) {
      console.error("Error with Gemini API:", error);
      throw error;
    }
  };

  return {
    isAPIKeySet,
    setApiKey,
    removeApiKey,
    generatePersonalizedInsights
  };
};
