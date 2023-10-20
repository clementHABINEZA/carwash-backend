import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phone: { type: String, required: true },
		plateNumber: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
