export interface SubjectContent {
  id: string;
  subject_name: string;
  subject_description: string;
  whatsapp_link: string | null;
  grade: string | null;
  syllabus: string | null;
}

export interface TeacherContent {
  id: string;
  teacher_name: string;
  subject_name: string;
  qualifications: string[];
  description: string;
  picture_id: string | null;
  cloudinary_url: string | null;
  grade: string | null;
  syllabus: string | null;
  whatsapp_link: string | null;
} 