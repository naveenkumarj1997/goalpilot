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

export const generateProfessionalSummary = async (experience: any[], projects: any[], skills: any[], targetRole: string) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an expert resume writer. Generate a powerful, ATS-friendly professional summary for a ${targetRole || 'Software Professional'}.
    
    Here is their background:
    Experience: ${JSON.stringify(experience)}
    Projects: ${JSON.stringify(projects)}
    Skills: ${JSON.stringify(skills)}
    
    Requirements:
    - Keep it strictly to 3-4 sentences.
    - Focus on quantifiable achievements, technical expertise, and business impact.
    - Do not include greetings, introductions, or generic buzzwords.
    - Return ONLY the summary text, nothing else.
  `;

  const result = await generateWithRetry(model, prompt);
  return result.response.text().trim();
};

export const enhanceBulletPoint = async (bullet: string, role: string) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an expert resume writer. Enhance the following resume bullet point for a ${role || 'Software'} role.
    
    Original bullet: "${bullet}"
    
    Requirements:
    - Make it sound highly professional, action-oriented, and impactful.
    - If possible, imply business value (e.g., "improving efficiency", "enhancing user experience").
    - Keep it strictly to one bullet point sentence.
    - Do not add bullet point markers (like -, *, •). 
    - Return ONLY the enhanced text.
  `;

  const result = await generateWithRetry(model, prompt);
  return result.response.text().replace(/^[-*•]\s*/, '').trim();
};

export const categorizeSkills = async (rawSkills: string) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Categorize the following comma-separated skills into distinct groups like Frontend, Backend, Database, Cloud, Tools, Soft Skills, etc.
    
    Skills: ${rawSkills}
    
    You must respond ONLY with a valid JSON array of objects, with no markdown formatting and no backticks. 
    Format exactly like this:
    [
      { "category": "Frontend", "items": ["React", "HTML"] },
      { "category": "Backend", "items": ["Node.js"] }
    ]
  `;

  const result = await generateWithRetry(model, prompt);
  let text = result.response.text().trim();
  // Remove markdown formatting if the model still returns it
  text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse categorised skills:", text);
    throw new Error("AI returned invalid JSON.");
  }
};

export const calculateATSScore = async (resumeData: any) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an ATS (Applicant Tracking System) parser. Analyze this resume for a ${resumeData.targetRole || 'Software'} role.
    
    Resume Data: ${JSON.stringify(resumeData)}
    
    Calculate a score out of 100 based on:
    - Section completeness (Summary, Experience, Projects, Education)
    - Action verbs in descriptions
    - Quantifiable metrics in descriptions
    - Relevance of skills to the target role
    
    Return ONLY a JSON object with this exact structure (no markdown, no backticks):
    {
      "score": 85,
      "suggestions": [
        "Add quantifiable metrics to your recent experience.",
        "Include more cloud-related skills for this role."
      ]
    }
  `;

  const result = await generateWithRetry(model, prompt);
  let text = result.response.text().trim();
  text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse ATS score:", text);
    return { score: 50, suggestions: ["Could not analyze ATS score properly."] };
  }
};

export const chatSuccessCoach = async (message: string, context: any) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are an expert AI Success Coach, Mindset Expert, and Personal Growth Mentor.
    The user has asked you the following: "${message}"
    
    Here is their current Manifestation Profile context:
    ${JSON.stringify(context)}
    
    Provide practical, motivational, and actionable advice to help them achieve their goals, build consistency, and overcome their challenges. Keep your response conversational but highly impactful.
  `;

  const result = await generateWithRetry(model, prompt);
  return result.response.text().trim();
};
