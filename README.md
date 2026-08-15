<div align="center">

<img src="https://img.shields.io/badge/EstatePulse_AI-v1.0.0-ffcc00?style=for-the-badge&logo=googlehome&logoColor=black"/>
<img src="https://img.shields.io/badge/AI_Real_Estate_Analytics-Prototype-000000?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Gemini_Powered-Property_Intelligence-ffcc00?style=for-the-badge"/>

<br/>

```
███████╗███████╗████████╗ █████╗ ████████╗███████╗██████╗ ██╗   ██╗██╗     ███████╗███████╗
██╔════╝██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██║   ██║██║     ██╔════╝██╔════╝
█████╗  ███████╗   ██║   ███████║   ██║   █████╗  ██████╔╝██║   ██║██║     ███████╗█████╗
██╔══╝  ╚════██║   ██║   ██╔══██║   ██║   ██╔══╝  ██╔═══╝ ██║   ██║██║     ╚════██║██╔══╝
███████╗███████║   ██║   ██║  ██║   ██║   ███████╗██║     ╚██████╔╝███████╗███████║███████╗
╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝
                              █████╗ ██╗
                             ██╔══██╗██║
                             ███████║██║
                             ██╔══██║██║
                             ██║  ██║██║
                             ╚═╝  ╚═╝╚═╝
```

### AI-Powered Real Estate Valuation & Predictive Property Analytics Platform

**Built by Neha Matre**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Scikit--learn](https://img.shields.io/badge/Scikit--learn-ML-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![Gemini](https://img.shields.io/badge/Gemini_API-Conversational_AI-ffcc00?style=flat-square&logo=google&logoColor=black)](https://ai.google.dev)

</div>

---

## Core Platform Capabilities (v1.0 Prototype)
*   **Unified Property Intelligence Dashboard**: A single, responsive interface (black & yellow theme) that brings valuation, market trends, and financial planning into one command view.
*   **AI-Driven Valuation Engine**: A regression-based Automated Valuation Model (AVM) trained on property attributes, locality data, and comparable sales to generate real-time price estimates with confidence bands.
*   **Conversational Property Assistant**: A Gemini-powered chatbot/voice assistant (NIRA) that answers natural-language questions about listings, EMI math, and locality trends.
*   **Integrated Financial Planning Tools**: Built-in ROI and EMI calculators so buyers and investors can model affordability and returns without leaving the platform.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Platform Architecture](#platform-architecture)
- [Modules](#modules)
  - [PVE — Property Valuation Engine](#module-1-pve--property-valuation-engine)
  - [MIA — Market Intelligence & Analytics](#module-2-mia--market-intelligence--analytics)
  - [GeoScope — Map & Location Insights](#module-3-geoscope--map--location-insights)
  - [ROI/EMI — Financial Planning Suite](#module-4-roiemi--financial-planning-suite)
  - [NIRA — Conversational AI Assistant](#module-5-nira--conversational-ai-assistant)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Team](#team)

---

## Problem Statement

Buying, selling, or investing in real estate in India is still largely **guesswork-driven**:

| Pain Point | Impact |
|-----------|--------|
| No standardised valuation | Buyers and sellers rely on broker opinion, not data |
| Fragmented information | Price trends, locality data, and financing live in separate tools |
| Manual affordability math | EMI/ROI calculations done ad hoc, often incorrectly |
| No conversational access | Users must dig through listings instead of just asking a question |

**The core gap**: There's no single platform that combines a data-driven valuation model with market context and financial planning in one place — most tools do only one of these well.

---

## Solution Overview

**EstatePulse AI** is an **AI-powered valuation and analytics platform** that brings property pricing, market intelligence, and financial planning together, backed by a **conversational assistant** for natural-language access.

### What makes it different

| Capability | Typical Listing Site | EstatePulse AI |
|-----------|----------------------|-----------------|
| Valuation | Static asking price | ML-driven AVM with confidence range |
| Market Context | Separate research needed | Built-in trend analytics |
| Financial Planning | External calculators | Native ROI/EMI tools |
| Access | Search & filter only | Conversational assistant (chat + voice) |
| Location Insight | Basic map pin | Interactive locality analytics |

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ESTATEPULSE AI — LAYERED ARCHITECTURE               │
├─────────────────────────────────────────────────────────────────────────┤
│  LAYER 4 │ PRESENTATION                                                 │
│          │  Landing Page  │  Login/Auth  │  Dashboard  │  Chat Widget   │
├──────────┼────────────────────────────────────────────────────────────-┤
│  LAYER 3 │ INTELLIGENCE ENGINES                                         │
│          │  PVE (Valuation) │ MIA (Market) │ GeoScope (Maps) │ NIRA     │
├──────────┼────────────────────────────────────────────────────────────-┤
│  LAYER 2 │ API / SERVICE LAYER                                         │
│          │  FastAPI backend  │  Gemini API integration                 │
├──────────┼────────────────────────────────────────────────────────────-┤
│  LAYER 1 │ DATA                                                        │
│          │  Property listings  │  Locality datasets  │  Sales history  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Modules

---

### Module 1: PVE — Property Valuation Engine

> *Data-driven price estimates, not guesswork*

**Purpose**: Estimate a property's fair market value from its attributes (area, location, amenities, age) and comparable sales, using a trained regression model.

#### Key Features
- **ML-based valuation** using Scikit-learn regression models trained on property/locality features
- **Confidence range output**, not just a single point estimate
- **Feature-driven pricing**: area, BHK, locality, amenities, age of property

---

### Module 2: MIA — Market Intelligence & Analytics

> *See where prices are headed, not just where they are*

**Purpose**: Surface locality-level price trends and comparables so users understand market context around a valuation.

#### Key Features
- **Trend visualisations** built with Pandas/NumPy-driven analysis
- **Comparable property surfacing** for context around any estimate
- **Interactive charts** for exploring price movement over time

---

### Module 3: GeoScope — Map & Location Insights

> *A property is only as good as its location*

**Purpose**: Give users an interactive, map-based view of a property's surroundings — connectivity, nearby amenities, and locality context.

#### Key Features
- **Interactive map view** of listings and localities
- **Location-aware valuation context** feeding back into PVE

---

### Module 4: ROI/EMI — Financial Planning Suite

> *Know what you can actually afford before you fall in love with a listing*

**Purpose**: Let buyers and investors model loan affordability and investment returns directly on the platform.

#### Key Features
- **EMI calculator** — loan amount, tenure, and interest rate → monthly outgo
- **ROI calculator** — rental yield and appreciation-based return modelling

---

### Module 5: NIRA — Conversational AI Assistant

> *Ask, don't search*

**Purpose**: Provide a natural-language chat and voice interface, powered by the Gemini API, so users can ask questions about valuations, listings, or affordability in plain language.

#### Key Features
- **Gemini-powered chatbot** for property Q&A
- **Voice assistant mode** for hands-free queries
- **Context-aware answers** grounded in the platform's valuation and market data

---

## Tech Stack

### Frontend

| Technology | Use |
|-----------|-----|
| **React 18+** | UI framework |
| **Vite** | Build tool / dev server |
| **TypeScript** | Type-safe application code |
| **Tailwind CSS** | Styling (black & yellow theme) |

### Backend / ML

| Technology | Use |
|-----------|-----|
| **FastAPI** | API layer (planned/in-progress backend service) |
| **Scikit-learn** | Valuation regression model |
| **Pandas / NumPy** | Data processing for market analytics |
| **Gemini API** | Conversational assistant (NIRA) |

---

## Quick Start

### Prerequisites

- Node.js

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:

```env
GEMINI_API_KEY="your_api_key_here"
```

### 3. Run the app

```bash
npm run dev
```

> **Note**: This quick start covers the current runnable build (frontend + Gemini-powered assistant). The FastAPI/ML valuation backend described above is part of the full platform build-out.

---

## Project Structure

```
estatepulse-ai/
│
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Router + layout
│   ├── index.css                # Global styles (black & yellow theme)
│   │
│   ├── pages/
│   │   ├── Landing.tsx          # Landing page
│   │   ├── Login.tsx            # Login/auth page
│   │   ├── Dashboard.tsx        # Main valuation dashboard
│   │   └── ...
│   │
│   ├── components/
│   │   ├── valuation/           # PVE — valuation form & results
│   │   ├── market/              # MIA — trend charts, comparables
│   │   ├── map/                 # GeoScope — interactive map view
│   │   ├── calculators/         # ROI/EMI — financial planning tools
│   │   └── assistant/           # NIRA — chat/voice widget (Gemini API)
│   │
│   └── api/
│       └── gemini.ts            # Gemini API client
│
├── .env.local                   # GEMINI_API_KEY
├── package.json
├── vite.config.ts
└── README.md                    # This file
```

---

## Roadmap

- [ ] Stand up the FastAPI backend and connect the Scikit-learn valuation model
- [ ] Wire up locality/market datasets for MIA
- [ ] Integrate map provider for GeoScope
- [ ] Persist user accounts beyond the login page UI

---

## Team

**EstatePulse AI**

| Name | Role |
|------|------|
| **Neha Matre** | Author & Developer |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**EstatePulse AI — Real Estate Decisions, Backed by Data**

</div>
