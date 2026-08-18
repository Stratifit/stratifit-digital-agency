-- Migration: 00061_email_templates
-- Description: CMS-editable multilingual email template library + language
--   matched automatic sends (design: openspec/changes/2026-08-18-email-templates).
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Email Templates
-- =============================================================================

create table public.email_templates (
  id                  uuid primary key default gen_random_uuid(),
  key                 text not null unique,
  category            text not null default 'custom',
  name_translations   jsonb not null default '{}'::jsonb,
  subject_translations jsonb not null default '{}'::jsonb,
  body_translations   jsonb not null default '{}'::jsonb,
  description         text,
  trigger_event       text,
  is_enabled          boolean not null default true,
  display_order       integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint email_templates_trigger_event_check
    check (trigger_event is null or trigger_event in ('manual', 'on_lead', 'on_inbound_email', 'on_thread_resolved'))
);

comment on table public.email_templates is
  'Admin-managed multilingual email templates used for automatic and manual customer emails.';

create trigger set_email_templates_updated_at
  before update on public.email_templates
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Section + thread additions
-- =============================================================================

alter table public.email_inbox_sections
  add column auto_reply_template_id uuid references public.email_templates(id) on delete set null,
  add column resolved_template_id    uuid references public.email_templates(id) on delete set null,
  add column resolved_email_enabled  boolean not null default false;

alter table public.email_threads
  add column language text not null default 'en'
    check (language in ('en', 'de', 'fr', 'es'));

-- =============================================================================
-- Row Level Security (admin-only; webhook reads via service-role)
-- =============================================================================

alter table public.email_templates enable row level security;

create policy "admins can manage email_templates"
  on public.email_templates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- Seed: starter template library (en/de/fr/es) + section links
-- =============================================================================

insert into public.email_templates (key, category, name_translations, subject_translations, body_translations, description, trigger_event, is_enabled, display_order) values
  ('contact_auto_thanks',
   'auto_reply',
   '{"en": "Contact — Thank You", "de": "Kontakt — Danksagung", "fr": "Contact — Remerciements", "es": "Contacto — Agradecimiento"}'::jsonb,
   '{"en": "Thank you for contacting Stratifit", "de": "Vielen Dank für Ihre Nachricht an Stratifit", "fr": "Merci de nous avoir contactés", "es": "Gracias por contactar con Stratifit"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for reaching out to Stratifit. We have received your enquiry and a team member will get back to you within 24 hours.\n\nIf you need anything in the meantime, reply to this email or visit our contact page.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihre Nachricht an Stratifit. Wir haben Ihre Anfrage erhalten und ein Teammitglied wird sich innerhalb von 24 Stunden bei Ihnen melden.\n\nSollten Sie in der Zwischenzeit Fragen haben, antworten Sie einfach auf diese E-Mail oder besuchen Sie unsere Kontaktseite.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nMerci d''avoir contacté Stratifit. Nous avons bien reçu votre demande et un membre de l''équipe vous répondra sous 24 heures.\n\nEn attendant, répondez simplement à cet e-mail ou visitez notre page contact.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nGracias por ponerte en contacto con Stratifit. Hemos recibido tu consulta y un miembro del equipo te responderá en un plazo de 24 horas.\n\nSi necesitas algo mientras tanto, responde a este correo o visita nuestra página de contacto.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Sent automatically when a visitor submits the contact form or emails the contact address.',
   'on_lead', true, 1),
  ('branding_auto_reply',
   'auto_reply',
   '{"en": "Brand Design — Auto Reply", "de": "Brand Design — Auto-Antwort", "fr": "Design de marque — Réponse auto", "es": "Diseño de marca — Respuesta automática"}'::jsonb,
   '{"en": "Thank you for your brand design enquiry", "de": "Vielen Dank für Ihre Anfrage zum Brand Design", "fr": "Merci pour votre demande de design de marque", "es": "Gracias por tu consulta de diseño de marca"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your interest in our brand design services. We have received your enquiry and a specialist will get back to you within 24 hours to discuss your project.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihr Interesse an unseren Brand-Design-Leistungen. Wir haben Ihre Anfrage erhalten und ein Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden, um Ihr Projekt zu besprechen.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nMerci pour votre intérêt pour nos services de design de marque. Nous avons bien reçu votre demande et un spécialiste vous recontactera sous 24 heures pour discuter de votre projet.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nGracias por tu interés en nuestros servicios de diseño de marca. Hemos recibido tu consulta y un especialista te contactará en un plazo de 24 horas para hablar de tu proyecto.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply for the Brand Design section.',
   'on_inbound_email', true, 2),
  ('web_auto_reply',
   'auto_reply',
   '{"en": "Web Development — Auto Reply", "de": "Webentwicklung — Auto-Antwort", "fr": "Développement web — Réponse auto", "es": "Desarrollo web — Respuesta automática"}'::jsonb,
   '{"en": "Thank you for your website enquiry", "de": "Vielen Dank für Ihre Website-Anfrage", "fr": "Merci pour votre demande de site web", "es": "Gracias por tu consulta sobre sitios web"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your interest in our website development services. We have received your enquiry and a specialist will get back to you within 24 hours to discuss your project.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihr Interesse an unseren Webentwicklungs-Leistungen. Wir haben Ihre Anfrage erhalten und ein Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden, um Ihr Projekt zu besprechen.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nMerci pour votre intérêt pour nos services de développement web. Nous avons bien reçu votre demande et un spécialiste vous recontactera sous 24 heures pour discuter de votre projet.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nGracias por tu interés en nuestros servicios de desarrollo web. Hemos recibido tu consulta y un especialista te contactará en un plazo de 24 horas para hablar de tu proyecto.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply for the Website Development section.',
   'on_inbound_email', true, 3),
  ('ai_auto_reply',
   'auto_reply',
   '{"en": "AI & Automation — Auto Reply", "de": "KI & Automatisierung — Auto-Antwort", "fr": "IA & Automatisation — Réponse auto", "es": "IA y automatización — Respuesta automática"}'::jsonb,
   '{"en": "Thank you for your AI & automation enquiry", "de": "Vielen Dank für Ihre Anfrage zu KI & Automatisierung", "fr": "Merci pour votre demande IA & automatisation", "es": "Gracias por tu consulta de IA y automatización"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your interest in our AI and automation services. We have received your enquiry and a specialist will get back to you within 24 hours to discuss your project.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihr Interesse an unseren KI- und Automatisierungs-Leistungen. Wir haben Ihre Anfrage erhalten und ein Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden, um Ihr Projekt zu besprechen.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nMerci pour votre intérêt pour nos services d''IA et d''automatisation. Nous avons bien reçu votre demande et un spécialiste vous recontactera sous 24 heures pour discuter de votre projet.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nGracias por tu interés en nuestros servicios de IA y automatización. Hemos recibido tu consulta y un especialista te contactará en un plazo de 24 horas para hablar de tu proyecto.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply for the AI & Automation section.',
   'on_inbound_email', true, 4),
  ('acquisition_auto_reply',
   'auto_reply',
   '{"en": "Acquisition — Auto Reply", "de": "Unternehmenskauf — Auto-Antwort", "fr": "Acquisition — Réponse auto", "es": "Adquisición — Respuesta automática"}'::jsonb,
   '{"en": "Thank you for your acquisition enquiry", "de": "Vielen Dank für Ihre Anfrage zum Unternehmenskauf", "fr": "Merci pour votre demande d''acquisition", "es": "Gracias por tu consulta de adquisición"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your interest in acquiring a business with our support. We have received your enquiry and a specialist will get back to you within 24 hours.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihr Interesse an einem Unternehmenskauf mit unserer Unterstützung. Wir haben Ihre Anfrage erhalten und ein Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nMerci pour votre intérêt pour l''acquisition d''une entreprise avec notre accompagnement. Nous avons bien reçu votre demande et un spécialiste vous recontactera sous 24 heures.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nGracias por tu interés en la adquisición de un negocio con nuestro apoyo. Hemos recibido tu consulta y un especialista te contactará en un plazo de 24 horas.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply for the Acquisition section.',
   'on_inbound_email', true, 5),
  ('support_auto_reply',
   'auto_reply',
   '{"en": "Support — Auto Reply", "de": "Support — Auto-Antwort", "fr": "Support — Réponse auto", "es": "Soporte — Respuesta automática"}'::jsonb,
   '{"en": "We received your support request", "de": "Wir haben Ihre Support-Anfrage erhalten", "fr": "Nous avons bien reçu votre demande d''assistance", "es": "Hemos recibido tu solicitud de soporte"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for contacting our support team. We have received your request and will get back to you shortly.\n\nIf this is urgent, reply to this email and mention it in the subject.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank, dass Sie sich an unser Support-Team gewendet haben. Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.\n\nFalls es eilig ist, antworten Sie auf diese E-Mail und erwähnen Sie es im Betreff.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nMerci d''avoir contacté notre équipe d''assistance. Nous avons bien reçu votre demande et vous répondrons rapidement.\n\nSi c''est urgent, répondez à cet e-mail et mentionnez-le dans l''objet.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nGracias por ponerte en contacto con nuestro equipo de soporte. Hemos recibido tu solicitud y te responderemos en breve.\n\nSi es urgente, responde a este correo y menciónalo en el asunto.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply for the Support section.',
   'on_inbound_email', true, 6),
  ('project_kickoff',
   'lifecycle',
   '{"en": "Project Kickoff", "de": "Projektstart", "fr": "Lancement du projet", "es": "Inicio del proyecto"}'::jsonb,
   '{"en": "Welcome aboard — let''s get started, {{name}}", "de": "Willkommen an Bord — los geht''s, {{name}}", "fr": "Bienvenue à bord — c''est parti, {{name}}", "es": "¡Bienvenido a bordo! Empecemos, {{name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWelcome to Stratifit! We''re excited to start working on your project.\n\nHere''s what happens next:\n1. We schedule a kickoff call to align on goals.\n2. We share a project plan with milestones.\n3. We keep you updated at every step.\n\nIf you have any questions, just reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwillkommen bei Stratifit! Wir freuen uns, mit der Arbeit an Ihrem Projekt zu beginnen.\n\nSo geht es weiter:\n1. Wir vereinbaren einen Kickoff-Termin, um die Ziele abzustimmen.\n2. Wir teilen einen Projektplan mit Meilensteinen.\n3. Wir halten Sie bei jedem Schritt auf dem Laufenden.\n\nBei Fragen antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nBienvenue chez Stratifit ! Nous sommes ravis de démarrer votre projet.\n\nVoici la suite :\n1. Nous planifions un appel de lancement pour aligner les objectifs.\n2. Nous partageons un plan de projet avec des jalons.\n3. Nous vous tenons informé à chaque étape.\n\nPour toute question, répondez simplement à cet e-mail.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\n¡Bienvenido a Stratifit! Estamos encantados de empezar a trabajar en tu proyecto.\n\nEsto es lo que viene después:\n1. Programamos una llamada de inicio para alinear los objetivos.\n2. Compartimos un plan de proyecto con hitos.\n3. Te mantenemos informado en cada paso.\n\nSi tienes alguna duda, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Send when a new project starts (manual trigger).',
   'manual', false, 7),
  ('project_complete',
   'lifecycle',
   '{"en": "Project Complete", "de": "Projekt abgeschlossen", "fr": "Projet terminé", "es": "Proyecto completado"}'::jsonb,
   '{"en": "Your project with Stratifit is complete", "de": "Ihr Projekt mit Stratifit ist abgeschlossen", "fr": "Votre projet avec Stratifit est terminé", "es": "Tu proyecto con Stratifit está completado"}'::jsonb,
   '{"en": "Hi {{name}},\n\nGreat news — your project is complete! We''re proud of what we built together and we hope you love it.\n\nIf anything needs adjusting, just reply to this email and we''ll take care of it.\n\nThank you for choosing Stratifit.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ngute Nachrichten — Ihr Projekt ist abgeschlossen! Wir sind stolz auf das, was wir gemeinsam aufgebaut haben, und hoffen, dass es Ihnen gefällt.\n\nSollte etwas angepasst werden müssen, antworten Sie einfach auf diese E-Mail und wir kümmern uns darum.\n\nVielen Dank, dass Sie sich für Stratifit entschieden haben.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nBonne nouvelle : votre projet est terminé ! Nous sommes fiers de ce que nous avons construit ensemble et nous espérons que cela vous plaît.\n\nSi quelque chose doit être ajusté, répondez simplement à cet e-mail et nous nous en occupons.\n\nMerci d''avoir choisi Stratifit.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\n¡Buenas noticias! Tu proyecto está completado. Estamos orgullosos de lo que hemos construido juntos y esperamos que te encante.\n\nSi necesitas ajustar algo, responde a este correo y nos encargaremos de ello.\n\nGracias por elegir Stratifit.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Send when a project is delivered (manual trigger).',
   'manual', false, 8),
  ('follow_up_resolved',
   'follow_up',
   '{"en": "Follow-Up After Resolution", "de": "Follow-up nach Abschluss", "fr": "Suivi après clôture", "es": "Seguimiento tras el cierre"}'::jsonb,
   '{"en": "We''d love your feedback", "de": "Ihr Feedback ist uns wichtig", "fr": "Votre avis compte pour nous", "es": "Tu opinión nos importa"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe''ve closed your conversation with Stratifit. We hope everything is going well!\n\nIf you have any further questions, just reply to this email — we''re happy to help.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir haben Ihre Konversation mit Stratifit abgeschlossen. Wir hoffen, dass alles gut läuft!\n\nFalls Sie weitere Fragen haben, antworten Sie einfach auf diese E-Mail — wir helfen gerne.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nNous avons clôturé votre conversation avec Stratifit. Nous espérons que tout se passe bien !\n\nSi vous avez d''autres questions, répondez simplement à cet e-mail — nous serons ravis de vous aider.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nHemos cerrado tu conversación con Stratifit. ¡Esperamos que todo vaya bien!\n\nSi tienes más preguntas, responde a este correo — estaremos encantados de ayudarte.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Sent automatically when an admin resolves a thread (per-section toggle).',
   'on_thread_resolved', false, 9),
  ('payment_reminder',
   'billing',
   '{"en": "Payment Reminder", "de": "Zahlungserinnerung", "fr": "Rappel de paiement", "es": "Recordatorio de pago"}'::jsonb,
   '{"en": "Payment reminder — invoice {{invoice_number}}", "de": "Zahlungserinnerung — Rechnung {{invoice_number}}", "fr": "Rappel de paiement — facture {{invoice_number}}", "es": "Recordatorio de pago — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThis is a friendly reminder that payment of {{amount}} for invoice {{invoice_number}} is due on {{due_date}}.\n\nIf you have already paid, please ignore this message. Otherwise, you can reply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ndies ist eine freundliche Erinnerung, dass die Zahlung von {{amount}} für Rechnung {{invoice_number}} bis zum {{due_date}} fällig ist.\n\nFalls Sie bereits bezahlt haben, ignorieren Sie diese Nachricht bitte. Andernfalls können Sie auf diese E-Mail antworten, falls Sie Fragen haben.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nCeci est un rappel amical : le paiement de {{amount}} pour la facture {{invoice_number}} est dû le {{due_date}}.\n\nSi vous avez déjà payé, veuillez ignorer ce message. Sinon, vous pouvez répondre à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nEste es un recordatorio amistoso de que el pago de {{amount}} de la factura {{invoice_number}} vence el {{due_date}}.\n\nSi ya has pagado, ignora este mensaje. De lo contrario, puedes responder a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Draft — send manually when a payment is overdue.',
   'manual', false, 10),
  ('invoice_ready',
   'billing',
   '{"en": "Invoice Ready", "de": "Rechnung bereit", "fr": "Facture disponible", "es": "Factura lista"}'::jsonb,
   '{"en": "Your invoice {{invoice_number}} is ready", "de": "Ihre Rechnung {{invoice_number}} ist bereit", "fr": "Votre facture {{invoice_number}} est disponible", "es": "Tu factura {{invoice_number}} está lista"}'::jsonb,
   '{"en": "Hi {{name}},\n\nYour invoice {{invoice_number}} for {{amount}} is now available. You can find the details attached, or reply to this email if you have any questions.\n\nThank you for working with Stratifit.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nIhre Rechnung {{invoice_number}} über {{amount}} ist jetzt verfügbar. Die Details finden Sie im Anhang, oder Sie antworten auf diese E-Mail, falls Sie Fragen haben.\n\nVielen Dank für die Zusammenarbeit mit Stratifit.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nVotre facture {{invoice_number}} d''un montant de {{amount}} est maintenant disponible. Vous trouverez les détails en pièce jointe, ou vous pouvez répondre à cet e-mail pour toute question.\n\nMerci de travailler avec Stratifit.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nTu factura {{invoice_number}} por importe de {{amount}} ya está disponible. Puedes encontrar los detalles adjuntos, o responder a este correo si tienes alguna duda.\n\nGracias por trabajar con Stratifit.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Draft — send manually when an invoice is issued.',
   'manual', false, 11)
on conflict (key) do nothing;

-- Link default sections to their auto-reply templates.
update public.email_inbox_sections s
set auto_reply_template_id = t.id
from public.email_templates t
where t.key = case s.slug
  when 'contact' then 'contact_auto_thanks'
  when 'brand-design' then 'branding_auto_reply'
  when 'website-development' then 'web_auto_reply'
  when 'ai-automation' then 'ai_auto_reply'
  when 'acquisition' then 'acquisition_auto_reply'
  when 'support' then 'support_auto_reply'
  else null
end
and t.key is not null;

-- Rollback:
-- DROP POLICY IF EXISTS "admins can manage email_templates" ON public.email_templates;
-- DROP TABLE IF EXISTS public.email_templates;
-- ALTER TABLE public.email_inbox_sections
--   DROP COLUMN IF EXISTS resolved_email_enabled,
--   DROP COLUMN IF EXISTS resolved_template_id,
--   DROP COLUMN IF EXISTS auto_reply_template_id;
-- ALTER TABLE public.email_threads DROP COLUMN IF EXISTS language;
