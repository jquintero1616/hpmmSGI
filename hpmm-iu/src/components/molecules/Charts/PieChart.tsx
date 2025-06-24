import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  title?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6699"];

const CustomPieChart: React.FC<PieChartProps> = ({ data, dataKey, nameKey, title }) => (
  <div style={{ width: "100%", height: 300 }}>
    {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default CustomPieChart;