import { useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Divider,
  Chip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PaymentsIcon from '@mui/icons-material/Payments';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { CartItem } from '../contexts/CartContext';

interface InvoiceItem {
  id: number;
  name?: string;
  quantity: number;
  price: number;
  price_at_time?: number;
  product?: {
    name: string;
  };
}

interface InvoiceProps {
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
  status?: string;
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

const Invoice = ({ orderNumber, orderDate, customerDetails, items, total, status }: InvoiceProps) => {
  const theme = useTheme();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: theme.palette.background.paper,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${orderNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ borderRadius: 2 }}
        >
          Download Invoice
        </Button>
      </Box>

      <Paper
        ref={invoiceRef}
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ width: 80, height: 80, mb: 2 }}>
                <img 
                  src="/misc/main.png" 
                  alt="Continental College Logo"
                  style={{ 
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    maxHeight: '100%'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="h4" gutterBottom color="primary">
                  INVOICE
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                  Continental College
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No. 10, Vincent Joseph Mawatha
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Old Negombo Road, Wattala
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sri Lanka
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tel: 071 123 3233
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: continentalwattala@gmail.com
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1">
                <strong>Invoice #:</strong> {orderNumber}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {orderDate}
              </Typography>
              {status && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={getStatusIcon(status)}
                    label={getStatusLabel(status)}
                    color={getStatusColor(status)}
                    size="medium"
                    sx={{ 
                      fontSize: '1rem',
                      py: 1.5,
                      '& .MuiChip-icon': {
                        fontSize: '1.2rem'
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>

        {/* Customer Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Bill To:
          </Typography>
          <Typography>{customerDetails.name}</Typography>
          <Typography>{customerDetails.email}</Typography>
          <Typography>{customerDetails.phone}</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{customerDetails.address}</Typography>
        </Box>

        {/* Items Table */}
        <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item</strong></TableCell>
                <TableCell align="right"><strong>Quantity</strong></TableCell>
                <TableCell align="right"><strong>Price</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name || item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    Rs. {(item.price_at_time || item.price || 0).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </TableCell>
                  <TableCell align="right">
                    Rs. {((item.price_at_time || item.price || 0) * item.quantity).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <strong>Total:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>
                    Rs. {total.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Thank you for your purchase!
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            (Please keep the invoice with you incase of any dispute)
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Invoice; 