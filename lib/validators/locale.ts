import { z } from 'zod'

export const localeSchema = z.enum(['vi', 'en'])

export type Locale = z.infer<typeof localeSchema>

export const SUPPORTED_LOCALES: readonly Locale[] = localeSchema.options
