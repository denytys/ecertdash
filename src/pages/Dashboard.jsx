// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { Table, Select, message } from "antd";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import countryMap from "../utils/CountryMap";

export default function Dashboard() {
  const currentYear = new Date().getFullYear();

  const [selectedChart, setSelectedChart] = useState("ecertin"); // Untuk table
  const [selectedYear, setSelectedYear] = useState(currentYear); // Tahun chart
  const [selectedType, setSelectedType] = useState("ecertin"); // Untuk chart
  const [statsData, setStatsData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // Fetch total stats
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ESPS_DASH_BE}/dashboard/stats`)
      .then((res) => setStatsData(res.data || {}))
      .catch((err) => {
        console.error("Error fetching stats:", err);
        message.error("Gagal memuat statistik");
      });
  }, []);

  // Fetch table data
  useEffect(() => {
    const year = statsData?.year || currentYear;
    axios
      .get(
        `${
          import.meta.env.VITE_ESPS_DASH_BE
        }/dashboard/tabledata?type=${selectedChart}&year=${year}`
      )
      .then((res) => {
        setTableData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching table data:", err);
        message.error("Gagal memuat data tabel");
      });
  }, [selectedChart, statsData?.year]);

  // Fetch chart data
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_ESPS_DASH_BE
        }/dashboard/monthly?type=${selectedType}&year=${selectedYear}`
      )
      .then((res) => {
        const data = res.data || [];
        // Inisialisasi semua bulan (1-12) dengan 0
        const months = Array.from({ length: 12 }, (_, i) => ({
          bulan: i + 1,
          jumlah: 0,
        }));
        // Isi data dari backend
        data.forEach((item) => {
          const idx = parseInt(item.bulan) - 1;
          if (idx >= 0 && idx < 12) {
            months[idx].jumlah = parseInt(item.total);
          }
        });
        setChartData(months);
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
        message.error("Gagal memuat grafik");
      });
  }, [selectedType, selectedYear]);

  const stats = [
    {
      title: "Ecert In",
      value: statsData.ecert_in || 0,
      icon: <LoginOutlined />,
      color: "bg-purple-500",
    },
    {
      title: "Ephyto In",
      value: statsData.ephyto_in || 0,
      icon: <LoginOutlined />,
      color: "bg-yellow-500",
    },
    {
      title: "Ecert Out",
      value: statsData.ecert_out || 0,
      icon: <LogoutOutlined />,
      color: "bg-green-500",
    },
    {
      title: "Ephyto Out",
      value: statsData.ephyto_out || 0,
      icon: <LogoutOutlined />,
      color: "bg-blue-500",
    },
  ];

  const columns = [
    { title: "Negara", dataIndex: "negara", key: "negara" },
    { title: "Jumlah", dataIndex: "jumlah", key: "jumlah" },
  ].map((col) => ({
    ...col,
    onHeaderCell: () => ({ style: { fontSize: "12px", padding: "6px 10px" } }),
    onCell: () => ({ style: { fontSize: "12px", padding: "6px 10px" } }),
  }));

  return (
    <div className="w-full min-h-screen p-2 bg-gray-100">
      {/* Row 1: Stats */}
      <div className="bg-white rounded-xl shadow w-full">
        <h2 className="font-semibold ml-5 mb-2 pt-3">
          Total Ecert dan Ephyto {statsData.year || currentYear}
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center p-2 gap-1 md:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-gray-100 w-full pl-4 pr-8 pt-4 pb-4 gap-3 flex flex-row mb-4 rounded-xl ml-3 mr-3"
            >
              <div
                className={`${stat.color} text-white w-8 h-8 flex items-center justify-center rounded-full text-lg`}
              >
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs">{stat.title}</span>
                <span className="text-xl font-bold">
                  {Number(stat.value || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Chart + Table */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        {/* Table Card */}
        <div className="bg-white rounded-xl p-3 shadow w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold ml-2">
              Top Negara {statsData.year || currentYear}
            </h2>
            <Select
              value={selectedChart}
              onChange={(value) => setSelectedChart(value)}
            >
              <Select.Option value="ecertin">Ecert In</Select.Option>
              <Select.Option value="ephytoin">Ephyto In</Select.Option>
              <Select.Option value="ecertout">Ecert Out</Select.Option>
              <Select.Option value="ephytoout">Ephyto Out</Select.Option>
            </Select>
          </div>
          <Table
            columns={columns}
            dataSource={tableData.map((item, idx) => ({
              key: `${item.negara}-${idx}`,
              ...item,
              negara: countryMap[item.negara] || item.negara,
            }))}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
          />
        </div>

        {/* Chart Card */}
        <div className="bg-white rounded-xl p-3 shadow w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold ml-2">Grafik Bulanan</h2>
            <div className="flex gap-2">
              <Select
                value={selectedType}
                onChange={(val) => setSelectedType(val)}
                style={{ width: 100 }}
              >
                <Select.Option value="ecertin">Ecert In</Select.Option>
                <Select.Option value="ephytoin">Ephyto In</Select.Option>
                <Select.Option value="ecertout">Ecert Out</Select.Option>
                <Select.Option value="ephytoout">Ephyto Out</Select.Option>
              </Select>
              <Select
                value={selectedYear}
                onChange={(val) => setSelectedYear(val)}
                style={{ width: 90 }}
              >
                {[2023, 2024, 2025].map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="bulan"
                tickFormatter={(month) => monthNames[month - 1]}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                labelFormatter={(month) => monthNames[month - 1]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="jumlah"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: via dokumen */}
      <div className="bg-white rounded-xl mt-4 shadow w-full">
        <h2 className="font-semibold ml-5 mb-2 pt-3">Total Via Doc</h2>
        <div className="flex flex-col md:flex-row items-center justify-center p-2 gap-1 md:gap-4">
          <div className="flex flex-col md:flex-row gap-12 mb-4 items-center justify-center rounded-full ml-3 mr-3 text-lg">
            <div className=" bg-amber-200 px-12 md:px-34 py-2 rounded-2xl w-full">
              <p className="text-xs">ASW</p>
              <p className="text-xl font-bold">
                {Number(statsData.asw || 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-blue-200 px-12 md:px-34 py-2 rounded-2xl w-full">
              <p className="text-xs">IPPC</p>
              <p className="text-xl font-bold">
                {Number(statsData.ippc || 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-emerald-200 px-12 md:px-34 py-2 rounded-2xl w-full">
              <p className="text-xs">H2H</p>
              <p className="text-xl font-bold">
                {Number(statsData.h2h || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
