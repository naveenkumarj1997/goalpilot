import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WisdomBook from '../models/WisdomBook';

dotenv.config();

const fiveAmClubBook = {
  title: 'The 5 AM Club: Own Your Morning. Elevate Your Life.',
  author: 'Robin Sharma',
  coverImage: 'https://covers.openlibrary.org/b/isbn/9781443456623-L.jpg',
  categories: ['Productivity', 'Self-Help', 'Personal Development'],
  themes: [
    { en: 'Morning Routine', ta: 'காலை வழக்கம்' },
    { en: 'Discipline', ta: 'ஒழுக்கம்' }
  ],
  overview: {
    en: 'Legendary leadership and elite performance expert Robin Sharma introduced The 5 AM Club concept over twenty years ago. This book explains the habits that have helped clients maximize their productivity, activate their best health, and bulletproof their serenity in this age of overwhelming complexity.',
    ta: 'புகழ்பெற்ற தலைமை மற்றும் உயர்மட்ட செயல்திறன் நிபுணரான ராபின் ஷர்மா, இருபது ஆண்டுகளுக்கு முன்பே 5 ஏஎம் கிளப் (The 5 AM Club) கருத்தை அறிமுகப்படுத்தினார். மிகப்பெரிய சிக்கலான இந்தக் காலத்தில் வாடிக்கையாளர்களின் உற்பத்தித்திறனை அதிகரிக்கவும், அவர்களின் சிறந்த ஆரோக்கியத்தைச் செயல்படுத்தவும், மற்றும் அவர்களின் அமைதியைப் பாதுகாக்கவும் உதவிய பழக்கங்களை இந்தப் புத்தகம் விளக்குகிறது.'
  },
  topQuotes: [
    { en: 'Own your morning. Elevate your life.', ta: 'உங்கள் காலையைச் சொந்தமாக்குங்கள். உங்கள் வாழ்க்கையை உயர்த்துங்கள்.' },
    { en: 'All change is hard at first, messy in the middle, and gorgeous at the end.', ta: 'அனைத்து மாற்றங்களும் ஆரம்பத்தில் கடினமானவை, நடுவில் குழப்பமானவை, மற்றும் முடிவில் அழகானவை.' },
    { en: 'Take excellent care of the front end of your day, and the rest of your day will pretty much take care of itself. Destroy your morning and you break your day.', ta: 'உங்கள் நாளின் முற்பகுதியைச் சிறப்பாகக் கவனித்துக்கொள்ளுங்கள், உங்களின் மீதமுள்ள நாள் தன்னையே கவனித்துக்கொள்ளும். உங்கள் காலையை அழித்தால், உங்கள் நாளை நீங்கள் உடைத்துவிடுவீர்கள்.' }
  ],
  lessons: [
    {
      lessonNumber: 1,
      title: { en: 'The Victory Hour', ta: 'வெற்றி நேரம்' },
      explanation: { en: 'The Victory Hour is the time between 5:00 AM and 6:00 AM. It is a time of solitude and peace, completely free from distractions, designed to set you up for a world-class day.', ta: 'வெற்றி நேரம் என்பது காலை 5:00 மணி முதல் 6:00 மணி வரையிலான நேரமாகும். இது தனிமை மற்றும் அமைதியின் நேரமாகும், கவனச்சிதறல்களில் இருந்து முற்றிலும் விடுபட்டு, உங்களை உலகத்தரம் வாய்ந்த ஒரு நாளுக்குத் தயார்படுத்த வடிவமைக்கப்பட்டுள்ளது.' },
      whyItMatters: { en: 'The way you start your day determines the quality of your day. Waking up early gives you a massive psychological advantage and time to focus on personal growth before the world demands your attention.', ta: 'உங்கள் நாளை நீங்கள் தொடங்கும் விதம் உங்கள் நாளின் தரத்தைத் தீர்மானிக்கிறது. அதிகாலையில் விழித்தெழுவது உங்களுக்கு மிகப்பெரிய உளவியல் நன்மையையும், உலகம் உங்கள் கவனத்தைக் கோருவதற்கு முன் தனிப்பட்ட வளர்ச்சியில் கவனம் செலுத்த நேரத்தையும் வழங்குகிறது.' },
      example: { en: 'Waking up at 5 AM to exercise, meditate, and read, rather than waking up at 7 AM and immediately scrolling through stressful emails.', ta: 'காலை 7 மணிக்கு எழுந்து உடனடியாக மன அழுத்தத்தைத் தரும் மின்னஞ்சல்களைப் பார்ப்பதற்குப் பதிலாக, காலை 5 மணிக்கு எழுந்து உடற்பயிற்சி செய்வது, தியானம் செய்வது மற்றும் படிப்பது.' },
      actionStep: { en: 'Set your alarm for 5:00 AM tomorrow (or 1 hour earlier than usual). Do not look at any screens during this first hour.', ta: 'நாளைக் காலை 5:00 மணிக்கு (அல்லது வழக்கத்தை விட 1 மணி நேரம் முன்னதாக) அலாரம் வையுங்கள். இந்த முதல் ஒரு மணி நேரத்தில் எந்தத் திரைகளையும் பார்க்க வேண்டாம்.' },
      reflectionQuestion: { en: 'Are you constantly reacting to the day\'s emergencies because you didn\'t take time to proactively prepare your mind?', ta: 'உங்கள் மனதை முன்கூட்டியே தயார்படுத்த நேரம் ஒதுக்காததால், நாளின் அவசரநிலைகளுக்கு நீங்கள் தொடர்ந்து எதிர்வினையாற்றுகிறீர்களா?' }
    },
    {
      lessonNumber: 2,
      title: { en: 'The 20/20/20 Formula', ta: '20/20/20 சூத்திரம்' },
      explanation: { en: 'The Victory Hour should be split into three 20-minute segments: Move (Exercise), Reflect (Meditation/Journaling), and Grow (Learning/Reading).', ta: 'வெற்றி நேரத்தை மூன்று 20 நிமிடப் பிரிவுகளாகப் பிரிக்க வேண்டும்: இயக்கம் (உடற்பயிற்சி), சிந்திப்பு (தியானம்/நாட்குறிப்பு எழுதுதல்) மற்றும் வளர்ச்சி (கற்றல்/படித்தல்).' },
      whyItMatters: { en: 'Just waking up early to watch TV is useless. The 20/20/20 formula perfectly balances the optimization of your physical, emotional, and intellectual capabilities.', ta: 'டிவி பார்க்க அதிகாலையில் எழுவது பயனற்றது. 20/20/20 சூத்திரம் உங்கள் உடல், உணர்ச்சி மற்றும் அறிவுசார் திறன்களின் உகப்பாக்கத்தைச் கச்சிதமாகச் சமப்படுத்துகிறது.' },
      example: { en: '5:00-5:20 AM: Sweaty cardio. 5:20-5:40 AM: Writing in a gratitude journal. 5:40-6:00 AM: Reading a chapter of a self-improvement book.', ta: 'காலை 5:00-5:20: வியர்க்கும் கார்டியோ உடற்பயிற்சி. காலை 5:20-5:40: நன்றி நாட்குறிப்பு எழுதுதல். காலை 5:40-6:00: சுய முன்னேற்றப் புத்தகத்தின் ஒரு அத்தியாயத்தைப் படித்தல்.' },
      actionStep: { en: 'Plan your exact 20/20/20 routine tonight. Lay out your workout clothes, put your journal on the table, and pick the book you will read.', ta: 'இன்றிரவு உங்களின் சரியான 20/20/20 வழக்கத்தைத் திட்டமிடுங்கள். உங்கள் உடற்பயிற்சி ஆடைகளைத் தயாராக வையுங்கள், உங்கள் நாட்குறிப்பை மேசையில் வையுங்கள், மற்றும் நீங்கள் படிக்கப்போகும் புத்தகத்தைத் தேர்ந்தெடுங்கள்.' },
      reflectionQuestion: { en: 'Which part of the 20/20/20 formula (Move, Reflect, Grow) have you been neglecting the most in your life?', ta: '20/20/20 சூத்திரத்தின் எந்தப் பகுதியை (இயக்கம், சிந்திப்பு, வளர்ச்சி) உங்கள் வாழ்க்கையில் நீங்கள் அதிகம் புறக்கணிக்கிறீர்கள்?' }
    },
    {
      lessonNumber: 3,
      title: { en: 'The First 20 Minutes: Move', ta: 'முதல் 20 நிமிடங்கள்: இயக்கம்' },
      explanation: { en: 'You must sweat first thing in the morning. Vigorous exercise lowers cortisol (the stress hormone), releases dopamine and serotonin, and jumpstarts your metabolism.', ta: 'காலையில் எழுந்தவுடன் முதலில் நீங்கள் வியர்க்க வேண்டும். கடுமையான உடற்பயிற்சி கார்டிசோலைக் (மன அழுத்த ஹார்மோன்) குறைக்கிறது, டோபமைன் மற்றும் செரோடோனினை வெளியிடுகிறது, மற்றும் உங்கள் வளர்சிதை மாற்றத்தைத் துரிதப்படுத்துகிறது.' },
      whyItMatters: { en: 'Sweating deeply repairs brain cells and accelerates neurogenesis. It literally washes the fear and sluggishness out of your system, making you brave and focused.', ta: 'ஆழமாக வியர்ப்பது மூளை செல்களைச் சரிசெய்கிறது மற்றும் நரம்பணு உருவாக்கத்தை வேகப்படுத்துகிறது. இது உண்மையில் உங்கள் அமைப்பிலிருந்து பயம் மற்றும் மந்தநிலையைக் கழுவி, உங்களை தைரியமானவராகவும் கவனம் செலுத்துபவராகவும் ஆக்குகிறது.' },
      example: { en: 'Doing burpees, jumping jacks, or a high-intensity interval training (HIIT) session in your living room the moment you wake up.', ta: 'விழித்தெழுந்த மறுகணமே உங்கள் வரவேற்பறையில் பர்பீஸ் (burpees), ஜம்பிங் ஜாக்ஸ் (jumping jacks) அல்லது அதிகத் தீவிர இடைவெளிப் பயிற்சி (HIIT) செய்வது.' },
      actionStep: { en: 'Commit to sweating for just 20 minutes immediately after waking up tomorrow. No checking phones, no coffee first. Just move.', ta: 'நாளை எழுந்தவுடன் உடனடியாக 20 நிமிடங்கள் வியர்க்க உடற்பயிற்சி செய்ய உறுதியளியுங்கள். முதலில் தொலைபேசியைப் பார்ப்பதோ காபி குடிப்பதோ இல்லை. வெறுமனே உடற்பயிற்சி செய்யுங்கள்.' },
      reflectionQuestion: { en: 'Do you rely on caffeine to wake your brain up, instead of using your body\'s natural chemistry through movement?', ta: 'இயக்கத்தின் மூலம் உங்கள் உடலின் இயற்கையான வேதியியலைப் பயன்படுத்துவதற்குப் பதிலாக, உங்கள் மூளையை எழுப்ப காஃபினை (caffeine) நம்பியிருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 4,
      title: { en: 'The Second 20 Minutes: Reflect', ta: 'இரண்டாவது 20 நிமிடங்கள்: சிந்திப்பு' },
      explanation: { en: 'The second pocket of the Victory Hour is for deep silence. This is the time to meditate, pray, plan, or write in a journal to process your thoughts and emotions.', ta: 'வெற்றி நேரத்தின் இரண்டாவது பகுதி ஆழமான அமைதிக்கானது. உங்களின் எண்ணங்களையும் உணர்ச்சிகளையும் செயலாக்க தியானம் செய்ய, ஜெபிக்க, திட்டமிட அல்லது நாட்குறிப்பு எழுத இதுவே நேரம்.' },
      whyItMatters: { en: 'In our hyper-connected world, we suffer from "broken focus syndrome." Taking time to reflect restores your inner peace, clarifies your vision, and prevents you from living on autopilot.', ta: 'நமது அதி-இணைக்கப்பட்ட உலகில், "உடைந்த கவன நோய்க்குறியால்" நாம் அவதிப்படுகிறோம். சிந்திப்பதற்கு நேரம் ஒதுக்குவது உங்களின் உள் அமைதியை மீட்டெடுக்கிறது, உங்கள் பார்வையைத் தெளிவுபடுத்துகிறது மற்றும் நீங்கள் தன்னியக்கப் பயன்முறையில் (autopilot) வாழ்வதைத் தடுக்கிறது.' },
      example: { en: 'Sitting quietly with your eyes closed for 10 minutes, followed by 10 minutes of writing down three things you are grateful for and your top goal for the day.', ta: '10 நிமிடங்கள் கண்களை மூடி அமைதியாக உட்கார்ந்திருப்பது, அதைத் தொடர்ந்து 10 நிமிடங்கள் நீங்கள் நன்றியுள்ளவர்களாக இருக்கும் மூன்று விஷயங்களையும் நாளுக்கான உங்கள் முக்கிய இலக்கையும் எழுதுவது.' },
      actionStep: { en: 'Buy a physical notebook today to use as your morning journal. Tomorrow, use your reflection time to write out exactly how you want your day to go.', ta: 'உங்களின் காலை நாட்குறிப்பாகப் பயன்படுத்த இன்று ஒரு நோட்டுப் புத்தகத்தை வாங்குங்கள். நாளை, உங்களின் நாள் எப்படிச் செல்ல வேண்டும் என்பதைத் துல்லியமாக எழுத உங்கள் சிந்திப்பு நேரத்தைப் பயன்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'Are you running away from your own thoughts by constantly seeking external distraction and noise?', ta: 'வெளிப்புறக் கவனச்சிதறல் மற்றும் சத்தத்தைத் தொடர்ந்து தேடுவதன் மூலம் உங்கள் சொந்த எண்ணங்களிலிருந்து நீங்கள் தப்பி ஓடுகிறீர்களா?' }
    },
    {
      lessonNumber: 5,
      title: { en: 'The Third 20 Minutes: Grow', ta: 'மூன்றாவது 20 நிமிடங்கள்: வளர்ச்சி' },
      explanation: { en: 'The final segment is dedicated to learning. This is the time to read books, listen to podcasts, or study something that improves your skills and expands your mind.', ta: 'இறுதிப் பகுதி கற்றலுக்கு அர்ப்பணிக்கப்பட்டுள்ளது. புத்தகங்களைப் படிக்க, பாட்காஸ்ட்களைக் கேட்க அல்லது உங்கள் திறன்களை மேம்படுத்தும் மற்றும் உங்கள் மனதை விரிவுபடுத்தும் எதையாவது படிக்க இதுவே நேரம்.' },
      whyItMatters: { en: 'The leader who learns the most wins. By dedicating 20 minutes a day to growth, you will consume dozens of books a year, compounding your knowledge vastly over time.', ta: 'அதிகம் கற்கும் தலைவரே வெற்றி பெறுகிறார். ஒரு நாளைக்கு 20 நிமிடங்களை வளர்ச்சிக்காக அர்ப்பணிப்பதன் மூலம், நீங்கள் வருடத்திற்குப் பல டஜன் புத்தகங்களைப் படிப்பீர்கள், காலப்போக்கில் உங்கள் அறிவு பன்மடங்கு பெருகும்.' },
      example: { en: 'Reading a chapter of an autobiography of a great historical figure, or studying an online course about leadership while drinking your morning coffee.', ta: 'ஒரு சிறந்த வரலாற்று நபரின் சுயசரிதையின் ஒரு அத்தியாயத்தைப் படிப்பது, அல்லது காலை காபி குடித்துக்கொண்டே தலைமைத்துவம் பற்றிய ஆன்லைன் படிப்பைப் படிப்பது.' },
      actionStep: { en: 'Choose an audiobook, podcast, or physical book tonight that focuses purely on personal or professional mastery, and consume it during your Growth block tomorrow.', ta: 'தனிப்பட்ட அல்லது தொழில்முறைத் தேர்ச்சியில் மட்டுமே கவனம் செலுத்தும் ஒரு ஆடியோபுக், பாட்காஸ்ட் அல்லது புத்தகத்தை இன்றிரவு தேர்ந்தெடுத்து, நாளை உங்களின் வளர்ச்சித் தொகுதியின் போது அதைப் பயன்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'When was the last time you actively studied a new subject, rather than just scrolling through social media for "information"?', ta: '"தகவலுக்காக" சமூக ஊடகங்களில் உலாவுவதற்குப் பதிலாக, கடைசியாக எப்போது ஒரு புதிய பாடத்தைத் தீவிரமாகப் படித்தீர்கள்?' }
    },
    {
      lessonNumber: 6,
      title: { en: 'The 4 Interior Empires', ta: '4 உள் பேரரசுகள்' },
      explanation: { en: 'To achieve true mastery, you must balance four interior empires: Mindset (Psychology), Heartset (Emotionality), Healthset (Physicality), and Soulset (Spirituality).', ta: 'உண்மையான தேர்ச்சியை அடைய, நீங்கள் நான்கு உள் பேரரசுகளைச் சமநிலைப்படுத்த வேண்டும்: மனநிலை (உளவியல்), இதயநிலை (உணர்ச்சி), உடல்நிலை (உடல் நலம்) மற்றும் ஆன்மநிலை (ஆன்மீகம்).' },
      whyItMatters: { en: 'Most people only focus on Mindset (positive thinking). But a great mindset is useless if your heart is full of anger, your body is sick, or your soul feels empty.', ta: 'பெரும்பாலான மக்கள் மனநிலையில் (நேர்மறையான சிந்தனை) மட்டுமே கவனம் செலுத்துகிறார்கள். ஆனால் உங்கள் இதயம் கோபத்தால் நிறைந்திருந்தாலோ, உங்கள் உடல் நோயுற்றிருந்தாலோ அல்லது உங்கள் ஆன்மா வெறுமையாக உணர்ந்தாலோ ஒரு சிறந்த மனநிலை பயனற்றது.' },
      example: { en: 'A billionaire who is incredibly smart (Mindset) but dies of a heart attack at 50 (poor Healthset) and was hated by their family (poor Heartset) is not truly successful.', ta: 'நம்பமுடியாத அளவிற்குப் புத்திசாலியாக (மனநிலை) இருக்கும் ஒரு பில்லியனர், ஆனால் 50 வயதில் மாரடைப்பால் இறக்கிறார் (மோசமான உடல்நிலை) மற்றும் அவர்களின் குடும்பத்தினரால் வெறுக்கப்பட்டார் (மோசமான இதயநிலை) என்றால் அவர் உண்மையிலேயே வெற்றிகரமானவர் அல்ல.' },
      actionStep: { en: 'Rate your four empires out of 10 right now. Pick the lowest-scoring empire and schedule one activity this week to nourish it.', ta: 'இப்போது உங்கள் நான்கு பேரரசுகளையும் 10-க்கு மதிப்பிடுங்கள். மிகக் குறைந்த மதிப்பெண் பெற்ற பேரரசைத் தேர்ந்தெடுத்து, அதை வளர்க்க இந்த வாரம் ஒரு செயலைத் திட்டமிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you using "positive thinking" to mask deep emotional wounds (Heartset) that you haven\'t healed?', ta: 'நீங்கள் இன்னும் குணப்படுத்தாத ஆழமான உணர்ச்சிகரமான காயங்களை (இதயநிலை) மறைக்க "நேர்மறையான சிந்தனையை" பயன்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 7,
      title: { en: 'The 90/90/1 Rule', ta: '90/90/1 விதி' },
      explanation: { en: 'For the next 90 days, spend the first 90 minutes of your workday on your single most important project (the "1"). No phones, no emails, no interruptions.', ta: 'அடுத்த 90 நாட்களுக்கு, உங்கள் வேலை நாளின் முதல் 90 நிமிடங்களை உங்களின் ஒற்றை மிக முக்கியமான திட்டத்திற்காக ("1") செலவிடுங்கள். தொலைபேசிகள் இல்லை, மின்னஞ்சல்கள் இல்லை, குறுக்கீடுகள் இல்லை.' },
      whyItMatters: { en: 'Most people spend the best hours of their morning reacting to other people\'s priorities (emails, meetings). The 90/90/1 rule ensures you do actual, needle-moving work every single day.', ta: 'பெரும்பாலான மக்கள் தங்கள் காலையின் சிறந்த மணிநேரங்களை மற்றவர்களின் முன்னுரிமைகளுக்கு (மின்னஞ்சல்கள், கூட்டங்கள்) பதிலளிப்பதிலேயே செலவிடுகிறார்கள். 90/90/1 விதி நீங்கள் ஒவ்வொரு நாளும் உண்மையான, மாற்றத்தை ஏற்படுத்தும் வேலையைச் செய்வதை உறுதி செய்கிறது.' },
      example: { en: 'An author putting their phone in another room and typing their book manuscript from 8:00 AM to 9:30 AM before talking to anyone or checking a single message.', ta: 'யாரிடமும் பேசுவதற்கு அல்லது ஒற்றைச் செய்தியைச் சரிபார்ப்பதற்கு முன், ஒரு ஆசிரியர் தனது தொலைபேசியை மற்றொரு அறையில் வைத்துவிட்டு காலை 8:00 மணி முதல் 9:30 மணி வரை தனது புத்தகத்தின் கையெழுத்துப் பிரதியைத் தட்டச்சு செய்வது.' },
      actionStep: { en: 'Identify your "1" (your most important project). Tomorrow morning, block out your first 90 minutes of work entirely for that task.', ta: 'உங்கள் "1"-ஐக் கண்டறியவும் (உங்களின் மிக முக்கியமான திட்டம்). நாளைக் காலை, உங்கள் வேலையின் முதல் 90 நிமிடங்களை முழுவதுமாக அந்தப் பணிக்காக மட்டும் ஒதுக்குங்கள்.' },
      reflectionQuestion: { en: 'Does your morning consist of creating value, or just organizing and reacting to the value created by others?', ta: 'உங்கள் காலைப்பொழுது மதிப்பை உருவாக்குவதைக் கொண்டிருக்கிறதா, அல்லது மற்றவர்கள் உருவாக்கிய மதிப்பை ஒழுங்கமைப்பதும் அதற்கேற்பச் செயல்படுவதும் மட்டும்தானா?' }
    },
    {
      lessonNumber: 8,
      title: { en: 'The Twin Cycles of Elite Performance', ta: 'உயர்மட்ட செயல்திறனின் இரட்டை சுழற்சிகள்' },
      explanation: { en: 'Growth happens in the rest phase, not the performance phase. Elite performers balance intense periods of work (High Excellence Cycle) with periods of deep recovery (Deep Refueling Cycle).', ta: 'வளர்ச்சி என்பது ஓய்வுக் கட்டத்தில்தான் நிகழ்கிறது, செயல்திறன் கட்டத்தில் அல்ல. உயர்மட்டச் செயலாற்றுபவர்கள் தீவிரமான வேலைக்காலங்களை (உயர் சிறப்பான சுழற்சி) ஆழமான மீட்புக்காலங்களுடன் (ஆழமான எரிபொருள் நிரப்பும் சுழற்சி) சமன் செய்கிறார்கள்.' },
      whyItMatters: { en: 'Constantly grinding without rest leads to depletion and burnout. Just like muscles grow when you rest after the gym, your mind and creativity grow when you disconnect from work.', ta: 'ஓய்வில்லாமல் தொடர்ந்து அரைப்பது குறைவுக்கும் சோர்வுக்கும் வழிவகுக்கிறது. ஜிம்மிற்குப் பிறகு நீங்கள் ஓய்வெடுக்கும்போது தசைகள் வளர்வதைப் போலவே, வேலையிலிருந்து நீங்கள் துண்டித்துக்கொள்ளும்போது உங்கள் மனமும் படைப்பாற்றலும் வளர்கின்றன.' },
      example: { en: 'Working intensely on a project for 3 weeks, and then taking a completely unplugged 4-day weekend in nature without looking at a single work email.', ta: '3 வாரங்கள் ஒரு திட்டத்தில் தீவிரமாக வேலை செய்வது, பின்னர் ஒற்றை வேலை மின்னஞ்சலைக் கூடப் பார்க்காமல் இயற்கையில் முற்றிலும் துண்டிக்கப்பட்ட 4 நாள் வாரயிறுதியை எடுத்துக்கொள்வது.' },
      actionStep: { en: 'Schedule a specific "shut down" time for tonight (e.g., 8 PM) where you completely turn off all work notifications and focus purely on recovery.', ta: 'இன்றிரவு ஒரு குறிப்பிட்ட "நிறுத்தும்" நேரத்தைத் திட்டமிடுங்கள் (எ.கா., இரவு 8 மணி), அங்கு நீங்கள் அனைத்து வேலை அறிவிப்புகளையும் முழுமையாக அணைத்துவிட்டு ஓய்வெடுப்பதில் மட்டுமே கவனம் செலுத்துங்கள்.' },
      reflectionQuestion: { en: 'Are you bragging about being "busy all the time" while actually producing mediocre work because you are exhausted?', ta: 'நீங்கள் சோர்வடைந்திருப்பதால் உண்மையில் சுமாரான வேலையை மட்டுமே உற்பத்தி செய்து கொண்டு, "எப்போதும் பிஸியாக இருக்கிறேன்" என்று தற்பெருமை பேசுகிறீர்களா?' }
    },
    {
      lessonNumber: 9,
      title: { en: 'Capitalization IQ', ta: 'மூலதனமாக்கல் IQ' },
      explanation: { en: 'Your "Capitalization IQ" is your ability to materialize whatever gifts you have been born with. It is not how much talent you have, but how much of that talent you actually capitalize on through hard work.', ta: 'உங்களின் "மூலதனமாக்கல் ஐக்யூ" என்பது நீங்கள் எந்த வரங்களுடன் பிறந்திருந்தாலும் அவற்றை நனவாக்கும் உங்களின் திறனாகும். இது உங்களிடம் எவ்வளவு திறமை இருக்கிறது என்பதல்ல, ஆனால் கடின உழைப்பின் மூலம் அந்தத் திறமையை நீங்கள் எவ்வளவு மூலதனமாக்குகிறீர்கள் என்பதே.' },
      whyItMatters: { en: 'Many people have natural genius but lack the discipline to do anything with it. A person with less talent who capitalizes on it fully will always beat a lazy genius.', ta: 'பலருக்கு இயற்கையான மேதமை இருக்கிறது, ஆனால் அதைக் கொண்டு எதையும் செய்வதற்கான ஒழுக்கம் இல்லை. குறைந்த திறமை கொண்ட ஒரு நபர் அதை முழுமையாக மூலதனமாக்கினால் எப்போதும் ஒரு சோம்பேறி மேதையை வெல்வார்.' },
      example: { en: 'A naturally gifted athlete who skips practice losing a championship to a less naturally gifted athlete who trained obsessively for 5 years.', ta: 'பயிற்சியைத் தவிர்க்கும் இயற்கையான திறமையுள்ள ஒரு தடகள வீரர், 5 ஆண்டுகளாக வெறித்தனமாகப் பயிற்சி பெற்ற, குறைவான இயற்கையான திறமையுள்ள ஒரு தடகள வீரரிடம் சாம்பியன்ஷிப்பை இழப்பது.' },
      actionStep: { en: 'Identify one natural talent you have that you have been neglecting. Spend 30 minutes today practicing and honing that specific skill.', ta: 'நீங்கள் புறக்கணித்து வரும் உங்களின் ஒரு இயற்கையான திறமையைக் கண்டறியவும். இன்று 30 நிமிடங்களை அந்தக் குறிப்பிட்ட திறனைப் பயிற்சி செய்யவும் கூர்மைப்படுத்தவும் செலவிடுங்கள்.' },
      reflectionQuestion: { en: 'Are you wasting your potential by relying on your natural smarts instead of doing the hard work to maximize them?', ta: 'உங்களின் இயற்கையான புத்திசாலித்தனத்தை அதிகரிக்கக் கடின உழைப்பை மேற்கொள்வதற்குப் பதிலாக, அதை மட்டுமே நம்பியிருப்பதன் மூலம் உங்கள் திறனை வீணாக்குகிறீர்களா?' }
    },
    {
      lessonNumber: 10,
      title: { en: 'Freedom from Distraction', ta: 'கவனச்சிதறலில் இருந்து சுதந்திரம்' },
      explanation: { en: 'An addiction to distraction is the death of your creative production. The billionaires and geniuses of the world are fiercely protective of their focus.', ta: 'கவனச்சிதறலுக்கு அடிமையாவது உங்கள் படைப்பு உற்பத்தியின் மரணமாகும். உலகின் பில்லியனர்களும் மேதைகளும் தங்களின் கவனத்தைத் தீவிரமாகப் பாதுகாக்கிறார்கள்.' },
      whyItMatters: { en: 'Every time you check a notification, you suffer from "attention residue"—it takes over 20 minutes to get back to deep focus. You cannot do world-class work if you are constantly interrupted.', ta: 'நீங்கள் ஒவ்வொரு முறை அறிவிப்பைச் சரிபார்க்கும்போதும், "கவன எச்சத்தால்" அவதிப்படுகிறீர்கள்—ஆழமான கவனத்திற்குத் திரும்ப 20 நிமிடங்களுக்கு மேல் ஆகும். நீங்கள் தொடர்ந்து குறிக்கிடப்பட்டால் உங்களால் உலகத்தரம் வாய்ந்த வேலையைச் செய்ய முடியாது.' },
      example: { en: 'Putting your phone on airplane mode in another room while writing an article, ensuring absolute, unbroken concentration for a solid hour.', ta: 'ஒரு கட்டுரையை எழுதும்போது உங்கள் தொலைபேசியை மற்றொரு அறையில் விமானப் பயன்முறையில் (Airplane mode) வைப்பது, முழுமையான ஒரு மணிநேரத்திற்கு உறுதியான, உடைக்கப்படாத செறிவை உறுதி செய்கிறது.' },
      actionStep: { en: 'Turn off all non-essential push notifications on your phone right now. Create a distraction-free "bubble" for your deep work sessions.', ta: 'இப்போதே உங்கள் தொலைபேசியில் தேவையற்ற அனைத்து புஷ் அறிவிப்புகளையும் முடக்குங்கள். உங்களின் ஆழமான வேலை அமர்வுகளுக்கு கவனச்சிதறல் இல்லாத "குமிழியை" உருவாக்குங்கள்.' },
      reflectionQuestion: { en: 'Do you reach for your phone the second you feel slightly bored or challenged by a task?', ta: 'ஒரு பணியில் நீங்கள் சற்றே சலிப்படையும்போது அல்லது சவாலாக உணரும்போது அந்த நொடியே உங்கள் தொலைபேசியை எடுக்கிறீர்களா?' }
    },
    {
      lessonNumber: 11,
      title: { en: 'Personal Mastery Practice', ta: 'தனிப்பட்ட தேர்ச்சிப் பயிற்சி' },
      explanation: { en: 'To be a master of your craft, you must put in at least 10,000 hours of deliberate practice. It requires a relentless commitment to daily improvement, no matter how small.', ta: 'உங்கள் கலையில் ஒரு மேதையாக இருக்க, நீங்கள் குறைந்தது 10,000 மணிநேரத் திட்டமிட்ட பயிற்சியைச் செய்ய வேண்டும். எவ்வளவு சிறியதாக இருந்தாலும், தினசரி மேம்பாட்டிற்கான இடைவிடாத அர்ப்பணிப்பு இதற்குத் தேவை.' },
      whyItMatters: { en: 'Mastery isn\'t an accident; it is the result of compounding daily habits. The 5 AM Club provides the foundational structure to guarantee you put in those daily reps.', ta: 'தேர்ச்சி என்பது ஒரு விபத்து அல்ல; இது அன்றாடப் பழக்கவழக்கங்கள் இணைந்ததன் விளைவாகும். 5 ஏஎம் கிளப் அந்த தினசரிப் பயிற்சிகளை நீங்கள் மேற்கொள்வதற்கு உத்தரவாதம் அளிக்கும் அடிப்படை கட்டமைப்பை வழங்குகிறது.' },
      example: { en: 'A guitarist who practices the same complex scale for 1 hour every single morning at 5:30 AM, resulting in effortless playing on stage years later.', ta: 'ஒவ்வொரு நாள் காலையிலும் 5:30 மணிக்கு அதே சிக்கலான சுவரசையை (Scale) 1 மணிநேரம் பயிற்சி செய்யும் ஒரு கிட்டார் கலைஞர், பல ஆண்டுகளுக்குப் பிறகு மேடையில் சிரமமின்றி வாசிப்பதற்கு இது வழிவகுக்கிறது.' },
      actionStep: { en: 'Identify the one skill you want to master over the next 5 years. Dedicate 20 minutes of your morning routine strictly to studying or practicing that skill.', ta: 'அடுத்த 5 ஆண்டுகளில் நீங்கள் தேர்ச்சி பெற விரும்பும் ஒரு திறனைக் கண்டறியவும். உங்களின் காலை வழக்கத்தின் 20 நிமிடங்களை அந்தத் திறனைப் படிக்க அல்லது பயிற்சி செய்யக் கண்டிப்பாக ஒதுக்குங்கள்.' },
      reflectionQuestion: { en: 'Are you looking for a quick hack to achieve greatness, instead of accepting the necessity of long-term daily practice?', ta: 'நீண்ட கால தினசரிப் பயிற்சியின் அவசியத்தை ஏற்றுக்கொள்வதற்குப் பதிலாக, மகத்துவத்தை அடைய விரைவான குறுக்குவழியைத் தேடுகிறீர்களா?' }
    },
    {
      lessonNumber: 12,
      title: { en: 'The 60/10 Method', ta: '60/10 முறை' },
      explanation: { en: 'Work in focused intervals. Work with intense, undistracted concentration for 60 minutes, then completely recover and rest for 10 minutes.', ta: 'கவனம் செலுத்திய இடைவெளிகளில் வேலை செய்யுங்கள். 60 நிமிடங்களுக்குத் தீவிரமான, கவனச்சிதறலற்ற செறிவோடு வேலை செய்யுங்கள், பின்னர் 10 நிமிடங்களுக்கு முழுமையாக மீண்டு ஓய்வெடுங்கள்.' },
      whyItMatters: { en: 'Human attention cannot sustain intensity indefinitely. The 10-minute breaks prevent fatigue and keep your energy and creativity levels high throughout the entire day.', ta: 'மனிதக் கவனத்தால் செறிவை காலவரையின்றித் தக்கவைக்க முடியாது. 10 நிமிட இடைவேளைகள் சோர்வைத் தடுத்து, நாள் முழுவதும் உங்கள் ஆற்றலையும் படைப்பாற்றலையும் உயர்வாக வைத்திருக்கும்.' },
      example: { en: 'Coding intensely for an hour without checking email, then walking away from the desk to stretch, drink water, and look out the window for 10 minutes.', ta: 'மின்னஞ்சலைச் சரிபார்க்காமல் ஒரு மணிநேரம் தீவிரமாகக் குறியீடு (coding) செய்வது, பின்னர் மேசையை விட்டு விலகி நீட்சிப் பயிற்சி செய்வது, தண்ணீர் குடிப்பது மற்றும் 10 நிமிடங்கள் ஜன்னலுக்கு வெளியே பார்ப்பது.' },
      actionStep: { en: 'Set a timer for 60 minutes for your next work task. When it goes off, force yourself to step away from all screens for exactly 10 minutes.', ta: 'உங்களின் அடுத்த வேலைப் பணிக்கு 60 நிமிடங்களுக்கு டைமரை அமைக்கவும். அது ஒலிக்கும் போது, சரியாக 10 நிமிடங்களுக்கு அனைத்துத் திரைகளிலிருந்தும் விலகிச் செல்ல உங்களை நீங்களே கட்டாயப்படுத்துங்கள்.' },
      reflectionQuestion: { en: 'Do you sit at your desk for 4 hours straight, feeling your productivity drop but refusing to take a real break?', ta: 'உற்பத்தித்திறன் குறைவதை உணர்ந்தும் உண்மையான இடைவேளை எடுக்க மறுத்து, தொடர்ந்து 4 மணிநேரம் மேசையில் அமர்ந்திருக்கிறீர்களா?' }
    },
    {
      lessonNumber: 13,
      title: { en: 'The Daily 5 Rule', ta: 'தினசரி 5 விதி' },
      explanation: { en: 'During your morning reflection, write down exactly 5 micro-goals that you must achieve that day to make it a highly successful day.', ta: 'உங்களின் காலைச் சிந்திப்பின் போது, அந்த நாளை மிகவும் வெற்றிகரமான நாளாக மாற்ற நீங்கள் அந்த நாளில் அடைய வேண்டிய சரியாக 5 நுண்-இலக்குகளை எழுதுங்கள்.' },
      whyItMatters: { en: 'A massive to-do list is overwhelming and often leads to procrastination. Focusing on just 5 key victories creates momentum and ensures the most important things get done.', ta: 'ஒரு மிகப்பெரிய செய்ய வேண்டியப் பட்டியல் அதிகமாக இருக்கும் மற்றும் பெரும்பாலும் தள்ளிப்போடுதலுக்கு வழிவகுக்கும். வெறும் 5 முக்கிய வெற்றிகளில் கவனம் செலுத்துவது வேகத்தை உருவாக்குகிறது மற்றும் மிக முக்கியமான விஷயங்கள் செய்யப்படுவதை உறுதி செய்கிறது.' },
      example: { en: 'Instead of writing "build website," writing "1. Buy domain, 2. Sketch homepage layout, 3. Call client, 4. Do 30 min cardio, 5. Read 10 pages."', ta: '"இணையதளத்தை உருவாக்கு" என்று எழுதுவதற்குப் பதிலாக, "1. டொமைன் வாங்குதல், 2. முகப்புப் பக்க தளவமைப்பை வரைதல், 3. வாடிக்கையாளரை அழைத்தல், 4. 30 நிமிட கார்டியோ உடற்பயிற்சி செய்தல், 5. 10 பக்கங்களைப் படித்தல்" என்று எழுதுவது.' },
      actionStep: { en: 'Write down your "Daily 5" right now. What are the 5 tiny victories that would make today a win?', ta: 'இப்போதே உங்களின் "தினசரி 5"-ஐ எழுதுங்கள். இன்றைய நாளை வெற்றியாக்கக்கூடிய 5 சிறிய வெற்றிகள் யாவை?' },
      reflectionQuestion: { en: 'Are you confusing being busy with a massive list of trivial tasks with actually being productive?', ta: 'நீங்கள் சிறிய பணிகளின் பாரிய பட்டியலுடன் பிஸியாக இருப்பதை உண்மையில் உற்பத்தித்திறனுடன் இருப்பதை குழப்புகிறீர்களா?' }
    },
    {
      lessonNumber: 14,
      title: { en: 'The 2nd Wind Workout', ta: '2-வது காற்று உடற்பயிற்சி' },
      explanation: { en: 'Schedule a second, lighter workout at the end of your workday (around 5 PM or 6 PM). It could be a brisk walk in nature, yoga, or a light swim.', ta: 'உங்கள் வேலை நாளின் முடிவில் (மாலை 5 அல்லது 6 மணியளவில்) இரண்டாவது, லேசான உடற்பயிற்சியைத் திட்டமிடுங்கள். இது இயற்கையில் விறுவிறுப்பான நடையாகவோ, யோகாவாகவோ அல்லது லேசான நீச்சலாகவோ இருக்கலாம்.' },
      whyItMatters: { en: 'The late afternoon is when energy slumps and stress peaks. A second workout flushes out the stress of the day, re-energizes you for the evening, and ensures better sleep.', ta: 'பிற்பகல் வேளையில் ஆற்றல் குறையும் மற்றும் மன அழுத்தம் உச்சத்தில் இருக்கும். இரண்டாவது உடற்பயிற்சி நாளின் மன அழுத்தத்தை வெளியேற்றுகிறது, மாலை நேரத்திற்கு உங்களுக்கு மீண்டும் ஆற்றல் அளிக்கிறது மற்றும் சிறந்த தூக்கத்தை உறுதி செய்கிறது.' },
      example: { en: 'Leaving the office at 5:30 PM and immediately going for a 30-minute walk through a park while listening to a podcast, before heading home to family.', ta: 'மாலை 5:30 மணிக்கு அலுவலகத்தை விட்டு வெளியேறி, குடும்பத்தாரிடம் வீட்டிற்குச் செல்வதற்கு முன், பாட்காஸ்ட் கேட்டுக்கொண்டே உடனடியாக ஒரு பூங்காவில் 30 நிமிட நடைப்பயிற்சி மேற்கொள்வது.' },
      actionStep: { en: 'Schedule a 20-minute nature walk or stretching session for 5:30 PM today to transition from work mode to home mode.', ta: 'வேலை முறைமையிலிருந்து (Work mode) வீட்டு முறைமைக்கு (Home mode) மாறுவதற்கு இன்று மாலை 5:30 மணிக்கு 20 நிமிட இயற்கை நடைப்பயிற்சி அல்லது நீட்சிப் பயிற்சியைத் திட்டமிடுங்கள்.' },
      reflectionQuestion: { en: 'Do you usually crash on the couch after work, bringing the stress of the office into your home life?', ta: 'அலுவலகத்தின் மன அழுத்தத்தை உங்கள் குடும்ப வாழ்க்கைக்குள் கொண்டுவந்து, வேலைக்குப் பிறகு நீங்கள் பொதுவாக சோபாவில் சாய்ந்துவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 15,
      title: { en: 'The 2 Massage Protocol', ta: '2 மசாஜ் நெறிமுறை' },
      explanation: { en: 'Book two 90-minute deep tissue massages every single week. It sounds like a luxury, but elite performers treat recovery as a necessity, not an indulgence.', ta: 'ஒவ்வொரு வாரமும் இரண்டு 90 நிமிட ஆழமான திசு மசாஜ்களை (deep tissue massage) முன்பதிவு செய்யுங்கள். இது ஒரு ஆடம்பரம் போல் தோன்றுகிறது, ஆனால் உயர்மட்டச் செயலாற்றுபவர்கள் மீட்சியை ஒரு தேவையாகக் கருதுகிறார்கள், ஈடுபாடாக அல்ல.' },
      whyItMatters: { en: 'Massages dramatically reduce cortisol, increase oxytocin, and release tension stored in the muscles from high-stress work. It keeps your physical and mental machinery running smoothly.', ta: 'மசாஜ்கள் கார்டிசோலைக் கணிசமாகக் குறைக்கின்றன, ஆக்ஸிடாஸினை (oxytocin) அதிகரிக்கின்றன மற்றும் அதிக மன அழுத்த வேலையிலிருந்து தசைகளில் சேமிக்கப்பட்ட பதற்றத்தை வெளியிடுகின்றன. இது உங்கள் உடல் மற்றும் மன இயந்திரத்தைச் சீராக இயங்க வைக்கிறது.' },
      example: { en: 'Instead of spending money on expensive dinners or clothes, a CEO invests that money into bi-weekly sports massages to ensure their brain and body remain sharp.', ta: 'விலையுயர்ந்த இரவு உணவுகள் அல்லது ஆடைகளுக்காகப் பணத்தைச் செலவிடுவதற்குப் பதிலாக, ஒரு தலைமை நிர்வாக அதிகாரி தனது மூளையும் உடலும் கூர்மையாக இருப்பதை உறுதிசெய்ய இரு வார விளையாட்டு மசாஜ்களில் அந்தப் பணத்தை முதலீடு செய்கிறார்.' },
      actionStep: { en: 'If two massages a week isn\'t financially viable, schedule at least one deliberate, intense self-care recovery session (like a hot epsom salt bath) this week.', ta: 'வாரத்திற்கு இரண்டு மசாஜ்கள் செய்வது நிதி ரீதியாகச் சாத்தியமில்லை என்றால், இந்த வாரம் குறைந்தது ஒரு திட்டமிட்ட, தீவிரமான சுய-கவனிப்பு மீட்பு அமர்வை (சூடான எப்சம் உப்பு குளியல் போன்றது) திட்டமிடுங்கள்.' },
      reflectionQuestion: { en: 'Do you view taking care of your body as a selfish luxury rather than a mandatory investment in your performance?', ta: 'உங்கள் உடலைக் கவனித்துக்கொள்வதை உங்களின் செயல்திறனுக்கான கட்டாய முதலீடாகக் கருதாமல் சுயநலமான ஆடம்பரமாகப் பார்க்கிறீர்களா?' }
    },
    {
      lessonNumber: 16,
      title: { en: 'Traffic University', ta: 'போக்குவரத்து பல்கலைக்கழகம்' },
      explanation: { en: 'Leverage your commute. If you spend an hour commuting each day, that is hundreds of hours a year. Turn your car or the train into a mobile university.', ta: 'உங்கள் பயணத்தைப் பயன்படுத்துங்கள். ஒவ்வொரு நாளும் ஒரு மணிநேரம் நீங்கள் பயணத்திற்காகச் செலவழித்தால், அது வருடத்திற்கு நூற்றுக்கணக்கான மணிநேரமாகும். உங்கள் காரையோ அல்லது ரயிலையோ நடமாடும் பல்கலைக்கழகமாக மாற்றுங்கள்.' },
      whyItMatters: { en: 'Listening to negative news or mindless radio during a commute wastes precious growth time. Using that time to learn a language, study leadership, or listen to audiobooks gives you a massive edge.', ta: 'பயணத்தின் போது எதிர்மறையான செய்திகள் அல்லது மனமில்லாத வானொலியைக் கேட்பது மதிப்புமிக்க வளர்ச்சி நேரத்தை வீணாக்குகிறது. அந்த நேரத்தை ஒரு மொழியைக் கற்க, தலைமைத்துவத்தைப் படிக்க அல்லது ஆடியோபுக்குகளைக் கேட்கப் பயன்படுத்துவது உங்களுக்கு மிகப்பெரிய நன்மையை அளிக்கிறது.' },
      example: { en: 'Listening to an audiobook on negotiation tactics every morning on the drive to work, effectively reading a new book every two weeks without taking any extra time out of your day.', ta: 'வேலைக்குச் செல்லும் வழியில் ஒவ்வொரு காலையிலும் பேச்சுவார்த்தை உத்திகள் பற்றிய ஆடியோபுக்கைக் கேட்பது, உங்கள் நாளில் கூடுதல் நேரத்தை ஒதுக்காமலேயே ஒவ்வொரு இரண்டு வாரங்களுக்கும் ஒரு புதிய புத்தகத்தை திறம்படப் படிப்பது.' },
      actionStep: { en: 'Delete the news apps or radio presets for your commute tomorrow. Download an educational podcast or audiobook instead.', ta: 'நாளைய உங்களின் பயணத்திற்கான செய்திச் செயலிகள் அல்லது ரேடியோ முன்னமைவுகளை நீக்குங்கள். அதற்குப் பதிலாகக் கல்வி சார்ந்த பாட்காஸ்ட் அல்லது ஆடியோபுக்கைப் பதிவிறக்கவும்.' },
      reflectionQuestion: { en: 'Are you letting the "dead time" of your day remain dead, instead of converting it into a competitive advantage?', ta: 'உங்களின் நாளின் "இறந்த நேரத்தை" (dead time) போட்டி நன்மையாக மாற்றுவதற்குப் பதிலாக, அதை இறந்துபோகவே அனுமதிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 17,
      title: { en: 'The Dream Team Technique', ta: 'கனவு அணி நுட்பம்' },
      explanation: { en: 'You cannot reach elite levels alone. You must build a "Dream Team" of experts around you to handle the things you are not good at, so you can focus entirely on your unique genius.', ta: 'உங்களால் தனியாக உயர்மட்ட நிலைகளை அடைய முடியாது. உங்களால் சிறப்பாகச் செய்ய முடியாத விஷயங்களைக் கையாள உங்களைச் சுற்றி நிபுணர்களின் "கனவு அணியை" நீங்கள் உருவாக்க வேண்டும், அப்போதுதான் உங்களின் தனித்துவமான மேதமையில் முழுமையாகக் கவனம் செலுத்த முடியும்.' },
      whyItMatters: { en: 'Trying to be the accountant, the marketer, the cleaner, and the visionary leads to mediocrity in all areas. Delegating tasks to masters of those crafts elevates your entire life.', ta: 'கணக்காளராக, சந்தைப்படுத்துபவராக, துப்புரவாளராக மற்றும் தொலைநோக்குடையவராக இருக்க முயற்சிப்பது அனைத்துப் பகுதிகளிலும் சுமாரான நிலைக்கு வழிவகுக்கிறது. அந்தத் துறைகளில் வல்லவர்களிடம் பணிகளைப் பிரித்துக்கொடுப்பது உங்கள் முழு வாழ்க்கையையும் உயர்த்துகிறது.' },
      example: { en: 'An entrepreneur hiring a fantastic personal assistant and a great bookkeeper so they can spend 100% of their time designing products and pitching clients.', ta: 'ஒரு தொழில்முனைவோர் ஒரு அருமையான தனிப்பட்ட உதவியாளரையும் ஒரு சிறந்த கணக்காளரையும் வேலைக்கு அமர்த்துகிறார், இதனால் அவர்கள் தங்கள் 100% நேரத்தையும் தயாரிப்புகளை வடிவமைப்பதிலும் வாடிக்கையாளர்களிடம் பேசுவதிலும் செலவிட முடியும்.' },
      actionStep: { en: 'Identify one task you do weekly that you are bad at and hate doing. Figure out a way to outsource, delegate, or automate it this month.', ta: 'நீங்கள் வாரந்தோறும் செய்யும், உங்களால் சிறப்பாகச் செய்ய முடியாத மற்றும் செய்ய வெறுக்கும் ஒரு பணியைக் கண்டறியவும். இந்த மாதம் அதை அவுட்சோர்ஸ் செய்ய, பிரித்துக்கொடுக்க அல்லது தானியங்குபடுத்த ஒரு வழியைக் கண்டறியவும்.' },
      reflectionQuestion: { en: 'Are you holding onto trivial tasks out of a false sense of control or frugality, limiting your own growth?', ta: 'கட்டுப்பாடு அல்லது சிக்கனத்தின் தவறான உணர்வால் அற்பமான பணிகளைப் பிடித்துக்கொண்டு, உங்கள் சொந்த வளர்ச்சியை நீங்களே கட்டுப்படுத்துகிறீர்களா?' }
    },
    {
      lessonNumber: 18,
      title: { en: 'The Habit Installation Protocol', ta: 'பழக்கத்தை நிறுவும் நெறிமுறை' },
      explanation: { en: 'It takes exactly 66 days to install a new habit. It goes through 3 phases (22 days each): Destruction (breaking the old habit), Installation (the messy middle of forming new neural pathways), and Integration (it becomes automatic).', ta: 'ஒரு புதிய பழக்கத்தை நிறுவச் சரியாக 66 நாட்கள் ஆகும். இது 3 கட்டங்களைக் கடந்து செல்கிறது (தலா 22 நாட்கள்): அழித்தல் (பழைய பழக்கத்தை உடைத்தல்), நிறுவுதல் (புதிய நரம்பியல் பாதைகளை உருவாக்கும் குழப்பமான நடுத்தரக் கட்டம்) மற்றும் ஒருங்கிணைத்தல் (அது தானியங்கியாக மாறுகிறது).' },
      whyItMatters: { en: 'People quit new habits after 21 days because it feels hard, thinking something is wrong. Understanding the 66-day protocol gives you the patience to push through the messy middle.', ta: '21 நாட்களுக்குப் பிறகு புதிய பழக்கங்களை மக்கள் கைவிடுகிறார்கள், ஏனெனில் அது கடினமாக உணர்கிறது, ஏதோ தவறு இருப்பதாக நினைக்கிறார்கள். 66 நாள் நெறிமுறையைப் புரிந்துகொள்வது, குழப்பமான நடுத்தரக் கட்டத்தைத் தள்ளுவதற்கு உங்களுக்குப் பொறுமையைத் தருகிறது.' },
      example: { en: 'Waking up at 5 AM is torture for the first 22 days, confusing and inconsistent for the next 22 days, and completely effortless and normal by day 66.', ta: 'காலை 5 மணிக்கு எழுவது முதல் 22 நாட்களுக்குச் சித்திரவதையாக இருக்கும், அடுத்த 22 நாட்களுக்குக் குழப்பமாகவும் சீரற்றதாகவும் இருக்கும், மற்றும் 66-வது நாளுக்குள் முற்றிலும் சிரமமின்றியும் இயல்பாகவும் மாறிவிடும்.' },
      actionStep: { en: 'Draw a grid with 66 boxes on a piece of paper. Pick one habit (like waking up at 5 AM) and cross off a box every day. Do not break the chain.', ta: 'ஒரு காகிதத்தில் 66 பெட்டிகள் கொண்ட ஒரு கட்டத்தை வரையவும். ஒரு பழக்கத்தைத் தேர்ந்தெடுக்கவும் (காலை 5 மணிக்கு எழுவது போல) மற்றும் ஒவ்வொரு நாளும் ஒரு பெட்டியைக் குறுக்கே அடிக்கவும். சங்கிலியை உடைக்க வேண்டாம்.' },
      reflectionQuestion: { en: 'Do you routinely quit new positive habits right in the middle of the "Installation" phase just because it feels uncomfortable?', ta: 'புதிய நேர்மறையான பழக்கங்கள் சங்கடமாக உணர்கின்றன என்பதற்காக மட்டுமே "நிறுவுதல்" கட்டத்தின் நடுவிலேயே அவற்றை வழக்கமாகக் கைவிடுகிறீர்களா?' }
    },
    {
      lessonNumber: 19,
      title: { en: 'The Joy as a GPS', ta: 'மகிழ்ச்சி ஒரு ஜிபிஎஸ் (GPS) போல' },
      explanation: { en: 'Use joy as your internal compass. Surround yourself with people, places, and pursuits that spark joy. If a project, habit, or person drains your joy, it is a signal to pivot.', ta: 'மகிழ்ச்சியை உங்களின் உள் திசைகாட்டியாகப் பயன்படுத்துங்கள். மகிழ்ச்சியைத் தூண்டும் மனிதர்கள், இடங்கள் மற்றும் நோக்கங்களுடன் உங்களைச் சூழ்ந்துகொள்ளுங்கள். ஒரு திட்டம், பழக்கம் அல்லது நபர் உங்கள் மகிழ்ச்சியைக் குறைத்தால், அது திசைதிருப்ப வேண்டியதற்கான சமிக்ஞையாகும்.' },
      whyItMatters: { en: 'Logic and money can only motivate you so far. True, sustainable energy comes from following what genuinely lights you up on the inside.', ta: 'தர்க்கமும் பணமும் உங்களை ஒரு குறிப்பிட்ட எல்லை வரை மட்டுமே ஊக்குவிக்க முடியும். உண்மையான, நீடித்த ஆற்றல் என்பது உள்ளுக்குள் உங்களை உண்மையிலேயே ஒளிரச் செய்வதைப் பின்பற்றுவதிலிருந்து வருகிறது.' },
      example: { en: 'Declining a highly paid speaking gig because you realize the organizers are toxic and the event brings you dread instead of excitement.', ta: 'ஏற்பாட்டாளர்கள் நச்சுத்தன்மையானவர்கள் என்பதையும், நிகழ்வு உங்களுக்கு உற்சாகத்திற்குப் பதிலாக அச்சத்தைத் தருகிறது என்பதையும் உணர்ந்து, அதிக சம்பளம் கிடைக்கும் பேச்சாளர் வாய்ப்பை மறுப்பது.' },
      actionStep: { en: 'Do an "Energy Audit" today. List three things in your life that give you energy (joy) and three things that drain it. Commit to doing less of the drainers.', ta: 'இன்று ஒரு "ஆற்றல் தணிக்கை" செய்யுங்கள். உங்கள் வாழ்க்கையில் உங்களுக்கு ஆற்றலைக் (மகிழ்ச்சியை) கொடுக்கும் மூன்று விஷயங்களையும், அதைக் குறைக்கும் மூன்று விஷயங்களையும் பட்டியலிடுங்கள். ஆற்றலைக் குறைக்கும் விஷயங்களைக் குறைவாகச் செய்ய உறுதியளியுங்கள்.' },
      reflectionQuestion: { en: 'Are you ignoring your internal GPS, forcing yourself to do things that make you miserable just because they look good on paper?', ta: 'காகிதத்தில் நன்றாகத் தெரிகிறது என்பதற்காக மட்டுமே உங்களைச் சிறுமைப்படுத்தும் காரியங்களைச் செய்ய உங்களை நீங்களே கட்டாயப்படுத்திக் கொண்டு, உங்களின் உள் ஜிபிஎஸ்ஸை (GPS) நீங்கள் புறக்கணிக்கிறீர்களா?' }
    },
    {
      lessonNumber: 20,
      title: { en: 'Leave a Legacy', ta: 'ஒரு மரபினை விட்டுச் செல்லுங்கள்' },
      explanation: { en: 'The ultimate purpose of the 5 AM Club and all personal mastery is to be of greater service to the world. It is about shifting from a mindset of survival and accumulation to a mindset of legacy and contribution.', ta: '5 ஏஎம் கிளப் மற்றும் அனைத்துத் தனிப்பட்ட தேர்ச்சியின் இறுதி நோக்கம் உலகிற்குச் சிறந்த சேவை செய்வதே ஆகும். இது பிழைப்பு மற்றும் குவிப்பு என்ற மனநிலையிலிருந்து மரபு மற்றும் பங்களிப்பு என்ற மனநிலைக்கு மாறுவதாகும்.' },
      whyItMatters: { en: 'You can\'t take your money or titles with you when you die. The only thing that remains is the impact you had on other human beings.', ta: 'நீங்கள் இறக்கும் போது உங்கள் பணத்தையோ அல்லது பட்டங்களையோ உங்களுடன் எடுத்துச் செல்ல முடியாது. மற்ற மனிதர்கள் மீது நீங்கள் ஏற்படுத்திய தாக்கம் மட்டுமே எஞ்சியிருக்கும் ஒரே விஷயம்.' },
      example: { en: 'An entrepreneur who, after building a massive company, shifts their focus entirely to mentoring young founders and funding schools in impoverished areas.', ta: 'ஒரு பெரிய நிறுவனத்தைக் கட்டியெழுப்பிய பிறகு, ஒரு தொழில்முனைவோர் தனது கவனத்தை முழுமையாக இளம் நிறுவனர்களுக்கு வழிகாட்டுவதிலும், ஏழ்மையான பகுதிகளில் உள்ள பள்ளிகளுக்கு நிதியளிப்பதிலும் மாற்றுவது.' },
      actionStep: { en: 'Write down exactly how you want to be remembered at your funeral. Then, align your actions today to start building that specific legacy.', ta: 'உங்கள் இறுதிச் சடங்கில் நீங்கள் எவ்வாறு நினைவுகூரப்பட வேண்டும் என்பதைத் துல்லியமாக எழுதுங்கள். பின்னர், அந்தக் குறிப்பிட்ட மரபை உருவாக்கத் தொடங்க இன்றைய உங்கள் செயல்களைச் சீரமைக்கவும்.' },
      reflectionQuestion: { en: 'Are you climbing the mountain of success only to realize at the top that you were climbing the wrong mountain?', ta: 'நீங்கள் தவறான மலையில் ஏறிக்கொண்டிருந்தீர்கள் என்பதை உச்சியில் உணர்வதற்காக மட்டுமே வெற்றியின் மலையில் ஏறுகிறீர்களா?' }
    }
  ]
};

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goalpilot';
    console.log(`Connecting to database at ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    // Check if it already exists
    const existing = await WisdomBook.findOne({ title: 'The 5 AM Club: Own Your Morning. Elevate Your Life.' });
    if (existing) {
      console.log('The 5 AM Club already exists. Deleting it to refresh...');
      await WisdomBook.deleteOne({ title: 'The 5 AM Club: Own Your Morning. Elevate Your Life.' });
    }
    
    await WisdomBook.create(fiveAmClubBook);
    console.log('The 5 AM Club added successfully with 20 lessons!');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
