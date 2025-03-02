import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Subjects from './components/Subjects';
import WhyJoinUs from './components/WhyJoinUs';
import TutorCarousel from './components/TutorCarousel';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import News from './components/News';
import Calendar from './components/Calendar';
import NewsTicker from './components/NewsTicker';
import Store from './components/Store';
import { CartProvider } from './contexts/CartContext';
import Checkout from './components/Checkout';
import { AuthProvider } from './contexts/AuthContext';
import Account from './components/Account';
import Login from './components/Login';
import Register from './components/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import './styles/fonts.css';
import { supabase } from './services/supabase';
import { Box, Paper, Typography, Button } from '@mui/material';

// Declare global window properties
declare global {
  interface Window {
    toggleColorMode: () => void;
    isDark: boolean;
  }
}

// Home component to wrap the main page content
const Home = () => (
  <>
    <Hero />
    <WhyJoinUs />
    <Subjects />
    <TutorCarousel />
    <News />
    <Gallery />
    <Calendar />
  </>
);

// Layout component to handle conditional rendering of Navbar and NewsTicker
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isStorePage = location.pathname === '/store' || location.pathname === '/checkout';

  return (
    <>
      <Navbar onToggleTheme={window.toggleColorMode} isDark={window.isDark} />
      <NewsTicker />
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        marginTop: isStorePage ? 0 : '64px'
      }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

// Account layout without Navbar and NewsTicker
const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main style={{ width: '100%', minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    // Test Supabase connection on app start
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('subjects_content').select('count', { count: 'exact' });
        if (error) {
          console.error('Supabase connection error:', error);
          setInitError(error.message || 'Failed to connect to the database. Please try again later.');
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setInitError('An error occurred while starting the application.');
      }
    };

    testConnection();
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#0056b3', // Rich blue
        light: '#2196f3', // Light blue
        dark: '#003b7a', // Dark blue
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#00bcd4', // Cyan/teal blue
        light: '#4dd0e1', // Light cyan
        dark: '#0097a7', // Dark cyan
        contrastText: '#ffffff',
      },
      info: {
        main: '#64b5f6', // Sky blue
        light: '#90caf9',
        dark: '#42a5f5',
      },
      background: {
        default: mode === 'light' ? '#f8faff' : '#121212', // Light blue tint in light mode, dark black in dark
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e', // White in light mode, dark gray in dark
      },
      text: {
        primary: mode === 'light' ? '#0a1929' : '#ffffff',
        secondary: mode === 'light' ? '#42526e' : 'rgba(255, 255, 255, 0.7)',
      },
      divider: mode === 'light' ? 'rgba(0, 86, 179, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      action: {
        active: mode === 'light' ? '#0056b3' : '#64b5f6',
        hover: mode === 'light' ? 'rgba(0, 86, 179, 0.08)' : 'rgba(255, 255, 255, 0.08)',
        selected: mode === 'light' ? 'rgba(0, 86, 179, 0.16)' : 'rgba(255, 255, 255, 0.16)',
        disabled: mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)',
        disabledBackground: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      },
    },
    typography: {
      fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      allVariants: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
      h1: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 700,
        fontSize: '3.5rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h3: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h4: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h5: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      button: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      body1: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '-0.01em',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '-0.01em',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      subtitle1: {
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
      subtitle2: {
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.08),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
      '0px 3px 3px -2px rgba(0,0,0,0.08),0px 2px 4px 0px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
      '0px 3px 4px -2px rgba(0,0,0,0.08),0px 3px 5px 0px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
      '0px 2px 5px -1px rgba(0,0,0,0.08),0px 4px 6px 0px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
      '0px 3px 6px -1px rgba(0,0,0,0.08),0px 5px 8px 0px rgba(0,0,0,0.07),0px 1px 14px 0px rgba(0,0,0,0.06)',
      '0px 3px 7px -2px rgba(0,0,0,0.08),0px 6px 10px 0px rgba(0,0,0,0.07),0px 1px 18px 0px rgba(0,0,0,0.06)',
      '0px 4px 8px -2px rgba(0,0,0,0.08),0px 7px 12px 1px rgba(0,0,0,0.07),0px 2px 16px 1px rgba(0,0,0,0.06)',
      '0px 5px 9px -2px rgba(0,0,0,0.08),0px 8px 16px 1px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.06)',
      '0px 5px 10px -3px rgba(0,0,0,0.08),0px 8px 16px 1px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.06)',
      '0px 6px 11px -3px rgba(0,0,0,0.08),0px 9px 18px 1px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.06)',
      '0px 6px 12px -3px rgba(0,0,0,0.08),0px 10px 20px 1px rgba(0,0,0,0.07),0px 4px 18px 3px rgba(0,0,0,0.06)',
      '0px 7px 12px -4px rgba(0,0,0,0.08),0px 11px 20px 1px rgba(0,0,0,0.07),0px 5px 20px 4px rgba(0,0,0,0.06)',
      '0px 7px 13px -4px rgba(0,0,0,0.08),0px 12px 22px 1px rgba(0,0,0,0.07),0px 5px 22px 4px rgba(0,0,0,0.06)',
      '0px 7px 14px -4px rgba(0,0,0,0.08),0px 13px 24px 1px rgba(0,0,0,0.07),0px 5px 24px 5px rgba(0,0,0,0.06)',
      '0px 8px 15px -5px rgba(0,0,0,0.08),0px 14px 26px 1px rgba(0,0,0,0.07),0px 5px 26px 5px rgba(0,0,0,0.06)',
      '0px 8px 16px -5px rgba(0,0,0,0.08),0px 15px 28px 1px rgba(0,0,0,0.07),0px 6px 28px 6px rgba(0,0,0,0.06)',
      '0px 8px 17px -5px rgba(0,0,0,0.08),0px 16px 30px 1px rgba(0,0,0,0.07),0px 6px 30px 6px rgba(0,0,0,0.06)',
      '0px 9px 18px -5px rgba(0,0,0,0.08),0px 17px 32px 1px rgba(0,0,0,0.07),0px 7px 32px 6px rgba(0,0,0,0.06)',
      '0px 9px 19px -5px rgba(0,0,0,0.08),0px 18px 34px 1px rgba(0,0,0,0.07),0px 7px 34px 7px rgba(0,0,0,0.06)',
      '0px 10px 20px -6px rgba(0,0,0,0.08),0px 19px 36px 1px rgba(0,0,0,0.07),0px 8px 36px 7px rgba(0,0,0,0.06)',
      '0px 10px 21px -6px rgba(0,0,0,0.08),0px 20px 38px 1px rgba(0,0,0,0.07),0px 8px 38px 7px rgba(0,0,0,0.06)',
      '0px 10px 22px -6px rgba(0,0,0,0.08),0px 21px 40px 1px rgba(0,0,0,0.07),0px 9px 40px 8px rgba(0,0,0,0.06)',
      '0px 11px 23px -6px rgba(0,0,0,0.08),0px 22px 42px 1px rgba(0,0,0,0.07),0px 9px 42px 8px rgba(0,0,0,0.06)',
      '0px 11px 24px -6px rgba(0,0,0,0.08),0px 23px 44px 1px rgba(0,0,0,0.07),0px 9px 44px 8px rgba(0,0,0,0.06)',
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Google Sans';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: url('https://fonts.gstatic.com/s/googlesans/v45/4UaGrENHsxJlGDuGo1OIlL3Owp4.woff2') format('woff2');
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          body {
            transition: background-color 0.3s ease;
          }
          
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${mode === 'light' ? '#f1f5f9' : '#0a1929'};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${mode === 'light' ? '#c5d6e6' : '#1e4976'};
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${mode === 'light' ? '#a3c2db' : '#2c6aa0'};
          }
        `,
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
            boxShadow: mode === 'light' 
              ? '0 6px 20px -5px rgba(0, 86, 179, 0.15)' 
              : '0 6px 20px -5px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: mode === 'light' 
                ? '0 16px 30px -10px rgba(0, 86, 179, 0.2)' 
                : '0 16px 30px -10px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            fontFamily: '"Proxima Nova", system-ui, -apple-system, sans-serif',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: 'none',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 86, 179, 0.2)',
            },
          },
          contained: {
            boxShadow: '0 2px 8px rgba(0, 86, 179, 0.15)',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 86, 179, 0.2)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #0056b3 0%, #0077cc 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #003b7a 0%, #0056b3 100%)',
            },
          },
          containedSecondary: {
            background: 'linear-gradient(135deg, #00bcd4 0%, #26c6da 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0097a7 0%, #00acc1 100%)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
          outlinedPrimary: {
            borderColor: '#0056b3',
            '&:hover': {
              borderColor: '#003b7a',
              backgroundColor: 'rgba(0, 86, 179, 0.04)',
            },
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: '24px',
            paddingRight: '24px',
            '@media (min-width: 600px)': {
              paddingLeft: '32px',
              paddingRight: '32px',
            },
          },
          maxWidthLg: {
            '@media (min-width: 1280px)': {
              maxWidth: '1200px',
            },
          },
          maxWidthXl: {
            '@media (min-width: 1920px)': {
              maxWidth: '1600px',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 2px 10px rgba(0, 86, 179, 0.1)' 
              : '0 2px 10px rgba(0, 0, 0, 0.2)',
            background: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.9)' 
              : 'rgba(10, 25, 41, 0.9)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: mode === 'light' 
              ? '0 2px 10px rgba(0, 86, 179, 0.08)' 
              : '0 2px 10px rgba(0, 0, 0, 0.2)',
          },
          elevation2: {
            boxShadow: mode === 'light' 
              ? '0 4px 15px rgba(0, 86, 179, 0.1)' 
              : '0 4px 15px rgba(0, 0, 0, 0.25)',
          },
          elevation3: {
            boxShadow: mode === 'light' 
              ? '0 6px 20px rgba(0, 86, 179, 0.12)' 
              : '0 6px 20px rgba(0, 0, 0, 0.3)',
          },
          elevation4: {
            boxShadow: mode === 'light' 
              ? '0 8px 25px rgba(0, 86, 179, 0.15)' 
              : '0 8px 25px rgba(0, 0, 0, 0.35)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: mode === 'light' 
                  ? '0 0 0 4px rgba(0, 86, 179, 0.05)' 
                  : '0 0 0 4px rgba(100, 181, 246, 0.05)',
              },
              '&.Mui-focused': {
                boxShadow: mode === 'light' 
                  ? '0 0 0 4px rgba(0, 86, 179, 0.1)' 
                  : '0 0 0 4px rgba(100, 181, 246, 0.1)',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
            transition: 'all 0.2s ease',
          },
          filled: {
            '&:hover': {
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            },
          },
          filledPrimary: {
            background: 'linear-gradient(135deg, #0056b3 0%, #0077cc 100%)',
          },
          filledSecondary: {
            background: 'linear-gradient(135deg, #00bcd4 0%, #26c6da 100%)',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            transition: 'color 0.2s ease, text-decoration 0.2s ease',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(0, 86, 179, 0.04)' 
                : 'rgba(100, 181, 246, 0.04)',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: mode === 'light' 
              ? '0 2px 10px rgba(0, 0, 0, 0.05)' 
              : '0 2px 10px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
              : '0 2px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 6,
            backdropFilter: 'blur(6px)',
            background: mode === 'light' 
              ? 'rgba(0, 0, 0, 0.75)' 
              : 'rgba(0, 86, 179, 0.9)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            fontWeight: 500,
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(4px)',
            backgroundColor: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.5)' 
              : 'rgba(10, 25, 41, 0.5)',
          },
        },
      },
    },
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Add toggleColorMode and isDark to window for Layout component
  window.toggleColorMode = toggleColorMode;
  window.isDark = mode === 'dark';

  if (initError) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 500,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Application Error
            </Typography>
            <Typography color="text.secondary">
              {initError}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 3 }}
            >
              Retry
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh',
              width: '100vw',
              overflow: 'hidden',
              backgroundColor: theme.palette.background.default,
              fontFamily: '"Google Sans", "Inter", system-ui, -apple-system, sans-serif',
            }}>
              <Routes>
                {/* Account routes with AccountLayout */}
                <Route path="/account" element={<AccountLayout><Account /></AccountLayout>} />
                <Route path="/login" element={<AccountLayout><Login /></AccountLayout>} />
                <Route path="/register" element={<AccountLayout><Register /></AccountLayout>} />
                
                {/* Main routes with MainLayout */}
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                <Route path="/store" element={<MainLayout><Store /></MainLayout>} />
                <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
                <Route path="/payment/success" element={<MainLayout><PaymentSuccess /></MainLayout>} />
                <Route path="/payment/cancel" element={<MainLayout><PaymentCancel /></MainLayout>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
