import { Box, Container, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon
          sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your purchase. Your payment has been processed successfully.
          You will receive a confirmation email shortly.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/account"
            variant="contained"
            color="primary"
          >
            View Orders
          </Button>
          <Button
            component={Link}
            to="/store"
            variant="outlined"
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentSuccess; 