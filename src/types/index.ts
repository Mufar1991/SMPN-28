export interface RunningText {
  id: string;
  is_enabled: boolean;
  content: string;
  link_url: string | null;
  link_label: string | null;
  bg_color: string;
  text_color: string;
  speed: string;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  tagline: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  full_name: string;
  title: string | null;
  nip: string | null;
  nuptk: string | null;
  position: string | null;
  subject: string | null;
  category: string;
  photo_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  icon_name: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ELearningMaterial {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  grade_level: string | null;
  file_url: string | null;
  material_type: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface SpmbRequirement {
  id: string;
  content: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SpmbTimeline {
  id: string;
  step_number: number;
  title: string;
  date_range: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SpmbDocumentField {
  id: string;
  label: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  accepted_types: string | null;
  max_size_mb: number | null;
  created_at: string;
}

export interface SpmbApplication {
  id: string;
  full_name: string;
  nisn: string | null;
  birth_place: string | null;
  birth_date: string | null;
  gender: string | null;
  religion: string | null;
  address: string | null;
  phone_student: string | null;
  father_name: string | null;
  father_job: string | null;
  father_income: string | null;
  father_education: string | null;
  mother_name: string | null;
  mother_job: string | null;
  mother_income: string | null;
  mother_education: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
  kip_number: string | null;
  kis_number: string | null;
  kks_number: string | null;
  previous_school: string | null;
  sttb_number: string | null;
  achievements: string | null;
  registration_path: string | null;
  documents: Record<string, string>;
  status: string;
  registration_number: string | null;
  registered_at: string;
  updated_at: string;
}

export interface ContactSettings {
  id: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  operating_hours: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  maps_embed_url: string | null;
  maps_enabled: boolean;
  updated_at: string;
}

export interface Extracurricular {
  id: string;
  name: string;
  category: string;
  coach: string | null;
  schedule: string | null;
  description: string | null;
  cover_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileSettings {
  id: string;
  accreditation_status: string | null;
  accreditation_subtitle: string | null;
  visi: string | null;
  misi: string[];
  history_text: string | null;
  history_image_url: string | null;
  spmb_label: string | null;
  updated_at: string;
}
