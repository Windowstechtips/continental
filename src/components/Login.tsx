import { useState } from 'react';
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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
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
    <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ 
        mt: { xs: 4, sm: 6 }, 
        mb: 4,
        width: '100%',
        maxWidth: '360px'
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderRadius: 2,
            width: '100%'
          }}
        >
          <Typography 
            variant="h5" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="dense"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="dense"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, mb: 1.5, py: 1 }}
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Don't have an account?{' '}
              <MuiLink component={Link} to="/register">
                Sign Up
              </MuiLink>
            </Typography>
            <Typography variant="body2">
              <MuiLink component={Link} to="/forgot-password">
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