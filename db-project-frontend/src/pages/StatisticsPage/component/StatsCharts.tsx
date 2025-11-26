import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1E90FF", "#FF6347", "#32CD32", "#FFD700", "#8A2BE2"];

// ---------------------------
// Types
// ---------------------------
interface CrimeType {
  id: number;
  name: string;
}

interface PieDataItem {
  name: string;
  count: number;
}

interface BarDataItem {
  zone: string;
  crimeCount: number;
}

interface LineDataItem {
  date: string;
  crimeCount: number;
}

const StatsCharts = () => {
  // ---------------------------
  // STATES
  // ---------------------------
  const [crimeTypes, setCrimeTypes] = useState<CrimeType[]>([]);
  const [selectedCrimeType, setSelectedCrimeType] = useState("");

  const [lineData, setLineData] = useState<LineDataItem[]>([]);
  const [barData, setBarData] = useState<BarDataItem[]>([]);
  const [pieData, setPieData] = useState<PieDataItem[]>([]);

  const [startLine, setStartLine] = useState("");
  const [endLine, setEndLine] = useState("");
  const [startBar, setStartBar] = useState("");
  const [endBar, setEndBar] = useState("");
  const [startPie, setStartPie] = useState("");
  const [endPie, setEndPie] = useState("");

  // ---------------------------
  // FETCH CRIME TYPES
  // ---------------------------
  const fetchCrimeTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats/crime-type-distribution");
      // extract crime types
      const types: CrimeType[] = res.data.map((item: any) => ({
        id: item.crimeTypeId,
        name: item.CrimeType.name,
      }));
      setCrimeTypes(types);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------
  // FETCH CHART DATA
  // ---------------------------
  const fetchLineData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats/crime-trend", {
        params: { crimeTypeId: selectedCrimeType, start: startLine, end: endLine },
      });
      const formatted: LineDataItem[] = res.data.map((item: any) => ({
        date: item.month, // e.g., "2025-01-01"
        crimeCount: Number(item.count),
      }));
      setLineData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBarData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats/zone-crime-count", {
        params: { start: startBar, end: endBar },
      });
      const formatted: BarDataItem[] = res.data.map((item: any) => ({
        zone: item.Zone?.name || "Unknown",
        crimeCount: Number(item.count),
      }));
      setBarData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPieData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stats/crime-type-distribution", {
        params: { start: startPie, end: endPie },
      });
      const formatted: PieDataItem[] = res.data.map((item: any) => ({
        name: item.CrimeType.name,
        count: Number(item.count),
      }));
      setPieData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCrimeTypes();
    fetchLineData();
    fetchBarData();
    fetchPieData();
  }, []);

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className="flex flex-col gap-y-10">

      {/* LINE CHART */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Crime Trend Over Time</h2>

          <div className="flex gap-3 items-center">
            <select
              value={selectedCrimeType}
              onChange={(e) => setSelectedCrimeType(e.target.value)}
              className="border px-3 py-1 rounded-lg shadow-sm"
            >
              <option value="">All Crime Types</option>
              {crimeTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={startLine}
              onChange={(e) => setStartLine(e.target.value)}
              className="border px-3 py-1 rounded-lg shadow-sm"
            />
            <span className="font-semibold text-gray-600">→</span>
            <input
              type="date"
              value={endLine}
              onChange={(e) => setEndLine(e.target.value)}
              className="border px-3 py-1 rounded-lg shadow-sm"
            />
            <button
              onClick={fetchLineData}
              className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="crimeCount" stroke="#FF4500" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Crimes per Zone</h2>

          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={startBar}
              onChange={(e) => setStartBar(e.target.value)}
              className="border px-3 py-1 rounded-lg shadow-sm"
            />
            <span className="font-semibold text-gray-600">→</span>
            <input
              type="date"
              value={endBar}
              onChange={(e) => setEndBar(e.target.value)}
              className="border px-3 py-1 rounded-lg shadow-sm"
            />
            <button
              onClick={fetchBarData}
              className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Apply
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="crimeCount" fill="#1E90FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Crime Type Distribution</h2>

        <div className="flex gap-3 items-center mb-4">
          <input
            type="date"
            value={startPie}
            onChange={(e) => setStartPie(e.target.value)}
            className="border px-3 py-1 rounded-lg shadow-sm"
          />
          <span className="font-semibold text-gray-600">→</span>
          <input
            type="date"
            value={endPie}
            onChange={(e) => setEndPie(e.target.value)}
            className="border px-3 py-1 rounded-lg shadow-sm"
          />
          <button
            onClick={fetchPieData}
            className="px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Apply
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData as any[]} cx="50%" cy="50%" label outerRadius={110} dataKey="count">
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default StatsCharts;
