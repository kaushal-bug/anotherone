// Team and Task Management
const teams = {
    'AI & Intelligence Core': {
        id: 'ai-core',
        description: 'Focused on AI integration, prompt engineering, and intelligent features',
        tasks: {
            sprint1: [
                'Rapidly test and compare 5 gift suggestion prompt designs (occasion, vibe, budget based)',
                'Define memory structure: What user context is remembered and reused?',
                'Create branching flows (birthday vs. wedding vs. farewell etc.) using OpenAI/Claude',
                'Draft gift suggestion formats (image? tone? links?)'
            ],
            sprint2: [
                'Chain prompts for conversational continuity',
                'Add memory (contextual follow-ups)',
                'QA 15 inputs and refine hallucinations',
                'Build fallback logic + write 5 sample flows that succeed'
            ]
        }
    },
    'Product & Engineering': {
        id: 'product-eng',
        description: 'Responsible for technical implementation and product development',
        tasks: {
            sprint1: [
                'Set up frontend in Next.js (basic layout + component scaffolding)',
                'Integrate OpenAI API (via a proxy or backend endpoint)',
                'Build a simple working input + output interface (static)'
            ],
            sprint2: [
                'Add backend session tracking (Supabase/Firebase)',
                'Hook AI output to gift card UI',
                'Implement clean, minimal chatbot UI',
                'Host v0 on Vercel + test on mobile'
            ]
        }
    },
    'Data & Gift Matching': {
        id: 'data-matching',
        description: 'Handles data organization, gift taxonomy, and matching algorithms',
        tasks: {
            sprint1: [
                'Finalize gift taxonomy: classify 50 gifts based on occasion, budget, emotion, aesthetic, vibe',
                'Tag these gifts manually in a clean Airtable',
                'Write basic filters and test match quality'
            ],
            sprint2: [
                'Enable vector retrieval (via pgvector or Pinecone optional)',
                'Link LLM responses to gift tags',
                'QA tag accuracy for 10 test inputs',
                'Curate final 30–40 gifts for v0 (with clean visuals + copy)'
            ]
        }
    },
    'Growth, Video & Social': {
        id: 'growth-social',
        description: 'Manages growth, content creation, and social media presence',
        tasks: {
            sprint1: [
                'Shoot 2–3 short reels: 1 emotional, 1 witty, 1 aesthetic (Instagram + TikTok style)',
                'Create meme templates based on gifting problems',
                'Design landing page with waitlist'
            ],
            sprint2: [
                'Publish all assets and test channels (LinkedIn, IG, WhatsApp, Reddit)',
                'Test 2 hook styles ("gift shame" vs. "flex gifting")',
                'Collect 50+ waitlist emails',
                'Push to 10 personal networks each'
            ]
        }
    },
    'Content & UX': {
        id: 'content-ux',
        description: 'Focuses on user experience, content strategy, and communication',
        tasks: {
            sprint1: [
                'Define gifting bot personality: what does it sound like? (humorous? warm? luxe?)',
                'Write sample chat messages, buttons, fail states',
                'Create 3 gifting personas'
            ],
            sprint2: [
                'Interview 5 potential users and revise tone based on feedback',
                'UX writing for chat, homepage, and buttons',
                'Tighten all flows for v0 demo'
            ]
        }
    }
};

// Task status tracking
const taskStatus = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    BLOCKED: 'blocked'
};

// Task priority levels
const taskPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

// Export for use in other files
export { teams, taskStatus, taskPriority }; 