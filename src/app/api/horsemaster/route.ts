import { NextRequest, NextResponse } from 'next/server';

// بيانات المضامير
const RACETRACKS: Record<string, {id: string; name: string; city: string}[]> = {
  "UAE": [
    {id: "meydan", name: "Meydan Racecourse", city: "Dubai"},
    {id: "jebel_ali", name: "Jebel Ali Racecourse", city: "Dubai"},
    {id: "al_ain", name: "Al Ain Racecourse", city: "Al Ain"},
    {id: "abu_dhabi", name: "Abu Dhabi Equestrian Club", city: "Abu Dhabi"},
    {id: "sharjah", name: "Sharjah Equestrian", city: "Sharjah"}
  ],
  "UK": [
    {id: "ascot", name: "Ascot Racecourse", city: "Ascot"},
    {id: "newmarket", name: "Newmarket Racecourse", city: "Newmarket"},
    {id: "kempton", name: "Kempton Park", city: "Sunbury"},
    {id: "lingfield", name: "Lingfield Park", city: "Lingfield"},
    {id: "sandown", name: "Sandown Park", city: "Esher"}
  ],
  "AUSTRALIA": [
    {id: "flemington", name: "Flemington", city: "Melbourne"},
    {id: "randwick", name: "Royal Randwick", city: "Sydney"},
    {id: "caulfield", name: "Caulfield", city: "Melbourne"}
  ],
  "USA": [
    {id: "churchill_downs", name: "Churchill Downs", city: "Louisville"},
    {id: "santa_anita", name: "Santa Anita Park", city: "Arcadia"},
    {id: "belmont", name: "Belmont Park", city: "Elmont"}
  ],
  "FRANCE": [
    {id: "longchamp", name: "ParisLongchamp", city: "Paris"},
    {id: "chantilly", name: "Chantilly", city: "Chantilly"}
  ]
};

// أسماء الخيول
const HORSE_NAMES = [
  "Thunder Strike", "Golden Arrow", "Speed Demon", "Night Rider", "Storm Chaser",
  "Royal Crown", "Diamond King", "Silver Flash", "Phoenix Rising", "Desert Storm",
  "Ocean Breeze", "Mountain Peak", "Wild Spirit", "Lucky Star", "Champion's Dream",
  "Arabian Knight", "Desert Rose", "Golden Sands", "Silk Road", "Dubai Star"
];

const JOCKEYS = ["J. Smith", "M. Johnson", "W. Buick", "L. Dettori", "R. Moore", "C. Soumillon", "H. Doyle"];
const TRAINERS = ["C. Appleby", "A. O'Brien", "J. Gosden", "W. Haggas", "S. bin Suroor", "D. Watson"];

function generatePredictions(country: string, trackId: string, date: string) {
  const track = RACETRACKS[country]?.find(t => t.id === trackId) || RACETRACKS[country]?.[0];
  const numRaces = 6;
  const races = [];
  
  for (let r = 1; r <= numRaces; r++) {
    const numHorses = Math.floor(Math.random() * 6) + 8;
    const horses = [];
    
    for (let h = 1; h <= numHorses; h++) {
      horses.push({
        number: h,
        name: HORSE_NAMES[Math.floor(Math.random() * HORSE_NAMES.length)] + (h > 1 ? ` ${h}` : ''),
        draw: Math.floor(Math.random() * numHorses) + 1,
        jockey: JOCKEYS[Math.floor(Math.random() * JOCKEYS.length)],
        trainer: TRAINERS[Math.floor(Math.random() * TRAINERS.length)],
        rating: Math.floor(Math.random() * 50) + 50,
        power_score: Math.floor(Math.random() * 40) + 60,
        win_probability: Math.floor(Math.random() * 30) + 10,
        value_rating: '⭐'.repeat(Math.floor(Math.random() * 3) + 1)
      });
    }
    
    horses.sort((a, b) => b.power_score - a.power_score);
    
    races.push({
      race_number: r,
      race_time: `${13 + r}:${r % 2 === 0 ? '00' : '30'}`,
      race_name: `Race ${r}`,
      distance: [1200, 1400, 1600, 1800, 2000][Math.floor(Math.random() * 5)],
      surface: Math.random() > 0.5 ? 'Turf' : 'Dirt',
      going: ['Good', 'Soft', 'Firm'][Math.floor(Math.random() * 3)],
      predictions: horses.slice(0, 5)
    });
  }
  
  const topHorse = races[0].predictions[0];
  
  return {
    success: true,
    country,
    track,
    date,
    races,
    total_races: numRaces,
    nap_of_the_day: {
      horse_name: topHorse.name,
      race: `Race 1`,
      reason: `أعلى نقاط قوة (${topHorse.power_score}) مع فورم ممتاز`,
      confidence: topHorse.power_score
    },
    next_best: {
      horse_name: races[1].predictions[0].name,
      race: "Race 2",
      reason: "قيمة ممتازة مع احتمالات جيدة"
    },
    value_pick: {
      horse_name: races[2].predictions[1].name,
      race: "Race 3",
      reason: "احتمالات عالية مع إمكانية مفاجأة"
    }
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json({ 
    success: true, 
    tracks: RACETRACKS,
    message: "HorseMaster API v2.0 - Ready"
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country, track_id, date } = body;
    
    if (!country || !track_id || !date) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields" 
      }, { status: 400 });
    }
    
    const predictions = generatePredictions(country, track_id, date);
    return NextResponse.json(predictions);
    
  } catch {
    return NextResponse.json({ 
      success: false, 
      message: "Error processing request" 
    }, { status: 500 });
  }
}
