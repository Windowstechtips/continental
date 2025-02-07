import { createClient } from '@supabase/supabase-js';
import { SubjectContent, TeacherContent } from '../types/database.types';
import type { CartItem } from '../contexts/CartContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file:\n' +
    `VITE_SUPABASE_URL: ${supabaseUrl ? 'Present' : 'Missing'}\n` +
    `VITE_SUPABASE_ANON_KEY: ${supabaseKey ? 'Present' : 'Missing'}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection and log result
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('subjects_content').select('count', { count: 'exact' });
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Failed to test Supabase connection:', err);
    return false;
  }
};

// Run connection test
testConnection();

// News-related functions
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

// Fetch all news items
export const fetchNews = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    throw error;
  }

  return data || [];
};

// Fetch latest news item
export const fetchLatestNews = async (): Promise<NewsItem | null> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching latest news:', error);
    throw error;
  }

  return data;
};

// Fetch all subjects content
export const fetchSubjectsContent = async (): Promise<SubjectContent[]> => {
  try {
    console.log('Fetching subjects...');
    const { data, error } = await supabase
      .from('subjects_content')
      .select('id, subject_name, subject_description, whatsapp_link');

    if (error) {
      console.error('Error fetching subjects:', error.message, error);
      throw error;
    }

    if (!data) {
      console.log('No subjects data returned');
      return [];
    }

    // Add detailed logging
    console.log('Raw subjects data:', data);

    return data;
  } catch (error) {
    console.error('Error in fetchSubjectsContent:', error);
    throw error;
  }
};

// Fetch all teachers content
export const fetchTeachersContent = async (): Promise<TeacherContent[]> => {
  try {
    console.log('Fetching teachers...');
    const { data, error } = await supabase
      .from('teachers_content')
      .select('*');

    if (error) {
      console.error('Error fetching teachers:', error.message, error);
      throw error;
    }

    if (!data) {
      console.log('No data returned from query');
      return [];
    }

    // Add detailed logging for picture_id
    console.log('Raw teachers data with picture_ids:', data.map(teacher => ({
      teacher_name: teacher.teacher_name,
      picture_id: teacher.picture_id,
      picture_url: teacher.picture_id ? `/misc/teachers/${teacher.picture_id}` : 'no picture'
    })));

    // Process the data to ensure qualifications is properly handled
    const processedData = data.map(teacher => {
      console.log('Processing teacher:', teacher);
      try {
        return {
          id: teacher.id,
          teacher_name: teacher.teacher_name,
          subject_name: teacher.subject_name,
          qualifications: Array.isArray(teacher.qualifications) 
            ? teacher.qualifications 
            : (teacher.qualifications ? JSON.parse(teacher.qualifications) : []),
          description: teacher.description,
          picture_id: teacher.picture_id,
          grade: teacher.grade || null,
          syllabus: teacher.syllabus || null
        };
      } catch (e) {
        console.error('Error processing teacher data:', e, teacher);
        return {
          id: teacher.id,
          teacher_name: teacher.teacher_name,
          subject_name: teacher.subject_name,
          qualifications: [],
          description: teacher.description,
          picture_id: teacher.picture_id,
          grade: teacher.grade || null,
          syllabus: teacher.syllabus || null
        };
      }
    });

    return processedData;
  } catch (error) {
    console.error('Error in fetchTeachersContent:', error);
    throw error;
  }
};

// Fetch a single subject's content
export const fetchSubjectContent = async (subjectName: string): Promise<SubjectContent | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('subject_name', subjectName)
    .single();

  if (error) {
    console.error('Error fetching subject:', error);
    throw error;
  }

  return data;
};

// Fetch a single teacher's content
export const fetchTeacherContent = async (teacherName: string): Promise<TeacherContent | null> => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('name', teacherName)
    .single();

  if (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }

  return data;
};

// Add a new subject
export const addSubjectContent = async (subject: Omit<SubjectContent, 'id'>): Promise<SubjectContent> => {
  const { data, error } = await supabase
    .from('subjects')
    .insert([subject])
    .select()
    .single();

  if (error) {
    console.error('Error adding subject:', error);
    throw error;
  }

  return data;
};

// Add a new teacher
export const addTeacherContent = async (teacher: Omit<TeacherContent, 'id'>): Promise<TeacherContent> => {
  const { data, error } = await supabase
    .from('teachers')
    .insert([teacher])
    .select()
    .single();

  if (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }

  return data;
};

// Update a subject
export const updateSubjectContent = async (id: string, updates: Partial<SubjectContent>): Promise<SubjectContent> => {
  const { data, error } = await supabase
    .from('subjects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subject:', error);
    throw error;
  }

  return data;
};

// Update a teacher
export const updateTeacherContent = async (id: string, updates: Partial<TeacherContent>): Promise<TeacherContent> => {
  const { data, error } = await supabase
    .from('teachers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }

  return data;
};

// Delete a subject
export const deleteSubjectContent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
};

// Delete a teacher
export const deleteTeacherContent = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

// Store Types
export interface StoreProduct {
  id: string;
  product_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
  updated_at: string;
  subject: string | null;
  grade: string | null;
  syllabus: string | null;
}

export interface StoreOrder {
  id: number;
  invoice_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface StoreOrderItem {
  id: number;
  invoice_id: string;
  product_id: string;
  quantity: number;
}

// Fetch all products
export const fetchStoreProducts = async (): Promise<StoreProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('store_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchStoreProducts:', error);
    throw error;
  }
};

// Fetch a single product
export const fetchProduct = async (productId: string): Promise<StoreProduct | null> => {
  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }

  return data;
};

// Get next invoice number and increment counter
export const getNextInvoiceNumber = async (): Promise<string> => {
  try {
    // Start a transaction to safely increment the counter
    const { data: counterData, error: selectError } = await supabase
      .from('invoice_counter')
      .select('last_number')
      .single();

    if (selectError) {
      console.error('Error fetching counter:', selectError);
      throw new Error(`Failed to fetch counter: ${selectError.message}`);
    }

    if (!counterData) {
      console.error('No counter data found');
      throw new Error('Invoice counter not initialized');
    }

    const nextNumber = (counterData.last_number || 0) + 1;

    // Update the counter
    const { error: updateError } = await supabase
      .from('invoice_counter')
      .update({ last_number: nextNumber })
      .eq('id', 1);

    if (updateError) {
      console.error('Error updating counter:', updateError);
      throw new Error(`Failed to update counter: ${updateError.message}`);
    }

    // Format the invoice number with leading zeros (7 digits)
    const formattedNumber = nextNumber.toString().padStart(7, '0');
    return `CNW-#${formattedNumber}`;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    throw error;
  }
};

// Fetch orders for a specific user
export const fetchUserOrders = async (userId: string) => {
  try {
    // First, get the orders
    const { data: orders, error: ordersError } = await supabase
      .from('store_orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;
    if (!orders) return [];

    // Then, for each order, get its items with product details
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('store_order_items')
          .select(`
            id,
            product_id,
            quantity,
            store_products (
              name,
              price,
              image_url
            )
          `)
          .eq('invoice_id', order.invoice_id);

        if (itemsError) throw itemsError;

        return {
          ...order,
          items: items?.map(item => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            name: item.store_products.name,
            price: item.store_products.price,
            image_url: item.store_products.image_url
          })) || []
        };
      })
    );

    return ordersWithItems;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Update the createOrder function to handle order creation safely
export const createOrder = async ({
  customerDetails,
  items,
  total,
  paymentMethod = 'online'
}: {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  total: number;
  paymentMethod?: 'online' | 'cash';
}) => {
  try {
    const user = await supabase.auth.getUser();
    
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('store_orders')
      .insert({
        invoice_id: `INV-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        user_id: user.data.user?.id,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        customer_address: customerDetails.address,
        total_amount: total,
        payment_status: paymentMethod === 'cash' ? 'pending_cash' : 'pending_online',
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error('Failed to create order');

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase
      .from('store_order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { data: order, error: null };
  } catch (error) {
    console.error('Error in createOrder:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};

// Fetch order with items
export const getOrderWithItems = async (invoiceId: string): Promise<{
  order: StoreOrder;
  items: (StoreOrderItem & { product: StoreProduct })[];
} | null> => {
  try {
    // Get order
    const { data: order, error: orderError } = await supabase
      .from('store_orders')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single();

    if (orderError) throw orderError;
    if (!order) return null;

    // Get order items with products
    const { data: items, error: itemsError } = await supabase
      .from('store_order_items')
      .select(`
        *,
        product:store_products(*)
      `)
      .eq('invoice_id', invoiceId);

    if (itemsError) throw itemsError;

    return {
      order,
      items: items || []
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

// Fetch orders for a customer
export const fetchCustomerOrders = async (customerEmail: string): Promise<StoreOrder[]> => {
  const { data, error } = await supabase
    .from('store_orders')
    .select(`
      *,
      store_order_items (
        *,
        store_products (
          name,
          image_url
        )
      )
    `)
    .eq('customer_email', customerEmail)
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }

  return data || [];
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('store_orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}; 