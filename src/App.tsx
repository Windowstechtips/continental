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
import StudentAchievements from './components/StudentAchievements';
import News from './components/News';
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
    <StudentAchievements />
    <Gallery />
  </>
);

// Layout component to handle conditional rendering of Navbar and NewsTicker
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isStorePage = location.pathname === '/store';

  return (
    <>
      {!isStorePage && <Navbar onToggleTheme={window.toggleColorMode} isDark={window.isDark} />}
      {!isStorePage && <NewsTicker />}
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
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff4081',
        dark: '#c51162',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      allVariants: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
      h1: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 600,
        fontSize: '3.5rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 600,
        fontSize: '2.5rem',
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
      button: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
      body1: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '-0.01em',
        fontWeight: 400,
      },
      body2: {
        fontFamily: '"Proxima Nova", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        letterSpacing: '-0.01em',
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 16,
    },
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
        `,
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 25,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 24px',
            fontFamily: '"Google Sans", "Inter", system-ui, -apple-system, sans-serif',
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            maxWidth: '100% !important',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
    },
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Add toggleColorMode and isDark to window for Layout component
  (window as any).toggleColorMode = toggleColorMode;
  (window as any).isDark = mode === 'dark';

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
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </div>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
