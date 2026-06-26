import { GoogleGenerativeAI } from '@google/generative-ai';

// Helper to retry on 503 Service Unavailable
const generateWithRetry = async (model: any, prompt: string, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      if (error.message && error.message.includes('503') && i < retries - 1) {
        console.warn(`503 High Demand Error. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
};

export const generateCombatRoadmapAI = async (profileData: any) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an expert Combat Sports Coach and MMA Trainer.
    Generate a 4-week training roadmap for this user:
    Gender: ${profileData.gender}
    Age: ${profileData.age}
    Weight: ${profileData.weight}kg
    Height: ${profileData.height}cm
    Experience Level: ${profileData.experienceLevel}
    Goals: ${profileData.goals.join(', ')}
    Available Equipment: ${profileData.equipment.join(', ')}
    
    Create a progressive 4-week roadmap. For each week, provide a focus and a list of 3-4 tasks.
    Tasks can be "Lesson" (learning technique), "Workout" (shadow boxing, heavy bag), or "Drill".
    
    Respond EXACTLY with a JSON object in this format (no markdown, no backticks):
    {
      "title": "4-Week [Discipline/Focus] Fundamentals",
      "weeks": [
        {
          "weekNumber": 1,
          "focus": "Basic Stance and Movement",
          "tasks": [
            { "title": "Learn the Fighting Stance", "type": "Lesson", "duration": 15 },
            { "title": "Shadow Boxing: Footwork Only", "type": "Workout", "duration": 10 }
          ]
        }
      ]
    }
  `;

  try {
    const result = await generateWithRetry(model, prompt);
    let text = result.response.text().trim();
    text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(text);
  } catch (err: any) {
    console.error("Failed to generate combat roadmap via AI:", err.message);
    throw err;
  }
};
