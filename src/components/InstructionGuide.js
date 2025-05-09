import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider
} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import AdjustIcon from '@mui/icons-material/Adjust';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DevicesIcon from '@mui/icons-material/Devices';
import WarningIcon from '@mui/icons-material/Warning';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';

// Ocean blue color palette (matching the parent component)
const colors = {
  darkBlue: '#003459',
  mediumBlue: '#00598E', 
  lightBlue: '#0077B6',
  accentBlue: '#00A8E8',
  white: '#FFFFFF',
  offWhite: '#F5F9FC',
  lightGrey: '#E0EBF4'
};

const InstructionGuide = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const deviceParts = [
    {
      name: "Therapy Pads",
      description: "Apply gel on these pads before use for optimal electrical conductivity during therapy sessions.",
      icon: <TouchAppIcon />,
      color: colors.accentBlue
    },
    {
      name: "Sensor Node",
      description: "Advanced biosensors track range of motion, joint stability, and therapeutic progress in real-time.",
      icon: <AdjustIcon />,
      color: colors.lightBlue
    },
    {
      name: "Control Panel",
      description: "Digital interface to select therapeutic modes, adjust intensity, and monitor session progress.",
      icon: <SettingsIcon />,
      color: colors.mediumBlue
    },
    {
      name: "Secure Straps",
      description: "Adjustable, breathable fabric with medical-grade fasteners for comfortable all-day wear.",
      icon: <CheckCircleIcon />,
      color: colors.darkBlue
    }
  ];

  const careInstructions = [
    {
      title: "Clean Regularly",
      description: "Wipe therapy pads with alcohol solution after each use. Clean straps weekly with mild soap.",
      icon: <HealthAndSafetyIcon />
    },
    {
      title: "Charging",
      description: "Charge for 3 hours to reach full capacity. A single charge lasts approximately 12 therapy sessions.",
      icon: <BatteryChargingFullIcon />
    },
    {
      title: "Software Updates",
      description: "Connect to the KneeRevive app monthly to receive latest therapeutic protocols and firmware.",
      icon: <DevicesIcon />
    },
    {
      title: "Important Notes",
      description: "Do not submerge in water. Consult your physical therapist before changing treatment settings.",
      icon: <WarningIcon />
    }
  ];

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      {/* Header with gradient */}
      <Box sx={{ 
        background: `linear-gradient(90deg, ${colors.mediumBlue} 0%, ${colors.accentBlue} 100%)`,
        py: 2,
        px: 2,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23FFFFFF" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")'
        }} />
        
        <Typography 
          variant="h5"
          sx={{ 
            fontWeight: 700, 
            color: colors.white,
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            mb: 0.5
          }}
        >
          KneeRevive Visual Guide
        </Typography>
        
        <Typography 
          variant="body2"
          sx={{ 
            color: colors.white,
            opacity: 0.9,
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            mt: 0
          }}
        >
          Understanding your device for optimal recovery
        </Typography>
      </Box>

      {/* Horizontal layout container: Care & Maintenance (left), Device Overview (right) */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        gap: 4,
        mb: 4,
      }}>
        {/* Care & Maintenance section (left) */}
        <Box sx={{ 
          flex: { xs: 'unset', md: '1 1 50%' },
          width: { xs: '100%', md: '50%' },
          backgroundColor: colors.offWhite,
          borderRadius: 3,
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.05)',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          mb: { xs: 3, md: 0 }
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: colors.darkBlue,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <BatteryChargingFullIcon /> Care & Maintenance
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {careInstructions.map((item) => (
              <Box 
                key={item.title}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  backgroundColor: colors.white,
                  borderRadius: 2,
                  p: 2,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                }}
              >
                <Avatar 
                  sx={{ 
                    backgroundColor: colors.mediumBlue,
                    color: colors.white,
                    width: 48,
                    height: 48,
                    mr: 2,
                    flexShrink: 0
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.darkBlue, mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Complete Device Overview cards (right) */}
        <Box sx={{ 
          flex: { xs: 'unset', md: '1 1 50%' },
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: colors.darkBlue,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <HealthAndSafetyIcon /> Complete Device Overview
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            <Typography 
              variant="subtitle1"
              sx={{ 
                fontWeight: 700, 
                color: colors.darkBlue,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <HealthAndSafetyIcon /> Complete Device Overview
            </Typography>
          </Box>
          <Grid container spacing={1}>
            {deviceParts.map((part, index) => (
              <Grid item xs={12} sm={6} md={3} key={part.name}>
                <Card 
                  elevation={1} 
                  sx={{ 
                    height: '100%',
                    borderTop: `3px solid ${part.color}`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    },
                    p: 0.5
                  }}
                >
                  <CardContent sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Avatar 
                        sx={{ 
                          backgroundColor: part.color,
                          mr: 1,
                          width: 26,
                          height: 26
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{index + 1}</Typography>
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.darkBlue }}>
                        {part.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {part.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      
      <Divider sx={{ mx: 2 }} />
      
      {/* Notice banner */}
      <Box sx={{ 
        backgroundColor: colors.lightGrey,
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}>
        <HealthAndSafetyIcon sx={{ color: colors.mediumBlue }} />
        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.mediumBlue,
            fontWeight: 500
          }}
        >
          For optimal results, use your KneeRevive device as directed by your healthcare professional. Always read the user manual before use.
        </Typography>
      </Box>
    </Paper>
  );
};

export default InstructionGuide;