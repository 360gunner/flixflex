import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const databaseURL: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/flixflex';

const connectDB = async () => {
  try {
    await mongoose.connect(databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection successful');
  } catch (error) {
    console.error('MongoDB connection error: ', error);
    process.exit(1);
  }
};

export default connectDB;
