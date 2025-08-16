import {model, Schema} from "mongoose";

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            default: null,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            default: 'personal',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        photo: {
            type: String,
            default: null,
    },
    },
   {
    timestamps: true,
    versionKey: false,
  },
);

export const Contact = model('Contact', contactSchema);

