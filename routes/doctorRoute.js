const express = require("express");
const Doctor = require("../models/doctorModel");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddelware");

router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId });

        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: "Doctor not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Doctor Info fetched Successfully",
            data: doctor,
        });

    } catch (error) {
        res.status(500).send({
            message: "Error getting Doctor Info",
            success: false,
            error: error.message,
        });
    }
});
router.post('/update-doctor-profile', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId },req.body);
            res.status(200).send({
            success: true,
            message: "Doctor Profile Updated Successfully",
            data: doctor,
        });

    } catch (error) {
        res.status(500).send({
            message: "Error getting Doctor Inf",
            success: false,
            error: error.message,
        });
    }
});

module.exports = router;
