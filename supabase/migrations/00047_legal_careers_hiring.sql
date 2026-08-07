-- Migration: 00047_legal_careers_hiring
-- Description: Add the 'hiring' detail page (We're Hiring) in all four
--              languages, and link Imprint + Hiring in the footer.
--              The other detail pages (privacy, terms, cookie-policy,
--              imprint, careers) are seeded by migration 00040; their rich
--              card-style content is also mirrored as frontend fallbacks.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Hiring detail page
-- =============================================================================

INSERT INTO public.detail_pages (slug, eyebrow_translations, title_translations, description_translations, subtitle_translations, content_translations, is_visible)
VALUES
  ('hiring',
   '{"en": "Careers", "de": "Karriere", "fr": "Carrières", "es": "Carreras"}'::jsonb,
   '{"en": "We''re Hiring", "de": "Wir stellen ein", "fr": "Nous recrutons", "es": "Estamos contratando"}'::jsonb,
   '{"en": "We''re always looking for exceptional people to join our team. Here''s how we hire and how to apply.", "de": "Wir suchen immer nach außergewöhnlichen Menschen, die unser Team verstärken. So stellen wir ein und so bewerben Sie sich.", "fr": "Nous sommes toujours à la recherche de personnes exceptionnelles pour rejoindre notre équipe. Voici comment nous recrutons et comment postuler.", "es": "Siempre buscamos personas excepcionales para unirse a nuestro equipo. Así contratamos y así puedes postularte."}'::jsonb,
   '{"en": "Open roles & hiring process", "de": "Offene Rollen & Einstellungsprozess", "fr": "Postes ouverts et processus de recrutement", "es": "Roles abiertos y proceso de contratación"}'::jsonb,
   '[
     {"type": "heading", "icon": "file-text", "text_translations": {"en": "We''re Hiring", "de": "Wir stellen ein", "fr": "Nous recrutons", "es": "Estamos contratando"}},
     {"type": "paragraph", "text_translations": {"en": "We grow one role at a time and only hire people we would be proud to work alongside. If you care deeply about your craft — strategy, design, engineering, or growth — we want to hear from you.", "de": "Wir bauen unser Team Rolle für Rolle auf und stellen nur Menschen ein, mit denen wir gerne zusammenarbeiten. Wenn Ihnen Ihr Handwerk wichtig ist – Strategie, Design, Engineering oder Growth – möchten wir von Ihnen hören.", "fr": "Nous grandissons un poste à la fois et n''embauchons que des personnes avec lesquelles nous serions fiers de travailler. Si votre métier vous passionne — stratégie, design, ingénierie ou croissance — nous voulons vous connaître.", "es": "Crecemos un rol a la vez y solo contratamos personas con las que nos enorgullecería trabajar. Si te apasiona tu oficio —estrategia, diseño, ingeniería o crecimiento— queremos saber de ti."}},
     {"type": "heading", "icon": "eye", "text_translations": {"en": "What We Look For", "de": "Was wir suchen", "fr": "Ce que nous recherchons", "es": "Qué buscamos"}},
     {"type": "list", "items": [
       {"text_translations": {"en": "Obsession with craft and attention to detail", "de": "Leidenschaft für Handwerkskunst und Liebe zum Detail", "fr": "Obsession du métier et souci du détail", "es": "Obsesión por el oficio y atención al detalle"}},
       {"text_translations": {"en": "Ownership, autonomy, and sound judgment", "de": "Eigenverantwortung, Selbstständigkeit und Urteilsvermögen", "fr": "Responsabilité, autonomie et bon jugement", "es": "Responsabilidad, autonomía y buen criterio"}},
       {"text_translations": {"en": "Clear, honest, and direct communication", "de": "Klare, ehrliche und direkte Kommunikation", "fr": "Communication claire, honnête et directe", "es": "Comunicación clara, honesta y directa"}},
       {"text_translations": {"en": "Curiosity and a commitment to continuous learning", "de": "Neugier und der Wille zu kontinuierlichem Lernen", "fr": "Curiosité et engagement envers l''apprentissage continu", "es": "Curiosidad y compromiso con el aprendizaje continuo"}}
     ]},
     {"type": "heading", "icon": "clipboard-check", "text_translations": {"en": "Our Hiring Process", "de": "Unser Einstellungsprozess", "fr": "Notre processus de recrutement", "es": "Nuestro proceso de contratación"}},
     {"type": "list", "items": [
       {"text_translations": {"en": "Apply — send your portfolio or CV through the contact page or by email", "de": "Bewerbung – senden Sie Ihr Portfolio oder Ihren Lebenslauf über die Kontaktseite oder per E-Mail", "fr": "Postulez — envoyez votre portfolio ou CV via la page contact ou par e-mail", "es": "Postúlate: envía tu portafolio o CV a través de la página de contacto o por correo"}},
       {"text_translations": {"en": "Intro call — a short conversation about your experience and goals", "de": "Erstgespräch – ein kurzes Gespräch über Ihre Erfahrung und Ziele", "fr": "Entretien découverte — une brève conversation sur votre expérience et vos objectifs", "es": "Llamada inicial: una breve conversación sobre tu experiencia y objetivos"}},
       {"text_translations": {"en": "Deep dive — a portfolio or technical review with the team", "de": "Fachgespräch – Portfolio- oder technische Überprüfung mit dem Team", "fr": "Entretien approfondi — revue de portfolio ou technique avec l''équipe", "es": "Análisis profundo: revisión de portafolio o técnica con el equipo"}},
       {"text_translations": {"en": "Team interview — meet the people you would work with", "de": "Team-Interview – lernen Sie die Menschen kennen, mit denen Sie arbeiten würden", "fr": "Entretien d''équipe — rencontrez les personnes avec lesquelles vous travailleriez", "es": "Entrevista de equipo: conoce a las personas con las que trabajarías"}},
       {"text_translations": {"en": "Offer — a fair, transparent offer with clear next steps", "de": "Angebot – ein faires, transparentes Angebot mit klaren nächsten Schritten", "fr": "Offre — une offre juste et transparente avec des prochaines étapes claires", "es": "Oferta: una oferta justa y transparente con próximos pasos claros"}}
     ]},
     {"type": "heading", "icon": "shield-check", "text_translations": {"en": "What We Offer", "de": "Was wir bieten", "fr": "Ce que nous offrons", "es": "Qué ofrecemos"}},
     {"type": "list", "items": [
       {"text_translations": {"en": "Remote-first culture with flexible working hours", "de": "Remote-first-Kultur mit flexiblen Arbeitszeiten", "fr": "Culture remote-first avec horaires flexibles", "es": "Cultura remota con horarios flexibles"}},
       {"text_translations": {"en": "Modern tools and a personal learning budget", "de": "Moderne Tools und ein persönliches Lernbudget", "fr": "Outils modernes et budget d''apprentissage personnel", "es": "Herramientas modernas y presupuesto personal de aprendizaje"}},
       {"text_translations": {"en": "Premium client projects with real strategic impact", "de": "Premium-Kundenprojekte mit echter strategischer Wirkung", "fr": "Projets clients premium avec un réel impact stratégique", "es": "Proyectos premium de clientes con impacto estratégico real"}},
       {"text_translations": {"en": "Direct collaboration with leadership and zero bureaucracy", "de": "Direkte Zusammenarbeit mit der Führungsebene und null Bürokratie", "fr": "Collaboration directe avec la direction et zéro bureaucratie", "es": "Colaboración directa con el liderazgo y cero burocracia"}}
     ]},
     {"type": "heading", "icon": "globe", "text_translations": {"en": "Open Roles", "de": "Offene Rollen", "fr": "Postes ouverts", "es": "Roles abiertos"}},
     {"type": "list", "items": [
       {"text_translations": {"en": "Senior Brand Designer", "de": "Senior Brand Designer", "fr": "Senior Brand Designer", "es": "Senior Brand Designer"}},
       {"text_translations": {"en": "Frontend Engineer (React / Next.js)", "de": "Frontend-Entwickler (React / Next.js)", "fr": "Ingénieur frontend (React / Next.js)", "es": "Ingeniero frontend (React / Next.js)"}},
       {"text_translations": {"en": "AI & Automation Specialist", "de": "KI- & Automatisierungs-Spezialist", "fr": "Spécialiste IA et automatisation", "es": "Especialista en IA y automatización"}},
       {"text_translations": {"en": "Growth Marketer", "de": "Growth-Marketer", "fr": "Marketeur croissance", "es": "Especialista en growth marketing"}}
     ]},
     {"type": "heading", "icon": "settings", "text_translations": {"en": "How to Apply", "de": "So bewerben Sie sich", "fr": "Comment postuler", "es": "Cómo postularse"}},
     {"type": "paragraph", "text_translations": {"en": "Send your portfolio and CV to [careers@stratifit.com](mailto:careers@stratifit.com) or through the [contact page](/contact). We reply to every application within a few days.", "de": "Senden Sie Ihr Portfolio und Ihren Lebenslauf an [careers@stratifit.com](mailto:careers@stratifit.com) oder über die [Kontaktseite](/contact). Wir antworten auf jede Bewerbung innerhalb weniger Tage.", "fr": "Envoyez votre portfolio et votre CV à [careers@stratifit.com](mailto:careers@stratifit.com) ou via la [page contact](/contact). Nous répondons à chaque candidature sous quelques jours.", "es": "Envía tu portafolio y CV a [careers@stratifit.com](mailto:careers@stratifit.com) o a través de la [página de contacto](/contact). Respondemos a cada solicitud en unos días."}}
   ]'::jsonb,
   true)
ON CONFLICT (slug) DO UPDATE SET
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  description_translations = EXCLUDED.description_translations,
  subtitle_translations = EXCLUDED.subtitle_translations,
  content_translations = EXCLUDED.content_translations,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Footer links: Imprint (Legal group) + Hiring (Company group)
-- =============================================================================

INSERT INTO public.footer_links (id, group_id, label_translations, href, is_external, display_order, is_visible)
VALUES
  ('30000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000003', '{"en": "Imprint", "de": "Impressum", "fr": "Mentions légales", "es": "Aviso legal"}'::jsonb, '/imprint', false, 4, true),
  ('30000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000002', '{"en": "Hiring", "de": "Karriere bei uns", "fr": "Recrutement", "es": "Contratación"}'::jsonb, '/hiring', false, 5, true)
ON CONFLICT (id) DO UPDATE SET
  group_id = EXCLUDED.group_id,
  label_translations = EXCLUDED.label_translations,
  href = EXCLUDED.href,
  is_external = EXCLUDED.is_external,
  display_order = EXCLUDED.display_order,
  is_visible = EXCLUDED.is_visible;

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DELETE FROM public.detail_pages WHERE slug = 'hiring';
-- DELETE FROM public.footer_links
--   WHERE id IN ('30000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000014');
