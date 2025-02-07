import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // First, fetch the orders
        const { data: orders, error: ordersError } = await supabase
          .from('store_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Then, for each order, fetch its items with product details
        const ordersWithItems = await Promise.all(
          orders.map(async (order) => {
            const { data: items, error: itemsError } = await supabase
              .from('store_order_items')
              .select(`
                id,
                quantity,
                price_at_time,
                product:store_products (
                  id,
                  name,
                  image_url
                )
              `)
              .eq('order_id', order.id);

            if (itemsError) throw itemsError;

            return {
              ...order,
              items: items || []
            };
          })
        );

        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Error loading orders:', error);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Account
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Account Details
          </Typography>
          <Typography>Email: {user.email}</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Order History
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : orders.length === 0 ? (
          <Alert severity="info">No orders found</Alert>
        ) : (
          <TableContainer>
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
                      Rs. {order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="medium"
                        sx={{ 
                          fontSize: '1rem',
                          py: 1.5,
                          '& .MuiChip-icon': {
                            fontSize: '1.2rem'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedOrder(order)}
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

      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
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