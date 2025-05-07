import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
} from "recharts";

const THRESHOLD_ACCEL = 1.5;
const THRESHOLD_GYRO = 100;

const SensorChart = () => {
  const [allData, setAllData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch("/simulated_knee_data.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const rows = csvText.trim().split("\n");
        const headers = rows[0].split(",");
        const parsed = rows.slice(1).map((row) => {
          const values = row.split(",").map(Number);
          const obj = {};
          headers.forEach((h, i) => (obj[h] = values[i]));
          return obj;
        });
        setAllData(parsed);
      });
  }, []);

  useEffect(() => {
    if (isRunning && allData.length > 0) {
      intervalRef.current = setInterval(() => {
        setDisplayedData((prev) => {
          const nextIndex = indexRef.current;
          if (nextIndex >= allData.length) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return prev;
          }
          const newData = [...prev, allData[nextIndex]];
          indexRef.current += 1;
          return newData;
        });
      }, 100);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, allData]);

  const handleStart = () => {
    if (!hasStarted) {
      setDisplayedData([]);
      indexRef.current = 0;
      setHasStarted(true);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const jerkPoints = displayedData.filter(
    (d) =>
      Math.abs(d.ax) > THRESHOLD_ACCEL ||
      Math.abs(d.ay) > THRESHOLD_ACCEL ||
      Math.abs(d.az - 1) > 0.5 ||
      Math.abs(d.gx) > THRESHOLD_GYRO ||
      Math.abs(d.gy) > THRESHOLD_GYRO ||
      Math.abs(d.gz) > THRESHOLD_GYRO
  );

  return (
    <div className="p-4 bg-[#1e293b] rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400 text-center">
        Live Knee Sensor Monitoring
      </h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          {hasStarted ? "Resume" : "Start Monitoring"}
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
        >
          Pause
        </button>
      </div>

      <LineChart
        width={1000}
        height={400}
        data={displayedData}
        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          label={{ value: "Time (s)", position: "insideBottomRight", offset: 0 }}
        />
        <YAxis
          label={{ value: "Sensor Value", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="ax" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="ay" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="az" stroke="#ffc658" dot={false} />

        <Line type="monotone" dataKey="gx" stroke="#ff7300" dot={false} />
        <Line type="monotone" dataKey="gy" stroke="#0088FE" dot={false} />
        <Line type="monotone" dataKey="gz" stroke="#00C49F" dot={false} />

        {jerkPoints.map((point, index) => (
          <ReferenceDot
            key={index}
            x={point.timestamp}
            y={point.ax}
            r={5}
            fill="red"
            stroke="none"
            label={{
              value: "Jerk",
              position: "top",
              fill: "red",
              fontSize: 10,
            }}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default SensorChart;
