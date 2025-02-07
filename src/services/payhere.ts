import { CartItem } from '../contexts/CartContext';

// PayHere sandbox/production URLs
const PAYHERE_URL = import.meta.env.VITE_PAYHERE_PRODUCTION === 'true'
  ? 'https://www.payhere.lk/pay/checkout'
  : 'https://sandbox.payhere.lk/pay/checkout';

interface PayhereParams {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  order_id: string;
  items: string;
  currency: string;
  amount: number;
  hash: string;
}

export const initiatePayment = (
  orderDetails: {
    orderNumber: string;
    customerDetails: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    items: CartItem[];
    total: number;
  }
) => {
  // Split full name into first and last name
  const [firstName = '', lastName = ''] = orderDetails.customerDetails.name.split(' ');
  
  // Format items for PayHere
  const itemsDescription = orderDetails.items
    .map(item => `${item.name} x ${item.quantity}`)
    .join(', ');

  // Extract city from address (last line before Sri Lanka)
  const addressLines = orderDetails.customerDetails.address.split('\n');
  const city = addressLines.length > 1 ? addressLines[addressLines.length - 2] : 'Wattala';

  const paymentParams: Partial<PayhereParams> = {
    merchant_id: import.meta.env.VITE_PAYHERE_MERCHANT_ID,
    return_url: `${window.location.origin}/payment/success`,
    cancel_url: `${window.location.origin}/payment/cancel`,
    notify_url: `${import.meta.env.VITE_API_URL}/api/payment/notify`,
    first_name: firstName,
    last_name: lastName,
    email: orderDetails.customerDetails.email,
    phone: orderDetails.customerDetails.phone,
    address: orderDetails.customerDetails.address,
    city: city,
    country: 'Sri Lanka',
    order_id: orderDetails.orderNumber,
    items: itemsDescription,
    currency: 'LKR',
    amount: orderDetails.total,
  };

  // Create form and submit
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = PAYHERE_URL;

  // Add fields to form
  Object.entries(paymentParams).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value?.toString() ?? '';
    form.appendChild(input);
  });

  // Submit form
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}; 