"use client"

import { useState, useEffect } from "react"
import MenuView from "@/components/menu-view"
import SettingsView from "@/components/settings-view"
import SimulationView from "@/components/simulation-view"
import ResultsView from "@/components/results-view"
import InstructionsView from "@/components/info-view"
import StatsView from "@/components/stats-view"
import type { SimulationSettings, SimulationResult } from "@/types/simulation"

type View = "menu" | "settings" | "simulation" | "results" | "stats" | "instructions"

const defaultSettings: SimulationSettings = {
  grassSpawnRate: 0.3,
  insectSpawnRate: 0.2,
  initialSmallCarnivores: 3,
  initialBigCarnivores: 2,
  initialSmallHerbivores: 7,
  initialBigHerbivores: 2,
  initialScavengers: 5,
  initialInsectivores: 4,
  lakeCount: 2,
  carcassFreshness: 10000,
  grassFreshness: 15000,
  insectLifespan: 8000,
  mushroomChance: 0.3,
  periodicSpawning: true,
  graphicsMode: true
}

export default function EcosystemSimulation() {
  const [currentView, setCurrentView] = useState<View>("menu")
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings)
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null)

  // Reset scroll position when view changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView])

  const handleStartSimulation = (newSettings: SimulationSettings) => {
    setSettings(newSettings)
    setCurrentView("simulation")
  }

  const handleSimulationEnd = (result: SimulationResult) => {
    setCurrentResult(result)
    setSimulationResults((prev) => [...prev, result])
    setCurrentView("results")
  }

  const handleBackToMenu = () => {
    setCurrentView("menu")
    setCurrentResult(null)
  }

  return (
    <div className="min-h-screen bg-green-50">
      {currentView === "menu" && (
        <MenuView onStart={() => setCurrentView("settings")} onStats={() => setCurrentView("stats")} onInstructions={() => setCurrentView("instructions")} />
      )}

      {currentView === "settings" && (
        <SettingsView settings={settings} onStart={handleStartSimulation} onBack={() => setCurrentView("menu")} />
      )}

      {currentView === "instructions" && <InstructionsView onBack={() => setCurrentView("menu")} />}

      {currentView === "simulation" && (
        <SimulationView
          settings={settings}
          onSimulationEnd={handleSimulationEnd}
          onBack={() => setCurrentView("menu")}
        />
      )}

      {currentView === "results" && currentResult && (
        <ResultsView result={currentResult} onBackToMenu={handleBackToMenu} />
      )}

      {currentView === "stats" && <StatsView results={simulationResults} onBack={() => setCurrentView("menu")} />}
    </div>
  )
}