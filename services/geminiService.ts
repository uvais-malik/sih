
import type { DiseaseAnalysisResult } from '../types';

// This is a mock service to simulate Gemini API calls for a frontend-only demo.
// In a real application, you would use the @google/genai library here.

// Helper function to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeCropDisease = async (
  image: File
): Promise<DiseaseAnalysisResult> => {
  console.log('Analyzing image:', image.name);
  await sleep(2500); // Simulate API call latency

  // Mocked successful response from Gemini
  const mockResult: DiseaseAnalysisResult = {
    diseaseName: 'Fungal Leaf Spot',
    confidence: 88,
    symptoms: [
      'Small, dark, circular spots on the leaves.',
      'Spots may enlarge and develop a yellow halo.',
      'In severe cases, leaves may turn yellow and drop prematurely.',
      'Visible fungal growth in the center of the spots under humid conditions.',
    ],
    treatments: [
      'Remove and destroy infected leaves to reduce fungal spread.',
      'Apply a recommended fungicide, ensuring thorough coverage of all plant surfaces.',
      'Repeat fungicide application every 10-14 days, especially during wet weather.',
    ],
    preventions: [
      'Ensure proper spacing between plants to improve air circulation.',
      'Water plants at the base to avoid wetting the foliage.',
      'Use disease-resistant crop varieties when available.',
      'Rotate crops annually to break the disease cycle.',
    ],
  };

  // Here's how a real implementation might look (pseudo-code):
  /*
    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
    
    const imageBase64 = await toBase64(image);

    const imagePart = {
      inlineData: {
        mimeType: image.type,
        data: imageBase64,
      },
    };

    const textPart = {
      text: "Analyze this image of a crop leaf. Identify any diseases, confidence level, symptoms, treatment steps, and prevention measures. Respond in JSON format."
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            // Define your responseSchema here
        }
    });
    
    const result = JSON.parse(response.text);
    return result;
  */

  return mockResult;
};
