-- Migration: 00066_communication_engine
-- Description: Rebuilds the email system as the Stratifit Communication
--   Engine. Drops the Resend-era `email_templates` and `email_events`,
--   creates `email_templates` (with template_type), `email_logs`,
--   `email_schedules`, and `automation_triggers`, and seeds the 39-template
--   multilingual library (23 auto-replies + 16 manual, en/de/fr/es).
--   Conversation storage (email_inbox_sections, email_threads,
--   email_messages) is retained — the dashboard spec requires conversations.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- 1. Drop Resend-era communication tables (clean slate)
-- =============================================================================

drop table if exists public.email_events cascade;

-- Drops the section/thread FK columns that referenced the old templates.
drop table if exists public.email_templates cascade;

-- =============================================================================
-- 2. Email templates (rebuilt)
-- =============================================================================

create table public.email_templates (
  id                   uuid primary key default gen_random_uuid(),
  key                  text not null unique,
  template_type        text not null default 'manual'
                       check (template_type in ('auto', 'manual')),
  category             text not null default 'custom',
  name_translations    jsonb not null default '{}'::jsonb,
  subject_translations jsonb not null default '{}'::jsonb,
  body_translations    jsonb not null default '{}'::jsonb,
  description          text,
  trigger_event        text
                       check (trigger_event is null or trigger_event in
                         ('manual', 'on_lead', 'on_inbound_email', 'on_thread_resolved')),
  is_enabled           boolean not null default true,
  display_order        integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on table public.email_templates is
  'Multilingual (en/de/fr/es) email templates for automatic and manual customer emails.';

create trigger set_email_templates_updated_at
  before update on public.email_templates
  for each row execute function public.set_updated_at();

alter table public.email_templates enable row level security;

create policy "admins can manage email_templates"
  on public.email_templates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 3. Email logs (replaces email_events)
-- =============================================================================

create table public.email_logs (
  id                   uuid primary key default gen_random_uuid(),
  template_key         text,
  recipient_email      text not null,
  sender_email         text not null,
  subject              text,
  language             text not null default 'en'
                       check (language in ('en', 'de', 'fr', 'es')),
  status               text not null default 'queued' check (status in
                         ('queued', 'sent', 'failed', 'delivered', 'bounced', 'complained')),
  provider_message_id  text,
  error_message        text,
  related_type         text,
  related_id           uuid,
  idempotency_key      text unique,
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  sent_at              timestamptz,
  delivered_at         timestamptz
);

comment on table public.email_logs is
  'Log of every email sent through the Communication Engine.';

create index email_logs_created_idx
  on public.email_logs (created_at desc);

create index email_logs_status_idx
  on public.email_logs (status);

alter table public.email_logs enable row level security;

create policy "admins can manage email_logs"
  on public.email_logs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 4. Email schedules
-- =============================================================================

create table public.email_schedules (
  id                uuid primary key default gen_random_uuid(),
  template_key      text not null,
  recipient_email   text not null,
  recipient_name    text,
  language          text not null default 'en'
                    check (language in ('en', 'de', 'fr', 'es')),
  send_at           timestamptz not null,
  status            text not null default 'pending' check (status in
                      ('pending', 'sent', 'failed', 'cancelled')),
  data              jsonb not null default '{}'::jsonb,
  error_message     text,
  created_at        timestamptz not null default now(),
  sent_at           timestamptz
);

comment on table public.email_schedules is
  'Scheduled template sends; a scheduler worker marks due schedules as sent.';

create index email_schedules_due_idx
  on public.email_schedules (status, send_at);

alter table public.email_schedules enable row level security;

create policy "admins can manage email_schedules"
  on public.email_schedules for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 5. Automation triggers
-- =============================================================================

create table public.automation_triggers (
  id            uuid primary key default gen_random_uuid(),
  event_type    text not null unique,
  template_key  text not null references public.email_templates(key) on delete set null,
  enabled       boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.automation_triggers is
  'Maps business events to the email template key sent automatically.';

create trigger set_automation_triggers_updated_at
  before update on public.automation_triggers
  for each row execute function public.set_updated_at();

alter table public.automation_triggers enable row level security;

create policy "admins can manage automation_triggers"
  on public.automation_triggers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =============================================================================
-- 6. Re-link section template columns to the rebuilt table
-- =============================================================================

-- The Resend-era migration 00061 added these columns referencing the old
-- email_templates table (dropped above). Drop them first for a clean slate,
-- then re-add them against the rebuilt table.
alter table public.email_inbox_sections
  drop column if exists auto_reply_template_id,
  drop column if exists resolved_template_id;

alter table public.email_inbox_sections
  add column auto_reply_template_id uuid references public.email_templates(id) on delete set null,
  add column resolved_template_id    uuid references public.email_templates(id) on delete set null;

-- =============================================================================
-- 7. Seed: 23 auto-replies
-- =============================================================================

insert into public.email_templates (key, template_type, category, name_translations, subject_translations, body_translations, description, trigger_event, is_enabled, display_order) values
  ('new_inquiry', 'auto', 'auto_reply',
   '{"en": "New Inquiry", "de": "Neue Anfrage", "fr": "Nouvelle demande", "es": "Nueva consulta"}'::jsonb,
   '{"en": "We received your enquiry", "de": "Wir haben Ihre Anfrage erhalten", "fr": "Nous avons bien reçu votre demande", "es": "Hemos recibido tu consulta"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your enquiry. We have received it and a specialist will get back to you within 24 hours.\n\nIn the meantime, you can explore our services on our website. Reply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihre Anfrage. Wir haben sie erhalten und ein Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden.\n\nIn der Zwischenzeit können Sie sich auf unserer Website über unsere Leistungen informieren. Bei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci pour votre demande. Nous l''avons bien reçue et un spécialiste vous recontactera sous 24 heures.\n\nEn attendant, vous pouvez découvrir nos services sur notre site web. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por tu consulta. La hemos recibido y un especialista se pondrá en contacto contigo en un plazo de 24 horas.\n\nMientras tanto, puedes explorar nuestros servicios en nuestra web. Responde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic acknowledgement when a new enquiry arrives.', 'on_inbound_email', true, 1),

  ('service_request', 'auto', 'auto_reply',
   '{"en": "Service Request", "de": "Serviceanfrage", "fr": "Demande de service", "es": "Solicitud de servicio"}'::jsonb,
   '{"en": "Service request received — {{section_name}}", "de": "Serviceanfrage erhalten — {{section_name}}", "fr": "Demande de service reçue — {{section_name}}", "es": "Solicitud de servicio recibida — {{section_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for requesting our {{section_name}} service. A specialist will contact you within 24 hours to discuss the details.\n\nIf you have questions in the meantime, reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihre Anfrage zu unserem Service {{section_name}}. Ein Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden, um die Details zu besprechen.\n\nSollten Sie in der Zwischenzeit Fragen haben, antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci d''avoir demandé notre service {{section_name}}. Un spécialiste vous contactera sous 24 heures pour en discuter les détails.\n\nSi vous avez des questions entre-temps, répondez à cet e-mail.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por solicitar nuestro servicio de {{section_name}}. Un especialista se pondrá en contacto contigo en un plazo de 24 horas para hablar de los detalles.\n\nSi tienes alguna duda mientras tanto, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic confirmation when a service request is received.', 'on_inbound_email', true, 2),

  ('coming_soon', 'auto', 'auto_reply',
   '{"en": "Coming Soon", "de": "Bald verfügbar", "fr": "Bientôt disponible", "es": "Próximamente"}'::jsonb,
   '{"en": "Stratifit — coming soon", "de": "Stratifit — bald verfügbar", "fr": "Stratifit — bientôt disponible", "es": "Stratifit — próximamente"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your interest. The {{section_name}} service is coming soon — we are putting the finishing touches on it.\n\nLeave us your details and we will notify you the moment it is available.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihr Interesse. Der Service {{section_name}} ist bald verfügbar — wir arbeiten noch an den letzten Details.\n\nHinterlassen Sie uns Ihre Kontaktdaten und wir benachrichtigen Sie, sobald er verfügbar ist.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci pour votre intérêt. Le service {{section_name}} arrive bientôt — nous mettons la touche finale.\n\nLaissez-nous vos coordonnées et nous vous préviendrons dès qu''il sera disponible.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por tu interés. El servicio de {{section_name}} estará disponible muy pronto — estamos ultimando los detalles.\n\nDéjanos tus datos y te avisaremos en cuanto esté disponible.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply when a service is not yet available.', 'on_inbound_email', true, 3),

  ('quote_request', 'auto', 'auto_reply',
   '{"en": "Quote Request", "de": "Angebotsanfrage", "fr": "Demande de devis", "es": "Solicitud de presupuesto"}'::jsonb,
   '{"en": "We received your quote request", "de": "Wir haben Ihre Angebotsanfrage erhalten", "fr": "Nous avons bien reçu votre demande de devis", "es": "Hemos recibido tu solicitud de presupuesto"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for requesting a quote. We have received your enquiry and will prepare a tailored quote for {{project_name}} as soon as possible.\n\nA specialist will get back to you within 24 hours. Reply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihre Angebotsanfrage. Wir haben Ihre Anfrage erhalten und erstellen so schnell wie möglich ein individuelles Angebot für {{project_name}}.\n\nEin Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden. Bei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci pour votre demande de devis. Nous avons bien reçu votre demande et préparerons un devis personnalisé pour {{project_name}} dans les plus brefs délais.\n\nUn spécialiste vous recontactera sous 24 heures. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por solicitar un presupuesto. Hemos recibido tu consulta y prepararemos un presupuesto a medida para {{project_name}} lo antes posible.\n\nUn especialista se pondrá en contacto contigo en un plazo de 24 horas. Responde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply when a quote is requested.', 'on_inbound_email', true, 4),

  ('support', 'auto', 'auto_reply',
   '{"en": "Support", "de": "Support", "fr": "Support", "es": "Soporte"}'::jsonb,
   '{"en": "We received your support request", "de": "Wir haben Ihre Support-Anfrage erhalten", "fr": "Nous avons bien reçu votre demande d''assistance", "es": "Hemos recibido tu solicitud de soporte"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for contacting our support team. We have received your request and will get back to you shortly.\n\nIf this is urgent, reply to this email and mention it in the subject.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank, dass Sie sich an unser Support-Team gewendet haben. Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.\n\nFalls es eilig ist, antworten Sie auf diese E-Mail und erwähnen Sie es im Betreff.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci d''avoir contacté notre équipe d''assistance. Nous avons bien reçu votre demande et vous répondrons rapidement.\n\nSi c''est urgent, répondez à cet e-mail et mentionnez-le dans l''objet.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por ponerte en contacto con nuestro equipo de soporte. Hemos recibido tu solicitud y te responderemos en breve.\n\nSi es urgente, responde a este correo y menciónalo en el asunto.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reply for the Support section.', 'on_inbound_email', true, 5),

  ('project_start', 'auto', 'lifecycle',
   '{"en": "Project Started", "de": "Projekt gestartet", "fr": "Projet démarré", "es": "Proyecto iniciado"}'::jsonb,
   '{"en": "{{project_name}} — your project has started", "de": "{{project_name}} — Ihr Projekt hat begonnen", "fr": "{{project_name}} — votre projet a démarré", "es": "{{project_name}} — tu proyecto ha comenzado"}'::jsonb,
   '{"en": "Hi {{name}},\n\nGreat news — your project {{project_name}} has officially started. Our team is now working on the {{project_stage}} stage.\n\nYou will receive regular updates as we progress. If you have any questions, just reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ngute Nachrichten — Ihr Projekt {{project_name}} hat offiziell begonnen. Unser Team arbeitet jetzt an der Phase {{project_stage}}.\n\nSie erhalten regelmäßig Updates zum Fortschritt. Bei Fragen antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nbonne nouvelle : votre projet {{project_name}} a officiellement démarré. Notre équipe travaille maintenant sur l''étape {{project_stage}}.\n\nVous recevrez des mises à jour régulières au fur et à mesure. Pour toute question, répondez simplement à cet e-mail.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\n¡Buenas noticias! Tu proyecto {{project_name}} ha comenzado oficialmente. Nuestro equipo está ahora trabajando en la fase {{project_stage}}.\n\nRecibirás actualizaciones periódicas a medida que avancemos. Si tienes alguna duda, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic notification when a project moves into active work.', 'on_inbound_email', true, 6),

  ('milestone_reached', 'auto', 'lifecycle',
   '{"en": "Milestone Reached", "de": "Meilenstein erreicht", "fr": "Jalon atteint", "es": "Hito alcanzado"}'::jsonb,
   '{"en": "Milestone reached for {{project_name}}", "de": "Meilenstein für {{project_name}} erreicht", "fr": "Jalon atteint pour {{project_name}}", "es": "Hito alcanzado para {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe have reached an important milestone in your project {{project_name}}. The {{project_stage}} stage is complete and we are moving on to the next phase.\n\nWe will keep you updated every step of the way.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir haben einen wichtigen Meilenstein in Ihrem Projekt {{project_name}} erreicht. Die Phase {{project_stage}} ist abgeschlossen und wir gehen zur nächsten über.\n\nWir halten Sie bei jedem Schritt auf dem Laufenden.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous avons atteint un jalon important dans votre projet {{project_name}}. L''étape {{project_stage}} est terminée et nous passons à la phase suivante.\n\nNous vous tiendrons informé à chaque étape.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nhemos alcanzado un hito importante en tu proyecto {{project_name}}. La fase {{project_stage}} está completa y pasamos a la siguiente.\n\nTe mantendremos informado en cada paso.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic update when a project milestone is completed.', 'on_inbound_email', true, 7),

  ('delay_notification', 'auto', 'lifecycle',
   '{"en": "Project Delay", "de": "Projektverzögerung", "fr": "Retard de projet", "es": "Retraso del proyecto"}'::jsonb,
   '{"en": "Update on {{project_name}} — schedule adjustment", "de": "Update zu {{project_name}} — Terminanpassung", "fr": "Point sur {{project_name}} — ajustement du calendrier", "es": "Actualización de {{project_name}} — ajuste de calendario"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe want to keep you informed: the timeline for {{project_name}} has shifted slightly. The {{project_stage}} stage is taking a little longer than expected.\n\nWe are working hard to minimize the impact and will keep you updated on the revised timeline.\n\nThank you for your understanding.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir möchten Sie informieren: Der Zeitplan für {{project_name}} hat sich leicht verschoben. Die Phase {{project_stage}} dauert etwas länger als erwartet.\n\nWir arbeiten intensiv daran, die Auswirkungen gering zu halten, und informieren Sie über den aktualisierten Zeitplan.\n\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous tenons à vous informer : le calendrier de {{project_name}} a légèrement évolué. L''étape {{project_stage}} prend un peu plus de temps que prévu.\n\nNous travaillons dur pour limiter l''impact et vous tiendrons au courant du calendrier révisé.\n\nMerci de votre compréhension.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nqueremos mantenerte informado: el calendario de {{project_name}} se ha ajustado ligeramente. La fase {{project_stage}} está llevando un poco más de tiempo de lo previsto.\n\nEstamos trabajando duro para minimizar el impacto y te mantendremos al tanto del nuevo calendario.\n\nGracias por tu comprensión.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic notification when a project timeline is delayed.', 'on_inbound_email', true, 8),

  ('problem_detected', 'auto', 'lifecycle',
   '{"en": "Problem Detected", "de": "Problem erkannt", "fr": "Problème détecté", "es": "Problema detectado"}'::jsonb,
   '{"en": "An issue was detected in {{project_name}}", "de": "Ein Problem wurde in {{project_name}} erkannt", "fr": "Un problème a été détecté dans {{project_name}}", "es": "Se ha detectado un problema en {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWhile working on {{project_name}}, our team detected an issue: {{issue_description}}\n\nWe are already working on a fix and will keep you updated on our progress. Reply to this email if you have any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nbei der Arbeit an {{project_name}} hat unser Team ein Problem festgestellt: {{issue_description}}\n\nWir arbeiten bereits an einer Lösung und halten Sie über den Fortschritt auf dem Laufenden. Bei Fragen antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nen travaillant sur {{project_name}}, notre équipe a détecté un problème : {{issue_description}}\n\nNous travaillons déjà sur une solution et vous tiendrons informé de nos progrès. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nmientras trabajábamos en {{project_name}}, nuestro equipo ha detectado un problema: {{issue_description}}\n\nYa estamos trabajando en una solución y te mantendremos informado de nuestro progreso. Responde a este correo si tienes alguna duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic notification when a technical issue is detected.', 'on_inbound_email', true, 9),

  ('revision_requested', 'auto', 'lifecycle',
   '{"en": "Revision Requested", "de": "Überarbeitung angefordert", "fr": "Révision demandée", "es": "Revisión solicitada"}'::jsonb,
   '{"en": "Revision request — {{project_name}}", "de": "Überarbeitung — {{project_name}}", "fr": "Demande de révision — {{project_name}}", "es": "Solicitud de revisión — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nOur team has completed a review of {{project_name}} and we would like to request a revision. Here is what we need:\n{{issue_description}}\n\nOnce we receive your feedback, we will update the {{project_stage}} stage accordingly.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nunser Team hat eine Prüfung von {{project_name}} abgeschlossen und möchte eine Überarbeitung anfragen. Das benötigen wir:\n{{issue_description}}\n\nSobald wir Ihr Feedback erhalten haben, passen wir die Phase {{project_stage}} entsprechend an.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnotre équipe a terminé une revue de {{project_name}} et souhaite demander une révision. Voici ce dont nous avons besoin :\n{{issue_description}}\n\nDès réception de votre retour, nous mettrons à jour l''étape {{project_stage}} en conséquence.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nnuestro equipo ha completado una revisión de {{project_name}} y nos gustaría solicitar una revisión. Esto es lo que necesitamos:\n{{issue_description}}\n\nEn cuanto recibamos tus comentarios, actualizaremos la fase {{project_stage}} en consecuencia.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic request for client input to continue a revision.', 'on_inbound_email', true, 10),

  ('project_completed', 'auto', 'lifecycle',
   '{"en": "Project Completed", "de": "Projekt abgeschlossen", "fr": "Projet terminé", "es": "Proyecto completado"}'::jsonb,
   '{"en": "Your project with Stratifit is complete", "de": "Ihr Projekt mit Stratifit ist abgeschlossen", "fr": "Votre projet avec Stratifit est terminé", "es": "Tu proyecto con Stratifit está completado"}'::jsonb,
   '{"en": "Hi {{name}},\n\nGreat news — your project is complete! We''re proud of what we built together and we hope you love it.\n\nIf anything needs adjusting, just reply to this email and we''ll take care of it.\n\nThank you for choosing Stratifit.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ngute Nachrichten — Ihr Projekt ist abgeschlossen! Wir sind stolz auf das, was wir gemeinsam aufgebaut haben, und hoffen, dass es Ihnen gefällt.\n\nSollte etwas angepasst werden müssen, antworten Sie einfach auf diese E-Mail und wir kümmern uns darum.\n\nVielen Dank, dass Sie sich für Stratifit entschieden haben.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nbonne nouvelle : votre projet est terminé ! Nous sommes fiers de ce que nous avons construit ensemble et nous espérons que cela vous plaît.\n\nSi quelque chose doit être ajusté, répondez simplement à cet e-mail et nous nous en occupons.\n\nMerci d''avoir choisi Stratifit.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\n¡Buenas noticias! Tu proyecto está completado. Estamos orgullosos de lo que hemos construido juntos y esperamos que te encante.\n\nSi necesitas ajustar algo, responde a este correo y nos encargaremos de ello.\n\nGracias por elegir Stratifit.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic notification when a project is delivered.', 'on_inbound_email', true, 11),

  ('invoice_sent', 'auto', 'billing',
   '{"en": "Invoice Sent", "de": "Rechnung gesendet", "fr": "Facture envoyée", "es": "Factura enviada"}'::jsonb,
   '{"en": "Invoice {{invoice_number}} from Stratifit", "de": "Rechnung {{invoice_number}} von Stratifit", "fr": "Facture {{invoice_number}} de Stratifit", "es": "Factura {{invoice_number}} de Stratifit"}'::jsonb,
   '{"en": "Hi {{name}},\n\nYour invoice {{invoice_number}} for {{amount}} has been issued and is due by {{due_date}}.\n\nYou can reply to this email with any questions about the invoice.\n\nThank you for working with Stratifit.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nIhre Rechnung {{invoice_number}} über {{amount}} wurde erstellt und ist bis zum {{due_date}} fällig.\n\nBei Fragen zur Rechnung antworten Sie einfach auf diese E-Mail.\n\nVielen Dank für die Zusammenarbeit mit Stratifit.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nvotre facture {{invoice_number}} d''un montant de {{amount}} a été émise et est due le {{due_date}}.\n\nVous pouvez répondre à cet e-mail pour toute question concernant la facture.\n\nMerci de travailler avec Stratifit.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ntu factura {{invoice_number}} por importe de {{amount}} se ha emitido y vence el {{due_date}}.\n\nPuedes responder a este correo con cualquier duda sobre la factura.\n\nGracias por trabajar con Stratifit.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic notification when an invoice is issued.', 'on_inbound_email', true, 12),

  ('payment_received', 'auto', 'billing',
   '{"en": "Payment Received", "de": "Zahlung erhalten", "fr": "Paiement reçu", "es": "Pago recibido"}'::jsonb,
   '{"en": "Payment received — invoice {{invoice_number}}", "de": "Zahlung erhalten — Rechnung {{invoice_number}}", "fr": "Paiement reçu — facture {{invoice_number}}", "es": "Pago recibido — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe have received your payment of {{amount}} for invoice {{invoice_number}}. Thank you!\n\nThe invoice is now marked as paid. We appreciate your business.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir haben Ihre Zahlung von {{amount}} für Rechnung {{invoice_number}} erhalten. Vielen Dank!\n\nDie Rechnung ist nun als bezahlt markiert. Wir freuen uns über die Zusammenarbeit.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous avons bien reçu votre paiement de {{amount}} pour la facture {{invoice_number}}. Merci !\n\nLa facture est désormais marquée comme payée. Merci pour votre confiance.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nhemos recibido tu pago de {{amount}} por la factura {{invoice_number}}. ¡Gracias!\n\nLa factura ya está marcada como pagada. Agradecemos tu confianza.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic confirmation when a payment is received.', 'on_inbound_email', true, 13),

  ('payment_failed', 'auto', 'billing',
   '{"en": "Payment Failed", "de": "Zahlung fehlgeschlagen", "fr": "Paiement échoué", "es": "Pago fallido"}'::jsonb,
   '{"en": "Payment failed — invoice {{invoice_number}}", "de": "Zahlung fehlgeschlagen — Rechnung {{invoice_number}}", "fr": "Échec du paiement — facture {{invoice_number}}", "es": "Pago fallido — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nUnfortunately, your payment of {{amount}} for invoice {{invoice_number}} failed (status: {{payment_status}}).\n\nPlease check your payment details and try again. If you need help, reply to this email and we will sort it out.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nleider ist Ihre Zahlung von {{amount}} für Rechnung {{invoice_number}} fehlgeschlagen (Status: {{payment_status}}).\n\nBitte überprüfen Sie Ihre Zahlungsdaten und versuchen Sie es erneut. Falls Sie Hilfe benötigen, antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmalheureusement, votre paiement de {{amount}} pour la facture {{invoice_number}} a échoué (statut : {{payment_status}}).\n\nMerci de vérifier vos informations de paiement et de réessayer. Si vous avez besoin d''aide, répondez à cet e-mail et nous trouverons une solution.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nlamentablemente, tu pago de {{amount}} por la factura {{invoice_number}} ha fallado (estado: {{payment_status}}).\n\nRevisa tus datos de pago e inténtalo de nuevo. Si necesitas ayuda, responde a este correo y lo resolveremos.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic notification when a payment fails.', 'on_inbound_email', true, 14),

  ('payment_upcoming', 'auto', 'billing',
   '{"en": "Upcoming Payment", "de": "Bevorstehende Zahlung", "fr": "Paiement à venir", "es": "Pago próximo"}'::jsonb,
   '{"en": "Upcoming payment — invoice {{invoice_number}}", "de": "Bevorstehende Zahlung — Rechnung {{invoice_number}}", "fr": "Paiement à venir — facture {{invoice_number}}", "es": "Pago próximo — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThis is a friendly reminder that payment of {{amount}} for invoice {{invoice_number}} is due on {{due_date}}.\n\nIf you have already arranged the payment, please ignore this message. Reply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ndies ist eine freundliche Erinnerung, dass die Zahlung von {{amount}} für Rechnung {{invoice_number}} bis zum {{due_date}} fällig ist.\n\nFalls Sie die Zahlung bereits veranlasst haben, ignorieren Sie diese Nachricht bitte. Bei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nceci est un rappel amical : le paiement de {{amount}} pour la facture {{invoice_number}} est dû le {{due_date}}.\n\nSi vous avez déjà organisé le paiement, veuillez ignorer ce message. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\neste es un recordatorio amistoso: el pago de {{amount}} por la factura {{invoice_number}} vence el {{due_date}}.\n\nSi ya has organizado el pago, ignora este mensaje. Responde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reminder before an invoice payment is due.', 'on_inbound_email', true, 15),

  ('payment_overdue', 'auto', 'billing',
   '{"en": "Payment Overdue", "de": "Zahlung überfällig", "fr": "Paiement en retard", "es": "Pago vencido"}'::jsonb,
   '{"en": "Payment overdue — invoice {{invoice_number}}", "de": "Zahlung überfällig — Rechnung {{invoice_number}}", "fr": "Paiement en retard — facture {{invoice_number}}", "es": "Pago vencido — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThis is a reminder that your payment of {{amount}} for invoice {{invoice_number}} was due on {{due_date}} and is now overdue.\n\nPlease arrange the payment at your earliest convenience. Reply to this email if you have any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ndies ist eine Erinnerung, dass Ihre Zahlung von {{amount}} für Rechnung {{invoice_number}} am {{due_date}} fällig war und nun überfällig ist.\n\nBitte veranlassen Sie die Zahlung zeitnah. Bei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nceci est un rappel : votre paiement de {{amount}} pour la facture {{invoice_number}} était dû le {{due_date}} et est maintenant en retard.\n\nMerci de procéder au paiement dans les plus brefs délais. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\neste es un recordatorio: tu pago de {{amount}} por la factura {{invoice_number}} venció el {{due_date}} y ahora está vencido.\n\nTe agradecemos que realices el pago lo antes posible. Responde a este correo si tienes alguna duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reminder when an invoice payment is overdue.', 'on_inbound_email', true, 16),

  ('meeting_reminder', 'auto', 'lifecycle',
   '{"en": "Meeting Reminder", "de": "Terminerinnerung", "fr": "Rappel de réunion", "es": "Recordatorio de reunión"}'::jsonb,
   '{"en": "Meeting reminder — {{project_name}}", "de": "Terminerinnerung — {{project_name}}", "fr": "Rappel de réunion — {{project_name}}", "es": "Recordatorio de reunión — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThis is a reminder about our upcoming meeting for {{project_name}} on {{meeting_date}}.\n\nWe will review the progress of the {{project_stage}} stage and the next steps. Reply to this email to reschedule if the time no longer works for you.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ndies ist eine Erinnerung an unser bevorstehendes Meeting zu {{project_name}} am {{meeting_date}}.\n\nWir besprechen den Fortschritt der Phase {{project_stage}} und die nächsten Schritte. Falls der Termin nicht mehr passt, antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nceci est un rappel concernant notre prochaine réunion pour {{project_name}} le {{meeting_date}}.\n\nNous ferons le point sur l''avancement de l''étape {{project_stage}} et les prochaines étapes. Répondez à cet e-mail pour reporter si le créneau ne vous convient plus.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\neste es un recordatorio de nuestra próxima reunión para {{project_name}} el {{meeting_date}}.\n\nRevisaremos el progreso de la fase {{project_stage}} y los siguientes pasos. Responde a este correo para reprogramar si la hora ya no te viene bien.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic reminder before a scheduled project meeting.', 'on_inbound_email', true, 17),

  ('document_needed', 'auto', 'lifecycle',
   '{"en": "Document Needed", "de": "Dokument benötigt", "fr": "Document requis", "es": "Documento necesario"}'::jsonb,
   '{"en": "Document needed: {{project_name}}", "de": "Dokument benötigt: {{project_name}}", "fr": "Document requis: {{project_name}}", "es": "Documento necesario: {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nTo keep {{project_name}} moving forward, we need one more document from you: {{issue_description}}\n\nOnce we receive it, we will continue with the {{project_stage}} stage right away.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\num {{project_name}} voranzubringen, benötigen wir noch ein Dokument von Ihnen: {{issue_description}}\n\nSobald wir es erhalten haben, setzen wir die Phase {{project_stage}} sofort fort.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\npour faire avancer {{project_name}}, nous avons besoin d''un document supplémentaire de votre part : {{issue_description}}\n\nDès réception, nous poursuivrons immédiatement l''étape {{project_stage}}.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\npara seguir avanzando con {{project_name}}, necesitamos un documento más de tu parte: {{issue_description}}\n\nEn cuanto lo recibamos, continuaremos con la fase {{project_stage}} de inmediato.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic request when a document is required to continue.', 'on_inbound_email', true, 18),

  ('approval_needed', 'auto', 'lifecycle',
   '{"en": "Approval Needed", "de": "Freigabe erforderlich", "fr": "Approbation requise", "es": "Aprobación necesaria"}'::jsonb,
   '{"en": "Your approval is needed: {{project_name}}", "de": "Ihre Freigabe ist erforderlich: {{project_name}}", "fr": "Votre approbation est requise: {{project_name}}", "es": "Necesitamos tu aprobación: {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe need your approval to continue with {{project_name}}. Please review the latest {{project_stage}} deliverables and confirm by replying to this email with your approval or your feedback.\n\nWe will proceed as soon as we hear from you.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir benötigen Ihre Freigabe, um mit {{project_name}} fortzufahren. Bitte prüfen Sie die aktuellen Ergebnisse der Phase {{project_stage}} und bestätigen Sie per Antwort auf diese E-Mail, mit Ihrer Freigabe oder Ihrem Feedback.\n\nSobald wir von Ihnen hören, machen wir weiter.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous avons besoin de votre approbation pour poursuivre avec {{project_name}}. Merci de consulter les dernières livrables de l''étape {{project_stage}} et de confirmer en répondant à cet e-mail avec votre accord ou vos commentaires.\n\nNous poursuivrons dès que nous aurons de vos nouvelles.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nnecesitamos tu aprobación para continuar con {{project_name}}. Revisa los últimos entregables de la fase {{project_stage}} y confirma respondiendo a este correo con tu aprobación o tus comentarios.\n\nContinuaremos en cuanto tengamos noticias tuyas.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic request for client approval on a project stage.', 'on_inbound_email', true, 19),

  ('inactive_follow_up', 'auto', 'lifecycle',
   '{"en": "Inactive Client Follow-Up", "de": "Follow-up bei Inaktivität", "fr": "Relance client inactif", "es": "Seguimiento de cliente inactivo"}'::jsonb,
   '{"en": "We have not heard from you — {{project_name}}", "de": "Wir haben lange nichts von Ihnen gehört — {{project_name}}", "fr": "Nous n''avons pas de nouvelles de vous — {{project_name}}", "es": "No hemos tenido noticias tuyas — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe have not heard from you regarding {{project_name}} for a while. We would love to continue where we left off.\n\nReply to this email or reach out to us if there is anything we can help with.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir haben schon länger nichts mehr von Ihnen zu {{project_name}} gehört. Wir würden gerne dort weitermachen, wo wir aufgehört haben.\n\nAntworten Sie auf diese E-Mail oder kontaktieren Sie uns, falls wir Ihnen bei irgendetwas helfen können.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous n''avons pas eu de nouvelles de vous concernant {{project_name}} depuis un certain temps. Nous serions ravis de reprendre là où nous nous sommes arrêtés.\n\nRépondez à cet e-mail ou contactez-nous si nous pouvons vous aider.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nhace tiempo que no tenemos noticias tuyas sobre {{project_name}}. Nos encantaría retomar el trabajo donde lo dejamos.\n\nResponde a este correo o contáctanos si podemos ayudarte en algo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic follow-up when a client has been inactive.', 'on_inbound_email', true, 20),

  ('email_received', 'auto', 'auto_reply',
   '{"en": "Email Received", "de": "E-Mail erhalten", "fr": "E-mail reçu", "es": "Correo recibido"}'::jsonb,
   '{"en": "Thank you for your message", "de": "Vielen Dank für Ihre Nachricht", "fr": "Merci pour votre message", "es": "Gracias por tu mensaje"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your message to Stratifit. We have received your enquiry and a team member will get back to you within 24 hours.\n\nIf you need anything in the meantime, reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihre Nachricht an Stratifit. Wir haben Ihre Anfrage erhalten und ein Teammitglied wird sich innerhalb von 24 Stunden bei Ihnen melden.\n\nSollten Sie in der Zwischenzeit Fragen haben, antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci pour votre message adressé à Stratifit. Nous avons bien reçu votre demande et un membre de l''équipe vous répondra sous 24 heures.\n\nEn attendant, répondez simplement à cet e-mail si vous avez besoin de quoi que ce soit.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por tu mensaje a Stratifit. Hemos recibido tu consulta y un miembro del equipo te responderá en un plazo de 24 horas.\n\nSi necesitas algo mientras tanto, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Fallback automatic reply for inbound email.', 'on_inbound_email', true, 21),

  ('file_upload', 'auto', 'auto_reply',
   '{"en": "File Upload", "de": "Datei-Upload", "fr": "Dépôt de fichier", "es": "Subida de archivo"}'::jsonb,
   '{"en": "We received your file — {{project_name}}", "de": "Wir haben Ihre Datei erhalten — {{project_name}}", "fr": "Nous avons reçu votre fichier — {{project_name}}", "es": "Hemos recibido tu archivo — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you — we have received your file for {{project_name}}. Our team will review it and get back to you shortly.\n\nReply to this email if anything was missing.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank — wir haben Ihre Datei für {{project_name}} erhalten. Unser Team wird sie prüfen und sich in Kürze bei Ihnen melden.\n\nFalls etwas gefehlt hat, antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci — nous avons bien reçu votre fichier pour {{project_name}}. Notre équipe l''examinera et reviendra vers vous rapidement.\n\nRépondez à cet e-mail si quelque chose manquait.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias: hemos recibido tu archivo para {{project_name}}. Nuestro equipo lo revisará y se pondrá en contacto contigo en breve.\n\nResponde a este correo si faltaba algo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic confirmation when a file is uploaded for a project.', 'on_inbound_email', true, 22),

  ('form_submission', 'auto', 'auto_reply',
   '{"en": "Form Submission", "de": "Formularabsendung", "fr": "Envoi de formulaire", "es": "Envío de formulario"}'::jsonb,
   '{"en": "We received your enquiry", "de": "Wir haben Ihre Anfrage erhalten", "fr": "Nous avons bien reçu votre demande", "es": "Hemos recibido tu consulta"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for contacting Stratifit through our website. We have received your enquiry and a specialist will be in touch within 24 hours.\n\nIf you have any questions in the meantime, reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank, dass Sie über unsere Website Kontakt zu Stratifit aufgenommen haben. Wir haben Ihre Anfrage erhalten und ein Spezialist wird sich innerhalb von 24 Stunden bei Ihnen melden.\n\nSollten Sie in der Zwischenzeit Fragen haben, antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci de nous avoir contactés via notre site web. Nous avons bien reçu votre demande et un spécialiste vous recontactera sous 24 heures.\n\nSi vous avez des questions entre-temps, répondez simplement à cet e-mail.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por ponerte en contacto con Stratifit a través de nuestro sitio web. Hemos recibido tu consulta y un especialista se pondrá en contacto contigo en un plazo de 24 horas.\n\nSi tienes alguna duda mientras tanto, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Automatic thank-you sent when a website form lead is received.', 'on_lead', true, 23)
on conflict (key) do nothing;

-- =============================================================================
-- 8. Seed: 16 manual templates
-- =============================================================================

insert into public.email_templates (key, template_type, category, name_translations, subject_translations, body_translations, description, trigger_event, is_enabled, display_order) values
  ('proposal', 'manual', 'custom',
   '{"en": "Proposal", "de": "Angebot", "fr": "Proposition", "es": "Propuesta"}'::jsonb,
   '{"en": "Your proposal from Stratifit", "de": "Ihr Angebot von Stratifit", "fr": "Votre proposition de Stratifit", "es": "Tu propuesta de Stratifit"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for the opportunity to prepare a proposal for {{project_name}}. Please find it attached.\n\nIt covers the scope, timeline, and investment for the {{section_name}} service. We are happy to walk you through it — reply to this email to schedule a call.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für die Gelegenheit, ein Angebot für {{project_name}} zu erstellen. Sie finden es im Anhang.\n\nEs umfasst Umfang, Zeitplan und Investition für den Service {{section_name}}. Wir erläutern es Ihnen gerne — antworten Sie auf diese E-Mail, um einen Termin zu vereinbaren.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci de nous avoir donné l''occasion de préparer une proposition pour {{project_name}}. Vous la trouverez en pièce jointe.\n\nElle couvre le périmètre, le calendrier et l''investissement pour le service {{section_name}}. Nous serons ravis de vous l''expliquer — répondez à cet e-mail pour planifier un appel.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por darnos la oportunidad de preparar una propuesta para {{project_name}}. La encontrarás adjunta.\n\nCubre el alcance, el calendario y la inversión para el servicio de {{section_name}}. Estaremos encantados de explicártela: responde a este correo para programar una llamada.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — send a proposal to a prospect.', 'manual', true, 24),

  ('contract', 'manual', 'custom',
   '{"en": "Contract", "de": "Vertrag", "fr": "Contrat", "es": "Contrato"}'::jsonb,
   '{"en": "Your contract with Stratifit", "de": "Ihr Vertrag mit Stratifit", "fr": "Votre contrat avec Stratifit", "es": "Tu contrato con Stratifit"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe are excited to move forward with {{project_name}}. Please find your contract attached.\n\nOnce it is signed, we will kick off the project and share the timeline. Reply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir freuen uns, mit {{project_name}} fortzufahren. Ihren Vertrag finden Sie im Anhang.\n\nSobald er unterzeichnet ist, starten wir das Projekt und teilen den Zeitplan. Bei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous sommes ravis de poursuivre avec {{project_name}}. Vous trouverez votre contrat en pièce jointe.\n\nUne fois signé, nous démarrerons le projet et partagerons le calendrier. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nestamos encantados de seguir adelante con {{project_name}}. Encontrarás tu contrato adjunto.\n\nUna vez firmado, pondremos en marcha el proyecto y compartiremos el calendario. Responde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — send a contract for signature.', 'manual', true, 25),

  ('onboarding', 'manual', 'lifecycle',
   '{"en": "Onboarding Welcome", "de": "Onboarding-Begrüßung", "fr": "Accueil d''intégration", "es": "Bienvenida de incorporación"}'::jsonb,
   '{"en": "Welcome to Stratifit, {{name}}", "de": "Willkommen bei Stratifit, {{name}}", "fr": "Bienvenue chez Stratifit, {{name}}", "es": "Bienvenido a Stratifit, {{name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWelcome to Stratifit! We are getting everything ready for {{project_name}}.\n\nOver the next days you will receive everything you need to get started, including access to your project workspace. Reply to this email if you have any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwillkommen bei Stratifit! Wir bereiten alles für {{project_name}} vor.\n\nIn den nächsten Tagen erhalten Sie alles, was Sie für den Start benötigen, einschließlich Zugang zu Ihrem Projektbereich. Bei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nbienvenue chez Stratifit ! Nous préparons tout pour {{project_name}}.\n\nDans les prochains jours, vous recevrez tout ce dont vous avez besoin pour démarrer, y compris l''accès à votre espace projet. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\n¡Bienvenido a Stratifit! Estamos preparando todo para {{project_name}}.\n\nEn los próximos días recibirás todo lo necesario para empezar, incluido el acceso a tu espacio de proyecto. Responde a este correo si tienes alguna duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — welcome and onboard a new client.', 'manual', true, 26),

  ('kickoff_meeting', 'manual', 'lifecycle',
   '{"en": "Kickoff Meeting", "de": "Kickoff-Meeting", "fr": "Réunion de lancement", "es": "Reunión de inicio"}'::jsonb,
   '{"en": "Welcome aboard — let''s get started, {{name}}", "de": "Willkommen an Bord — los geht''s, {{name}}", "fr": "Bienvenue à bord — c''est parti, {{name}}", "es": "¡Bienvenido a bordo! Empecemos, {{name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWelcome to Stratifit! We''re excited to start working on your project.\n\nHere''s what happens next:\n1. We schedule a kickoff call to align on goals.\n2. We share a project plan with milestones.\n3. We keep you updated at every step.\n\nIf you have any questions, just reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwillkommen bei Stratifit! Wir freuen uns, mit der Arbeit an Ihrem Projekt zu beginnen.\n\nSo geht es weiter:\n1. Wir vereinbaren einen Kickoff-Termin, um die Ziele abzustimmen.\n2. Wir teilen einen Projektplan mit Meilensteinen.\n3. Wir halten Sie bei jedem Schritt auf dem Laufenden.\n\nBei Fragen antworten Sie einfach auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nbienvenue chez Stratifit ! Nous sommes ravis de démarrer votre projet.\n\nVoici la suite :\n1. Nous planifions un appel de lancement pour aligner les objectifs.\n2. Nous partageons un plan de projet avec des jalons.\n3. Nous vous tenons informé à chaque étape.\n\nPour toute question, répondez simplement à cet e-mail.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\n¡Bienvenido a Stratifit! Estamos encantados de empezar a trabajar en tu proyecto.\n\nEsto es lo que viene después:\n1. Programamos una llamada de inicio para alinear los objetivos.\n2. Compartimos un plan de proyecto con hitos.\n3. Te mantenemos informado en cada paso.\n\nSi tienes alguna duda, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — schedule and prepare a project kickoff.', 'manual', true, 27),

  ('weekly_update', 'manual', 'lifecycle',
   '{"en": "Weekly Update", "de": "Wochenupdate", "fr": "Point hebdomadaire", "es": "Actualización semanal"}'::jsonb,
   '{"en": "Weekly update — {{project_name}}", "de": "Wochenupdate — {{project_name}}", "fr": "Point hebdomadaire — {{project_name}}", "es": "Actualización semanal — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nHere is your weekly update for {{project_name}}.\n\nThis week we advanced the {{project_stage}} stage and prepared the next steps. We are on track and will keep you posted.\n\nAs always, reply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nhier ist Ihr Wochenupdate zu {{project_name}}.\n\nDiese Woche haben wir die Phase {{project_stage}} vorangetrieben und die nächsten Schritte vorbereitet. Wir sind im Zeitplan und halten Sie auf dem Laufenden.\n\nBei Fragen antworten Sie wie immer auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nvoici votre point hebdomadaire pour {{project_name}}.\n\nCette semaine, nous avons fait progresser l''étape {{project_stage}} et préparé les prochaines étapes. Nous sommes dans les temps et vous tiendrons informé.\n\nComme toujours, répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\neste es tu resumen semanal de {{project_name}}.\n\nEsta semana hemos avanzado en la fase {{project_stage}} y preparado los siguientes pasos. Vamos según lo previsto y te mantendremos informado.\n\nComo siempre, responde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — regular progress update for an active client.', 'manual', true, 28),

  ('design_delivery', 'manual', 'lifecycle',
   '{"en": "Design Delivery", "de": "Design-Lieferung", "fr": "Livraison de designs", "es": "Entrega de diseños"}'::jsonb,
   '{"en": "Your designs are ready — {{project_name}}", "de": "Ihre Designs sind bereit — {{project_name}}", "fr": "Vos designs sont prêts — {{project_name}}", "es": "Tus diseños están listos — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThe designs for {{project_name}} are ready for your review.\n\nPlease take a look and share your feedback. We will apply your revisions and then move to the next stage.\n\nReply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ndie Designs für {{project_name}} sind bereit für Ihre Prüfung.\n\nBitte schauen Sie sie sich an und geben Sie uns Ihr Feedback. Wir setzen Ihre Änderungen um und gehen dann zur nächsten Phase über.\n\nBei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nles designs pour {{project_name}} sont prêts pour votre examen.\n\nMerci de les consulter et de nous faire part de vos retours. Nous appliquerons vos révisions puis passerons à l''étape suivante.\n\nRépondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nlos diseños de {{project_name}} están listos para que los revises.\n\nÉchales un vistazo y comparte tus comentarios. Aplicaremos tus revisiones y luego pasaremos a la siguiente fase.\n\nResponde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — deliver designs for client review.', 'manual', true, 29),

  ('development_update', 'manual', 'lifecycle',
   '{"en": "Development Update", "de": "Entwicklungs-Update", "fr": "Point développement", "es": "Actualización de desarrollo"}'::jsonb,
   '{"en": "Development update — {{project_name}}", "de": "Entwicklungs-Update — {{project_name}}", "fr": "Point développement — {{project_name}}", "es": "Actualización de desarrollo — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nHere is where we stand with {{project_name}}: the {{project_stage}} stage is underway and on track.\n\nThe team is making steady progress and we will share the next update soon.\n\nReply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nso steht es um {{project_name}}: Die Phase {{project_stage}} läuft und ist im Zeitplan.\n\nDas Team macht stetige Fortschritte und wir melden uns bald mit dem nächsten Update.\n\nBei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nvoici où en est {{project_name}} : l''étape {{project_stage}} est en cours et dans les temps.\n\nL''équipe progresse régulièrement et nous partagerons bientôt la prochaine mise à jour.\n\nRépondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nasí está {{project_name}}: la fase {{project_stage}} está en marcha y según lo previsto.\n\nEl equipo avanza con regularidad y pronto compartiremos la próxima actualización.\n\nResponde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — development progress update.', 'manual', true, 30),

  ('testing_phase', 'manual', 'lifecycle',
   '{"en": "Testing Phase", "de": "Testphase", "fr": "Phase de test", "es": "Fase de pruebas"}'::jsonb,
   '{"en": "Testing update — {{project_name}}", "de": "Test-Update — {{project_name}}", "fr": "Point tests — {{project_name}}", "es": "Actualización de pruebas — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nYour project {{project_name}} is now in the testing phase.\n\nOur team is checking functionality, performance, and quality. We will share the results and the next steps soon.\n\nReply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nIhr Projekt {{project_name}} befindet sich nun in der Testphase.\n\nUnser Team prüft Funktionalität, Leistung und Qualität. Wir teilen die Ergebnisse und die nächsten Schritte in Kürze mit.\n\nBei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nvotre projet {{project_name}} est maintenant en phase de test.\n\nNotre équipe vérifie la fonctionnalité, la performance et la qualité. Nous partagerons les résultats et les prochaines étapes très bientôt.\n\nRépondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ntu proyecto {{project_name}} está ahora en la fase de pruebas.\n\nNuestro equipo está comprobando funcionalidad, rendimiento y calidad. Compartiremos los resultados y los próximos pasos muy pronto.\n\nResponde a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — testing phase progress update.', 'manual', true, 31),

  ('launch_announcement', 'manual', 'lifecycle',
   '{"en": "Launch Announcement", "de": "Launch-Ankündigung", "fr": "Annonce de lancement", "es": "Anuncio de lanzamiento"}'::jsonb,
   '{"en": "{{project_name}} is live!", "de": "{{project_name}} ist live!", "fr": "{{project_name}} est en ligne !", "es": "¡{{project_name}} ya está en línea!"}'::jsonb,
   '{"en": "Hi {{name}},\n\nCongratulations — {{project_name}} is now live!\n\nWe are proud of what we built together and we hope you love it. If anything needs adjusting, reply to this email and we will take care of it.\n\nThank you for choosing Stratifit.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nHerzlichen Glückwunsch — {{project_name}} ist jetzt live!\n\nWir sind stolz auf das, was wir gemeinsam aufgebaut haben, und hoffen, dass es Ihnen gefällt. Sollte etwas angepasst werden müssen, antworten Sie auf diese E-Mail und wir kümmern uns darum.\n\nVielen Dank, dass Sie sich für Stratifit entschieden haben.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nFélicitations — {{project_name}} est maintenant en ligne !\n\nNous sommes fiers de ce que nous avons construit ensemble et nous espérons que cela vous plaît. Si quelque chose doit être ajusté, répondez à cet e-mail et nous nous en occupons.\n\nMerci d''avoir choisi Stratifit.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\n¡Felicidades! {{project_name}} ya está en línea.\n\nEstamos orgullosos de lo que hemos construido juntos y esperamos que te encante. Si necesitas ajustar algo, responde a este correo y nos encargaremos.\n\nGracias por elegir Stratifit.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — announce a successful launch.', 'manual', true, 32),

  ('invoice', 'manual', 'billing',
   '{"en": "Invoice", "de": "Rechnung", "fr": "Facture", "es": "Factura"}'::jsonb,
   '{"en": "Your invoice {{invoice_number}} is ready", "de": "Ihre Rechnung {{invoice_number}} ist bereit", "fr": "Votre facture {{invoice_number}} est disponible", "es": "Tu factura {{invoice_number}} está lista"}'::jsonb,
   '{"en": "Hi {{name}},\n\nYour invoice {{invoice_number}} for {{amount}} is now available. You can find the details attached, or reply to this email if you have any questions.\n\nThank you for working with Stratifit.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nIhre Rechnung {{invoice_number}} über {{amount}} ist jetzt verfügbar. Die Details finden Sie im Anhang, oder Sie antworten auf diese E-Mail, falls Sie Fragen haben.\n\nVielen Dank für die Zusammenarbeit mit Stratifit.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nvotre facture {{invoice_number}} d''un montant de {{amount}} est maintenant disponible. Vous trouverez les détails en pièce jointe, ou vous pouvez répondre à cet e-mail pour toute question.\n\nMerci de travailler avec Stratifit.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ntu factura {{invoice_number}} por importe de {{amount}} ya está disponible. Puedes encontrar los detalles adjuntos, o responder a este correo si tienes alguna duda.\n\nGracias por trabajar con Stratifit.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — send an invoice to a client.', 'manual', true, 33),

  ('payment_reminder', 'manual', 'billing',
   '{"en": "Payment Reminder", "de": "Zahlungserinnerung", "fr": "Rappel de paiement", "es": "Recordatorio de pago"}'::jsonb,
   '{"en": "Payment reminder — invoice {{invoice_number}}", "de": "Zahlungserinnerung — Rechnung {{invoice_number}}", "fr": "Rappel de paiement — facture {{invoice_number}}", "es": "Recordatorio de pago — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThis is a friendly reminder that payment of {{amount}} for invoice {{invoice_number}} is due on {{due_date}}.\n\nIf you have already paid, please ignore this message. Otherwise, you can reply to this email with any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\ndies ist eine freundliche Erinnerung, dass die Zahlung von {{amount}} für Rechnung {{invoice_number}} bis zum {{due_date}} fällig ist.\n\nFalls Sie bereits bezahlt haben, ignorieren Sie diese Nachricht bitte. Andernfalls können Sie auf diese E-Mail antworten, falls Sie Fragen haben.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nceci est un rappel amical : le paiement de {{amount}} pour la facture {{invoice_number}} est dû le {{due_date}}.\n\nSi vous avez déjà payé, veuillez ignorer ce message. Sinon, vous pouvez répondre à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\neste es un recordatorio amistoso de que el pago de {{amount}} de la factura {{invoice_number}} vence el {{due_date}}.\n\nSi ya has pagado, ignora este mensaje. De lo contrario, puedes responder a este correo con cualquier duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — friendly payment reminder.', 'manual', true, 34),

  ('payment_overdue_manual', 'manual', 'billing',
   '{"en": "Overdue Payment", "de": "Überfällige Zahlung", "fr": "Paiement en retard", "es": "Pago vencido"}'::jsonb,
   '{"en": "Friendly reminder — invoice {{invoice_number}}", "de": "Freundliche Erinnerung — Rechnung {{invoice_number}}", "fr": "Rappel amical — facture {{invoice_number}}", "es": "Recordatorio amistoso — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe would like to remind you that your payment of {{amount}} for invoice {{invoice_number}} was due on {{due_date}}.\n\nIf you have already paid, please ignore this message. Otherwise, we kindly ask you to arrange the payment at your earliest convenience.\n\nReply to this email if you have any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir möchten Sie daran erinnern, dass Ihre Zahlung von {{amount}} für Rechnung {{invoice_number}} am {{due_date}} fällig war.\n\nFalls Sie bereits bezahlt haben, ignorieren Sie diese Nachricht bitte. Andernfalls bitten wir Sie freundlich, die Zahlung zeitnah zu veranlassen.\n\nBei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous souhaitons vous rappeler que votre paiement de {{amount}} pour la facture {{invoice_number}} était dû le {{due_date}}.\n\nSi vous avez déjà payé, veuillez ignorer ce message. Sinon, nous vous prions de bien vouloir procéder au paiement dans les plus brefs délais.\n\nRépondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nnos gustaría recordarte que tu pago de {{amount}} por la factura {{invoice_number}} venció el {{due_date}}.\n\nSi ya has pagado, ignora este mensaje. De lo contrario, te agradecemos que realices el pago lo antes posible.\n\nResponde a este correo si tienes alguna duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — send a friendly overdue payment notice.', 'manual', true, 35),

  ('refund', 'manual', 'billing',
   '{"en": "Refund", "de": "Erstattung", "fr": "Remboursement", "es": "Reembolso"}'::jsonb,
   '{"en": "Refund confirmation — invoice {{invoice_number}}", "de": "Erstattungsbestätigung — Rechnung {{invoice_number}}", "fr": "Confirmation de remboursement — facture {{invoice_number}}", "es": "Confirmación de reembolso — factura {{invoice_number}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nWe have processed a refund of {{amount}} for invoice {{invoice_number}}.\n\nThe money should appear on your statement within a few business days.\n\nWe are sorry for any inconvenience. Reply to this email if you have any questions.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nwir haben eine Erstattung von {{amount}} für Rechnung {{invoice_number}} veranlasst.\n\nDas Geld sollte innerhalb weniger Werktage auf Ihrem Kontoauszug erscheinen.\n\nWir entschuldigen uns für etwaige Unannehmlichkeiten. Bei Fragen antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nnous avons procédé à un remboursement de {{amount}} pour la facture {{invoice_number}}.\n\nLe montant devrait apparaître sur votre relevé sous quelques jours ouvrés.\n\nNous sommes désolés pour la gêne occasionnée. Répondez à cet e-mail pour toute question.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\nhemos procesado un reembolso de {{amount}} por la factura {{invoice_number}}.\n\nEl importe debería aparecer en tu extracto en unos días hábiles.\n\nLamentamos las molestias. Responde a este correo si tienes alguna duda.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — confirm a refund to a client.', 'manual', true, 36),

  ('bug_report_response', 'manual', 'custom',
   '{"en": "Bug Report Response", "de": "Antwort auf Fehlermeldung", "fr": "Réponse à un bug", "es": "Respuesta a un informe de error"}'::jsonb,
   '{"en": "Re: your bug report — {{project_name}}", "de": "AW: Ihre Fehlermeldung — {{project_name}}", "fr": "Re : votre signalement de bug — {{project_name}}", "es": "Re: tu informe de error — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for reporting the issue with {{project_name}}: {{issue_description}}\n\nOur team is on it and will update you shortly. If anything is urgent, reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihre Fehlermeldung zu {{project_name}}: {{issue_description}}\n\nUnser Team ist dran und meldet sich in Kürze. Falls etwas eilig ist, antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci d''avoir signalé le problème avec {{project_name}} : {{issue_description}}\n\nNotre équipe s''en occupe et vous fera un point très bientôt. Si c''est urgent, répondez à cet e-mail.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por informar del problema con {{project_name}}: {{issue_description}}\n\nNuestro equipo está en ello y te informará en breve. Si es urgente, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — respond to a bug report.', 'manual', true, 37),

  ('feature_request_response', 'manual', 'custom',
   '{"en": "Feature Request Response", "de": "Antwort auf Feature-Anfrage", "fr": "Réponse à une demande de fonctionnalité", "es": "Respuesta a una solicitud de función"}'::jsonb,
   '{"en": "Re: your feature request — {{project_name}}", "de": "AW: Ihre Feature-Anfrage — {{project_name}}", "fr": "Re : votre demande de fonctionnalité — {{project_name}}", "es": "Re: tu solicitud de función — {{project_name}}"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for your feature request regarding {{project_name}}: {{issue_description}}\n\nWe have shared it with the team and will get back to you with a plan shortly.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank für Ihre Feature-Anfrage zu {{project_name}}: {{issue_description}}\n\nWir haben sie an das Team weitergeleitet und melden uns in Kürze mit einem Plan.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci pour votre demande de fonctionnalité concernant {{project_name}} : {{issue_description}}\n\nNous l''avons transmise à l''équipe et reviendrons vers vous avec un plan rapidement.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por tu solicitud de función sobre {{project_name}}: {{issue_description}}\n\nLa hemos enviado al equipo y te responderemos con un plan en breve.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — respond to a feature request.', 'manual', true, 38),

  ('support_response', 'manual', 'custom',
   '{"en": "General Support Response", "de": "Allgemeine Support-Antwort", "fr": "Réponse support générale", "es": "Respuesta de soporte general"}'::jsonb,
   '{"en": "Re: your support request", "de": "AW: Ihre Support-Anfrage", "fr": "Re : votre demande d''assistance", "es": "Re: tu solicitud de soporte"}'::jsonb,
   '{"en": "Hi {{name}},\n\nThank you for contacting our support team.\n\nRegarding your request: {{issue_description}}\n\nWe are on it and will update you shortly. If anything is urgent, reply to this email.\n\nBest regards,\nThe Stratifit Team",
     "de": "Hallo {{name}},\n\nvielen Dank, dass Sie sich an unser Support-Team gewendet haben.\n\nZu Ihrer Anfrage: {{issue_description}}\n\nWir sind dran und melden uns in Kürze. Falls etwas eilig ist, antworten Sie auf diese E-Mail.\n\nMit freundlichen Grüßen\nIhr Stratifit-Team",
     "fr": "Bonjour {{name}},\n\nmerci d''avoir contacté notre équipe d''assistance.\n\nConcernant votre demande : {{issue_description}}\n\nNous nous en occupons et vous ferons un point très bientôt. Si c''est urgent, répondez à cet e-mail.\n\nCordialement,\nL''équipe Stratifit",
     "es": "Hola {{name}},\n\ngracias por ponerte en contacto con nuestro equipo de soporte.\n\nSobre tu solicitud: {{issue_description}}\n\nEstamos en ello y te informaremos en breve. Si es urgente, responde a este correo.\n\nUn saludo,\nEl equipo de Stratifit"}'::jsonb,
   'Manual template — respond to a general support request.', 'manual', true, 39)
on conflict (key) do nothing;

-- =============================================================================
-- 9. Seed: automation triggers (event → template)
-- =============================================================================

insert into public.automation_triggers (event_type, template_key, enabled, display_order) values
  ('lead_created',       'form_submission',    true, 1),
  ('inbound_email',      'email_received',     true, 2),
  ('project_started',    'project_start',      true, 3),
  ('milestone_reached',  'milestone_reached',  true, 4),
  ('project_delayed',    'delay_notification', true, 5),
  ('problem_detected',   'problem_detected',   true, 6),
  ('revision_requested', 'revision_requested', true, 7),
  ('project_completed',  'project_completed',  true, 8),
  ('invoice_sent',       'invoice_sent',       true, 9),
  ('payment_received',   'payment_received',   true, 10),
  ('payment_failed',     'payment_failed',     true, 11),
  ('payment_upcoming',   'payment_upcoming',   true, 12),
  ('payment_overdue',    'payment_overdue',    true, 13),
  ('meeting_scheduled',  'meeting_reminder',   true, 14),
  ('document_needed',    'document_needed',    true, 15),
  ('approval_needed',    'approval_needed',    true, 16),
  ('inactive_client',    'inactive_follow_up', true, 17),
  ('file_uploaded',      'file_upload',        true, 18),
  ('form_submitted',     'form_submission',    true, 19)
on conflict (event_type) do nothing;

-- =============================================================================
-- 10. Re-link default sections to their auto-reply templates
-- =============================================================================

update public.email_inbox_sections s
set auto_reply_template_id = t.id
from public.email_templates t
where t.key = case s.slug
  when 'contact' then 'new_inquiry'
  when 'brand-design' then 'service_request'
  when 'website-development' then 'service_request'
  when 'ai-automation' then 'service_request'
  when 'acquisition' then 'quote_request'
  when 'support' then 'support'
  when 'other' then 'email_received'
  else null
end
and t.key is not null;

-- =============================================================================
-- Rollback
-- =============================================================================
-- drop table if exists public.automation_triggers cascade;
-- drop table if exists public.email_schedules cascade;
-- drop table if exists public.email_logs cascade;
-- drop table if exists public.email_templates cascade;
-- (recreate from migration 00061/00065 to restore the Resend-era tables)
