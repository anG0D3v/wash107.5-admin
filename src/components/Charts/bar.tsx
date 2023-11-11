import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';


interface BarChartData {
  Name: string;
  value: number;
  Category?:string;
}

interface BarChartProps {
  data: BarChartData[];
  colors?: string[];
  title?: string;
  yAxisMargin?: number;
}

const Barcharts: React.FC<BarChartProps> = ({ data, yAxisMargin = 10 }) => {
    const maxCount = Math.max(...data.map(item => item.value));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, maxCount + yAxisMargin]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8">
          <LabelList dataKey="Name" position="top" /> {/* Show labels at the top of each bar */}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default Barcharts;
