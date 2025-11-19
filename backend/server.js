const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const arttoys = require("./routes/arttoys");
const orders = require("./routes/orders");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load env
dotenv.config({ path: "./config/config.env" });

// Connect DB (only once)
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later."
  }
});
app.use(limiter);

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookies
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true
  })
);

// Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/arttoys", arttoys);
app.use("/api/v1/orders", orders);

// Swagger config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "YourArtToy - ArtToy PreOrder System API",
      version: "1.0.0",
      description:
        "RESTful API for Art Toy Pre-Order System with user authentication and role-based authorization.",
      contact: {
        name: "YourArtToy API Support",
        email: "support@yourarttoy.com"
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC"
      }
    },
    servers: [
      {
        url: `/api/v1`,
        description: "Vercel Serverless"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Art Toy Pre-Order API Documentation"
  })
);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "YourArtToy API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Root
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to YourArtToy API",
    version: "1.0.0",
    documentation: "/api-docs",
    health: "/health"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("API ERROR:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// --------------------
// LOCAL SERVER ONLY
// --------------------
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(
      `YourArtToy API Server running locally at http://localhost:${PORT}`
    );
  });

  // Graceful shutdown for local
  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  });
}

// Export for Vercel serverless
module.exports = app;
