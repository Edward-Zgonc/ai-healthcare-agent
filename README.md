# AI Healthcare Agent

![Status: In Development](https://img.shields.io/badge/Status-In%20Development-blue)

A full-stack AI healthcare assistant designed to help clinicians search patient records, retrieve clinical information, and ask questions in natural language.

Built with TypeScript, React, Epic FHIR, Snowflake, and the Model Context Protocol (MCP), the application combines healthcare interoperability, AI-powered tools, and data analytics.

## Overview

The goal is a clinician-facing application where users can select a patient, review their medical information, and ask questions about medications, allergies, conditions, and clinical observations. An AI agent retrieves relevant records through Epic's FHIR API and uses the results to generate responses grounded in patient data.

The architecture is designed to support multiple AI providers, including Anthropic Claude, OpenAI GPT, and Google Gemini. Snowflake will extend the application with structured healthcare data querying and analytics.

### Example Interactions

- Find a patient by name and date of birth.
- Summarize a patient's medications and documented allergies.
- Review conditions and recent clinical observations.
- Ask follow-up questions about information in a selected patient's record.
- Explore structured healthcare datasets through Snowflake.

## Tech Stack

| Area             | Technologies                                           |
| ---------------- | ------------------------------------------------------ |
| Frontend         | React, TypeScript, Vite                                |
| Backend          | Node.js, Express, TypeScript                           |
| AI               | Anthropic Claude; OpenAI GPT and Google Gemini planned |
| Tool Integration | Model Context Protocol (MCP)                           |
| Healthcare       | Epic FHIR R4                                           |
| Data Analytics   | Snowflake (planned)                                    |
| Authentication   | SMART on FHIR Backend Services, OAuth 2.0, JWT         |
| Validation       | Zod                                                    |
| Deployment       | Microsoft Azure (planned)                              |

## Architecture

```text
React Frontend
      |
      v
  Express API
      |
      v
    AI Agent <----> Claude / OpenAI / Gemini
      |
      v
  MCP Client
      |
    stdio
      |
      v
  MCP Server
      |
      +-------------------+
      |                   |
      v                   v
 Epic FHIR tools     Snowflake tools
      |                   |
      v                   v
 Epic FHIR API         Snowflake
```

The frontend communicates with the Express API. The agent manages conversations and model-specific tool requests, while MCP provides a standardized interface for accessing healthcare tools across AI providers.

Backend services handle Epic authentication, FHIR requests, and response validation.

The diagram represents the intended architecture. Implementation progress is tracked in the roadmap below.

## Project Structure

The repository uses npm workspaces to organize the frontend and backend.

```text
ai-healthcare-agent/
├── client/                 # React frontend
├── server/
│   └── src/
│       ├── agent/          # AI orchestration
│       ├── controllers/    # Express request handlers
│       ├── mcp/            # MCP client and server
│       ├── routes/         # REST API endpoints
│       ├── schemas/        # Zod validation
│       └── services/       # Epic authentication and FHIR requests
├── docs/                   # Public JWKS
├── scripts/                # Development setup
└── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- An Anthropic API key
- An Epic on FHIR developer application configured for Backend Services authentication
- An RSA key pair and publicly accessible JWKS for Epic authentication

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Edward-Zgonc/ai-healthcare-agent.git
cd ai-healthcare-agent
npm install
```

### Environment Configuration

Create a `.env` file in `server/`:

```dotenv
PORT=3000
EPIC_CLIENT_ID=your_epic_client_id
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Configure the Epic application to use your public JWKS, and keep the matching RSA private key in the server's local key directory.

Never commit environment files, API keys, or private keys.

### Optional Git Setup

```bash
bash scripts/setup.sh
```

This configures the repository's `.gitmessage` commit template and sets VS Code as the Git editor when its command-line interface is available.

## Roadmap

- [x] TypeScript monorepo with npm workspaces
- [x] Epic FHIR patient search and Backend Services authentication
- [x] Express patient search endpoint
- [x] MCP client and server with patient search tool
- [x] Claude tool calling and multi-round agent loop
- [ ] Connect the AI agent to Express and build the clinician-facing React interface
- [ ] Add medications, allergies, conditions, and observations tools
- [ ] Integrate OpenAI GPT and Google Gemini
- [ ] Add Snowflake queries and analytics
- [ ] Expand authentication, authorization, testing, and security controls
- [ ] Deploy to Microsoft Azure

## Security

Development uses Epic's FHIR sandbox and synthetic patient records. Epic authentication is handled server-side using signed JWT assertions and cached OAuth access tokens.

Additional access controls, auditing, and security review are required before using real patient data.
