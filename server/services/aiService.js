const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateCareerRecommendations(profile) {
  const prompt = `You are a career advisor for technology students. Based on the student profile below, generate exactly 3 personalized career path recommendations.

Student Profile:
- Name: ${profile.name}
- Degree: ${profile.degree}
- Year: ${profile.year}
- Academic background: ${profile.academicBackground}
- Skills: ${profile.skills.join(', ')}
- Interests: ${profile.interests.join(', ')}
- Career goals: ${profile.careerGoals}
- Preferred technology areas: ${profile.preferredAreas.join(', ')}

Return a JSON array with exactly 3 objects, each with:
{
  "title": "Career title",
  "matchExplanation": "Brief match percentage explanation (include a % score 60-98)",
  "whySuitable": "2-3 sentences explaining why this fits the student specifically",
  "skillsToLearn": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "nextSteps": ["step1", "step2", "step3", "step4", "step5"],
  "matchScore": 85
}

Return only valid JSON, no markdown.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  const json = text.startsWith('[') ? text : text.slice(text.indexOf('['), text.lastIndexOf(']') + 1);
  return JSON.parse(json);
}

module.exports = { generateCareerRecommendations };
