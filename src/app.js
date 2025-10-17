import express from 'express';
import { userRoutes } from './routes/UserRoutes.js';
import { postRoutes } from './routes/PostsRoutes.js';

const app = express();
app.use(express.json());

app.use("/red-social", userRoutes);
app.use("/posts", postRoutes)

app.listen(3000, () => {
    console.log("servidor conectado y listo para recibir requests");
});

