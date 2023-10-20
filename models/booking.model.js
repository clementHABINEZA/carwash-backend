import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
	{
		carwashId: { type: String, required: true },
		plateId: { type: String, required: true },
		timeSlot: { type: String, required: true },
		status: { type: String, default: "pending" },
		amountPaid: { type: String },
		service: { type: String },
		paymentMethod: { type: String },
		owner: { type: String },
		ownerEmail: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
