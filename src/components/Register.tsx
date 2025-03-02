import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate name
    if (!fullName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    // Password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Sign up the user
      const { error: signUpError, data } = await signUp(email, password);
      if (signUpError) throw signUpError;

      if (data?.user) {
        // Store user's name in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: fullName,
              email: email
            }
          ]);

        if (profileError) throw profileError;
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
        
        <Box 
          component={motion.div}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          sx={{ 
            mt: { xs: 2, sm: 4 }, 
            mb: 4,
            width: '100%',
            maxWidth: '500px'
          }}
        >
          <Paper 
            elevation={6} 
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 3,
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircleOutlineIcon 
                  color="primary" 
                  sx={{ 
                    fontSize: 80,
                    mb: 2,
                    color: theme.palette.mode === 'dark' 
                      ? '#64b5f6' 
                      : '#0056b3'
                  }} 
                />
              </motion.div>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Registration Successful!
              </Typography>
              <Typography 
                align="center" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '1.1rem',
                  maxWidth: '90%',
                  mx: 'auto'
                }}
              >
                Please check your email to confirm your account.
                A confirmation link has been sent to:
              </Typography>
              <Typography 
                sx={{ 
                  mt: 1,
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  fontSize: '1.1rem'
                }}
              >
                {email}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    px: 4,
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
                  Go to Login
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

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
          Create Account
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
          maxWidth: '500px'
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            borderRadius: 3,
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
              label="Full Name"
              fullWidth
              size="medium"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
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
              helperText="Password must be at least 6 characters"
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
                '& .MuiFormHelperText-root': {
                  mx: 0,
                  mt: 0.5,
                  fontSize: '0.75rem',
                  color: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.6)'
                    : 'rgba(0, 0, 0, 0.6)',
                }
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              size="medium"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '16px' }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ 
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
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </motion.div>
          </Box>

          <Box 
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            sx={{ 
              mt: 3, 
              textAlign: 'center' 
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Already have an account?{' '}
              <MuiLink 
                component={Link} 
                to="/login"
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;