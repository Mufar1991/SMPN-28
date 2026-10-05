
/*
# Fix RLS Policies - Remove Unrestricted Anon Write Access

## Summary
The previous migration created INSERT/UPDATE/DELETE RLS policies with
USING (true) / WITH CHECK (true) for the anon role on all CMS tables.
Since the anon key is exposed in the browser, this allowed anyone to
modify or delete all data via the Supabase API.

This migration:
1. Drops all anon INSERT/UPDATE/DELETE policies (except spmb_applications INSERT)
2. Creates SECURITY DEFINER functions that verify an admin password
   before performing write operations
3. Keeps all SELECT policies unchanged (public reads still work)
4. Keeps spmb_applications INSERT for anon (public admission form)
   but adds a basic validation check (full_name required)

## Security Changes
- Anon can no longer directly INSERT/UPDATE/DELETE on any table
  (except spmb_applications INSERT with validation)
- Admin writes go through SECURITY DEFINER functions that check password
- Functions use table allowlists to prevent arbitrary table access
- Dynamic SQL uses parameterized queries to prevent SQL injection

## Functions Created
- admin_insert_row(p_pass, p_table, p_data) - Insert a row
- admin_update_row(p_pass, p_table, p_id, p_data) - Update a row by id
- admin_delete_row(p_pass, p_table, p_id) - Delete a row by id
*/

-- ============================================================
-- 1. DROP ANON WRITE POLICIES (keep SELECT, keep spmb_applications INSERT)
-- ============================================================

DROP POLICY IF EXISTS "anon_insert_site_settings" ON site_settings;
DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;
DROP POLICY IF EXISTS "anon_delete_site_settings" ON site_settings;

DROP POLICY IF EXISTS "anon_insert_running_text" ON running_text;
DROP POLICY IF EXISTS "anon_update_running_text" ON running_text;
DROP POLICY IF EXISTS "anon_delete_running_text" ON running_text;

DROP POLICY IF EXISTS "anon_insert_hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "anon_update_hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "anon_delete_hero_slides" ON hero_slides;

DROP POLICY IF EXISTS "anon_insert_news" ON news;
DROP POLICY IF EXISTS "anon_update_news" ON news;
DROP POLICY IF EXISTS "anon_delete_news" ON news;

DROP POLICY IF EXISTS "anon_insert_teachers" ON teachers;
DROP POLICY IF EXISTS "anon_update_teachers" ON teachers;
DROP POLICY IF EXISTS "anon_delete_teachers" ON teachers;

DROP POLICY IF EXISTS "anon_insert_facilities" ON facilities;
DROP POLICY IF EXISTS "anon_update_facilities" ON facilities;
DROP POLICY IF EXISTS "anon_delete_facilities" ON facilities;

DROP POLICY IF EXISTS "anon_insert_elearning" ON elearning_materials;
DROP POLICY IF EXISTS "anon_update_elearning" ON elearning_materials;
DROP POLICY IF EXISTS "anon_delete_elearning" ON elearning_materials;

DROP POLICY IF EXISTS "anon_insert_spmb_req" ON spmb_requirements;
DROP POLICY IF EXISTS "anon_update_spmb_req" ON spmb_requirements;
DROP POLICY IF EXISTS "anon_delete_spmb_req" ON spmb_requirements;

DROP POLICY IF EXISTS "anon_insert_spmb_timeline" ON spmb_timeline;
DROP POLICY IF EXISTS "anon_update_spmb_timeline" ON spmb_timeline;
DROP POLICY IF EXISTS "anon_delete_spmb_timeline" ON spmb_timeline;

DROP POLICY IF EXISTS "anon_insert_spmb_doc_fields" ON spmb_document_fields;
DROP POLICY IF EXISTS "anon_update_spmb_doc_fields" ON spmb_document_fields;
DROP POLICY IF EXISTS "anon_delete_spmb_doc_fields" ON spmb_document_fields;

-- spmb_applications: keep INSERT (public form) but add validation, remove UPDATE/DELETE
DROP POLICY IF EXISTS "anon_insert_spmb_apps" ON spmb_applications;
DROP POLICY IF EXISTS "anon_update_spmb_apps" ON spmb_applications;
DROP POLICY IF EXISTS "anon_delete_spmb_apps" ON spmb_applications;

-- Re-create spmb_applications INSERT with basic validation
CREATE POLICY "anon_insert_spmb_apps" ON spmb_applications FOR INSERT
TO anon, authenticated
WITH CHECK (full_name IS NOT NULL AND length(full_name) > 0);

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_settings;
DROP POLICY IF EXISTS "anon_update_contact" ON contact_settings;
DROP POLICY IF EXISTS "anon_delete_contact" ON contact_settings;

DROP POLICY IF EXISTS "anon_insert_profile" ON profile_settings;
DROP POLICY IF EXISTS "anon_update_profile" ON profile_settings;
DROP POLICY IF EXISTS "anon_delete_profile" ON profile_settings;

-- ============================================================
-- 2. CREATE SECURITY DEFINER FUNCTIONS FOR ADMIN WRITES
-- ============================================================

-- admin_insert_row: Insert a row into an allowed table
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
    'contact_settings', 'profile_settings'
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

-- admin_update_row: Update a row by id in an allowed table
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
    'contact_settings', 'profile_settings', 'spmb_applications'
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

  -- Check if table has updated_at column
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
    -- No columns to update from data, but may still want to touch updated_at
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

-- admin_delete_row: Delete a row by id from an allowed table
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
    'contact_settings', 'profile_settings', 'spmb_applications'
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

-- Grant execute to anon and authenticated (password check inside provides security)
GRANT EXECUTE ON FUNCTION admin_insert_row TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_row TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_row TO anon, authenticated;
