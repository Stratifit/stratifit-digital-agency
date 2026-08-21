-- Assign each inbox section its best sender address.
--
-- Auto-replies (form submissions + inbound email) and the inbox reply
-- composer read `email_inbox_sections.from_address`, so this mapping makes
-- every conversation automatically reply from the address that best fits
-- the section (and therefore the address the customer wrote to).
--
-- All values are addresses in `email_sender_addresses` (verified SES domain,
-- so every address works as a sender).

update public.email_inbox_sections
  set from_address = 'support@stratifit.com'
  where slug = 'support';

update public.email_inbox_sections
  set from_address = 'sales@stratifit.com'
  where slug = 'acquisition';

update public.email_inbox_sections
  set from_address = 'info@stratifit.com'
  where slug in ('website-development', 'ai-automation', 'brand-design');

update public.email_inbox_sections
  set from_address = 'contact@stratifit.com'
  where slug = 'other';

update public.email_inbox_sections
  set from_address = 'hello@stratifit.com'
  where slug in ('contact', 'contact-de', 'contact-fr', 'contact-es');
