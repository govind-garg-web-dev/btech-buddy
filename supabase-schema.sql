-- BtechBuddy Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    course TEXT NOT NULL CHECK (course IN ('BTECH', 'BCA')),
    semester TEXT NOT NULL CHECK (semester IN ('1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th')),
    branch TEXT CHECK (branch IN ('CSE', 'IT', 'CST', 'ITE', 'ECE', 'EE', 'EEE', 'ICE', 'ME', 'CE', 'MAE')),
    theory_paper_code TEXT,
    lab_paper_code TEXT,
    theory_credits INTEGER DEFAULT 0,
    lab_credits INTEGER DEFAULT 0,
    theory_units JSONB DEFAULT '[]',
    lab_units JSONB DEFAULT '[]',
    course_category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('notes', 'pyq', 'books', 'lab')),
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_subjects_course_semester ON subjects(course, semester);
CREATE INDEX IF NOT EXISTS idx_subjects_branch ON subjects(branch);
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_materials_subject_id ON materials(subject_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "Public read subjects"
    ON subjects FOR SELECT USING (true);

CREATE POLICY "Public read materials"
    ON materials FOR SELECT USING (true);

-- Only authenticated users (admins) can write
CREATE POLICY "Admin manage subjects"
    ON subjects FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage materials"
    ON materials FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Create the materials bucket (run this after creating the tables)
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'materials');

CREATE POLICY "Auth upload files"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'materials');

CREATE POLICY "Auth delete files"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'materials');

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
