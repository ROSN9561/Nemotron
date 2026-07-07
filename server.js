import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// NVIDIA Client
const client = new OpenAI({
    apiKey: "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",
    baseURL: "https://integrate.api.nvidia.com/v1"
});

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Nemotron API Running"
    });
});

// Chat API
app.post("/chat", async (req, res) => {

    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        const completion = await client.chat.completions.create({

            model: "nvidia/nemotron-3-ultra-550b-a55b",

            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.3,
            top_p: 0.95,
            max_tokens: 4096,
            reasoning_budget: 2048,

            chat_template_kwargs: {
                enable_thinking: true
            }

        });

        return res.json({
            success: true,
            response: completion.choices[0]?.message?.content || ""
        });

    }
    catch (error) {

        console.error("NVIDIA ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
            details: error.response?.data || null
        });

    }

});

// Test Endpoint
app.get("/test", async (req, res) => {

    try {

        const completion = await client.chat.completions.create({

            model: "nvidia/nemotron-3-ultra-550b-a55b",

            messages: [
                {
                    role: "user",
                    content: "Hello"
                }
            ],

            max_tokens: 100

        });

        res.send(completion.choices[0]?.message?.content || "");

    }
    catch (error) {

        console.error(error);

        res.status(500).json(error);

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
