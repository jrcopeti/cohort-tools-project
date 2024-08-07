require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const isAuthenticated = require("./middleware/jwt.middleware");

const { connectDB } = require("./config/db.config");

// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARE

app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES

const allRoutes = require("./routes/index.routes");
app.use("/", allRoutes);

const cohortsRoutes = require("./routes/cohorts.routes");
app.use("/", isAuthenticated, cohortsRoutes);

const studentsRoutes = require("./routes/students.routes");
app.use("/", isAuthenticated, studentsRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// START SERVER
connectDB();
const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
