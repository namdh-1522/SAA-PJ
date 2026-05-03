export interface AwardSpec {
  readonly id: string
  readonly titleKey: string
  readonly descriptionKey: string
  readonly image: string
  readonly slug: string
}

export interface AwardValue {
  readonly amountVnd: number
  readonly recipientType?: 'individual' | 'team' | null
  readonly captionKey?: string
}

export type AwardQuantityUnit = 'individual' | 'team' | 'unit'

export interface AwardCategory extends AwardSpec {
  readonly descriptionLongKey: string
  readonly nameOverlayImage: string
  readonly quantity: number
  readonly quantityUnit: AwardQuantityUnit
  readonly values: readonly AwardValue[]
}

export interface CountdownValues {
  days: number | '--'
  hours: number | '--'
  minutes: number | '--'
  hasStarted: boolean
}

export type UserRole = 'user' | 'admin'
