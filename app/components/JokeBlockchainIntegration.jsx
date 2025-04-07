import { useState } from 'react';
import { useJokeContract } from '../hooks/useJokeContract';

export default function JokeBlockchainIntegration({ joke, evaluation }) {
  const [status, setStatus] = useState('idle'); // idle, submitting, submitted, challenging, challenged, error
  const [jokeHash, setJokeHash] = useState('');
  const [message, setMessage] = useState('');
  const [requiredStake, setRequiredStake] = useState('0');
  
  const { 
    account, 
    reputation, 
    connected, 
    loading, 
    error: contractError, 
    submitJoke, 
    challengeJoke,
    getReputationLevel,
    connectWallet
  } = useJokeContract();

  // Submit joke to blockchain
  const handleSubmitJoke = async () => {
    if (!joke) {
      setMessage('No joke to submit');
      return;
    }
    
    try {
      setStatus('submitting');
      setMessage('Submitting joke to blockchain...');
      
      const result = await submitJoke(joke);
      
      if (result.success) {
        setJokeHash(result.jokeHash);
        setRequiredStake(result.requiredStake);
        setStatus('submitted');
        setMessage(`Joke submitted successfully! Required stake: ${result.requiredStake} JET tokens`);
      }
    } catch (error) {
      console.error('Error submitting joke:', error);
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    }
  };

  // Challenge joke as offensive
  const handleChallengeJoke = async () => {
    if (!jokeHash) {
      setMessage('No joke hash to challenge');
      return;
    }
    
    try {
      setStatus('challenging');
      setMessage('Challenging joke as offensive...');
      
      const result = await challengeJoke(jokeHash);
      
      if (result.success) {
        setStatus('challenged');
        setMessage('Joke challenged successfully! Verification in progress...');
      }
    } catch (error) {
      console.error('Error challenging joke:', error);
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    }
  };

  // Get reputation level
  const handleGetReputationLevel = async () => {
    try {
      const level = await getReputationLevel();
      setMessage(`Your reputation level: ${level} (${reputation} points)`);
    } catch (error) {
      console.error('Error getting reputation level:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  // Connect wallet button
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  // Determine if the joke should be challenged based on evaluation
  const shouldChallenge = evaluation && evaluation.offensive;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Blockchain Integration</h3>
      
      {contractError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {contractError}
        </div>
      )}
      
      {!connected ? (
        <div>
          <p className="mb-2">Connect your wallet to interact with the blockchain</p>
          <button 
            onClick={handleConnectWallet}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-sm">Connected Account: {account}</p>
            <p className="text-sm">Reputation: {reputation} points</p>
            <button 
              onClick={handleGetReputationLevel}
              className="mt-1 text-xs text-blue-500 hover:underline"
            >
              Check Reputation Level
            </button>
          </div>
          
          {status === 'idle' && (
            <div>
              <button 
                onClick={handleSubmitJoke}
                disabled={!joke}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Submit Joke to Blockchain
              </button>
              
              {evaluation && (
                <div className="mt-2 text-sm">
                  <p>Joke Evaluation:</p>
                  <ul className="list-disc pl-5">
                    <li className={evaluation.funny ? 'text-green-600' : 'text-red-600'}>
                      {evaluation.funny ? 'Funny' : 'Not Funny'}
                    </li>
                    <li className={evaluation.appropriate ? 'text-green-600' : 'text-red-600'}>
                      {evaluation.appropriate ? 'Appropriate' : 'Inappropriate'}
                    </li>
                    <li className={evaluation.offensive ? 'text-red-600' : 'text-green-600'}>
                      {evaluation.offensive ? 'Potentially Offensive' : 'Not Offensive'}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {status === 'submitted' && shouldChallenge && (
            <div className="mt-4">
              <p className="text-red-600 mb-2">This joke was evaluated as potentially offensive!</p>
              <button 
                onClick={handleChallengeJoke}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Challenge as Offensive
              </button>
            </div>
          )}
          
          {message && (
            <div className={`mt-4 p-2 rounded ${status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
