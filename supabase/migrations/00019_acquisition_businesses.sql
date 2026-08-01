-- Migration: 00019_acquisition_businesses
-- Description: Marketplace-style businesses JSONB for the Buy a Business section,
--              plus the acquisition section heading in section_settings.
-- Stratifit Digital Agency Platform

ALTER TABLE public.acquisition_section ADD COLUMN IF NOT EXISTS businesses jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.acquisition_section
SET businesses = '[{"slug": "luxe-pet-co", "name": "Luxe Pet Co.", "domain": "luxepetco.com", "emoji": "🐾", "category": "ecommerce", "tagline": "Premium pet accessories brand with 14 SKUs, 23K Instagram followers, and 4,200 email subscribers.", "tags": ["Pet", "Shopify", "DTC"], "accent": "#D4A574", "price": "$45,000", "url": "https://luxepetco.com", "action_label": "Shop Now", "trust": ["Verified Financials", "Secure Escrow", "30-Day Support"], "tiles": ["🛍️", "📦", "🏷️"]}, {"slug": "nomad-home", "name": "Nomad Home", "domain": "nomadhome.co", "emoji": "🏠", "category": "ecommerce", "tagline": "Scandinavian-inspired home decor brand with 32 SKUs, strong Pinterest presence, and wholesale accounts.", "tags": ["Home Decor", "Shopify", "Wholesale"], "accent": "#A8D8EA", "price": "$68,000", "url": "https://nomadhome.co", "action_label": "Shop Now", "trust": ["Verified Financials", "Secure Escrow", "30-Day Support"], "tiles": ["🛍️", "📦", "🏷️"]}, {"slug": "reviewpilot", "name": "ReviewPilot", "domain": "reviewpilot.io", "emoji": "⭐", "category": "saas", "tagline": "Automated review management platform serving 280+ Shopify merchants with 94% gross margins and less than 2% monthly churn.", "tags": ["Martech", "Shopify App", "B2B"], "accent": "#FFD93D", "price": "$160,000", "url": "https://reviewpilot.io", "action_label": "Get Started", "trust": ["Code Audit Ready", "Secure Escrow", "60-Day Support"], "tiles": ["📊", "⚙️", "🔌"]}, {"slug": "teamflow", "name": "TeamFlow", "domain": "teamflow.app", "emoji": "🔄", "category": "saas", "tagline": "Project management SaaS for creative agencies with 180+ teams, strong NPS of 72, and growing enterprise pipeline.", "tags": ["Project Mgmt", "B2B", "Enterprise"], "accent": "#6C5CE7", "price": "$210,000", "url": "https://teamflow.app", "action_label": "Get Started", "trust": ["Code Audit Ready", "Secure Escrow", "60-Day Support"], "tiles": ["📊", "⚙️", "🔌"]}, {"slug": "digital-hive-studio", "name": "Digital Hive Studio", "domain": "digitalhive.studio", "emoji": "🐝", "category": "agency", "tagline": "Full-service digital agency specializing in ecommerce brands. 12 retainer clients, 7 team members, and $370K ARR.", "tags": ["Ecommerce", "Full-Service", "12 Clients"], "accent": "#F8B500", "price": "$180,000", "url": "https://digitalhive.studio", "action_label": "View Services", "trust": ["Contracts Verified", "Secure Escrow", "90-Day Support"], "tiles": ["🎨", "📈", "💼"]}, {"slug": "seo-directive", "name": "SEO Directive", "domain": "seodirective.com", "emoji": "🔍", "category": "agency", "tagline": "Boutique SEO agency with 18 retainer clients in the B2B SaaS space. Strong systems, minimal owner involvement needed.", "tags": ["SEO", "B2B SaaS", "Remote"], "accent": "#E17055", "price": "$95,000", "url": "https://seodirective.com", "action_label": "View Services", "trust": ["Contracts Verified", "Secure Escrow", "90-Day Support"], "tiles": ["🎨", "📈", "💼"]}, {"slug": "contentforge-ai", "name": "ContentForge AI", "domain": "contentforge.ai", "emoji": "✍️", "category": "ai-tools", "tagline": "AI content creation platform serving 3,200+ marketers. Multi-model pipeline, custom fine-tuned models, strong organic growth.", "tags": ["Content Gen", "B2B", "Subscription"], "accent": "#E84393", "price": "$220,000", "url": "https://contentforge.ai", "action_label": "Try Demo", "trust": ["Model Verified", "Secure Escrow", "45-Day Support"], "tiles": ["🤖", "🧠", "✨"]}, {"slug": "the-design-thinker", "name": "The Design Thinker", "domain": "thedesignthinker.co", "emoji": "🎯", "category": "personal-brand", "tagline": "Design and creativity newsletter with 42K subscribers, a $49K course business, and 3-4 brand sponsorships monthly.", "tags": ["Design", "Newsletter", "Courses"], "accent": "#FF6348", "price": "$95,000", "url": "https://thedesignthinker.co", "action_label": "Explore", "trust": ["Audience Verified", "Secure Escrow", "60-Day Support"], "tiles": ["📱", "🎙️", "📧"]}, {"slug": "brew-bean-coffee", "name": "Brew & Bean Coffee", "domain": "brewbean.coffee", "emoji": "☕", "category": "local-business", "tagline": "Popular specialty coffee shop in a high-foot-traffic downtown location. 4.9★ (340+ reviews), loyal regulars, and strong catering side business.", "tags": ["Coffee Shop", "Food & Beverage", "High Traffic"], "accent": "#C0392B", "price": "$195,000", "url": "https://brewbean.coffee", "action_label": "Visit Us", "trust": ["Physical Assets Verified", "Secure Escrow", "90-Day Support"], "tiles": ["📍", "⭐", "🏪"]}, {"slug": "ui-kit-pro", "name": "UI Kit Pro", "domain": "uikitpro.design", "emoji": "🎨", "category": "digital-products", "tagline": "Premium Figma UI kit with 2,400+ components, 18K customers, and a 4.9★ rating. Steady organic sales via design communities.", "tags": ["Figma", "Design", "Marketplace"], "accent": "#74B9FF", "price": "$85,000", "url": "https://uikitpro.design", "action_label": "Browse", "trust": ["Files Verified", "Secure Escrow", "30-Day Support"], "tiles": ["📁", "🖥️", "📥"]}]'::jsonb
WHERE singleton_key = true;

ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','final-cta','trusted-by','acquisition'));

INSERT INTO public.section_settings (section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, is_visible, display_order)
VALUES (
  'acquisition',
  'Acquisition',
  '{"en": "Acquisition", "de": "Akquisition", "fr": "Acquisition", "es": "Adquisición"}'::jsonb,
  '{"en": "Buy a", "de": "Kaufen Sie ein", "fr": "Achetez une", "es": "Compre un"}'::jsonb,
  '{"en": "Business", "de": "Unternehmen", "fr": "entreprise", "es": "negocio"}'::jsonb,
  '{"en": "Skip the startup grind. Browse turnkey businesses with real revenue, existing customers, and systems already in place.", "de": "Überspringen Sie den Startup-Marathon. Stöbern Sie durch schlüsselfertige Unternehmen mit echten Einnahmen, bestehenden Kunden und vorhandenen Systemen.", "fr": "Sautez l''étape startup. Parcourez des entreprises clés en main avec un vrai chiffre d''affaires, des clients existants et des systèmes déjà en place.", "es": "Omita la rutina de las startups. Explore negocios llave en mano con ingresos reales, clientes existentes y sistemas ya implementados."}'::jsonb,
  true,
  55
)
ON CONFLICT (section_key) DO UPDATE SET
  label = EXCLUDED.label,
  eyebrow_translations = EXCLUDED.eyebrow_translations,
  title_translations = EXCLUDED.title_translations,
  highlight_translations = EXCLUDED.highlight_translations,
  description_translations = EXCLUDED.description_translations,
  is_visible = EXCLUDED.is_visible,
  display_order = EXCLUDED.display_order;

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.acquisition_section DROP COLUMN IF EXISTS businesses;
-- ALTER TABLE public.section_settings DROP CONSTRAINT IF EXISTS section_settings_section_key_check;
-- ALTER TABLE public.section_settings ADD CONSTRAINT section_settings_section_key_check CHECK (section_key IN ('services','process','why-choose-us','insights','portfolio','testimonials','pricing','faq','final-cta','trusted-by'));
-- DELETE FROM public.section_settings WHERE section_key = 'acquisition';
