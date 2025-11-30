import { z } from 'zod';

export const discoveryChannelEnum = z.enum([
  "Búsqueda Orgánica",
  "Redes Sociales",
  "Prospección Directa",
  "Referimiento",
  "Partner Comercial",
  "Evento",
  "Contenido",
  "Marketplace",
  "Prueba de Producto"
]);

export const urgencyEnum = z.enum([
  "Bajo",
  "Medio",
  "Alto"
]);

export const painPointEnum = z.enum([
  "Gestión de Reservas",
  "Gestión de Clientes (CRM)",
  "Inventario y Stock",
  "Operaciones y Procesos",
  "Automatización",
  "Administración y Backoffice",
  "Limitaciones del Sistema Actual"
]);

export const volumeRangeEnum = z.enum([
  "0-50",
  "51-100",
  "101-200",
  "201-500",
  "500+"
]);

export const solutionPartEnum = z.enum([
  "Vambe AI",
  "Vambe Ads",
  "Vambe Connect"
]);

export const usefulAddonEnum = z.enum([
  "Llamadas en vambe",
  "Comentarios en instagram",
  "Generador de PDF con IA",
  "Gmail: Envio de correaos con IA",
  "Razones de perdida en tickets",
  "NPS con IA",
  "Formulas Matematicas con IA"
]);

export const industryEnum = z.enum([
  "Ecommerce y Retail",
  "Tecnología y Software",
  "Servicios Financieros",
  "Salud y Bienestar",
  "Educación",
  "Inmobiliaria",
  "Hospitalidad y Turismo",
  "Marketing y Publicidad",
  "Consultoría",
  "Servicios Profesionales",
  "Otro"
]);

export type Industry = z.infer<typeof industryEnum>;

export const integrationNeedsEnum = z.enum([
  "N/A",
  "API",
  "CRM",
  "ERP",
  "SDK",
  "API, CRM",
  "API, ERP",
  "API, SDK",
  "CRM, ERP",
  "CRM, SDK",
  "ERP, SDK",
  "API, CRM, ERP",
  "API, CRM, SDK",
  "API, ERP, SDK",
  "CRM, ERP, SDK",
  "API, CRM, ERP, SDK"
]);

export type IntegrationNeeds = z.infer<typeof integrationNeedsEnum>;

