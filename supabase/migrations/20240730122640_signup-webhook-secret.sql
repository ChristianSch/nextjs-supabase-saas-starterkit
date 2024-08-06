insert into vault.secrets
(secret, name, description)
values(
    'whsec_9c100e14ad63c1119fda38f87cb12c899a87e48b817f7e8bd1d185591a772932',
    'SIGNUP_WEBHOOK_SECRET',
    'This is the secret used to verify the authenticity of the newsletter signup webhook.'
);

SELECT vault.create_secret('http://host.docker.internal:3000/api/webhooks/signup', 'SIGNUP_WEBHOOK_URL', 'Webhook endpoint URL');

create or replace function public.handle_verified_email()
returns trigger as $$
declare
  webhook_secret text;
  webhook_url text;
  headers_json text;
  body_json text;
begin
  -- Get the newsletter API key and webhook URL from the vault
  select decrypted_secret into webhook_secret
  from vault.decrypted_secrets
  where name = 'SIGNUP_WEBHOOK_SECRET';

  select decrypted_secret into webhook_url
  from vault.decrypted_secrets
  where name = 'SIGNUP_WEBHOOK_URL';
  
  -- Construct headers JSON string
  headers_json := concat(
    '{"Content-Type": "application/json", ',
    '"Authorization": "Bearer ', webhook_secret, '"}'
  );

  -- Construct body JSON string
  body_json := concat(
    '{"email": "', replace(NEW.email, '"', '\"'), '", ',
    '"name": "', replace(coalesce(NEW.raw_user_meta_data->>'full_name', ''), '"', '\"'), '"}'
  );

  -- Make an HTTP request to your API endpoint
  perform net.http_post(
    url := webhook_url,
    headers := headers_json::jsonb,
    body := body_json::jsonb
  );
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the function when a user's email is verified
create trigger on_email_verified
after update of email_confirmed_at on auth.users
for each row
when (OLD.email_confirmed_at is null and NEW.email_confirmed_at is not null)
execute function public.handle_verified_email();

-- Function to verify the webhook token
create or replace function public.verify_webhook_token(token text)
returns boolean as $$
declare
  stored_token text;
begin
  -- Get the stored token from the vault
  select decrypted_secret into stored_token
  from vault.decrypted_secrets
  where name = 'SIGNUP_WEBHOOK_SECRET';

  RAISE NOTICE 'Stored token: %', stored_token;
  RAISE NOTICE 'Provided token: %', token;

  -- Check if stored_token is NULL
  if stored_token is null then
    RAISE NOTICE 'No token found in vault';
    return false;
  end if;
  
  -- Compare the provided token with the stored token
  return token = stored_token;
end;
$$ language plpgsql security definer;