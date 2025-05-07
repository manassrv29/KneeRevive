// src/pages/SaviourMode.js

import React, { useState, useEffect } from "react";
import SensorChart from "../components/SensorChart";
import "./SaviourMode.css";
import { useNavigate } from "react-router-dom";
import { 
  FaChartLine, 
  FaRobot, 
  FaHeartbeat, 
  FaChevronRight, 
  FaArrowUp, 
  FaArrowDown,
  FaCalendarAlt,
  FaBell,
  FaPlay,
  FaPause,
  FaStop,
  FaRecordVinyl
} from "react-icons/fa";

const SaviourMode = () => {
  const navigate = useNavigate();
  const [monitoringStatus, setMonitoringStatus] = useState("inactive"); // inactive, active, paused
  const [monitorDuration, setMonitorDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Handle monitoring status changes
  useEffect(() => {
    if (monitoringStatus === "active") {
      const interval = setInterval(() => {
        setMonitorDuration(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [monitoringStatus]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Start monitoring
  const startMonitoring = () => {
    setMonitoringStatus("active");
  };

  // Pause monitoring
  const pauseMonitoring = () => {
    setMonitoringStatus("paused");
  };

  // Resume monitoring
  const resumeMonitoring = () => {
    setMonitoringStatus("active");
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setMonitoringStatus("inactive");
    setMonitorDuration(0);
  };

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
    <div className="saviour-container">
      <h1 className="saviour-title">Knee Movement Insights</h1>
      <p className="saviour-subtitle">Your personal recovery assistant</p>

      {/* Stats Section */}
      <div className="stats-row">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-trend ${stat.trendDirection === "up" ? "trend-up" : "trend-down"}`}>
              {stat.trendDirection === "up" ? <FaArrowUp /> : <FaArrowDown />}
              {stat.trend} this week
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-icon-wrapper">
            <FaChartLine size={24} className="chart-icon" />
          </div>
          <h2>Real-Time Sensor Data</h2>
        </div>
        <p className="chart-description">
          Track your knee movement patterns and monitor progress over time. Data is collected from advanced sensors for precise analysis.
        </p>
        
        <div className="monitoring-controls">
          <div className="monitoring-status">
            <span className={`status-dot ${monitoringStatus === "active" ? "active" : monitoringStatus === "paused" ? "paused" : ""}`}></span>
            <span className="status-text">
              {monitoringStatus === "active" 
                ? `Monitoring Active (${formatTime(monitorDuration)})` 
                : monitoringStatus === "paused" 
                  ? `Monitoring Paused (${formatTime(monitorDuration)})` 
                  : "Monitoring Inactive"}
            </span>
          </div>
          <div className="controls-buttons">
            {monitoringStatus === "inactive" && (
              <button onClick={startMonitoring} className="control-button start-button">
                <FaPlay size={14} /> Start Monitoring
              </button>
            )}
            {monitoringStatus === "active" && (
              <>
                <button onClick={pauseMonitoring} className="control-button pause-button">
                  <FaPause size={14} /> Pause
                </button>
                <button onClick={stopMonitoring} className="control-button stop-button">
                  <FaStop size={14} /> Stop
                </button>
              </>
            )}
            {monitoringStatus === "paused" && (
              <>
                <button onClick={resumeMonitoring} className="control-button resume-button">
                  <FaPlay size={14} /> Resume
                </button>
                <button onClick={stopMonitoring} className="control-button stop-button">
                  <FaStop size={14} /> Stop
                </button>
              </>
            )}
          </div>
        </div>
        
        <SensorChart />
      </div>

      <div className="options-section">
        <div
          className="option-card"
          onClick={() => navigate("/weekly-assessment")}
        >
          <div className="card-icon-wrapper">
            <FaCalendarAlt size={28} className="card-icon" />
          </div>
          <h2>Assessment of the Week</h2>
          <p>
            Review your weekly knee movement summary, progress charts, and any 
            critical alerts. Get personalized recommendations based on your activity patterns.
          </p>
          <button className="option-button">
            View Report <FaChevronRight size={12} />
          </button>
        </div>

        <div className="option-card" onClick={() => navigate("/botknee")}>
          <div className="card-icon-wrapper">
            <FaRobot size={28} className="card-icon" />
          </div>
          <h2>Talk to BotKnee</h2>
          <p>
            Get AI-based feedback, professional advice, and personalized 
            improvement tips for your recovery journey. Our virtual assistant is 
            available 24/7.
          </p>
          <button className="option-button">
            Chat Now <FaChevronRight size={12} />
          </button>
        </div>

        <div className="option-card" onClick={() => navigate("/alerts")}>
          <div className="card-icon-wrapper">
            <FaBell size={28} className="card-icon" />
          </div>
          <h2>Alert Settings</h2>
          <p>
            Customize your notification preferences for movement alerts, 
            reminders, and progress milestones. Stay informed about your knee health.
          </p>
          <button className="option-button">
            Configure <FaChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaviourMode;