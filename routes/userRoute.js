const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor=require("../models/doctorModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authmiddeleware = require("../middlewares/authMiddelware");
router.post("/register", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(200).send({ message: "User Already Exists", success: false })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body); 
        await newuser.save();
        res.status(200).send({ message: "User Created Succesfully", success: true });
    } catch (error) {
        res.status(500).send({ message: "Error Creating User", success: false.error });
    };
});
 

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: "User Does Not Exist", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: " Pasword is incorrect", success: false });
        } else {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            })
            res.status(200).send({ message: "Login Succesfull", success: true, data: token });
        }

    } catch (error) {
        console.log(error);
        res.status(200).send({ message: " Error in  Logging ", success: false, error });

    }

});
router.post('/get-user-info-by-id', authmiddeleware, async (req,res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        const password=undefined;
        if (!user) {
            return res.status(200).send({ message: "user DOes Not exist ", success: false })
        }
        else {
            res.status(200).send({
                success: true,
                 data: user,
            });
        }

    } catch (error) {
        res.status(500).send({ message: " Error getting User Info", success: false, error });
    }
});
router.post("/apply-doctor-account",  authmiddeleware, async (req, res) => {
    try {
    const newdoctor=new Doctor({...req.body , status:"pending"});
    await newdoctor.save();
    const adminUser=await User.findOne({isAdmin:true});
    const unseenNotifications=adminUser.unseenNotifications;
    unseenNotifications.push({ 
        type:"new-doctor-request",
        message:`${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
        data:{
            doctorId:newdoctor._id,
            name:newdoctor.firstName+" "+newdoctor.lastName
        },
        onClickPath: "/admin/doctors",
    })
    await User.findByIdAndUpdate(adminUser._id,{unseenNotifications});
    res.status(200).send({success:true,message:"Doctor account applied successully"})

    } catch (error) {
        res.status(500).send({ message: "Error Applying Doctor Account", success: false, error: error.message });

    };
});
router.post("/mark-all-notifications-as-seen",  authmiddeleware, async (req, res) => {
    try {
          const user=await User.findOne({_id: req.body.userId});
          const unseenNotifications=user.unseenNotifications;
          const seenNotifications=user.seenNotifications;
          seenNotifications.push(...unseenNotifications);
          user.unseenNotifications=[];
          user.seenNotifications=seenNotifications;
          const updatedUser=await user.save();
          updatedUser.password=undefined;
          res.status(200).send({success:true, message:"al Notifications Mark as Seen",
            data:updatedUser,
          });
    } catch (error) {
        res.status(500).send({ message: "Error", success: false});

    };
});
router.post("/delete-all-notifications",  authmiddeleware, async (req, res) => {
    try {
          const user=await User.findOne({_id: req.body.userId});
          user.seenNotifications=[];
          user.unseenNotifications=[];
          const updatedUser=await user.save();
          updatedUser.password=undefined;
          res.status(200).send({success:true, message:"all Notifications Mark as Seen",
            data:updatedUser,
          });
    } catch (error) {
        res.status(500).send({ message: "Error", success: false});

    };
});

module.exports = router;