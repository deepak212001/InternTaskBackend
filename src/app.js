import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

app.use(express.json({ limit: '16kb' }))
// app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

app.get('/', (req, res) => {
    res.send("Welcome to the API")
})

import userRoutes from "./routes/user.routes.js"
app.use("/api", userRoutes);

export default app