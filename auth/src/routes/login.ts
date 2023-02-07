import express, {Request, Response} from "express";
import {body} from "express-validator";
import {validateRequest} from "@as-mytix/common";
import {User} from "../models/user";
import {BadRequestError} from "@as-mytix/common";
import {PasswordManager} from "../services/password-manager";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/api/users/login", [
        body("email").trim().isEmail().withMessage("Email is not valid."),
        body("password").notEmpty().withMessage("Password can't bet empty.")
    ], validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        // Check if a user with the given email exists
        const existingUser = await User.findOne({email});
        if (!existingUser) throw new BadRequestError("No user exists with this email");

        // Check if password is correct
        const passwordMatches = await PasswordManager.comparePassword(existingUser.password, password);
        if (!passwordMatches) throw new BadRequestError("Incorrect Password");

        // JWT Generation
        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
            fullName: existingUser.fullName
        }, process.env.JWT_KEY!);

        // Store jwt in session object, to set it as a cookie.
        req.session = {
            jwt: userJWT
        }
        res.status(200).send(existingUser);
    });

export {router as loginRouter};