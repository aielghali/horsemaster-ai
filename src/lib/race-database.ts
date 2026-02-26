/**
 * Elghali AI - Race Database v4.0
 * RACECOURSES LIST ONLY - NO MOCK DATA
 * All race data is fetched in REAL-TIME from internet sources
 * 
 * Data Sources:
 * - Emirates Racing Authority (UAE)
 * - British Horseracing Authority (UK)
 * - Horse Racing Ireland (Ireland)
 * - France Galop (France)
 * - Equibase / DRF (USA)
 * - Racing Australia (Australia)
 * - Jockey Club Saudi Arabia
 * - Qatar Racing Club
 * - Bahrain Rashid Equestrian Club
 * - Oman Equestrian Federation
 */

export const CACHE_VERSION = "4.0.0-live-data"

// ==================== TYPES ====================

export interface HorseEntry {
  number: number
  name: string
  jockey: string
  trainer: string
  rating: number
  weight: number
  draw: number
  age: number
  sex: string
  form: string
  sire?: string
  dam?: string
  damsire?: string
  odds?: string
  isFavorite?: boolean
  isWithdrawn?: boolean
  isNonRunner?: boolean
  hasNoCompetitor?: boolean
  isSurprise?: boolean
}

export interface RaceEntry {
  number: number
  name: string
  time: string
  distance: number
  surface: 'Dirt' | 'Turf' | 'All-Weather' | 'Sand'
  going: string
  raceType: string
  raceClass: string
  prize: number
  horses: HorseEntry[]
  liveStreamUrl?: string
  withdrawals?: string[]
  nonRunners?: string[]
}

export interface RaceDayEntry {
  date: string
  racecourse: string
  city: string
  country: string
  races: RaceEntry[]
  lastUpdated: string
  sources: string[]
}

// ==================== RACECOURSES DATABASE ====================

export const RACECOURSES = {
  // ═══════════════════════════════════════════════════════════════════
  // 🇦🇪 UAE - الإمارات العربية المتحدة
  // Source: Emirates Racing Authority (emiratesracing.com)
  // ═══════════════════════════════════════════════════════════════════
  UAE: [
    { name: 'Meydan', city: 'Dubai', surface: ['Dirt', 'Turf'], timezone: 'Asia/Dubai', 
      liveStreamUrl: 'https://www.emiratesracing.com/live-streams/dubai-racing-1' },
    { name: 'Jebel Ali', city: 'Dubai', surface: ['Sand'], timezone: 'Asia/Dubai',
      liveStreamUrl: 'https://www.emiratesracing.com/live-streams/dubai-racing-2' },
    { name: 'Abu Dhabi', city: 'Abu Dhabi', surface: ['Turf'], timezone: 'Asia/Dubai',
      liveStreamUrl: 'https://www.emiratesracing.com/live-streams/abu-dhabi-racing' },
    { name: 'Sharjah', city: 'Sharjah', surface: ['Dirt'], timezone: 'Asia/Dubai',
      liveStreamUrl: 'https://www.emiratesracing.com/live-streams/sharjah-racing' },
    { name: 'Al Ain', city: 'Al Ain', surface: ['Dirt'], timezone: 'Asia/Dubai',
      liveStreamUrl: 'https://www.emiratesracing.com/live-streams/al-ain-racing' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇸🇦 SAUDI ARABIA - المملكة العربية السعودية
  // Source: Jockey Club Saudi Arabia (jockeyclubsa.com)
  // ═══════════════════════════════════════════════════════════════════
  SAUDI_ARABIA: [
    { name: 'King Abdulaziz', city: 'Riyadh', surface: ['Dirt', 'Turf'], timezone: 'Asia/Riyadh',
      liveStreamUrl: 'https://www.jockeyclubsa.com/live' },
    { name: 'King Fahd', city: 'Riyadh', surface: ['Dirt'], timezone: 'Asia/Riyadh' },
    { name: 'Janadriyah', city: 'Riyadh', surface: ['Dirt'], timezone: 'Asia/Riyadh' },
    { name: 'Taif', city: 'Taif', surface: ['Dirt'], timezone: 'Asia/Riyadh' },
    { name: 'Jeddah', city: 'Jeddah', surface: ['Dirt'], timezone: 'Asia/Riyadh' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇶🇦 QATAR - قطر
  // Source: Qatar Racing & Equestrian Club (qrec.gov.qa)
  // ═══════════════════════════════════════════════════════════════════
  QATAR: [
    { name: 'Al Rayyan', city: 'Doha', surface: ['Turf'], timezone: 'Asia/Qatar',
      liveStreamUrl: 'https://www.qrec.gov.qa/live' },
    { name: 'Qatar Racing Club', city: 'Doha', surface: ['Turf', 'Dirt'], timezone: 'Asia/Qatar' },
    { name: 'Al Uqda', city: 'Al Uqda', surface: ['Turf'], timezone: 'Asia/Qatar' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇴🇲 OMAN - عُمان
  // Source: Oman Equestrian Federation
  // ═══════════════════════════════════════════════════════════════════
  OMAN: [
    { name: 'Muscat', city: 'Muscat', surface: ['Dirt'], timezone: 'Asia/Muscat' },
    { name: 'Al Rahba', city: 'Al Rahba', surface: ['Dirt'], timezone: 'Asia/Muscat' },
    { name: 'Salalah', city: 'Salalah', surface: ['Dirt'], timezone: 'Asia/Muscat' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇧🇭 BAHRAIN - البحرين
  // Source: Bahrain Rashid Equestrian Club (bahrainracing.com)
  // ═══════════════════════════════════════════════════════════════════
  BAHRAIN: [
    { name: 'Sakhir', city: 'Sakhir', surface: ['Turf', 'Dirt'], timezone: 'Asia/Bahrain',
      liveStreamUrl: 'https://www.bahrainracing.com/live' },
    { name: 'Rashid Equestrian', city: 'Sakhir', surface: ['Turf'], timezone: 'Asia/Bahrain' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇬🇧 UK - بريطانيا
  // Sources: British Horseracing Authority, Racing Post, Timeform, Sporting Life
  // ═══════════════════════════════════════════════════════════════════
  UK: [
    // Major Flat Tracks
    { name: 'Ascot', city: 'Ascot', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Newmarket', city: 'Newmarket', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'York', city: 'York', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Epsom Downs', city: 'Epsom', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Doncaster', city: 'Doncaster', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Leeds', city: 'Leeds', surface: ['Turf'], timezone: 'Europe/London' },
    // All-Weather
    { name: 'Wolverhampton', city: 'Wolverhampton', surface: ['All-Weather'], timezone: 'Europe/London',
      liveStreamUrl: 'https://www.attheraces.com/wolverhampton' },
    { name: 'Kempton', city: 'Sunbury', surface: ['All-Weather'], timezone: 'Europe/London',
      liveStreamUrl: 'https://www.attheraces.com/kempton' },
    { name: 'Lingfield', city: 'Lingfield', surface: ['All-Weather', 'Turf'], timezone: 'Europe/London',
      liveStreamUrl: 'https://www.attheraces.com/lingfield' },
    { name: 'Southwell', city: 'Southwell', surface: ['All-Weather'], timezone: 'Europe/London',
      liveStreamUrl: 'https://www.attheraces.com/southwell' },
    { name: 'Chelmsford', city: 'Chelmsford', surface: ['All-Weather'], timezone: 'Europe/London' },
    { name: 'Newcastle', city: 'Newcastle', surface: ['All-Weather', 'Turf'], timezone: 'Europe/London' },
    // Jumps & Mixed
    { name: 'Aintree', city: 'Liverpool', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Cheltenham', city: 'Cheltenham', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Sandown', city: 'Esher', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Goodwood', city: 'Goodwood', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Newbury', city: 'Newbury', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Haydock', city: 'Haydock', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Chester', city: 'Chester', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Newmarket Rowley Mile', city: 'Newmarket', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Newmarket July Course', city: 'Newmarket', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Great Yarmouth', city: 'Great Yarmouth', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Thirsk', city: 'Thirsk', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Ripon', city: 'Ripon', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Pontefract', city: 'Pontefract', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Musselburgh', city: 'Edinburgh', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Perth', city: 'Perth', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Ayr', city: 'Ayr', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Hamilton', city: 'Hamilton', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Carlisle', city: 'Carlisle', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Catterick', city: 'Catterick', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Beverley', city: 'Beverley', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Redcar', city: 'Redcar', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Sedgefield', city: 'Sedgefield', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Market Rasen', city: 'Market Rasen', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Huntingdon', city: 'Huntingdon', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Ffos Las', city: 'Ffos Las', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Chepstow', city: 'Chepstow', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Fontwell', city: 'Fontwell', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Plumpton', city: 'Plumpton', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Ludlow', city: 'Ludlow', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Hereford', city: 'Hereford', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Exeter', city: 'Exeter', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Taunton', city: 'Taunton', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Wincanton', city: 'Wincanton', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Fakenham', city: 'Fakenham', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Stratford', city: 'Stratford', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Uttoxeter', city: 'Uttoxeter', surface: ['Turf'], timezone: 'Europe/London' },
    { name: 'Bangor', city: 'Bangor', surface: ['Turf'], timezone: 'Europe/London' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇮🇪 IRELAND - أيرلندا
  // Source: Horse Racing Ireland (hri.ie)
  // ═══════════════════════════════════════════════════════════════════
  IRELAND: [
    { name: 'Leopardstown', city: 'Dublin', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'The Curragh', city: 'Kildare', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Fairyhouse', city: 'Meath', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Punchestown', city: 'Kildare', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Galway', city: 'Galway', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Cork', city: 'Cork', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Limerick', city: 'Limerick', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Tipperary', city: 'Tipperary', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Killarney', city: 'Killarney', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Gowran Park', city: 'Kilkenny', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Naas', city: 'Kildare', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Navan', city: 'Meath', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Dundalk', city: 'Dundalk', surface: ['All-Weather'], timezone: 'Europe/Dublin',
      liveStreamUrl: 'https://www.racingtv.com/dundalk' },
    { name: 'Down Royal', city: 'Down', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Downpatrick', city: 'Down', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Bellewstown', city: 'Meath', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Sligo', city: 'Sligo', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Tramore', city: 'Waterford', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Clonmel', city: 'Tipperary', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Thurles', city: 'Tipperary', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Roscommon', city: 'Roscommon', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Ballinrobe', city: 'Mayo', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Wexford', city: 'Wexford', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Listowel', city: 'Kerry', surface: ['Turf'], timezone: 'Europe/Dublin' },
    { name: 'Kilbeggan', city: 'Westmeath', surface: ['Turf'], timezone: 'Europe/Dublin' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇫🇷 FRANCE - فرنسا
  // Source: France Galop (france-galop.com)
  // ═══════════════════════════════════════════════════════════════════
  FRANCE: [
    { name: 'Longchamp', city: 'Paris', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Chantilly', city: 'Chantilly', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Deauville', city: 'Deauville', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Saint-Cloud', city: 'Paris', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Maisons-Laffitte', city: 'Paris', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Compiegne', city: 'Compiegne', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Fontainebleau', city: 'Fontainebleau', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Lyon', city: 'Lyon', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Marseille', city: 'Marseille', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Cagnes-sur-Mer', city: 'Nice', surface: ['Turf', 'All-Weather'], timezone: 'Europe/Paris' },
    { name: 'Nantes', city: 'Nantes', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Bordeaux', city: 'Bordeaux', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Toulouse', city: 'Toulouse', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Strasbourg', city: 'Strasbourg', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Angers', city: 'Angers', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Clairefontaine', city: 'Deauville', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Dieppe', city: 'Dieppe', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Le Lion d\'Angers', city: 'Angers', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Pornichet', city: 'Pornichet', surface: ['All-Weather'], timezone: 'Europe/Paris' },
    { name: 'Pau', city: 'Pau', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Tarbes', city: 'Tarbes', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Dax', city: 'Dax', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Mont-de-Marsan', city: 'Mont-de-Marsan', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Chateaubriant', city: 'Chateaubriant', surface: ['Turf'], timezone: 'Europe/Paris' },
    { name: 'Vichy', city: 'Vichy', surface: ['Turf'], timezone: 'Europe/Paris' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇦🇺 AUSTRALIA - أستراليا
  // Source: Racing Australia (racing.com)
  // ═══════════════════════════════════════════════════════════════════
  AUSTRALIA: [
    // Victoria
    { name: 'Flemington', city: 'Melbourne', surface: ['Turf'], timezone: 'Australia/Melbourne',
      liveStreamUrl: 'https://www.racing.com/flemington/live' },
    { name: 'Caulfield', city: 'Melbourne', surface: ['Turf'], timezone: 'Australia/Melbourne',
      liveStreamUrl: 'https://www.racing.com/caulfield/live' },
    { name: 'Moonee Valley', city: 'Melbourne', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    { name: 'Sandown', city: 'Melbourne', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    // New South Wales
    { name: 'Randwick', city: 'Sydney', surface: ['Turf'], timezone: 'Australia/Sydney' },
    { name: 'Rosehill', city: 'Sydney', surface: ['Turf'], timezone: 'Australia/Sydney' },
    { name: 'Warwick Farm', city: 'Sydney', surface: ['Turf'], timezone: 'Australia/Sydney' },
    { name: 'Canterbury', city: 'Sydney', surface: ['Turf'], timezone: 'Australia/Sydney' },
    { name: 'Newcastle', city: 'Newcastle', surface: ['Turf'], timezone: 'Australia/Sydney' },
    // Queensland
    { name: 'Eagle Farm', city: 'Brisbane', surface: ['Turf'], timezone: 'Australia/Brisbane' },
    { name: 'Doomben', city: 'Brisbane', surface: ['Turf'], timezone: 'Australia/Brisbane' },
    { name: 'Gold Coast', city: 'Gold Coast', surface: ['Turf'], timezone: 'Australia/Brisbane' },
    { name: 'Sunshine Coast', city: 'Sunshine Coast', surface: ['Turf'], timezone: 'Australia/Brisbane' },
    // South Australia
    { name: 'Morphettville', city: 'Adelaide', surface: ['Turf'], timezone: 'Australia/Adelaide' },
    // Western Australia
    { name: 'Ascot Perth', city: 'Perth', surface: ['Turf'], timezone: 'Australia/Perth' },
    { name: 'Belmont', city: 'Perth', surface: ['Turf'], timezone: 'Australia/Perth' },
    // Tasmania
    { name: 'Hobart', city: 'Hobart', surface: ['Turf'], timezone: 'Australia/Hobart' },
    { name: 'Launceston', city: 'Launceston', surface: ['Turf'], timezone: 'Australia/Hobart' },
    // Northern Territory
    { name: 'Fannie Bay', city: 'Darwin', surface: ['Turf'], timezone: 'Australia/Darwin' },
    // Additional
    { name: 'Geelong', city: 'Geelong', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    { name: 'Bendigo', city: 'Bendigo', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    { name: 'Ballarat', city: 'Ballarat', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    { name: 'Sale', city: 'Sale', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    { name: 'Pakenham', city: 'Pakenham', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    { name: 'Cranbourne', city: 'Cranbourne', surface: ['Turf'], timezone: 'Australia/Melbourne' },
    { name: 'Kembla Grange', city: 'Wollongong', surface: ['Turf'], timezone: 'Australia/Sydney' },
    { name: 'Hawkesbury', city: 'Hawkesbury', surface: ['Turf'], timezone: 'Australia/Sydney' },
    { name: 'Gosford', city: 'Gosford', surface: ['Turf'], timezone: 'Australia/Sydney' },
    { name: 'Wyong', city: 'Wyong', surface: ['Turf'], timezone: 'Australia/Sydney' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇺🇸 USA - الولايات المتحدة الأمريكية
  // Sources: Equibase, Daily Racing Form, TwinSpires, BloodHorse
  // ═══════════════════════════════════════════════════════════════════
  USA: [
    // Triple Crown Tracks
    { name: 'Churchill Downs', city: 'Louisville, Kentucky', surface: ['Dirt'], timezone: 'America/New_York',
      liveStreamUrl: 'https://www.twinspires.com/churchilldowns' },
    { name: 'Pimlico', city: 'Baltimore, Maryland', surface: ['Dirt'], timezone: 'America/New_York' },
    { name: 'Belmont Park', city: 'Elmont, New York', surface: ['Dirt', 'Turf'], timezone: 'America/New_York',
      liveStreamUrl: 'https://www.nyra.com/belmont/live' },
    // California
    { name: 'Santa Anita', city: 'Arcadia, California', surface: ['Dirt', 'Turf'], timezone: 'America/Los_Angeles',
      liveStreamUrl: 'https://www.santaanita.com/live-racing' },
    { name: 'Del Mar', city: 'Del Mar, California', surface: ['Dirt', 'Turf'], timezone: 'America/Los_Angeles',
      liveStreamUrl: 'https://www.dmtc.com/video' },
    { name: 'Los Alamitos', city: 'Los Alamitos, California', surface: ['Dirt'], timezone: 'America/Los_Angeles' },
    { name: 'Golden Gate Fields', city: 'Berkeley, California', surface: ['All-Weather', 'Turf'], timezone: 'America/Los_Angeles' },
    // Florida
    { name: 'Gulfstream Park', city: 'Hallandale, Florida', surface: ['Dirt', 'Turf'], timezone: 'America/New_York',
      liveStreamUrl: 'https://www.gulfstreampark.com/watch-live' },
    { name: 'Tampa Bay Downs', city: 'Tampa, Florida', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    { name: 'Hialeah Park', city: 'Hialeah, Florida', surface: ['Dirt'], timezone: 'America/New_York' },
    { name: 'Gulfstream Park West', city: 'Miami, Florida', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    // Kentucky
    { name: 'Keeneland', city: 'Lexington, Kentucky', surface: ['Dirt', 'Turf'], timezone: 'America/New_York',
      liveStreamUrl: 'https://www.keeneland.com/racing/live-video' },
    { name: 'Ellis Park', city: 'Henderson, Kentucky', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    { name: 'Turffway Park', city: 'Florence, Kentucky', surface: ['All-Weather'], timezone: 'America/New_York' },
    // New York
    { name: 'Saratoga', city: 'Saratoga Springs, New York', surface: ['Dirt', 'Turf'], timezone: 'America/New_York',
      liveStreamUrl: 'https://www.nyra.com/saratoga/live' },
    { name: 'Aqueduct', city: 'Queens, New York', surface: ['Dirt'], timezone: 'America/New_York' },
    { name: 'Finger Lakes', city: 'Farmingdale, New York', surface: ['Dirt'], timezone: 'America/New_York' },
    // Arkansas
    { name: 'Oaklawn Park', city: 'Hot Springs, Arkansas', surface: ['Dirt'], timezone: 'America/Chicago',
      liveStreamUrl: 'https://www.oaklawn.com/racing/live-video' },
    // Maryland
    { name: 'Laurel Park', city: 'Laurel, Maryland', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    // New Jersey
    { name: 'Monmouth Park', city: 'Oceanport, New Jersey', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    { name: 'Meadowlands', city: 'East Rutherford, New Jersey', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    // Illinois
    { name: 'Arlington Park', city: 'Arlington Heights, Illinois', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    { name: 'Hawthorne', city: 'Cicero, Illinois', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    { name: 'Fairmount Park', city: 'Collinsville, Illinois', surface: ['Dirt'], timezone: 'America/Chicago' },
    // Louisiana
    { name: 'Fair Grounds', city: 'New Orleans, Louisiana', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    { name: 'Evangeline Downs', city: 'Opelousas, Louisiana', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    { name: 'Delta Downs', city: 'Vinton, Louisiana', surface: ['Dirt'], timezone: 'America/Chicago' },
    { name: 'Louisiana Downs', city: 'Bossier City, Louisiana', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    // Texas
    { name: 'Sam Houston', city: 'Houston, Texas', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    { name: 'Lone Star Park', city: 'Grand Prairie, Texas', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    { name: 'Retama Park', city: 'Selma, Texas', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    // Indiana
    { name: 'Indiana Grand', city: 'Shelbyville, Indiana', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    // Ohio
    { name: 'Thistledown', city: 'North Randall, Ohio', surface: ['Dirt'], timezone: 'America/New_York' },
    { name: 'Mahoning Valley', city: 'Youngstown, Ohio', surface: ['Dirt'], timezone: 'America/New_York' },
    { name: 'Belterra Park', city: 'Cincinnati, Ohio', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    // West Virginia
    { name: 'Charles Town', city: 'Charles Town, West Virginia', surface: ['Dirt'], timezone: 'America/New_York' },
    { name: 'Mountaineer', city: 'Chester, West Virginia', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    // Pennsylvania
    { name: 'Parx', city: 'Bensalem, Pennsylvania', surface: ['Dirt'], timezone: 'America/New_York' },
    { name: 'Penn National', city: 'Grantville, Pennsylvania', surface: ['Dirt', 'Turf'], timezone: 'America/New_York' },
    { name: 'Presque Isle', city: 'Erie, Pennsylvania', surface: ['All-Weather'], timezone: 'America/New_York' },
    // Iowa
    { name: 'Prairie Meadows', city: 'Altoona, Iowa', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    // Minnesota
    { name: 'Canterbury Park', city: 'Shakopee, Minnesota', surface: ['Dirt', 'Turf'], timezone: 'America/Chicago' },
    // Oklahoma
    { name: 'Remington Park', city: 'Oklahoma City, Oklahoma', surface: ['Dirt'], timezone: 'America/Chicago' },
    { name: 'Fair Meadows', city: 'Tulsa, Oklahoma', surface: ['Dirt'], timezone: 'America/Chicago' },
    // New Mexico
    { name: 'Sunland Park', city: 'Sunland Park, New Mexico', surface: ['Dirt', 'Turf'], timezone: 'America/Denver',
      liveStreamUrl: 'https://www.sunlandpark.com/racing/live-racing' },
    { name: 'Ruidoso Downs', city: 'Ruidoso, New Mexico', surface: ['Dirt'], timezone: 'America/Denver' },
    { name: 'Zia Park', city: 'Hobbs, New Mexico', surface: ['Dirt'], timezone: 'America/Denver' },
    // Arizona
    { name: 'Turf Paradise', city: 'Phoenix, Arizona', surface: ['Dirt', 'Turf'], timezone: 'America/Phoenix' },
    // Washington
    { name: 'Emerald Downs', city: 'Auburn, Washington', surface: ['Dirt'], timezone: 'America/Los_Angeles' },
    // Oregon
    { name: 'Portland Meadows', city: 'Portland, Oregon', surface: ['Dirt'], timezone: 'America/Los_Angeles' },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // 🇪🇺 EUROPE - أوروبا
  // Sources: German Racing, Italian Racing, Spanish Racing, etc.
  // ═══════════════════════════════════════════════════════════════════
  EUROPE: [
    // Germany
    { name: 'Hoppegarten', city: 'Berlin', surface: ['Turf'], timezone: 'Europe/Berlin' },
    { name: 'Cologne', city: 'Cologne', surface: ['Turf'], timezone: 'Europe/Berlin' },
    { name: 'Dusseldorf', city: 'Dusseldorf', surface: ['Turf'], timezone: 'Europe/Berlin' },
    { name: 'Munich', city: 'Munich', surface: ['Turf'], timezone: 'Europe/Berlin' },
    { name: 'Baden-Baden', city: 'Baden-Baden', surface: ['Turf'], timezone: 'Europe/Berlin' },
    { name: 'Hamburg', city: 'Hamburg', surface: ['Turf'], timezone: 'Europe/Berlin' },
    { name: 'Frankfurt', city: 'Frankfurt', surface: ['Turf'], timezone: 'Europe/Berlin' },
    { name: 'Hanover', city: 'Hanover', surface: ['Turf'], timezone: 'Europe/Berlin' },
    // Italy
    { name: 'San Siro', city: 'Milan', surface: ['Turf'], timezone: 'Europe/Rome' },
    { name: 'Capannelle', city: 'Rome', surface: ['Turf'], timezone: 'Europe/Rome' },
    { name: 'Valenzano', city: 'Bari', surface: ['Turf'], timezone: 'Europe/Rome' },
    { name: 'Visarno', city: 'Florence', surface: ['Turf'], timezone: 'Europe/Rome' },
    { name: 'Naples', city: 'Naples', surface: ['Turf'], timezone: 'Europe/Rome' },
    // Spain
    { name: 'Madrid', city: 'Madrid', surface: ['Turf'], timezone: 'Europe/Madrid' },
    { name: 'San Sebastian', city: 'San Sebastian', surface: ['Turf'], timezone: 'Europe/Madrid' },
    { name: 'Seville', city: 'Seville', surface: ['Turf'], timezone: 'Europe/Madrid' },
    // Belgium
    { name: 'Brussels', city: 'Brussels', surface: ['Turf'], timezone: 'Europe/Brussels' },
    { name: 'Ostend', city: 'Ostend', surface: ['Turf'], timezone: 'Europe/Brussels' },
    // Netherlands
    { name: 'Duindigt', city: 'Wassenaar', surface: ['Turf'], timezone: 'Europe/Amsterdam' },
    // Switzerland
    { name: 'Iffezheim', city: 'Baden-Baden', surface: ['Turf'], timezone: 'Europe/Zurich' },
    { name: 'Frauenfeld', city: 'Frauenfeld', surface: ['Turf'], timezone: 'Europe/Zurich' },
    // Austria
    { name: 'Vienna', city: 'Vienna', surface: ['Turf'], timezone: 'Europe/Vienna' },
    // Sweden
    { name: 'Bro Park', city: 'Stockholm', surface: ['Turf'], timezone: 'Europe/Stockholm' },
    { name: 'Jagersro', city: 'Malmo', surface: ['Turf'], timezone: 'Europe/Stockholm' },
    { name: 'Taby', city: 'Stockholm', surface: ['Turf'], timezone: 'Europe/Stockholm' },
    // Denmark
    { name: 'Copenhagen', city: 'Copenhagen', surface: ['Turf'], timezone: 'Europe/Copenhagen' },
    // Norway
    { name: 'Ovrevoll', city: 'Oslo', surface: ['Turf'], timezone: 'Europe/Oslo' },
    // Poland
    { name: 'Warsaw', city: 'Warsaw', surface: ['Turf'], timezone: 'Europe/Warsaw' },
    { name: 'Sopot', city: 'Sopot', surface: ['Turf'], timezone: 'Europe/Warsaw' },
    { name: 'Wroclaw', city: 'Wroclaw', surface: ['Turf'], timezone: 'Europe/Warsaw' },
    // Czech Republic
    { name: 'Prague', city: 'Prague', surface: ['Turf'], timezone: 'Europe/Prague' },
    // Hungary
    { name: 'Kincsem Park', city: 'Budapest', surface: ['Turf', 'Dirt'], timezone: 'Europe/Budapest' },
    // Turkey
    { name: 'Veliefendi', city: 'Istanbul', surface: ['Turf', 'Dirt'], timezone: 'Europe/Istanbul' },
    { name: 'Ankara', city: 'Ankara', surface: ['Turf'], timezone: 'Europe/Istanbul' },
    { name: 'Izmir', city: 'Izmir', surface: ['Turf'], timezone: 'Europe/Istanbul' },
    // Portugal
    { name: 'Lisbon', city: 'Lisbon', surface: ['Turf'], timezone: 'Europe/Lisbon' },
    { name: 'Oporto', city: 'Porto', surface: ['Turf'], timezone: 'Europe/Lisbon' },
  ],
}

// No mock data - all data fetched from real sources
export const UAE_RACES: RaceDayEntry[] = []

// Helper function to normalize racecourse names
export function normalizeRacecourse(name: string): string {
  return name.trim().toLowerCase().replace(/[-_\s]+/g, ' ')
}

// Get race data - now returns null (data fetched live)
export function getRaceData(racecourse: string, date: string): RaceDayEntry | null {
  console.log(`[getRaceData] Live data mode - no stored data available`)
  return null
}
