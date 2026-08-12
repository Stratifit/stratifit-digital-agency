-- Migration: 00053_enable_faq_bot_settings
-- Description: Enable the standalone FAQ section bot and populate its
--              multilingual welcome message, suggested questions, fallback,
--              and allowed knowledge categories. Touches only the faq_bot_*
--              fields (added by 00052); the AI FAQ panel fields are left
--              untouched. Mirrors the seed content so hosted and local
--              databases stay identical.
-- Stratifit Digital Agency Platform

INSERT INTO public.ai_faq_settings (singleton_key, faq_bot_enabled, welcome_message_translations, suggested_question_translations, faq_bot_fallback_translations, faq_bot_allowed_categories)
VALUES (
  true,
  true,
  '{"en": "👋 Hi! I am the Stratifit FAQ assistant. Ask me anything about our services, pricing, process, or projects.", "de": "👋 Hallo! Ich bin der Stratifit-FAQ-Assistent. Fragen Sie mich alles zu unseren Leistungen, Preisen, Prozessen oder Projekten.", "fr": "👋 Bonjour ! Je suis l''assistant FAQ Stratifit. Posez-moi toutes vos questions sur nos services, tarifs, processus ou projets.", "es": "👋 ¡Hola! Soy el asistente de preguntas frecuentes de Stratifit. Pregúntame cualquier cosa sobre nuestros servicios, precios, procesos o proyectos."}'::jsonb,
  '[
    {"en": "What services do you offer?", "de": "Welche Leistungen bieten Sie an?", "fr": "Quels services proposez-vous ?", "es": "¿Qué servicios ofrecen?"},
    {"en": "How much does a website cost?", "de": "Was kostet eine Website?", "fr": "Combien coûte un site web ?", "es": "¿Cuánto cuesta un sitio web?"},
    {"en": "How long does a project take?", "de": "Wie lange dauert ein Projekt?", "fr": "Combien de temps prend un projet ?", "es": "¿Cuánto tarda un proyecto?"},
    {"en": "Do you work internationally?", "de": "Arbeiten Sie international?", "fr": "Travaillez-vous à l''international ?", "es": "¿Trabajan internacionalmente?"},
    {"en": "What is your process?", "de": "Wie läuft Ihr Prozess ab?", "fr": "Quel est votre processus ?", "es": "¿Cuál es su proceso?"}
  ]'::jsonb,
  '{"en": "I could not find an answer to that. A team member has been notified and will help you shortly.", "de": "Dafür habe ich keine Antwort gefunden. Ein Teammitglied wurde benachrichtigt und hilft Ihnen gleich weiter.", "fr": "Je n''ai pas trouvé de réponse à cela. Un membre de l''équipe a été prévenu et vous aidera bientôt.", "es": "No encontré una respuesta para eso. Se ha notificado a un miembro del equipo y le ayudará pronto."}'::jsonb,
  ARRAY['general', 'services', 'pricing', 'process']
)
ON CONFLICT (singleton_key) DO UPDATE SET
  faq_bot_enabled = EXCLUDED.faq_bot_enabled,
  welcome_message_translations = EXCLUDED.welcome_message_translations,
  suggested_question_translations = EXCLUDED.suggested_question_translations,
  faq_bot_fallback_translations = EXCLUDED.faq_bot_fallback_translations,
  faq_bot_allowed_categories = EXCLUDED.faq_bot_allowed_categories;

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.ai_faq_settings
--   SET faq_bot_enabled = false,
--       welcome_message_translations = '{}'::jsonb,
--       suggested_question_translations = '[]'::jsonb,
--       faq_bot_fallback_translations = '{}'::jsonb,
--       faq_bot_allowed_categories = ARRAY['general']
-- WHERE singleton_key = true;
