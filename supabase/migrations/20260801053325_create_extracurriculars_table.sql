
/*
# Create extracurriculars table

## Summary
Adds a new table to store extracurricular activities (ekstrakurikuler) for the school website.
Each activity has a name, category, coach/mentor, schedule, description, and a cover photo.

## New Tables
- `extracurriculars`
  - `id` (uuid, primary key)
  - `name` (text, not null) - Name of the activity
  - `category` (text, not null) - Olahraga/Seni/Akademik/Kebangsaan
  - `coach` (text) - Pembina/Pelatih
  - `schedule` (text) - Jadwal latihan
  - `description` (text) - Deskripsi kegiatan
  - `cover_url` (text) - Cover photo (Base64 data URL or external URL)
  - `sort_order` (integer, default 0)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Security
- RLS enabled
- SELECT: public (anon + authenticated) can read
- INSERT/UPDATE/DELETE: only via admin SECURITY DEFINER functions (no direct anon write)
- Added 'extracurriculars' to admin_insert_row, admin_update_row, admin_delete_row allowlists
*/

CREATE TABLE IF NOT EXISTS extracurriculars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Olahraga',
  coach text,
  schedule text,
  description text,
  cover_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE extracurriculars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_extracurriculars" ON extracurriculars;
CREATE POLICY "anon_select_extracurriculars" ON extracurriculars FOR SELECT
TO anon, authenticated USING (true);

-- Add 'extracurriculars' to the admin function allowlists by recreating them
CREATE OR REPLACE FUNCTION admin_insert_row(p_pass text, p_table text, p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  allowed_tables text[] := ARRAY[
    'hero_slides', 'news', 'teachers', 'facilities',
    'elearning_materials', 'spmb_requirements', 'spmb_timeline',
    'spmb_document_fields', 'site_settings', 'running_text',
    'contact_settings', 'profile_settings', 'extracurriculars'
  ];
  result jsonb;
  insert_cols text;
  select_vals text;
BEGIN
  IF p_pass IS NULL OR p_pass != 'smpn28ptk@' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF NOT (p_table = ANY(allowed_tables)) THEN
    RAISE EXCEPTION 'Invalid table';
  END IF;

  SELECT string_agg(format('%I', a.attname), ', '),
         string_agg(format('($1->>%I)::%s', a.attname, format_type(a.atttypid, a.atttypmod)), ', ')
  INTO insert_cols, select_vals
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  WHERE c.relname = p_table
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND a.attname != 'id'
    AND a.attname IN (SELECT key FROM jsonb_object_keys(p_data));

  IF insert_cols IS NULL OR insert_cols = '' THEN
    RAISE EXCEPTION 'No valid columns to insert';
  END IF;

  EXECUTE format(
    'INSERT INTO %I (%s) VALUES (%s) RETURNING to_jsonb(%I.*)',
    p_table, insert_cols, select_vals, p_table
  ) INTO result USING p_data;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION admin_update_row(p_pass text, p_table text, p_id uuid, p_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  allowed_tables text[] := ARRAY[
    'hero_slides', 'news', 'teachers', 'facilities',
    'elearning_materials', 'spmb_requirements', 'spmb_timeline',
    'spmb_document_fields', 'site_settings', 'running_text',
    'contact_settings', 'profile_settings', 'spmb_applications',
    'extracurriculars'
  ];
  result jsonb;
  set_clause text;
  has_updated_at boolean;
BEGIN
  IF p_pass IS NULL OR p_pass != 'smpn28ptk@' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF NOT (p_table = ANY(allowed_tables)) THEN
    RAISE EXCEPTION 'Invalid table';
  END IF;

  SELECT string_agg(
    format('%I = ($2->>%I)::%s', a.attname, a.attname, format_type(a.atttypid, a.atttypmod)),
    ', '
  )
  INTO set_clause
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  WHERE c.relname = p_table
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND a.attname NOT IN ('id', 'created_at', 'registered_at', 'updated_at')
    AND a.attname IN (SELECT key FROM jsonb_object_keys(p_data));

  SELECT EXISTS (
    SELECT 1 FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    WHERE c.relname = p_table AND a.attname = 'updated_at'
  ) INTO has_updated_at;

  IF set_clause IS NOT NULL AND set_clause != '' THEN
    IF has_updated_at THEN
      set_clause := set_clause || ', updated_at = now()';
    END IF;

    EXECUTE format(
      'UPDATE %I SET %s WHERE id = $1 RETURNING to_jsonb(%I.*)',
      p_table, set_clause, p_table
    ) INTO result USING p_id, p_data;
  ELSE
    IF has_updated_at THEN
      EXECUTE format(
        'UPDATE %I SET updated_at = now() WHERE id = $1 RETURNING to_jsonb(%I.*)',
        p_table, p_table
      ) INTO result USING p_id;
    ELSE
      EXECUTE format(
        'SELECT to_jsonb(%I.*) FROM %I WHERE id = $1',
        p_table, p_table
      ) INTO result USING p_id;
    END IF;
  END IF;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_row(p_pass text, p_table text, p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  allowed_tables text[] := ARRAY[
    'hero_slides', 'news', 'teachers', 'facilities',
    'elearning_materials', 'spmb_requirements', 'spmb_timeline',
    'spmb_document_fields', 'site_settings', 'running_text',
    'contact_settings', 'profile_settings', 'spmb_applications',
    'extracurriculars'
  ];
  result jsonb;
BEGIN
  IF p_pass IS NULL OR p_pass != 'smpn28ptk@' THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF NOT (p_table = ANY(allowed_tables)) THEN
    RAISE EXCEPTION 'Invalid table';
  END IF;

  EXECUTE format(
    'DELETE FROM %I WHERE id = $1 RETURNING to_jsonb(%I.*)',
    p_table, p_table
  ) INTO result USING p_id;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION admin_insert_row TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_row TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_row TO anon, authenticated;
