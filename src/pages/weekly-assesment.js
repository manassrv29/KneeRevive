import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Grid, Paper, LinearProgress, Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import "./WeeklyAssessment.css";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklyAssessment = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const userId = "user123"; // Replace with dynamic user ID retrieval logic

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/assessment?user_id=${userId}`);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImprovementStatus = () => {
    if (!data) return "N/A";
    const { average_acceleration_magnitude } = data;
    if (average_acceleration_magnitude < 1) return "Significant Improvement";
    if (average_acceleration_magnitude >= 1 && average_acceleration_magnitude <= 1.5) return "Stable";
    return "Deterioration Detected";
  };

  const graphData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Knee Health Progress",
        data: [70, 75, 72, 78, 80, 85, 90],
        backgroundColor: "#00a8cc",
        borderColor: "#00a8cc",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <Box className="assessment-container">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={12}>
          <Button 
            variant="contained" 
            className="fetch-button" 
            onClick={fetchData}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : "Fetch Assessment"}
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="metric-card">
            <Typography variant="h6">Total Readings</Typography>
            <Typography variant="h4">
              {data ? data.total_readings : "N/A"}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="metric-card">
            <Typography variant="h6">Abnormal Percentage</Typography>
            <Typography variant="h4">
              {data ? `${data.abnormal_percentage}%` : "N/A"}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="metric-card">
            <Typography variant="h6">Avg Acceleration Magnitude</Typography>
            <Typography variant="h4">
              {data ? data.average_acceleration_magnitude : "N/A"}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box className="progress-section">
            <Typography variant="h6">Improvement Status</Typography>
            <Typography variant="h5" className="status-text">
              {getImprovementStatus()}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={data ? Math.min(data.abnormal_percentage, 100) : 0} 
              className="progress-bar"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={12}>
          <Box className="graph-container">
            <Typography variant="h6" className="graph-title">Weekly Knee Health Progress</Typography>
            <Line ref={chartRef} data={graphData} options={graphOptions} />
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Typography className="error-text">{error}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default WeeklyAssessment;
