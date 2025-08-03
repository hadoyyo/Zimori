"use client"

import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import type { SimulationResult } from "@/types/simulation"
import { Trophy, Clock, TreePine, Rabbit, Bug, Settings, Leaf, Bone, Beef, ArrowLeft } from "lucide-react"

interface ResultsViewProps {
  result: SimulationResult
  onBackToMenu: () => void
}

export default function ResultsView({ result, onBackToMenu }: ResultsViewProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("pl-PL")
  }

  const safeValue = (value: number) => isFinite(value) ? value : 0
  const safeMaxValue = (value: number) => isFinite(value) ? Math.max(0, value) : 0

  const initialAnimals = safeValue(result.settings.initialSmallCarnivores) + 
                         safeValue(result.settings.initialBigCarnivores) + 
                         safeValue(result.settings.initialSmallHerbivores) + 
                         safeValue(result.settings.initialBigHerbivores) + 
                         safeValue(result.settings.initialScavengers) + 
                         safeValue(result.settings.initialInsectivores)

  const maxAnimals = safeMaxValue(result.maxPopulations.animals)
  const finalAnimals = safeValue(result.finalStats.animals)

  const calculatePercentage = (current: number, max: number) => {
    const safeCurrent = safeValue(current)
    const safeMax = safeMaxValue(max)
    if (safeMax === 0) return 0
    return Math.round((safeCurrent / safeMax) * 100)
  }

  const calculateBalanceScore = () => {
    const carnivores = safeValue(result.finalStats.carnivores)
    const herbivores = safeValue(result.finalStats.herbivores)
    const insectivores = safeValue(result.finalStats.insectivores)
    const plants = safeValue(result.finalStats.plants)
    const insects = safeValue(result.finalStats.insects)
    
    const totalAnimals = carnivores + herbivores + insectivores + insects
    
    if (totalAnimals === 0) return 0
  
    const carnivoreRatio = carnivores / totalAnimals
    const herbivoreRatio = herbivores / totalAnimals
    const insectivoreRatio = insectivores / totalAnimals
    const plantAnimalRatio = plants / Math.max(totalAnimals, 1)

    let score = 100
  
    if (carnivoreRatio < 0.1 || carnivoreRatio > 0.3) score -= 20
    if (herbivoreRatio < 0.5 || herbivoreRatio > 0.9) score -= 20
    if (insectivoreRatio < 0.05 || insectivoreRatio > 0.2) score -= 10
    if (plantAnimalRatio < 1 || plantAnimalRatio > 10) score -= 20
  
    return Math.max(0, score)
  }

  const getEcosystemHealth = () => {
    const balanceScore = calculateBalanceScore()
    const durationScore = Math.min(100, (safeValue(result.duration) / 600000) * 100) // 10 minut = 100%
    const survivalScore = (safeValue(result.finalStats.animals) / Math.max(safeMaxValue(result.maxPopulations.animals), 1) * 100)
    
    const overallScore = (balanceScore * 0.4) + (survivalScore * 0.4) + (durationScore * 0.2)
    
    if (balanceScore < 30 || survivalScore < 20) {
      return { status: "Krytyczny", color: "text-red-600", bg: "bg-red-600/10", icon: "💀" }
    }
    
    if (overallScore >= 85) return { status: "Zdrowy", color: "text-green-600", bg: "bg-green-600/10", icon: "🌟" }
    if (overallScore >= 65) return { status: "Stabilny", color: "text-blue-600", bg: "bg-blue-600/10", icon: "⚖️" }
    if (overallScore >= 40) return { status: "Niestabilny", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: "⚠️" }
    return { status: "Krytyczny", color: "text-red-600", bg: "bg-red-600/10", icon: "💀" }
  }

  useEffect(() => {
  try {
    const savedResults = JSON.parse(localStorage.getItem('simulationResults') || '[]');
    
    const alreadyExists = savedResults.some(
      (r: SimulationResult) => r.startTime === result.startTime
    );
    
    if (!alreadyExists) {
      const newResults = [result, ...savedResults].slice(0, 50);
      localStorage.setItem('simulationResults', JSON.stringify(newResults));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}, [result]);

  const growthRate = initialAnimals > 0 ? ((maxAnimals - initialAnimals) / initialAnimals * 100) : 0
  const survivalRate = maxAnimals > 0 ? (finalAnimals / maxAnimals * 100) : 0
  const balanceScore = calculateBalanceScore()
  const ecosystemHealth = getEcosystemHealth()

  return (
    <div
      className="min-h-screen bg-fixed md:bg-scroll"
      style={{
        backgroundImage: "url('/background-menu.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 w-full max-w-screen-md px-3 sm:px-4 z-50">
        <div className="flex items-center justify-between bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-6 py-3 sm:py-3 border-green-100/20 shadow-md mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg">
          <Button
            onClick={onBackToMenu}
            className="rounded-full px-4 sm:px-4 py-2 sm:py-1 hover:text-green-600 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-1000 text-white text-sm sm:text-sm h-9 sm:h-8 min-w-[90px] sm:min-w-[110px] transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
            Powrót
          </Button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Trophy className="w-6 h-6 sm:w-6 sm:h-6 text-green-600" />
            <span className="text-base sm:text-lg font-semibold text-green-700">Wyniki</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 sm:pt-28 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">
              Podsumowanie
              <span className="block text-green-600">Symulacji</span>
            </h1>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Czas trwania: {formatTime(safeValue(result.duration))} | {formatDate(safeValue(result.startTime))}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group">
              <div className={`text-2xl font-bold ${ecosystemHealth.color} mb-2 text-center`}>
                {ecosystemHealth.icon} {ecosystemHealth.status}
              </div>
              <p className="text-sm text-gray-800 text-center">Stan ekosystemu</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group">
              <div className="text-2xl font-bold text-blue-600 mb-2 text-center">
                {balanceScore.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-800 text-center">Równowaga</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group">
              <div className="text-2xl font-bold text-purple-600 mb-2 text-center">
                {growthRate > 0 ? '+' : ''}{growthRate.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-800 text-center">Wzrost populacji</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group">
              <div className="text-2xl font-bold text-red-600 mb-2 text-center">
                {survivalRate.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-800 text-center">Przeżywalność</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up">
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 mr-3 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">Informacje Podstawowe</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-800">
                  <span>Data rozpoczęcia:</span>
                  <span>{formatDate(safeValue(result.startTime))}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Data zakończenia:</span>
                  <span>{formatDate(safeValue(result.endTime))}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Czas trwania:</span>
                  <span>{formatTime(safeValue(result.duration))}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span>Powód zakończenia:</span>
                  <span className="text-right">{result.endReason || "Nieznany"}</span>
                </div>
              </div>
            </div>

            {/* Simulation Settings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 mr-3 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">Ustawienia Symulacji</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-800">Populacje Początkowe</h4>
                  <div className="space-y-2 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Małe mięsożerne:</span>
                      <span>{safeValue(result.settings.initialSmallCarnivores)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duże mięsożerne:</span>
                      <span>{safeValue(result.settings.initialBigCarnivores)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Małe roślinożerne:</span>
                      <span>{safeValue(result.settings.initialSmallHerbivores)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duże roślinożerne:</span>
                      <span>{safeValue(result.settings.initialBigHerbivores)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Padlinożercy:</span>
                      <span>{safeValue(result.settings.initialScavengers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Owadożerne:</span>
                      <span>{safeValue(result.settings.initialInsectivores)}</span>
                    </div>
                  </div>
                </div>
                

                <div>
                  <h4 className="font-medium mb-3 text-gray-800">Środowisko</h4>
                  <div className="space-y-2 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Częstotliwość trawy:</span>
                      <span>{safeValue(result.settings.grassSpawnRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Częstotliwość owadów:</span>
                      <span>{safeValue(result.settings.insectSpawnRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ilość jezior:</span>
                      <span>{safeValue(result.settings.lakeCount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Świeżość roślin:</span>
                      <span>{safeValue(result.settings.grassFreshness) / 1000}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Świeżość padliny:</span>
                      <span>{safeValue(result.settings.carcassFreshness) / 1000}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Żywotność owadów:</span>
                      <span>{safeValue(result.settings.insectLifespan) / 1000}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up">
              <div className="flex items-center mb-6">
                <Rabbit className="w-6 h-6 mr-3 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-800">Statystyki populacji</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-3xl p-3 text-center bg-white/10">
                  <div className="flex items-center justify-center gap-2 mb-1 text-lime-400">
                    <TreePine className="w-4 h-4" />
                    <span className="text-sm font-bold">Rośliny</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{safeValue(result.finalStats.plants)}</div>
                  <div className="text-xs text-gray-800">
                    Max: {safeMaxValue(result.maxPopulations.plants)} (
                    {calculatePercentage(result.finalStats.plants, result.maxPopulations.plants)}%)
                  </div>
                </div>

                <div className="rounded-3xl p-3 text-center bg-white/10">
                  <div className="flex items-center justify-center gap-2 mb-1 text-emerald-700">
                    <Leaf className="w-4 h-4" />
                    <span className="text-sm font-bold">Roślinożercy</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{safeValue(result.finalStats.herbivores)}</div>
                  <div className="text-xs text-gray-800">
                    Max: {safeMaxValue(result.maxPopulations.herbivores)} (
                    {calculatePercentage(result.finalStats.herbivores, result.maxPopulations.herbivores)}%)
                  </div>
                </div>

                <div className="rounded-3xl p-3 text-center bg-white/10">
                  <div className="flex items-center justify-center gap-2 mb-1 text-red-500">
                    <Beef className="w-4 h-4" />
                    <span className="text-sm font-bold">Mięsożercy</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{safeValue(result.finalStats.carnivores)}</div>
                  <div className="text-xs text-gray-800">
                    Max: {safeMaxValue(result.maxPopulations.carnivores)} (
                    {calculatePercentage(result.finalStats.carnivores, result.maxPopulations.carnivores)}%)
                  </div>
                </div>

                <div className="rounded-3xl p-3 text-center bg-white/10">
                  <div className="flex items-center justify-center gap-2 mb-1 text-orange-500">
                    <Bug className="w-4 h-4" />
                    <span className="text-sm font-bold">Owady</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{safeValue(result.finalStats.insects)}</div>
                  <div className="text-xs text-gray-800">
                    Max: {safeMaxValue(result.maxPopulations.insects)} (
                    {calculatePercentage(result.finalStats.insects, result.maxPopulations.insects)}%)
                  </div>
                </div>

                <div className="rounded-3xl p-3 text-center bg-white/10">
                  <div className="flex items-center justify-center gap-2 mb-1 text-blue-500">
                    <Bug className="w-4 h-4" />
                    <span className="text-sm font-bold">Owadożercy</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{safeValue(result.finalStats.insectivores)}</div>
                  <div className="text-xs text-gray-800">
                    Max: {safeMaxValue(result.maxPopulations.insectivores)} (
                    {calculatePercentage(result.finalStats.insectivores, result.maxPopulations.insectivores)}%)
                  </div>
                </div>

                <div className="rounded-3xl p-3 text-center bg-white/10">
                  <div className="flex items-center justify-center gap-2 mb-1 text-purple-500">
                    <Bone className="w-4 h-4" />
                    <span className="text-sm font-bold">Padlinożercy</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{safeValue(result.finalStats.scavengers)}</div>
                  <div className="text-xs text-gray-800">
                    Max: {safeMaxValue(result.maxPopulations.scavengers)} (
                    {calculatePercentage(result.finalStats.scavengers, result.maxPopulations.scavengers)}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 animate-slide-up">
            <Button
              onClick={onBackToMenu}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold shadow-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Powrót do Menu
            </Button>
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