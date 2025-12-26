
import { GoogleGenAI, Type } from "@google/genai";
import { GitHubUserData, RoastData } from "../types";

export const generateRoast = async (userData: GitHubUserData): Promise<RoastData> => {
  // Use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are a legendary developer comedian. Roast this GitHub profile.
  Username: ${userData.username}
  Bio: ${userData.bio || "No bio (pure laziness)"}
  Repos: ${userData.repoCount}
  Stars: ${userData.totalStars}
  Top Language: ${userData.topLanguage}
  Languages: ${Object.keys(userData.languages).join(", ")}
  Account Age: ${userData.accountAgeYears} years
  Peak Hour: ${userData.peakHour}:00
  Sample Commits: ${userData.recentCommitMessages.join(", ")}
  Top Repos: ${userData.topRepos.map(r => r.name).join(", ")}

  BE SAVAGE BUT CLEVER. Use developer memes (JavaScript is slow, PHP is old, etc).
  Format the response as a valid JSON object matching the RoastData interface.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overviewRoast: { type: Type.STRING },
          repoRoasts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                repo: { type: Type.STRING },
                roast: { type: Type.STRING }
              },
              required: ["repo", "roast"]
            }
          },
          languageRoast: { type: Type.STRING },
          commitRoast: { type: Type.STRING },
          socialRoast: { type: Type.STRING },
          bestOneLiners: { type: Type.ARRAY, items: { type: Type.STRING } },
          diversityScore: { type: Type.NUMBER },
          consistencyScore: { type: Type.NUMBER },
          effortScore: { type: Type.NUMBER }
        },
        required: ["overviewRoast", "repoRoasts", "languageRoast", "commitRoast", "socialRoast", "bestOneLiners", "diversityScore", "consistencyScore", "effortScore"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI response", e);
    // Fallback if parsing fails
    return {
      overviewRoast: "Your code is so bad that even the AI couldn't parse the roast properly. I guess you win?",
      repoRoasts: [],
      languageRoast: "You probably use a bunch of languages, none of them well.",
      commitRoast: "Your commit history looks like a barcode of despair.",
      socialRoast: "Followers? Following? It's all just numbers in the void.",
      bestOneLiners: ["Error 404: Logic not found", "Your repositories are a graveyard of half-finished ideas"],
      diversityScore: 404,
      consistencyScore: 0,
      effortScore: 0
    };
  }
};
