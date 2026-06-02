'use client';
import { useState } from 'react';
import { X, Loader2, BarChart2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import ResultsList from '@/components/ResultsList';
import PropertyDetail from '@/components/PropertyDetail';
import SourceLinks from '@/components/SourceLinks';

export default function HomePage() {
  const {
    showFilters,
    selectedProperty,
    setSelectedProperty,
    analyzeArea,
    setAnalysisCity,
    analysisCity,
    analysis,
    isAnalyzing,
  } = useAppStore();

  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = (city: string) => {
    setSelectedProperty(null);
    setAnalysisCity(city);
    setShowAnalysis(true);
    analyzeArea(city);
  };

  const analysisSections = analysis
    ? [
        { title: '👥 אוכלוסייה', content: analysis.population },
        {
          title: '🎓 חינוך',
          content: [
            `גנים: ${analysis.education.kindergartens}`,
            `יסודי: ${analysis.education.elementarySchools}`,
            `תיכון: ${analysis.education.highSchools}`,
            `רמה כללית: ${analysis.education.level}`,
          ].join('\n'),
        },
        { title: '🎓 אקדמיים', content: analysis.academics },
        { title: '🏗 שכונות חדשות', content: analysis.newNeighborhoods },
        { title: '🚨 רמת פשיעה', content: analysis.crimeLevel },
        { title: '🏫 אלימות בבתי ספר', content: analysis.schoolViolence },
        { title: '🛡 ביטחון עירוני', content: analysis.cityViolence },
        { title: '🕌 נוכחות ערבים / בדואים', content: analysis.arabBedouinPresence },
        { title: '🏥 מרפאות וקופות חולים', content: analysis.medicalCenters },
        { title: '📚 גודל כיתה', content: analysis.classSize },
        { title: '♿ חינוך מיוחד', content: analysis.specialEducation },
        {
          title: '💰 מחירי נדל"ן',
          content: [
            `חדש 5 חד׳: ${analysis.prices.newApartment5rooms}`,
            `חדש 6 חד׳: ${analysis.prices.newApartment6rooms}`,
            `יד שניה 5 חד׳: ${analysis.prices.secondHandApartment5rooms}`,
            `יד שניה 6 חד׳: ${analysis.prices.secondHandApartment6rooms}`,
          ].join('\n'),
        },
        { title: '🕍 חרדים / חילוניים', content: analysis.ultraOrthodox },
        { title: '🏘 שכונות מומלצות', content: analysis.recommendedNeighborhoods },
        { title: '🆕 שכונות חדשות', content: analysis.newNeighborhoodsList },
        { title: '💼 תעסוקה לאקדמיים', content: analysis.academicEmployment },
        { title: '⚙️ תעסוקה למהנדסים', content: analysis.engineerEmployment },
        { title: '💵 הטבות מס', content: analysis.taxBenefits },
        { title: '🛡 קרבה לגבול / ביטחון', content: analysis.borderProximity },
      ]
    : [];

  // Right panel is open when property selected OR analysis panel open
  const rightPanelOpen = !!selectedProperty || showAnalysis;

  return (
    /**
     * Desktop: h-screen, flex column (header + body)
     * Mobile: normal scrolling page
     */
    <div className="min-h-screen lg:h-screen lg:flex lg:flex-col bg-gray-50">

      {/* ── HEADER (full width) ───────────────────────────────────── */}
      <header className="shrink-0 bg-white border-b border-gray-200 shadow-sm z-30">
        <div className="flex items-center gap-4 px-4 lg:px-6 py-3" dir="rtl">
          {/* Logo */}
          <h1 className="text-xl font-black text-blue-700 tracking-tight shrink-0">
            Scout <span className="text-gray-400 font-normal text-sm hidden sm:inline">נדל&quot;ן</span>
          </h1>

          {/* Search bar — grows to fill */}
          <div className="flex-1">
            <SearchBar />
          </div>

          {/* Analysis button */}
          <button
            onClick={() => { setSelectedProperty(null); setShowAnalysis(true); }}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors whitespace-nowrap"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ניתוח ישוב</span>
            <span className="sm:hidden">ניתוח</span>
          </button>
        </div>

        {/* Source links strip */}
        <div className="px-4 lg:px-6 pb-2.5">
          <SourceLinks />
        </div>
      </header>

      {/* ── BODY (sidebar + results + right panel) ───────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT SIDEBAR — filters (desktop only, always visible) */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 xl:w-80 shrink-0 border-l border-gray-200 bg-gray-50 overflow-hidden">
          <FilterPanel variant="sidebar" />
        </aside>

        {/* CENTER — results (scrollable) */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 lg:px-6 py-4">
            <ResultsList />
          </div>
        </main>

        {/* RIGHT PANEL — property detail or area analysis (desktop) */}
        {rightPanelOpen && (
          <aside className="hidden lg:flex lg:flex-col lg:w-[400px] xl:w-[440px] shrink-0 border-r border-gray-200 bg-white overflow-hidden">
            {selectedProperty ? (
              <PropertyDetail
                property={selectedProperty}
                onClose={() => setSelectedProperty(null)}
                onAnalyze={handleAnalyze}
                variant="panel"
              />
            ) : (
              <AnalysisPanel
                analysisCity={analysisCity}
                setAnalysisCity={setAnalysisCity}
                analyzeArea={analyzeArea}
                isAnalyzing={isAnalyzing}
                analysis={analysisSections}
                analysisName={analysis?.city}
                onClose={() => setShowAnalysis(false)}
              />
            )}
          </aside>
        )}
      </div>

      {/* ── MOBILE OVERLAYS (hidden on desktop) ──────────────────── */}

      {/* Mobile: filter overlay */}
      {showFilters && (
        <div className="lg:hidden">
          <FilterPanel variant="overlay" />
        </div>
      )}

      {/* Mobile: property detail overlay */}
      {selectedProperty && (
        <div className="lg:hidden">
          <PropertyDetail
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onAnalyze={handleAnalyze}
            variant="overlay"
          />
        </div>
      )}

      {/* Mobile: analysis overlay */}
      {showAnalysis && (
        <div className="lg:hidden fixed inset-0 z-50">
          <AnalysisPanel
            analysisCity={analysisCity}
            setAnalysisCity={setAnalysisCity}
            analyzeArea={analyzeArea}
            isAnalyzing={isAnalyzing}
            analysis={analysisSections}
            analysisName={analysis?.city}
            onClose={() => setShowAnalysis(false)}
          />
        </div>
      )}
    </div>
  );
}

/* ── Analysis panel — used in both desktop right-panel and mobile overlay ── */
interface AnalysisPanelProps {
  analysisCity: string;
  setAnalysisCity: (c: string) => void;
  analyzeArea: (c: string) => void;
  isAnalyzing: boolean;
  analysis: { title: string; content: string }[];
  analysisName?: string;
  onClose: () => void;
}

function AnalysisPanel({
  analysisCity,
  setAnalysisCity,
  analyzeArea,
  isAnalyzing,
  analysis,
  analysisName,
  onClose,
}: AnalysisPanelProps) {
  return (
    <div className="h-full bg-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-purple-600 text-white shrink-0">
        <h2 className="font-bold text-sm">ניתוח ישוב</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-purple-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* City input */}
      <div className="px-4 py-3 border-b bg-purple-50 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="הכנס שם עיר / ישוב..."
            value={analysisCity}
            onChange={(e) => setAnalysisCity(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-right bg-white"
            dir="rtl"
            onKeyDown={(e) => { if (e.key === 'Enter' && analysisCity) analyzeArea(analysisCity); }}
          />
          <button
            onClick={() => analysisCity && analyzeArea(analysisCity)}
            disabled={isAnalyzing || !analysisCity}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-bold disabled:opacity-60 hover:bg-purple-700 transition-colors flex items-center gap-1.5"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'נתח'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-purple-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-sm font-medium">מנתח נתונים על {analysisCity}...</p>
            <p className="text-xs text-gray-400">כ-20 שניות</p>
          </div>
        )}

        {!isAnalyzing && analysis.length > 0 && (
          <div className="space-y-3">
            {analysisName && <h1 className="text-lg font-bold text-gray-900">{analysisName}</h1>}
            {analysis.map((s) => (
              <div key={s.title} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs font-bold text-gray-700 mb-1">{s.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
        )}

        {!isAnalyzing && analysis.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <span className="text-5xl">🔍</span>
            <p className="text-sm font-medium">הכנס שם עיר לניתוח מקיף</p>
            <p className="text-xs text-center text-gray-300 max-w-xs">
              אוכלוסייה · חינוך · פשיעה · מחירים · תעסוקה · הטבות מס
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
