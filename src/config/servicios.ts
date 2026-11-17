// Servicios: rutas, nombres, iconos y mensajes prellenados de WhatsApp por página.
// `tab` = nombre corto para la barra inferior del celular (BottomNav).
export type ServicioSlug = 'reparacion-mantenimiento' | 'instalacion' | 'aire-acondicionado' | 'cuartos-frios' | 'chillers';

export const SERVICIOS: Record<ServicioSlug, {
  nombre: string; corto: string; tab: string; href: string; icon: string; waMsg: string; servicioForm: string;
}> = {
  'reparacion-mantenimiento': {
    nombre: 'Reparación y mantenimiento', corto: 'Reparación y mantenimiento', tab: 'Reparación',
    href: '/servicios/reparacion-mantenimiento/', icon: 'lucide:wrench',
    waMsg: 'Hola, necesito reparación o mantenimiento para mi equipo. ',
    servicioForm: 'Reparación urgente',
  },
  instalacion: {
    nombre: 'Instalación y sustitución', corto: 'Instalación', tab: 'Instalación',
    href: '/servicios/instalacion/', icon: 'lucide:air-vent',
    waMsg: 'Hola, quiero cotizar la instalación de un aire acondicionado. ',
    servicioForm: 'Instalación de aire acondicionado',
  },
  'aire-acondicionado': {
    nombre: 'Tipos de aire acondicionado', corto: 'Aire acondicionado', tab: 'Aire',
    href: '/servicios/aire-acondicionado/', icon: 'lucide:fan',
    waMsg: 'Hola, quiero asesoría para elegir un aire acondicionado. ',
    servicioForm: 'Instalación de aire acondicionado',
  },
  'cuartos-frios': {
    nombre: 'Cuartos fríos', corto: 'Cuartos fríos', tab: 'Cuartos fríos',
    href: '/servicios/cuartos-frios/', icon: 'lucide:snowflake',
    waMsg: 'Hola, quiero información sobre un proyecto de cuarto frío. ',
    servicioForm: 'Cuarto frío',
  },
  chillers: {
    nombre: 'Chillers', corto: 'Chillers', tab: 'Chillers',
    href: '/servicios/chillers/', icon: 'lucide:factory',
    waMsg: 'Hola, quiero información sobre un chiller. ',
    servicioForm: 'Chiller',
  },
};

export const SERVICIOS_ORDEN: ServicioSlug[] = ['reparacion-mantenimiento', 'instalacion', 'aire-acondicionado', 'cuartos-frios', 'chillers'];

/** Mensaje de WhatsApp por defecto (páginas generales). */
export const WA_MSG_GENERAL = 'Hola, quiero información sobre sus servicios. ';
export const WA_MSG_URGENTE = 'Hola, tengo una falla urgente en mi [equipo]. Estoy en [barrio].';

/** Lista blanca de servicios del QuickForm (se repite en public/api/contacto.php). */
export const OPCIONES_SERVICIO = [
  'Reparación urgente', 'Mantenimiento', 'Instalación de aire acondicionado', 'Cuarto frío', 'Chiller', 'Otro',
];

/** Lista blanca de tipos de proyecto del ProjectForm (se repite en contacto.php). */
export const OPCIONES_PROYECTO = [
  'Cuarto frío de conservación', 'Cuarto frío de congelación', 'Chiller',
  'Climatización de edificio/planta', 'Contrato de mantenimiento',
];
export const OPCIONES_FECHA = ['Este mes', '1–3 meses', 'Más de 3 meses'];
