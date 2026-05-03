-- Scholar Career manual Supabase setup
-- Paste this whole script into the Supabase SQL editor and run it once.
-- It is written to be idempotent so rerunning it should be safe for setup/repair.

begin;

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
  created_at timestamptz not null default now(),
  tags text[] not null default '{}'
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

create table if not exists todos (
  id uuid primary key,
  name text not null,
  created_at timestamptz not null default now()
);

alter table if exists opportunities
  add column if not exists tags text[] not null default '{}';

alter table profiles enable row level security;
alter table opportunities enable row level security;
alter table opportunity_tags enable row level security;
alter table saved_opportunities enable row level security;
alter table applications enable row level security;
alter table activity_feed enable row level security;
alter table todos enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);

drop policy if exists "saved_select_own" on saved_opportunities;
create policy "saved_select_own" on saved_opportunities for select using (auth.uid() = user_id);

drop policy if exists "saved_insert_own" on saved_opportunities;
create policy "saved_insert_own" on saved_opportunities for insert with check (auth.uid() = user_id);

drop policy if exists "applications_select_own" on applications;
create policy "applications_select_own" on applications for select using (auth.uid() = user_id);

drop policy if exists "applications_insert_own" on applications;
create policy "applications_insert_own" on applications for insert with check (auth.uid() = user_id);

drop policy if exists "opportunities_select_all" on opportunities;
create policy "opportunities_select_all" on opportunities for select using (true);

drop policy if exists "opportunity_tags_select_all" on opportunity_tags;
create policy "opportunity_tags_select_all" on opportunity_tags for select using (true);

drop policy if exists "todos_select_all" on todos;
create policy "todos_select_all" on todos for select using (true);

grant usage on schema public to anon, authenticated;
grant select on table opportunities to anon, authenticated;
grant select on table opportunity_tags to anon, authenticated;
grant select on table todos to anon, authenticated;

insert into profiles (id, full_name, email, nationality, education_level, profile_completion)
values ('00000000-0000-0000-0000-000000000001', 'Demo User', 'demo@scholarcareer.app', 'Global', 'undergraduate', 85)
on conflict (id) do nothing;

insert into opportunities (
  id, title, provider, summary, amount_label, amount_value, education_level, location, deadline_iso, tags
)
values
  ('11111111-1111-1111-1111-111111111111', 'Future Tech Innovators Fellowship', 'Future Forward Foundation', 'Support for high-impact software, AI, and engineering projects.', '$50,000 / year', 50000, 'undergraduate', 'global', '2026-10-15', array['full-ride', 'stem']),
  ('22222222-2222-2222-2222-222222222222', 'Design Leadership Grant', 'Creative Minds Institute', 'Grants for design and innovation students with strong portfolios.', '$15,000 one-time', 15000, 'graduate', 'europe', '2026-11-01', array['leadership']),
  ('33333333-3333-3333-3333-333333333333', 'Emerging Leaders Scholarship', 'World Education Fund', 'Need-based funding for academically excellent students.', 'Tuition + stipend', 30000, 'undergraduate', 'global', '2027-01-15', array['need-based']),
  ('44444444-4444-4444-4444-444444444444', 'Quantum Computing Fellowship', 'Advanced Sciences Corp', 'Research pathway for early-career quantum researchers.', '$75,000 / year', 75000, 'phd', 'north-america', '2027-02-28', array['research', 'stem'])
on conflict (id) do update set
  title = excluded.title,
  provider = excluded.provider,
  summary = excluded.summary,
  amount_label = excluded.amount_label,
  amount_value = excluded.amount_value,
  education_level = excluded.education_level,
  location = excluded.location,
  deadline_iso = excluded.deadline_iso,
  tags = excluded.tags;

insert into todos (id, name)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Create short list of scholarships'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Draft statement of purpose'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Request recommendation letters')
on conflict (id) do update set
  name = excluded.name;

commit;