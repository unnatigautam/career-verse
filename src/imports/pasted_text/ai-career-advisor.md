Build a complete full-stack web application called “AI Career Path Advisor” for a college internship project.

IMPORTANT:
This is not just a UI mockup or static prototype. Generate a functional, runnable full-stack application with frontend, backend, database integration, authentication, APIs, and AI integration.

TECHNOLOGY STACK:
Frontend:
- React
- Modern responsive UI
- Use reusable React components

Backend:
- Node.js
- Express.js
- REST APIs

Database:
- MongoDB
- Mongoose

Authentication:
- JWT-based authentication
- Secure password hashing
- Protected routes

AI:
- Integrate an AI API through the backend
- Never expose the AI API key in the frontend
- Use environment variables for secrets
- AI should generate structured responses that can be reliably parsed by the application

PROJECT PURPOSE:
The application helps students explore suitable career paths based on their skills, interests, and academic background.

CORE USER FLOW:

1. LANDING PAGE
Create a professional landing page containing:
- Project/application name: AI Career Path Advisor
- Short description
- Clear explanation of how it works
- “Get Started” button
- Login and Sign Up buttons
- Modern, professional student/career-oriented design

2. USER AUTHENTICATION

Create:
- Sign Up page
- Login page
- Logout functionality

Sign Up fields:
- Name
- Email
- Password
- Confirm Password

Requirements:
- Validate inputs
- Hash passwords securely on the backend
- Generate JWT after successful authentication
- Store JWT securely using an appropriate approach
- Protect authenticated pages and APIs
- Show useful error messages

3. USER DASHBOARD

After login, show a dashboard containing:
- Welcome message using user's name
- Profile completion status
- Quick action to create/update career profile
- Button to generate career recommendations
- Recent recommendations
- Navigation to profile and recommendation history

4. USER PROFILE

Create a profile page/form where the user can provide:

Personal/Academic information:
- Name
- Academic background
- Degree/course
- Current year/semester

Skills:
- Allow users to add multiple skills
- Examples: Python, Java, JavaScript, React, SQL, DSA, etc.

Interests:
- Allow users to add multiple interests
- Examples: Web Development, AI/ML, Data Science, Cybersecurity, Cloud, etc.

Additional optional information:
- Preferred work style
- Career goals
- Areas they want to explore

Allow users to:
- Create profile
- Edit profile
- Save profile
- Update profile later

Store this information in MongoDB.

5. AI CAREER RECOMMENDATION

Create a dedicated “Get Career Recommendations” page.

The backend should send the authenticated user's profile information to the AI API.

The AI should generate EXACTLY 3 suitable career paths.

For each career path, generate:

- Career path/title
- Why this career suits the user
- Match explanation based on their skills/interests/academic background
- Recommended skills to learn
- Suggested next steps

Use structured JSON output such as:

{
  "recommendations": [
    {
      "careerPath": "...",
      "whyItSuitsYou": "...",
      "skillsToLearn": ["...", "..."],
      "nextSteps": ["...", "..."]
    }
  ]
}

The backend must validate the AI response before sending it to the frontend.

Handle:
- AI API errors
- Invalid AI responses
- Missing profile information
- Network errors
- Rate limits
- Empty responses

Show a clear loading state while the AI is generating recommendations.

6. RECOMMENDATION RESULTS PAGE

Display the 3 AI-generated career paths in attractive cards.

Each card should contain:
- Career title
- Suitability/match explanation
- Why it suits the user
- Skills to learn
- Next steps
- Save recommendation option

Use clear visual hierarchy.

Do not make unsupported claims such as guaranteed career success or exact job/salary predictions.

7. SAVE RECOMMENDATIONS

Users should be able to save generated recommendations.

Store saved recommendations in MongoDB and associate them with the authenticated user.

Each saved recommendation should include:
- User ID
- Career path
- Reasoning
- Skills to learn
- Next steps
- Creation date

8. RECOMMENDATION HISTORY

Create a “My Recommendations” / “History” page.

Display previous recommendation sessions with:
- Date
- Career paths generated
- View details button
- Delete option if appropriate

Users should only be able to access their own recommendation history.

9. COMPARE RECOMMENDATIONS

Allow users to select previous recommendations and compare them.

Create a clean comparison interface showing:
- Career path
- Why it suits the user
- Skills required/to learn
- Next steps

Make comparison easy to understand.

10. NAVIGATION

Create a consistent navigation system.

Authenticated navigation:
- Dashboard
- My Profile
- Get Recommendations
- Recommendation History
- Compare
- Logout

Unauthenticated navigation:
- Home
- Login
- Sign Up

11. BACKEND API

Create a properly organized Express backend with routes/controllers/services/models.

Include APIs for:

Authentication:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Profile:
- GET /api/profile
- POST/PUT /api/profile

AI:
- POST /api/recommendations/generate

Recommendations:
- GET /api/recommendations
- GET /api/recommendations/:id
- POST /api/recommendations
- DELETE /api/recommendations/:id

Use appropriate HTTP status codes.

12. MONGODB DATA MODELS

Create appropriate Mongoose models.

User model:
- name
- email
- password
- createdAt

Profile model:
- userId
- academicBackground
- degree
- year/semester
- skills
- interests
- careerGoals
- workStyle
- updatedAt

Recommendation model:
- userId
- recommendations
- createdAt

Make sure users can only access their own profile and recommendations.

13. SECURITY

Implement:
- Password hashing
- JWT authentication
- Protected backend routes
- Authorization checks
- Environment variables
- No hardcoded API keys
- Input validation
- Appropriate error handling
- CORS configuration
- Do not expose sensitive information in API responses

Create a .env.example file showing required variables without exposing real secrets.

14. FRONTEND ERROR AND LOADING STATES

Every API-dependent page should properly handle:
- Loading
- Success
- Empty state
- Validation error
- Server error
- AI error
- Authentication error

Do not leave blank screens when an API fails.

15. UI/UX DESIGN

Create a professional modern interface suitable for a college internship project.

Design style:
- Clean
- Minimal
- Professional
- Modern
- Student/career focused
- Responsive on desktop, tablet and mobile

Use:
- Consistent typography
- Consistent spacing
- Cards
- Buttons
- Form components
- Status indicators
- Proper navigation
- Accessible contrast
- Clear error/success messages

Avoid:
- Excessive animations
- Overly complicated layouts
- Unnecessary decorative elements
- Fake statistics
- Fake testimonials
- Fake user data presented as real

16. PROJECT STRUCTURE

Organize the application cleanly, preferably as:

ai-career-path-advisor/
  client/
    src/
      components/
      pages/
      layouts/
      services/
      hooks/
      context/
      utils/
      App.jsx
      main.jsx

  server/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    config/
    server.js

  .env.example
  .gitignore
  README.md

Keep frontend and backend clearly separated.

17. README

Generate a useful README containing:
- Project overview
- Features
- Technology stack
- Project architecture
- Folder structure
- Installation instructions
- Environment variables required
- MongoDB setup
- AI API setup
- How to run frontend
- How to run backend
- How to run the complete application
- API overview
- Security notes

18. IMPORTANT IMPLEMENTATION RULES

Do not create a fake frontend that only looks functional.

Buttons and forms must actually connect to the appropriate functionality.

Do not hardcode career recommendations as the final AI functionality.

Do not put AI API keys in React/frontend code.

Do not use fake database behavior when MongoDB is required.

Do not use localStorage as a replacement for MongoDB persistence except where genuinely useful for non-sensitive UI state.

Do not create unnecessary features that make the project unnecessarily complex.

Keep the implementation at a Medium difficulty level while making it polished and complete.

Make the AI response structured and predictable.

Use reusable components and maintainable code.

Make sure frontend API calls match the actual backend endpoints exactly.

Make sure MongoDB schemas match the data being sent by the frontend/backend.

Make sure authentication state works correctly across protected pages.

19. FINAL OUTPUT

Generate the complete runnable project, including:
- React frontend
- Node.js/Express backend
- MongoDB/Mongoose integration
- JWT authentication
- AI integration
- All required pages
- All required API routes
- Database models
- Middleware
- Error handling
- Environment variable setup
- README
- .gitignore
- .env.example

The final application should be functional rather than just visually complete.

Before considering the project complete, verify that:
- Registration works
- Login works
- Protected routes work
- Profile creation/update works
- MongoDB persistence works
- AI recommendation generation works
- Exactly 3 career paths are returned
- Recommendations can be saved
- Recommendation history works
- Comparison works
- Logout works
- Error states work
- Frontend and backend communicate correctly
- No API keys/secrets are exposed
- The project can be run locally using the README instructions

If any feature cannot be implemented directly in the generated environment, clearly identify what remains to be configured manually rather than pretending it is complete.