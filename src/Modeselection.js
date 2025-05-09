import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Container, 
  useTheme, 
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Divider,
  Fade,
  Grow,
  Slide
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import WavesIcon from '@mui/icons-material/Waves';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import InstructionGuide from './components/InstructionGuide';
import { keyframes } from '@emotion/react';

// Healthcare color palette
const colors = {
  blue: '#00A8E8', // Aqua blue
  lightBlue: '#E0F7FA', // Very light aqua
  green: '#22c55e', // Healthcare green
  white: '#FFFFFF',
  offWhite: '#F8FEFF',
  grey: '#E0EBF4',
  text: '#1B4965',
  shadow: '0 8px 32px rgba(0,168,232,0.10)',
};

// Floating animation for icons
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

// Glassmorphism background with floating shapes (aqua/green theme)
const GlassBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: 'linear-gradient(160deg, #f8feff 0%, #e0f7fa 100%)',
      overflow: 'hidden',
    }}
  >
    {/* Floating shapes */}
    <Box sx={{
      position: 'absolute',
      top: { xs: 20, md: 60 },
      left: { xs: 10, md: 80 },
      width: 180,
      height: 180,
      bgcolor: 'rgba(0,168,232,0.13)',
      borderRadius: '50%',
      filter: 'blur(8px)',
      animation: `${float} 7s ease-in-out infinite`,
    }} />
    <Box sx={{
      position: 'absolute',
      bottom: { xs: 40, md: 80 },
      right: { xs: 20, md: 120 },
      width: 120,
      height: 120,
      bgcolor: 'rgba(34,197,94,0.10)', // green
      borderRadius: '50%',
      filter: 'blur(10px)',
      animation: `${float} 9s 1s ease-in-out infinite`,
    }} />
    <Box sx={{
      position: 'absolute',
      top: { xs: 120, md: 200 },
      right: { xs: 40, md: 300 },
      width: 90,
      height: 90,
      bgcolor: 'rgba(0,168,232,0.10)',
      borderRadius: '50%',
      filter: 'blur(6px)',
      animation: `${float} 6s 2s ease-in-out infinite`,
    }} />
  </Box>
);



const ModeSelection = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState("User");
  const [activeStep, setActiveStep] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        // Extract name from email (example: john.doe@email.com -> John)
        if (user.email) {
          const namePart = user.email.split('@')[0].split('.')[0];
          setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNavigate = (mode) => {
    navigate(`/${mode}`);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const steps = [
    {
      label: 'Prepare Your KneeRevive',
      description: 'Ensure your KneeRevive device is fully charged and clean. Check that all straps are in good condition.',
      icon: <HealthAndSafetyIcon />
    },
    {
      label: 'Position the Device',
      description: 'Place the KneeRevive device on your knee with the sensor pad facing your skin. The device should be centered on your kneecap.',
      icon: <DirectionsRunIcon />
    },
    {
      label: 'Secure the Straps',
      description: 'Wrap the adjustable straps around your knee, starting from the bottom. Make sure the device is snug but not too tight. You should be able to move comfortably.',
      icon: <FitnessCenterIcon />
    },
    {
      label: 'Start Your Session',
      description: 'Power on the device and select your therapy mode. Follow the on-screen instructions for your specific rehabilitation program.',
      icon: <TimerIcon />
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(160deg, ${colors.offWhite} 0%, ${colors.lightBlue} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GlassBackground />
      {/* Top Navigation Bar */}
      <Box 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          py: 1.5,
          px: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WavesIcon sx={{ fontSize: 28, color: colors.blue, mr: 1 }} />
              <Typography variant="h6" fontWeight={700} color={colors.white}>
                KneeRevive
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    backgroundColor: colors.blue,
                    color: colors.white
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Box sx={{ ml: 1.5 }}>
                  <Typography variant="body2" sx={{ color: colors.white, fontWeight: 600 }}>
                    {userName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.grey, display: 'block', lineHeight: 1 }}>
                    {userEmail || "Loading..."}
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={handleLogout}
                variant="outlined"
                size="small"
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600, 
                  color: colors.white, 
                  borderColor: 'rgba(255,255,255,0.3)', 
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    borderColor: colors.white 
                  } 
                }}
                startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Slide in={animate} direction="down" timeout={900}>
            <Box sx={{ mb: { xs: 5, md: 6 }, textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 900, 
                  color: colors.blue, 
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem' },
                  letterSpacing: '-0.02em',
                  mb: 2,
                  textShadow: '0 4px 24px #00A8E822'
                }}
              >
                Your Personal Knee Recovery Assistant
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: colors.text, 
                  maxWidth: '700px', 
                  mx: 'auto', 
                  fontSize: { xs: '1.1rem', md: '1.2rem' },
                  lineHeight: 1.7,
                  textShadow: '0 2px 12px #00A8E822'
                }}
              >
                Experience personalized rehabilitation with cutting-edge technology designed to accelerate your recovery and monitor progress in real-time.
              </Typography>
            </Box>
          </Slide>

          {/* Mode Selection Cards with images */}
          <Fade in={animate} timeout={1100}>
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{
                  height: '100%',
                  background: colors.white,
                  borderRadius: 4,
                  boxShadow: colors.shadow,
                  p: { xs: 3, md: 4 },
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 16px 32px #00A8E822',
                  },
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: colors.blue, color: colors.white, mr: 1 }}>
                      <FavoriteIcon />
                    </Avatar>
                    <Typography variant="overline" sx={{ color: colors.blue, fontWeight: 700, letterSpacing: 1 }}>
                      PERSONALIZED CARE
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>
                    Therapy Mode
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text, mb: 2 }}>
                    Customized rehabilitation exercises and therapeutic guidance specifically designed for your knee recovery journey.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {['Personalized Plans', 'Progress Tracking', 'Pain Management'].map((feature) => (
                      <Box key={feature} sx={{ background: colors.lightBlue, borderRadius: 5, px: 1.5, py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: colors.blue }}>{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 1, 
                      background: `linear-gradient(90deg, ${colors.blue}, ${colors.green})`,
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 2,
                      fontSize: '1.08rem',
                      boxShadow: '0 2px 8px #22c55e22',
                      letterSpacing: 0.5,
                      transition: 'background 0.3s',
                      '&:hover': {
                        background: colors.green
                      }
                    }}
                    onClick={() => handleNavigate('therapy')}
                  >
                    Start Therapy Session
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{
                  height: '100%',
                  background: colors.white,
                  borderRadius: 4,
                  boxShadow: colors.shadow,
                  p: { xs: 3, md: 4 },
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 16px 32px #00A8E822',
                  },
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: colors.green, color: colors.white, mr: 1 }}>
                      <ShieldIcon />
                    </Avatar>
                    <Typography variant="overline" sx={{ color: colors.green, fontWeight: 700, letterSpacing: 1 }}>
                      SAFETY FIRST
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>
                    Saviour Mode
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.text, mb: 2 }}>
                    Advanced monitoring with emergency alerts, fall detection, and immediate assistance during your recovery process.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {['Fall Detection', 'Emergency Alerts', '24/7 Monitoring'].map((feature) => (
                      <Box key={feature} sx={{ background: colors.lightBlue, borderRadius: 5, px: 1.5, py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: colors.green }}>{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 1, 
                      background: `linear-gradient(90deg, ${colors.green}, ${colors.blue})`,
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.2,
                      borderRadius: 2,
                      fontSize: '1.08rem',
                      boxShadow: '0 2px 8px #00A8E822',
                      letterSpacing: 0.5,
                      transition: 'background 0.3s',
                      '&:hover': {
                        background: colors.blue
                      }
                    }}
                    onClick={() => handleNavigate('saviour')}
                  >
                    Activate Saviour Mode
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Fade>

          {/* Instructions Section */}
          <Fade in={animate} timeout={1300}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 4, 
                mt: 4,
                mb: 4, 
                background: 'rgba(255, 255, 255, 0.85)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,89,142,0.10)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: colors.text,
                  mb: 3,
                  textAlign: 'center'
                }}
              >
                How to Use KneeRevive
              </Typography>

              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Avatar 
                          sx={{ 
                            backgroundColor: colors.blue,
                            color: colors.white
                          }}
                        >
                          {step.icon}
                        </Avatar>
                      )}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: colors.text
                        }}
                      >
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography 
                        sx={{ 
                          color: colors.blue,
                          mb: 2
                        }}
                      >
                        {step.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleStep(index + 1)}
                          sx={{ 
                            mr: 1,
                            backgroundColor: colors.blue,
                            '&:hover': {
                              backgroundColor: colors.lightBlue
                            }
                          }}
                        >
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleStep(index - 1)}
                          sx={{ 
                            color: colors.blue
                          }}
                        >
                          Back
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Fade>

          {/* Option Cards Section (moved from SaviourMode) */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            mt: 2,
            overflowX: { xs: 'auto', md: 'visible' },
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            pb: 2,
            zIndex: 2
          }}>
            {[0, 1, 2].map((i) => (
              <Grow in={animate} timeout={1000 + i * 300} key={i}>
                <Card elevation={6} sx={{
                  minWidth: 320,
                  maxWidth: 400,
                  flex: '0 0 340px',
                  borderRadius: 5,
                  textAlign: 'center',
                  p: 3,
                  background: 'rgba(255,255,255,0.75)',
                  boxShadow: '0 8px 32px rgba(0,89,142,0.13)',
                  border: `1.5px solid ${colors.grey}`,
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'transform 0.35s, box-shadow 0.35s',
                  '&:hover': {
                    transform: 'scale(1.055) translateY(-6px)',
                    boxShadow: `0 20px 40px ${colors.blue}33, 0 2px 16px ${colors.blue}22`,
                    borderColor: colors.blue
                  }
                }}>
                  {/* Accent bar */}
                  <Box sx={{
                    position: 'absolute',
                    top: -8,
                    left: 32,
                    right: 32,
                    height: 6,
                    borderRadius: 3,
                    background: i === 0 ? `linear-gradient(90deg, ${colors.lightBlue}, ${colors.blue})` : i === 1 ? `linear-gradient(90deg, ${colors.blue}, ${colors.green})` : `linear-gradient(90deg, ${colors.green}, ${colors.blue})`,
                    boxShadow: `0 2px 8px ${colors.blue}22`
                  }} />
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar sx={{
                      bgcolor: i === 0 ? colors.lightBlue : i === 1 ? colors.blue : colors.green,
                      width: 64,
                      height: 64,
                      boxShadow: `0 4px 16px ${colors.blue}22`,
                      animation: `${float} 3.5s ${i * 0.5}s infinite`,
                      transition: 'transform 0.25s',
                      '&:hover': {
                        transform: 'scale(1.13)'
                      }
                    }}>
                      {i === 0 && <HealthAndSafetyIcon sx={{ fontSize: 36 }} />}
                      {i === 1 && <PersonIcon sx={{ fontSize: 36 }} />}
                      {i === 2 && <HealthAndSafetyIcon sx={{ fontSize: 36 }} />}
                    </Avatar>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: colors.green, mb: 1, letterSpacing: '-0.5px' }}>
                    {i === 0 && 'Assessment of the Week'}
                    {i === 1 && 'Talk to BotKnee'}
                    {i === 2 && 'Alert Settings'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text, mb: 2, fontWeight: 500 }}>
                    {i === 0 && 'Review your weekly knee movement summary, progress charts, and any critical alerts. Get personalized recommendations based on your activity patterns.'}
                    {i === 1 && 'Get AI-based feedback, professional advice, and personalized improvement tips for your recovery journey. Our virtual assistant is available 24/7.'}
                    {i === 2 && 'Customize your notification preferences for movement alerts, reminders, and progress milestones. Stay informed about your knee health.'}
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 700,
                      fontSize: '1.08rem',
                      py: 1.2,
                      background: i === 0 ? `linear-gradient(90deg, #E0F7FA, #00A8E8)` : i === 1 ? `linear-gradient(90deg, #00A8E8, #22c55e)` : `linear-gradient(90deg, #22c55e, #E0F7FA)`,
                      color: '#fff',
                      boxShadow: `0 2px 8px #22c55e22`,
                      borderRadius: 2,
                      letterSpacing: 0.5,
                      transition: 'background 0.3s',
                      '&:hover': {
                        background: i === 0 ? colors.blue : i === 1 ? colors.green : colors.blue
                      }
                    }}
                    onClick={() => handleNavigate(i === 0 ? 'weekly-assessment' : i === 1 ? 'botknee' : 'alerts')}
                  >
                    {i === 0 && 'View Report'}
                    {i === 1 && 'Chat Now'}
                    {i === 2 && 'Configure'}
                  </Button>
                </Card>
              </Grow>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          py: 3, 
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WavesIcon sx={{ fontSize: 20, color: colors.blue, mr: 1 }} />
              <Typography variant="body2" sx={{ color: colors.white, fontWeight: 600 }}>
                KneeRevive
              </Typography>
            </Box>
            
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              © 2025 KneeAI Technologies. All rights reserved.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Privacy', 'Terms', 'Support'].map((item) => (
                <Typography 
                  key={item} 
                  variant="caption" 
                  sx={{ 
                    color: colors.grey,
                    cursor: 'pointer',
                    '&:hover': { color: colors.white }
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ModeSelection;