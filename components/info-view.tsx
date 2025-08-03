"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"

interface InfoViewProps {
  onBack: () => void
}

export default function InfoView({ onBack }: InfoViewProps) {
  return (
    <div
    className="min-h-screen bg-fixed"
    style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
    }}
    >
      {/* Nav */}
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
            <BookOpen className="w-6 h-6 sm:w-6 sm:h-6 text-green-600" />
            <span className="text-base sm:text-lg font-semibold text-green-700">Instrukcja</span>
          </div>
        </div>
      </nav>

      <div className="pt-24 sm:pt-28 px-4 pb-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 animate-slide-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">
              Zasady działania
              <span className="block text-green-600">Symulacji</span>
            </h1>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Poznaj zasady działania ekosystemu i jak korzystać z symulacji
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-lg animate-slide-up">
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                Podstawowe informacje
              </h2>
              <div className="bg-white/30 rounded-3xl p-6 space-y-4">
                <p className="text-gray-800">
                  Symulacja działa w czasie rzeczywistym a jej aktualny stan jest prezentowany na planszy w widoku 2D, gdzie obiekty są reprezentowane w formie kwadratów (wyłączony tryb graficzny) lub obrazków (tryb graficzny).
                </p>
                <p className="text-gray-800">
                  Maksymalny czas trwania symulacji wynosi 10 minut. Celem użytkownika jest zbalansowanie ekosystemu poprzez dobranie odpowiednich ustawień. Stabilność i równowaga danej symulacji jest obliczana i wyświetlana w podsumowaniu symulacji.
                </p>
                <p className="text-gray-800 font-medium">
                  Możliwe stany: Krytyczny, Niestabilny, Stabilny, Zdrowy.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Typy obiektów w symulacji</h2>
              
              <div className="bg-white/30 rounded-3xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  Rośliny:
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <img src="/assets/grass.png" alt="Trawa" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Trawa</span> - Podstawowe pożywienie dla roślinożerców (wartość pokarmowa = 1). Pojawia się co pewien czas na mapie (częstotliwością można sterować poprzez ustawienia - Rośliny&gt;Częstotliwość trawy). Szansa na pojawienie się trawy wynosi 80%.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/seedling.png" alt="Sadzonka" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Sadzonka</span> - Podstawowe pożywienie dla roślinożerców (wartość pokarmowa = 1). Z sadzonki może wyrosnąć roślina, trująca roślina lub drzewo. Pojawia się co pewien czas na mapie. Szansa na pojawienie się sadzonki wynosi 20%.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/plant1.png" alt="Roślina" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Roślina</span> - Stanowi pożywienie dla roślinożerców (wartość pokarmowa = 2). Ma 50% szans na wyrośnięcie z sadzonki. Jeżeli nie zostanie zjedzona, zamieni się w ściółkę.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/plant3.png" alt="Trująca roślina" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Trująca roślina</span> - Po zjedzeniu przez roślinożercę znika, a roślinożerca umiera. Ma 5% szans na wyrośnięcie z sadzonki.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/tree6.png" alt="Drzewo" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Drzewo</span> - Stanowi pożywienie dla roślinożerców (wartość pokarmowa = 5 - regeneruje się). Ma duży rozmiar i blokuje ruch innych obiektów. Szansa na wyrośnięcie z sadzonki wynosi 10%, ale wyrośnie tylko gdy posiada odpowiednio dużo miejsca wokół siebie. Gdy jego czas życia dobiegnie końca, zamienia się w Martwe drzewo.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/dead-tree.png" alt="Martwe drzewo" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Martwe drzewo</span> - Ma duży rozmiar, blokuje ruch innych obiektów i nie stanowi już pożywienia dla roślinożerców. Gdy jego czas życia dobiegnie końca, zamienia się w pień.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/log.png" alt="Pień" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Pień</span> - Ma średni rozmiar i blokuje ruch innych obiektów. Gdy jego czas życia dobiegnie końca, zamienia się w ściółkę.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/litter.png" alt="Ściółka" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Ściółka</span> - Końcowy etap rozkładu roślin. Gdy czas jej życia dobiegnie końca, może zamienić się w grzyby.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/mushroom.png" alt="Grzyby" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Grzyby</span> - Stanowi pożywienie dla roślinożerców (wartość pokarmowa = 2). Może pojawić się na ściółce lub odchodach. Szanse na ich pojawienie można zmienić w ustawieniach (Rośliny&gt;Szansa na grzyby). Domyślnie wynosi 30%.
                    </div>
                  </li>
                </ul>
                <p className="text-gray-800 mt-4">
                  Wszystkie rośliny znikają po tym samym czasie, ustalonym w ustawieniach (Rośliny&gt;Czas świeżości roślin).
                </p>
              </div>

              <div className="bg-white/30 rounded-3xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Zwierzęta:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <img src="/assets/bug6.png" alt="Owad" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Owad</span> - Mały rozmiar, podstawowe pożywienie dla owadożerców i małych mięsożerców (wartość pokarmowa = 1). Czas jego życia można zmienić w ustawieniach (Zwierzęta&gt;Czas życia owadów). Domyślnie wynosi 8 sekund. Pojawia się co pewien czas na mapie (częstotliwością można sterować poprzez ustawienia - Zwierzęta&gt;Częstotliwość owadów)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/insectivore2.png" alt="Owadożerca" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Owadożerca</span> - Żywi się owadami, a sam jest pokarmem dla małych mięsożerców (wartość pokarmowa = 2).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/carnivore-small3.png" alt="Mały mięsożerca" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Mały mięsożerca</span> - Poluje na owadożerców, małe roślinożerne i owady. Jest pokarmem dla dużych mięsozerców (wartość pokarmowa = 3).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/carnivore-big1.png" alt="Duży mięsożerca" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Duży mięsożerca</span> - Poluje na wszystkie mniejsze zwięrzeta (oprócz owadów) i duże roślinożerne. Porusza się wolniej od mniejszych zwierząt i ma większy rozmiar.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/herbivore-small1.png" alt="Mały roślinożerca" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Mały roślinożerca</span> - Żywi się trawą, roślinami, sadzonkami i grzybami. Stanowi pokarm dla mięsożerców (wartość pokarmowa = 3).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/herbivore-big1.png" alt="Duży roślinożerca" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Duży roślinożerca</span> - Żywi się trawą, roślinami, sadzonkami, grzybami i drzewami. Stanowi pokarm dla dużych mięsożerców (wartość pokarmowa = 5). Porusza się wolniej od mniejszych zwierząt i ma większy rozmiar.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/scavenger4.png" alt="Padlinożerca" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Padlinożerca</span> - Żywi się padliną i owadami. Stanowi pokarm dla dużych mięsożerców (wartość pokarmowa = 2).
                    </div>
                  </li>
                </ul>
                <p className="text-gray-800 mt-4">
                  Początkowymi populacjami zwierząt można sterować w ustawieniach (Początkowe Populacje).
                </p>
              </div>

              <div className="bg-white/30 rounded-3xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Inne obiekty:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <img src="/assets/pond1.png" alt="Jezioro" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Jezioro</span> - Źródło wody dla zwierząt. Ma duży rozmiar i blokuje ruch innych obiektów. Każde zwierze (oprócz owadów) musi pić wodę z jezior, aby przeżyć. Ilością jezior na mapie można sterować w ustawieniach (Środowisko&gt;Ilość jezior).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/carcass.png" alt="Padlina" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Padlina</span> - Powstaje po śmierci zwierzęcia. Stanowi pożywienie dla padlinożerców (wartość pokarmowa = 2). Z czasem zamienia się w ściółkę. Czasem świeżości padliny można sterować w ustawieniach (Środowisko&gt;Czas świeżości padliny).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <img src="/assets/faeces.png" alt="Odchody" className="w-8 h-8 mr-3 object-contain" />
                    <div>
                      <span className="font-medium">Odchody</span> - Mogą powstać po zjedzeniu pożywienia przez zwierzę (10% szans). Mogą zamienić się w grzyby (szansa na to wynosi połowę wartości szansy na pojawienie się grzybów).
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white/30 rounded-3xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Łańcuchy pokarmowe</h3>
                <div className="flex justify-center">
                  <img 
                    src="/food-chain.png" 
                    alt="Łańcuchy pokarmowe" 
                    className="max-h-full w-96"
                  />
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">W trakcie symulacji</h2>
              <div className="bg-white/30 rounded-3xl p-6 space-y-4">
                <p className="text-gray-800">
                  W trakcie trwania symulacji można śledzić aktualne statystyki ekosystemu oraz statystyki poszczególnych obiektów. Aby podejrzeć stan i informacje o danym obiekcie należy najechać na ten obiekt kursorem (ta opcja dostępna tylko przy dużych rozdzielczościach ekranu na komputerach).
                </p>

                <div className="mt-6 flex justify-center">
                <video 
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="rounded-3xl shadow-lg max-w-full h-auto mb-12"
                >
                    <source src="/obj-status.mp4" type="video/mp4" />
                    Twoja przeglądarka nie obsługuje tagu video.
                </video>
                </div>

                <p className="text-gray-800">
                  Aktualny stan symulacji wyświetlany jest nad statystykami obok całkowitego czasu trwania symulacji.
                  Symulację można zatrzymać poprzez naciśnięcie przycisku "Pauza" (Spacja).
                </p>

                <div className="mt-6 flex justify-center">
                <video 
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="rounded-3xl shadow-lg max-w-full h-auto"
                >
                    <source src="/sim-status.mp4" type="video/mp4" />
                    Twoja przeglądarka nie obsługuje tagu video.
                </video>
                </div>

              </div>
            </section>

            <section>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Zakończenie symulacji</h2>
              <div className="bg-white/30 rounded-3xl p-6 space-y-4">
                <p className="text-gray-800">
                  Symulacja kończy się automatycznie gdy:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Wymrą wszystkie zwierzęta</li>
                  <li>Wymrą wszystkie roślinożerne zwierzęta (po 10 sekundach od ostatniego)</li>
                  <li>Wymrą wszystkie mięsożerne zwierzęta (po 10 sekundach od ostatniego)</li>
                  <li>Upłynie maksymalny czas symulacji (10 minut)</li>
                </ul>
                <p className="text-gray-800">
                  Użytkownik może również zakończyć symulację ręcznie (przycisk Stop).
                </p>
              </div>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center animate-slide-up">
            <Button
              onClick={onBack}
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
        .animate-slide-up {
          animation: slide-up 0.8s ease-out both;
        }
      `}</style>
    </div>
  )
}