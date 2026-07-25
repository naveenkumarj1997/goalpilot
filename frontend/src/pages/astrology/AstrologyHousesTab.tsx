import React from 'react';
import { Home, IndianRupee, MessageCircle, Heart, Users, Activity, Scale, Skull, Compass, Briefcase, TrendingUp, Moon } from 'lucide-react';

export default function AstrologyHousesTab() {
  const houses = [
    {
      num: 1,
      nameTamil: 'லக்ன பாவம் (1st House)',
      nameEnglish: 'Lagnam / Ascendant',
      icon: <Home className="w-6 h-6 text-fuchsia-400" />,
      color: 'border-fuchsia-500/30 bg-fuchsia-500/5',
      points: [
        'உயிர் மற்றும் உடல் (Life & Physical Body)',
        'தோற்றம் மற்றும் குணம் (Appearance & Character)',
        'ஆரோக்கியம் (Health)',
        'புகழ் மற்றும் ஆயுள் (Fame & Longevity)'
      ]
    },
    {
      num: 2,
      nameTamil: 'தன பாவம் (2nd House)',
      nameEnglish: 'Kutumba Bhava (Wealth/Family)',
      icon: <IndianRupee className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/5',
      points: [
        'தனம் மற்றும் வருமானம் (Wealth & Bank Balance)',
        'குடும்பம் (Family)',
        'வாக்கு மற்றும் பேச்சுத்திறன் (Speech)',
        'வலது கண் (Right Eye) & ஆரம்பக் கல்வி (Primary Education)'
      ]
    },
    {
      num: 3,
      nameTamil: 'சகோதர பாவம் (3rd House)',
      nameEnglish: 'Sahaja Bhava (Courage/Siblings)',
      icon: <MessageCircle className="w-6 h-6 text-sky-400" />,
      color: 'border-sky-500/30 bg-sky-500/5',
      points: [
        'தைரியம் மற்றும் வீரியம் (Courage & Vitality)',
        'இளைய சகோதரம் (Younger Siblings)',
        'தொடர்புகள் மற்றும் எழுத்துத் திறன் (Communication & Writing)',
        'குறுகிய பயணங்கள் (Short Journeys)'
      ]
    },
    {
      num: 4,
      nameTamil: 'சுக பாவம் (4th House)',
      nameEnglish: 'Matru Bhava (Mother/Comforts)',
      icon: <Heart className="w-6 h-6 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-500/5',
      points: [
        'தாய் (Mother)',
        'சுகம் மற்றும் மன அமைதி (Comforts & Peace of Mind)',
        'வீடு மற்றும் வாகனம் (House & Vehicles)',
        'பள்ளிக் கல்வி மற்றும் சொத்துக்கள் (School Education & Assets)'
      ]
    },
    {
      num: 5,
      nameTamil: 'புத்திர பாவம் (5th House)',
      nameEnglish: 'Putra Bhava (Children/Creativity)',
      icon: <Users className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/5',
      points: [
        'பூர்வ புண்ணியம் (Past Life Merits)',
        'குழந்தைகள் / புத்திர பாக்கியம் (Children)',
        'காதல் மற்றும் கலைகள் (Romance & Creativity)',
        'புத்திக்கூர்மை (Intelligence & Wisdom)'
      ]
    },
    {
      num: 6,
      nameTamil: 'சத்ரு பாவம் (6th House)',
      nameEnglish: 'Ari Bhava (Enemies/Disease)',
      icon: <Activity className="w-6 h-6 text-red-500" />,
      color: 'border-red-500/30 bg-red-500/5',
      points: [
        'நோய் மற்றும் கடன் (Disease & Debts)',
        'எதிரிகள் மற்றும் வழக்குகள் (Enemies & Litigation)',
        'போட்டித் தேர்வுகள் (Competitive Exams)',
        'அடிமைத் தொழில் (Service / Employment)'
      ]
    },
    {
      num: 7,
      nameTamil: 'களத்திர பாவம் (7th House)',
      nameEnglish: 'Kalathra Bhava (Spouse/Partners)',
      icon: <Scale className="w-6 h-6 text-pink-400" />,
      color: 'border-pink-500/30 bg-pink-500/5',
      points: [
        'களத்திரம் / திருமணம் (Spouse / Marriage)',
        'கூட்டாளிகள் (Business Partners)',
        'சமூக உறவுகள் (Public Relations)',
        'வெளிநாட்டுப் பயணம் (Foreign Travel)'
      ]
    },
    {
      num: 8,
      nameTamil: 'ஆயுள் பாவம் (8th House)',
      nameEnglish: 'Ayur Bhava (Longevity/Obstacles)',
      icon: <Skull className="w-6 h-6 text-slate-400" />,
      color: 'border-slate-500/30 bg-slate-500/5',
      points: [
        'ஆயுள் மற்றும் மரணம் (Longevity & Nature of Death)',
        'திடீர் விபத்துக்கள் மற்றும் அவமானம் (Accidents & Disgrace)',
        'மறைமுகச் செல்வம் / புதையல் (Hidden Wealth & Inheritance)',
        'மறைபொருள் ஆராய்ச்சி (Occult Sciences / Astrology)'
      ]
    },
    {
      num: 9,
      nameTamil: 'பாக்கிய பாவம் (9th House)',
      nameEnglish: 'Bhagya Bhava (Fortune/Dharma)',
      icon: <Compass className="w-6 h-6 text-orange-400" />,
      color: 'border-orange-500/30 bg-orange-500/5',
      points: [
        'பாக்கியம் மற்றும் அதிர்ஷ்டம் (Fortune & Luck)',
        'தந்தை மற்றும் குரு (Father & Guru)',
        'மதம் மற்றும் ஆன்மீகம் (Religion & Spirituality)',
        'நீண்டதூரப் பயணங்கள் மற்றும் உயர்கல்வி (Long Journeys & Higher Education)'
      ]
    },
    {
      num: 10,
      nameTamil: 'கர்ம பாவம் (10th House)',
      nameEnglish: 'Karma Bhava (Profession)',
      icon: <Briefcase className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-500/5',
      points: [
        'தொழில் மற்றும் கர்மா (Profession & Career Actions)',
        'புகழ் மற்றும் அந்தஸ்து (Fame & Social Status)',
        'அரசாங்க ஆதரவு (Government Support)',
        'நிர்வாகத் திறன் (Leadership & Management)'
      ]
    },
    {
      num: 11,
      nameTamil: 'லாப பாவம் (11th House)',
      nameEnglish: 'Labha Bhava (Gains/Friends)',
      icon: <TrendingUp className="w-6 h-6 text-teal-400" />,
      color: 'border-teal-500/30 bg-teal-500/5',
      points: [
        'லாபம் மற்றும் வருமானம் (Profits & Gains)',
        'ஆசைகள் நிறைவேறுதல் (Fulfillment of Desires)',
        'மூத்த சகோதரம் (Older Siblings)',
        'நண்பர்கள் நெட்வொர்க் (Friends & Social Networks)'
      ]
    },
    {
      num: 12,
      nameTamil: 'விரய பாவம் (12th House)',
      nameEnglish: 'Vyaya Bhava (Expenses/Losses)',
      icon: <Moon className="w-6 h-6 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-500/5',
      points: [
        'விரயம் மற்றும் செலவுகள் (Expenses & Losses)',
        'தூக்கம் மற்றும் படுக்கை சுகம் (Sleep & Bed Pleasures)',
        'மோட்சம் (Spiritual Liberation / Salvation)',
        'வெளிநாடு மற்றும் மருத்துவமனை வாசம் (Foreign Lands & Hospitalization)'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-fuchsia-500/20">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Home className="w-6 h-6 text-fuchsia-400" />
            12 வீடுகள் (The 12 Houses / Bhavas)
          </h2>
          <p className="text-sm text-slate-400">Discover what each of the 12 astrological houses signifies in Vedic Astrology.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => (
          <div key={house.num} className={`bg-slate-900/60 rounded-xl p-5 border shadow-lg hover:scale-[1.02] transition-transform duration-300 ${house.color}`}>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="p-2 bg-slate-800 rounded-lg shadow-inner">
                {house.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{house.nameTamil}</h3>
                <p className="text-xs text-slate-400">{house.nameEnglish}</p>
              </div>
            </div>

            <ul className="space-y-2">
              {house.points.map((point, idx) => (
                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-fuchsia-400 mt-1 flex-shrink-0">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
