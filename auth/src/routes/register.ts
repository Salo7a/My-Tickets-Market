import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import jwt from 'jsonwebtoken';

import {User} from "../models/user";

import {RequestValidationError} from "../errors/request-validation-error";
import {BadRequestError} from "../errors/bad-request-error";
import {validateRequest} from "../middlewares/validate-request";

const router = express.Router();
const NAME_REGEX = /^([a-zA-Z\xC0-\uFFFF]+([\-\' ]{0,1}[a-zA-Z\xC0-\uFFFF]+)*[.]{0,1}){1,2}$/

router.post("/api/users/register", [
        body("email").trim().isEmail().withMessage("Email is not valid"),
        body("password").isLength({min: 6, max: 20}).withMessage("Password must be between 6 and 20 characters"),
        body("firstName").trim().matches(NAME_REGEX).withMessage("First name is not valid"),
        body("lastName").trim().matches(NAME_REGEX).withMessage("Last name is not valid")
    ], validateRequest,
    async (req: Request, res: Response) => {
        const {email, password, firstName, lastName} = req.body;

        // Check if email already exists
        const existingEmail = await User.emailExists(email);
        if (existingEmail) {
            throw new BadRequestError("Email is already in use!");
        }

        // Create user
        const user = User.build({
            email, password, firstName, lastName
        });

        // Save user data to db
        await user.save()

        // JWT Generation
        const userJWT = jwt.sign({
            id: user.id,
            email: user.email,
            fullName: user.fullName
        }, process.env.JWT_KEY!);

        // Store jwt in session object, to set it as a cookie.
        req.session = {
            jwt: userJWT
        }
        res.status(201).send(user);
    });

export {router as registerRouter};