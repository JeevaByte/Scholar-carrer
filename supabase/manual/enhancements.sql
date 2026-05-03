-- Scholar Career Database Enhancements (Optional)
-- Run this AFTER merged_setup.sql for better performance, auditing, and data integrity
-- This file is idempotent and safe to rerun

begin;

-- ============================================
-- PERFORMANCE: Indexes
-- ============================================

-- Speed up user lookups
create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_profiles_created_at on profiles(created_at);

-- Speed up filtering by education level and location
create index if not exists idx_opportunities_education_level on opportunities(education_level);
create index if not exists idx_opportunities_location on opportunities(location);
create index if not exists idx_opportunities_deadline_iso on opportunities(deadline_iso);

-- Speed up user's saved/applied opportunities queries
create index if not exists idx_saved_opportunities_user_id on saved_opportunities(user_id);
create index if not exists idx_saved_opportunities_opportunity_id on saved_opportunities(opportunity_id);
create index if not exists idx_applications_user_id on applications(user_id);
create index if not exists idx_applications_status on applications(status);

-- Speed up activity feed queries
create index if not exists idx_activity_feed_user_id on activity_feed(user_id);
create index if not exists idx_activity_feed_created_at on activity_feed(created_at);

-- ============================================
-- DATA INTEGRITY: Check Constraints
-- ============================================

-- Validate profile completion percentage (0-100)
alter table profiles
  add constraint chk_profile_completion check (profile_completion >= 0 and profile_completion <= 100);

-- Validate amount value is positive
alter table opportunities
  add constraint chk_amount_value_positive check (amount_value > 0);

-- Validate application status values
alter table applications
  add constraint chk_application_status check (status in ('in-progress', 'submitted', 'accepted', 'rejected'));

-- Validate deadline is in the future (for new opportunities)
alter table opportunities
  add constraint chk_deadline_future check (deadline_iso >= current_date);

-- ============================================
-- AUDIT: Change Log Table (Optional)
-- ============================================

-- Track modifications to critical user actions
create table if not exists audit_log (
  id bigserial primary key,
  table_name text not null,
  record_id uuid not null,
  user_id uuid,
  action text not null, -- insert, update, delete
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS on audit log (read-only for authenticated users)
alter table audit_log enable row level security;

-- Users can view only their own audit entries
drop policy if exists "audit_log_select_own" on audit_log;
create policy "audit_log_select_own" on audit_log for select using (auth.uid() = user_id or auth.uid() in (select id from profiles where id = '00000000-0000-0000-0000-000000000001'));

-- Grant permissions
grant select on audit_log to authenticated;

-- ============================================
-- ANALYTICS: Denormalized Summary Views
-- ============================================

-- User engagement summary (materialized view friendly)
create or replace view user_engagement as
select
  p.id as user_id,
  p.full_name,
  p.email,
  count(distinct so.opportunity_id) as saved_count,
  count(distinct a.id) as applications_count,
  max(a.created_at) as last_application_at,
  max(so.created_at) as last_saved_at,
  count(distinct af.id) as activity_feed_count
from profiles p
left join saved_opportunities so on so.user_id = p.id
left join applications a on a.user_id = p.id
left join activity_feed af on af.user_id = p.id
group by p.id, p.full_name, p.email;

-- Opportunity popularity (most saved/applied)
create or replace view opportunity_popularity as
select
  o.id,
  o.title,
  o.provider,
  count(distinct so.user_id) as times_saved,
  count(distinct a.id) as times_applied,
  count(distinct a.id) filter (where a.status = 'accepted') as times_accepted,
  round(100.0 * count(distinct a.id) filter (where a.status = 'accepted') / nullif(count(distinct a.id), 0), 2) as acceptance_rate_pct
from opportunities o
left join saved_opportunities so on so.opportunity_id = o.id
left join applications a on a.opportunity_id = o.id
group by o.id, o.title, o.provider;

-- Grant view access
grant select on user_engagement to authenticated;
grant select on opportunity_popularity to authenticated;

-- ============================================
-- OPTIONAL: Custom Functions for Common Queries
-- ============================================

-- Get user's dashboard summary in one call
create or replace function get_user_dashboard(p_user_id uuid)
returns table (
  user_id uuid,
  full_name text,
  email text,
  profile_completion int,
  saved_count bigint,
  applications_count bigint,
  pending_applications_count bigint
)
language sql
stable
as $$
  select
    p.id,
    p.full_name,
    p.email,
    p.profile_completion,
    count(distinct so.opportunity_id),
    count(distinct a.id),
    count(distinct a.id) filter (where a.status = 'in-progress')
  from profiles p
  left join saved_opportunities so on so.user_id = p.id
  left join applications a on a.user_id = p.id
  where p.id = p_user_id
  group by p.id, p.full_name, p.email, p.profile_completion;
$$;

-- Grant execute permission
grant execute on function get_user_dashboard(uuid) to authenticated;

-- ============================================
-- FINAL VALIDATIONS
-- ============================================

-- Show all indexes created
\echo '=== Indexes Created ==='
select schemaname, tablename, indexname
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;

-- Show all check constraints
\echo '=== Check Constraints Created ==='
select constraint_name, table_name
from information_schema.table_constraints
where constraint_type = 'CHECK' and table_schema = 'public';

commit;
