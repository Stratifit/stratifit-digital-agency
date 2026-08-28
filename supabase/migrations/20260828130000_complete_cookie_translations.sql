-- Complete multilingual cookie consent copy for all supported public locales.
update public.cookie_settings
set
  banner_title_translations = jsonb_build_object(
    'en', 'Cookie Preferences',
    'de', 'Cookie-Einstellungen',
    'fr', 'Préférences de cookies',
    'es', 'Preferencias de cookies'
  ),
  banner_text_translations = jsonb_build_object(
    'en', 'We use cookies to improve your browsing experience and understand site usage.',
    'de', 'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern und die Nutzung der Website zu verstehen.',
    'fr', 'Nous utilisons des cookies pour améliorer votre expérience de navigation et comprendre l’utilisation du site.',
    'es', 'Usamos cookies para mejorar su experiencia de navegación y comprender el uso del sitio.'
  ),
  accept_all_label_translations = jsonb_build_object(
    'en', 'Accept All', 'de', 'Alle akzeptieren', 'fr', 'Tout accepter', 'es', 'Aceptar todo'
  ),
  essential_only_label_translations = jsonb_build_object(
    'en', 'Essential Only', 'de', 'Nur erforderliche', 'fr', 'Nécessaires uniquement', 'es', 'Solo esenciales'
  ),
  settings_label_translations = jsonb_build_object(
    'en', 'Settings', 'de', 'Einstellungen', 'fr', 'Paramètres', 'es', 'Configuración'
  ),
  save_preferences_label_translations = jsonb_build_object(
    'en', 'Save Preferences', 'de', 'Einstellungen speichern', 'fr', 'Enregistrer les préférences', 'es', 'Guardar preferencias'
  ),
  categories = jsonb_build_array(
    jsonb_build_object(
      'key', 'essential', 'essential', true, 'enabled', true,
      'name_translations', jsonb_build_object('en', 'Essential cookies', 'de', 'Erforderliche Cookies', 'fr', 'Cookies nécessaires', 'es', 'Cookies esenciales'),
      'description_translations', jsonb_build_object('en', 'Required for the website to function.', 'de', 'Für die Funktion der Website erforderlich.', 'fr', 'Nécessaires au fonctionnement du site.', 'es', 'Necesarias para que el sitio funcione.')
    ),
    jsonb_build_object(
      'key', 'analytics', 'essential', false, 'enabled', true,
      'name_translations', jsonb_build_object('en', 'Analytics cookies', 'de', 'Analyse-Cookies', 'fr', 'Cookies analytiques', 'es', 'Cookies analíticas'),
      'description_translations', jsonb_build_object('en', 'Help us understand anonymous site usage.', 'de', 'Helfen uns, die anonyme Nutzung der Website zu verstehen.', 'fr', 'Nous aident à comprendre l’utilisation anonyme du site.', 'es', 'Nos ayudan a comprender el uso anónimo del sitio.')
    ),
    jsonb_build_object(
      'key', 'marketing', 'essential', false, 'enabled', false,
      'name_translations', jsonb_build_object('en', 'Marketing cookies', 'de', 'Marketing-Cookies', 'fr', 'Cookies marketing', 'es', 'Cookies de marketing'),
      'description_translations', jsonb_build_object('en', 'Used for relevant advertising when enabled.', 'de', 'Bei Aktivierung für relevante Werbung verwendet.', 'fr', 'Utilisés pour des publicités pertinentes lorsqu’ils sont activés.', 'es', 'Se usan para publicidad relevante cuando están activadas.')
    )
  ),
  updated_at = now()
where singleton_key = true;
