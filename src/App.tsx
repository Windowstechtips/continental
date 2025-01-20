import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyJoinUs from './components/WhyJoinUs';
import TutorCarousel from './components/TutorCarousel';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import StudentAchievements from './components/StudentAchievements';
import './styles/fonts.css';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
        fontFamily: '"Google Sans", "Inter", system-ui, -apple-system, sans-serif',
      }}>
        <Navbar onToggleTheme={toggleColorMode} isDark={mode === 'dark'} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Hero />
          <WhyJoinUs />
          <TutorCarousel />
          <Gallery />
          <StudentAchievements />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
