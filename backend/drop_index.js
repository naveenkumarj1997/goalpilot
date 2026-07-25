const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const db = mongoose.connection.db;
    const collection = db.collection('astrologyprofiles');
    
    // Check if index exists before dropping
    const indexes = await collection.indexes();
    const hasUserIndex = indexes.some(idx => idx.name === 'user_1');
    
    if (hasUserIndex) {
      await collection.dropIndex('user_1');
      console.log("Successfully dropped the unique index 'user_1' on astrologyprofiles.");
    } else {
      console.log("Index 'user_1' not found, it may have already been dropped.");
    }
  } catch (error) {
    console.error("Error dropping index:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

dropIndex();
