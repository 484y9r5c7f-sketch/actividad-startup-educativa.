import rawCourses from './courseData.js';
import { sanitizeQuery } from './security/sanitizer.js';

export const getCourses = () => rawCourses;

export const getCourseById = (id) => rawCourses.find((course) => course.id === id) ?? null;

export const getLevels = () => [...new Set(rawCourses.map((course) => course.level))];

const normalize = (text) =>
  text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Búsqueda segura: la consulta se sanitiza y se compara como texto plano (sin regex).
export function searchCourses({ query = '', level = '' } = {}) {
  const needle = normalize(sanitizeQuery(query));
  return rawCourses.filter((course) => {
    if (level && course.level !== level) return false;
    if (!needle) return true;
    return normalize(`${course.title} ${course.description} ${course.level}`).includes(needle);
  });
}

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
