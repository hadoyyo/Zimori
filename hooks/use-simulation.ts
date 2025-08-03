"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type {
  SimulationSettings,
  SimulationResult,
  Entity,
  SimulationStats,
  EntityCategory,
  EntitySize,
} from "@/types/simulation"

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 800
const TICK_INTERVAL = 1000 / 60 // 60 FPS
const LAKE_BUFFER = 0

interface BehaviorResult {
  updatedEntity: Entity
  entitiesToAdd?: Entity[]
  entitiesToRemove?: string[]
}

export function useSimulation(settings: SimulationSettings, onSimulationEnd: (result: SimulationResult) => void) {
  const [entities, setEntities] = useState<Entity[]>([])
  const [stats, setStats] = useState<SimulationStats>({
    plants: 0,
    animals: 0,
    carnivores: 0,
    herbivores: 0,
    insectivores: 0,
    scavengers: 0,
    insects: 0,
  })
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null)
  const [totalPausedTime, setTotalPausedTime] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [lastSpawnTime, setLastSpawnTime] = useState(0)
  const [lastGrassSpawnTime, setLastGrassSpawnTime] = useState(0)
  const [lastInsectSpawnTime, setLastInsectSpawnTime] = useState(0)
  const [populationHistory, setPopulationHistory] = useState<SimulationStats[]>([])
  const [herbivoreExtinctionTimer, setHerbivoreExtinctionTimer] = useState<number | null>(null)
  const [carnivoreExtinctionTimer, setCarnivoreExtinctionTimer] = useState<number | null>(null)

  // Entities sorted by type and position
  const sortedEntities = useMemo(() => {
    return [...entities].sort((a, b) => {
      if (a.type === 'lake' && b.type !== 'lake') return -1
      if (a.type !== 'lake' && b.type === 'lake') return 1
      return a.y - b.y
    })
  }, [entities])

  const isPositionInLake = useCallback((x: number, y: number, size: number): boolean => {
    return entities.some(entity => {
      if (entity.type !== 'lake') return false
      const lakeSize = 48
      return (
        x < entity.x + lakeSize + LAKE_BUFFER &&
        x + size > entity.x - LAKE_BUFFER &&
        y < entity.y + lakeSize + LAKE_BUFFER &&
        y + size > entity.y - LAKE_BUFFER
      )
    })
  }, [entities])

  const isPositionValid = useCallback((
    x: number,
    y: number,
    size: number,
    ignoreEntities: string[] = [],
    checkLakes: boolean = true
  ): boolean => {
    if (x < 0 || y < 0 || x + size > CANVAS_WIDTH || y + size > CANVAS_HEIGHT) {
      return false
    }

    if (checkLakes && isPositionInLake(x, y, size)) {
      return false
    }

    return !entities.some((entity) => {
      if (ignoreEntities.includes(entity.id)) return false
      if (entity.canWalkOver) return false

      const otherSize = entity.size === "small" ? 24 : entity.size === "big" ? 72 : 48
      return (
        x < entity.x + otherSize &&
        x + size > entity.x &&
        y < entity.y + otherSize &&
        y + size > entity.y
      )
    })
  }, [entities, isPositionInLake])

  const getValidPosition = useCallback((
    size: EntitySize,
    x?: number,
    y?: number,
    avoidLakes: boolean = true,
    maxAttempts: number = 500
  ): { x: number; y: number } => {
    const entitySize = size === "small" ? 24 : size === "big" ? 72 : 48

    if (x !== undefined && y !== undefined) {
      if (isPositionValid(x, y, entitySize, [], avoidLakes)) {
        return { x, y }
      }
    }

    let attempts = 0
    while (attempts < maxAttempts) {
      const newX = Math.floor(Math.random() * (CANVAS_WIDTH - entitySize))
      const newY = Math.floor(Math.random() * (CANVAS_HEIGHT - entitySize))

      if (isPositionValid(newX, newY, entitySize, [], avoidLakes)) {
        return { x: newX, y: newY }
      }
      attempts++
    }

    for (let y = 0; y < CANVAS_HEIGHT - entitySize; y += 10) {
      for (let x = 0; x < CANVAS_WIDTH - entitySize; x += 10) {
        if (isPositionValid(x, y, entitySize, [], avoidLakes)) {
          return { x, y }
        }
      }
    }

    return { x: 0, y: 0 }
  }, [isPositionValid])

  const startSimulation = useCallback(() => {
    const initialEntities: Entity[] = []

    for (let i = 0; i < settings.lakeCount; i++) {
      initialEntities.push(createLake())
    }

    const createAnimalWithRetry = (count: number, creator: () => Entity): Entity[] => {
      const animals: Entity[] = []
      for (let i = 0; i < count; i++) {
        let attempts = 0
        let placed = false
        
        while (attempts < 50 && !placed) {
          const animal = creator()
          if (!isPositionInLake(animal.x, animal.y, 
              animal.size === "small" ? 24 : animal.size === "big" ? 72 : 48)) {
            animals.push(animal)
            placed = true
          }
          attempts++
        }
        
        if (!placed) {
          console.warn(`Nie udało się umieścić zwierzęcia po 500 próbach`)
        }
      }
      return animals
    }

    initialEntities.push(
      ...createAnimalWithRetry(settings.initialSmallCarnivores, createSmallCarnivore),
      ...createAnimalWithRetry(settings.initialBigCarnivores, createBigCarnivore),
      ...createAnimalWithRetry(settings.initialSmallHerbivores, createSmallHerbivore),
      ...createAnimalWithRetry(settings.initialBigHerbivores, createBigHerbivore),
      ...createAnimalWithRetry(settings.initialScavengers, createScavenger),
      ...createAnimalWithRetry(settings.initialInsectivores, createInsectivore)
    )

    setEntities(initialEntities)
    setIsRunning(true)
    const now = Date.now()
    setStartTime(now)
    setElapsedTime(0)
    setTotalPausedTime(0)
    setPauseStartTime(null)
    updateStats(initialEntities)
    setPopulationHistory([])
    setHerbivoreExtinctionTimer(null)
    setCarnivoreExtinctionTimer(null)
  }, [settings, isPositionInLake])

  const pauseSimulation = useCallback(() => {
    setIsRunning(false)
    setPauseStartTime(Date.now())
  }, [])

  const resumeSimulation = useCallback(() => {
    if (pauseStartTime) {
      const now = Date.now()
      setTotalPausedTime(prev => prev + (now - pauseStartTime))
      setPauseStartTime(null)
    }
    setIsRunning(true)
  }, [pauseStartTime])

  const updateStats = useCallback((entities: Entity[]) => {
    const newStats: SimulationStats = {
      plants: 0,
      animals: 0,
      carnivores: 0,
      herbivores: 0,
      insectivores: 0,
      scavengers: 0,
      insects: 0,
    }

    entities.forEach((entity) => {
      if (entity.category === "plant") {
        newStats.plants++
      } else if (entity.category === "animal") {
        newStats.animals++

        if (entity.type.includes("carnivore")) {
          newStats.carnivores++
        } else if (entity.type.includes("herbivore")) {
          newStats.herbivores++
        } else if (entity.type.includes("insectivore")) {
          newStats.insectivores++
        } else if (entity.type.includes("scavenger")) {
          newStats.scavengers++
        } else if (entity.type === "insect") {
          newStats.insects++
        }
      }
    })

    setStats(newStats)
    return newStats
  }, [])

  const createEntity = (
    type: string, 
    category: EntityCategory, 
    size: EntitySize, 
    x?: number, 
    y?: number,
    avoidLakes: boolean = false
  ): Entity => {
    const pos = getValidPosition(size, x, y, avoidLakes)
    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      size,
      x: pos.x,
      y: pos.y,
      age: 0,
      health: 100,
      hunger: 0,
      thirst: 0,
      direction: Math.random() < 0.5 ? "left" : "right",
      ...getEntitySpecificProps(type),
    }
  }

  const getEntitySpecificProps = (type: string) => {
    const props: Partial<Entity> = {}

    switch (type) {
      case "grass":
      case "seedling":
        props.foodValue = 1
        props.maxAge = settings.grassFreshness
        props.canWalkOver = true
        break
      case "plant":
      case "poisonous_plant":
      case "mushroom":
        props.foodValue = 2
        props.maxAge = settings.grassFreshness
        props.canWalkOver = true
        break
      case "tree":
        props.foodValue = 5
        props.maxAge = settings.grassFreshness
        props.canWalkOver = false
        props.renewable = true
        break
      case "dead_tree":
      case "log":
        props.canWalkOver = false
        props.maxAge = settings.grassFreshness
        break
      case "litter":
        props.canWalkOver = true
        props.maxAge = settings.grassFreshness
        break
      case "insect":
        props.foodValue = 1
        props.maxAge = settings.insectLifespan
        props.canWalkOver = true
        props.speed = 1
        break
      case "insectivore":
        props.foodValue = 2
        props.maxAge = 120000
        props.canWalkOver = true
        props.speed = 2
        break
      case "small_carnivore":
        props.foodValue = 3
        props.maxAge = 180000
        props.canWalkOver = true
        props.speed = 2
        break
      case "big_carnivore":
        props.maxAge = 240000
        props.canWalkOver = true
        props.speed = 2
        break
      case "small_herbivore":
        props.foodValue = 3
        props.maxAge = 150000
        props.canWalkOver = true
        props.speed = 2
        break
      case "big_herbivore":
        props.foodValue = 5
        props.maxAge = 210000
        props.canWalkOver = true
        props.speed = 1
        break
      case "scavenger":
        props.foodValue = 2
        props.maxAge = 90000
        props.canWalkOver = true
        props.speed = 1
        break
      case "carcass":
      case "faeces":
        props.maxAge = settings.carcassFreshness
        props.canWalkOver = true
        break
      case "lake":
        props.canWalkOver = false
        props.waterValue = 100
        break
    }

    return props
  }

  const createGrass = (x?: number, y?: number) => createEntity("grass", "plant", "standard", x, y)
  const createSeedling = (x?: number, y?: number) => createEntity("seedling", "plant", "standard", x, y)
  const createPlant = (x?: number, y?: number) => createEntity("plant", "plant", "standard", x, y)
  const createPoisonousPlant = (x?: number, y?: number) => createEntity("poisonous_plant", "plant", "standard", x, y)
  const createTree = (x?: number, y?: number) => createEntity("tree", "plant", "big", x, y)
  const createDeadTree = (x: number, y: number) => createEntity("dead_tree", "plant", "big", x, y)
  const createLog = (x: number, y: number) => createEntity("log", "plant", "standard", x, y)
  const createLitter = (x?: number, y?: number) => createEntity("litter", "plant", "standard", x, y)
  const createMushroom = (x?: number, y?: number) => createEntity("mushroom", "plant", "standard", x, y)
  const createInsect = (x?: number, y?: number) => createEntity("insect", "animal", "small", x, y)
  const createInsectivore = (x?: number, y?: number) => createEntity("insectivore", "animal", "standard", x, y, true)
  const createSmallCarnivore = (x?: number, y?: number) => createEntity("small_carnivore", "animal", "standard", x, y, true)
  const createBigCarnivore = (x?: number, y?: number) => createEntity("big_carnivore", "animal", "big", x, y, true)
  const createSmallHerbivore = (x?: number, y?: number) => createEntity("small_herbivore", "animal", "standard", x, y, true)
  const createBigHerbivore = (x?: number, y?: number) => createEntity("big_herbivore", "animal", "big", x, y, true)
  const createScavenger = (x?: number, y?: number) => createEntity("scavenger", "animal", "standard", x, y, true)
  const createCarcass = (x?: number, y?: number) => createEntity("carcass", "other", "standard", x, y)
  const createFaeces = (x?: number, y?: number) => createEntity("faeces", "other", "small", x, y)
  const createLake = (x?: number, y?: number) => createEntity("lake", "other", "big", x, y)

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return

    const simulationInterval = setInterval(() => {
      const currentTime = Date.now()
      const newElapsedTime = currentTime - startTime - totalPausedTime - (pauseStartTime ? currentTime - pauseStartTime : 0)
      setElapsedTime(newElapsedTime)

      if (stats.animals === 0) {
        endSimulation("Wszystkie zwierzęta wyginęły")
        return
      }

      if (newElapsedTime > 600000) {
        endSimulation("Czas symulacji dobiegł końca")
        return
      }

      const currentStats = updateStats(entities)
      
      if (currentStats.herbivores === 0 && !herbivoreExtinctionTimer) {
        setHerbivoreExtinctionTimer(currentTime)
      } else if (currentStats.herbivores > 0 && herbivoreExtinctionTimer) {
        setHerbivoreExtinctionTimer(null)
      }

      if (currentStats.carnivores === 0 && !carnivoreExtinctionTimer) {
        setCarnivoreExtinctionTimer(currentTime)
      } else if (currentStats.carnivores > 0 && carnivoreExtinctionTimer) {
        setCarnivoreExtinctionTimer(null)
      }

      if (herbivoreExtinctionTimer && currentTime - herbivoreExtinctionTimer > 10000) {
        endSimulation("Wszyscy roślinożercy wyginęli")
        return
      }

      if (carnivoreExtinctionTimer && currentTime - carnivoreExtinctionTimer > 10000) {
        endSimulation("Wszyscy mięsożercy wyginęli")
        return
      }

      setEntities((currentEntities) => {
        let newEntities = [...currentEntities]
        const now = currentTime

        if (now - lastGrassSpawnTime > settings.grassSpawnRate * 1500) {
          setLastGrassSpawnTime(now)
          if (Math.random() < 0.8) {
            newEntities.push(createGrass())
          } else {
            const grasses = newEntities.filter((e) => e.type === "grass")
            if (grasses.length > 10) {
              const grass = grasses[Math.floor(Math.random() * grasses.length)]
              newEntities.push(createSeedling(grass.x + (Math.random() * 64 - 32), grass.y + (Math.random() * 64 - 32)))
            }
          }
        }

        if (now - lastInsectSpawnTime > settings.insectSpawnRate * 3000 && settings.periodicSpawning) {
          setLastInsectSpawnTime(now)
          newEntities.push(createInsect())
        }

        const entitiesToAdd: Entity[] = []
        const entitiesToRemove: string[] = []

        newEntities = newEntities.map((entity) => {
          let updatedEntity = { ...entity }

          if (updatedEntity.age !== undefined) {
            updatedEntity.age += TICK_INTERVAL
          }

          if (
            updatedEntity.maxAge !== undefined &&
            updatedEntity.age !== undefined &&
            updatedEntity.age > updatedEntity.maxAge
          ) {
            const deadEntity = handleEntityDeath(updatedEntity)
            if (deadEntity === null) {
              entitiesToRemove.push(updatedEntity.id)
              return updatedEntity
            } else if (deadEntity.id !== updatedEntity.id) {
              entitiesToRemove.push(updatedEntity.id)
              entitiesToAdd.push(deadEntity)
              return updatedEntity
            }
            return deadEntity
          }

          if (updatedEntity.category === "animal") {

            if (updatedEntity.hunger !== undefined) {
              updatedEntity.hunger += TICK_INTERVAL / 1000
              if (updatedEntity.hunger > 30) {
                const deadEntity = handleEntityDeath(updatedEntity)
                if (deadEntity === null) {
                  entitiesToRemove.push(updatedEntity.id)
                  return updatedEntity
                } else if (deadEntity.id !== updatedEntity.id) {
                  entitiesToRemove.push(updatedEntity.id)
                  entitiesToAdd.push(deadEntity)
                  return updatedEntity
                }
                return deadEntity
              }
            }

            if (updatedEntity.thirst !== undefined) {
              updatedEntity.thirst += TICK_INTERVAL / 2000
              if (updatedEntity.thirst > 30) {
                const deadEntity = handleEntityDeath(updatedEntity)
                if (deadEntity === null) {
                  entitiesToRemove.push(updatedEntity.id)
                  return updatedEntity
                } else if (deadEntity.id !== updatedEntity.id) {
                  entitiesToRemove.push(updatedEntity.id)
                  entitiesToAdd.push(deadEntity)
                  return updatedEntity
                }
                return deadEntity
              }
            }

            const behaviorResult = handleAnimalBehavior(updatedEntity, newEntities)
            updatedEntity = behaviorResult.updatedEntity

            if (behaviorResult.entitiesToAdd) {
              entitiesToAdd.push(...behaviorResult.entitiesToAdd)
            }
            if (behaviorResult.entitiesToRemove) {
              entitiesToRemove.push(...behaviorResult.entitiesToRemove)
            }
          }

          return updatedEntity
        })

        newEntities = newEntities.filter(e => !entitiesToRemove.includes(e.id))
        newEntities.push(...entitiesToAdd)

        const reproductionEntities: Entity[] = []
        newEntities.forEach((entity) => {
          if (entity.shouldReproduce && entity.reproductionPartner) {
            const partner = newEntities.find((e) => e.id === entity.reproductionPartner)
            if (partner) {
              const offspringX = (entity.x + partner.x) / 2 + (Math.random() * 60 - 30)
              const offspringY = (entity.y + partner.y) / 2 + (Math.random() * 60 - 30)

              let offspring: Entity
              switch (entity.type) {
                case "insectivore":
                  offspring = createInsectivore(offspringX, offspringY)
                  break
                case "small_carnivore":
                  offspring = createSmallCarnivore(offspringX, offspringY)
                  break
                case "big_carnivore":
                  offspring = createBigCarnivore(offspringX, offspringY)
                  break
                case "small_herbivore":
                  offspring = createSmallHerbivore(offspringX, offspringY)
                  break
                case "big_herbivore":
                  offspring = createBigHerbivore(offspringX, offspringY)
                  break
                case "scavenger":
                  offspring = createScavenger(offspringX, offspringY)
                  break
                default:
                  return
              }

              offspring.hunger = 25
              offspring.age = 0
              reproductionEntities.push(offspring)

              if (partner.hunger !== undefined) {
                partner.hunger += 5
              }
              partner.lastReproduction = Date.now()
            }

            entity.shouldReproduce = false
            entity.reproductionPartner = undefined
          }
        })

        newEntities.push(...reproductionEntities)
        updateStats(newEntities)

        return newEntities
      })
    }, TICK_INTERVAL)

    return () => clearInterval(simulationInterval)
  }, [isRunning, startTime, lastGrassSpawnTime, lastInsectSpawnTime, stats, settings, 
      herbivoreExtinctionTimer, carnivoreExtinctionTimer, totalPausedTime, pauseStartTime])

  const handleAnimalBehavior = (entity: Entity, allEntities: Entity[]): BehaviorResult => {
    const result: BehaviorResult = {
      updatedEntity: { ...entity },
      entitiesToAdd: [],
      entitiesToRemove: []
    }

    if (result.updatedEntity.type.includes("herbivore") || result.updatedEntity.type === "insectivore") {
      const predators = findNearbyEntities(
        result.updatedEntity,
        150,
        result.updatedEntity.type.includes("herbivore") ? ["small_carnivore", "big_carnivore"] : ["small_carnivore"],
      )

      if (predators.length > 0) {
        const predator = predators[0]
        const dx = result.updatedEntity.x - predator.x
        const dy = result.updatedEntity.y - predator.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 0) {
          const fleeDistance = 200
          const targetX = result.updatedEntity.x + (dx / distance) * fleeDistance
          const targetY = result.updatedEntity.y + (dy / distance) * fleeDistance

          const moveX = (dx / distance) * (result.updatedEntity.speed || 1) * 1.5
          const moveY = (dy / distance) * (result.updatedEntity.speed || 1) * 1.5

          const newX = result.updatedEntity.x + moveX
          const newY = result.updatedEntity.y + moveY

          if (isValidPosition(newX, newY, result.updatedEntity.size, [result.updatedEntity.id])) {
            result.updatedEntity.x = newX
            result.updatedEntity.y = newY
            result.updatedEntity.targetX = targetX
            result.updatedEntity.targetY = targetY
            return result
          }
        }
      }
    }

    if (!result.updatedEntity.targetX || !result.updatedEntity.targetY || Math.random() < 0.01) {
      const newTarget = getRandomTarget(result.updatedEntity)
      result.updatedEntity.targetX = newTarget.x
      result.updatedEntity.targetY = newTarget.y
    }

    if (Math.random() < 0.02) {
      result.updatedEntity.direction = Math.random() < 0.5 ? "left" : "right"
    }

    if (result.updatedEntity.targetX && result.updatedEntity.targetY && result.updatedEntity.speed) {
      const dx =
        result.updatedEntity.targetX -
        (result.updatedEntity.x + (result.updatedEntity.size === "small" ? 12 : result.updatedEntity.size === "big" ? 36 : 24))
      const dy =
        result.updatedEntity.targetY -
        (result.updatedEntity.y + (result.updatedEntity.size === "small" ? 12 : result.updatedEntity.size === "big" ? 36 : 24))
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 2) {
        const speed = result.updatedEntity.speed
        const moveX = (dx / distance) * speed
        const moveY = (dy / distance) * speed

        if (Math.abs(moveX) > Math.abs(moveY)) {
          result.updatedEntity.direction = moveX > 0 ? "right" : "left"
        }

        const newX = result.updatedEntity.x + moveX
        const newY = result.updatedEntity.y + moveY

        if (isValidPosition(newX, newY, result.updatedEntity.size, [result.updatedEntity.id])) {
          result.updatedEntity.x = newX
          result.updatedEntity.y = newY
        } else {
          const newTarget = getRandomTarget(result.updatedEntity)
          result.updatedEntity.targetX = newTarget.x
          result.updatedEntity.targetY = newTarget.y
        }
      } else {
        const newTarget = getRandomTarget(result.updatedEntity)
        result.updatedEntity.targetX = newTarget.x
        result.updatedEntity.targetY = newTarget.y
      }
    }

    if (result.updatedEntity.hunger !== undefined && result.updatedEntity.hunger > 10) {
      const nearbyFood = findNearbyEntities(result.updatedEntity, 100, getFoodTypesForAnimal(result.updatedEntity.type))
      if (nearbyFood.length > 0) {
        const food = nearbyFood[0]
        const foodSize = food.size === "small" ? 24 : food.size === "big" ? 72 : 48
        const entitySize = result.updatedEntity.size === "small" ? 24 : result.updatedEntity.size === "big" ? 72 : 48

        const distance = Math.sqrt(
          Math.pow(result.updatedEntity.x + entitySize / 2 - (food.x + foodSize / 2), 2) +
            Math.pow(result.updatedEntity.y + entitySize / 2 - (food.y + foodSize / 2), 2),
        )

        if (distance < 20) {
          if (result.updatedEntity.hunger !== undefined && food.foodValue !== undefined) {
            result.updatedEntity.hunger = Math.max(0, result.updatedEntity.hunger - food.foodValue * 10)
          }

          if (food.type === "poisonous_plant" && result.updatedEntity.type.includes("herbivore")) {
            const deadEntity = handleEntityDeath(result.updatedEntity)
            if (deadEntity === null) {
              result.entitiesToRemove?.push(result.updatedEntity.id)
            } else if (deadEntity.id !== result.updatedEntity.id) {
              result.entitiesToRemove?.push(result.updatedEntity.id)
              result.entitiesToAdd?.push(deadEntity)
            }
            result.entitiesToRemove?.push(food.id)
            return result
          }

          if (!food.renewable) {
            result.entitiesToRemove?.push(food.id)

            if (food.category === "animal" && food.type !== "insect") {
              result.entitiesToAdd?.push(createCarcass(food.x, food.y))
            }

            if (Math.random() < 0.1) {
              result.entitiesToAdd?.push(createFaeces(result.updatedEntity.x, result.updatedEntity.y))
            }
          }
        } else {
          result.updatedEntity.targetX = food.x + foodSize / 2
          result.updatedEntity.targetY = food.y + foodSize / 2
        }
      }
    }

    if (
    (result.updatedEntity.type.includes("carnivore") || 
    result.updatedEntity.type.includes("herbivore") ||
    result.updatedEntity.type.includes("insectivore") ||
    result.updatedEntity.type.includes("scavenger")) &&
    result.updatedEntity.thirst !== undefined &&
    result.updatedEntity.thirst > 5
    ) {
      const nearbyLakes = findNearbyEntities(result.updatedEntity, 200, ["lake"])
      if (nearbyLakes.length > 0) {
        const lake = nearbyLakes[0]
        const lakeSize = 48
        const entitySize = result.updatedEntity.size === "small" ? 24 : result.updatedEntity.size === "big" ? 72 : 48

        const distance = Math.sqrt(
          Math.pow(result.updatedEntity.x + entitySize / 2 - (lake.x + lakeSize / 2), 2) +
            Math.pow(result.updatedEntity.y + entitySize / 2 - (lake.y + lakeSize / 2), 2),
        )

        if (distance < 78) {
          result.updatedEntity.thirst = Math.max(0, result.updatedEntity.thirst - 5)
        } else {
          result.updatedEntity.targetX = lake.x + lakeSize / 2
          result.updatedEntity.targetY = lake.y + lakeSize / 2
        }
      }
    }

    if (
      result.updatedEntity.hunger !== undefined &&
      result.updatedEntity.hunger < 20 &&
      result.updatedEntity.age !== undefined &&
      result.updatedEntity.age > 30000
    ) {
      const nearbyPartners = findNearbyEntities(result.updatedEntity, 100, [result.updatedEntity.type])
      if (nearbyPartners.length > 0) {
        const partner = nearbyPartners[0]

        if (partner.hunger !== undefined && partner.hunger < 20 && partner.age !== undefined && partner.age > 30000) {
          const entitySize = result.updatedEntity.size === "small" ? 24 : result.updatedEntity.size === "big" ? 72 : 48
          const partnerSize = partner.size === "small" ? 24 : partner.size === "big" ? 72 : 48
          const distance = Math.sqrt(
            Math.pow(result.updatedEntity.x + entitySize / 2 - (partner.x + partnerSize / 2), 2) +
              Math.pow(result.updatedEntity.y + entitySize / 2 - (partner.y + partnerSize / 2), 2),
          )

          if (distance < 50) {
            const now = Date.now()
            if (!result.updatedEntity.lastReproduction || now - result.updatedEntity.lastReproduction > 30000) {
              result.updatedEntity.hunger += 5
              result.updatedEntity.lastReproduction = now
              result.updatedEntity.shouldReproduce = true
              result.updatedEntity.reproductionPartner = partner.id
            }
          } else {
            result.updatedEntity.targetX = partner.x + partnerSize / 2
            result.updatedEntity.targetY = partner.y + partnerSize / 2
          }
        }
      }
    }

    return result
  }

  const findNearbyEntities = (entity: Entity, radius: number, types?: string[]): Entity[] => {
    const entitySize = entity.size === "small" ? 24 : entity.size === "big" ? 72 : 48
    const centerX = entity.x + entitySize / 2
    const centerY = entity.y + entitySize / 2

    return entities.filter((e) => {
      if (e.id === entity.id) return false
      if (types && !types.includes(e.type)) return false

      const otherSize = e.size === "small" ? 24 : e.size === "big" ? 72 : 48
      const otherCenterX = e.x + otherSize / 2
      const otherCenterY = e.y + otherSize / 2

      const distance = Math.sqrt(Math.pow(centerX - otherCenterX, 2) + Math.pow(centerY - otherCenterY, 2))
      return distance <= radius
    })
  }

  const getFoodTypesForAnimal = (animalType: string): string[] => {
    switch (animalType) {
      case "insectivore":
        return ["insect"]
      case "small_carnivore":
        return ["insect", "insectivore", "small_herbivore"]
      case "big_carnivore":
        return ["small_carnivore", "small_herbivore", "big_herbivore", "scavenger"]
      case "small_herbivore":
        return ["grass", "seedling", "plant", "poisonous_plant", "mushroom"]
      case "big_herbivore":
        return ["grass", "seedling", "plant", "poisonous_plant", "tree", "mushroom"]
      case "scavenger":
        return ["insect", "carcass"]
      default:
        return []
    }
  }

  const handleEntityDeath = (entity: Entity): Entity | null => {
    switch (entity.type) {
      case "grass":
      case "insect":
      case "mushroom":
        return null
      case "seedling":
        if (Math.random() < 0.1 && hasSpaceForTree(entity.x, entity.y)) {
          return createTree(entity.x, entity.y)
        } else if (Math.random() < 0.05) {
          return createPoisonousPlant(entity.x, entity.y)
        } else if (Math.random() < 0.5) {
          return createPlant(entity.x, entity.y)
        }
        return null
      case "plant":
      case "poisonous_plant":
        return createLitter(entity.x, entity.y)
      case "tree":
        return {
          ...createDeadTree(entity.x, entity.y),
          x: entity.x,
          y: entity.y
        }
      case "dead_tree":
        return {
          ...createLog(entity.x, entity.y),
          x: entity.x,
          y: entity.y
      }
      case "log":
        return createLitter(entity.x, entity.y)
      case "litter":
        if (Math.random() < settings.mushroomChance) {
          return createMushroom(entity.x, entity.y)
        }
        return null
      case "faeces":
        if (Math.random() < settings.mushroomChance / 2) {
          return createMushroom(entity.x, entity.y)
        }
        return null
      case "insectivore":
      case "small_carnivore":
      case "big_carnivore":
      case "small_herbivore":
      case "big_herbivore":
      case "scavenger":
        return createCarcass(entity.x, entity.y)
      case "carcass":
        return createLitter(entity.x, entity.y)
      default:
        return null
    }
  }

  const hasSpaceForTree = (x: number, y: number): boolean => {
    const treeSize = 72
    return (
      isValidPosition(x - 10, y - 10, "big") &&
      isValidPosition(x + 10, y - 10, "big") &&
      isValidPosition(x - 10, y + 10, "big") &&
      isValidPosition(x + 10, y + 10, "big")
    )
  }

  const getRandomTarget = (entity: Entity): { x: number; y: number } => {
    const entitySize = entity.size === "small" ? 24 : entity.size === "big" ? 72 : 48
    const centerX = entity.x + entitySize / 2
    const centerY = entity.y + entitySize / 2

    if (entity.hunger !== undefined && entity.hunger > 50) {
      const nearbyFood = findNearbyEntities(entity, 300, getFoodTypesForAnimal(entity.type))
      if (nearbyFood.length > 0) {
        const food = nearbyFood[0]
        const foodSize = food.size === "small" ? 24 : food.size === "big" ? 72 : 48
        return {
          x: food.x + foodSize / 2,
          y: food.y + foodSize / 2,
        }
      }
    }

    if (
  (entity.type.includes("carnivore") || 
  entity.type.includes("herbivore") ||
  entity.type.includes("insectivore") ||
  entity.type.includes("scavenger")) &&
  entity.thirst !== undefined &&
  entity.thirst > 50
    ) {
      const nearbyLakes = findNearbyEntities(entity, 500, ["lake"])
      if (nearbyLakes.length > 0) {
        const lake = nearbyLakes[0]
        return {
          x: lake.x + 24,
          y: lake.y + 24,
        }
      }
    }

    const angle = Math.random() * Math.PI * 2
    const distance = 50 + Math.random() * 150
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
    }
  }

  const endSimulation = (reason: string) => {
    setIsRunning(false)
    const endTime = Date.now()
    const duration = endTime - startTime - totalPausedTime - (pauseStartTime ? endTime - pauseStartTime : 0)

    const maxPopulations = {
      plants: Math.max(...populationHistory.map((h) => h.plants)),
      animals: Math.max(...populationHistory.map((h) => h.animals)),
      carnivores: Math.max(...populationHistory.map((h) => h.carnivores)),
      herbivores: Math.max(...populationHistory.map((h) => h.herbivores)),
      insects: Math.max(...populationHistory.map((h) => h.insects)),
      insectivores: Math.max(...populationHistory.map((h) => h.insectivores)),
      scavengers: Math.max(...populationHistory.map((h) => h.scavengers))
    }

    const result: SimulationResult = {
      startTime,
      endTime,
      duration,
      endReason: reason,
      finalStats: stats,
      maxPopulations,
      settings,
    }

    onSimulationEnd(result)
  }

  useEffect(() => {
    if (isRunning) {
      setPopulationHistory((prev) => [...prev, stats])
    }
  }, [stats, isRunning])

  const isValidPosition = (x: number, y: number, size: EntitySize, ignoreEntities: string[] = []): boolean => {
    const entitySize = size === "small" ? 24 : size === "big" ? 72 : 48
    return isPositionValid(x, y, entitySize, ignoreEntities, true)
  }

  return {
    entities,
    sortedEntities,
    stats,
    isRunning,
    elapsedTime,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    populationHistory
  }
}