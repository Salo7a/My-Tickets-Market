import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", async (req, res) => {
    res.send({currentUser: req.user || null});
});

export {router as currentUserRouter};