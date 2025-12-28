-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text,
  is_admin boolean default false,
  created_at timestamptz not null default now()
);

-- Categories (level 1)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_zh text not null,
  description_en text,
  description_zh text,
  icon text,
  order_index integer default 0,
  created_at timestamptz not null default now()
);

-- Category subtags (level 2 dictionary)
create table if not exists category_subtags (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name_en text not null,
  name_zh text not null,
  order_index integer default 0
);

create index if not exists category_subtags_category_idx on category_subtags (category_id);

-- Tools (from tools.json)
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_zh text not null,
  description_en text,
  description_zh text,
  detailed_intro_en text,
  detailed_intro_zh text,
  official_url text,
  logo_url text,
  category_id uuid references categories(id) on delete set null,
  pricing_type text check (pricing_type in ('free','paid','freemium')),
  tags_en text[] default '{}',
  tags_zh text[] default '{}',
  subtags_en text[] default '{}',
  subtags_zh text[] default '{}',
  is_featured boolean default false,
  view_count integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists tools_category_idx on tools (category_id);
create index if not exists tools_featured_idx on tools (is_featured);

-- Cases
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_zh text not null,
  description_en text,
  description_zh text,
  detailed_content_en text,
  detailed_content_zh text,
  thumbnail_url text,
  case_type_en text,
  case_type_zh text,
  tags_en text[] default '{}',
  tags_zh text[] default '{}',
  subtags_en text[] default '{}',
  subtags_zh text[] default '{}',
  tools_en text[] default '{}',
  tools_zh text[] default '{}',
  is_featured boolean default false,
  view_count integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists cases_featured_idx on cases (is_featured);

-- Admin magic link tokens
create table if not exists admin_magic_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_magic_tokens_user_idx on admin_magic_tokens (user_id);
create index if not exists admin_magic_tokens_hash_idx on admin_magic_tokens (token_hash);
