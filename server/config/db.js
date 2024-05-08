import { set, connect } from 'mongoose';
const connectDB = async () => {
    try {
        set('strictQuery', false);
        const conn = await connect(process.env.MONGODB_URI);
        console.log(`Database connected successfully ${conn.connection.host}`);
    } catch (error){
        console.log(error);
    }
    
}

export default connectDB;