import { useJokeContract } from '../hooks/useJokeContract';
import JokeBlockchainIntegration from '../components/JokeBlockchainIntegration';

// Add this component to the main page to integrate the blockchain functionality
export default function JokeBlockchainWrapper({ joke, evaluation }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Decentralized Joke Evaluation</h2>
      <p className="mb-4">
        This joke generator uses Venice AI for decentralized inference and implements a zero-knowledge
        offensive joke penalty system using the Optimistic ML approach.
      </p>
      
      <JokeBlockchainIntegration joke={joke} evaluation={evaluation} />
      
      <div className="mt-4 text-sm text-gray-600">
        <p>How it works:</p>
        <ol className="list-decimal pl-5 mt-2">
          <li>Connect your wallet to interact with the smart contract</li>
          <li>Generate a joke using the form above</li>
          <li>Submit the joke to the blockchain with a stake based on your reputation</li>
          <li>If the joke is evaluated as offensive, it can be challenged</li>
          <li>Challenges use zero-knowledge proofs to verify without revealing the joke content</li>
          <li>After the challenge period, stakes are returned or penalties are applied</li>
        </ol>
      </div>
    </div>
  );
}
