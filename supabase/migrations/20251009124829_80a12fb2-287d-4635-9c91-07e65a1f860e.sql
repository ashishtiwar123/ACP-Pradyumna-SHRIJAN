-- Create profiles table for basic user info
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create startup_profiles table for startup-specific data
create table public.startup_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  startup_name text not null,
  industry text,
  stage text,
  description text,
  team_size integer,
  founded_year integer,
  website text,
  is_complete boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create uploads table for pitch decks
create table public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  startup_profile_id uuid references public.startup_profiles(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size integer,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Create analysis_results table for AI insights
create table public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid references public.uploads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  executive_summary text,
  slide_insights jsonb,
  red_flags jsonb,
  key_metrics jsonb,
  overall_score integer,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.startup_profiles enable row level security;
alter table public.uploads enable row level security;
alter table public.analysis_results enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Startup profiles policies
create policy "Users can view their own startup profile"
  on public.startup_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own startup profile"
  on public.startup_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own startup profile"
  on public.startup_profiles for update
  using (auth.uid() = user_id);

-- Uploads policies
create policy "Users can view their own uploads"
  on public.uploads for select
  using (auth.uid() = user_id);

create policy "Users can insert their own uploads"
  on public.uploads for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own uploads"
  on public.uploads for update
  using (auth.uid() = user_id);

-- Analysis results policies
create policy "Users can view their own analysis results"
  on public.analysis_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analysis results"
  on public.analysis_results for insert
  with check (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_startup_profiles_updated_at
  before update on public.startup_profiles
  for each row execute function public.handle_updated_at();