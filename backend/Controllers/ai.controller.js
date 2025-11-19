import * as aiService from "../Services/gemini.ai.js";

export const getairesultContoller = async (req, res) => {
    const { prompt } = req.query;

    try {

        const result = await aiService.generateResult(prompt);
        res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching user:", error);
        // throw new Error("Error fetching user: " + error.message);
        res.status(500).json({ error: "Gemini API error", message: error.message });

    }
}