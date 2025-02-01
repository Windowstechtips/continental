import { createClient } from '@supabase/supabase-js';
import { SubjectContent, TeacherContent } from '../types/database.types';

// Debug logging
console.log('Environment variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
});

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!rawUrl || !supabaseKey) {
  console.error('Environment variables not found:', { rawUrl, hasKey: !!supabaseKey });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Clean and format the URL
const cleanUrl = rawUrl.trim().replace(/\/+$/, ''); // Remove trailing slashes and whitespace
const supabaseUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;

console.log('Attempting to connect to Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey.trim(), {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test the connection
(async () => {
  try {
    const { error } = await supabase.from('teachers').select('count');
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful');
    }
  } catch (error) {
    console.error('Supabase connection test error:', error);
  }
})();

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
          picture_id: teacher.picture_id
        };
      } catch (e) {
        console.error('Error processing teacher data:', e, teacher);
        return {
          id: teacher.id,
          teacher_name: teacher.teacher_name,
          subject_name: teacher.subject_name,
          qualifications: [],
          description: teacher.description,
          picture_id: teacher.picture_id
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