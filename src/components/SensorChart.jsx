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
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const THRESHOLD_ACCEL = 1.5;
const THRESHOLD_GYRO = 100;

const colors = {
  blueBg: '#17406D', // deep blue background
  cardBg: '#fff', // white card
  buttonBlue: '#1976d2', // MUI blue
  buttonBlueDark: '#115293', // darker blue for hover
  heading: '#1B263B', // dark blue/gray
  text: '#334155', // blue-gray
  yellow: '#facc15',
  shadow: '0 8px 32px rgba(23,64,109,0.10)',
};

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
    <Box sx={{
      background: colors.blueBg,
      borderRadius: 4,
      p: { xs: 1, md: 3 },
      mb: 2,
    }}>
      <Paper elevation={4} sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        background: colors.cardBg,
        boxShadow: colors.shadow,
        maxWidth: '100%',
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          color: colors.heading,
          mb: 2,
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>
          Live Knee Sensor Monitoring
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" mb={3}>
          <Button
            variant="contained"
            onClick={handleStart}
            startIcon={<PlayArrowIcon />}
            sx={{
              background: colors.buttonBlue,
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontSize: '1.08rem',
              boxShadow: '0 2px 8px #1976d222',
              textTransform: 'none',
              transition: 'background 0.3s, transform 0.2s',
              '&:hover': {
                background: colors.buttonBlueDark,
                transform: 'scale(1.04)'
              }
            }}
          >
            {hasStarted ? "Resume" : "Start Monitoring"}
          </Button>
          <Button
            variant="contained"
            onClick={handlePause}
            startIcon={<PauseIcon />}
            sx={{
              background: colors.yellow,
              color: colors.heading,
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontSize: '1.08rem',
              boxShadow: '0 2px 8px #facc1522',
              textTransform: 'none',
              transition: 'background 0.3s, transform 0.2s',
              '&:hover': {
                background: '#ffe066',
                transform: 'scale(1.04)'
              }
            }}
          >
            Pause
          </Button>
        </Stack>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
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
        </Box>
      </Paper>
    </Box>
  );
};

export default SensorChart;
