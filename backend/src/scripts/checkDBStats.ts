import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkStorage() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('No MONGO_URI found in .env');
        process.exit(1);
    }
    await mongoose.connect(mongoUri);
    
    // Get DB stats
    const stats = await mongoose.connection.db!.stats();
    
    // Convert bytes to MB
    const dataSizeMB = (stats.dataSize / (1024 * 1024)).toFixed(2);
    const storageSizeMB = (stats.storageSize / (1024 * 1024)).toFixed(2);
    const indexSizeMB = (stats.indexSize / (1024 * 1024)).toFixed(2);
    const totalSizeMB = ((stats.storageSize + stats.indexSize) / (1024 * 1024)).toFixed(2);
    
    console.log(`--- Database Stats ---`);
    console.log(`Database Name: ${stats.db}`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Objects (Documents): ${stats.objects}`);
    console.log(`Data Size: ${dataSizeMB} MB (Uncompressed raw data)`);
    console.log(`Storage Size: ${storageSizeMB} MB (Actual space taken on disk for data)`);
    console.log(`Index Size: ${indexSizeMB} MB`);
    console.log(`Total Size (Storage + Index): ${totalSizeMB} MB`);
    console.log(`----------------------`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fetching stats:', error);
    process.exit(1);
  }
}

checkStorage();
