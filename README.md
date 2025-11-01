# AI Learning Mentor - SIH Project

An AI-powered learning platform for students to prepare for technical interviews, learn data structures & algorithms, and get personalized career guidance.

## Features

- 🎯 **Personalized Learning Roadmaps** - Custom learning paths for DSA, Web Dev, AI/ML, and Placement Prep
- 🤖 **AI Tutor** - Interactive Q&A assistant powered by OpenAI
- 🎥 **Mock Interview Simulator** - Practice technical and HR interviews with AI feedback
- 🏢 **Company-Specific Prep** - Interview patterns and questions for Google, Amazon, Microsoft, Infosys, TCS
- 📊 **Progress Dashboard** - Track your learning progress with visual charts
- 👥 **Peer Learning Groups** - Connect with other learners

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up OpenAI API Key**
   
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=AIzaSyBdMZhWe5Wuwl63JQEAQCpK-Hd4l9OL2FE

   ```
   
   Or set it as an environment variable:
   ```bash
   # Windows PowerShell
   $env:OPENAI_API_KEY="AIzaSyBdMZhWe5Wuwl63JQEAQCpK-Hd4l9OL2FE
"
   
   # Windows CMD
   set OPENAI_API_KEY=AIzaSyBdMZhWe5Wuwl63JQEAQCpK-Hd4l9OL2FE

   
   # Linux/Mac
   export OPENAI_API_KEY=your_key_here
   ```

3. **Start the Server**
   ```bash
   npm start
   ```
   
   Server will run on `http://localhost:3000`

4. **Open the Application**
   
   Open `index.html` in your browser or serve it via a local server.

## Project Structure

```
SIH/
├── index.html              # Main application page
├── server.js               # Express backend with OpenAI integration
├── index.js                # Main frontend logic
├── company.html            # Company-specific interview prep
├── company.js              # Company interview logic
├── script.js               # Additional utilities
├── styles.css              # Main stylesheet
├── index.css               # Index page styles
├── company.css             # Company page styles
└── [various HTML files]    # Learning content pages (arrays, linkedlists, etc.)
```

## API Endpoints

- `POST /chat` - Chat with AI tutor
  - Body: `{ "message": "your question" }`
  - Returns: `{ "reply": "AI response" }`

## Technologies Used

- Frontend: HTML, CSS, JavaScript, Chart.js
- Backend: Node.js, Express
- AI: OpenAI GPT API

## Security Note

⚠️ **Important**: Never commit your OpenAI API key to version control. Always use environment variables or a `.env` file (which should be in `.gitignore`).

