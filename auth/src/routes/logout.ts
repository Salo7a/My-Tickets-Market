import express from "express";

const router = express.Router();

router.get("/api/users/logout", (req, res) => {
    req.session = null;
    res.send({msg: "Logged Out"});
});

export {router as logoutRouter};