import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import hpp from 'hpp';
import modules from "./modules";
import exceptionFilter from "./middlewares/exception-filter";

const app = express();

// Configure CORS first, before helmet
const corsOptions = {
  origin: [
    'https://app.bucks.com', // production
    'https://staging.bucks.com', // staging
    'http://localhost:3000', // local dev
  ],
  credentials: true, // Required for sending Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow JWT tokens
};

app.use(cors(corsOptions));

app.use(hpp());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));


app.use(modules);

app.get("/", (_req, res) => {
  res.send("Bucks Sandbox API is running...");
});

app.use((_req, res, _next) => {
  res.status(404).json({
    message: 'Resource does not exist',
  });
});

app.use(exceptionFilter);

export default app;