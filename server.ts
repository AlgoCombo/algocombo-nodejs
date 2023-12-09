import mongodbInstance from "./src/handlers/mongodb.handler";
import app from "./src/app";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Connect to database
    mongodbInstance.on("error", (error: any) => {
      console.error("Database connection error:", error);
    });

    mongodbInstance.once("open", () => {
      console.log("Connected to the database");
    });

    //start app
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (err: any) {
    console.log(err);
  }
})();
