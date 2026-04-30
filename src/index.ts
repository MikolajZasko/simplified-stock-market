import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
    res.json({
        status: `message: app running on port ${PORT}`,
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});