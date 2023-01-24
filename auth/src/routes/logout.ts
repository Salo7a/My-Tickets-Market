import express from "express";

const router = express.Router();

router.get("/api/users/logout", (req, res) => {
    res.send("Hello!");
});

export {router as logoutRouter};