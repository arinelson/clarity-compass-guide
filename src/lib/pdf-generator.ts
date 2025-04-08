
import { jsPDF } from 'jspdf';
import { UserAnswers } from '@/types/questionnaire';

export const generateResultsPDF = async (userAnswers: UserAnswers, resultsData: any) => {
  try {
    const doc = new jsPDF();
    
    // Set title
    doc.setFontSize(20);
    doc.setTextColor(78, 53, 170);
    doc.text('DecisionScope - Diagnóstico de Clareza', 15, 20);
    
    // User info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Preparado para: ${userAnswers.name}`, 15, 30);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 15, 37);
    
    // Section divider
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 42, 195, 42);
    
    // Clarity Map
    doc.setFontSize(16);
    doc.setTextColor(78, 53, 170);
    doc.text('Mapa da Clareza', 15, 50);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tipo: ${resultsData.clarityMap.type}`, 20, 60);
    
    doc.setFontSize(12);
    let clarityDesc = doc.splitTextToSize(resultsData.clarityMap.description, 170);
    doc.text(clarityDesc, 20, 70);
    
    // Strengths
    let yPos = 85;
    doc.setFontSize(14);
    doc.text('Pontos Fortes:', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(12);
    resultsData.clarityMap.strengths.forEach((strength: string) => {
      doc.text(`• ${strength}`, 25, yPos);
      yPos += 7;
    });
    
    // Challenges
    yPos += 5;
    doc.setFontSize(14);
    doc.text('Desafios:', 20, yPos);
    yPos += 8;
    
    doc.setFontSize(12);
    resultsData.clarityMap.challenges.forEach((challenge: string) => {
      doc.text(`• ${challenge}`, 25, yPos);
      yPos += 7;
    });
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 10;
    }
    
    // Section divider
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, 195, yPos);
    yPos += 15;
    
    // Metaphor
    doc.setFontSize(16);
    doc.setTextColor(78, 53, 170);
    doc.text('Metáfora Visual', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${resultsData.metaphor.title}`, 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    let metaphorDesc = doc.splitTextToSize(resultsData.metaphor.description, 170);
    doc.text(metaphorDesc, 20, yPos);
    yPos += metaphorDesc.length * 7 + 10;
    
    // Add a new page for recommendations
    doc.addPage();
    
    // Recommendations
    doc.setFontSize(16);
    doc.setTextColor(78, 53, 170);
    doc.text('Recomendações Personalizadas', 15, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Ações Imediatas:', 15, 35);
    
    yPos = 45;
    doc.setFontSize(12);
    resultsData.actionSteps.immediate.forEach((action: string, index: number) => {
      let actionText = doc.splitTextToSize(`${index + 1}. ${action}`, 170);
      doc.text(actionText, 20, yPos);
      yPos += actionText.length * 7 + 5;
    });
    
    // Tools
    yPos += 5;
    doc.setFontSize(14);
    doc.text('Ferramentas Recomendadas:', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    resultsData.actionSteps.tools.forEach((tool: any) => {
      doc.setTextColor(78, 53, 170);
      doc.text(tool.name, 20, yPos);
      yPos += 7;
      
      doc.setTextColor(0, 0, 0);
      let toolDesc = doc.splitTextToSize(tool.description, 170);
      doc.text(toolDesc, 20, yPos);
      yPos += toolDesc.length * 7 + 5;
    });
    
    // Add DecisionScope footer
    yPos = 280;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('DecisionScope - Seu guia visual para decisões com clareza', 15, yPos);
    doc.text('www.decisionscope.com', 15, yPos + 5);
    
    // Save the PDF
    doc.save(`DecisionScope_${userAnswers.name.replace(/\s+/g, '_')}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
