# EstatePulse AI

EstatePulse AI is a high-fidelity real estate valuation and analytics web platform. It integrates AI-powered valuation, property investment analytics, and an AI conversational advisor into a unified user experience.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your Gemini API key:
   Create a `.env.local` file in the root directory and add:
   ```bash
   GEMINI_API_KEY="your_api_key_here"
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## How to Deploy to Vercel

Since this is a Node.js/React project, Vercel is the perfect place to deploy it.

1. **Push your code to GitHub:** Ensure your latest changes are pushed to your GitHub repository.
2. **Go to Vercel:** Log in to [Vercel](https://vercel.com) and click **Add New... > Project**.
3. **Import Repository:** Select your `ESTATEPULSE-AI` repository from GitHub.
4. **Configure Project:**
   - **Framework Preset:** Vercel should automatically detect **Vite** or **Other**.
   - **Environment Variables:** Expand the "Environment Variables" section and add:
     - Name: `GEMINI_API_KEY`
     - Value: `<Your Actual Gemini API Key>`
5. **Deploy:** Click **Deploy**. Vercel will build your app and provide you with a live URL!

*(Note: We have already moved `requirements.txt` to the `backend/` folder so Vercel builds the frontend correctly without failing on Python dependencies).*
