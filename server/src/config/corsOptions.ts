import { CorsOptions } from "cors";
 
const corsOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
 