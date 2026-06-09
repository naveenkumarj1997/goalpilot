import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateProfessionalSummary = async (experience: any[], projects: any[], skills: any[], targetRole: string) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

export const enhanceBulletPoint = async (bullet: string, role: string) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const result = await model.generateContent(prompt);
  return result.response.text().replace(/^[-*•]\s*/, '').trim();
};

export const categorizeSkills = async (rawSkills: string) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured.");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const result = await model.generateContent(prompt);
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
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse ATS score:", text);
    return { score: 50, suggestions: ["Could not analyze ATS score properly."] };
  }
};
