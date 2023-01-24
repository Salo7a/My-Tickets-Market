import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {RequestValidationError} from "../errors/request-validation-error";
import {BadRequestError} from "../errors/bad-request-error";

import {User} from "../models/user";

const router = express.Router();
const NAME_REGEX = /^([a-zA-Z\xC0-\uFFFF]+([\-\' ]{0,1}[a-zA-Z\xC0-\uFFFF]+)*[.]{0,1}){1,2}$/

router.post("/api/users/register", [
    body("email").trim().isEmail().withMessage("Email is not valid"),
    body("password").isLength({min: 6, max: 20}).withMessage("Password must be between 6 and 20 characters"),
    body("firstName").trim().matches(NAME_REGEX).withMessage("First name is not valid"),
    body("lastName").trim().matches(NAME_REGEX).withMessage("Last name is not valid")
], async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    const {email, password, firstName, lastName} = req.body;

    const existingEmail = await User.emailExists(email);
    if (existingEmail) {
        throw new BadRequestError("Email is already in use!");
    }
    const user = User.build({
        email, password, firstName, lastName
    });
    await user.save()
    res.status(201).send(user);
});

export {router as registerRouter};