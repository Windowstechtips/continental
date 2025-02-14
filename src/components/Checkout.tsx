import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  useTheme,
  Divider,
  Alert,
  Dialog,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../contexts/CartContext';
import { createOrder, supabase } from '../services/supabase';
import Invoice from './Invoice';
import { useAuth } from '../contexts/AuthContext';
import { initiatePayment } from '../services/payhere';
import PaymentSelection from './PaymentSelection';

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface OrderDetails {
  orderNumber: string;
  orderDate: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: InvoiceItem[];
  total: number;
}

const Checkout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/checkout' } });
      return;
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.full_name || '',
            email: user.email || '',
            phone: profile.phone1 || '',
            address: profile.address || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  // Phone number formatting function
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format as XX-XXX-XXXX
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5, 9)}`;
  };

  // Phone number validation
  const validatePhoneNumber = (phone: string): boolean => {
    // Check if the phone number matches the format XX-XXX-XXXX
    return /^\d{2}-\d{3}-\d{4}$/.test(phone);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find(i => i.product_id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Format phone number as user types
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Update email if user changes
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Full Name is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('Email is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.phone.trim()) {
        setError('Phone number is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.address.trim()) {
        setError('Delivery Address is required');
        setIsSubmitting(false);
        return;
      }

      // Validate phone number format
      if (!validatePhoneNumber(formData.phone)) {
        setError('Phone number must be in format: XX-XXX-XXXX');
        setIsSubmitting(false);
        return;
      }

      // Create order in Supabase
      const { data: order, error: orderError } = await createOrder({
        customerDetails: formData,
        items: items,
        total: total,
        paymentMethod: 'online'
      });

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      // Convert cart items to invoice items
      const invoiceItems = items.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url
      }));

      // Set order details for payment selection
      const orderDetails: OrderDetails = {
        orderNumber: order.invoice_id,
        orderDate: new Date().toLocaleDateString(),
        customerDetails: formData,
        items: invoiceItems,
        total: total
      };

      setOrderDetails(orderDetails);
      setShowPaymentSelection(true);
    } catch (error: any) {
      console.error('Error processing order:', error);
      setError(error.message || 'Failed to process your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    clearCart();
    navigate('/store', { state: { orderSuccess: true } });
  };

  if (showPaymentSelection && orderDetails) {
    return <PaymentSelection orderDetails={orderDetails} />;
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Your cart is empty
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/store')}
              >
                Return to Store
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                {items.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: theme.shape.borderRadius,
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rs. {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.product_id, -1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.product_id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Order Form */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Details
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                  <TextField
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    error={!formData.name.trim()}
                    helperText={!formData.name.trim() ? 'Full Name is required' : ''}
                  />
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    error={!formData.email.trim()}
                    helperText={!formData.email.trim() ? 'Email is required' : ''}
                  />
                  <TextField
                    name="phone"
                    label="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    error={!formData.phone.trim()}
                    helperText={!formData.phone.trim() ? 'Phone number is required' : 'Format: XX-XXX-XXXX'}
                    placeholder="70-412-0681"
                    inputProps={{ maxLength: 11 }}
                  />
                  <TextField
                    name="address"
                    label="Delivery Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                    multiline
                    rows={3}
                    error={!formData.address.trim()}
                    helperText={!formData.address.trim() ? 'Delivery Address is required' : ''}
                  />
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Total: Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    
                    {isSubmitting ? (
                      <Alert severity="info">
                        Processing your order...
                      </Alert>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                        disabled={items.length === 0}
                      >
                        Place Order
                      </Button>
                    )}
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Invoice Dialog */}
      <Dialog
        open={showInvoice}
        maxWidth="md"
        fullWidth
        onClose={handleCloseInvoice}
      >
        <Invoice
          orderNumber={orderNumber}
          orderDate={new Date().toLocaleDateString()}
          customerDetails={formData}
          items={items}
          total={total}
        />
      </Dialog>
    </>
  );
};

export default Checkout; 