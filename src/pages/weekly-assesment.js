import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Paper, 
  LinearProgress, 
  Button,
  Container
} from "@mui/material";
import { Line } from "react-chartjs-2";
import "./WeeklyAssessment.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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
      // Simulating API response for demo purposes
      // Replace with actual API call in production
      setTimeout(() => {
        const mockData = {
          total_readings: 156,
          abnormal_percentage: 12,
          average_acceleration_magnitude: 0.85,
          daily_readings: [65, 78, 76, 84, 92, 88, 95]
        };
        setData(mockData);
        setLoading(false);
      }, 1500);
      
      // Uncomment for real API call
      // const response = await axios.get(`http://localhost:5000/assessment?user_id=${userId}`);
      // setData(response.data);
    } catch (err) {
      setError("Failed to fetch assessment data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch data on component mount
    fetchData();
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const getImprovementStatus = () => {
    if (!data) return "Not Available";
    const { average_acceleration_magnitude } = data;
    if (average_acceleration_magnitude < 1) return "Significant Improvement";
    if (average_acceleration_magnitude >= 1 && average_acceleration_magnitude <= 1.5) return "Stable";
    return "Deterioration Detected";
  };

  const getStatusClass = () => {
    if (!data) return "";
    const { average_acceleration_magnitude } = data;
    if (average_acceleration_magnitude < 1) return "improvement";
    if (average_acceleration_magnitude >= 1 && average_acceleration_magnitude <= 1.5) return "stable";
    return "deterioration";
  };

  const getProgressBarClass = () => {
    if (!data) return "";
    const { abnormal_percentage } = data;
    if (abnormal_percentage < 10) return "low";
    if (abnormal_percentage >= 10 && abnormal_percentage <= 30) return "medium";
    return "high";
  };

  const graphData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Knee Health Score",
        data: data ? data.daily_readings : [65, 78, 76, 84, 92, 88, 95],
        backgroundColor: "rgba(10, 108, 187, 0.1)",
        borderColor: "#0a6cbb",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#0a6cbb",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: "#0a4d8c",
          font: {
            size: 12,
            weight: 'bold'
          }
        },
      },
      tooltip: {
        backgroundColor: "rgba(10, 77, 140, 0.8)",
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(159, 209, 255, 0.2)"
        },
        ticks: {
          color: "#5a7a9d",
          font: {
            size: 12
          }
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(159, 209, 255, 0.2)"
        },
        ticks: {
          color: "#5a7a9d",
          font: {
            size: 12
          }
        },
      },
    },
    animations: {
      radius: {
        duration: 400,
        easing: 'linear'
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <Box className="assessment-container">
      <Container maxWidth="lg">
        <div className="assessment-header">
          <Typography variant="h1">Weekly Assessment Report</Typography>
          <Typography>Comprehensive analysis of your knee health progress</Typography>
        </div>
        
        {loading ? (
          <Box className="loading-container">
            <CircularProgress size={60} style={{ color: "#0a6cbb" }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button 
                variant="contained" 
                className="fetch-button" 
                onClick={fetchData}
                disabled={loading}
                startIcon={<RefreshIcon />}
              >
                Refresh Data
              </Button>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className="metric-card" elevation={0}>
                <CalendarTodayIcon style={{ fontSize: 36, color: "#60a5fa", marginBottom: "1rem" }} />
                <Typography variant="h6">Total Readings</Typography>
                <Typography variant="h4">
                  {data ? data.total_readings : "—"}
                </Typography>
                <Typography className="tooltip">Weekly recorded measurements</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className="metric-card" elevation={0}>
                <SpeedIcon style={{ fontSize: 36, color: "#60a5fa", marginBottom: "1rem" }} />
                <Typography variant="h6">Abnormal Percentage</Typography>
                <Typography variant="h4">
                  {data ? `${data.abnormal_percentage}%` : "—"}
                </Typography>
                <Typography className="tooltip">Irregular movement patterns</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className="metric-card" elevation={0}>
                <TrendingUpIcon style={{ fontSize: 36, color: "#60a5fa", marginBottom: "1rem" }} />
                <Typography variant="h6">Acceleration Magnitude</Typography>
                <Typography variant="h4">
                  {data ? data.average_acceleration_magnitude : "—"}
                </Typography>
                <Typography className="tooltip">Movement smoothness indicator</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box className="progress-section">
                <Typography variant="h6">Overall Recovery Progress</Typography>
                <Typography variant="h5" className={`status-text ${getStatusClass()}`}>
                  {getImprovementStatus()}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={data ? Math.min(100 - data.abnormal_percentage, 100) : 0} 
                  className={`progress-bar ${getProgressBarClass()}`}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box className="graph-container">
                <Typography variant="h6" className="graph-title">Weekly Knee Health Progress</Typography>
                <Line ref={chartRef} data={graphData} options={graphOptions} height={80} />
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography className="error-text">{error}</Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default WeeklyAssessment;