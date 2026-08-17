-- Fix FAQ rows that were saved with English-only content and leftover test
-- markers ("1234" / "12345"). Restore complete 4-language translations so the
-- FAQ section renders in the visitor's language instead of falling back to
-- English. Matched by English question text so it also fixes already-live
-- databases; it is a no-op where the rows do not exist.

UPDATE public.faqs
SET question_translations = '{"en":"What is the typical timeline for a branding project?","de":"Wie lange dauert ein typisches Branding-Projekt?","fr":"Quel est le délai typique d''un projet de branding ?","es":"¿Cuál es el plazo típico de un proyecto de branding?"}'::jsonb,
    answer_translations   = '{"en":"A standard branding project spans 4-6 weeks from discovery to final delivery. Timelines are tailored to scope - brand strategy and identity rollouts may extend to 8 weeks.","de":"Ein Standard-Branding-Projekt dauert 4–6 Wochen von der Discovery bis zur finalen Auslieferung. Die Zeitpläne werden an den Umfang angepasst – Markenstrategie- und Identitäts-Rollouts können sich auf 8 Wochen verlängern.","fr":"Un projet de branding standard s''étend sur 4 à 6 semaines, de la découverte à la livraison finale. Les délais sont adaptés au périmètre – les déploiements de stratégie de marque et d''identité peuvent aller jusqu''à 8 semaines.","es":"Un proyecto de branding estándar dura de 4 a 6 semanas, desde el descubrimiento hasta la entrega final. Los plazos se adaptan al alcance: los despliegues de estrategia e identidad de marca pueden extenderse hasta 8 semanas."}'::jsonb
WHERE question_translations->>'en' LIKE 'What is the typical timeline for a branding project%';

UPDATE public.faqs
SET question_translations = '{"en":"Do you offer post-launch support?","de":"Bieten Sie Support nach dem Launch an?","fr":"Proposez-vous un support après le lancement ?","es":"¿Ofrecen soporte después del lanzamiento?"}'::jsonb,
    answer_translations   = '{"en":"Yes. Every engagement includes a post-launch support window, and ongoing care plans are available to keep your systems optimized and updated.","de":"Ja. Jedes Projekt umfasst ein Support-Fenster nach dem Launch, und laufende Pflegepläne halten Ihre Systeme optimiert und aktuell.","fr":"Oui. Chaque mission inclut une période de support après le lancement, et des plans de maintenance continue sont disponibles pour garder vos systèmes optimisés et à jour.","es":"Sí. Cada proyecto incluye una ventana de soporte posterior al lanzamiento, y hay planes de mantenimiento continuo disponibles para mantener sus sistemas optimizados y actualizados."}'::jsonb
WHERE question_translations->>'en' LIKE 'Do you offer post-launch support%';
