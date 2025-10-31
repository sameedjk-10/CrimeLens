import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const crimeData = [
  { name: "Robbery", value: 12 },
  { name: "Assault", value: 8 },
  { name: "Burglary", value: 5 },
  { name: "Fraud", value: 10 },
];

const zoneData = [
  { zone: "North", crimes: 18 },
  { zone: "South", crimes: 12 },
  { zone: "East", crimes: 9 },
  { zone: "West", crimes: 15 },
];

const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#ef4444"];

const StatsCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.05)] w-140">
        <h2 className="text-lg font-semibold mb-4">Crime Breakdown by Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart> 
            <Pie
              data={crimeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={130}
              label
            >
              {crimeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-[0_0_5px_rgba(0,0,0,0.05)] w-140">
        <h2 className="text-lg font-semibold mb-4">Crimes Reported by Zone</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={zoneData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="crimes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsCharts;
