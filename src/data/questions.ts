
import { QuestionData } from "@/types/questionnaire";

export const getAllQuestions = (): QuestionData[] => [
  // Contexto da Decisão
  {
    id: "decision_type",
    question: "Qual é o tipo de decisão ou dúvida que você está enfrentando?",
    type: "radio",
    options: [
      { value: "career", label: "Carreira ou trabalho" },
      { value: "relationship", label: "Relacionamento" },
      { value: "health", label: "Saúde e bem-estar" },
      { value: "finances", label: "Finanças" },
      { value: "personal_project", label: "Projeto pessoal" },
      { value: "education", label: "Educação" },
      { value: "other", label: "Outro" }
    ],
    required: true,
    category: "context"
  },
  {
    id: "decision_description",
    question: "Descreva brevemente a decisão ou dúvida que você está enfrentando:",
    description: "Este é um espaço seguro para você desabafar e compartilhar seus pensamentos.",
    type: "textarea",
    placeholder: "Estou em dúvida se devo...",
    required: true,
    category: "context"
  },
  {
    id: "decision_urgency",
    question: "Qual é a urgência desta decisão?",
    type: "radio",
    options: [
      { value: "week", label: "Preciso decidir em até uma semana", icon: "clock" },
      { value: "month", label: "Preciso decidir em algumas semanas ou um mês" },
      { value: "future", label: "Tenho tempo, é uma decisão para o futuro" },
      { value: "unknown", label: "Não sei, estou apenas explorando possibilidades" }
    ],
    required: true,
    category: "context"
  },
  {
    id: "emotional_impact",
    question: "Como essa decisão afeta você emocionalmente?",
    type: "radio",
    options: [
      { value: "calm", label: "Me sinto tranquilo sobre isso", icon: "smile" },
      { value: "anxious", label: "Me sinto ansioso ou preocupado", icon: "meh" },
      { value: "confused", label: "Me sinto confuso e indeciso", icon: "frown" },
      { value: "excited", label: "Me sinto animado, mas com algumas dúvidas" },
      { value: "overwhelmed", label: "Me sinto sobrecarregado com tantas opções" }
    ],
    required: true,
    category: "emotional"
  },
  {
    id: "support_system",
    question: "Você já conversou com alguém sobre essa decisão?",
    type: "radio",
    options: [
      { value: "yes_detailed", label: "Sim, tive conversas detalhadas" },
      { value: "yes_superficial", label: "Sim, mas apenas superficialmente" },
      { value: "no_will", label: "Não, mas pretendo conversar" },
      { value: "no_wont", label: "Não, prefiro decidir sozinho" }
    ],
    required: true,
    category: "context"
  },
  
  // Prioridades Pessoais
  {
    id: "future_impact",
    question: "Quanto essa decisão pode afetar seu futuro a longo prazo?",
    type: "slider",
    min: "Pouco impacto",
    max: "Impacto significativo",
    required: true,
    category: "priorities"
  },
  {
    id: "security_freedom",
    question: "Nesta escolha, o que é mais importante para você?",
    type: "slider",
    min: "Segurança",
    max: "Liberdade",
    required: true,
    category: "priorities"
  },
  {
    id: "practical_emotional",
    question: "Você está buscando principalmente:",
    type: "slider",
    min: "Resultados práticos",
    max: "Bem-estar emocional",
    required: true,
    category: "priorities"
  },
  {
    id: "values_importance",
    question: "Quais valores são mais importantes para você nesta decisão?",
    description: "Selecione os principais valores que influenciam sua escolha",
    type: "text",
    placeholder: "Ex: honestidade, família, crescimento pessoal, estabilidade, etc.",
    required: false,
    category: "priorities"
  },
  {
    id: "fear_biggest",
    question: "Qual é seu maior medo em relação a esta decisão?",
    type: "textarea",
    placeholder: "Tenho medo de...",
    required: false,
    category: "emotional"
  },
  
  // Comportamentos Decisórios
  {
    id: "unexpected_option",
    question: "Se surgisse uma opção inesperada agora, você:",
    type: "radio",
    options: [
      { value: "analyze", label: "Analisaria detalhadamente antes de considerar", icon: "brain" },
      { value: "intuition", label: "Seguiria sua intuição se parecesse certo", icon: "heart" },
      { value: "help", label: "Pediria ajuda ou opinião de outras pessoas" },
      { value: "resist", label: "Provavelmente resistiria a mudanças de planos" }
    ],
    required: true,
    category: "behaviors"
  },
  {
    id: "doubt_handling",
    question: "Como você geralmente lida com dúvidas importantes?",
    type: "radio",
    options: [
      { value: "research", label: "Pesquiso muito e analiso todas as opções", icon: "brain" },
      { value: "quick", label: "Decido rapidamente para não ficar paralisado" },
      { value: "postpone", label: "Adio a decisão até me sentir mais seguro" },
      { value: "consult", label: "Consulto outras pessoas que confio" }
    ],
    required: true,
    category: "behaviors"
  },
  {
    id: "past_decisions",
    question: "Pense em decisões importantes que você tomou no passado. Como você se sente sobre elas hoje?",
    type: "radio",
    options: [
      { value: "satisfied", label: "Geralmente satisfeito com minhas escolhas" },
      { value: "regret", label: "Tenho alguns arrependimentos importantes" },
      { value: "learning", label: "Vejo-as como aprendizado, independente do resultado" },
      { value: "unsure", label: "Frequentemente me pergunto se fiz a escolha certa" }
    ],
    required: true,
    category: "behaviors"
  },
  {
    id: "decision_style",
    question: "Qual frase melhor descreve seu estilo de tomada de decisão?",
    type: "radio",
    options: [
      { value: "logical", label: "Prefiro análises lógicas e fatos concretos" },
      { value: "emotional", label: "Confio bastante nos meus sentimentos e intuições" },
      { value: "balanced", label: "Busco equilibrar lógica e intuição" },
      { value: "external", label: "Valorizo muito a opinião de pessoas que respeito" }
    ],
    required: true,
    category: "behaviors"
  },
  
  // Contexto Emocional
  {
    id: "today_feeling",
    question: "Como você se sente sobre essa decisão hoje?",
    type: "radio",
    options: [
      { value: "overwhelmed", label: "Sobrecarregado, há muita coisa para considerar", icon: "frown" },
      { value: "confused", label: "Confuso, não consigo organizar meus pensamentos", icon: "meh" },
      { value: "hopeful", label: "Esperançoso, vejo possibilidades positivas", icon: "smile" },
      { value: "focused", label: "Focado, sei o que preciso analisar", icon: "target" }
    ],
    required: true,
    category: "emotional"
  },
  {
    id: "obstacles",
    question: "Quais são os principais obstáculos que te impedem de tomar essa decisão?",
    type: "textarea",
    placeholder: "Os maiores obstáculos são...",
    required: false,
    category: "emotional"
  },
  {
    id: "ideal_outcome",
    question: "Descreva o resultado ideal que você espera alcançar com esta decisão:",
    type: "textarea",
    placeholder: "No cenário ideal, eu gostaria que...",
    required: false,
    category: "priorities"
  },
  
  // Informações pessoais adicionais
  {
    id: "life_satisfaction",
    question: "De modo geral, qual é seu nível de satisfação com sua vida atual?",
    type: "slider",
    min: "Pouco satisfeito",
    max: "Muito satisfeito",
    required: false,
    category: "personal"
  },
  {
    id: "stress_level",
    question: "Como você descreveria seu nível de estresse atual?",
    type: "slider",
    min: "Baixo estresse",
    max: "Alto estresse",
    required: false,
    category: "personal"
  },
  {
    id: "personal_strengths",
    question: "Quais são suas principais qualidades ou pontos fortes?",
    type: "textarea",
    placeholder: "Minhas principais qualidades são...",
    required: false,
    category: "personal"
  },
];
