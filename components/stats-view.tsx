"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import type { SimulationResult } from "@/types/simulation"
import { ArrowLeft, Clock, Trophy, TrendingUp, Leaf, PawPrint, BarChart3, Target, Award, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StatsViewProps {
  onBack: () => void
}

export default function StatsView({ onBack }: StatsViewProps) {
  const [results, setResults] = useState<SimulationResult[]>([])

  useEffect(() => {
    try {
      const savedResults = JSON.parse(localStorage.getItem("simulationResults") || "[]")
      setResults(savedResults)
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }
  }, [])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const safeValue = (value: number) => (isFinite(value) ? value : 0)
  const safeMaxValue = (value: number) => (isFinite(value) ? Math.max(0, value) : 0)

  const calculateBalanceScore = (result: SimulationResult) => {
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

  const getEcosystemHealth = (result: SimulationResult) => {
    const balanceScore = calculateBalanceScore(result)
    const durationScore = Math.min(100, safeValue(result.duration) / 600000) * 100 // 10 minut = 100%
    const survivalScore =
      (safeValue(result.finalStats.animals) / Math.max(safeMaxValue(result.maxPopulations.animals), 1)) * 100

    const overallScore = balanceScore * 0.4 + survivalScore * 0.4 + durationScore * 0.2

    if (balanceScore < 30 || survivalScore < 20) {
      return { status: "Krytyczny", color: "text-red-600", bg: "bg-red-600/10", icon: "💀" }
    }

    if (overallScore >= 85) return { status: "Zdrowy", color: "text-gray-800", icon: "🌟" }
    if (overallScore >= 65) return { status: "Stabilny", color: "text-gray-800", icon: "⚖️" }
    if (overallScore >= 40) return { status: "Niestabilny", color: "text-gray-800", icon: "⚠️" }
    return { status: "Krytyczny", color: "text-gray-800", icon: "💀" }
  }

  const stats = useMemo(() => {
    if (results.length === 0) return null

    const totalDuration = results.reduce((sum, result) => sum + result.duration, 0)
    const averageDuration = totalDuration / results.length
    const longestSimulation = results.reduce(
      (max, result) => (result.duration > max.duration ? result : max),
      results[0],
    )
    const shortestSimulation = results.reduce(
      (min, result) => (result.duration < min.duration ? result : min),
      results[0],
    )

    const sortedDurations = [...results].map((r) => r.duration).sort((a, b) => a - b)
    const middle = Math.floor(sortedDurations.length / 2)
    const medianDuration =
      sortedDurations.length % 2 !== 0
        ? sortedDurations[middle]
        : (sortedDurations[middle - 1] + sortedDurations[middle]) / 2

    const biomeCounts = results.reduce(
      (acc, result) => {
        acc[result.settings.biome] = (acc[result.settings.biome] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const endReasons = results.reduce(
      (acc, result) => {
        acc[result.endReason] = (acc[result.endReason] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const maxAnimals = Math.max(...results.map((r) => r.maxPopulations.animals))
    const maxPlants = Math.max(...results.map((r) => r.maxPopulations.plants))

    const totalFinalAnimals = results.reduce((sum, result) => sum + result.finalStats.animals, 0)
    const averagePopulation = Math.round(totalFinalAnimals / results.length)

    return {
      totalDuration,
      averageDuration,
      longestSimulation,
      shortestSimulation,
      medianDuration,
      biomeCounts,
      endReasons,
      maxAnimals,
      maxPlants,
      averagePopulation,
      totalSimulations: results.length,
    }
  }, [results])

  return (
    <div
      className="min-h-screen bg-fixed"
      style={{
        backgroundImage: "url('/background-menu.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 w-full max-w-screen-md px-3 sm:px-4 z-50">
        <div className="flex items-center justify-between bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-6 py-3 sm:py-3 border-green-100/20 shadow-md mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg">
          <Button
            onClick={onBack}
            className="rounded-full px-4 sm:px-4 py-2 sm:py-1 hover:text-green-600 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-1000 text-white text-sm sm:text-sm h-9 sm:h-8 min-w-[90px] sm:min-w-[110px] transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
            Powrót
          </Button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <BarChart3 className="w-6 h-6 sm:w-6 sm:h-6 text-green-600" />
            <span className="text-base sm:text-lg font-semibold text-green-700">Statystyki</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 sm:pt-28 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">
              Statystyki
              <span className="block text-green-600">Symulacji</span>
            </h1>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Analiza wszystkich przeprowadzonych symulacji i ich wyników
            </p>
          </div>

          {results.length === 0 ? (
            <div
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg animate-slide-up flex flex-col items-center justify-center"
              style={{ animationDelay: "100ms", minHeight: "400px" }}
            >
              <img src="/no-simulations.png" alt="Brak symulacji" className="w-72 h-72 mb-6 object-contain" />
              <p className="text-xl sm:text-2xl font-bold text-gray-800">Brak przeprowadzonych symulacji</p>
              <p className="text-gray-700 text-base sm:text-md mt-2">
                Rozpocznij nową symulację, aby zobaczyć statystyki
              </p>
            </div>
          ) : (
            <>
              {/* Stats*/}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-8 h-8 mr-3 text-purple-500 group-hover:text-purple-600 transition-colors duration-300" />
                    <h3 className="text-xl font-bold text-gray-800">Średni czas</h3>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{formatTime(stats.averageDuration)}</div>
                  <p className="text-sm text-gray-800 mt-2">Mediana: {formatTime(stats.medianDuration)}</p>
                </div>

                <div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="flex items-center mb-4">
                    <Clock className="w-8 h-8 mr-3 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                    <h3 className="text-xl font-bold text-gray-800">Łączny czas</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{formatTime(stats.totalDuration)}</div>
                  <p className="text-sm text-gray-800 mt-2">Wszystkie symulacje</p>
                </div>

                <div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="flex items-center mb-4">
                    <Leaf className="w-8 h-8 mr-3 text-emerald-500 group-hover:text-emerald-600 transition-colors duration-300" />
                    <h3 className="text-xl font-bold text-gray-800">Rekord roślin</h3>
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">{stats.maxPlants}</div>
                  <p className="text-sm text-gray-800 mt-2">Maksymalna ilość</p>
                </div>

                <div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group"
                  style={{ animationDelay: "400ms" }}
                >
                  <div className="flex items-center mb-4">
                    <PawPrint className="w-8 h-8 mr-3 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" />
                    <h3 className="text-xl font-bold text-gray-800">Średnia populacja</h3>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{stats.averagePopulation}</div>
                  <p className="text-sm text-gray-800 mt-2">Średnia ilość</p>
                </div>
              </div>

              {/* Records */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group"
                  style={{ animationDelay: "500ms" }}
                >
                  <div className="flex items-center mb-6">
                    <Trophy className="w-8 h-8 mr-3 text-yellow-500 group-hover:text-yellow-600 transition-colors duration-300" />
                    <h2 className="text-2xl font-bold text-gray-800">Rekordy</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-3xl p-4 border border-yellow-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-yellow-800 flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          Najdłuższa symulacja
                        </span>
                        <Badge className="bg-yellow-500/20 text-yellow-800 hover:bg-yellow-500/30">
                          {formatTime(stats.longestSimulation.duration)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-800">
                        <p>{formatDate(stats.longestSimulation.startTime)}</p>
                        <p>Końcowe zwierzęta: {stats.longestSimulation.finalStats.animals}</p>
                        <p className={`${getEcosystemHealth(stats.longestSimulation).color}`}>
                          Stan: {getEcosystemHealth(stats.longestSimulation).status}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl p-4 border border-blue-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-blue-800 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Najkrótsza symulacja
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-800 hover:bg-blue-500/30">
                          {formatTime(stats.shortestSimulation.duration)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-800">
                        <p>{formatDate(stats.shortestSimulation.startTime)}</p>
                        <p>Powód: {stats.shortestSimulation.endReason}</p>
                        <p className={`${getEcosystemHealth(stats.shortestSimulation).color}`}>
                          Stan: {getEcosystemHealth(stats.shortestSimulation).status}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl p-4 border border-green-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-800 flex items-center">
                          <PawPrint className="w-4 h-4 mr-2" />
                          Największa populacja
                        </span>
                        <Badge className="bg-green-500/20 text-green-800 hover:bg-green-500/30">
                          {stats.maxAnimals} zwierząt
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-800">
                        {(() => {
                          const maxPopResult = results.find(
                            (r) =>
                              r.maxPopulations.animals === Math.max(...results.map((r) => r.maxPopulations.animals)),
                          )
                          return maxPopResult ? (
                            <>
                              <p>{formatDate(maxPopResult.startTime)}</p>
                              <p>Czas trwania: {formatTime(maxPopResult.duration)}</p>
                              <p className={`${getEcosystemHealth(maxPopResult).color}`}>
                                Stan: {getEcosystemHealth(maxPopResult).status}
                              </p>
                            </>
                          ) : null
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group"
                  style={{ animationDelay: "600ms" }}
                >
                  <div className="flex items-center mb-6">
                    <BarChart3 className="w-8 h-8 mr-3 text-pink-500 group-hover:text-pink-600 transition-colors duration-300" />
                    <h2 className="text-2xl font-bold text-gray-800">Powody zakończenia</h2>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(stats.endReasons)
                      .sort(([, a], [, b]) => b - a)
                      .map(([reason, count]) => (
                        <div key={reason} className="rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-800 font-medium">{reason}</span>
                            <span className="text-sm font-medium">
                              {count} ({((count / stats.totalSimulations) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-300/30 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${(count / stats.totalSimulations) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Best scores */}
              <div
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up mb-8 group"
                style={{ animationDelay: "700ms" }}
              >
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 mr-3 text-red-500 group-hover:text-red-600 transition-colors duration-300" />
                  <h2 className="text-2xl font-bold text-gray-800">Najlepsze wyniki</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...results]
                    .sort((a, b) => {
                      const scoreA = a.duration + a.finalStats.animals * 10000
                      const scoreB = b.duration + b.finalStats.animals * 10000
                      return scoreB - scoreA
                    })
                    .slice(0, 3)
                    .map((result, index) => {
                      const health = getEcosystemHealth(result)
                      return (
                        <div
                          key={result.startTime}
                          className={`bg-gradient-to-br rounded-3xl p-4 shadow-md ${
                            index === 0
                              ? "from-yellow-500/20 to-yellow-600/30 border-yellow-500/30"
                              : index === 1
                                ? "from-gray-400/20 to-gray-500/30 border-gray-400/30"
                                : "from-amber-700/20 to-amber-800/30 border-amber-700/30"
                          } border`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <span className="text-2xl mr-2">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                              <span className="font-bold text-gray-900">
                                {index === 0 ? "Złoto" : index === 1 ? "Srebro" : "Brąz"}
                              </span>
                            </div>
                            <Badge className="bg-white/20 text-gray-900 hover:bg-white/30">
                              {formatTime(result.duration)}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-800">Zwierzęta:</span>
                              <span className="font-medium">{result.finalStats.animals}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-800">Rośliny:</span>
                              <span className="font-medium">{result.finalStats.plants}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-800">Stan:</span>
                              <span className={`font-medium`}>
                                {health.icon} {health.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-800">Data:</span>
                              <span className="font-medium">{formatDate(result.startTime)}</span>
                            </div>
                            <div className="text-xs text-gray-800 mt-2 italic">{result.endReason}</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* History */}
              <div
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up group"
                style={{ animationDelay: "800ms" }}
              >
                <div className="flex items-center mb-6">
                  <History className="w-8 h-8 mr-3 text-lime-500 group-hover:text-lime-600 transition-colors duration-300" />
                  <h2 className="text-2xl font-bold text-gray-800">Historia symulacji</h2>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-3 text-gray-800 font-medium">Data</th>
                        <th className="text-left p-3 text-gray-800 font-medium">Czas</th>
                        <th className="text-left p-3 text-gray-800 font-medium">Stan ekosystemu</th>
                        <th className="text-left p-3 text-gray-800 font-medium">Zakończenie</th>
                        <th className="text-left p-3 text-gray-800 font-medium">Zwierzęta</th>
                        <th className="text-left p-3 text-gray-800 font-medium">Rośliny</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results
                        .slice()
                        .reverse()
                        .map((result, index) => {
                          const health = getEcosystemHealth(result)
                          return (
                            <tr
                              key={`${result.startTime}-${index}`}
                              className="border-b border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <td className="p-3 whitespace-nowrap text-gray-800">{formatDate(result.startTime)}</td>
                              <td className="p-3 text-gray-800">{formatTime(result.duration)}</td>
                              <td className="p-3">
                                <span className={`inline-flex items-center ${health.color}`}>
                                  {health.icon} {health.status}
                                </span>
                              </td>
                              <td className="p-3 text-gray-800 max-w-[150px] truncate">{result.endReason}</td>
                              <td className="p-3 text-gray-800">{result.finalStats.animals}</td>
                              <td className="p-3 text-gray-800">{result.finalStats.plants}</td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

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

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #1e2939 transparent;
        }

        tbody tr:last-child {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  )
}
