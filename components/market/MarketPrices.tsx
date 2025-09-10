import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface CropPrice {
    icon: string;
    name: string;
    price: number;
    change: number;
    market: string;
    trendData: number[];
}

const mockMarketData: CropPrice[] = [
    { icon: "🌾", name: "Wheat", price: 2150, change: 5.2, market: "Delhi Mandi", trendData: [2000, 2020, 2050, 2030, 2080, 2100, 2150] },
    { icon: "🍚", name: "Rice (Basmati)", price: 4800, change: 2.8, market: "Punjab Mandi", trendData: [4600, 4650, 4700, 4680, 4750, 4780, 4800] },
    { icon: "☁️", name: "Cotton", price: 6200, change: -1.5, market: "Gujarat Mandi", trendData: [6400, 6350, 6300, 6320, 6280, 6250, 6200] },
    { icon: "🧅", name: "Onion", price: 2400, change: 8.3, market: "Maharashtra Mandi", trendData: [2100, 2150, 2200, 2180, 2250, 2300, 2400] },
    { icon: "🍅", name: "Tomato", price: 1800, change: 12.5, market: "Karnataka Mandi", trendData: [1500, 1550, 1600, 1580, 1650, 1700, 1800] },
    { icon: "🌱", name: "Sugarcane", price: 350, change: 0.0, market: "UP Mandi", trendData: [350, 350, 350, 350, 350, 350, 350] },
];

const TrendArrow: React.FC<{change: number}> = ({ change }) => {
    if (change > 0) return <span className="text-green-500">🔼</span>;
    if (change < 0) return <span className="text-red-500">🔽</span>;
    return <span className="text-gray-500">➖</span>;
};

const MarketPrices: React.FC = () => {
    const { t } = useAppContext();
    const [selectedCrop, setSelectedCrop] = useState<CropPrice | null>(null);

    const PriceCard: React.FC<{ crop: CropPrice }> = ({ crop }) => (
        <div onClick={() => setSelectedCrop(crop)} className="glass-card shadow-glass rounded-2xl p-4 flex flex-col cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="text-3xl">{crop.icon}</div>
                <div>
                    <h3 className="font-bold text-lg dark:text-white">{crop.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{crop.market}</p>
                </div>
            </div>
            <div className="mt-4 text-right">
                <p className="font-bold text-2xl dark:text-white">₹{crop.price}</p>
                <p className={`font-semibold text-sm ${crop.change > 0 ? 'text-green-600 dark:text-green-400' : crop.change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                    <TrendArrow change={crop.change} /> {crop.change.toFixed(1)}%
                </p>
            </div>
        </div>
    );

    const DetailsModal: React.FC<{ crop: CropPrice, onClose: () => void }> = ({ crop, onClose }) => {
        const maxTrend = Math.max(...crop.trendData);
        const minTrend = Math.min(...crop.trendData);

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div onClick={(e) => e.stopPropagation()} className="glass-card shadow-xl rounded-3xl p-6 w-full max-w-sm animate-fade-in">
                    <div className="flex justify-between items-start">
                        <div>
                           <h2 className="headline-medium text-2xl dark:text-white">{crop.name}</h2>
                           <p className="body-large text-gray-500 dark:text-gray-400">{t('price_details')}</p>
                        </div>
                        <button onClick={onClose} className="text-2xl">&times;</button>
                    </div>
                    
                    <div className="text-center my-6">
                        <p className="font-bold text-5xl dark:text-white">₹{crop.price} <span className="text-2xl text-gray-500">/{t('quintal')}</span></p>
                        <p className={`font-semibold text-xl mt-1 ${crop.change > 0 ? 'text-green-600 dark:text-green-400' : crop.change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                            <TrendArrow change={crop.change} /> {crop.change.toFixed(1)}% (24h)
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-2 dark:text-white">{t('seven_day_trend')}</h3>
                        <div className="flex items-end justify-between h-24 bg-gray-100 dark:bg-gray-800/50 p-2 rounded-lg">
                           {crop.trendData.map((price, i) => (
                               <div key={i} className="w-1/7 text-center">
                                   <div className="h-full flex items-end justify-center">
                                       <div 
                                         className={`w-4 rounded-t-sm ${crop.change >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                                         style={{height: `${((price - minTrend) / (maxTrend - minTrend) * 0.8 + 0.2) * 100}%`}}
                                       ></div>
                                   </div>
                                   <p className="text-xs mt-1 text-gray-500">{i+1}</p>
                               </div>
                           ))}
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-100/50 to-green-200/40 dark:from-green-900/50 dark:to-green-800/40 border border-green-200 dark:border-green-700">
                        <h3 className="font-bold text-primary dark:text-green-300">{t('ai_selling_advice')}</h3>
                        <p className="body-large text-sm text-on-primary-container dark:text-gray-300">{t('selling_advice_text')}</p>
                    </div>

                </div>
            </div>
        )
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
                <h1 className="headline-medium text-2xl dark:text-white">{t('market_prices_title')}</h1>
                <p className="body-large text-gray-600 dark:text-gray-300 mt-1">{t('market_prices_page_subtitle')}</p>
                 <p className="text-xs text-gray-400 mt-2">{t('last_updated')} {new Date().toLocaleTimeString()}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {mockMarketData.map(crop => <PriceCard key={crop.name} crop={crop} />)}
            </div>

            {selectedCrop && <DetailsModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />}
        </div>
    );
};

export default MarketPrices;
