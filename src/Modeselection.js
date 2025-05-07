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
  Avatar
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import WavesIcon from '@mui/icons-material/Waves';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

// Ocean blue color palette
const colors = {
  darkBlue: '#003459',
  mediumBlue: '#00598E', 
  lightBlue: '#0077B6',
  accentBlue: '#00A8E8',
  white: '#FFFFFF',
  offWhite: '#F5F9FC',
  lightGrey: '#E0EBF4'
};

const ModeSelection = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState("User");

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

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(170deg, ${colors.darkBlue} 0%, ${colors.mediumBlue} 70%, ${colors.lightBlue} 100%)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
              <WavesIcon sx={{ fontSize: 28, color: colors.accentBlue, mr: 1 }} />
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
                    backgroundColor: colors.accentBlue,
                    color: colors.white
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Box sx={{ ml: 1.5 }}>
                  <Typography variant="body2" sx={{ color: colors.white, fontWeight: 600 }}>
                    {userName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.lightGrey, display: 'block', lineHeight: 1 }}>
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
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Box sx={{ mb: { xs: 5, md: 6 }, textAlign: 'center' }}>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              px: 2,
              py: 0.75,
              mb: 3
            }}>
              <HealthAndSafetyIcon sx={{ fontSize: 18, color: colors.accentBlue, mr: 1 }} />
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 600, color: colors.white }}
              >
                Advanced Knee Rehabilitation Platform
              </Typography>
            </Box>
            
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800, 
                color: colors.white, 
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
                mb: 2
              }}
            >
              Your Personal Knee Recovery Assistant
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: colors.lightGrey, 
                maxWidth: '700px', 
                mx: 'auto', 
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6
              }}
            >
              Experience personalized rehabilitation with cutting-edge technology designed to accelerate your recovery and monitor progress in real-time.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Card elevation={4} sx={{ 
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
                },
                cursor: 'pointer',
                overflow: 'hidden'
              }} onClick={() => handleNavigate('therapy')}>
                <Box sx={{ 
                  height: 8, 
                  backgroundColor: colors.accentBlue 
                }} />
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3 
                  }}>
                    <Avatar 
                      sx={{ 
                        backgroundColor: colors.lightGrey,
                        color: colors.accentBlue,
                        width: 56,
                        height: 56
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="overline" sx={{ 
                        color: colors.accentBlue, 
                        fontWeight: 600,
                        letterSpacing: 1
                      }}>
                        PERSONALIZED CARE
                      </Typography>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: colors.darkBlue
                      }}>
                        Therapy Mode
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: colors.mediumBlue, mb: 3 }}>
                    Customized rehabilitation exercises and therapeutic guidance specifically designed for your knee recovery journey.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    mb: 3
                  }}>
                    {['Personalized Plans', 'Progress Tracking', 'Pain Management'].map((feature) => (
                      <Box key={feature} sx={{ 
                        backgroundColor: colors.lightGrey,
                        borderRadius: 5,
                        px: 1.5,
                        py: 0.5
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: colors.mediumBlue }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 2, 
                      backgroundColor: colors.accentBlue,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.2,
                      '&:hover': {
                        backgroundColor: colors.lightBlue
                      }
                    }}
                  >
                    Start Therapy Session
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={4} sx={{ 
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { 
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
                },
                cursor: 'pointer',
                overflow: 'hidden'
              }} onClick={() => handleNavigate('saviour')}>
                <Box sx={{ 
                  height: 8, 
                  backgroundColor: colors.darkBlue 
                }} />
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3 
                  }}>
                    <Avatar 
                      sx={{ 
                        backgroundColor: colors.lightGrey,
                        color: colors.darkBlue,
                        width: 56,
                        height: 56
                      }}
                    >
                      <ShieldIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="overline" sx={{ 
                        color: colors.darkBlue, 
                        fontWeight: 600,
                        letterSpacing: 1
                      }}>
                        SAFETY FIRST
                      </Typography>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: colors.darkBlue
                      }}>
                        Saviour Mode
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: colors.mediumBlue, mb: 3 }}>
                    Advanced monitoring with emergency alerts, fall detection, and immediate assistance during your recovery process.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    mb: 3
                  }}>
                    {['Fall Detection', 'Emergency Alerts', '24/7 Monitoring'].map((feature) => (
                      <Box key={feature} sx={{ 
                        backgroundColor: colors.lightGrey,
                        borderRadius: 5,
                        px: 1.5,
                        py: 0.5
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: colors.mediumBlue }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 2, 
                      backgroundColor: colors.darkBlue,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.2,
                      '&:hover': {
                        backgroundColor: colors.mediumBlue
                      }
                    }}
                  >
                    Activate Saviour Mode
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
              <WavesIcon sx={{ fontSize: 20, color: colors.accentBlue, mr: 1 }} />
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
                    color: colors.lightGrey,
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