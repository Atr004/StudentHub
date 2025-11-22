import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import listingRoutes from "./routes/listingRoutes.js";
app.use("/api/listings", listingRoutes);

import path from "path";
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

import uploadRoutes from "./routes/uploadRoutes.js";
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);
