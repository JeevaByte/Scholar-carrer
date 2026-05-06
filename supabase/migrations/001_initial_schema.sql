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

alter table profiles enable row level security;
alter table opportunities enable row level security;
alter table opportunity_tags enable row level security;
alter table saved_opportunities enable row level security;
alter table applications enable row level security;
alter table activity_feed enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "saved_select_own" on saved_opportunities;
create policy "saved_select_own" on saved_opportunities for select using (auth.uid() = user_id);
drop policy if exists "saved_insert_own" on saved_opportunities;
create policy "saved_insert_own" on saved_opportunities for insert with check (auth.uid() = user_id);
drop policy if exists "saved_delete_own" on saved_opportunities;
create policy "saved_delete_own" on saved_opportunities for delete using (auth.uid() = user_id);

drop policy if exists "applications_select_own" on applications;
create policy "applications_select_own" on applications for select using (auth.uid() = user_id);
drop policy if exists "applications_insert_own" on applications;
create policy "applications_insert_own" on applications for insert with check (auth.uid() = user_id);
drop policy if exists "applications_update_own" on applications;
create policy "applications_update_own" on applications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "activity_feed_select_own" on activity_feed;
create policy "activity_feed_select_own" on activity_feed for select using (auth.uid() = user_id);
drop policy if exists "activity_feed_insert_own" on activity_feed;
create policy "activity_feed_insert_own" on activity_feed for insert with check (auth.uid() = user_id);

drop policy if exists "opportunities_select_all" on opportunities;
drop policy if exists "opportunity_tags_select_all" on opportunity_tags;

-- Opportunities are publicly readable in this MVP.
create policy "opportunities_select_all" on opportunities for select using (true);
create policy "opportunity_tags_select_all" on opportunity_tags for select using (true);
