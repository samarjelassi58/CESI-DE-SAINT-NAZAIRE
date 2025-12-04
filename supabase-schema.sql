-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  phone text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  is_available boolean default true,
  is_verified boolean default false,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills table
create table skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  category text not null check (category in ('technique', 'linguistique', 'soft-skill', 'autre')),
  level text not null check (level in ('debutant', 'intermediaire', 'avance', 'expert')),
  years_experience integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Languages table
create table languages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  proficiency text not null check (proficiency in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'natif')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  technologies text[] default '{}',
  url text,
  github_url text,
  image_url text,
  start_date date,
  end_date date,
  is_current boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Passions table
create table passions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Badges table
create table badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('verified', 'expert', 'mentor', 'collaborator', 'innovator')),
  name text not null,
  description text,
  verified_by uuid references profiles(id),
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Collaborations table
create table collaborations (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  project_title text not null,
  description text not null,
  required_skills text[] default '{}',
  status text default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed')),
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  collaboration_id uuid references collaborations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index profiles_email_idx on profiles(email);
create index skills_user_id_idx on skills(user_id);
create index skills_category_idx on skills(category);
create index languages_user_id_idx on languages(user_id);
create index projects_user_id_idx on projects(user_id);
create index passions_user_id_idx on passions(user_id);
create index badges_user_id_idx on badges(user_id);
create index collaborations_requester_id_idx on collaborations(requester_id);
create index collaborations_receiver_id_idx on collaborations(receiver_id);
create index collaborations_status_idx on collaborations(status);
create index messages_collaboration_id_idx on messages(collaboration_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
alter table profiles enable row level security;
alter table skills enable row level security;
alter table languages enable row level security;
alter table projects enable row level security;
alter table passions enable row level security;
alter table badges enable row level security;
alter table collaborations enable row level security;
alter table messages enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Skills policies
create policy "Skills are viewable by everyone" on skills for select using (true);
create policy "Users can insert own skills" on skills for insert with check (auth.uid() = user_id);
create policy "Users can update own skills" on skills for update using (auth.uid() = user_id);
create policy "Users can delete own skills" on skills for delete using (auth.uid() = user_id);

-- Languages policies
create policy "Languages are viewable by everyone" on languages for select using (true);
create policy "Users can insert own languages" on languages for insert with check (auth.uid() = user_id);
create policy "Users can update own languages" on languages for update using (auth.uid() = user_id);
create policy "Users can delete own languages" on languages for delete using (auth.uid() = user_id);

-- Projects policies
create policy "Projects are viewable by everyone" on projects for select using (true);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

-- Passions policies
create policy "Passions are viewable by everyone" on passions for select using (true);
create policy "Users can insert own passions" on passions for insert with check (auth.uid() = user_id);
create policy "Users can update own passions" on passions for update using (auth.uid() = user_id);
create policy "Users can delete own passions" on passions for delete using (auth.uid() = user_id);

-- Badges policies
create policy "Badges are viewable by everyone" on badges for select using (true);
create policy "Admins can insert badges" on badges for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update badges" on badges for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Collaborations policies
create policy "Users can view their own collaborations" on collaborations for select using (
  auth.uid() = requester_id or auth.uid() = receiver_id
);
create policy "Users can create collaborations" on collaborations for insert with check (auth.uid() = requester_id);
create policy "Receivers can update collaboration status" on collaborations for update using (auth.uid() = receiver_id);

-- Messages policies
create policy "Collaboration participants can view messages" on messages for select using (
  exists (
    select 1 from collaborations 
    where id = collaboration_id 
    and (requester_id = auth.uid() or receiver_id = auth.uid())
  )
);
create policy "Collaboration participants can send messages" on messages for insert with check (
  exists (
    select 1 from collaborations 
    where id = collaboration_id 
    and (requester_id = auth.uid() or receiver_id = auth.uid())
  )
);

-- Functions

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_collaborations_updated_at before update on collaborations
  for each row execute procedure update_updated_at_column();
