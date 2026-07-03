
# 🌱 CornGrant (by Team coolspot)

CornGrant is a community-funded platform built for the DevCareer x Nomba Hackathon. It allows small businesses to harvest peer-to-peer funding by turning daily "proof of work" updates into transparent milestones, unlocking community micro-grants without old-school bureaucracy.


---

## 🧭 Application Flow & User Journey

CornGrant bridges the trust gap between small businesses and everyday backers using a streamlined, three-screen architecture designed in Google Stitch:

### 1. Donor Discovery Feed (Web Interface)
* **The Concept:** The gateway for community backers to find local businesses to support.
* **The Flow:** Backers browse a modern, clean feed of active small businesses. Each card showcases the business's core summary, a live funding milestone progress bar, and an automated snippet of their latest "Daily Proof of Work" update. Clicking the **"Back this Growth"** primary action button seamlessly routes the donor to the project details.

### 2. Business Progress Logger (Frictionless Mobile Web Dashboard)
* **The Concept:** The dashboard built specifically for busy business owners to easily prove execution.
* **The Flow:** Rather than tackling heavy paperwork, owners log in to see their active funding milestone prominently displayed at the top. Using a minimal entry block labeled *"What did you accomplish today?"*, they quickly write their daily milestone and drop in direct visual proof (photos/videos). Pressing **"Post Proof & Grow"** instantly streams this to the database, where Google AI Studio automatically summarizes it for public feeds.

### 3. Campaign Detail Page & Checkout (Integrated Hub)
* **The Concept:** The direct relationship-builder where trust meets funding.
* **The Flow:** A clean, split-screen layout. The **left column** serves as a transparent timeline, logging chronological daily text and media proof posted by the owner. The **right column** houses the core checkout system. Backers securely input micro-grant amounts and tap **"Plant a Seed"**, executing instant, frictionless funding powered behind the scenes by Nomba API structures.

---

## 🚀 Tech Stack & Core Services
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Design Framework:** Google Stitch & Google AI Studio
- **Intelligence Engine:** Gemini API via Google AI Studio (for real-time progress card summaries)
- **Infrastructure:** Google Cloud (Data Architecture & Storage)
- **Payment Layer:** Nomba API (Seamless peer-to-peer micro-grants)

---

## 🛠️ How to Run Locally

**Prerequisites:** Node.js

1. **Install dependencies:**
   ```bash
   npm install
