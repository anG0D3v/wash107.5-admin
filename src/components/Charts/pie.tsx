import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
  colors?: string[];
  title?: string;
}

const Piecharts: React.FC<PieChartProps> = 
({ data, 
    colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#b22222', '#800080', '#fff600']}) => {
  return (

    <ResponsiveContainer width="100%" height={300}>
      <PieChart >
        <Pie
          data={data}
          cx="35%"
          cy="40%"
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="center" verticalAlign="middle" layout="vertical" wrapperStyle={{ paddingLeft: '380px' }}/>
      </PieChart>
    </ResponsiveContainer>
 

  );
};

export default Piecharts;
