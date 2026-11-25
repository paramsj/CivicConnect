import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from local .env or parent .env
if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} else if (fs.existsSync(path.resolve(process.cwd(), '../.env'))) {
    dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
} else {
    dotenv.config();
}

import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    });
