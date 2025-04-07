# Decentralized JokeBox AI

A decentralized joke generator application that uses Venice AI for inference and implements a zero-knowledge offensive joke penalty system using blockchain technology.

## Overview

This project transforms a traditional joke generator application into a decentralized application (dApp) by:

- Replacing centralized OpenAI API with Venice AI's decentralized inference platform
- Implementing a zero-knowledge offensive joke penalty system using the Optimistic ML approach
- Creating a token economy for joke evaluation and curation

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

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/decentralized-jokebox-ai.git
cd decentralized-jokebox-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file with your Venice AI API key:

```
VENICE_API_KEY=your_venice_api_key_here
VENICE_API_BASE_URL=https://api.venice.ai/api/v1
```

4. Start the development server:

```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Troubleshooting Venice AI Model Issues

If you encounter "Specified model not found" errors, try these solutions:

1. **Check available models** - Run the included Python script to see which models are available with your Venice AI account:
   ```
   python check_venice_models.py
   ```

2. **Try different model names** - Update both API route files with one of these models:
   ```
   model: 'mistral-7b-instruct-v0.2'
   model: 'llama-2-7b-chat'
   model: 'venice/mistral-7b-instruct-v0.2'  // Try with venice/ prefix
   model: 'default'  // Try a generic model name
   ```

3. **Use the mock implementation** - If you continue to have issues with Venice AI, you can use the mock implementation provided in the `mock-implementation` folder. This doesn't require any external API calls.

## Implementation Notes

This version:
- Uses smaller models instead of `llama-3.3-70b` to work with free Venice AI accounts
- Features an enhanced UI with animations and improved visual design
- Has blockchain integration disabled for easier testing
- Includes optimized prompts to reduce token usage

## File Structure

- `app/page.tsx` - Main UI component
- `app/api/joke/route.ts` - API route for generating jokes
- `app/api/evaluate/route.ts` - API route for evaluating jokes
- `app/globals.css` - Global styles
- `app/layout.tsx` - Layout component

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Venice AI Protocol for decentralized inference
- Encode Club AI Bootcamp DeAI course for inspiration and guidance
