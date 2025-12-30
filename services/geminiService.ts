
import { GoogleGenAI } from "@google/genai";
import { SummaryData, SearchSource } from "../types";

export const getPaperSummary = async (): Promise<SummaryData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Summarize in clear, professional bullet points the main findings and insights from the collaborative research paper or report published by Harvard (Harvard Business School/Digital Data Design Institute) and Perplexity regarding the future of knowledge work and AI implementation in enterprises. 
  
  Focus on:
  1. The core objective of the collaboration.
  2. Key productivity metrics or findings.
  3. Strategic recommendations for businesses.
  4. The impact on traditional search and information retrieval.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No summary available.";
    
    // Extract grounding chunks for sources
    const sources: SearchSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          // Check for duplicates
          if (!sources.find(s => s.uri === chunk.web.uri)) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title || chunk.web.uri
            });
          }
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch summary from Gemini API.");
  }
};
