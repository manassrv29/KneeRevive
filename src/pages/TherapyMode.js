import React, { useState, useEffect } from "react";
import { Activity, X, Clock, Heart, Waves, ChevronRight, CheckCircle } from "lucide-react";
import "./TherapyMode.css";

const TherapyMode = () => {
  const [therapyStatus, setTherapyStatus] = useState("idle");
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showDurationSelector, setShowDurationSelector] = useState(false);
  const [showGelPadInstructions, setShowGelPadInstructions] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [remainingTime, setRemainingTime] = useState(0);
  const [intervalIds, setIntervalIds] = useState({ duration: null, countdown: null });
  const [progressPercentage, setProgressPercentage] = useState(100);

  useEffect(() => {
    return () => {
      if (intervalIds.duration) clearInterval(intervalIds.duration);
      if (intervalIds.countdown) clearInterval(intervalIds.countdown);
    };
  }, [intervalIds]);

  useEffect(() => {
    if (therapyStatus === "active" && remainingTime > 0) {
      const totalTime = selectedDuration * 60;
      setProgressPercentage((remainingTime / totalTime) * 100);
    }
  }, [remainingTime, selectedDuration, therapyStatus]);

  const startTherapy = () => {
    setShowDurationSelector(true);
  };

  const selectDurationAndContinue = () => {
    setShowDurationSelector(false);
    setShowGelPadInstructions(true);
    setRemainingTime(selectedDuration * 60);
    setProgressPercentage(100);
  };

  const continueToActiveTherapy = () => {
    setShowGelPadInstructions(false);
    setTherapyStatus("active");

    const durationIntervalId = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    const countdownIntervalId = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalId);
          clearInterval(durationIntervalId);
          stopTherapy();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalIds({ duration: durationIntervalId, countdown: countdownIntervalId });
  };

  const stopTherapy = () => {
    setTherapyStatus("idle");
    setSessionDuration(0);
    setProgressPercentage(100);

    if (intervalIds.duration) clearInterval(intervalIds.duration);
    if (intervalIds.countdown) clearInterval(intervalIds.countdown);

    setIntervalIds({ duration: null, countdown: null });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const renderDurationSelector = () => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Set Therapy Duration</h2>
          <div className="duration-selector">
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="5"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
            />
            <div className="preset-durations">
              {[15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSelectedDuration(mins)}
                  className={`preset-button ${selectedDuration === mins ? "selected" : ""}`}
                >
                  {mins} min
                </button>
              ))}
            </div>
            <p>Selected duration: <strong>{selectedDuration} minutes</strong></p>
          </div>
          <button onClick={selectDurationAndContinue} className="continue-button">
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderGelPadInstructions = () => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Attach Gel Pads</h2>
          <p>Please attach the gel pads to your knee as shown in the diagram below for optimal therapy results.</p>
          
          <div className="gel-pad-instructions">
            <div className="gel-pad-image">
              [Knee placement diagram]
            </div>
            <p>Ensure each pad makes full contact with skin for best results.</p>
          </div>
          
          <button onClick={continueToActiveTherapy} className="continue-button">
            Start Therapy <CheckCircle size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="therapy-mode">
      <h1>Therapy Mode</h1>
      <div className="therapy-status-card">
        <div className="card-header">
          <div className="card-header-icon">
            <Waves size={24} />
          </div>
          <h2 className="card-title">Electronic Pulse Therapy</h2>
        </div>
        
        <div className="status-row">
          <span className="status-label">Status</span>
          <span className={`status-value ${therapyStatus === "active" ? "active" : "idle"}`}>
            <span className={`status-indicator ${therapyStatus === "active" ? "active" : "idle"}`}></span>
            {therapyStatus === "active" ? "Therapy Active" : "Idle"}
          </span>
        </div>
        
        <div className="status-row">
          <span className="status-label">Session Duration</span>
          <span className="status-value time">
            <Clock size={16} style={{ marginRight: '6px' }} />
            {formatTime(sessionDuration)}
          </span>
        </div>
        
        {therapyStatus === "active" && (
          <>
            <div className="countdown-display">
              <div className="countdown-time">{formatTime(remainingTime)}</div>
              <div className="countdown-label">Remaining Time</div>
            </div>
            
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </>
        )}
        
        {therapyStatus === "idle" ? (
          <button onClick={startTherapy} className="action-button start">
            <Activity size={20} /> <span>Start Therapy</span>
          </button>
        ) : (
          <button onClick={stopTherapy} className="action-button stop">
            <X size={20} /> <span>Stop Therapy</span>
          </button>
        )}
      </div>
      
      {showDurationSelector && renderDurationSelector()}
      {showGelPadInstructions && renderGelPadInstructions()}
    </div>
  );
};

export default TherapyMode;