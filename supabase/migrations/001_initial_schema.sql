-- Scholar Career initial schema template
-- Replace UUID defaults and auth references as needed by your Supabase project policy.

create table if not exists profiles (
  id uuid primary key,
  full_name text not null,
  email text unique not null,
  nationality text,
  education_level text,
  profile_completion int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists opportunities (
  id uuid primary key,
  title text not null,
  provider text not null,
  summary text not null,
  amount_label text not null,
  amount_value int not null,
  education_level text not null,
  location text not null,
  deadline_iso date not null,
  created_at timestamptz not null default now()
);

create table if not exists opportunity_tags (
  id bigserial primary key,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  tag text not null
);

create table if not exists saved_opportunities (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, opportunity_id)
);

create table if not exists applications (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  status text not null default 'in-progress',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists activity_feed (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  status text not null,
  date_label text not null,
  created_at timestamptz not null default now()
);

-- RLS placeholders
alter table profiles enable row level security;
alter table opportunities enable row level security;
alter table opportunity_tags enable row level security;
alter table saved_opportunities enable row level security;
alter table applications enable row level security;
alter table activity_feed enable row level security;

-- Example policy templates: replace auth.uid() assumptions per final auth model.
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "saved_select_own" on saved_opportunities for select using (auth.uid() = user_id);
create policy "saved_insert_own" on saved_opportunities for insert with check (auth.uid() = user_id);
create policy "applications_select_own" on applications for select using (auth.uid() = user_id);
create policy "applications_insert_own" on applications for insert with check (auth.uid() = user_id);

-- Opportunities are publicly readable in this MVP.
create policy "opportunities_select_all" on opportunities for select using (true);
create policy "opportunity_tags_select_all" on opportunity_tags for select using (true);
