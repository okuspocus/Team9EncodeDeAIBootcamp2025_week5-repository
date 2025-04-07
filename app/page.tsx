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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">AI Joke Generator 🤖😂</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-gray-400 mb-4">Select joke parameters below:</p>

        {/* Topic Selection */}
        <label className="block text-sm mb-2">Choose a Topic:</label>
        <select
          className="w-full p-2 rounded bg-gray-700 text-white"
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

        {/* Tone Selection */}
        <label className="block text-sm mt-4 mb-2">Choose a Tone:</label>
        <select
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="silly">Silly</option>
          <option value="sarcastic">Sarcastic</option>
          <option value="witty">Witty</option>
          <option value="dark">Dark</option>
          <option value="goofy">Goofy</option>
        </select>

        {/* Joke Type Selection */}
        <label className="block text-sm mt-4 mb-2">Choose Joke Type:</label>
        <select
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="pun">Pun</option>
          <option value="knock-knock">Knock-Knock</option>
          <option value="story">Story</option>
        </select>

        {/* Language Selection */}
        <label className="block text-sm mt-4 mb-2">Choose Language:</label>
        <select
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="english">English</option>
          <option value="french">French</option>
          <option value="spanish">Spanish</option>
          <option value="german">German</option>
        </select>

        {/* Temperature Slider */}
        <label className="block text-sm mt-4 mb-2">Creativity Level:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-gray-400">Current: {temperature}</p>

        {/* Generate Joke Button */}
        <button 
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleGenerateJoke}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Joke'}
        </button>
        
        {/* Display Joke */}
        {joke && (
          <div className="mt-6">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-white">{joke}</p>
            </div>
            
            <button 
              className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
              onClick={handleEvaluateJoke}
              disabled={evaluating || !joke}
            >
              {evaluating ? 'Evaluating...' : 'Evaluate Joke'}
            </button>

            {evaluation && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-bold mb-2">Joke Evaluation:</h3>
                <ul className="space-y-2">
                  <li>Funny: {evaluation.funny ? '✅' : '❌'}</li>
                  <li>Appropriate: {evaluation.appropriate ? '✅' : '❌'}</li>
                  <li>Offensive: {evaluation.offensive ? '⚠️' : '✅'}</li>
                  {evaluation.comments && (
                    <li className="mt-2 text-sm text-gray-400">
                      Comments: {evaluation.comments}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
