import vehiclesCsv from '../../Car Data set/Cars Datasets 2025.csv?raw'

import { getVehiclePhoto } from './vehicle-photos'

export type VehicleSpec = {
  id: string
  make: string
  model: string
  modelYear: string | null
  engine: string
  displacement: string
  horsepowerText: string
  horsepower: number | null
  topSpeedText: string
  topSpeed: number | null
  zeroToHundredText: string
  zeroToHundred: number | null
  priceText: string
  priceMin: number | null
  priceMax: number | null
  fuelType: string
  seatsText: string
  seats: number | null
  torqueText: string
  torque: number | null
  photoUrl: string
  photoAlt: string
  photoCredit?: string
  photoCreditUrl?: string
}

type ColumnKey =
  | 'Company Names'
  | 'Cars Names'
  | 'Engines'
  | 'CC/Battery Capacity'
  | 'HorsePower'
  | 'Total Speed'
  | 'Performance(0 - 100 )KM/H'
  | 'Cars Prices'
  | 'Fuel Types'
  | 'Seats'
  | 'Torque'

const columnMap: Record<ColumnKey, keyof VehicleSpec> = {
  'Company Names': 'make',
  'Cars Names': 'model',
  Engines: 'engine',
  'CC/Battery Capacity': 'displacement',
  HorsePower: 'horsepowerText',
  'Total Speed': 'topSpeedText',
  'Performance(0 - 100 )KM/H': 'zeroToHundredText',
  'Cars Prices': 'priceText',
  'Fuel Types': 'fuelType',
  Seats: 'seatsText',
  Torque: 'torqueText',
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells
}

const numericRegex = /-?\d+(?:\.\d+)?/g

const yearRegex = /(19|20)\d{2}/

function parseNumericValue(value: string): number | null {
  if (!value) {
    return null
  }

  const matches = value.match(numericRegex)
  if (!matches || matches.length === 0) {
    return null
  }

  const numbers = matches.map((item) => Number(item.replace(/,/g, ''))).filter((num) => !Number.isNaN(num))
  if (numbers.length === 0) {
    return null
  }

  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

function normalisePrice(value: string): { text: string; min: number | null; max: number | null } {
  const matches = value.match(numericRegex)
  if (!matches) {
    return { text: value.trim(), min: null, max: null }
  }

  const numbers = matches.map((item) => Number(item.replace(/,/g, ''))).filter((num) => !Number.isNaN(num))

  if (numbers.length === 0) {
    return { text: value.trim(), min: null, max: null }
  }

  if (numbers.length === 1) {
    return { text: value.trim(), min: numbers[0], max: numbers[0] }
  }

  return { text: value.trim(), min: Math.min(...numbers), max: Math.max(...numbers) }
}

function parseSeats(value: string): number | null {
  if (!value) {
    return null
  }

  const matches = value.match(/\d+/g)
  if (!matches) {
    return null
  }

  const total = matches.map(Number).filter((num) => !Number.isNaN(num)).reduce((sum, num) => sum + num, 0)
  return Number.isNaN(total) ? null : total
}

function extractModelYear(value: string): string | null {
  if (!value) {
    return null
  }

  const match = value.match(yearRegex)
  return match ? match[0] : null
}

function slugify(...parts: (string | null | undefined)[]): string {
  const joined = parts.filter(Boolean).join('-')
  return joined.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function createVehicleId(make: string, model: string, modelYear: string | null): string {
  return slugify(make, model, modelYear ?? undefined)
}

const rawLines = vehiclesCsv.trim().split(/\r?\n/)
const headers = splitCsvLine(rawLines.shift() ?? '') as ColumnKey[]

// Track ids to ensure global uniqueness across dataset
const __idCounts = new Map<string, number>()

function ensureUniqueId(baseId: string): string {
  const current = __idCounts.get(baseId) ?? 0
  if (current === 0) {
    __idCounts.set(baseId, 1)
    return baseId
  }
  const next = current + 1
  __idCounts.set(baseId, next)
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.MODE !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`[vehicle-data] duplicate id base detected: ${baseId} -> using ${baseId}-${next}`)
  }
  return `${baseId}-${next}`
}

const vehicleSpecs: VehicleSpec[] = rawLines
  .map((line: string) => splitCsvLine(line))
  .filter((cells: string[]) => cells.length >= headers.length)
  .map((cells: string[]) => {
    const record: Partial<VehicleSpec> & { make?: string; model?: string } = {}

    headers.forEach((header, index) => {
      const mappedKey = columnMap[header]
      const value = cells[index]?.trim() ?? ''

      if (!mappedKey) {
        return
      }

      ;(record as any)[mappedKey] = value
    })

    const make = record.make ?? 'Unknown'
    const model = record.model ?? 'Unknown'
    const modelYear = extractModelYear(model)
    const horsepowerText = record.horsepowerText ?? ''
    const topSpeedText = record.topSpeedText ?? ''
    const accelerationText = record.zeroToHundredText ?? ''
    const torqueText = record.torqueText ?? ''
    const price = normalisePrice(record.priceText ?? '')
    const photo = getVehiclePhoto(make, model, modelYear)

    return {
      id: ensureUniqueId(createVehicleId(make, model, modelYear)),
      make,
      model,
      modelYear,
      engine: record.engine ?? '',
      displacement: record.displacement ?? '',
      horsepowerText,
      horsepower: parseNumericValue(horsepowerText),
      topSpeedText,
      topSpeed: parseNumericValue(topSpeedText),
      zeroToHundredText: accelerationText,
      zeroToHundred: parseNumericValue(accelerationText),
      priceText: price.text,
      priceMin: price.min,
      priceMax: price.max,
      fuelType: record.fuelType ?? '',
      seatsText: record.seatsText ?? '',
      seats: parseSeats(record.seatsText ?? ''),
      torqueText,
      torque: parseNumericValue(torqueText),
      photoUrl: photo.url,
      photoAlt: photo.alt,
      photoCredit: photo.credit,
      photoCreditUrl: photo.creditUrl,
    }
  })

export const allVehicleSpecs = vehicleSpecs

export const vehicleMakes = Array.from(new Set(vehicleSpecs.map((item) => item.make))).sort((a, b) => a.localeCompare(b))

export function getVehiclesByMake(make: string) {
  return vehicleSpecs.filter((item) => item.make === make).sort((a, b) => a.model.localeCompare(b.model))
}

export function getVehicleById(id: string) {
  return vehicleSpecs.find((item) => item.id === id) ?? null
}
