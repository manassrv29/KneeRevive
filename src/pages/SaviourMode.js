// src/pages/SaviourMode.js

import React, { useState, useEffect } from "react";
import SensorChart from "../components/SensorChart";
import "./SaviourMode.css";
import { useNavigate } from "react-router-dom";
import { 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown
} from "react-icons/fa";
import { Box, Typography, Paper, Grid, Button, Fade, Avatar } from '@mui/material';

const colors = {
  aqua: '#00A8E8',
  green: '#22c55e',
  lightBg: '#F8FEFF',
  cardBg: 'rgba(255,255,255,0.85)',
  shadow: '0 8px 32px rgba(0,168,232,0.10)',
  statBlue: '#1B4965',
  statGreen: '#22c55e',
  statGrey: '#5a7a9d',
};

const SaviourMode = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState("inactive"); // for stat coloring
  const [monitorDuration, setMonitorDuration] = useState(0);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Sample data for stats
  const stats = [
    {
      value: "89%",
      label: "Mobility Score",
      trend: "+5%",
      trendDirection: "up"
    },
    {
      value: "6",
      label: "Days Without Pain",
      trend: "+2",
      trendDirection: "up"
    },
    {
      value: "15",
      label: "Exercises Completed",
      trend: "-3",
      trendDirection: "down"
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, ${colors.lightBg} 0%, #e0f7fa 100%)`,
      py: { xs: 3, md: 6 },
      px: { xs: 1, md: 0 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Fade in={fadeIn} timeout={900}>
        <Box sx={{ width: '100%', maxWidth: 900 }}>
          <Typography variant="h3" sx={{
            fontWeight: 800,
            color: colors.aqua,
            mb: 1,
            textAlign: 'center',
            letterSpacing: '-0.5px',
            textShadow: '0 2px 12px #00A8E822'
          }}>
            Knee Movement Insights
          </Typography>
          <Typography variant="subtitle1" sx={{
            color: colors.statGrey,
            textAlign: 'center',
            mb: 4,
            fontWeight: 500
          }}>
            Your personal recovery assistant
          </Typography>

          {/* Stats Section */}
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper elevation={3} sx={{
                  p: 3,
                  borderRadius: 3,
                  background: colors.cardBg,
                  boxShadow: colors.shadow,
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.03)',
                    boxShadow: '0 16px 32px #00A8E822',
                  }
                }}>
                  <Typography variant="h4" sx={{
                    fontWeight: 800,
                    color: index === 0 ? colors.aqua : index === 1 ? colors.green : colors.statBlue,
                    mb: 1
                  }}>{stat.value}</Typography>
                  <Typography variant="subtitle1" sx={{
                    color: colors.statBlue,
                    fontWeight: 700,
                    mb: 0.5
                  }}>{stat.label}</Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.trendDirection === 'up' ? colors.green : '#e53e3e',
                    fontWeight: 600,
                    fontSize: 15
                  }}>
                    {stat.trendDirection === 'up' ? <FaArrowUp /> : <FaArrowDown />} {stat.trend} this week
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Chart Card */}
          <Paper elevation={4} sx={{
            borderRadius: 4,
            background: colors.cardBg,
            boxShadow: colors.shadow,
            p: { xs: 2, md: 4 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 900,
            mx: 'auto',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: colors.aqua, color: '#fff', mr: 2 }}>
                <FaChartLine size={24} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.statBlue }}>
                Real-Time Sensor Data
              </Typography>
            </Box>
            <Typography sx={{ color: colors.statGrey, mb: 2, fontWeight: 500 }}>
              Track your knee movement patterns and monitor progress over time. Data is collected from advanced sensors for precise analysis.
            </Typography>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', background: '#f0f7ff', p: { xs: 1, md: 2 } }}>
              <SensorChart />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  background: `linear-gradient(90deg, ${colors.aqua}, ${colors.green})`,
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  fontSize: '1.08rem',
                  boxShadow: '0 2px 8px #22c55e22',
                  textTransform: 'none',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: colors.green,
                    transform: 'scale(1.04)'
                  }
                }}
                onClick={() => navigate('/weekly-assessment')}
                startIcon={<FaArrowUp />}
              >
                Weekly Assessment
              </Button>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default SaviourMode;