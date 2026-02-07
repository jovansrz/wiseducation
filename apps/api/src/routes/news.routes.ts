import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const apiKey = "9e774c53225c4d38900039d83921b88a";
        // Fetch a larger pool of articles (60) to allow for randomization
        const response = await fetch(`https://newsapi.org/v2/everything?q=investasi OR saham OR bisnis&language=id&sortBy=publishedAt&pageSize=60&apiKey=${apiKey}`, {
            headers: {
                'User-Agent': 'WISEducation-API/1.0'
            }
        });

        if (!response.ok) {
            console.error(`News API Error: ${response.status} ${response.statusText}`);
            throw new Error(`News API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Shuffle articles to ensure variety on every refresh
        if (data.articles && Array.isArray(data.articles)) {
            for (let i = data.articles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [data.articles[i], data.articles[j]] = [data.articles[j], data.articles[i]];
            }
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Failed to fetch news" });
    }
});

export default router;
