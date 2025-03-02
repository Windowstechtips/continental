import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  TextField,
  IconButton,
  Divider,
  useTheme,
  Avatar,
  Grid,
  Tooltip,
  alpha,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserOrders } from '../services/supabase';
import Invoice from './Invoice';
import { supabase } from '../services/supabase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PaymentsIcon from '@mui/icons-material/Payments';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';

interface Order {
  invoice_id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: any[];
}

interface UserProfile {
  id: string;
  full_name: string;
  display_name: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  address: string;
}

interface ValidationErrors {
  display_name?: string;
  full_name?: string;
  phone1?: string;
  address?: string;
}

const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'complete':
    case 'completed':
      return 'Completed';
    case 'ready_for_pickup':
      return 'Order Ready for Pickup';
    case 'cancelled':
      return 'Order Cancelled';
    case 'pending_cash':
    case 'pending_online':
      return 'Order Unpaid';
    case 'pending':
    default:
      return 'Order Pending';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'complete':
    case 'completed':
      return <CheckCircleIcon />;
    case 'ready_for_pickup':
      return <LocalShippingIcon />;
    case 'cancelled':
      return <CancelIcon />;
    case 'pending_cash':
    case 'pending_online':
      return <PaymentsIcon />;
    case 'pending':
    default:
      return <PendingIcon />;
  }
};

const getStatusColor = (status: string | null | undefined) => {
  if (!status) return 'default';
  
  switch (status.toLowerCase()) {
    case 'complete':
    case 'completed':
      return 'success';
    case 'ready_for_pickup':
      return 'info';
    case 'cancelled':
      return 'error';
    case 'pending_cash':
    case 'pending_online':
      return 'warning';
    case 'pending':
    default:
      return 'secondary';
  }
};

const Account = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          setProfile(profile);
          setEditedProfile(profile);
          // Check if this is a new user (missing required fields)
          setIsNewUser(!profile.full_name || !profile.phone1 || !profile.address);
        }

        // Load orders after profile is loaded
        await loadOrders();
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      // First, fetch the orders
      const { data: orders, error: ordersError } = await supabase
        .from('store_orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      console.log('Orders:', orders);

      // Then, for each order, fetch its items with products in a single query
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('store_order_items')
            .select(`
              id,
              order_id,
              product_id,
              quantity,
              price_at_time,
              store_products (
                id,
                name,
                image_url
              )
            `)
            .eq('order_id', order.id);

          if (itemsError) throw itemsError;
          console.log('Order items:', items);

          // Map the items with their product details
          const mappedItems = items?.map(item => ({
            id: item.id,
            name: item.store_products ? item.store_products.name : 'Unknown Product',
            quantity: item.quantity,
            price: item.price_at_time,
            image_url: item.store_products ? item.store_products.image_url : null
          })) || [];

          return {
            ...order,
            items: mappedItems
          };
        })
      );

      console.log('Final orders with items:', ordersWithItems);
      setOrders(ordersWithItems);
      setError(null);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format as XX-XXX-XXXX
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5, 9)}`;
  };

  const handleInputChange = (field: keyof UserProfile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isEditing) {
      let value = e.target.value;
      
      // Apply phone formatting for phone fields
      if (field === 'phone1' || field === 'phone2' || field === 'whatsapp') {
        value = formatPhoneNumber(value);
      }

      setEditedProfile(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Check if the phone number matches the format XX-XXX-XXXX
    return /^\d{2}-\d{3}-\d{4}$/.test(phone);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!editedProfile?.display_name?.trim()) {
      errors.display_name = 'Display name is required';
      isValid = false;
    }

    if (!editedProfile?.full_name?.trim()) {
      errors.full_name = 'Student name is required';
      isValid = false;
    }

    if (!editedProfile?.phone1?.trim()) {
      errors.phone1 = 'Primary phone is required';
      isValid = false;
    } else if (!validatePhoneNumber(editedProfile.phone1)) {
      errors.phone1 = 'Phone number must be in format: XX-XXX-XXXX';
      isValid = false;
    }

    if (!editedProfile?.address?.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile(profile);
    setSaveError('');
    setSaveSuccess(false);
    setValidationErrors({});
  };

  const handleSaveClick = async () => {
    if (!editedProfile || !user) return;

    if (!validateForm()) {
      setSaveError('Please fill in all required fields');
      return;
    }

    try {
      const updateData = {
        id: user.id,
        display_name: editedProfile.display_name || '',
        full_name: editedProfile.full_name || '',
        phone1: editedProfile.phone1 || '',
        phone2: editedProfile.phone2 || '',
        whatsapp: editedProfile.whatsapp || '',
        address: editedProfile.address || '',
        updated_at: new Date().toISOString()
      };

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .upsert(updateData)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!updatedProfile) throw new Error('Failed to update profile');

      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setIsEditing(false);
      setIsNewUser(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Load orders after profile is completed
      await loadOrders();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setSaveError(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleClearData = () => {
    // Clear local storage
    localStorage.clear();
    // Clear Supabase session
    supabase.auth.signOut();
    // Reload the page
    window.location.reload();
  };

  // Prevent navigation if required fields are not filled
  if (isNewUser && !validateForm() && location.pathname !== '/account') {
    return <Navigate to="/account" replace />;
  }

  if (!user) {
    return <Navigate to="/login" />;
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
        pt: 4,
        pb: 8
      }}
    >
      {/* Top Navigation Bar */}
      <Box 
        sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 2,
          mb: 4
        }}
      >
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
              <HomeIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Tooltip title="Sign Out">
            <IconButton 
              color="primary" 
              onClick={handleSignOut}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <LogoutIcon />
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
          My Account
        </Typography>
      </motion.div>
      
      {/* Main Content */}
      <Box 
        component={motion.div}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        sx={{ 
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        ) : (
          <>
            {/* Profile Section */}
            <Paper 
              elevation={6} 
              sx={{ 
                p: { xs: 2, sm: 4 }, 
                mb: 4, 
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Profile Information
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(90deg, #0056b3, #0077cc)',
                      boxShadow: '0 4px 12px rgba(0, 86, 179, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #003b7a, #0056b3)',
                        boxShadow: '0 6px 16px rgba(0, 86, 179, 0.4)',
                      }
                    }}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </motion.div>
              </Box>

              {saveError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {saveError}
                  </Alert>
                </motion.div>
              )}

              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    Profile updated successfully!
                  </Alert>
                </motion.div>
              )}

              {isNewUser && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    Please complete your profile information to continue.
                  </Alert>
                </motion.div>
              )}

              <Grid container spacing={3}>
                {/* Profile fields */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <PersonIcon fontSize="small" /> Student Name
                    </Typography>
                    <Typography variant="body1">
                      {profile?.full_name || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <PhoneIcon fontSize="small" /> Primary Phone
                    </Typography>
                    <Typography variant="body1">
                      {profile?.phone1 || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <PhoneIcon fontSize="small" /> Secondary Phone
                    </Typography>
                    <Typography variant="body1">
                      {profile?.phone2 || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <WhatsAppIcon fontSize="small" /> WhatsApp
                    </Typography>
                    <Typography variant="body1">
                      {profile?.whatsapp || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LocationOnIcon fontSize="small" /> Address
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {profile?.address || 'Not provided'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Orders Section */}
            <Paper 
              elevation={6} 
              sx={{ 
                p: { xs: 2, sm: 4 }, 
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
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0056b3 0%, #64b5f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Order History
              </Typography>
              
              {ordersLoading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: '200px'
                }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              ) : orders.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  No orders found
                </Typography>
              ) : (
                <TableContainer sx={{ 
                  maxHeight: 'calc(100vh - 300px)',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.2)' 
                      : 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                  },
                }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.invoice_id}>
                          <TableCell>{order.invoice_id}</TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            Rs. {order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(order.status)}
                              label={getStatusLabel(order.status)}
                              color={getStatusColor(order.status)}
                              size="small"
                              sx={{ 
                                fontSize: '0.875rem',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowInvoice(true);
                              }}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                              }}
                            >
                              View Invoice
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </>
        )}
      </Box>

      <Dialog
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <Invoice
            orderNumber={selectedOrder.invoice_id}
            orderDate={new Date(selectedOrder.created_at).toLocaleDateString()}
            customerDetails={{
              name: selectedOrder.customer_name,
              email: selectedOrder.customer_email,
              phone: selectedOrder.customer_phone,
              address: selectedOrder.shipping_address,
            }}
            items={selectedOrder.items}
            total={selectedOrder.total_amount}
            status={selectedOrder.status}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default Account; 