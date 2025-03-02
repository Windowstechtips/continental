import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link as MuiLink,
  IconButton,
  Tooltip,
  useTheme,
  InputAdornment,
  alpha,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { motion } from 'framer-motion';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      navigate('/account');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxWidth={false} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom, #121212, #1e1e1e)'
          : 'linear-gradient(to bottom, #f8faff, #e8f0fe)',
        pt: 4
      }}
    >
      <Box sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'flex-start', 
        px: 2,
        mb: 2
      }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Tooltip title="Back to Home">
            <IconButton 
              color="primary" 
              onClick={() => navigate('/')}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
      </Box>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome Back
        </Typography>
      </motion.div>
      
      <Box 
        component={motion.div}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        sx={{ 
          mb: 4,
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            borderRadius: 3,
            width: '100%',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 35, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Sign In
          </Typography>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              '& .MuiTextField-root': {
                mb: 2.5,
              },
              '& .MuiInputBase-root': {
                borderRadius: 2,
              }
            }}
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 1, 
                  mb: 2, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  background: 'linear-gradient(90deg, #0056b3, #0077cc)',
                  boxShadow: '0 4px 12px rgba(0, 86, 179, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #003b7a, #0056b3)',
                    boxShadow: '0 6px 16px rgba(0, 86, 179, 0.4)',
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.div>
          </Box>

          <Box 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            sx={{ 
              mt: 2, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Don't have an account?{' '}
              <MuiLink 
                component={Link} 
                to="/register"
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign Up
              </MuiLink>
            </Typography>
            <Typography variant="body2">
              <MuiLink 
                component={Link} 
                to="/forgot-password"
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 