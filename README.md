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

