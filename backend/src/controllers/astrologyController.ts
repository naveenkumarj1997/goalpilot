import { Request, Response } from 'express';
import AstrologyProfile from '../models/AstrologyProfile';
import AstrologyNote from '../models/AstrologyNote';
import tzlookup from 'tz-lookup';
import { calculateHoroscope, analyzeBirthChart } from '../services/astrologyEngine';
import { DateTime } from 'luxon';

const getBirthDateUTC = (dateObj: any, timeString: string, timezone: string): Date => {
  const dateStr = (dateObj instanceof Date ? dateObj.toISOString() : String(dateObj)).split('T')[0];
  const isoString = `${dateStr}T${timeString}:00`;
  const dt = DateTime.fromISO(isoString, { zone: timezone });
  return dt.toJSDate();
};


export const getAstrologyProfile = async (req: any, res: Response) => {
  try {
    const profiles = await AstrologyProfile.find({ user: req.user?._id }).sort({ isPrimary: -1, createdAt: 1 });
    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createOrUpdateProfile = async (req: any, res: Response) => {
  try {
    const { _id, relation, name, gender, dateOfBirth, timeOfBirth, placeOfBirth, language, photoUrl } = req.body;

    // Automatically determine timezone from lat/lng
    const timezone = tzlookup(placeOfBirth.lat, placeOfBirth.lng);

    // TODO: Phase 2 - Hook into the Astronomy engine here to calculate ascendant, moon sign, nakshatra etc before saving.
    
    // Enforce max 5 profiles
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
    }

    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProfile = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Profile ID required' });
    await AstrologyProfile.findOneAndDelete({ _id: id, user: req.user?._id });
    res.json({ message: 'Profile deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const getTodayHoroscope = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id }); // Fallback
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Calculate live positions for NOW using the user's birth city (for ascendant reference if needed, 
    // or just local transit). We'll use current date.
    const now = new Date();
    const currentTransit = calculateHoroscope(now, profile.placeOfBirth.lat, profile.placeOfBirth.lng);
    
    // Calculate birth chart
    const birthDate = getBirthDateUTC(profile.dateOfBirth, profile.timeOfBirth, profile.timezone); 
    const birthChart = calculateHoroscope(birthDate, profile.placeOfBirth.lat, profile.placeOfBirth.lng);
    
    // Add analysis
    const analysis = analyzeBirthChart(birthChart);

    res.json({
      profile,
      birthChart,
      currentTransit,
      analysis
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCurrentDaysHoroscope = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const today = new Date();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lat = profile.placeOfBirth.lat;
    const lng = profile.placeOfBirth.lng;

    const transitYesterday = calculateHoroscope(yesterday, lat, lng);
    const transitToday = calculateHoroscope(today, lat, lng);
    const transitTomorrow = calculateHoroscope(tomorrow, lat, lng);
    
    const birthDate = getBirthDateUTC(profile.dateOfBirth, profile.timeOfBirth, profile.timezone); 
    const birthChart = calculateHoroscope(birthDate, lat, lng);
    
    res.json({
      profile,
      birthChart,
      transits: {
        yesterday: transitYesterday,
        today: transitToday,
        tomorrow: transitTomorrow
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

import { calculateVimshottariDasha } from '../services/astrologyEngine';

export const getDashaPeriods = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const birthDate = getBirthDateUTC(profile.dateOfBirth, profile.timeOfBirth, profile.timezone); 
    const birthChart = calculateHoroscope(birthDate, profile.placeOfBirth.lat, profile.placeOfBirth.lng);
    const moon = birthChart.planets.find(p => p.name === 'Moon')!;
    
    const dashaPeriods = calculateVimshottariDasha(birthDate, moon.siderealLon);
    res.json(dashaPeriods);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

import { evaluateTransits } from '../services/astrologyEngine';

export const getTransitInterpretations = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // Calculate birth chart for Moon sign
    const birthDate = getBirthDateUTC(profile.dateOfBirth, profile.timeOfBirth, profile.timezone); 
    const birthChart = calculateHoroscope(birthDate, profile.placeOfBirth.lat, profile.placeOfBirth.lng);
    
    // Current transit
    const now = new Date();
    const currentTransit = calculateHoroscope(now, profile.placeOfBirth.lat, profile.placeOfBirth.lng);
    
    const interpretations = evaluateTransits(birthChart.moonSign, currentTransit.planets);

    res.json({
      moonSign: birthChart.moonSign,
      interpretations
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

import { calculateCompatibility } from '../services/astrologyEngine';

export const calculateMatch = async (req: any, res: Response) => {
  try {
    const profileId = req.query.profileId;
    const query: any = { user: req.user?._id };
    if (profileId) query._id = profileId;
    else query.isPrimary = true;
    
    let profile = await AstrologyProfile.findOne(query);
    if (!profile && !profileId) profile = await AstrologyProfile.findOne({ user: req.user?._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // 1. Calculate user's chart
    const birthDate = getBirthDateUTC(profile.dateOfBirth, profile.timeOfBirth, profile.timezone); 
    const userChart = calculateHoroscope(birthDate, profile.placeOfBirth.lat, profile.placeOfBirth.lng);
    
    // 2. Parse partner's info from req.body
    const { partnerDob, partnerTob, partnerLat, partnerLng, partnerGender } = req.body;
    
    if (!partnerDob || !partnerTob || partnerLat === undefined || partnerLng === undefined) {
      return res.status(400).json({ message: 'Partner birth details missing' });
    }

    const partnerTz = tzlookup(partnerLat, partnerLng);
    const partnerDate = getBirthDateUTC(partnerDob, partnerTob, partnerTz);
    const partnerChart = calculateHoroscope(partnerDate, partnerLat, partnerLng);

    // Identify who is boy and who is girl
    let boyChart, girlChart;
    if (profile.gender === 'Male' && partnerGender === 'Female') {
      boyChart = userChart;
      girlChart = partnerChart;
    } else if (profile.gender === 'Female' && partnerGender === 'Male') {
      boyChart = partnerChart;
      girlChart = userChart;
    } else {
      // Fallback or same-sex (using arbitrary assignment for the algorithm)
      boyChart = userChart;
      girlChart = partnerChart;
    }

    const matchResult = calculateCompatibility(
      boyChart.moonNakshatra, boyChart.moonSign,
      girlChart.moonNakshatra, girlChart.moonSign
    );

    res.json({
      userChart: { moonSign: userChart.moonSign, nakshatra: userChart.moonNakshatra },
      partnerChart: { moonSign: partnerChart.moonSign, nakshatra: partnerChart.moonNakshatra },
      matchResult
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

import axios from 'axios';

export const searchCities = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    if (query.length < 3) {
      return res.json([]);
    }
    
    // We dynamically require cities.json to avoid keeping it in memory entirely if not needed
    const cities = require('cities.json');
    
    let results = cities
      .filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10)
      .map((c: any) => ({
        name: c.name,
        lat: Number(c.lat),
        lng: Number(c.lng),
        country: c.country,
        state: c.admin1 || ''
      }));
      
    // If local DB doesn't have enough results, fallback to Nominatim OpenStreetMap API
    if (results.length < 5) {
      try {
        const nominatimRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: query,
            format: 'json',
            limit: 5,
            featuretype: 'settlement'
          },
          headers: {
            'User-Agent': 'GoalPilot-AstrologyApp/1.0' // Required by Nominatim policy
          }
        });

        const osmResults = nominatimRes.data.map((item: any) => {
          const parts = item.display_name.split(', ');
          return {
            name: item.name || parts[0],
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            country: parts[parts.length - 1],
            state: parts.length > 2 ? parts[parts.length - 2] : ''
          };
        });

        // Merge and deduplicate based on exact name match
        const existingNames = new Set(results.map((r:any) => r.name.toLowerCase()));
        osmResults.forEach((osm: any) => {
          if (!existingNames.has(osm.name.toLowerCase())) {
            results.push(osm);
          }
        });
      } catch (err) {
        console.error("Nominatim API error:", err);
      }
    }
      
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Astrology Notes Controllers ---

export const getNotes = async (req: any, res: Response) => {
  try {
    const notes = await AstrologyNote.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createNote = async (req: any, res: Response) => {
  try {
    const { title, content, tags, source } = req.body;
    const note = new AstrologyNote({
      user: req.user?._id,
      title,
      content,
      tags,
      source
    });
    await note.save();
    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateNote = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags, source } = req.body;
    
    const note = await AstrologyNote.findOneAndUpdate(
      { _id: id, user: req.user?._id },
      { title, content, tags, source },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteNote = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const note = await AstrologyNote.findOneAndDelete({ _id: id, user: req.user?._id });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

