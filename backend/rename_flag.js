const { MongoClient } = require('mongodb');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    // Rename in FeatureFlags
    const result = await db.collection('featureflags').updateOne(
      { moduleName: 'Job Tracker' },
      { $set: { moduleName: 'Job Discovery' } }
    );
    console.log('Feature flag renamed:', result.modifiedCount);

    // Update user moduleOverrides
    const users = await db.collection('users').find({ 'moduleOverrides.Job Tracker': { $exists: true } }).toArray();
    for (const u of users) {
      const overrides = u.moduleOverrides || {};
      if (overrides['Job Tracker'] !== undefined) {
        overrides['Job Discovery'] = overrides['Job Tracker'];
        delete overrides['Job Tracker'];
        await db.collection('users').updateOne(
          { _id: u._id },
          { $set: { moduleOverrides: overrides } }
        );
      }
    }
    console.log('Users updated:', users.length);

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
