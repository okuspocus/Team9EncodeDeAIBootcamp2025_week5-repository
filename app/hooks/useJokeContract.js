import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import JokeEvaluationContract from '../../contracts/JokeEvaluationContract.json';

// Interface for connecting to the smart contract
export const useJokeContract = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [reputation, setReputation] = useState(0);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Contract address - would be set after deployment
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

  // Initialize connection to blockchain and contract
  const initialize = async () => {
    try {
      setLoading(true);
      
      // Check if window.ethereum is available (MetaMask)
      if (typeof window !== 'undefined' && window.ethereum) {
        // Create provider and connect
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        
        // Get signer
        const ethSigner = ethProvider.getSigner();
        setSigner(ethSigner);
        
        // Create contract instance
        if (contractAddress) {
          const jokeContract = new ethers.Contract(
            contractAddress,
            JokeEvaluationContract.abi,
            ethSigner
          );
          setContract(jokeContract);
          
          // Get user's reputation
          const userReputation = await jokeContract.reputationOf(account);
          setReputation(userReputation.toNumber());
          
          setConnected(true);
        } else {
          setError('Contract address not configured');
        }
      } else {
        setError('Ethereum wallet not detected. Please install MetaMask.');
      }
    } catch (err) {
      console.error('Error initializing contract:', err);
      setError('Failed to connect to blockchain. Please check your wallet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Submit a joke to the blockchain with ZK proof
  const submitJoke = async (joke) => {
    if (!contract || !signer) {
      throw new Error('Contract or signer not initialized');
    }
    
    try {
      // Create a hash of the joke (in a real implementation, this would be more secure)
      const jokeHash = ethers.utils.id(joke);
      
      // In a real implementation, we would generate a ZK proof here
      // For this example, we'll use a simple hash as a placeholder
      const proofHash = ethers.utils.id(`proof-${joke}`);
      
      // Get required stake
      const requiredStake = await contract.getRequiredStake(account);
      
      // Submit the joke to the contract
      const tx = await contract.submitJoke(jokeHash, proofHash);
      await tx.wait();
      
      return {
        success: true,
        jokeHash,
        requiredStake: ethers.utils.formatEther(requiredStake)
      };
    } catch (err) {
      console.error('Error submitting joke:', err);
      throw new Error(`Failed to submit joke: ${err.message}`);
    }
  };

  // Challenge a joke as offensive
  const challengeJoke = async (jokeHash) => {
    if (!contract || !signer) {
      throw new Error('Contract or signer not initialized');
    }
    
    try {
      // In a real implementation, we would generate a ZK proof here
      // For this example, we'll use a simple hash as a placeholder
      const challengeProofHash = ethers.utils.id(`challenge-${jokeHash}`);
      
      // Submit the challenge to the contract
      const tx = await contract.challengeJoke(jokeHash, challengeProofHash);
      await tx.wait();
      
      return { success: true };
    } catch (err) {
      console.error('Error challenging joke:', err);
      throw new Error(`Failed to challenge joke: ${err.message}`);
    }
  };

  // Get user's reputation level
  const getReputationLevel = async () => {
    if (!contract || !account) {
      throw new Error('Contract or account not initialized');
    }
    
    try {
      const level = await contract.getReputationLevel(account);
      return level;
    } catch (err) {
      console.error('Error getting reputation level:', err);
      throw new Error(`Failed to get reputation level: ${err.message}`);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    await initialize();
  };

  // Initialize on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        initialize();
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    // Initial connection attempt
    initialize();
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return {
    contract,
    provider,
    signer,
    account,
    reputation,
    connected,
    loading,
    error,
    submitJoke,
    challengeJoke,
    getReputationLevel,
    connectWallet
  };
};
