import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  RunningText, HeroSlide, NewsItem, Teacher, Facility, ELearningMaterial,
  SpmbRequirement, SpmbTimeline, SpmbDocumentField, ContactSettings, ProfileSettings,
  Extracurricular,
} from '@/types';

interface DataContextValue {
  runningText: RunningText | null;
  heroSlides: HeroSlide[];
  news: NewsItem[];
  teachers: Teacher[];
  facilities: Facility[];
  elearning: ELearningMaterial[];
  spmbRequirements: SpmbRequirement[];
  spmbTimeline: SpmbTimeline[];
  spmbDocFields: SpmbDocumentField[];
  contact: ContactSettings | null;
  profile: ProfileSettings | null;
  extracurriculars: Extracurricular[];
  spmbLabel: string;
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const STORAGE_KEY = 'smpn28_cms_data_v1';

interface PersistedState {
  runningText: RunningText | null;
  heroSlides: HeroSlide[];
  news: NewsItem[];
  teachers: Teacher[];
  facilities: Facility[];
  elearning: ELearningMaterial[];
  spmbRequirements: SpmbRequirement[];
  spmbTimeline: SpmbTimeline[];
  spmbDocFields: SpmbDocumentField[];
  contact: ContactSettings | null;
  profile: ProfileSettings | null;
  extracurriculars: Extracurricular[];
}

function loadFromStorage(): Partial<PersistedState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return null;
  }
}

function saveToStorage(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full (large Base64 images) — silently ignore
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<DataContextValue, 'refresh'>>(() => {
    const cached = loadFromStorage();
    if (cached) {
      return {
        runningText: cached.runningText ?? null,
        heroSlides: cached.heroSlides ?? [],
        news: cached.news ?? [],
        teachers: cached.teachers ?? [],
        facilities: cached.facilities ?? [],
        elearning: cached.elearning ?? [],
        spmbRequirements: cached.spmbRequirements ?? [],
        spmbTimeline: cached.spmbTimeline ?? [],
        spmbDocFields: cached.spmbDocFields ?? [],
        contact: cached.contact ?? null,
        profile: cached.profile ?? null,
        extracurriculars: cached.extracurriculars ?? [],
        spmbLabel: cached.profile?.spmb_label ?? 'SPMB',
        loading: true,
      };
    }
    return {
      runningText: null,
      heroSlides: [],
      news: [],
      teachers: [],
      facilities: [],
      elearning: [],
      spmbRequirements: [],
      spmbTimeline: [],
      spmbDocFields: [],
      contact: null,
      profile: null,
      extracurriculars: [],
      spmbLabel: 'SPMB',
      loading: true,
    };
  });

  const load = useCallback(async () => {
    const [
      rt, hs, nw, tc, fc, el, sr, st, sd, cs, ps, ex,
    ] = await Promise.all([
      supabase.from('running_text').select('*').maybeSingle(),
      supabase.from('hero_slides').select('*').order('sort_order', { ascending: true }),
      supabase.from('news').select('*').order('published_at', { ascending: false }),
      supabase.from('teachers').select('*').order('sort_order', { ascending: true }),
      supabase.from('facilities').select('*').order('sort_order', { ascending: true }),
      supabase.from('elearning_materials').select('*').order('sort_order', { ascending: true }),
      supabase.from('spmb_requirements').select('*').order('sort_order', { ascending: true }),
      supabase.from('spmb_timeline').select('*').order('step_number', { ascending: true }),
      supabase.from('spmb_document_fields').select('*').order('sort_order', { ascending: true }),
      supabase.from('contact_settings').select('*').maybeSingle(),
      supabase.from('profile_settings').select('*').maybeSingle(),
      supabase.from('extracurriculars').select('*').order('sort_order', { ascending: true }),
    ]);

    const nextState = {
      runningText: rt.data,
      heroSlides: hs.data ?? [],
      news: nw.data ?? [],
      teachers: tc.data ?? [],
      facilities: fc.data ?? [],
      elearning: el.data ?? [],
      spmbRequirements: sr.data ?? [],
      spmbTimeline: st.data ?? [],
      spmbDocFields: sd.data ?? [],
      contact: cs.data,
      profile: ps.data,
      extracurriculars: ex.data ?? [],
      spmbLabel: ps.data?.spmb_label ?? 'SPMB',
      loading: false,
    };

    setState(nextState);
    saveToStorage({
      runningText: nextState.runningText,
      heroSlides: nextState.heroSlides,
      news: nextState.news,
      teachers: nextState.teachers,
      facilities: nextState.facilities,
      elearning: nextState.elearning,
      spmbRequirements: nextState.spmbRequirements,
      spmbTimeline: nextState.spmbTimeline,
      spmbDocFields: nextState.spmbDocFields,
      contact: nextState.contact,
      profile: nextState.profile,
      extracurriculars: nextState.extracurriculars,
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <DataContext.Provider value={{ ...state, refresh: load }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
