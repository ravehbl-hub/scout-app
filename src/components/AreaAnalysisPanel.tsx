'use client';
import { X, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AreaAnalysisPanel() {
  const { analysis, isAnalyzing, analysisCity, setAnalysisCity, analyzeArea } = useAppStore();

  const sections = analysis
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
        { title: '🚨 פשיעה', content: analysis.crimeLevel },
        { title: '🏫 אלימות בבתי ספר', content: analysis.schoolViolence },
        { title: '🛡 ביטחון עירוני', content: analysis.cityViolence },
        { title: '🕌 ערבים / בדואים', content: analysis.arabBedouinPresence },
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
        { title: '🛡 ביטחון / גבול', content: analysis.borderProximity },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-purple-600 text-white">
        <h2 className="font-bold text-base">ניתוח ישוב</h2>
        <button
          onClick={() => useAppStore.getState().setSelectedProperty(null)}
          className="p-1.5 rounded-lg hover:bg-purple-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search city */}
      <div className="px-4 py-3 border-b border-gray-100 bg-purple-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="הכנס שם עיר / ישוב..."
            value={analysisCity}
            onChange={(e) => setAnalysisCity(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 text-right"
            dir="rtl"
            onKeyDown={(e) => e.key === 'Enter' && analysisCity && analyzeArea(analysisCity)}
          />
          <button
            onClick={() => analysisCity && analyzeArea(analysisCity)}
            disabled={isAnalyzing || !analysisCity}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-bold disabled:opacity-60 hover:bg-purple-700 transition-colors"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'נתח'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-purple-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-sm font-medium">מנתח נתונים על {analysisCity}...</p>
            <p className="text-xs text-gray-400">זה עלול לקחת כ-20 שניות</p>
          </div>
        )}

        {!isAnalyzing && analysis && (
          <div className="space-y-3">
            <h1 className="text-xl font-bold text-gray-900">{analysis.city}</h1>
            <div className="grid grid-cols-1 gap-3">
              {sections.map((s) => (
                <div key={s.title} className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-sm font-bold text-gray-700 mb-1">{s.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isAnalyzing && !analysis && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
            <span className="text-5xl">🔍</span>
            <p className="text-sm">הכנס שם עיר כדי לקבל ניתוח מקיף</p>
          </div>
        )}
      </div>
    </div>
  );
}
