# Decentralized JokeBox AI

A decentralized joke generator application that uses Venice AI for inference and implements a zero-knowledge offensive joke penalty system using blockchain technology.

## Overview

This project transforms a traditional joke generator application into a decentralized application (dApp) by:

1. Replacing centralized OpenAI API with Venice AI's decentralized inference platform
2. Implementing a zero-knowledge offensive joke penalty system using the Optimistic ML approach
3. Creating a token economy for joke evaluation and curation

## Features

- **Decentralized Inference**: Uses Venice AI Protocol for privacy-preserving joke generation
- **Zero-Knowledge Offensive Content Detection**: Evaluates jokes for offensive content without revealing the actual joke content
- **Token Economics**: Implements a reputation and staking system for joke creators and evaluators
- **Multi-language Support**: Generates jokes in English, French, Spanish, and German
- **Smart Contract Integration**: Connects to Ethereum-compatible blockchains for transparent governance

## Technology Stack

- **Frontend**: React, Next.js
- **Decentralized AI**: Venice AI Protocol
- **Blockchain**: Ethereum/Solidity (Optimistic ML approach)
- **Zero-Knowledge Proofs**: For privacy-preserving joke evaluation
- **Token Economics**: ERC-20 implementation for reputation and penalties

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Venice AI API key
- Ethereum wallet with testnet ETH (for smart contract interaction)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/okuspocus/Team9EncodeDeAIBootcamp2025_week5-repository
   cd decentralized-jokebox-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Venice AI API key:
   ```
   VENICE_API_KEY=your_venice_api_key_here
   VENICE_API_BASE_URL=https://api.venice.ai/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contract Integration

The project includes a smart contract that implements:

1. **Zero-Knowledge Offensive Joke Penalties**: Using the Optimistic ML approach from the DeAI course
2. **Token Economics**: For joke evaluation and curation
3. **Reputation System**: Tracking user behavior over time

### Interacting with the Smart Contract

1. Connect your wallet to the application
2. Generate jokes using the interface
3. Stake tokens when submitting jokes
4. Evaluate jokes to earn reputation
5. Report offensive jokes through the zero-knowledge system

## Architecture

### Decentralized Inference

The application uses Venice AI's API, which is compatible with the OpenAI API specification but provides:
- Privacy-preserving computation
- Uncensored models
- Decentralized inference infrastructure
- Token economics (VVV tokens)

### Zero-Knowledge Offensive Joke Penalties

Implements the Optimistic ML approach where:
1. Jokes are assumed appropriate unless challenged
2. Challenges can be submitted with zero-knowledge proofs
3. Penalties are enforced through the smart contract
4. User reputation affects stake requirements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Encode Club AI Bootcamp DeAI course
- Venice AI Protocol for decentralized inference
- Optimistic ML approach for zero-knowledge verification
