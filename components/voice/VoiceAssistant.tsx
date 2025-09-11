import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>;

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" {...props}>
      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.725.562h8.384a.75.75 0 010 1.5H4.418L2.998 15.76a.75.75 0 00.95.826l14.05-5.269a.75.75 0 000-1.418L3.105 2.289z" />
    </svg>
);


const VoiceAssistant: React.FC = () => {
    const { t, language } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [textInput, setTextInput] = useState('');
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        setMessages([{
            id: Date.now(),
            text: t('voice_welcome_message'),
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, [t]);

    const getMockAIResponse = useCallback((query: string) => {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम') || lowerQuery.includes('ਮੌਸਮ')) {
            if (language === 'hi') return "आज का मौसम साफ है और तापमान 32 डिग्री सेल्सियस है। सिंचाई के लिए यह एक अच्छा दिन है।";
            if (language === 'pa') return "ਅੱਜ ਮੌਸਮ ਸਾਫ਼ ਹੈ ਅਤੇ ਤਾਪਮਾਨ 32 ਡਿਗਰੀ ਸੈਲਸੀਅਸ ਹੈ। ਸਿੰਚਾਈ ਲਈ ਇਹ ਇੱਕ ਚੰਗਾ ਦਿਨ ਹੈ।";
            return "Today's weather is clear with a temperature of 32°C. It's a good day for irrigation.";
        }
        if (lowerQuery.includes('price') || lowerQuery.includes('भाव') || lowerQuery.includes('ਭਾਅ') || lowerQuery.includes('गेहूं') || lowerQuery.includes('ਕਣਕ')) {
             if (language === 'hi') return "गेहूं का भाव अभी ₹2,150 प्रति क्विंटल चल रहा है, जो कल से 5% ज़्यादा है।";
             if (language === 'pa') return "ਕਣਕ ਦਾ ਭਾਅ ਇਸ ਵੇਲੇ ₹2,150 ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਹੈ, ਜੋ ਕੱਲ੍ਹ ਨਾਲੋਂ 5% ਵੱਧ ਹੈ।";
             return "The current market price for wheat is ₹2,150 per quintal, which is up 5% from yesterday.";
        }
        if (lowerQuery.includes('water') || lowerQuery.includes('पानी') || lowerQuery.includes('ਪਾਣੀ') || lowerQuery.includes('सिंचाई')) {
            if (language === 'hi') return "गन्ने की फसल को हर 10-15 दिनों में गहरी सिंचाई की आवश्यकता होती है, खासकर गर्मी के महीनों में।";
            if (language === 'pa') return "ਗੰਨੇ ਦੀ ਫਸਲ ਨੂੰ ਹਰ 10-15 ਦਿਨਾਂ ਵਿੱਚ ਡੂੰਘੀ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ, ਖਾਸ ਕਰਕੇ ਗਰਮੀਆਂ ਦੇ ਮਹੀਨਿਆਂ ਵਿੱਚ।";
            return "Sugarcane crops require deep watering every 10-15 days, especially during hot months.";
        }
        if (language === 'hi') return "माफ़ कीजिए, मुझे समझ नहीं आया। क्या आप अपना सवाल दोहरा सकते हैं?";
        if (language === 'pa') return "ਮਾਫ ਕਰਨਾ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਆਪਣਾ ਸਵਾਲ ਦੁਹਰਾ ਸਕਦੇ ਹੋ?";
        return "I'm sorry, I didn't understand that. Could you please repeat your question?";

    }, [language]);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        if (language === 'hi') utterance.lang = 'hi-IN';
        else if (language === 'pa') utterance.lang = 'pa-IN';
        else utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }

    const processUserMessage = useCallback((text: string) => {
        if (!text) return;

        const userMessage: Message = {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        setIsProcessing(true);

        setTimeout(() => {
            const aiResponseText = getMockAIResponse(text);
            const aiMessage: Message = {
                id: Date.now() + 1,
                text: aiResponseText,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsProcessing(false);
            speak(aiResponseText);
        }, 1500);
    }, [getMockAIResponse, speak]);
    
     const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim() && !isProcessing) {
            processUserMessage(textInput.trim());
            setTextInput('');
        }
    };

    const startListening = () => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Speech recognition not supported in this browser.");
                return;
            }
            recognitionRef.current = new SpeechRecognition();
            if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
            else if (language === 'pa') recognitionRef.current.lang = 'pa-IN';
            else recognitionRef.current.lang = 'en-US';

            recognitionRef.current.interimResults = true;
            recognitionRef.current.continuous = false;
            
            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => {
                setIsListening(false);
                recognitionRef.current = null;
            };
            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result) => result.transcript)
                    .join('');

                if (event.results[0].isFinal) {
                   processUserMessage(transcript);
                }
            };
            
            recognitionRef.current.start();

        } catch (error) {
            console.error("Error starting speech recognition:", error);
            alert("Could not start voice recognition. Please ensure microphone permissions are granted.");
        }
    };
    
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleQuickQuery = (query: string) => {
        processUserMessage(query);
    }

    const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
        <div className={`flex items-end gap-2 my-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-lg flex-shrink-0">🤖</div>}
            <div className={`max-w-[80%] p-3 rounded-2xl ${message.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'} text-right`}>{message.timestamp}</p>
            </div>
        </div>
    );
    
    return (
        <div className="p-4 sm:p-6 h-[calc(100vh-6rem)] flex flex-col">
            <div className="text-center mb-4 flex-shrink-0">
                <h1 className="headline-medium text-2xl dark:text-white">{t('voice_assistant_title')}</h1>
                <p className="body-large text-gray-600 dark:text-gray-300 mt-1">{t('voice_assistant_page_subtitle')}</p>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                {isProcessing && (
                    <div className="flex items-end gap-2 my-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-lg flex-shrink-0">🤖</div>
                        <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 dark:bg-gray-700">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                {!isListening && !isProcessing && (
                    <div className="mb-4 text-center animate-fade-in">
                        <p className="font-semibold text-sm mb-2">{t('quick_queries')}</p>
                        <div className="flex flex-wrap justify-center gap-2">
                           <button onClick={() => handleQuickQuery(t('ask_weather'))} className="bg-primary/10 text-primary dark:bg-green-900/50 dark:text-green-300 text-sm px-3 py-1 rounded-full">{t('ask_weather')}</button>
                           <button onClick={() => handleQuickQuery(t('ask_market_price'))} className="bg-primary/10 text-primary dark:bg-green-900/50 dark:text-green-300 text-sm px-3 py-1 rounded-full">{t('ask_market_price')}</button>
                           <button onClick={() => handleQuickQuery(t('ask_crop_info'))} className="bg-primary/10 text-primary dark:bg-green-900/50 dark:text-green-300 text-sm px-3 py-1 rounded-full">{t('ask_crop_info')}</button>
                        </div>
                    </div>
                )}
                <form onSubmit={handleTextSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={isListening ? t('speak_now') : "Type or tap the mic..."}
                        disabled={isListening || isProcessing}
                        autoComplete="off"
                        aria-label="Ask the AI assistant a question"
                        className="w-full pl-5 pr-16 py-3 text-base text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <button
                        type={textInput.trim() ? 'submit' : 'button'}
                        onClick={textInput.trim() ? undefined : handleMicClick}
                        disabled={isProcessing}
                        aria-label={textInput.trim() ? "Send message" : "Use voice input"}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 transform
                            ${isListening ? 'bg-red-500 scale-110' : 'bg-primary'}
                            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-100'}
                        `}
                    >
                        {textInput.trim() ? (
                            <SendIcon className="text-white" />
                        ) : (
                            <MicIcon className="w-6 h-6 text-white" />
                        )}
                    </button>
                </form>
                 <p className="mt-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 h-5">
                    {isListening ? t('listening') : isProcessing ? t('processing') : ''}
                 </p>
            </div>
        </div>
    );
};

export default VoiceAssistant;

// Ensure this is available on the window object for browsers that need it
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}