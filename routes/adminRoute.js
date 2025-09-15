const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
router.get("/get-all-doctors", authMiddelware, async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).send({
            message: "Doctors Fetched Succesfully",
            success: true,
            data: doctors,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error
        });

    }
});
router.get("/get-all-users", authMiddelware, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            message: "Users Fetched Succesfully",
            success: true,
            data: users,
        });

    } catch (error) {
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error
        });

    }
});
router.post("/change-doctor-status", authMiddelware, async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, {
            status,
        });
        const user = await User.findOne({ _id: doctor.userId });
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-request-changed",
            message: `Your  doctor account Has been ${status}`,
            onClickPath: "/notifications",
        });
        user.isDoctor=status ==="approved" ?true :false;
        await user.save();
        res.status(200).send({
            message: "Doctor status updated succesfully",
            success: true,
            data: doctor,
        });
    } catch (error) {
        res.status(500).send({
            message: "Error applying doctor account",
            success: false,
            error!
        });

    }
});
module.exports = router;