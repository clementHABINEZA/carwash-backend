import Carwash from "../models/carwash.model";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = require("express").Router();

//Create a carwash
router.post("/", async (req, res) => {
	const newOrder = new Carwash(req.body);

	try {
		const savedCarwash = await newOrder.save();
		res.status(200).json(savedCarwash);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Update carwash Details
router.put("/:id", async (req, res) => {
	try {
		const updatedCarwashs = await Carwash.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedCarwashs);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Delete a CarWash
router.delete("/:id", async (req, res) => {
	try {
		await Carwash.findByIdAndDelete(req.params.id);
		res.status(200).json("Carwash has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get one carwash
router.get("/find/:id", async (req, res) => {
	try {
		const Carwashs = await Carwash.findById(req.params.id);
		res.status(200).json(Carwashs);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get all carwash
router.get("/", async (req, res) => {
	try {
		const Carwashs = await Carwash.find();
		res.status(200).json(Carwashs);
	} catch (err) {
		res.status(500).json(err);
	}
});

//User Login
router.post("/login", async (req, res) => {
	try {
		const user = await Carwash.findOne({
			email: req.body.email,
		});

		!user && res.status(401).json("Invalid Crediantials ");

		if (user) {
			const originalPassword = user.password;

			const inputPassword = req.body.password;

			originalPassword != inputPassword &&
				res.status(401).json("Invalid Credentials");

			const accessToken = jwt.sign(
				{
					id: user._id,
					isAdmin: user.isAdmin,
				},
				process.env.JWT_SEC,
				{ expiresIn: "3d" }
			);

			const { password, ...others } = user._doc;
			res.status(200).json({ ...others, accessToken });
		}
	} catch (err) {
		console.error(err);
		// res.status(500).json(err);
	}
});

module.exports = router;
