"use client"

import { Button } from "@/components/ui/button"
import {
  Leaf,
  BarChart3,
  TreePine,
  Settings,
  Eye,
  Rabbit,
  Bug,
  Scale,
  Play,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Smile,
} from "lucide-react"
import { useState, useEffect } from "react"

interface MenuViewProps {
  onStart: () => void
  onStats: () => void
  onInstructions: () => void
}

interface Particle {
  left: string
  top: string
  animationDelay: string
  animationDuration: string
}

export default function MenuView({ onStart, onStats, onInstructions }: MenuViewProps) {
  const [currentGraphic, setCurrentGraphic] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isClient, setIsClient] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    setIsClient(true)
    const generateParticles = () => {
      return Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
      }))
    }
    setParticles(generateParticles())
  }, [])

  const graphics = [
    "/hero-section1.png",
    "/hero-section2.png",
    "/hero-section3.png",
    "/hero-section4.png",
    "/hero-section5.png",
    "/hero-section6.png",
    "/hero-section7.png",
    "/hero-section8.png",
    "/hero-section9.png",
    "/hero-section10.png",
    "/hero-section11.png",
    "/hero-section12.png",
    "/hero-section13.png",
    "/hero-section14.png",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentGraphic((prev) => (prev + 1) % graphics.length)
        setIsTransitioning(false)
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [graphics.length])

  const features = [
    {
      icon: TreePine,
      title: "Symuluj ekosystem",
      description: "Obserwuj zachowania, liczebność populacji, rozwój roślinności i wiele więcej",
      gradient: "from-yellow-400 to-lime-600",
    },
    {
      icon: Settings,
      title: "Dostosuj własne środowisko",
      description: "Kontroluj początkowe populacje, procentowe szanse na zjawiska itd.",
      gradient: "from-blue-400 to-cyan-700",
    },
    {
      icon: Eye,
      title: "Podgląd w czasie rzeczywistym",
      description: "Dostęp do statystyk każdego elementu ekosystemu i statystyk",
      gradient: "from-purple-400 to-pink-600",
    },
    {
      icon: Scale,
      title: "Stwórz idealny balans",
      description: "Dopasuj wszystkie parametry środowiska tak, aby było stabilne jak najdłużej",
      gradient: "from-orange-400 to-red-600",
    },
    {
      icon: Smile,
      title: "Baw się dobrze",
      description: "Ciesz się interaktywną symulacją i odkrywaj fascynujący świat natury",
      gradient: "from-gray-400 to-black",
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % features.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [isAutoPlaying, features.length])

  const nextCard = () => {
    setIsAutoPlaying(false) // Pause auto-play when user interacts
    setCurrentCard((prev) => (prev + 1) % features.length)
    setTimeout(() => setIsAutoPlaying(true), 5000) // Resume auto-play after 5 seconds
  }

  const prevCard = () => {
    setIsAutoPlaying(false)
    setCurrentCard((prev) => (prev - 1 + features.length) % features.length)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const handleCardClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentCard(index)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const handleIndicatorClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentCard(index)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const getCardTransform = (index: number) => {
    const diff = index - currentCard
    const translateX = diff * 380
    const translateZ = Math.abs(diff) === 0 ? 0 : -50
    const scale = Math.abs(diff) === 0 ? 1 : 0.8
    const opacity = Math.abs(diff) > 1 ? 0 : Math.abs(diff) === 0 ? 1 : 0.8
    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      zIndex: Math.abs(diff) === 0 ? 10 : 5 - Math.abs(diff),
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: "#a7dfbb" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {isClient &&
            particles.map((particle, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/40 rounded-full animate-float-particle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animationDelay: particle.animationDelay,
                  animationDuration: particle.animationDuration,
                }}
              />
            ))}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-white/40 to-white/60 rounded-full blur-xl animate-pulse-slow" />
          <div
            className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-br from-white/30 to-white/50 rounded-full blur-xl animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          />
        </div>
        {/* Navigation */}
        <nav className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 w-full max-w-screen-md px-3 sm:px-4 z-50">
          <div className="flex items-center justify-between bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-6 py-3 sm:py-3 border-green-100/20 shadow-md mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src="/logo.png" alt="Tree" className="w-9 h-8 object-contain" />
              <span className="text-base sm:text-lg font-semibold text-green-700">Zimori</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-2">
              <Button
                onClick={onStart}
                className="rounded-full px-4 sm:px-4 py-2 sm:py-1 hover:text-gray-900 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white text-sm sm:text-sm h-9 sm:h-8 min-w-[80px] sm:min-w-[90px] transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Play className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
                <span>Start</span>
              </Button>
              <Button
                onClick={onStats}
                className="rounded-full px-3 sm:px-4 py-2 sm:py-1 text-white hover:text-green-600 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-1000 text-sm sm:text-sm h-9 sm:h-8 min-w-[90px] sm:min-w-[110px] transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">Statystyki</span>
                <span className="xs:hidden">Stats</span>
              </Button>
            </div>
          </div>
        </nav>
        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-20 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 items-center min-h-[80vh]">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px]">
                  <div className="absolute inset-0 rounded-full border-gradient-to-r from-green-400 via-emerald-500 to-green-600 opacity-30 animate-spin-slow" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-200/30 to-emerald-300/30 animate-pulse-glow" />
                  <div className="absolute inset-0 rounded-full flex items-center justify-center animate-float-main">
                    <div className="relative">
                      <img
                        src={graphics[currentGraphic] || "/placeholder.svg"}
                        alt="Ecosystem Graphic"
                        className={`w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain transition-all duration-700 ease-in-out transform hover:scale-110 ${
                          isTransitioning ? "opacity-0 scale-95 rotate-12" : "opacity-100 scale-100 rotate-0"
                        }`}
                      />
                      {/* Sparkle Effects */}
                      <div className="absolute top-8 right-8 w-3 h-3 bg-white rounded-full animate-sparkle" />
                      <div
                        className="absolute bottom-12 left-12 w-2 h-2 bg-white rounded-full animate-sparkle"
                        style={{ animationDelay: "1s" }}
                      />
                      <div
                        className="absolute top-1/3 left-8 w-2 h-2 bg-white rounded-full animate-sparkle"
                        style={{ animationDelay: "2s" }}
                      />
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-white/80 to-white rounded-full flex items-center justify-center shadow-lg animate-orbit">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-white/80 to-white rounded-full flex items-center justify-center shadow-lg animate-orbit-reverse">
                    <Rabbit className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="absolute top-1/4 -left-12 w-10 h-10 bg-gradient-to-br from-white/80 to-white rounded-full flex items-center justify-center shadow-lg animate-orbit-slow">
                    <Bug className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
            {/* Right Side - Text */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-text-glow">
                Odkryj reguły
                <span className="block text-green-700 drop-shadow-lg animate-text-wave">Ekosystemu</span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-800 mb-8 leading-relaxed font-medium animate-fade-in-up">
                Przekonaj się, czy najmniejsze zmiany mogą wpłynąć na całość
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow sm:mb-0 mb-12">
          <div className="w-6 h-10 border-2 border-gray-700 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
            <div className="w-1 h-3 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mt-2 animate-scroll-indicator"></div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div
        className="min-h-screen bg-scroll md:bg-scroll"
        style={{
          backgroundImage: "url('/background-menu.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="pt-24 sm:pt-28 px-4 pb-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-lg animate-fade-in">
              Symulacja
              <span className="block text-green-600">w zasięgu ręki</span>
            </h1>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="relative h-[500px] sm:h-[600px] flex items-center justify-center perspective-1000 overflow-hidden">
              <div className="relative w-full max-w-4xl preserve-3d flex items-center justify-center">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon
                  const cardStyle = getCardTransform(index)
                  return (
                    <div
                      key={index}
                      className="absolute w-full max-w-sm transition-all duration-700 ease-in-out cursor-pointer"
                      style={cardStyle}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/20 animate-slide-up">
                        {/* Background */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                        />
                        {/* Icon */}
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        {/* Content */}
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-gray-900 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 transition-colors duration-300">
                          {feature.description}
                        </p>
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-300" />
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Navigation Buttons */}
              <Button
                onClick={prevCard}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hidden sm:block"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                onClick={nextCard}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hidden sm:block"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex justify-center space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentCard ? "bg-green-600 scale-125" : "bg-black/60 hover:bg-black/80"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-center mt-12 sm:mt-16 animate-slide-up group" style={{ animationDelay: "600ms" }}>
            <Button
              onClick={onStart}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold shadow-xl hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-slow"
            >
              Rozpocznij Symulację
            </Button>
          </div>
          {/* First Time User Section */}
          <div className="max-w-6xl mx-auto mt-12 sm:mt-14">
            <div
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg opacity-0 group"
              style={{
                animation: "fade-in 0.8s ease-out 750ms forwards",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-float">
                      <img src="/book.png" alt="Tree" className="w-20 h-20 object-contain" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-lime-600 rounded-full flex items-center justify-center shadow-lg animate-float-delayed">
                      <img src="/assets/carcass.png" alt="Leaf" className="w-12 h-12 object-contain" />
                    </div>
                    <div className="absolute -bottom-0 -right-3 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-700 rounded-full flex items-center justify-center shadow-lg animate-float-slow">
                      <img src="/assets/seedling.png" alt="Eye" className="w-9 h-9 object-contain" />
                    </div>
                    <div className="absolute top-1/2 -left-8 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-float-reverse">
                      <img src="/assets/bug6.png" alt="Scale" className="w-7 h-7 object-contain" />
                    </div>
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Nie wiesz jak działa ekosystem?
                  </h2>
                  <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    Zapoznaj się z prostą instrukcją, która pomoże Ci zrozumieć podstawy funkcjonowania ekosystemu i jak
                    korzystać z naszej symulacji.
                  </p>
                  <Button
                    onClick={onInstructions}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Instrukcja
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="text-center pb-6 px-4">
          <p className="text-white/50 text-sm sm:text-base font-medium drop-shadow-lg">Wykonał Hubert Jędruchniewicz</p>
        </footer>
      </div>
      {/* Custom Styles */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
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
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
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
        
        @keyframes float-main {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
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
        
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.9;
          }
        }
        
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
          }
        }
        
        @keyframes orbit-reverse {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(-360deg) translateX(40px) rotate(360deg);
          }
        }
        
        @keyframes orbit-slow {
          0% {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }
        
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4);
          }
        }
        
        @keyframes text-wave {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-cta {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-10px) translateX(-50%);
          }
        }
        
        @keyframes scroll-indicator {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(16px);
            opacity: 0;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1.2s ease-out 0.3s both;
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
        
        .animate-float-main {
          animation: float-main 4s ease-in-out infinite;
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
        
        .animate-float-particle {
          animation: float-particle 6s ease-in-out infinite;
        }
        
        .animate-orbit {
          animation: orbit 8s linear infinite;
        }
        
        .animate-orbit-reverse {
          animation: orbit-reverse 10s linear infinite;
        }
        
        .animate-orbit-slow {
          animation: orbit-slow 12s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-text-wave {
          animation: text-wave 2s ease-in-out infinite 0.5s;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-scroll-indicator {
          animation: scroll-indicator 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
