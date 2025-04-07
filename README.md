# Team9EncodeDeAIBootcamp2025_week5-repository
# Decentralized JokeBox AI

A decentralized joke generator application that uses Venice AI for inference and implements a zero-knowledge offensive joke penalty system using blockchain technology.

## Overview

This project transforms a traditional joke generator application into a decentralized application (dApp) by:

- Replacing centralized OpenAI API with Venice AI's decentralized inference platform
- Implementing a zero-knowledge offensive joke penalty system using the Optimistic ML approach
- Creating a token economy for joke evaluation and curation

## Features

- **Decentralized Inference:** Uses Venice AI Protocol for privacy-preserving joke generation
- **Zero-Knowledge Offensive Content Detection:** Evaluates jokes for offensive content without revealing the actual joke content
- **Token Economics:** Implements a reputation and staking system for joke creators and evaluators
- **Multi-language Support:** Generates jokes in English, French, Spanish, and German
- **Smart Contract Integration:** Connects to Ethereum-compatible blockchains for transparent governance

## Technology Stack

- **Frontend:** React, Next.js
- **Decentralized AI:** Venice AI Protocol
- **Blockchain:** Ethereum/Solidity (Optimistic ML approach)
- **Zero-Knowledge Proofs:** For privacy-preserving joke evaluation
- **Token Economics:** ERC-20 implementation for reputation and penalties

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Venice AI API key
- Ethereum wallet with testnet ETH (for smart contract interaction)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/decentralized-jokebox-ai.git
   cd decentralized-jokebox-ai
   
2. **Installl dependencies:**

   ```bash
   npm install

3. **Crear un archivo `.env` con tu Venice AI API key:**
   ```dotenv
   VENICE_API_KEY=your_venice_api_key_here
   VENICE_API_BASE_URL=https://api.venice.ai/api/v1

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev

5. **Abrir** [http://localhost:3000](http://localhost:3000) **en tu navegador**

## Smart Contract Integration

The project includes a smart contract that implements:

- **Zero-Knowledge Offensive Joke Penalties:** Using the Optimistic ML approach from the DeAI course
- **Token Economics:** For joke evaluation and curation
- **Reputation System:** Tracking user behavior over time

### Interacting with the Smart Contract

- Connect your wallet to the application
- Generate jokes using the interface
- Stake tokens when submitting jokes
- Evaluate jokes to earn reputation
- Report offensive jokes through the zero-knowledge system

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

- Venice AI Protocol for decentralized inference
- Optimistic ML approach for zero-knowledge verification


