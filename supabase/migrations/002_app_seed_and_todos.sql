-- Adds missing columns/tables and starter data for Scholar Career MVP.

alter table if exists opportunities
  add column if not exists tags text[] not null default '{}';

create table if not exists todos (
  id uuid primary key,
  name text not null,
  created_at timestamptz not null default now()
);

alter table todos enable row level security;

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