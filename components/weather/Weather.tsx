import React from 'react';
import { useAppContext } from '../../context/AppContext';

const mockWeatherData = {
    current: { temp: 32, feels_like: 35, desc: 'Clear Sky', icon: '☀️', humidity: 65, wind: 12, pressure: 1013, visibility: 10, uv: 7 },
    hourly: [
        { time: '3pm', temp: 32, icon: '☀️' }, { time: '4pm', temp: 31, icon: '☀️' },
        { time: '5pm', temp: 30, icon: '🌤️' }, { time: '6pm', temp: 29, icon: '🌤️' },
        { time: '7pm', temp: 28, icon: '🌙' }, { time: '8pm', temp: 27, icon: '🌙' },
    ],
    daily: [
        { day: 'Today', high: 34, low: 22, icon: '☀️' },
        { day: 'Fri', high: 31, low: 20, icon: '⛅' },
        { day: 'Sat', high: 28, low: 18, icon: '🌧️' },
        { day: 'Sun', high: 30, low: 19, icon: '🌦️' },
        { day: 'Mon', high: 32, low: 21, icon: '☀️' },
        { day: 'Tue', high: 33, low: 22, icon: '☀️' },
        { day: 'Wed', high: 31, low: 20, icon: '⛅' },
    ]
};

const Weather: React.FC = () => {
    const { t, user } = useAppContext();
    const { current, hourly, daily } = mockWeatherData;

    const DetailItem: React.FC<{label: string, value: string | number, unit: string}> = ({label, value, unit}) => (
        <div className="text-center bg-black/5 dark:bg-white/5 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-bold text-lg dark:text-white">{value}<span className="text-sm">{unit}</span></p>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="text-center">
                <h1 className="headline-medium text-2xl dark:text-white">{t('weather_page_title')}</h1>
                <p className="body-large text-gray-600 dark:text-gray-300 mt-1">{`${user?.location.district}, ${user?.location.state}`}</p>
            </div>
            
            <div className="glass-card shadow-glass rounded-3xl p-6 text-center">
                <div className="text-7xl mb-2">{current.icon}</div>
                <p className="font-bold text-8xl dark:text-white">{current.temp}°<span className="align-top text-4xl">C</span></p>
                <p className="font-semibold text-xl dark:text-gray-200">{current.desc}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('feels_like')} {current.feels_like}°C</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                <DetailItem label={t('humidity_label')} value={current.humidity} unit="%" />
                <DetailItem label={t('wind_label')} value={current.wind} unit=" km/h" />
                <DetailItem label={t('pressure')} value={current.pressure} unit=" hPa" />
                <DetailItem label={t('visibility')} value={current.visibility} unit=" km" />
                <DetailItem label={t('uv_index')} value={current.uv} unit="" />
            </div>

            <div className="glass-card shadow-glass rounded-3xl p-4">
                <h2 className="font-bold mb-3 px-2 dark:text-white">{t('hourly_forecast')}</h2>
                <div className="flex overflow-x-auto gap-4 pb-2">
                    {hourly.map(hour => (
                        <div key={hour.time} className="flex-shrink-0 w-20 text-center bg-black/5 dark:bg-white/5 p-3 rounded-xl">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{hour.time}</p>
                            <p className="text-3xl my-1">{hour.icon}</p>
                            <p className="font-bold text-xl dark:text-white">{hour.temp}°</p>
                        </div>
                    ))}
                </div>
            </div>

             <div className="glass-card shadow-glass rounded-3xl p-4">
                 <h2 className="font-bold mb-3 px-2 dark:text-white">{t('seven_day_forecast')}</h2>
                 <div className="space-y-2">
                     {daily.map(day => (
                         <div key={day.day} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                             <p className="font-semibold w-1/4 dark:text-gray-200">{day.day}</p>
                             <div className="flex items-center gap-2 w-1/4 justify-center">
                                 <p className="text-2xl">{day.icon}</p>
                             </div>
                             <div className="flex items-center justify-end gap-2 w-2/4 text-right">
                                 <p className="font-bold dark:text-white">{day.high}°</p>
                                 <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full" style={{width: `${(day.high - day.low)*5 + 30}%`}}></div>
                                 </div>
                                 <p className="font-medium text-gray-500 dark:text-gray-400">{day.low}°</p>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>

             <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-100/50 to-green-200/40 dark:from-green-900/50 dark:to-green-800/40 border border-green-200 dark:border-green-700 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-xl text-white">💡</div>
              <div>
                <h3 className="font-bold text-primary dark:text-green-300">{t('farming_advice')}</h3>
                <p className="body-large text-sm text-on-primary-container dark:text-gray-300">{t('weather_advice_text')}</p>
              </div>
            </div>
        </div>
    );
};

export default Weather;
