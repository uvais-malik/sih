import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

type Priority = 'High' | 'Medium' | 'Low';
interface Task {
    id: string;
    text: string;
    completed: boolean;
}
interface CropActivity {
    crop: string;
    icon: string;
    stage: string;
    priority: Priority;
    tasks: Task[];
}

const mockCalendarData: Record<string, CropActivity[]> = {
    "September": [
        { crop: "Wheat", icon: "🌾", stage: "Sowing", priority: "High", tasks: [{id: 'w1', text: "Land preparation & Soil testing", completed: true}, {id: 'w2', text: "Apply basal fertilizer dose", completed: false}]},
        { crop: "Sugarcane", icon: "🌱", stage: "Vegetative", priority: "Medium", tasks: [{id: 's1', text: "Irrigate every 10 days", completed: true}, {id: 's2', text: "Monitor for stem borer pest", completed: false}, {id: 's3', text: "Apply second dose of Nitrogen", completed: false}]},
        { crop: "Cotton", icon: "☁️", stage: "Boll Formation", priority: "High", tasks: [{id: 'c1', text: "Scout for pink bollworm", completed: false}, {id: 'c2', text: "Apply potassium for boll development", completed: false}]}
    ],
    "October": [
        { crop: "Wheat", icon: "🌾", stage: "Germination", priority: "High", tasks: [{id: 'w3', text: "First irrigation (21 days after sowing)", completed: false}, {id: 'w4', text: "Weed management", completed: false}]},
        { crop: "Sugarcane", icon: "🌱", stage: "Grand Growth", priority: "Medium", tasks: [{id: 's4', text: "Earthing up operation", completed: false}, {id: 's5', text: "Check for nutrient deficiencies", completed: false}]},
        { crop: "Cotton", icon: "☁️", stage: "Harvesting", priority: "High", tasks: [{id: 'c3', text: "Begin first picking of mature bolls", completed: false}]}
    ],
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CropCalendar: React.FC = () => {
    const { t } = useAppContext();
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [activities, setActivities] = useState(mockCalendarData);

    const currentMonth = months[currentMonthIndex];
    const currentActivities = activities[currentMonth] || [];

    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
        } else {
            setCurrentMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
        }
    };
    
    const handleTaskToggle = (month: string, crop: string, taskId: string) => {
        setActivities(prev => {
            const monthActivities = prev[month].map(activity => {
                if (activity.crop === crop) {
                    const updatedTasks = activity.tasks.map(task => 
                        task.id === taskId ? { ...task, completed: !task.completed } : task
                    );
                    return { ...activity, tasks: updatedTasks };
                }
                return activity;
            });
            return { ...prev, [month]: monthActivities };
        });
    }

    const PriorityBadge: React.FC<{priority: Priority}> = ({priority}) => {
        const colors = {
            High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
            Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            Low: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[priority]}`}>{t(priority.toLowerCase()+'_priority')}</span>
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
                <h1 className="headline-medium text-2xl dark:text-white">{t('crop_calendar_title')}</h1>
                <p className="body-large text-gray-600 dark:text-gray-300 mt-1">{t('crop_calendar_page_subtitle')}</p>
            </div>

            <div className="glass-card shadow-glass rounded-3xl p-4 mb-6">
                <div className="flex justify-between items-center">
                    <button onClick={() => handleMonthChange('prev')} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">&lt;</button>
                    <h2 className="font-bold text-xl dark:text-white">{currentMonth}</h2>
                    <button onClick={() => handleMonthChange('next')} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">&gt;</button>
                </div>
            </div>

            <div className="space-y-4">
                {currentActivities.length > 0 ? currentActivities.map(activity => (
                    <div key={activity.crop} className="glass-card shadow-glass rounded-2xl p-4">
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3">
                                <div className="text-3xl">{activity.icon}</div>
                                <div>
                                    <h3 className="font-bold text-lg dark:text-white">{activity.crop}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.stage} Stage</p>
                                </div>
                           </div>
                           <PriorityBadge priority={activity.priority} />
                        </div>
                        <ul className="mt-4 space-y-3">
                            {activity.tasks.map(task => (
                                <li key={task.id} className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id={`${activity.crop}-${task.id}`}
                                        checked={task.completed} 
                                        onChange={() => handleTaskToggle(currentMonth, activity.crop, task.id)}
                                        className="w-5 h-5 rounded text-primary focus:ring-primary/50"
                                    />
                                    <label htmlFor={`${activity.crop}-${task.id}`} className={`flex-grow cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'dark:text-gray-200'}`}>
                                        {task.text}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No activities scheduled for {currentMonth}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropCalendar;
