import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' })); // support json bodies with base64 images

const PORT = 3000;

// Initialize the Google Gemini API Client securely on the server
// Note: We use the 'aistudio-build' User-Agent header as required for telemetry.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-Memory Database for local persistence during the active preview session
let projects = [
  {
    id: "the-urban-orchard",
    name: "The Urban Orchard",
    category: "Agriculture",
    description: "Providing fresh, organic produce to downtown.",
    fullDescription: "An innovative urban oasis dedicated to supplying fresh, sustainable, and organic crops to inner-city neighborhoods while hosting local workshops to teach city dwellers about modern agriculture.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbXj4oD6pYpCKRUGs7BcFXSIgUeDVSVQplGsg2ps3WMFJ4E445bP0KNmBrnt9IhlZH_n63EvHVzXBOTdRlUa8BIfl9Ig1PU1toWyFWApIFmT7NNDYR41brE12BvoFLrIJyKTJgZdmCz2-U_3-AeDxioJG5do7x2564f_OUIBKzyLm45MQhYinD0GCYtUI9ftKyi9OYNdMkGWplnk20p0xye-x9NNuWAcarUA6wqLv9ugfzyIyQfpF89Q",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBruY3uHFN-xS9BcUfpMb92U-iwlpaA6heNpbtZAuPgkTwjPF2V8LkZOCOehk9uGNntj3AkizjOVTJkTenIU7W3oRtFtzkkVUEx8KhW6jww5s6PijGbVLHVKgQl7x1lONMCpV3drv7NGCpZe0ACn_54ocQlWNMxiw2IN2Bg3Zu2TMCoA8tnuUs7cghwmOC33onogNIUACS7ED7NVtOaKE9JIlQzvaRpX-qLsgDQqmjJjOFGXwfAJ_gx5Q",
    milestone: "Next Grant: $500 for New Equipment",
    targetAmount: 2000,
    raisedAmount: 1500,
    tags: ["Agriculture", "Community Garden", "Urban Ag"],
    logs: [
      {
        id: "uo-log-1",
        dateLabel: "Today",
        timeLabel: "2:45 PM",
        rawText: "Just harvested 50lbs of kale for the community kitchen today!",
        text: "Harvested and delivered 50lbs of fresh, crisp organic kale to the downtown community kitchen, bringing nutrient-dense local food straight to neighborhood tables.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAbXj4oD6pYpCKRUGs7BcFXSIgUeDVSVQplGsg2ps3WMFJ4E445bP0KNmBrnt9IhlZH_n63EvHVzXBOTdRlUa8BIfl9Ig1PU1toWyFWApIFmT7NNDYR41brE12BvoFLrIJyKTJgZdmCz2-U_3-AeDxioJG5do7x2564f_OUIBKzyLm45MQhYinD0GCYtUI9ftKyi9OYNdMkGWplnk20p0xye-x9NNuWAcarUA6wqLv9ugfzyIyQfpF89Q"],
        timestamp: Date.now() - 3600000
      }
    ]
  },
  {
    id: "stitch-sow-tailors",
    name: "Stitch & Sow Tailors",
    category: "Craftsmanship",
    description: "Training local youth in sustainable textile arts.",
    fullDescription: "A modern, community-oriented sewing workshop that repurposes industrial textile waste to create high-quality modern garments, while mentoring underrepresented youth in sustainable design.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlaSFBam6Gw4n6H9NFglMvIFsOWy2ymM5P2r7cwsSjVTdz1zX26MEK4hh7j7SF23-oDlRMsGAbVwgJ4ooHwXZMnOvDDPCMdmcDCoCgkyzz69uP8agkv5Vbl2hKVZNenVPfvCkIhe6mvCZOz_pi6_U2R0ZbrpGu_Eb2Sn1QAv2lzsJRhD6k_kKPqwozZerCpob-4QHwWK9oc20MCXg4yM-rI5HyW6gU4l49mnTcLdpKyz5UyAnbOxQEgg",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnJbsld1gjLlu3svx4aNz9Fuu36w53kZuzOlyaNyrw--QIzWoTqwXQlJRWb9oIfmYiACddqdru0QBl44uEKr1qXVyYiZ9figVwyBu2E3Oe2_phc7cnV5zGdKIwbdzvINNoKGAx-eiM3QL4F8YEqNoW7k6Iilo7MRGG5PYlZlv6fSzoLaklNEMM-z_xGlAsBwySuoz5Vuu_OjYv-hpzow7M6_vipwUx-DEgNvgPVPogXzbcXVswLxiZ0g",
    milestone: "Next Grant: $1,200 for Upcycled Fabrics",
    targetAmount: 2000,
    raisedAmount: 800,
    tags: ["Craftsmanship", "Youth Training", "Sustainability"],
    logs: [
      {
        id: "sst-log-1",
        dateLabel: "Yesterday",
        timeLabel: "4:30 PM",
        rawText: "Our first batch of upcycled linen shirts is ready for the weekend market!",
        text: "Finished sewing our very first limited batch of upcycled linen shirts! Crafted by our local youth trainees, these durable items are set for the weekend market.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDlaSFBam6Gw4n6H9NFglMvIFsOWy2ymM5P2r7cwsSjVTdz1zX26MEK4hh7j7SF23-oDlRMsGAbVwgJ4ooHwXZMnOvDDPCMdmcDCoCgkyzz69uP8agkv5Vbl2hKVZNenVPfvCkIhe6mvCZOz_pi6_U2R0ZbrpGu_Eb2Sn1QAv2lzsJRhD6k_kKPqwozZerCpob-4QHwWK9oc20MCXg4yM-rI5HyW6gU4l49mnTcLdpKyz5UyAnbOxQEgg"],
        timestamp: Date.now() - 86400000
      }
    ]
  },
  {
    id: "rise-shine-bakery",
    name: "Rise & Shine Bakery",
    category: "Food & Drink",
    description: "Sourcing ancient grains from local family farms.",
    fullDescription: "A traditional slow-fermentation community sourdough bakery that sources 100% of its heritage grains directly from family-run regional farms, preserving ancient crops and sustaining agricultural heritage.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7ccHy1ywX7G_Sv1WAw5oSb7CZNWbEKzLMfgRgbnsyR7xwo3Iuk2GD7V5yvb9kUK9hfY0Y0y5gGeoOu_1BjYRt9o2SVw2jem9LVgoVM1U376C0T-XLYnVQ0Net4Ac4wId6WgXX9ocILubPBukbxv3JkoK-15zibLXRIWlUO5RAAMCjxOAqtqeNSu4194MujWz37wNSvjrFO8058sh8fJFJmrFavnqXjoEu_4UEIf47trtFwAZQG8gCPw",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN79PDxZFDUUzkwsXhXXJfUccjBON6GVleYGfxo-TMkfRLB0ZR3fKQlZy-u-9foTis6roKOW3XKDWjIEyJS-fp4TiSI7cTI5IoROhCO-PyvJiBw9U73PRDKop4d68M663uL3JhZKNo48hU57_2-rmrDFQIbdf_zFSZs2VrhQiRfV897EpLeNSxVTbk29X9NhR9gFJPUetOwUf2gncBsa4_vVTErSBBHQzqcZKFtFkT8Uf9TG6_83Xvvg",
    milestone: "Next Grant: $160 for Eco-Friendly Flour Silos",
    targetAmount: 2000,
    raisedAmount: 1840,
    tags: ["Food & Drink", "Artisan", "Local Sourcing"],
    logs: [
      {
        id: "rsb-log-1",
        dateLabel: "2 Days Ago",
        timeLabel: "9:15 AM",
        rawText: "Secured 500lbs of heritage rye for the winter baking season today!",
        text: "Secured a direct partnership with a local heritage grain farm to procure 500lbs of traditional winter rye, ensuring healthy, natural bread varieties for our customers.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA7ccHy1ywX7G_Sv1WAw5oSb7CZNWbEKzLMfgRgbnsyR7xwo3Iuk2GD7V5yvb9kUK9hfY0Y0y5gGeoOu_1BjYRt9o2SVw2jem9LVgoVM1U376C0T-XLYnVQ0Net4Ac4wId6WgXX9ocILubPBukbxv3JkoK-15zibLXRIWlUO5RAAMCjxOAqtqeNSu4194MujWz37wNSvjrFO8058sh8fJFJmrFavnqXjoEu_4UEIf47trtFwAZQG8gCPw"],
        timestamp: Date.now() - 172800000
      }
    ]
  },
  {
    id: "green-valley-urban-farm",
    name: "Green Valley Urban Farm",
    category: "Agriculture",
    description: "Sustainable rooftop farming in the heart of the city.",
    fullDescription: "Sustainable rooftop farming in the heart of the city. We're dedicated to providing fresh, organic produce to local food banks and community markets while teaching urban agriculture to local youth.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwSeLEDEfmdoBs8szHelDu3J9VsTQ1JBysVPHyyRXeXmZH8qWlySoqVASrAyKQIgaM74_jNV8V83WCrHBV3-vPVNA-52IzBiNPzCSo7XdC256DkR0Tuj-_RfCCyrxNRC99eVvs-nS9OApmNEU9YrbETlhVJYBxEKrADjbm-1cnQq5KDyqWi4tTqUdZlIWGIvmPyi-rBVkqTIS1xWBuuWo5ICh6d-i09DMdOy-jfrDnFj5m_6Cn1KW0cA",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwSeLEDEfmdoBs8szHelDu3J9VsTQ1JBysVPHyyRXeXmZH8qWlySoqVASrAyKQIgaM74_jNV8V83WCrHBV3-vPVNA-52IzBiNPzCSo7XdC256DkR0Tuj-_RfCCyrxNRC99eVvs-nS9OApmNEU9YrbETlhVJYBxEKrADjbm-1cnQq5KDyqWi4tTqUdZlIWGIvmPyi-rBVkqTIS1xWBuuWo5ICh6d-i09DMdOy-jfrDnFj5m_6Cn1KW0cA",
    milestone: "Next Grant: $500 for New Equipment",
    targetAmount: 20000,
    raisedAmount: 12450,
    tags: ["Agriculture", "Community Garden", "Urban Ag", "Youth Education"],
    logs: [
      {
        id: "gvuf-log-1",
        dateLabel: "Today",
        timeLabel: "2:45 PM",
        rawText: "Installed new irrigation system! This will reduce our water usage by 40% and ensure the new tomato plants get consistent hydration through the summer heat.",
        text: "Installed new irrigation system! This will reduce our water usage by 40% and ensure the new tomato plants get consistent hydration through the summer heat.",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBfks61QdkIN8GTrLPPSTsfMwj07thobp-EBIASxXCWRBJTWeuKhZUq7bif3BUcnuglUb1_bHj5J0HzEiEwfsUq_e98uJ7NMzSU3eZQEVue7uQoxBCvwk8ftr_HWcN_wMGCSwQmP2etohQJI771gI9Ut1HVi4blqFbHZhVp8uiAxd0mxkNPa8d62roudTyIaLsng26EN0uuXgDbzT8Tr4O6gYZCI55jG57xR0pCAW9AzBZA4RMpM18kMA"],
        timestamp: Date.now() - 3600000
      },
      {
        id: "gvuf-log-2",
        dateLabel: "Yesterday",
        timeLabel: "10:15 AM",
        rawText: "First harvest of the season! We delivered 50lbs of fresh spinach to the Heights Community Kitchen this morning.",
        text: "First harvest of the season! We delivered 50lbs of fresh spinach to the Heights Community Kitchen this morning.",
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCdo4iRJbD28gMLlypNGxfaxViUyuSgVnWyuNgwuBLuGPZF-UARqx4eAwtD7C4rKM_mGMOfapGbsQFvh8jXoEcGt0Jo5HtxBOiZP5Abia_FVYSZS87ZiXC2rpjhWSsTAAn2ygJuhJnDDWptj36AjtX3I5Lj6hJI0W_Ohj0H8RHwUbgW-ibp7kBSnVnNOwpcMXlwdPFfCyCUbyduFvs6cO_tZznDs9fgHeIamuEWSq5kYc9Zn8M0brEMJw",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDjNcJC4_7MbrNVKxCwh080WwTyLAxDgGU-fYHl9nCfhUs1x7-5_EfXEVhXEfQnX9c0r9yP-yZcI0f_IVSYbschij1FNETwQI3zQUG6K_1YXVptwMVRzS_k_geCv1iMO9KgVp6XqbhRBShG3Ados9o8ysuSE-rqZCPFvn4o4WzesthtE3lU9c4vKCJJYLxf50dXa4otTwUuiAb-eCfX4W4HjRI4IkOJtnY9lQuDfsNM6rOsCSUhunb1eQ"
        ],
        timestamp: Date.now() - 86400000
      },
      {
        id: "gvuf-log-3",
        dateLabel: "3 Days Ago",
        timeLabel: "4:00 PM",
        rawText: "Finalized the blueprints for the new educational pavilion. Construction starts next month once the seed funding goal is met!",
        text: "Finalized the blueprints for the new educational pavilion. Construction starts next month once the seed funding goal is met!",
        images: [],
        timestamp: Date.now() - 259200000
      }
    ]
  }
];

// Helper to format hours politely
function formatTime() {
  const d = new Date();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

// REST API Endpoints

// 1. GET all projects
app.get("/api/projects", (req, res) => {
  res.json({ projects });
});

// 2. GET a single project
app.get("/api/projects/:id", (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json({ project });
});

// 3. POST /api/summarize - Secures Gemini API rewrite of raw business updates
app.post("/api/summarize", async (req, res) => {
  const { rawText, category, businessName } = req.body;
  if (!rawText || !rawText.trim()) {
    return res.status(400).json({ error: "No update text provided" });
  }

  try {
    const prompt = `The small business "${businessName || 'Our Business'}" (operating in category "${category || 'General'}") has posted a raw, informal daily update about their progress:

"${rawText}"

As a professional copywriter for a transparent, community-powered micro-grant platform, rewrite this informal note into a beautifully formatted, clear, highly engaging, and authentic "Progress Card" update. 
- Retain all actual numbers, metrics, and technical accomplishments (e.g. pounds of harvest, percentage reduction, materials sourced).
- Ensure the tone is friendly, neighborhood-oriented, inspiring, and transparent.
- Avoid corporate hype or sounding like a marketing sales pitch. Keep it humble yet proud of the community impact.
- Make it 1-2 sentences maximum. Ensure it directly addresses what was achieved and why it helps the mission.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert copywriter for community-led funding platforms. You transform raw notes into clean, heart-warming, clear statements of real accomplishment."
      }
    });

    const summarizedText = response.text ? response.text.trim() : rawText;
    res.json({ text: summarizedText });
  } catch (error: any) {
    console.error("Gemini API Error in summarize route:", error);
    // Propagate friendly error or fallback text
    res.status(200).json({ 
      text: rawText, 
      warning: "Note: Used raw text fallback. Ensure process.env.GEMINI_API_KEY is configured." 
    });
  }
});

// 4. POST /api/projects/:id/log - Log new daily update with optional visual proof
app.post("/api/projects/:id/log", async (req, res) => {
  const { id } = req.params;
  const { rawText, images } = req.body;

  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  if (!rawText || !rawText.trim()) {
    return res.status(400).json({ error: "No raw text provided" });
  }

  try {
    // 1. Get the AI summary using Gemini inside this flow for instant, integrated results
    let summarizedText = rawText;
    try {
      const prompt = `The small business "${project.name}" (operating in category "${project.category}") has posted a raw, informal daily update about their progress:
"${rawText}"
As a professional copywriter for a transparent, community-powered micro-grant platform, rewrite this informal note into a beautifully formatted, clear, highly engaging, and authentic "Progress Card" update. Maintain key numbers and metrics. Make it 1-2 sentences maximum.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert copywriter for community-led funding platforms. You transform raw notes into clean, heart-warming, clear statements of real accomplishment."
        }
      });
      if (response.text) {
        summarizedText = response.text.trim();
      }
    } catch (err) {
      console.error("In-flow Gemini summary failed, falling back to rawText", err);
    }

    // 2. Create the new log
    const newLog = {
      id: `log-${Date.now()}`,
      dateLabel: "Today",
      timeLabel: formatTime(),
      rawText,
      text: summarizedText,
      images: images || [],
      timestamp: Date.now()
    };

    // Update previous logs so that "Today" transitions properly
    project.logs = project.logs.map(log => {
      if (log.dateLabel === "Today") {
        return { ...log, dateLabel: "Yesterday" };
      } else if (log.dateLabel === "Yesterday") {
        return { ...log, dateLabel: "3 Days Ago" };
      }
      return log;
    });

    project.logs.unshift(newLog);
    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to post daily progress update" });
  }
});

// 5. POST /api/projects/:id/donate - Plant a Seed donation logic
app.post("/api/projects/:id/donate", (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const donationAmount = Number(amount);
  if (isNaN(donationAmount) || donationAmount <= 0) {
    return res.status(400).json({ error: "Invalid donation amount" });
  }

  // Update raised funds
  project.raisedAmount = Math.min(project.targetAmount, project.raisedAmount + donationAmount);

  res.json({ project, success: true });
});

// Vite & Static Asset Handling Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CornGrant Server running on http://localhost:${PORT}`);
  });
}

startServer();
