const fs = require('fs');
let code = fs.readFileSync('src/controllers/astrologyController.ts', 'utf8');

// Update getAstrologyProfile to return all profiles
code = code.replace(
  `export const getAstrologyProfile = async (req: any, res: Response) => {
  try {
    const profile = await AstrologyProfile.findOne({ user: (req as any).user?._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);`,
  `export const getAstrologyProfile = async (req: any, res: Response) => {
  try {
    const profiles = await AstrologyProfile.find({ user: req.user?._id }).sort({ isPrimary: -1, createdAt: 1 });
    res.json(profiles);`
);

// Update createOrUpdateProfile
code = code.replace(
  `export const createOrUpdateProfile = async (req: any, res: Response) => {
  try {
    const { name, gender, dateOfBirth, timeOfBirth, placeOfBirth, language, photoUrl } = req.body;`,
  `export const createOrUpdateProfile = async (req: any, res: Response) => {
  try {
    const { _id, relation, name, gender, dateOfBirth, timeOfBirth, placeOfBirth, language, photoUrl } = req.body;`
);

code = code.replace(
  `    let profile = await AstrologyProfile.findOne({ user: (req as any).user?._id });

    if (profile) {
      // Update existing
      profile.name = name;
      profile.gender = gender;
      profile.dateOfBirth = dateOfBirth;
      profile.timeOfBirth = timeOfBirth;
      profile.placeOfBirth = placeOfBirth;
      profile.timezone = timezone;
      if (language) profile.language = language;
      if (photoUrl) profile.photoUrl = photoUrl;
      await profile.save();
    } else {
      // Create new
      profile = new AstrologyProfile({
        user: req.user?._id,
        name,
        gender,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        timezone,
        language,
        photoUrl
      });
      await profile.save();
    }`,
  `    // Enforce max 5 profiles
    const count = await AstrologyProfile.countDocuments({ user: req.user?._id });
    
    let profile;
    if (_id) {
      profile = await AstrologyProfile.findOne({ _id, user: req.user?._id });
    }
    
    if (profile) {
      // Update existing
      profile.name = name;
      if (relation) profile.relation = relation;
      profile.gender = gender;
      profile.dateOfBirth = dateOfBirth;
      profile.timeOfBirth = timeOfBirth;
      profile.placeOfBirth = placeOfBirth;
      profile.timezone = timezone;
      if (language) profile.language = language;
      if (photoUrl) profile.photoUrl = photoUrl;
      await profile.save();
    } else {
      if (count >= 5) {
        return res.status(400).json({ message: 'Maximum 5 profiles allowed per user' });
      }
      // Create new
      const isPrimary = count === 0; // First profile is primary
      profile = new AstrologyProfile({
        user: req.user?._id,
        isPrimary,
        relation: relation || 'Friend',
        name,
        gender,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        timezone,
        language,
        photoUrl
      });
      await profile.save();
    }`
);

// Update getTodayHoroscope
code = code.replace(
  `export const getTodayHoroscope = async (req: any, res: Response) => {
  try {
    const profile = await AstrologyProfile.findOne({ user: (req as any).user?._id });`,
  `export const getTodayHoroscope = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id }); // Fallback`
);

// Update getDashaPeriods
code = code.replace(
  `export const getDashaPeriods = async (req: any, res: Response) => {
  try {
    const profile = await AstrologyProfile.findOne({ user: req.user?._id });`,
  `export const getDashaPeriods = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id });`
);

// Update getTransitInterpretations
code = code.replace(
  `export const getTransitInterpretations = async (req: any, res: Response) => {
  try {
    const profile = await AstrologyProfile.findOne({ user: req.user?._id });`,
  `export const getTransitInterpretations = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id });`
);

// Update calculateMatch
code = code.replace(
  `export const calculateMatch = async (req: any, res: Response) => {
  try {
    const profile = await AstrologyProfile.findOne({ user: req.user?._id });`,
  `export const calculateMatch = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id });`
);

// Update deleteProfile to use req.params.id
code = code.replace(
  `export const deleteProfile = async (req: any, res: Response) => {
  try {
    await AstrologyProfile.findOneAndDelete({ user: req.user?._id });
    res.json({ message: 'Profile deleted successfully' });`,
  `export const deleteProfile = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Profile ID required' });
    await AstrologyProfile.findOneAndDelete({ _id: id, user: req.user?._id });
    res.json({ message: 'Profile deleted successfully' });`
);

fs.writeFileSync('src/controllers/astrologyController.ts', code);
console.log('Update complete!');
