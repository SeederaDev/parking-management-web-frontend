export const sitePages = [
  { path: "/chi-siamo", label: "Chi Siamo" },
  { path: "/soccorso", label: "Soccorso Stradale" },
  { path: "/noleggio", label: "Noleggio" },
  { path: "/contatti", label: "Contatti", cta: true },
];

export const services = [
  {
    path: "/soccorso",
    icon: "ic-tow",
    iconClass: "ic-red",
    title: "Soccorso Stradale",
    text: "Assistenza h24, 7 giorni su 7. Intervento rapido e professionale su tutto il territorio.",
  },
  {
    path: "/noleggio",
    icon: "ic-car",
    iconClass: "ic-blue",
    title: "Noleggio Auto",
    text: "Ampia flotta per privati e aziende. City car, berline e SUV con tariffe competitive.",
  },
  {
    path: "/parcheggio",
    icon: "ic-parking",
    iconClass: "ic-gold",
    title: "Parcheggio Lunga Sosta",
    text: "Custodito, con navetta gratuita per il porto. Videosorveglianza h24, assicurazione inclusa.",
  },
  {
    path: "/vendita",
    icon: "ic-key",
    iconClass: "ic-blue",
    title: "Vendita Auto",
    text: "Auto nuove e usate delle migliori marche. Consulenza e possibilita di finanziamento.",
  },
  {
    path: "/chi-siamo",
    icon: "ic-bolt",
    iconClass: "ic-gray",
    title: "Ricarica Elettrica",
    text: "Colonnine di ricarica per veicoli elettrici disponibili presso la nostra sede di Formia.",
  },
  {
    path: "/chi-siamo",
    icon: "ic-shield",
    iconClass: "ic-red",
    title: "Custodia Giudiziaria",
    text: "Deposito autorizzato per veicoli sequestrati. Servizio sicuro e conforme alle normative.",
  },
];

export const marqueeItems = [
  "Soccorso Stradale h24",
  "Noleggio Auto",
  "Parcheggio Isole Pontine",
  "Vendita Auto Nuove e Usate",
  "Car Valet",
  "Ricarica Elettrica",
  "Custodia Giudiziaria",
  "Quick Service",
  "Certificati ISO 9001",
];

export const sosCards = [
  {
    icon: "ic-truck",
    title: "Traino Veicoli",
    text: "Trasporto del veicolo in officina o qualsiasi destinazione richiesta.",
  },
  {
    icon: "ic-battery",
    title: "Avviamento Batteria",
    text: "Intervento rapido per batteria scarica, sul posto.",
  },
  {
    icon: "ic-tire",
    title: "Cambio Gomme",
    text: "Sostituzione pneumatici direttamente in loco.",
  },
  {
    icon: "ic-unlock",
    title: "Apertura Veicoli",
    text: "Chiavi chiuse dentro? Interveniamo noi, senza danni.",
  },
  {
    icon: "ic-tow",
    title: "Recupero Veicoli",
    text: "Recupero da fossati, scarpate e zone impervie con mezzi attrezzati.",
  },
  {
    icon: "ic-shield",
    title: "Custodia Giudiziaria",
    text: "Deposito autorizzato e sicuro per veicoli sequestrati.",
  },
];

export const parkingFeatures = [
  {
    icon: "ic-bus",
    title: "Navetta Gratuita",
    text: "Inclusa nella sosta, dal parcheggio al porto e ritorno al tuo arrivo.",
  },
  {
    icon: "ic-camera",
    title: "Sicurezza Totale",
    text: "Videosorveglianza 24/7. Assicurazione furto e incendio compresa.",
  },
  {
    icon: "ic-bolt",
    title: "Ricarica Elettrica",
    text: "Colonnine per auto e moto elettriche disponibili nella struttura.",
  },
  {
    icon: "ic-car",
    title: "Car Valet",
    text: "Servizio Car Valet su richiesta per la massima comodita.",
  },
  {
    icon: "ic-wrench",
    title: "Quick Service",
    text: "Piccoli interventi rapidi sulla tua auto mentre sei in vacanza.",
  },
  {
    icon: "ic-pin",
    title: "Posizione Strategica",
    text: "A pochi minuti dal porto di Formia e dalla stazione ferroviaria.",
  },
];

export const fleet = [
  {
    category: "Economia",
    title: "City Car",
    text: "Perfetta per la citta. Economica, compatta, facile da parcheggiare.",
  },
  {
    category: "Comfort",
    title: "Berlina",
    text: "Comfort e spazio per viaggi di lavoro o piacere su lunghe distanze.",
  },
  {
    category: "Premium",
    title: "SUV",
    text: "Spazio, sicurezza e versatilita per famiglie e gruppi.",
  },
];

export const brands = ["Fiat", "Ford", "Jeep", "Range Rover", "Audi", "Nissan"];

export const revealDelay = (index: string | number) =>
  `delay-${Math.min(Number(index), 5)}`;
