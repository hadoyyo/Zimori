"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Pause, Play, Power, Loader, Leaf, TreePine, Bug, PawPrint, Bone, Beef, NotepadText } from "lucide-react"
import type { SimulationSettings, SimulationResult } from "@/types/simulation"
import { useSimulation } from "@/hooks/use-simulation"

interface SimulationViewProps {
  settings: SimulationSettings
  onSimulationEnd: (result: SimulationResult) => void
  onBack: () => void
}

interface EntityImageData {
  image: HTMLImageElement
  direction: 'left' | 'right'
}

export default function SimulationView({ settings, onSimulationEnd, onBack }: SimulationViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredEntity, setHoveredEntity] = useState<any>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 900 })
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [entityImages, setEntityImages] = useState<Record<string, HTMLImageElement[]>>({})
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  const [entityImageMap, setEntityImageMap] = useState<Record<string, EntityImageData>>({})
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [currentHoveredEntityId, setCurrentHoveredEntityId] = useState<string | null>(null)

  const { 
    entities, 
    sortedEntities,
    stats, 
    isRunning, 
    elapsedTime, 
    startSimulation, 
    pauseSimulation, 
    resumeSimulation, 
    populationHistory 
  } = useSimulation(settings, onSimulationEnd)

  const getPolishEntityName = (type: string) => {
    const names: Record<string, string> = {
      grass: "Trawa",
      seedling: "Sadzonka",
      plant: "Roślina",
      poisonous_plant: "Roślina trująca",
      tree: "Drzewo",
      dead_tree: "Martwe drzewo",
      log: "Kłoda",
      litter: "Ściółka",
      mushroom: "Grzyb",
      water_plant: "Roślina wodna",
      insect: "Owad",
      insectivore: "Owadożerca",
      small_carnivore: "Mały mięsożerca",
      big_carnivore: "Duży mięsożerca",
      small_herbivore: "Mały roślinożerca",
      big_herbivore: "Duży roślinożerca",
      scavenger: "Padlinożerca",
      carcass: "Padlina",
      faeces: "Odchody",
      lake: "Jezioro",
    }
    return names[type] || type
  }

  const getPolishSizeName = (size: string) => {
    return {
      small: "Mały",
      standard: "Średni",
      big: "Duży"
    }[size] || size
  }

  useEffect(() => {
    if (currentHoveredEntityId) {
      const entity = sortedEntities.find(e => e.id === currentHoveredEntityId)
      setHoveredEntity(entity || null)
    } else {
      setHoveredEntity(null)
    }
  }, [currentHoveredEntityId, sortedEntities])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        togglePause()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPaused])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1300)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    if (!settings.graphicsMode) {
      setImagesLoaded(true)
      return
    }

    const loadImages = async () => {
      const forestAssets = {
        grass: ['grass.png'],
        seedling: ['seedling.png'],
        plant: ['plant1.png', 'plant2.png', 'plant4.png'],
        poisonous_plant: ['plant3.png'],
        tree: ['tree1.png', 'tree2.png', 'tree3.png', 'tree4.png', 'tree5.png', 'tree6.png'],
        dead_tree: ['dead-tree.png'],
        log: ['log.png'],
        litter: ['litter.png'],
        mushroom: ['mushroom.png'],
        insect: ['bug1.png', 'bug2.png', 'bug3.png', 'bug4.png', 'bug5.png', 'bug6.png', 'bug7.png', 'bug8.png', 'bug9.png', 'bug10.png', 'bug11.png'],
        insectivore: ['insectivore1.png', 'insectivore2.png', 'insectivore3.png', 'insectivore4.png', 'insectivore5.png'],
        small_carnivore: ['carnivore-small1.png', 'carnivore-small2.png', 'carnivore-small3.png', 'carnivore-small4.png'],
        big_carnivore: ['carnivore-big1.png', 'carnivore-big2.png', 'carnivore-big3.png', 'carnivore-big4.png'],
        small_herbivore: ['herbivore-small1.png', 'herbivore-small2.png', 'herbivore-small3.png', 'herbivore-small4.png'],
        big_herbivore: ['herbivore-big1.png', 'herbivore-big2.png', 'herbivore-big3.png', 'herbivore-big4.png', 'herbivore-big5.png'],
        scavenger: ['scavenger1.png', 'scavenger2.png', 'scavenger3.png', 'scavenger4.png'],
        carcass: ['carcass.png'],
        faeces: ['faeces.png'],
        lake: ['pond1.png', 'pond2.png']
      }

      const savannaAssets = {
        grass: ['grass2.png'],
        seedling: ['seedling.png'],
        plant: ['plant1.png', 'plant6.png', 'plant4.png'],
        poisonous_plant: ['plant5.png'],
        tree: ['tree2.png', 'tree4.png', 'tree7.png', 'tree8.png'],
        dead_tree: ['dead-tree.png'],
        log: ['log.png'],
        litter: ['litter.png'],
        mushroom: ['mushroom.png'],
        insect: ['bug4.png', 'bug10.png', 'bug12.png', 'bug13.png', 'bug14.png', 'bug15.png', 'bug16.png', 'bug17.png'],
        insectivore: ['insectivore6.png', 'insectivore7.png', 'insectivore8.png'],
        small_carnivore: ['carnivore-small5.png', 'carnivore-small6.png', 'carnivore-small7.png'],
        big_carnivore: ['carnivore-big5.png', 'carnivore-big6.png', 'carnivore-big7.png', 'carnivore-big8.png'],
        small_herbivore: ['herbivore-small5.png', 'herbivore-small6.png', 'herbivore-small7.png', 'herbivore-small8.png', 'herbivore-small9.png'],
        big_herbivore: ['herbivore-big6.png', 'herbivore-big7.png', 'herbivore-big8.png', 'herbivore-big9.png', 'herbivore-big10.png', 'herbivore-big11.png', 'herbivore-big12.png'],
        scavenger: ['scavenger5.png', 'scavenger6.png', 'scavenger7.png'],
        carcass: ['carcass.png'],
        faeces: ['faeces.png'],
        lake: ['pond3.png']
      }

      const imageDefinitions = settings.biome === 'savanna' ? savannaAssets : forestAssets
      const loadedImages: Record<string, HTMLImageElement[]> = {}
      
      const bg = new Image()
      bg.src = settings.biome === 'savanna' ? '/assets/background2.png' : '/assets/background.png'
      await new Promise((resolve) => {
        bg.onload = resolve
      })
      setBgImage(bg)

      for (const [type, files] of Object.entries(imageDefinitions)) {
        loadedImages[type] = []
        for (const file of files) {
          const img = new Image()
          img.src = `/assets/${file}`
          await new Promise((resolve) => {
            img.onload = resolve
          })
          loadedImages[type].push(img)
        }
      }

      setEntityImages(loadedImages)
      setImagesLoaded(true)
    }

    loadImages().catch(console.error)
  }, [settings.graphicsMode, settings.biome])

  useEffect(() => {
    if (!imagesLoaded) return
    
    startSimulation()
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [imagesLoaded])

  const handleResize = useCallback(() => {
    const container = document.querySelector('.canvas-container')
    if (!container) return

    const containerWidth = container.clientWidth - 32
    const scale = Math.min(containerWidth / 800, 1)
    setCanvasSize({
      width: 800 * scale,
      height: 800 * scale
    })
  }, [])

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isLargeScreen) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      setMousePos({ x: e.clientX, y: e.clientY })

      const entity = sortedEntities.find((entity) => {
        const entitySize = entity.size === "small" ? 24 : entity.size === "big" ? 72 : 48
        return x >= entity.x && x <= entity.x + entitySize && y >= entity.y && y <= entity.y + entitySize
      })

      setCurrentHoveredEntityId(entity?.id || null)
    },
    [sortedEntities, isLargeScreen]
  )

  const handleCanvasMouseLeave = useCallback(() => {
    if (!isLargeScreen) return
    setCurrentHoveredEntityId(null)
  }, [isLargeScreen])

  const renderEntity = useCallback((
    ctx: CanvasRenderingContext2D, 
    entity: any, 
    scaleX: number, 
    scaleY: number
  ) => {
    const size = entity.size === "small" ? 24 : entity.size === "big" ? 72 : 48
    const scaledSize = size * scaleX
    const x = entity.x * scaleX
    const y = entity.y * scaleY

    if (settings.graphicsMode && imagesLoaded) {
      let imageData = entityImageMap[entity.id]
      
      if (entity.type === 'plant' && !imageData) {
        const isNearLake = sortedEntities.some(e => 
          e.type === 'lake' && 
          Math.sqrt(Math.pow(entity.x - e.x, 2) + Math.pow(entity.y - e.y, 2)) < 100)
        
        if (isNearLake && entityImages.plant?.length >= 3) {
          imageData = {
            image: entityImages.plant[2],
            direction: 'left'
          }
          setEntityImageMap(prev => ({
            ...prev,
            [entity.id]: imageData
          }))
        }
      }
      
      if (!imageData && entityImages[entity.type]?.length > 0) {
        let availableImages = entityImages[entity.type]
        if (entity.type === 'plant') {
          availableImages = availableImages.slice(0, 2)
        }
        
        const randomIndex = Math.floor(Math.random() * availableImages.length)
        const randomImage = availableImages[randomIndex]
        imageData = {
          image: randomImage,
          direction: entity.direction === 'right' ? 'right' : 'left'
        }
        setEntityImageMap(prev => ({
          ...prev,
          [entity.id]: imageData
        }))
      }

      if (imageData?.image) {
        const direction = entity.direction === 'right' ? 'right' : 'left'
        
        ctx.save()
        ctx.translate(x + scaledSize / 2, y + scaledSize / 2)
        
        if (direction === 'right') {
          ctx.scale(-1, 1)
        }
        
        ctx.drawImage(imageData.image, -scaledSize / 2, -scaledSize / 2, scaledSize, scaledSize)
        ctx.restore()
        return
      }
    }

    ctx.fillStyle = getEntityColor(entity.type)
    ctx.fillRect(x, y, scaledSize, scaledSize)

    if (entity.category === "animal" && entity.direction && !settings.graphicsMode) {
      ctx.fillStyle = "rgba(0,0,0,0.3)"
      const centerX = x + scaledSize / 2
      const centerY = y + scaledSize / 2
      const arrowSize = 4 * scaleX

      if (entity.direction === "right") {
        ctx.beginPath()
        ctx.moveTo(centerX - arrowSize, centerY - arrowSize)
        ctx.lineTo(centerX + arrowSize, centerY)
        ctx.lineTo(centerX - arrowSize, centerY + arrowSize)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.moveTo(centerX + arrowSize, centerY - arrowSize)
        ctx.lineTo(centerX - arrowSize, centerY)
        ctx.lineTo(centerX + arrowSize, centerY + arrowSize)
        ctx.fill()
      }
    }
  }, [
    settings.graphicsMode, 
    settings.biome,
    imagesLoaded, 
    entityImages, 
    entityImageMap, 
    sortedEntities
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (settings.graphicsMode && bgImage) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
    } else {
      ctx.fillStyle = settings.biome === 'savanna' ? "#eab308" : "#339238ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const scaleX = canvas.width / 800
    const scaleY = canvas.height / 800

    sortedEntities.forEach((entity) => {
      renderEntity(ctx, entity, scaleX, scaleY)

      if (isLargeScreen && currentHoveredEntityId === entity.id) {
        ctx.strokeStyle = "#363636"
        ctx.lineWidth = 2 * scaleX
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        
        const padding = 4 * scaleX
        const cornerRadius = 8 * scaleX
        
        const x = entity.x * scaleX - padding
        const y = entity.y * scaleY - padding
        const width = (entity.size === "small" ? 24 : entity.size === "big" ? 72 : 48) * scaleX + padding * 2
        const height = (entity.size === "small" ? 24 : entity.size === "big" ? 72 : 48) * scaleY + padding * 2
        
        ctx.beginPath()
        ctx.moveTo(x + cornerRadius, y)
        ctx.lineTo(x + width - cornerRadius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius)
        ctx.lineTo(x + width, y + height - cornerRadius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height)
        ctx.lineTo(x + cornerRadius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius)
        ctx.lineTo(x, y + cornerRadius)
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y)
        ctx.closePath()
        ctx.stroke()
        
        ctx.setLineDash([])
      }
    })
  }, [sortedEntities, currentHoveredEntityId, canvasSize, settings.graphicsMode, settings.biome, renderEntity, bgImage, isLargeScreen])

  const togglePause = () => {
    if (isPaused) {
      resumeSimulation()
    } else {
      pauseSimulation()
    }
    setIsPaused(!isPaused)
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const handleManualEnd = () => {
    if (!populationHistory || populationHistory.length === 0) {
      onSimulationEnd({
        startTime: Date.now() - elapsedTime,
        endTime: Date.now(),
        duration: elapsedTime,
        endReason: "Ręcznie zakończono",
        finalStats: stats,
        maxPopulations: {
          plants: stats.plants,
          animals: stats.animals,
          carnivores: stats.carnivores,
          herbivores: stats.herbivores,
          insects: stats.insects,
        },
        settings
      })
    } else {
      onSimulationEnd({
        startTime: Date.now() - elapsedTime,
        endTime: Date.now(),
        duration: elapsedTime,
        endReason: "Ręcznie zakończono",
        finalStats: stats,
        maxPopulations: {
          plants: Math.max(...populationHistory.map(h => h.plants)),
          animals: Math.max(...populationHistory.map(h => h.animals)),
          carnivores: Math.max(...populationHistory.map(h => h.carnivores)),
          herbivores: Math.max(...populationHistory.map(h => h.herbivores)),
          insects: Math.max(...populationHistory.map(h => h.insects)),
          insectivores: Math.max(...populationHistory.map(h => h.insectivores)),
          scavengers: Math.max(...populationHistory.map(h => h.scavengers))
        },
        settings
      })
    }
  }

  const countPlantTypes = useCallback(() => {
    return {
      grass: entities.filter(e => e.type === 'grass').length,
      tree: entities.filter(e => e.type === 'tree').length,
      seedling: entities.filter(e => e.type === 'seedling').length,
      plant: entities.filter(e => e.type === 'plant').length,
      poisonous_plant: entities.filter(e => e.type === 'poisonous_plant').length,
      mushroom: entities.filter(e => e.type === 'mushroom').length
    }
  }, [entities])

  const countHerbivoreTypes = useCallback(() => {
    return {
      small: entities.filter(e => e.type === 'small_herbivore').length,
      big: entities.filter(e => e.type === 'big_herbivore').length
    }
  }, [entities])

  const countCarnivoreTypes = useCallback(() => {
    return {
      small: entities.filter(e => e.type === 'small_carnivore').length,
      big: entities.filter(e => e.type === 'big_carnivore').length
    }
  }, [entities])

  const calculateLifePercentage = (entity: any) => {
    if (!entity.maxAge || !entity.age) return 100
    return Math.max(0, 100 - (entity.age / entity.maxAge) * 100)
  }

  if (!imagesLoaded) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <Loader className="w-8 h-8 animate-spin text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ładowanie zasobów...</h2>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: settings.biome === 'savanna' 
          ? "url('/background2.png')" 
          : "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 w-full max-w-screen-xl px-3 sm:px-4 z-50">
        <div className="flex items-center justify-between bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-6 py-3 sm:py-3 border-green-100/20 shadow-md mx-auto w-full max-w-4xl">
          <Button
            onClick={onBack}
            className="rounded-full px-4 sm:px-4 py-2 sm:py-1 hover:text-green-600 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-1000 text-white text-sm sm:text-sm h-9 sm:h-8 min-w-[90px] sm:min-w-[110px] transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
            Powrót
          </Button>
          
          <div className="flex items-center space-x-2 sm:space-x-2">
            <Button
              onClick={togglePause}
              className="rounded-full px-3 sm:px-4 py-2 sm:py-1 text-white hover:text-green-600 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-1000 text-sm sm:text-sm h-9 sm:h-8 min-w-[80px] sm:min-w-[90px] transition-all duration-300 hover:scale-105"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
                  <span>Wznów</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
                  <span>Pauza</span>
                </>
              )}
            </Button>
            <Button
              onClick={handleManualEnd}
              className="rounded-full px-3 sm:px-4 py-2 sm:py-1 text-white hover:text-black bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-sm sm:text-sm h-9 sm:h-8 min-w-[90px] sm:min-w-[110px] transition-all duration-300 hover:scale-105"
            >
              <Power className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden xs:inline">Zakończ</span>
              <span className="xs:hidden">Stop</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 sm:pt-28 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 canvas-container">
              <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-2 shadow-lg">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="w-full rounded-3xl shadow-sm"
                  style={{
                    maxHeight: '800px',
                    cursor: isLargeScreen ? 'crosshair' : 'default'
                  }}
                  onMouseMove={isLargeScreen ? handleCanvasMouseMove : undefined}
                  onMouseLeave={isLargeScreen ? handleCanvasMouseLeave : undefined}
                />
              </div>
            </div>

            {/* Stats Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="text-center mb-1 sm:mb-1 sm:mt-2 animate-slide-up">
                <div className="flex justify-center items-center gap-4">
                  <div 
                    className={`px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${
                      isRunning 
                        ? "from-green-600 to-green-800" 
                        : "from-yellow-500 to-yellow-700"
                    }`}
                  >
                    {isRunning ? "W trakcie" : "Wstrzymana"}
                  </div>
                  <div className="px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-800">
                    Czas: {formatTime(elapsedTime)}
                  </div>
                </div>
              </div>

              <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-lg rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <NotepadText className="w-5 h-5" />
                    Statystyki ekosystemu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-red-700">
                        <Beef className="w-5 h-5" />
                        Mięsożercy ({stats.carnivores})
                      </div>
                      <div className="pl-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Mali:</span>
                          <span className="font-medium">{countCarnivoreTypes().small}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Duzi:</span>
                          <span className="font-medium">{countCarnivoreTypes().big}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                        <Leaf className="w-5 h-5" />
                        Roślinożercy ({stats.herbivores})
                      </div>
                      <div className="pl-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Mali:</span>
                          <span className="font-medium">{countHerbivoreTypes().small}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Duzi:</span>
                          <span className="font-medium">{countHerbivoreTypes().big}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-lime-400">
                        <TreePine className="w-4 h-4" />
                        Flora ({stats.plants})
                      </div>
                      <div className="pl-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Trawy:</span>
                          <span className="font-medium">{countPlantTypes().grass}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Drzewa:</span>
                          <span className="font-medium">{countPlantTypes().tree}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Sadzonki:</span>
                          <span className="font-medium">{countPlantTypes().seedling}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Rośliny:</span>
                          <span className="font-medium">{countPlantTypes().plant}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Trujące:</span>
                          <span className="font-medium">{countPlantTypes().poisonous_plant}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-900">Grzyby:</span>
                          <span className="font-medium">{countPlantTypes().mushroom}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-orange-700">
                        <Bug className="w-5 h-5" />
                        Owady ({stats.insects})
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-purple-700">
                        <Bone className="w-5 h-5" />
                        Padlinożercy ({stats.scavengers})
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
                        <Bug className="w-5 h-5" />
                        Owadożercy ({stats.insectivores})
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isLargeScreen && hoveredEntity && (
                <Card className="bg-white/10 backdrop-blur-lg border-0 rounded-3xl shadow-lg animate-slide-up" style={{ animationDelay: "300ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <PawPrint className="w-5 h-5" />
                      Szczegóły obiektu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">Typ</span>
                        <span className="text-sm font-medium">
                          {getPolishEntityName(hoveredEntity.type)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">Rozmiar</span>
                        <span className="text-sm font-medium">
                          {getPolishSizeName(hoveredEntity.size)}
                        </span>
                      </div>

                      {(hoveredEntity.hunger !== undefined && hoveredEntity.category === "animal" && hoveredEntity.type !== "insect") && (
                        <div>
                          <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-gray-800">Poziom najedzenia</span>
                            <span>{Math.max(0, (100 - (hoveredEntity.hunger / 30) * 100)).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                hoveredEntity.hunger < 10 ? 'bg-purple-500' : 
                                hoveredEntity.hunger < 20 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.max(0, 100 - (hoveredEntity.hunger / 30) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {(hoveredEntity.thirst !== undefined && hoveredEntity.category === "animal" && hoveredEntity.type !== "insect") && (
                        <div className="pt-2">
                          <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-gray-800">Poziom nawodnienia</span>
                            <span>{Math.max(0, (100 - (hoveredEntity.thirst / 30) * 100)).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                hoveredEntity.thirst < 10 ? 'bg-blue-500' : 
                                hoveredEntity.thirst < 20 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.max(0, 100 - (hoveredEntity.thirst / 30) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {hoveredEntity.maxAge && hoveredEntity.age && (
                        <div className="pt-2">
                          <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-gray-800">Pozostały czas życia</span>
                            <span>{Math.max(0, Math.floor((hoveredEntity.maxAge - hoveredEntity.age) / 1000))}s</span>
                          </div>
                          <div className="w-full bg-gray-200/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                calculateLifePercentage(hoveredEntity) > 50 ? 'bg-green-500' : 
                                calculateLifePercentage(hoveredEntity) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${calculateLifePercentage(hoveredEntity)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {hoveredEntity.age !== undefined && (
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-sm font-medium text-gray-800">Wiek</span>
                          <span className="text-sm font-medium">{Math.floor(hoveredEntity.age / 1000)}s</span>
                        </div>
                      )}

                      {hoveredEntity.foodValue !== undefined && (
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-sm font-medium text-gray-800">Wartość pokarmowa</span>
                          <span className="text-sm font-medium">{hoveredEntity.foodValue}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center pb-6 px-4">
        <p className="text-white/50 text-sm sm:text-base font-medium drop-shadow-lg">Wykonał Hubert Jędruchniewicz</p>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }
      `}</style>
    </div>
  )
}

function getEntityColor(type: string): string {
  const colors: Record<string, string> = {
    grass: "#22c55e",
    seedling: "#84cc16",
    plant: "#16a34a",
    poisonous_plant: "#8f00ff",
    tree: "#15803d",
    dead_tree: "#78716c",
    log: "#a3a3a3",
    litter: "#d6d3d1",
    mushroom: "#f59e0b",
    water_plant: "#06b6d4",
    insect: "#fbbf24",
    insectivore: "#f97316",
    small_carnivore: "#dc2626",
    big_carnivore: "#991b1b",
    small_herbivore: "#65a30d",
    big_herbivore: "#166534",
    scavenger: "#6b7280",
    carcass: "#7c2d12",
    faeces: "#78716c",
    lake: "#3b82f6",
  }

  return colors[type] || "#6b7280"
}