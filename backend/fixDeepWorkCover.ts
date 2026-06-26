import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from './src/models/WisdomBook';
import { connectDB } from './src/config/db';

dotenv.config();

const updateCover = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const result = await WisdomBook.findOneAndUpdate(
      { title: "Deep Work" },
      { 
        $set: { 
          coverImage: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg"
        } 
      },
      { new: true }
    );

    if (result) {
      console.log('Successfully updated Deep Work cover image!');
    } else {
      console.log('Deep Work book not found in DB.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating data:', error);
    process.exit(1);
  }
};

updateCover();
