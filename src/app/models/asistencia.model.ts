// Representa una asistencia individual
export interface Asistencia {
  fecha: string; // Fecha en formato 'dd-mm-yyyy'
  asistio: boolean; // Si asistió o no
}

// Representa las asistencias agrupadas por sección
export interface AsistenciasPorSeccion {
  ramo: string; // Nombre del ramo
  asistencias: Asistencia[]; // Lista de asistencias
}

// Representa la agrupación general de todas las asistencias por sección
export interface AsistenciasAgrupadas {
  [key: string]: AsistenciasPorSeccion; // Agrupadas por el código de la sección
}
