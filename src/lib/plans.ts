import { getCollection } from 'astro:content';

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => `${base}${p.startsWith('/') ? p : '/' + p}`;

export async function loadAll() {
  const [countries, cities, categories, plans] = await Promise.all([
    getCollection('countries'),
    getCollection('cities'),
    getCollection('categories'),
    getCollection('plans'),
  ]);
  return {
    countries: countries.map((c) => c.data),
    cities: cities.map((c) => c.data),
    categories: categories.map((c) => c.data).sort((a, b) => a.order - b.order),
    plans: plans.map((p) => p.data),
  };
}

export type Plan = Awaited<ReturnType<typeof loadAll>>['plans'][number];

export const planUrl = (p: Plan) => url(`/${p.country}/${p.area}/${p.category}/${p.slug}/`);
export const cityUrl = (country: string, city: string) => url(`/${country}/${city}/`);
export const listUrl = (country: string, city: string, cat: string) => url(`/${country}/${city}/${cat}/`);

// Duración total del plan desde una ciudad: ida + núcleo + vuelta (aprox.) + paradas.
export function totalFrom(p: Plan, city: string) {
  const b = p.bases.find((x) => x.city === city);
  if (!b) return null;
  const ride = b.minutes * 2 + p.core.minutes;
  const km = b.km * 2 + p.core.km;
  return { ride, km, approach: b.minutes };
}

export function bucket(min: number) {
  if (min <= 180) return { id: 'manana', label: 'Una mañana' };
  if (min <= 300) return { id: 'medio', label: 'Medio día' };
  return { id: 'dia', label: 'Día entero' };
}

export const fmtMin = (m: number) => {
  const h = Math.floor(m / 60), r = Math.round(m % 60);
  return h ? (r ? `${h} h ${r}` : `${h} h`) : `${r} min`;
};

// Trazado esquemático en SVG a partir de las paradas (para tarjetas).
export function sketch(p: Plan, w = 300, h = 170, pad = 22) {
  const pts = p.stops.map((s) => [s.lng, s.lat]);
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const k = Math.min((w - pad * 2) / (maxX - minX || 1), (h - pad * 2) / ((maxY - minY) * 1.25 || 1));
  const ox = (w - (maxX - minX) * k) / 2, oy = (h - (maxY - minY) * 1.25 * k) / 2;
  return pts.map(([x, y]) => [ox + (x - minX) * k, oy + (maxY - y) * 1.25 * k]);
}
