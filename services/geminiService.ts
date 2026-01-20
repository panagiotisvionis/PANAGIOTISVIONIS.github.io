
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Cache chat session to maintain conversation history
let chatSession: Chat | null = null;

/**
 * Initializes the Gemini Chat session with core portfolio context for Panagiotis Vionis.
 */
export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'CORE', the AI Assistant for Panagiotis Vionis's professional portfolio.
      Panagiotis is a Solution Engineer, PhD Researcher, and Blockchain Specialist.
      
      CORE KNOWLEDGE:
      - Current Role: R&D Team Member and ERP Implementation Specialist at 'Kipos tis Lysos' (KDHΦ ERP) since early 2025.
      - PhD Research: Application of Blockchain & Smart Contracts in the Energy Sector (Renewable Energy Certificates - REC).
      - Recent Publication: "Revolutionizing REC management: comparative study of Solana and Ethereum blockchain implementations" in Electrical Engineering (Springer Nature, 2025).
      - Other Publication: "The Potential of Blockchain Technology and Smart Contracts in the Energy Sector: A Review" (Applied Sciences, 2024).
      - Education: PhD Candidate (UoP), MSc in Technoeconomic Systems, BSc in Mathematics (University of Patras).
      - Tech Stack: Python, Rust (Anchor/Solana), Solidity (Ethereum), React, SQL/NoSQL, SPSS for statistical analysis.
      - Past Experience: Instructor of Quantitative Methods (University of Peloponnese), Computer Science Tutor (IEK Delta).
      
      Personality: Professional, academically grounded, technical expert, and friendly.
      Languages: Answer in Greek if asked in Greek, or English if asked in English.
      
      Instructions:
      - If asked about hiring or collaboration, provide his email: panagiotisvionis@gmail.com.
      - Keep answers under 80 words.
      - Highlight the transition from Mathematics to Blockchain and Solution Engineering.
      - Use technical emojis: ⛓️, 📈, 💻, 🔬.`,
    },
  });

  return chatSession;
};

/**
 * Sends a message to the Gemini API and extracts the text response.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendMessageToGemini = async (message: string): Promise<string> => {
  const chat = initializeChat();
  const delays = [800, 1600];

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      const response: GenerateContentResponse = await chat.sendMessage({ message });
      return response.text || "Transmission failure. Please try again.";
    } catch (error) {
      console.error("Gemini Error:", error);
      if (attempt < delays.length) {
        await sleep(delays[attempt]);
        continue;
      }
      return "Connection interrupted. CORE is offline.";
    }
  }

  return "Connection interrupted. CORE is offline.";
};
