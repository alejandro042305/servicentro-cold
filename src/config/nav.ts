import { SERVICIOS, SERVICIOS_ORDEN } from './servicios';

export const NAV = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Servicios', href: '/servicios/reparacion-mantenimiento/',
    children: SERVICIOS_ORDEN.map((s) => ({ label: SERVICIOS[s].nombre, href: SERVICIOS[s].href, icon: SERVICIOS[s].icon })),
  },
  { label: 'Sectores', href: '/sectores/' },
  { label: 'Proyectos', href: '/proyectos/' },
  { label: 'Nosotros', href: '/nosotros/' },
  { label: 'Contacto', href: '/contacto/' },
] as const;

export const LEGALES = [
  { label: 'Política de privacidad', href: '/politica-de-privacidad/' },
  { label: 'Términos y condiciones', href: '/terminos-y-condiciones/' },
  { label: 'Política de garantía', href: '/politica-de-garantia/' },
];
