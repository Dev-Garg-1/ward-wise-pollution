import React from 'react';
import { Ward, AQICategory } from '../types';
import { Activity, Wind, CloudFog, Thermometer, TrendingUp, TrendingDown, MapPin } from 'lucide-react';

interface LiveMonitorCardProps {
  ward: Ward;
}

const LiveMonitorCard: React.FC<LiveMonitorCardProps> = ({ ward }) => {
  const getStatusColor = (category: AQICategory) => {
    switch (category) {
      case AQICategory.GOOD: return 'bg-emerald-500 text-emerald-50';
      case AQICategory.MODERATE: return 'bg-amber-500 text-amber-50';
      case AQICategory.POOR: return 'bg-orange-500 text-orange-50';
      case AQICategory.SEVERE: return 'bg-red-600 text-red-50';
      default: return 'bg-slate-500 text-slate-50';
    }
  };

  const getStatusBorder = (category: AQICategory) => {
      switch (category) {
        case AQICategory.GOOD: return 'border-emerald-200 bg-emerald-50';
        case AQICategory.MODERATE: return 'border-amber-200 bg-amber-50';
        case AQICategory.POOR: return 'border-orange-200 bg-orange-50';
        case AQICategory.SEVERE: return 'border-red-200 bg-red-50';
        default: return 'border-slate-200 bg-slate-50';
      }
  };

  const getPrimaryPollutant = (pollutants: any) => {
      const entries = Object.entries(pollutants);
      if (entries.length === 0) return { name: 'N/A', val: 0 };
      const max = entries.reduce((max, curr) => (curr[1] as number) > (max[1] as number) ? curr : max, entries[0]);
      let name = max[0].toUpperCase();
      if(name === 'PM25') name = 'PM2.5';
      if(name === 'PM10') name = 'PM10';
      return { name: name, val: max[1] as number };
  }

  const primary = getPrimaryPollutant(ward.pollutants);
  const trend = ward.aqi > (ward.trend[ward.trend.length - 2] || ward.aqi) ? 'up' : 'down';

  return (
    <div 
        key={ward.id} 
        className="w-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 relative"
    >
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

       <div className="flex flex-col lg:flex-row">
          
          {/* Left: Ward Identity & Status */}
          <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between relative overflow-hidden">
             <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(ward.category).split(' ')[0]}`}></div>
             
             <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                        {ward.id}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        Live
                    </span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-1 truncate">{ward.name}</h2>
                 <div className="flex items-center text-slate-500 text-sm gap-1">
                    <MapPin size={14} />
                    <span>{ward.zone} Zone</span>
                 </div>
             </div>

             <div className="mt-6 flex items-center gap-4">
                 <div className={`px-4 py-2 rounded-lg flex items-center gap-3 ${getStatusBorder(ward.category)}`}>
                     <Activity size={20} className={ward.category === AQICategory.SEVERE ? 'text-red-600 animate-pulse' : 'text-slate-600'} />
                     <div>
                         <div className="text-xs font-semibold uppercase opacity-60">Status</div>
                         <div className="font-bold text-sm leading-none">{ward.category}</div>
                     </div>
                 </div>
                 <div className="text-xs text-slate-400 max-w-[120px] leading-tight">
                    Population: {ward.population.toLocaleString()}
                 </div>
             </div>
          </div>

          {/* Right: Metrics Grid */}
          <div className="lg:w-2/3 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              
              {/* AQI Metric */}
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AQI Index</span>
                  <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-black ${
                          ward.aqi > 200 ? 'text-red-600' : 
                          ward.aqi > 100 ? 'text-orange-500' : 
                          ward.aqi > 50 ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                          {ward.aqi}
                      </span>
                      <span className="text-xs font-medium text-slate-400">US</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${trend === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {trend === 'up' ? 'Rising' : 'Falling'}
                  </div>
              </div>

              {/* Primary Pollutant */}
              <div className="flex flex-col pl-4 md:border-l border-slate-100">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Main Pollutant</span>
                   <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-slate-100 rounded text-slate-500"><CloudFog size={18} /></div>
                       <div>
                           <div className="text-xl font-bold text-slate-700 leading-none">{primary.name}</div>
                           <div className="text-[10px] text-slate-400 mt-0.5">{primary.val} µg/m³</div>
                       </div>
                   </div>
              </div>

              {/* Weather 1 */}
              <div className="flex flex-col pl-4 border-l border-slate-100">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Weather</span>
                   <div className="flex items-center gap-2 mb-1">
                       <Thermometer size={14} className="text-slate-400" />
                       <span className="font-semibold text-slate-700">{ward.weather.temperature.toFixed(1)}°C</span>
                   </div>
                   <div className="flex items-center gap-2">
                       <Wind size={14} className="text-slate-400" />
                       <span className="font-semibold text-slate-700">{ward.weather.windSpeed.toFixed(1)} km/h</span>
                   </div>
              </div>

               {/* Health Risk (Visual Bar) */}
               <div className="flex flex-col pl-4 border-l border-slate-100 h-full justify-center">
                   <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Risk</span>
                       <span className="text-[10px] font-bold text-slate-600">{Math.round((ward.aqi / 500) * 100)}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className={`h-full rounded-full ${
                            ward.aqi > 200 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                            ward.aqi > 100 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                            'bg-gradient-to-r from-emerald-400 to-emerald-500'
                        }`} 
                        style={{ width: `${Math.min(100, (ward.aqi / 300) * 100)}%` }}
                       ></div>
                   </div>
                   <div className="mt-1 text-[10px] text-slate-400 text-right">Based on US-EPA Stds</div>
               </div>

          </div>
       </div>
    </div>
  );
};

export default LiveMonitorCard;