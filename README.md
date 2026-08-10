# Career AI Advisor

Career AI Advisor is a profile-based career recommendation application designed to help students and early-career users explore suitable career paths based on their skills, interests, educational background, and career goals.

The application provides personalized career recommendations along with relevant skills, skills to develop, and suggested next steps to help users make informed career decisions.

---

## Overview

Choosing the right career path can be challenging for students and early-career users when they are unsure how their skills, interests, educational background, and career goals align with different career opportunities.

Career AI Advisor provides a structured platform to explore suitable career paths based on user profile information. It offers personalized career recommendations along with relevant skills, skills to develop, and suggested next steps.

The application also allows users to explore and compare career options, helping them better understand potential career directions and plan their learning and development.

---

## Features

- User authentication and profile management
- Personalized career recommendations
- Skill and interest-based career matching
- Educational background and career goal-based guidance
- Career-specific skill recommendations and skill-gap identification
- Suggested next steps for career development
- Career path comparison
- Recommendation history
- AI-assisted career guidance

---

## Career Recommendation System

The Career AI Advisor uses **profile-based matching** to generate personalized career recommendations.

Recommendations are based on factors such as:

- **Skills**
- **Interests**
- **Educational Background**
- **Career Goals**

The system matches the user's profile with relevant career paths and provides career-specific guidance to help users understand what they can learn and work toward next.

---

## How It Works

The application follows a simple workflow:

**User Profile → Profile Processing → Career Matching → Personalized Recommendations → Career Development Guidance**

The recommendation process helps users understand:

- Suitable career paths
- Relevant skills they already have
- Skills they need to develop
- Suggested next steps
- Comparisons between different career options

---

## Getting Started

### Prerequisites

Make sure the following are installed on your system:

- Node.js
- npm

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/unnatigautam/career-ai-advisor.git
```

#### 2. Navigate to the project directory

```bash
cd career-ai-advisor
```

#### 3. Install frontend dependencies

```bash
npm install
```

#### 4. Install backend dependencies

```bash
cd server
npm install
```

#### 5. Create environment variables

Create a `.env` file inside the `server` directory and add the required configuration values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

#### 6. Start the backend server

```bash
npm run dev
```

#### 7. Start the frontend

Open a new terminal and run:

```bash
npm run dev
```

The application will then be available through the local development URL provided by Vite.

---

## Usage

1. Create an account or log in to the application.
2. Complete your profile by entering your skills, interests, education, and career goals.
3. Submit your profile information for processing.
4. View personalized career recommendations.
5. Explore the skills required for each recommended career.
6. Review suggested next steps for career development.
7. Compare different career paths.
8. Access previous recommendations through recommendation history.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MongoDB
- Mongoose

### AI & Recommendation

- Profile-based matching
- AI service integration
- Career recommendation logic

### Development Tools

- Git
- GitHub
- npm

---

## Project Structure

The project is organized into separate frontend and backend modules to keep the application maintainable and scalable.

```text
career-ai-advisor/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── package.json
└── README.md
```

---

## Project Purpose

The purpose of Career AI Advisor is to provide students and early-career users with a structured and personalized approach to career exploration.

The project aims to connect a user's skills, interests, educational background, and career goals with relevant career paths while providing useful guidance on skills to develop and possible next steps.

The project was developed as part of an internship to apply concepts of full-stack web development, database management, and AI-assisted recommendation systems in a practical application.

---

## Future Enhancements

The project can be further enhanced with:

- Integration with job portals and internship platforms
- Resume analysis and skill-gap detection
- More advanced AI-based career recommendations
- Real-time job and internship suggestions
- Personalized learning roadmaps and course recommendations
- Career progress tracking and development insights

---

## Contributing

Contributions are welcome.

You can improve the project by:

- Adding new career paths
- Enhancing the recommendation logic
- Improving the user interface
- Introducing additional features
- Improving the overall user experience

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push the branch.
6. Open a pull request.

---

## License

This project is developed for educational and project purposes.
