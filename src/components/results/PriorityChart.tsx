
import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PriorityChartProps {
  data: {
    values: { name: string; value: number }[];
    focusAreas: string[];
  };
}

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded p-2 border border-gray-100">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }

  return null;
};

const PriorityChart = ({ data }: PriorityChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Gráfico de Prioridades</h2>
        <p className="text-gray-600">O que realmente importa para você nesta decisão</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.values}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {data.values.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke={activeIndex === index ? "#fff" : "none"}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium mb-3">Legenda</h3>
          <div className="space-y-3">
            {data.values.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm">{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Áreas de Foco Recomendadas</h3>
          <ul className="space-y-2">
            {data.focusAreas.map((area, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="font-bold text-primary">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default PriorityChart;
