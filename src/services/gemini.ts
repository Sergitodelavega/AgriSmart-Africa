import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const geminiService = {
  async diagnoseCrop(base64Image: string, cropType: string, language: 'fr' | 'en') {
    const prompt = language === 'fr' 
      ? `En tant qu'expert agronome, analyse cette image de ${cropType}. Identifie le problème possible et propose des solutions concrètes pour un petit agriculteur en Afrique. Réponds au format JSON avec les champs: "issueDetected", "recommendations", "status" (healthy/warning/critical).`
      : `As an expert agronomist, analyze this image of ${cropType}. Identify the possible issue and propose concrete solutions for a smallholder farmer in Africa. Respond in JSON format with fields: "issueDetected", "recommendations", "status" (healthy/warning/critical).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return {
        issueDetected: "Analyse impossible",
        recommendations: "Veuillez réessayer avec une image plus claire.",
        status: "warning"
      };
    }
  },

  async getAdvice(crop: string, location: string, language: 'fr' | 'en') {
    const prompt = language === 'fr'
      ? `Donne des conseils agricoles personnalisés pour la culture de ${crop} à ${location}. Inclue un calendrier de plantation simple et des conseils pratiques. Réponds en Markdown.`
      : `Provide personalized agricultural advice for growing ${crop} in ${location}. Include a simple planting calendar and practical tips. Respond in Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    return response.text;
  }
};
