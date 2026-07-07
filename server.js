
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    //apiKey: process.env.NVIDIA_API_KEY,
    apiKey: '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',
    baseURL: "https://integrate.api.nvidia.com/v1"
});

app.get("/", (req, res) => {
    res.send("Nemotron API Running");
});

app.post("/chat", async (req, res) => {

    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required."
            });
        }

        const completion = await client.chat.completions.create({

            model: "nvidia/nemotron-3-ultra-550b-a55b",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.2,
            top_p: 0.95,
            max_tokens: 4096,
            reasoning_budget: 2048,

            chat_template_kwargs: {
                enable_thinking: true
            }

        });

        res.json({
            success: true,
            response: completion.choices[0].message.content
        });

    }
    catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

app.listen(process.env.PORT || 3000, () => {

    console.log("Server Started");

});