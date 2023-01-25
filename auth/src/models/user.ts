import mongoose, {Schema, Model, Document} from "mongoose";
import {PasswordManager} from "../services/password-manager";

/** Interface describing the properties required for a new user. */
interface UserAttrs {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

/** Interface describing the properties a user model has. */
interface UserModel extends Model<any> {
    build(attrs: UserAttrs): any

    emailExists(email: string): any;
}

/** Interface describing the properties a user document has. */
interface UserDoc extends Document {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

const userSchema = new Schema<UserAttrs>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        },
        versionKey: false
    }
});

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
})

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const hashed = await PasswordManager.hashPassword(this.get('password'));
        this.set('password', hashed);
    }
});
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

userSchema.statics.emailExists = async function (email: string) {
    return this.findOne({email});
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export {User};