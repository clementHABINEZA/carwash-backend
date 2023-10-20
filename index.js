//Dependencies
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import Mongoose from "mongoose";
import cors from "cors";

//Routes
import userAuth from "./routes/auth.route";
import carwashRoute from "./routes/carWash.route";
import userRoute from "./routes/user.route";
import bookingRoute from "./routes/booking.route";

const app = express();
const PORT = process.env.PORT || 7001;

Mongoose.connect(process.env.MONGO_URL)
	.then(() => console.log("Database started "))
	.catch((err) => {
		console.log(err);
	});
const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", cors(), userAuth);
app.use("/api/users", cors(), userRoute);
app.use("/api/booking", cors(), bookingRoute);
app.use("/api/carwash", cors(), carwashRoute);

app.listen(PORT, () => {
	console.log("CarWash backend started ");
});
