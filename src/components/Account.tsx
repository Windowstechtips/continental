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
            name: item.store_products?.name,
            quantity: item.quantity,
            price: item.price_at_time,
            image_url: item.store_products?.image_url
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
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: 'calc(100vh - 64px)',
      pt: { xs: 3, sm: 5 },
      pb: { xs: 4, sm: 6 },
    }}>
      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '200px'
          }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {isNewUser && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Please complete your profile information to continue
              </Alert>
            )}
            <Grid container spacing={3}>
              {/* Left Column - Profile */}
              <Grid item xs={12} md={5} lg={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 2.5, sm: 3 }, 
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.1)',
                    position: 'relative',
                  }}
                >
                  {ordersLoading && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      borderRadius: 2,
                      zIndex: 1,
                    }}>
                      <CircularProgress />
                    </Box>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3,
                    position: 'relative',
                  }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        fontSize: '3rem',
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      {profile?.display_name?.charAt(0) || user.email?.charAt(0)}
                    </Avatar>
                    {isEditing ? (
                      <TextField
                        value={editedProfile?.display_name || ''}
                        onChange={handleInputChange('display_name')}
                        variant="standard"
                        fullWidth
                        sx={{ 
                          maxWidth: '200px',
                          mb: 1,
                          '& input': {
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 500,
                          }
                        }}
                      />
                    ) : (
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            '& + .edit-icon': {
                              opacity: 1,
                            }
                          }
                        }}
                        onClick={handleEditClick}
                      >
                        {profile?.display_name || 'Add Your Name'}
                      </Typography>
                    )}
                    <IconButton
                      className="edit-icon"
                      onClick={isEditing ? handleSaveClick : handleEditClick}
                      sx={{
                        position: 'absolute',
                        right: -36,
                        top: '50%',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': {
                          opacity: 1,
                        }
                      }}
                    >
                      {isEditing ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 2,
                    }}>
                      <Typography variant="h6">Profile Details</Typography>
                      <IconButton 
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                        color="primary"
                        size="small"
                      >
                        {isEditing ? <SaveIcon /> : <EditIcon />}
                      </IconButton>
                    </Box>

                    {saveError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {saveError}
                      </Alert>
                    )}

                    {saveSuccess && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Profile updated successfully!
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {isEditing ? (
                        <>
                          <TextField
                            label="Student Name"
                            value={editedProfile?.full_name || ''}
                            onChange={handleInputChange('full_name')}
                            fullWidth
                            size="small"
                            required
                            error={!!validationErrors.full_name}
                            helperText={validationErrors.full_name}
                          />
                          <TextField
                            label="Primary Phone"
                            value={editedProfile?.phone1 || ''}
                            onChange={handleInputChange('phone1')}
                            fullWidth
                            size="small"
                            required
                            error={!!validationErrors.phone1}
                            helperText={validationErrors.phone1}
                            placeholder="70-412-0681"
                            inputProps={{ maxLength: 11 }}
                          />
                          <TextField
                            label="Secondary Phone"
                            value={editedProfile?.phone2 || ''}
                            onChange={handleInputChange('phone2')}
                            fullWidth
                            size="small"
                            placeholder="70-412-0681"
                            inputProps={{ maxLength: 11 }}
                          />
                          <TextField
                            label="WhatsApp"
                            value={editedProfile?.whatsapp || ''}
                            onChange={handleInputChange('whatsapp')}
                            fullWidth
                            size="small"
                            placeholder="70-412-0681"
                            inputProps={{ maxLength: 11 }}
                          />
                          <TextField
                            label="Address"
                            value={editedProfile?.address || ''}
                            onChange={handleInputChange('address')}
                            fullWidth
                            size="small"
                            required
                            error={!!validationErrors.address}
                            helperText={validationErrors.address}
                            multiline
                            rows={3}
                          />
                        </>
                      ) : (
                        <>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <PersonIcon fontSize="small" /> Student Name
                            </Typography>
                            <Typography variant="body1">
                              {profile?.full_name || 'Not provided'}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <PhoneIcon fontSize="small" /> Primary Phone
                            </Typography>
                            <Typography variant="body1">
                              {profile?.phone1 || 'Not provided'}
                            </Typography>
                          </Box>

                          {profile?.phone2 && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <PhoneIcon fontSize="small" /> Secondary Phone
                              </Typography>
                              <Typography variant="body1">
                                {profile.phone2}
                              </Typography>
                            </Box>
                          )}

                          {profile?.whatsapp && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <WhatsAppIcon fontSize="small" /> WhatsApp
                              </Typography>
                              <Typography variant="body1">
                                {profile.whatsapp}
                              </Typography>
                            </Box>
                          )}

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <LocationOnIcon fontSize="small" /> Address
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                              {profile?.address || 'Not provided'}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSignOut}
                    fullWidth
                    sx={{
                      mt: 2,
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Sign Out
                  </Button>
                </Paper>
              </Grid>

              {/* Right Column - Orders */}
              <Grid item xs={12} md={7} lg={8}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
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
              </Grid>
            </Grid>
          </>
        )}
      </Container>

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
    </Box>
  );
};

export default Account; 