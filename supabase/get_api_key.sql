-- Get API key from Supabase Vault
-- Run this in your Supabase SQL editor or add to migrations

create or replace function get_api_key(key_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  secret_value text;
begin
  select decrypted_secret into secret_value
  from vault.decrypted_secrets
  where name = key_name;

  return secret_value;
end;
$$;

-- Keys to add in Supabase Dashboard → Settings → Vault:
--   openai_api_key
--   gemini_api_key
--   voyage_api_key
