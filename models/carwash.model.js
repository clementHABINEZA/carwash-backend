import mongoose from "mongoose";

const CarwashSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String, required: true },
		latitude: { type: Number, required: true },
		longitude: { type: Number, required: true },
		rating: { type: Number, required: true },
		address: { type: String, required: true },
		open: { type: String, required: true },
		close: { type: String, required: true },
		review: [
			{
				client: {
					type: String,
				},
				desc: {
					type: String,
				},
			},
		],
		services: [
			{
				serviceName: {
					type: String,
				},
				price: {
					type: String,
				},
				category: {
					type: String,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Carwash", CarwashSchema);
