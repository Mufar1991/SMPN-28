
/*
# Fix: jsonb ->> key extraction uses identifier instead of literal

## Problem
format('($1->>%I)', key) produces ($1->>full_name) which is treated
as a column reference, not a string key. The ->> operator needs a
string literal: ($1->>'full_name').

## Fix
Change %I to %L for the jsonb key in both insert and update functions.
*/

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
         string_agg(format('($1->>%L)::%s', a.attname, format_type(a.atttypid, a.atttypmod)), ', ')
  INTO insert_cols, select_vals
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  WHERE c.relname = p_table
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND a.attname != 'id'
    AND a.attname IN (SELECT * FROM jsonb_object_keys(p_data));

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
    format('%I = ($2->>%L)::%s', a.attname, a.attname, format_type(a.atttypid, a.atttypmod)),
    ', '
  )
  INTO set_clause
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  WHERE c.relname = p_table
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND a.attname NOT IN ('id', 'created_at', 'registered_at', 'updated_at')
    AND a.attname IN (SELECT * FROM jsonb_object_keys(p_data));

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

GRANT EXECUTE ON FUNCTION admin_insert_row TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_row TO anon, authenticated;
