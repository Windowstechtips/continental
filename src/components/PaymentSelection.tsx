import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
} from '@mui/material';
import { initiatePayment } from '../services/payhere';
import { supabase } from '../services/supabase';
import Invoice from './Invoice';
import { useCart } from '../contexts/CartContext';

interface PaymentSelectionProps {
  orderDetails: {
    orderNumber: string;
    orderDate: string;
    customerDetails: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    items: any[];
    total: number;
  };
}

const PaymentSelection = ({ orderDetails }: PaymentSelectionProps) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [showInvoice, setShowInvoice] = useState(false);
  const { clearCart } = useCart();

  const handlePaymentSubmit = async () => {
    try {
      // Update order payment status
      const { error: updateError } = await supabase
        .from('store_orders')
        .update({
          payment_status: paymentMethod === 'cash' ? 'pending_cash' : 'pending_online'
        })
        .eq('invoice_id', orderDetails.orderNumber);

      if (updateError) throw updateError;

      if (paymentMethod === 'online') {
        // Clear cart before redirecting to payment
        clearCart();
        // Initiate online payment
        initiatePayment(orderDetails);
      } else {
        // Show invoice for cash payment
        setShowInvoice(true);
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
      // Continue anyway since the order is created
      if (paymentMethod === 'online') {
        clearCart();
        initiatePayment(orderDetails);
      } else {
        setShowInvoice(true);
      }
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    clearCart();
    navigate('/store', { state: { orderSuccess: true } });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Select Payment Method
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'cash')}
              >
                <FormControlLabel
                  value="online"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Pay Online</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay securely using credit/debit card or online banking
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Pay at Continental</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay in cash when you visit Continental College
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handlePaymentSubmit}
              sx={{ minWidth: 200 }}
            >
              {paymentMethod === 'online' ? 'Proceed to Payment' : 'Generate Invoice'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Invoice Dialog */}
      <Dialog
        open={showInvoice}
        maxWidth="md"
        fullWidth
        onClose={handleCloseInvoice}
      >
        <Invoice
          orderNumber={orderDetails.orderNumber}
          orderDate={orderDetails.orderDate}
          customerDetails={orderDetails.customerDetails}
          items={orderDetails.items}
          total={orderDetails.total}
        />
      </Dialog>
    </Container>
  );
};

export default PaymentSelection; 