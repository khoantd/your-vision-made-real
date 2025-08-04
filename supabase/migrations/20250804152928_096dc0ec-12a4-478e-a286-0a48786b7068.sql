-- CRITICAL SECURITY FIX: Enable Row Level Security on all exposed tables
-- This immediately blocks public access to sensitive document data

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Enable RLS on documents_duplicate table  
ALTER TABLE public.documents_duplicate ENABLE ROW LEVEL SECURITY;

-- Enable RLS on jd_documents table
ALTER TABLE public.jd_documents ENABLE ROW LEVEL SECURITY;

-- Enable RLS on downloaded_documents table
ALTER TABLE public.downloaded_documents ENABLE ROW LEVEL SECURITY;

-- Create restrictive default policies that block all access until proper authentication is implemented
-- These will be updated once authentication is in place

-- Temporary restrictive policy for documents
CREATE POLICY "Temporary - Block all access to documents" 
ON public.documents 
FOR ALL 
USING (false);

-- Temporary restrictive policy for documents_duplicate
CREATE POLICY "Temporary - Block all access to documents_duplicate" 
ON public.documents_duplicate 
FOR ALL 
USING (false);

-- Temporary restrictive policy for jd_documents
CREATE POLICY "Temporary - Block all access to jd_documents" 
ON public.jd_documents 
FOR ALL 
USING (false);

-- Temporary restrictive policy for downloaded_documents
CREATE POLICY "Temporary - Block all access to downloaded_documents" 
ON public.downloaded_documents 
FOR ALL 
USING (false);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profile policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profiles for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();