import React from 'react';
import { Ward, AQICategory } from '../types';
import { Heart, Activity, Wind, Info, MapPin, AlertTriangle, ShieldCheck, Navigation } from 'lucide-react';

interface CitizenViewProps {
  wards: Ward[];
  selectedWardId?: string | null;
}

const CitizenView: React.FC<CitizenViewProps> = ({ wards, selectedWardId }) => {
  // Use selected ward or default to the first one (simulating user location)
  const localWard = wards.find(w => w.id === selectedWardId) || wards[0]; 

  const getHealthAdvice = (category: AQICategory) => {
    switch(category) {
        case AQICategory.SEVERE: return "Avoid all outdoor physical activities. Wear N95 masks if stepping out is necessary.";
        case AQICategory.POOR: return "Reduce prolonged or heavy exertion. Take more breaks during all outdoor activities.";
        case AQICategory.MODERATE: return "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
        case AQICategory.GOOD: return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
    }
  };

  const getAQIColorClass = (category: AQICategory) => {
      switch(category) {
          case AQICategory.SEVERE: return 'text-red-600 bg-red-50 border-red-100';
          case AQICategory.POOR: return 'text-orange-600 bg-orange-50 border-orange-100';
          case AQICategory.MODERATE: return 'text-yellow-600 bg-yellow-50 border-yellow-100';
          case AQICategory.GOOD: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      }
  };

  // Simulate proximity based on grid coordinates
  const calculateDistance = (w1: Ward, w2: Ward) => {
      const dx = w1.center[0] - w2.center[0];
      const dy = w1.center[1] - w2.center[1];
      return Math.sqrt(dx * dx + dy * dy);
  };

  const nearbyWards = wards
    .filter(w => w.id !== localWard.id)
    .map(w => ({ ...w, distance: calculateDistance(localWard, w) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Get closest 5

  const hotspots = nearbyWards.filter(w => w.aqi > 150);
  const safeZones = nearbyWards.filter(w => w.aqi <= 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header / Location Context */}
      <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm">
          <Navigation size={14} className="text-blue-500" />
          <span>Showing citizen insights for <strong>{localWard.name}</strong></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Health Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
                <div className={`p-8 text-white ${
                    localWard.category === AQICategory.SEVERE ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    localWard.category === AQICategory.POOR ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                    localWard.category === AQICategory.MODERATE ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : 
                    'bg-gradient-to-br from-emerald-400 to-emerald-500'
                }`}>
                    <h2 className="text-lg font-medium opacity-90 mb-1">Current Air Quality</h2>
                    <h1 className="text-3xl font-bold mb-6">{localWard.name}</h1>
                    
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
                            <span className="text-5xl font-black tracking-tight">{localWard.aqi}</span>
                            <span className="block text-xs font-bold uppercase tracking-wider opacity-80">US AQI</span>
                        </div>
                        <div className="text-lg font-medium uppercase tracking-wide bg-black/10 px-4 py-1 rounded-lg">
                            {localWard.category}
                        </div>
                    </div>
                    
                    <p className="mt-6 opacity-95 text-sm font-medium leading-relaxed bg-black/10 p-3 rounded-lg border border-white/10">
                        <Info size={16} className="inline mr-2 mb-0.5" />
                        {getHealthAdvice(localWard.category)}
                    </p>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Heart className="text-red-500 fill-red-500" /> Personalized Recommendations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
                            <div className="bg-white p-2 rounded-full shadow-sm text-blue-500"><Wind size={18} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Ventilation Guide</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    {localWard.category === AQICategory.GOOD 
                                    ? "Great time to open windows and ventilate your home."
                                    : "Keep windows closed. Use air purifiers if available."}
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 hover:border-green-200 transition-colors">
                            <div className="bg-white p-2 rounded-full shadow-sm text-green-500"><Activity size={18} /></div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Outdoor Activity</h4>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                     {localWard.category === AQICategory.SEVERE 
                                    ? "Avoid outdoor exercise. Indoor gyms recommended."
                                    : "Enjoy outdoor activities, but stay hydrated."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Local Sources */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Info className="text-blue-500" /> Local Pollution Drivers
                </h3>
                 <div className="flex flex-wrap gap-2">
                    {localWard.primarySources.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                             <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                             {s}
                        </div>
                    ))}
                 </div>
            </div>
          </div>

          {/* Sidebar: Nearby Insights */}
          <div className="space-y-6">
              
              {/* Hotspots */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                      <AlertTriangle className="text-red-600" size={18} />
                      <h3 className="font-bold text-red-900 text-sm">Nearby Hotspots</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                      {hotspots.length > 0 ? hotspots.map(ward => (
                          <div key={ward.id} className="p-4 hover:bg-slate-50 transition-colors">
                              <div className="flex justify-between items-start mb-1">
                                  <div className="font-bold text-slate-800 text-sm">{ward.name}</div>
                                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                      {ward.aqi} AQI
                                  </span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin size={10} /> ~{Math.round(ward.distance! / 10)} km away
                              </div>
                          </div>
                      )) : (
                          <div className="p-6 text-center text-slate-500 text-sm">
                              No severe hotspots detected in immediate vicinity.
                          </div>
                      )}
                  </div>
              </div>

              {/* Safe Zones */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-600" size={18} />
                      <h3 className="font-bold text-emerald-900 text-sm">Cleanest Nearby Areas</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                      {safeZones.length > 0 ? safeZones.map(ward => (
                          <div key={ward.id} className="p-4 hover:bg-slate-50 transition-colors">
                              <div className="flex justify-between items-start mb-1">
                                  <div className="font-bold text-slate-800 text-sm">{ward.name}</div>
                                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                      {ward.aqi} AQI
                                  </span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                  <MapPin size={10} /> ~{Math.round(ward.distance! / 10)} km away
                              </div>
                          </div>
                      )) : (
                          <div className="p-6 text-center text-slate-500 text-sm">
                              No specific green zones nearby.
                          </div>
                      )}
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};

export default CitizenView;