# EstatePulse AI

EstatePulse AI is an AI-powered real estate valuation and analytics platform.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## How to Deploy on Vercel

Since this project uses Vite (React) for the frontend and optionally an Express/Node.js backend, here is how you can deploy it on Vercel:

### Frontend Only Deployment
If you only need to deploy the frontend interface (and any serverless functions in an `api/` folder if you add one later):

1. **Push your code to GitHub**: Make sure all changes are committed and pushed to your repository.
2. **Go to Vercel**: Log in to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3. **Import Repository**: Select your `ESTATEPULSE-AI-` repository from GitHub.
4. **Configure Project**:
   - **Framework Preset**: Vercel should automatically detect **Vite**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**: Add your `GEMINI_API_KEY` in the Environment Variables section.
6. **Deploy**: Click Deploy. Vercel will build and host your frontend.

### Full-Stack Deployment (Frontend + Custom Server)
If you need the `server.ts` (Express server) to run continuously on the cloud:
Vercel is primarily designed for Serverless functions. A long-running Express server in `server.ts` won't run correctly out of the box on Vercel's static hosting.

To run the full Node.js backend (`server.ts`) alongside the frontend, you should consider deploying to **Render** or **Railway**:
1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a **Web Service**.
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm run start`
5. Add your `GEMINI_API_KEY` as an environment variable.
6. Deploy!
