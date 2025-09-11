import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

interface CropPrice {
    icon: string;
    name: string;
    price: number;
    change: number;
    market: string;
    trendData: number[];
    trendLabels: string[];
}

const trendLabels = ['13 Aug', '15 Aug', '17 Aug', '19 Aug', '21 Aug', '23 Aug', '25 Aug', '27 Aug'];

const mockMarketData: CropPrice[] = [
    { icon: "🌾", name: "Wheat", price: 2150, change: 5.2, market: "Delhi Mandi", trendData: [2040, 2020, 2050, 2030, 2080, 2100, 2120, 2150], trendLabels },
    { icon: "🍚", name: "Rice (Basmati)", price: 4800, change: 2.8, market: "Punjab Mandi", trendData: [4670, 4690, 4680, 4710, 4730, 4750, 4770, 4800], trendLabels },
    { icon: "☁️", name: "Cotton", price: 6200, change: -1.5, market: "Gujarat Mandi", trendData: [6320, 6300, 6290, 6270, 6250, 6230, 6210, 6200], trendLabels },
    { icon: "🧅", name: "Onion", price: 2400, change: 8.3, market: "Maharashtra Mandi", trendData: [2180, 2200, 2230, 2250, 2290, 2330, 2360, 2400], trendLabels },
    { icon: "🍅", name: "Tomato", price: 1800, change: 12.5, market: "Karnataka Mandi", trendData: [1550, 1580, 1600, 1630, 1680, 1720, 1750, 1800], trendLabels },
    { icon: "🌱", name: "Sugarcane", price: 350, change: 0.0, market: "UP Mandi", trendData: [350, 350, 350, 350, 350, 350, 350, 350], trendLabels },
];

const TrendArrow: React.FC<{change: number}> = ({ change }) => {
    if (change > 0) return <span className="text-green-500">↗</span>;
    if (change < 0) return <span className="text-red-500">↘</span>;
    return <span className="text-gray-500">→</span>;
};

const TrendChart: React.FC<{ data: number[], labels: string[], color: string }> = ({ data, labels, color }) => {
    const pathRef = React.useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = React.useState(0);

    const width = 500;
    const height = 300;
    const padding = 50;
    const paddingBottom = 70;

    const maxVal = Math.max(...data);
    let minVal = Math.min(...data);
    let range = maxVal - minVal;

    if (range === 0) {
        range = maxVal * 0.2 || 10;
        minVal = maxVal - range;
    }

    const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
    const getY = (value: number) => height - paddingBottom - ((value - minVal) / range) * (height - padding - paddingBottom);

    const linePath = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point)}`).join(' ');

    const yAxisLabels = () => {
        const labels = [];
        const steps = 4;
        for (let i = 0; i <= steps; i++) {
            const value = minVal + (range / steps) * i;
            labels.push({ value: `₹${Math.round(value)}`, y: getY(value) });
        }
        return labels;
    };

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, [linePath]);
    
    return (
        <div className="w-full h-[250px] sm:h-[300px] touch-pan-y">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" aria-label={`A line chart showing price trends from ${minVal.toFixed(2)} to ${maxVal.toFixed(2)}`}>
                <title>Price Trend Chart</title>
                {/* Y-Axis Grid Lines & Labels */}
                {yAxisLabels().map(label => (
                    <g key={label.value} role="presentation">
                        <line x1={padding} y1={label.y} x2={width - padding} y2={label.y} stroke="currentColor" className="text-gray-200/80 dark:text-gray-700/80" />
                        <text x={padding - 10} y={label.y + 4} textAnchor="end" fontSize="14" fill="currentColor" className="text-gray-500 dark:text-gray-400">
                            {label.value}
                        </text>
                    </g>
                ))}
                
                {/* X-Axis Labels */}
                {data.map((_, i) => (
                    <text key={i} x={getX(i)} y={height - paddingBottom + 25} textAnchor="middle" fontSize="14" fill="currentColor" className="text-gray-500 dark:text-gray-400" role="presentation">
                        {labels[i]}
                    </text>
                ))}

                {/* Line Path */}
                <path ref={pathRef} d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={pathLength} strokeDashoffset={pathLength}
                    role="presentation"
                >
                    <animate attributeName="stroke-dashoffset" from={pathLength} to="0" dur="1s" fill="freeze" />
                </path>

                {/* Data Points */}
                {data.map((point, i) => (
                    <circle key={i} cx={getX(i)} cy={getY(point)} r="5" strokeWidth="2" stroke={color} fill="currentColor" className="text-surface dark:text-[#1B263B] cursor-pointer hover:opacity-80 transition-opacity opacity-0" aria-label={`Price on ${labels[i]}: ₹${point.toLocaleString('en-IN')}`}>
                        <title>{`${labels[i]}: ₹${point.toLocaleString('en-IN')}`}</title>
                        <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${i * 0.1}s`} fill="freeze" />
                    </circle>
                ))}
            </svg>
        </div>
    );
};


const MarketPrices: React.FC = () => {
    const { t } = useAppContext();
    const [selectedCrop, setSelectedCrop] = useState<CropPrice | null>(null);

    const PriceCard: React.FC<{ crop: CropPrice }> = ({ crop }) => (
        <div onClick={() => setSelectedCrop(crop)} className="glass-card shadow-glass rounded-2xl p-4 flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-3">
                <div className="text-3xl">{crop.icon}</div>
                <div>
                    <h3 className="font-bold text-lg dark:text-white">{crop.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{crop.market}</p>
                </div>
            </div>
            <div className="mt-4 text-right flex-grow flex flex-col justify-end">
                <div>
                    <p className="font-bold text-2xl dark:text-white">₹{crop.price.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per {t('quintal')}</p>
                </div>
                <p className={`font-semibold text-sm mt-1 ${crop.change > 0 ? 'text-green-600 dark:text-green-400' : crop.change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                    <TrendArrow change={crop.change} /> {crop.change.toFixed(1)}%
                </p>
            </div>
        </div>
    );

    const DetailsModal: React.FC<{ crop: CropPrice, onClose: () => void }> = ({ crop, onClose }) => {
        const maxPrice = Math.max(...crop.trendData);
        const minPrice = Math.min(...crop.trendData);
        const chartColor = crop.change >= 0 ? '#16a34a' : '#dc2626';

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div onClick={(e) => e.stopPropagation()} className="bg-surface dark:bg-[#1B263B] shadow-xl rounded-3xl p-4 sm:p-6 w-full max-w-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 z-10" aria-label="Close modal">&times;</button>
                    
                    <div className="mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{crop.icon}</span>
                            <div>
                                <h2 id="modal-title" className="headline-medium text-2xl dark:text-white">{crop.name}</h2>
                                <p className="body-large text-gray-500 dark:text-gray-400 text-sm">30-day price trend analysis for {crop.name}</p>
                            </div>
                        </div>
                        <div className="mt-2 text-right">
                             <p className="font-bold text-3xl dark:text-white">₹{crop.price.toLocaleString('en-IN')}</p>
                             <p className={`font-semibold text-lg ${crop.change > 0 ? 'text-green-600 dark:text-green-400' : crop.change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                                <TrendArrow change={crop.change} /> {crop.change.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                    
                    <TrendChart data={crop.trendData} labels={crop.trendLabels} color={chartColor} />

                    <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="bg-green-100/50 dark:bg-green-900/50 p-3 rounded-xl text-center">
                            <p className="text-xs text-green-800 dark:text-green-300 font-semibold">Highest Price</p>
                            <p className="font-bold text-lg dark:text-white">₹{maxPrice.toLocaleString('en-IN')}</p>
                        </div>
                         <div className="bg-red-100/50 dark:bg-red-900/50 p-3 rounded-xl text-center">
                            <p className="text-xs text-red-800 dark:text-red-300 font-semibold">Lowest Price</p>
                            <p className="font-bold text-lg dark:text-white">₹{minPrice.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-100/50 to-green-200/40 dark:from-green-900/50 dark:to-green-800/40 border border-green-200 dark:border-green-700 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-xl text-white">🤖</div>
                        <div>
                            <h3 className="font-bold text-primary dark:text-green-300">{t('ai_selling_advice')}</h3>
                            <p className="body-large text-sm text-on-primary-container dark:text-gray-300">{t('selling_advice_text')}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
                <h1 className="headline-medium text-2xl dark:text-white">{t('market_prices_title')}</h1>
                <p className="body-large text-gray-600 dark:text-gray-300 mt-1 max-w-lg mx-auto">{t('market_prices_page_subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockMarketData.map(crop => <PriceCard key={crop.name} crop={crop} />)}
            </div>

            <div className="mt-8 text-center">
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('last_updated')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                 <button className="morphic-button text-white font-bold py-3 px-6 rounded-xl shadow-lg">
                    View All Market Prices
                 </button>
            </div>
            
            {selectedCrop && <DetailsModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />}
        </div>
    );
};

export default MarketPrices;
