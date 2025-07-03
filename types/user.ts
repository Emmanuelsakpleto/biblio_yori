export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'student' | 'librarian';
  student_id?: string;
  department?: string;
  is_active: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}
