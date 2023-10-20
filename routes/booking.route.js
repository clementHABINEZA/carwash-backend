import Booking from "../models/booking.model";
import nodemailer from "nodemailer";
import { EmailTemplate } from "../utils/EmailTemplate";
import { UpdatedStatusEmailTemplate } from "../utils/UpdateStatusEmailTemplate";

const router = require("express").Router();

const createMailTransporter = () => {
	const mailTransporter = nodemailer.createTransport({
		service: "gmail",
		port: 465,
		secure: true,
		logger: true,
		debug: true,
		secureConnection: false,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
	return mailTransporter;
};

const sendBookingEmail = ({
	carWashname,
	client,
	time,
	service,
	plate,
	email,
}) => {
	const transporter = createMailTransporter();
	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: "Booking carwash",
		html: EmailTemplate({
			carWashname,
			client,
			time,
			service,
			plate,
		}),
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log("passed");
		}
	});
};

const sendUpdateEmail = ({ owner, status, email }) => {
	const transporter = createMailTransporter();
	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: "Update on Booking",
		html: UpdatedStatusEmailTemplate({
			owner,
			status,
		}),
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		} else {
			console.log("passed");
		}
	});
};

router.post("/", async (req, res) => {
	const newOrder = new Booking(req.body);

	// Check if the user already has a "pending" or "started" booking
	const existingUserBooking = await Booking.findOne({
		owner: req.body.owner,
		status: { $in: ["Pending", "Started"] },
	});

	if (existingUserBooking) {
		res.status(400).json({
			message:
				"You already have a booking in progress or pending. You cannot make another booking.",
		});
	} else {
		const existingBookingsCount = await Booking.countDocuments({
			timeSlot: req.body.timeSlot,
			carwashId: req.body.carwashId,
		});
    
		// if you want more or less change that 3 into number you want 
		if (existingBookingsCount < 3) {
			try {
				const savedOrder = await newOrder.save();
				res.status(200).json(savedOrder);
				sendBookingEmail({
					carWashname: req.body.carwashName,
					client: req.body.owner,
					time: req.body.timeSlot,
					service: req.body.service,
					plate: req.body.plateId,
					email: req.body.carwashEmail,
				});
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(400).json({
				message:
					"Booking for this timeSlot is full. Please choose another time.",
			});
		}
	}
});

router.put("/:id", async (req, res) => {
	try {
		const updatedOrder = await Booking.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		sendUpdateEmail({
			status: req.body.status,
			owner: updatedOrder.owner,
			email: updatedOrder.ownerEmail,
		});
		res.status(200).json(updatedOrder);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await Booking.findByIdAndDelete(req.params.id);
		res.status(200).json("Order has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/plateId/:plateId", async (req, res) => {
	try {
		const orders = await Booking.find({ plateId: req.params.plateId });
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET Booking by carWashId
router.get("/carWash/:carwashId", async (req, res) => {
	try {
		const orders = await Booking.find({ carwashId: req.params.carwashId });
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get all booking
router.get("/", async (req, res) => {
	try {
		const orders = await Booking.find();
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});
//Get one carwash
router.get("/find/:id", async (req, res) => {
	try {
		const order = await Booking.findById(req.params.id);
		res.status(200).json(order);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
