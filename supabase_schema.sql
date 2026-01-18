-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Users Profile Table (links to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'USER' check (role in ('ADMIN', 'USER')),
  created_at timestamptz default now()
);

-- Create Books Table
create table public.books (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  author text not null,
  description text,
  cover_url text,
  category text,
  status text default 'AVAILABLE' check (status in ('AVAILABLE', 'BORROWED')),
  borrowed_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.books enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Policies for Books
-- View: Everyone can view books
create policy "Books are viewable by everyone"
  on public.books for select
  using ( true );

-- Insert: Only Admins can add books
create policy "Admins can insert books"
  on public.books for insert
  with check ( 
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

-- Update: 
-- 1. Admins can update anything
-- 2. Users can only update status if borrowing/returning (checked in app logic, enforced here roughly or via RPC usually safer)
create policy "Admins can update books"
  on public.books for update
  using ( 
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

create policy "Users can borrow/return books"
  on public.books for update
  using ( 
     -- Allow if the user is borrowing (status changes to BORROWED and borrowed_by becomes them)
     -- OR if returning (status changes to AVAILABLE and borrowed_by was them)
     auth.uid() = borrowed_by OR borrowed_by is null
  )
  with check (
      status in ('AVAILABLE', 'BORROWED')
  );

-- Delete: Only Admins
create policy "Admins can delete books"
  on public.books for delete
  using ( 
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );
