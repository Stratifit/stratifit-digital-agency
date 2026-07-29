-- ============================================================================
-- Stratifit — Announcement Slides Seed
-- 3 slides with full multilingual messages (en, fr, de, es).
-- ============================================================================

insert into announcement_slides (display_order, sticky, url, message_translations) values
(0, false, '/announcement/launch',
  jsonb_build_object(
    'en', '🚀 We just launched our new platform! Check it out.',
    'fr', '🚀 Nous venons de lancer notre nouvelle plateforme ! Découvrez-la.',
    'de', '🚀 Wir haben gerade unsere neue Plattform gestartet! Schauen Sie vorbei.',
    'es', '🚀 ¡Acabamos de lanzar nuestra nueva plataforma! Échale un vistazo.'
  )
),
(1, false, '/announcement/webinar',
  jsonb_build_object(
    'en', '📅 Join our free webinar on digital transformation — March 15th.',
    'fr', '📅 Participez à notre webinaire gratuit sur la transformation numérique — 15 mars.',
    'de', '📅 Nehmen Sie an unserem kostenlosen Webinar zur digitalen Transformation teil — 15. März.',
    'es', '📅 Únase a nuestro seminario web gratuito sobre transformación digital — 15 de marzo.'
  )
),
(2, false, '/announcement/hiring',
  jsonb_build_object(
    'en', '💼 We are hiring! Join the Stratifit team.',
    'fr', '💼 Nous recrutons ! Rejoignez l''équipe Stratifit.',
    'de', '💼 Wir stellen ein! Werden Sie Teil des Stratifit-Teams.',
    'es', '💼 ¡Estamos contratando! Únete al equipo de Stratifit.'
  )
);
