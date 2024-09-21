import mongoose from "mongoose";
import colors from "colors";

let connected = false;

const connectDB = async () => {
    mongoose.set("strictQuery", false);

    if (connected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        if (conn.connection.host) {
            connected = true;
            console.log(`✅ ${colors.bgCyan(` MongoDB Connected: ${conn.connection.host}`)} `);
        }
    } catch (error) {
        console.error(`❌ ${colors.bgRed(` Error: ${error.message} `)}`);
        process.exit(1);
    }

}

export default connectDB;