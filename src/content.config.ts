import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

// Países: unidades, idioma y moneda propios de cada uno.
const countries = defineCollection({
  loader: file('src/data/countries.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    lang: z.string(),
    units: z.enum(['km', 'mi']),
    currency: z.string(),
  }),
});

// Ciudades base: desde donde se calculan los tiempos de los listados.
const cities = defineCollection({
  loader: file('src/data/cities.json'),
  schema: z.object({
    id: z.string(),
    country: z.string(),
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    default: z.boolean().optional(),
  }),
});

// Categorías / actividades (moto, montaña, escapadas...).
const categories = defineCollection({
  loader: file('src/data/categories.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    short: z.string(),
    blurb: z.string(),
    color: z.string(),
    travelMode: z.enum(['driving', 'walking', 'cycling']),
    status: z.enum(['active', 'soon']),
    order: z.number(),
  }),
});

const stop = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string(),
  lat: z.number(),
  lng: z.number(),
  maps: z.string(),
  note: z.string().optional(),
});

const eat = z.object({
  name: z.string(),
  where: z.string(),
  q: z.string(),
  types: z.array(z.enum(['almuerzo', 'comida'])),
  desc: z.string(),
  top: z.boolean().optional(),
  near: z.string().optional(), // id de la parada junto a la que está
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Planes: el núcleo es agnóstico de la ciudad; "bases" dice cuánto se tarda desde cada ciudad.
const plans = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/data/plans' }),
  schema: z.object({
    slug: z.string(),
    country: z.string(),
    area: z.string(),
    areaName: z.string(),
    category: z.string(),
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    core: z.object({ km: z.number(), minutes: z.number() }),
    bases: z.array(z.object({ city: z.string(), minutes: z.number(), km: z.number() })),
    stops: z.array(stop).min(2),
    eats: z.array(eat).default([]),
    approachEats: z.array(eat).default([]),
    tips: z.array(z.object({ t: z.string(), d: z.string() })).default([]),
  }),
});

export const collections = { countries, cities, categories, plans };
