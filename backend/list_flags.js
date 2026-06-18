const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const flags = await db.collection('featureflags').find({}).toArray();
    console.log(flags.map(f => f.moduleName));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
