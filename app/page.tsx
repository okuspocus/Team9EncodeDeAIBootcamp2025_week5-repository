'use client'

import { useState } from "react";

// Add type definition for evaluation
interface JokeEvaluation {
  funny: boolean;
  appropriate: boolean;
  offensive: boolean;
  comments?: string;
}

export default function JokeGenerator() {
  const [topic, setTopic] = useState("random");
  const [tone, setTone] = useState("silly");
  const [type, setType] = useState("pun");
  const [language, setLanguage] = useState("english");
  const [temperature, setTemperature] = useState(0.7);
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [jokeCount, setJokeCount] = useState(0); // Counter to track joke generation attempts
  const [evaluation, setEvaluation] = useState<JokeEvaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const handleEvaluateJoke = async () => {
    if (!joke) return;
    setEvaluating(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ joke }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to evaluate joke');
      }
      
      const data = await response.json();
      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Error evaluating joke:', error);
    } finally {
      setEvaluating(false);
    }
  };

  const handleGenerateJoke = async () => {
    setLoading(true);
    setJoke("");
    setEvaluation(null);
    setJokeCount(prevCount => prevCount + 1); // Increment counter each time
    
    try {
      const response = await fetch('/api/joke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: JSON.stringify({
                topic,
                tone,
                type,
                language,
                temperature,
                timestamp: new Date().getTime(), // Add timestamp for uniqueness
                requestId: `${Math.random().toString(36).substring(2, 9)}-${jokeCount}` // Add unique ID
              })
            }
          ]
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate joke');
      }
      
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      console.error('Error generating joke:', error);
      setJoke("Sorry, couldn't generate a joke. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">JokeBox AI</h1>
          <p className="text-lg text-blue-200">Powered by Decentralized Inference 🤖</p>
        </div>
        
        <div className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700 w-full">
          <p className="text-blue-300 mb-6 font-medium">Customize your joke:</p>

          {/* Topic Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-blue-200">Topic:</label>
            <div className="relative">
              <select
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 transition-all"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="random">Random</option>
                <option value="work">Work</option>
                <option value="people">People</option>
                <option value="animals">Animals</option>
                <option value="food">Food</option>
                <option value="television">Television</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Tone Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-blue-200">Tone:</label>
            <div className="relative">
              <select
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 transition-all"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="silly">Silly</option>
                <option value="sarcastic">Sarcastic</option>
                <option value="witty">Witty</option>
                <option value="dark">Dark</option>
                <option value="goofy">Goofy</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Joke Type Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-blue-200">Joke Type:</label>
            <div className="relative">
              <select
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 transition-all"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="pun">Pun</option>
                <option value="knock-knock">Knock-Knock</option>
                <option value="story">Story</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-blue-200">Language:</label>
            <div className="relative">
              <select
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 transition-all"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="french">French</option>
                <option value="spanish">Spanish</option>
                <option value="german">German</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-blue-200">Creativity Level:</label>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 mr-2">0.0</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs text-gray-400 ml-2">1.0</span>
            </div>
            <p className="text-sm text-right text-blue-300 mt-1">Current: {temperature}</p>
          </div>

          {/* Generate Joke Button */}
          <button 
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-300"
            onClick={handleGenerateJoke}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : 'Generate Joke'}
          </button>
        </div>
        
        {/* Display Joke */}
        {joke && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg">😂</span>
                </div>
                <h3 className="text-xl font-bold text-blue-300">Your Joke</h3>
              </div>
              <div className="p-5 bg-gray-700 bg-opacity-60 rounded-xl border border-gray-600 mb-4">
                <p className="text-white text-lg leading-relaxed">{joke}</p>
              </div>
              
              <button 
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-lg hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-300 mt-4"
                onClick={handleEvaluateJoke}
                disabled={evaluating || !joke}
              >
                {evaluating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Evaluating...
                  </span>
                ) : 'Evaluate Joke'}
              </button>

              {evaluation && (
                <div className="mt-6 p-5 bg-gray-700 bg-opacity-60 rounded-xl border border-gray-600 animate-fade-in">
                  <h3 className="text-xl font-bold mb-4 text-blue-300">Joke Evaluation</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${evaluation.funny ? 'bg-green-800 bg-opacity-40' : 'bg-red-800 bg-opacity-40'} flex flex-col items-center justify-center`}>
                      <span className="text-2xl mb-1">{evaluation.funny ? '😄' : '😐'}</span>
                      <span className="text-sm font-medium">{evaluation.funny ? 'Funny' : 'Not Funny'}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${evaluation.appropriate ? 'bg-green-800 bg-opacity-40' : 'bg-red-800 bg-opacity-40'} flex flex-col items-center justify-center`}>
                      <span className="text-2xl mb-1">{evaluation.appropriate ? '👍' : '👎'}</span>
                      <span className="text-sm font-medium">{evaluation.appropriate ? 'Appropriate' : 'Inappropriate'}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${!evaluation.offensive ? 'bg-green-800 bg-opacity-40' : 'bg-red-800 bg-opacity-40'} flex flex-col items-center justify-center`}>
                      <span className="text-2xl mb-1">{!evaluation.offensive ? '✅' : '⚠️'}</span>
                      <span className="text-sm font-medium">{!evaluation.offensive ? 'Clean' : 'Offensive'}</span>
                    </div>
                  </div>
                  {evaluation.comments && (
                    <div className="mt-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-300">
                        <span className="font-medium text-blue-300">AI Comments:</span> {evaluation.comments}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Blockchain notice */}
              <div className="mt-6 p-5 bg-indigo-900 bg-opacity-30 rounded-xl border border-indigo-800">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">🔗</span>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-300">Decentralized Inference</h3>
                </div>
                <p className="text-sm text-indigo-200 leading-relaxed">
                  This joke was generated using Venice AI's decentralized inference platform instead of centralized services like OpenAI.
                  <br /><br />
                  <span className="text-indigo-300 font-medium">Model:</span> mistral-7b (optimized for free accounts)
                  <br />
                  <span className="text-indigo-300 font-medium">Note:</span> Blockchain integration is disabled in this simplified version.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center mt-8 text-sm text-blue-200 opacity-70">
          © 2025 JokeBox AI • Powered by Venice AI Decentralized Inference
        </div>
      </div>
    </div>
  );
}
