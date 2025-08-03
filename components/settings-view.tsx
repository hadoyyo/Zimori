"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Settings, TreePine, Bug, Flower2, Mountain, Rabbit, Image } from "lucide-react"
import type { SimulationSettings } from "@/types/simulation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SettingsViewProps {
  settings: SimulationSettings
  onStart: (settings: SimulationSettings) => void
  onBack: () => void
}

export default function SettingsView({ settings, onStart, onBack }: SettingsViewProps) {
  const [currentSettings, setCurrentSettings] = useState<SimulationSettings>({
    ...settings,
    biome: settings.biome || "forest",
  })

  const updateSetting = (key: keyof SimulationSettings, value: number | boolean | string) => {
    setCurrentSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      return newSettings
    })
  }

  const handleSliderChange = (key: keyof SimulationSettings) => (value: number[]) => {
    updateSetting(key, value[0])
  }

  const msToSeconds = (ms: number) => {
    return (ms / 1000).toFixed(1)
  }

  return (
    <div
      className="min-h-screen bg-fixed md:bg-scroll"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 w-full max-w-screen-md px-3 sm:px-4 z-50">
        <div className="flex items-center justify-between bg-white/30 backdrop-blur-lg rounded-full px-4 sm:px-6 py-3 sm:py-3 border-green-100/20 shadow-md mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg">
          <Button
            onClick={onBack}
            className="rounded-full px-4 sm:px-4 py-2 sm:py-1 hover:text-green-600 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-1000 text-white text-sm sm:text-sm h-9 sm:h-8 min-w-[90px] sm:min-w-[110px] transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
            Powrót
          </Button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Settings className="w-6 h-6 sm:w-6 sm:h-6 text-green-600" />
            <span className="text-base sm:text-lg font-semibold text-green-700">Ustawienia</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 sm:pt-28 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">
              Dostosuj Swój
              <span className="block text-green-600">Ekosystem</span>
            </h1>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Skonfiguruj parametry symulacji aby stworzyć idealny balans w swoim wirtualnym ekosystemie
            </p>
          </div>

          <div 
            className="relative mb-6 bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/25 animate-slide-up group"
            style={{ animationDelay: "100ms" }}
          >
            <CardTitle className="flex items-center text-2xl font-bold text-gray-800 sm:mb-4 mb-3">
                <Rabbit className="w-8 h-8 mr-3 text-red-600 group-hover:text-red-500 transition-colors duration-300" />
                Początkowe Populacje
            </CardTitle>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-gray-800 font-medium">
                  Małe mięsożerne: {currentSettings.initialSmallCarnivores}
                </Label>
                <Slider
                  value={[currentSettings.initialSmallCarnivores]}
                  onValueChange={handleSliderChange("initialSmallCarnivores")}
                  max={10}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-800 font-medium">
                  Duże mięsożerne: {currentSettings.initialBigCarnivores}
                </Label>
                <Slider
                  value={[currentSettings.initialBigCarnivores]}
                  onValueChange={handleSliderChange("initialBigCarnivores")}
                  max={5}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-800 font-medium">
                  Małe roślinożerne: {currentSettings.initialSmallHerbivores}
                </Label>
                <Slider
                  value={[currentSettings.initialSmallHerbivores]}
                  onValueChange={handleSliderChange("initialSmallHerbivores")}
                  max={15}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-800 font-medium">
                  Duże roślinożerne: {currentSettings.initialBigHerbivores}
                </Label>
                <Slider
                  value={[currentSettings.initialBigHerbivores]}
                  onValueChange={handleSliderChange("initialBigHerbivores")}
                  max={8}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-800 font-medium">Owadożerne: {currentSettings.initialInsectivores}</Label>
                <Slider
                  value={[currentSettings.initialInsectivores]}
                  onValueChange={handleSliderChange("initialInsectivores")}
                  max={10}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-800 font-medium">Padlinożercy: {currentSettings.initialScavengers}</Label>
                <Slider
                  value={[currentSettings.initialScavengers]}
                  onValueChange={handleSliderChange("initialScavengers")}
                  max={8}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div 
              className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/25 animate-slide-up group"
              style={{ animationDelay: "200ms" }}
            >
              <CardTitle className="flex items-center text-2xl font-bold text-gray-800 sm:mb-4 mb-3">
                <Flower2 className="w-8 h-8 mr-3 text-green-600 group-hover:text-emerald-500 transition-colors duration-300" />
                Rośliny
              </CardTitle>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">
                    Częstotliwość trawy: {currentSettings.grassSpawnRate.toFixed(2)}
                  </Label>
                  <Slider
                    value={[currentSettings.grassSpawnRate]}
                    onValueChange={handleSliderChange("grassSpawnRate")}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">
                    Czas świeżości roślin: {msToSeconds(currentSettings.grassFreshness)}s
                  </Label>
                  <Slider
                    value={[currentSettings.grassFreshness]}
                    onValueChange={handleSliderChange("grassFreshness")}
                    max={30000}
                    min={5000}
                    step={1000}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">
                    Szansa na grzyby: {(currentSettings.mushroomChance * 100).toFixed(0)}%
                  </Label>
                  <Slider
                    value={[currentSettings.mushroomChance]}
                    onValueChange={handleSliderChange("mushroomChance")}
                    max={1}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div 
              className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/25 animate-slide-up group"
              style={{ animationDelay: "300ms" }}
            >
              <CardTitle className="flex items-center text-2xl font-bold text-gray-800 sm:mb-4 mb-3">
                <Bug className="w-8 h-8 mr-3 text-yellow-600 group-hover:text-orange-500 transition-colors duration-300" />
                Zwierzęta
              </CardTitle>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">
                    Częstotliwość owadów: {currentSettings.insectSpawnRate.toFixed(2)}
                  </Label>
                  <Slider
                    value={[currentSettings.insectSpawnRate]}
                    onValueChange={handleSliderChange("insectSpawnRate")}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">
                    Czas życia owadów: {msToSeconds(currentSettings.insectLifespan)}s
                  </Label>
                  <Slider
                    value={[currentSettings.insectLifespan]}
                    onValueChange={handleSliderChange("insectLifespan")}
                    max={20000}
                    min={3000}
                    step={1000}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div 
              className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/25 animate-slide-up group"
              style={{ animationDelay: "400ms" }}
            >
              <CardTitle className="flex items-center text-2xl font-bold text-gray-800 sm:mb-4 mb-3">
                <Mountain className="w-8 h-8 mr-3 text-blue-600 group-hover:text-blue-500 transition-colors duration-300" />
                Środowisko
              </CardTitle>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">Ilość jezior: {currentSettings.lakeCount}</Label>
                  <Slider
                    value={[currentSettings.lakeCount]}
                    onValueChange={handleSliderChange("lakeCount")}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-gray-800 font-medium">
                    Czas świeżości padliny: {msToSeconds(currentSettings.carcassFreshness)}s
                  </Label>
                  <Slider
                    value={[currentSettings.carcassFreshness]}
                    onValueChange={handleSliderChange("carcassFreshness")}
                    max={20000}
                    min={5000}
                    step={1000}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div 
              className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/25 animate-slide-up group"
              style={{ animationDelay: "500ms" }}
            >
              <CardTitle className="flex items-center text-2xl font-bold text-gray-800 sm:mb-4 mb-3">
                <Image className="w-8 h-8 mr-3 text-purple-600 group-hover:text-pink-500 transition-colors duration-300" />
                Inne Ustawienia
              </CardTitle>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg">
                  <Switch
                    id="graphics-mode"
                    checked={currentSettings.graphicsMode}
                    onCheckedChange={(val) => updateSetting("graphicsMode", val)}
                  />
                  <Label htmlFor="graphics-mode" className="text-gray-800 font-medium">
                    Tryb graficzny
                  </Label>
                </div>

                {currentSettings.graphicsMode && (
                  <div className="space-y-4 p-4 rounded-lg animate-fade-in">
                    <Label className="text-gray-800 font-medium">Wybierz wygląd:</Label>
                    <RadioGroup
                      value={currentSettings.biome}
                      onValueChange={(value) => updateSetting("biome", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/30 transition-colors duration-300">
                        <RadioGroupItem value="forest" id="forest" />
                        <Label htmlFor="forest" className="text-gray-800 font-medium flex items-center">
                          <TreePine className="w-4 h-4 mr-2 text-green-800" />
                          Las
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/30 transition-colors duration-300">
                        <RadioGroupItem value="savanna" id="savanna" />
                        <Label htmlFor="savanna" className="text-gray-800 font-medium flex items-center">
                          <Mountain className="w-4 h-4 mr-2 text-yellow-600" />
                          Sawanna
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center animate-slide-up group" style={{ animationDelay: "600ms" }}>
            <Button
              onClick={() => {
                onStart(currentSettings)
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold shadow-xl hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-slow"
            >
              Rozpocznij Symulację
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
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(10px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(-5px);
          }
          50% {
            transform: translateY(5px);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite 1s;
        }
        .animate-float-reverse {
          animation: float-reverse 3.5s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  )
}