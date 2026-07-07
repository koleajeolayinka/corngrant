# 🌱 CornGrant (by Team coolspot)

CornGrant is a high-trust, community-backed micro-grant platform built for the DevCareer x Nomba Hackathon 2026. It allows small businesses across Nigeria to unlock instant funding via the Nomba API by providing transparent, daily "proof of work" updates automated by Google AI Studio.

---

## 🧭 Application Flow & Architecture

CornGrant utilizes a streamlined, three-screen architecture designed to bridge the trust gap between small business owners and everyday community backers:

1. **Donor Discovery Feed:** A premium, GoFundMe-inspired dashboard where backers browse active local campaigns, view live milestone progress bars, and see AI-summarized daily activity logs from business owners.
2. **Business Progress Logger:** A frictionless, mobile-optimized dashboard allowing busy entrepreneurs to quickly log their daily accomplishments and upload media proof, instantly feeding the community trust loop.
3. **Campaign Hub & Secure Checkout:** A split-pane layout showing chronological proof timelines on the left and a secure Nomba payment checkout widget on the right, allowing backers to instantly "plant a seed" via micro-grants.

---

## 🚀 Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Design & Flow:** Google Stitch & Google AI Studio
- **Intelligence Engine:** Gemini API via Google AI Studio (Automated progress log summarization)
- **Payment Layer:** Nomba API Core (Scoped sub-accounts and automated payment webhooks)

---

## 🛠️ Local Development & Deployment

### Prerequisites
- Node.js (v18+)
- Nomba Hackathon API Credentials

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Populate the following variables in your `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   APP_URL=http://localhost:3000
   NOMBA_PARENT_ACCOUNT_ID=your_nomba_parent_account_id
   NOMBA_SUB_ACCOUNT_ID=your_nomba_sub_account_id
   NOMBA_CLIENT_ID=your_nomba_client_id
   NOMBA_PRIVATE_KEY=your_nomba_private_key
   NOMBA_WEBHOOK_SIGNING_KEY=your_nomba_webhook_signing_key
   ```

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser:
   ```
   http://localhost:3000
   ```

### Building & Deploying for Production

1. Compile the static frontend assets and bundle the Node/Express backend:
   ```bash
   npm run build
   ```

2. Spin up the highly optimized production bundle:
   ```bash
   npm run start
   ```
