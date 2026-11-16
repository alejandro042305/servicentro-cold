// src/config/site.ts — ÚNICA fuente de datos del negocio.
// Regla: nunca inventar datos. Lo que tenga {{PENDIENTE}}, null, "" o [] se trata como
// inexistente y el componente que lo usa se oculta. Ver PENDIENTES.md.
export const SITE = {
  nombre: "Servicentro Cold",
  razonSocial: "{{PENDIENTE: razón social S.A.S.}}",
  nit: "{{PENDIENTE}}",
  dominio: "https://{{PENDIENTE: dominio}}.com",
  ciudad: "Bogotá D.C.",
  direccion: "{{PENDIENTE: dirección física}}",
  geo: { lat: 0, lng: 0 },                         // {{PENDIENTE}}
  telefono: "+57 {{PENDIENTE}}",                    // formato visible: 313 000 0000
  telefonoHref: "tel:+57{{PENDIENTE}}",
  whatsapp: "57{{PENDIENTE}}",                      // solo dígitos para wa.me
  email: "{{PENDIENTE}}@{{dominio}}",
  horario: { lunVie: "7:00 a. m. – 6:00 p. m.", sab: "8:00 a. m. – 1:00 p. m.", urgencias: "24/7" }, // confirmar
  tiempoRespuestaWhatsApp: "{{PENDIENTE: ej. 15 minutos}}",
  tiempoVisitaUrgencia: "{{PENDIENTE: ej. el mismo día en Bogotá}}",
  tiempoCotizacion: "{{PENDIENTE: ej. 24 horas hábiles}}",
  garantiaManoObra: "{{PENDIENTE: ej. 6 meses}}",
  anosExperiencia: null as number | null,
  proyectosRealizados: null as number | null,
  clientesEmpresariales: null as number | null,
  ratingGoogle: null as number | null,
  numResenasGoogle: null as number | null,
  urlResenasGoogle: "",
  marcas: [/* "LG","Samsung","Carrier","Trane","Daikin","Midea","Bitzer","Copeland","Danfoss" — solo las reales */] as string[],
  certificaciones: [/* "RETIE", "Trabajo seguro en alturas", "Buenas prácticas en refrigerantes", ... solo las reales */] as string[],
  clientesLogos: [/* { nombre, logo } */] as { nombre: string; logo: string }[],
  cobertura: ["Usaquén","Chapinero","Suba","Engativá","Fontibón","Kennedy","Teusaquillo","Puente Aranda","Barrios Unidos","Chía","Cajicá","Cota","Funza","Mosquera","Soacha"], // confirmar
  redes: { facebook: "", instagram: "", linkedin: "", tiktok: "", youtube: "" },
  responsableTecnico: { nombre: "{{PENDIENTE}}", cargo: "Director técnico", foto: "", frase: "" },
  tracking: { gtmId: "GTM-XXXXXXX", ga4Id: "G-XXXXXXX", adsId: "AW-XXXXXXXXX",
              adsLabels: { whatsapp: "", llamada: "", formulario: "" }, turnstileSiteKey: "" },
};
