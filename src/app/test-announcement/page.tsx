// Temporary test page for announcement bar swipe behavior
import { AnnouncementBarCarousel } from "@/components/cms/sections/AnnouncementBarCarousel";

export default function TestAnnouncementPage() {
  const sampleSlides = [
    {
      id: "slide-1",
      displayOrder: 1,
      sticky: false,
      url: "#sale",
      messageTranslations: {
        en: "Summer sale now live — up to 50% off all plans!",
        fr: "Vente d'été en cours — jusqu'à 50% de réduction!",
        de: "Sommerschlussverkauf — bis zu 50% Rabatt auf alle Pläne!",
        es: "¡Rebajas de verano — hasta un 50% de descuento en todos los planes!",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "slide-2",
      displayOrder: 2,
      sticky: false,
      url: "#design-system",
      messageTranslations: {
        en: "New design system launched — read the announcement.",
        fr: "Nouveau système de design lancé — lisez l'annonce.",
        de: "Neues Designsystem veröffentlicht — lesen Sie die Ankündigung.",
        es: "Nuevo sistema de diseño lanzado — lee el anuncio.",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "slide-3",
      displayOrder: 3,
      sticky: false,
      url: "#book",
      messageTranslations: {
        en: "Book a free strategy call this week only.",
        fr: "Réservez un appel stratégique gratuit cette semaine uniquement.",
        de: "Buchen Sie diese Woche einen kostenfreien Strategiegespräch.",
        es: "Reserva una llamada de estrategia gratuita solo esta semana.",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return (
    <main className="min-h-screen bg-surface-darkAlt text-text-primary">
      <AnnouncementBarCarousel autoSlideInterval={5000} initialSlides={sampleSlides} />
      <div className="p-8">
        <h1 className="text-display-sm font-display mb-4">Test Announcement Bar</h1>
        <p className="text-body-md text-text-secondary">
          Swipe the amber announcement bar at the top to test mobile swipe behavior.
        </p>
      </div>
    </main>
  );
}
