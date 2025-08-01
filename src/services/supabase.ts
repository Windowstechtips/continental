import { createClient } from '@supabase/supabase-js';
import { SubjectContent, TeacherContent } from '../types/database.types';
import type { CartItem } from '../contexts/CartContext';

// Log Supabase configuration
console.log('Supabase Configuration:', {
  url: import.meta.env.VITE_SUPABASE_URL ? 'Set (hidden)' : 'Not set',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Present' : 'Missing',
    key: supabaseKey ? 'Present' : 'Missing'
  });
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
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('subjects_content').select('count', { count: 'exact' });
    
    if (error) {
      console.error('Supabase connection error:', error.message, error);
      return false;
    }
    
    console.log('Supabase connection successful:', { data });
    return true;
  } catch (err) {
    console.error('Failed to test Supabase connection:', err);
    return false;
  }
};

// Run connection test
console.log('Initializing Supabase connection test...');
testConnection()
  .then(success => console.log(`Supabase connection test ${success ? 'passed' : 'failed'}`))
  .catch(err => console.error('Unexpected error in Supabase connection test:', err));

// News-related functions
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

// Fetch all news items
export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('Fetching news items...');
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} news items`);
    return data || [];
  } catch (error) {
    console.error('Error in fetchNews:', error);
    return [];
  }
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
export const fetchSubjectsContent = async (curriculum?: string, grade?: string): Promise<SubjectContent[]> => {
  try {
    console.log('Fetching subjects with filters:', { curriculum, grade });
    
    let query = supabase
      .from('subjects_content')
      .select('id, subject_name, subject_description, whatsapp_link, grade, syllabus');

    // Apply filters if provided - handle comma-separated values
    if (curriculum && grade) {
      // Both curriculum and grade specified
      query = query.or(`and(syllabus.ilike.%${curriculum}%,grade.ilike.%${grade}%),syllabus.is.null,grade.is.null`);
    } else if (curriculum) {
      // Only curriculum specified
      query = query.or(`syllabus.ilike.%${curriculum}%,syllabus.is.null`);
    } else if (grade) {
      // Only grade specified
      query = query.or(`grade.ilike.%${grade}%,grade.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subjects:', error.message, error);
      throw error;
    }

    if (!data) {
      console.log('No subjects data returned');
      return [];
    }

    // Add detailed logging
    console.log('Filtered subjects data:', data);

    return data;
  } catch (error) {
    console.error('Error in fetchSubjectsContent:', error);
    throw error;
  }
};

// Fetch all teachers content with optional filtering
export const fetchTeachersContent = async (curriculum?: string, grade?: string): Promise<TeacherContent[]> => {
  try {
    console.log('Fetching teachers with filters:', { curriculum, grade });
    
    let query = supabase
      .from('teachers_content')
      .select('*');

    // Apply filters based on the database structure - handle comma-separated values
    // From the screenshot, I can see values like "Cambridge,Edexcel" and "9,10,AS"
    if (curriculum && grade) {
      // Both curriculum and grade specified - need to match both in comma-separated fields
      query = query.or(`and(syllabus.ilike.%${curriculum}%,grade.ilike.%${grade}%),and(syllabus.is.null,grade.is.null)`);
    } else if (curriculum) {
      // Only curriculum specified - match in comma-separated syllabus field
      query = query.or(`syllabus.ilike.%${curriculum}%,syllabus.is.null`);
    } else if (grade) {
      // Only grade specified - match in comma-separated grade field
      query = query.or(`grade.ilike.%${grade}%,grade.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching teachers:', error.message, error);
      throw error;
    }

    if (!data) {
      console.log('No data returned from query');
      return [];
    }

    // Log the raw data to see all fields
    console.log('Filtered teachers data:', JSON.stringify(data, null, 2));

    // Process the data to ensure qualifications is properly handled
    const processedData = data.map(teacher => {
      console.log('Processing teacher:', teacher);
      
      // Check if picture_id might be a Cloudinary public_id (not a local file)
      let cloudinaryUrl = teacher.cloudinary_url;
      if (!cloudinaryUrl && teacher.picture_id && !teacher.picture_id.includes('.') && !teacher.picture_id.startsWith('/')) {
        // This might be a Cloudinary public_id without an extension
        cloudinaryUrl = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${teacher.picture_id}`;
        console.log(`Generated Cloudinary URL for ${teacher.teacher_name}:`, cloudinaryUrl);
      }
      
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
          cloudinary_url: cloudinaryUrl || null,
          grade: teacher.grade || null,
          syllabus: teacher.syllabus || null,
          whatsapp_link: teacher.whatsapp_link || null
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
          cloudinary_url: cloudinaryUrl || null,
          grade: teacher.grade || null,
          syllabus: teacher.syllabus || null,
          whatsapp_link: teacher.whatsapp_link || null
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
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Get next invoice number
    const invoiceId = await getNextInvoiceNumber();

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('store_orders')
      .insert({
        invoice_id: invoiceId,
        user_id: userData.user?.id,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        customer_address: customerDetails.address,
        total_amount: total,
        payment_status: paymentMethod === 'cash' ? 'pending_cash' : 'pending_online',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    if (!order) {
      throw new Error('Failed to create order: No order data returned');
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: itemsError } = await supabase
      .from('store_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    return { data: order, error: null };
  } catch (error) {
    console.error('Error in createOrder:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to process order')
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

// Gallery-related functions
export interface GalleryImage {
  id: number;
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  tags?: string[];
  alt?: string;
  title?: string;
}

// Fetch gallery images from Supabase
export const fetchGalleryImagesFromSupabase = async (tag?: string): Promise<GalleryImage[]> => {
  try {
    console.log(`Fetching gallery images from Supabase${tag ? ` with tag: ${tag}` : ''}...`);
    
    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    // If a tag is specified, filter by that tag
    if (tag && tag !== 'all') {
      query = query.contains('tags', [tag]);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching gallery images from Supabase:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn(`No gallery images found in Supabase${tag ? ` with tag: ${tag}` : ''}`);
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} gallery images from Supabase`);
    
    // Transform the data to match our GalleryImage interface
    const galleryImages: GalleryImage[] = data.map(image => ({
      id: image.id,
      public_id: image.public_id,
      secure_url: image.secure_url || `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${image.public_id}`,
      format: image.format || 'jpg',
      width: image.width || 800,
      height: image.height || 600,
      created_at: image.created_at || new Date().toISOString(),
      tags: Array.isArray(image.tags) ? image.tags : (image.tags ? [image.tags] : []),
      alt: image.alt || 'Gallery Image',
      title: image.title || 'Gallery Image'
    }));
    
    return galleryImages;
  } catch (error) {
    console.error('Error in fetchGalleryImagesFromSupabase:', error);
    return [];
  }
};

// Fetch all unique tags from gallery images
export const fetchGalleryTags = async (): Promise<string[]> => {
  try {
    console.log('Fetching gallery tags from Supabase...');
    
    const { data, error } = await supabase
      .from('gallery_images')
      .select('tags');
    
    if (error) {
      console.error('Error fetching gallery tags from Supabase:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn('No gallery images found in Supabase');
      return [];
    }
    
    // Extract all tags from all images and flatten the array
    const allTags = data.flatMap(image => 
      Array.isArray(image.tags) ? image.tags : (image.tags ? [image.tags] : [])
    );
    
    // Remove duplicates and sort alphabetically
    const uniqueTags = [...new Set(allTags)].sort();
    
    console.log(`Successfully fetched ${uniqueTags.length} unique gallery tags from Supabase`);
    
    return uniqueTags;
  } catch (error) {
    console.error('Error in fetchGalleryTags:', error);
    return [];
  }
}; 