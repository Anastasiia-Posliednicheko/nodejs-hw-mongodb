import mongoose from "mongoose";


export async function initMongoConnection() {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(connectionString);
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Mongo connection error:', error);
        process.exit(1);
    }
}

