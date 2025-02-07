import { Box, Container, Typography, Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
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
        <CancelIcon
          sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          Payment Cancelled
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your payment was cancelled. No charges have been made to your account.
          If you experienced any issues, please try again or contact our support team.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/cart"
            variant="contained"
            color="primary"
          >
            Return to Cart
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

export default PaymentCancel; 