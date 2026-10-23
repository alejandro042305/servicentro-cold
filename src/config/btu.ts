// Factores de la calculadora de BTU (estimación orientativa).
// {{PENDIENTE}}: el responsable técnico debe validar estos factores antes de publicar.
export const BTU = {
  porM3: 200,              // BTU/h por m³ de volumen (≈ 500 BTU/h por m² con 2,5 m de altura)
  sol: { baja: 1, media: 1.1, alta: 1.2 } as Record<string, number>,
  personasIncluidas: 2,    // personas ya contempladas en la base
  porPersonaExtra: 600,    // BTU/h por cada persona adicional
  porEquipo: 500,          // BTU/h por equipo que genera calor (computador, TV, nevera pequeña…)
  capacidades: [9000, 12000, 18000, 24000, 36000, 48000, 60000],
};
