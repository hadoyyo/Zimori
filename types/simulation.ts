export interface SimulationSettings {
  grassSpawnRate: number
  insectSpawnRate: number
  initialSmallCarnivores: number
  initialBigCarnivores: number
  initialSmallHerbivores: number
  initialBigHerbivores: number
  initialScavengers: number
  initialInsectivores: number
  lakeCount: number
  carcassFreshness: number
  grassFreshness: number
  insectLifespan: number
  mushroomChance: number
  periodicSpawning: boolean
  graphicsMode: boolean
  biome: 'forest' | 'savanna'
}

export interface SimulationStats {
  plants: number
  animals: number
  carnivores: number
  herbivores: number
  insectivores: number
  scavengers: number
  insects: number
}

export interface SimulationResult {
  startTime: number
  endTime: number
  duration: number
  endReason: string
  finalStats: SimulationStats
  maxPopulations: {
    scavengers: number
    insectivores: number
    plants: number
    animals: number
    carnivores: number
    herbivores: number
    insects: number
  }
  settings: SimulationSettings
}

export type EntitySize = "small" | "standard" | "big"
export type EntityCategory = "plant" | "animal" | "other"

export interface Entity {
  id: string
  type: string
  category: EntityCategory
  size: EntitySize
  x: number
  y: number
  health?: number
  hunger?: number
  thirst?: number
  age?: number
  foodValue?: number
  direction?: "left" | "right"
  speed?: number
  targetX?: number
  targetY?: number
  reproductionCooldown?: number
  lastReproduction?: number
  maxAge?: number
  canWalkOver?: boolean
  renewable?: boolean
  isPoisonous?: boolean
  lastDirectionChange?: number
}
