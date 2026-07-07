export interface Log {
  id: string;
  dateLabel: string; // e.g., "Today", "Yesterday", "3 Days Ago"
  timeLabel: string; // e.g., "2:45 PM"
  rawText: string;   // The original informal progress message from the owner
  text: string;      // The AI-summarized "Progress Card" text
  images: string[];  // Visual proofs (hotlinked or uploaded base64 strings)
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  logo: string;
  milestone: string;
  targetAmount: number;
  raisedAmount: number;
  tags: string[];
  logs: Log[];
  nombaWalletId?: string;
}

export interface Contribution {
  projectId: string;
  amount: number;
  donorEmail: string;
  timestamp: number;
}
