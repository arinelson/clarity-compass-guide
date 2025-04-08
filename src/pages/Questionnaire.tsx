
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Save, Smile, Meh, Frown, Clock, Heart, Brain, Target } from "lucide-react";
import { motion } from "framer-motion";
import { QuestionData, UserAnswers } from "@/types/questionnaire";
import { useToast } from "@/hooks/use-toast";
import QuestionnaireProgressBar from "@/components/QuestionnaireProgressBar";
import { getAllQuestions } from "@/data/questions";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<UserAnswers>({
    name: "",
    age: "",
    responses: {}
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load questions
    const loadedQuestions = getAllQuestions();
    setQuestions(loadedQuestions);
  }, []);

  const totalQuestions = questions.length;
  const progress = Math.round((currentStep / (totalQuestions + 1)) * 100);
  const currentQuestion = questions[currentStep - 1];

  const handleInputChange = (id: string, value: string | number | string[]) => {
    setAnswers(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [id]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate name and age
      if (!answers.name.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, nos diga seu nome para continuar.",
          variant: "destructive"
        });
        return;
      }
      
      if (!answers.age.trim()) {
        toast({
          title: "Idade obrigatória",
          description: "Por favor, informe sua idade para continuar.",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep <= totalQuestions) {
      // Check if current question was answered
      const questionId = currentQuestion.id;
      if (!answers.responses[questionId] && currentQuestion.required) {
        toast({
          title: "Resposta necessária",
          description: "Por favor, responda a pergunta para continuar.",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep === totalQuestions) {
      // Submit answers
      setIsLoading(true);
      
      // Save answers to localStorage
      localStorage.setItem('decisionScopeAnswers', JSON.stringify(answers));
      
      setTimeout(() => {
        setIsLoading(false);
        navigate('/results');
      }, 1500);
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderQuestion = (question: QuestionData) => {
    const value = answers.responses[question.id] || "";
    
    switch (question.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={question.placeholder || "Digite sua resposta"}
            value={value as string}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full"
          />
        );
        
      case "textarea":
        return (
          <Textarea
            placeholder={question.placeholder || "Digite sua resposta"}
            value={value as string}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="min-h-[120px]"
          />
        );
        
      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(val) => handleInputChange(question.id, val)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`} className="flex items-center gap-2">
                  {option.icon && getOptionIcon(option.icon)}
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case "slider":
        return (
          <div className="space-y-4 w-full">
            <Slider
              defaultValue={[50]}
              value={[parseInt(value as string) || 0]}
              onValueChange={(vals) => handleInputChange(question.id, vals[0].toString())}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.min || "0%"}</span>
              <span>{question.max || "100%"}</span>
            </div>
          </div>
        );
        
      default:
        return <p>Tipo de pergunta não suportado</p>;
    }
  };
  
  const getOptionIcon = (iconName: string) => {
    switch (iconName) {
      case "smile": return <Smile size={18} className="text-ds-green" />;
      case "meh": return <Meh size={18} className="text-ds-yellow" />;
      case "frown": return <Frown size={18} className="text-ds-blue" />;
      case "clock": return <Clock size={18} className="text-ds-blue" />;
      case "heart": return <Heart size={18} className="text-ds-purple" />;
      case "brain": return <Brain size={18} className="text-ds-purple" />;
      case "target": return <Target size={18} className="text-ds-green" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
      <div className="container max-w-3xl px-4 py-8 flex-grow">
        <QuestionnaireProgressBar progress={progress} />
        
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {currentStep === 0 ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Bem-vindo ao DecisionScope</CardTitle>
                <CardDescription className="text-center">
                  Vamos começar conhecendo você um pouco melhor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Qual é o seu nome?</Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome"
                    value={answers.name}
                    onChange={(e) => setAnswers(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Qual é a sua idade?</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Digite sua idade"
                    value={answers.age}
                    onChange={(e) => setAnswers(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          ) : currentStep <= totalQuestions ? (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.description && (
                  <CardDescription>
                    {currentQuestion.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {renderQuestion(currentQuestion)}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Estamos quase lá!</CardTitle>
                <CardDescription className="text-center">
                  Obrigado por compartilhar suas respostas, {answers.name}. 
                  Estamos prontos para gerar seu diagnóstico.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <div className="animate-pulse-gentle p-4 rounded-full bg-primary/20">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Voltar
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {currentStep < totalQuestions ? (
              <>
                Próximo <ArrowRight size={16} />
              </>
            ) : currentStep === totalQuestions ? (
              isLoading ? (
                <>Processando</>
              ) : (
                <>
                  Finalizar <Save size={16} />
                </>
              )
            ) : (
              <>
                Iniciar <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
