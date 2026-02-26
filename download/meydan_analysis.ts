import ZAI from 'z-ai-web-dev-sdk';

const racecard = {
  date: '2026-02-20',
  venue: 'Meydan',
  races: [
    {
      raceNumber: 1,
      time: '17:30',
      name: 'DEEPAL S05 - MAIDEN',
      prize: 'AED 165,000',
      surface: 'Turf',
      distance: '1400m',
      entries: [
        { num: 1, horse: 'CHARMING LIFE (IRE)', trainer: 'Musabbeh Al Mheiri', jockey: 'Connor Beasley' },
        { num: 2, horse: 'HIDDEN SECRET (IRE)', trainer: 'Ahmad bin Harmash', jockey: 'Kieran Shoemark' },
        { num: 3, horse: 'MR PRECOCIOUS (USA)', trainer: 'Salem bin Ghadayer', jockey: 'Oisin Orr' },
        { num: 4, horse: 'VOLCANIC ROCK (IRE)', trainer: 'Saeed bin Suroor', jockey: 'Jose Santiago' },
        { num: 5, horse: 'CATSTYLE (USA)', trainer: 'Salem bin Ghadayer', jockey: 'Patrick Dobbs' },
        { num: 6, horse: 'DIAMONDAIRES WILL (USA)', trainer: 'Doug Watson', jockey: 'William Buick' },
        { num: 7, horse: 'KEY OF MAGIC (USA)', trainer: 'Charlie Appleby', jockey: "Tadhg O'Shea" },
        { num: 8, horse: 'MAGIC ART (USA)', trainer: 'Bhupat Seemar', jockey: 'Mickael Barzalona' },
        { num: 9, horse: 'RAASIL (USA)', trainer: 'Bhupat Seemar', jockey: 'Richard Mullen' },
        { num: 10, horse: 'SUCETTE (USA)', trainer: 'Bhupat Seemar', jockey: 'Elione Chaves' },
        { num: 11, horse: 'WILLOCH (USA)', trainer: 'Fredrik Reuterskiold', jockey: 'Ray Dawson' }
      ]
    },
    {
      raceNumber: 2,
      time: '18:05',
      name: 'DEEPAL S07 - HANDICAP (80-100)',
      prize: 'AED 250,000',
      surface: 'Dirt',
      distance: '1400m',
      entries: [
        { num: 1, horse: 'LOGO HUNTER (IRE)', trainer: 'Ali Al Badwawi', jockey: 'Ray Dawson' },
        { num: 2, horse: 'POWER MODE (USA)', trainer: 'Bhupat Seemar', jockey: "Tadhg O'Shea" },
        { num: 3, horse: 'RUN BOY RUN (GB)', trainer: 'Richard Spencer', jockey: 'George Wood' },
        { num: 4, horse: 'DESPERATE HERO (GB)', trainer: 'Salem bin Ghadayer', jockey: 'Bernardo Pinheiro' },
        { num: 5, horse: 'THE MAN (IRE)', trainer: 'Richard Spencer', jockey: 'Saffie Osborne' },
        { num: 6, horse: 'SUBITO (USA)', trainer: 'Bhupat Seemar', jockey: 'Mickael Barzalona' },
        { num: 7, horse: 'FIGHT ZONE (USA)', trainer: 'Abubakar Daud', jockey: 'Kieran Shoemark' },
        { num: 8, horse: 'OLYMPUS POINT (IRE)', trainer: 'Ahmad bin Harmash', jockey: 'Connor Beasley' },
        { num: 9, horse: 'MISS YECHANCE (IRE)', trainer: 'Antonio Cintra & Julio Olascoaga', jockey: 'Silvestre De Sousa' },
        { num: 10, horse: 'DONDE FIRMO (URU)', trainer: 'Antonio Cintra & Julio Olascoaga', jockey: 'Francisco Leandro Goncalves' },
        { num: 11, horse: 'DYONISOS (FR)', trainer: 'Ian Williams', jockey: 'Callum Shepherd' },
        { num: 12, horse: 'MAJOR CINNAMON (USA)', trainer: 'Marwan Al Baidhaei', jockey: 'Adrie de Vries' },
        { num: 13, horse: 'TWILIGHT CALLS (GB)', trainer: 'Richard Spencer', jockey: 'Richard Mullen' },
        { num: 14, horse: 'MADE IN MEXICO (AUS)', trainer: 'Hussain Al Marzooqi', jockey: 'Jules Mobian' }
      ]
    },
    {
      raceNumber: 3,
      time: '18:40',
      name: 'UAE OAKS Sponsored By DEEPAL',
      prize: 'AED 800,000',
      surface: 'Dirt',
      distance: '1900m',
      entries: [
        { num: 1, horse: 'LABWAH (USA)', trainer: 'Salem bin Ghadayer', jockey: 'Bernardo Pinheiro' },
        { num: 2, horse: 'TJAREED (USA)', trainer: 'Antonio Cintra & Julio Olascoaga', jockey: 'Silvestre De Sousa' },
        { num: 3, horse: 'DOZALLA (USA)', trainer: 'Bhupat Seemar', jockey: 'Andrew Slattery' },
        { num: 4, horse: 'YUNO (USA)', trainer: 'Ahmad bin Harmash', jockey: 'Patrick Dobbs' },
        { num: 5, horse: 'PRETTY AND FAMOUS (USA)', trainer: 'Doug Watson', jockey: 'William Buick' },
        { num: 6, horse: 'AUNTIE FAIR (USA)', trainer: 'Bhupat Seemar', jockey: 'Mickael Barzalona' },
        { num: 7, horse: 'DIALED TO DUBAI (USA)', trainer: 'Ahmad bin Harmash', jockey: 'Sam Hitchcott' }
      ]
    },
    {
      raceNumber: 4,
      time: '19:15',
      name: 'Touch The Future',
      prize: 'AED 300,000',
      surface: 'Turf',
      distance: '1800m',
      entries: [
        { num: 1, horse: 'CHIBITTY (FR)', trainer: 'David Simcock', jockey: 'Rossa Ryan' },
        { num: 2, horse: 'DIVIDEND (GB)', trainer: 'Dr Richard Newland & Jamie Insole', jockey: 'Rossa Ryan' },
        { num: 3, horse: 'ACAPULCO BAY (IRE)', trainer: 'Salem bin Ghadayer', jockey: 'Adrie de Vries' },
        { num: 4, horse: 'AL AALI (FR)', trainer: 'Fawzi Nass', jockey: 'Adrie de Vries' },
        { num: 5, horse: 'CLAYMORE (FR)', trainer: 'Jane Chapple-Hyam', jockey: 'Callum Shepherd' },
        { num: 6, horse: 'RAJEKO (IRE)', trainer: 'Michael Bell', jockey: 'Callum Shepherd' },
        { num: 7, horse: 'LANEQASH (GB)', trainer: 'Bhupat Seemar', jockey: "Tadhg O'Shea" },
        { num: 8, horse: "DANTE'S LAD (IRE)", trainer: 'David O Meara', jockey: 'Daniel Tudhope' },
        { num: 10, horse: 'MASAI MOON (GB)', trainer: 'Charlie Appleby', jockey: 'Saffie Osborne' },
        { num: 11, horse: 'SEAN (GER)', trainer: 'Nikoletta Kanitsaridi', jockey: 'Manuel Martinez' },
        { num: 12, horse: 'GREEN TRIANGLE (IRE)', trainer: 'Simon & Ed Crisford', jockey: 'Silvestre De Sousa' },
        { num: 13, horse: 'WAR SOCKS (GB)', trainer: 'Michael Bell', jockey: 'Tom Marquand' },
        { num: 14, horse: 'WILL SCARLET (GB)', trainer: 'Simon & Ed Crisford', jockey: 'Adrie de Vries' }
      ]
    },
    {
      raceNumber: 5,
      time: '19:50',
      name: 'DEEPAL Super Hybrid',
      prize: 'AED 300,000',
      surface: 'Dirt',
      distance: '2000m',
      entries: [
        { num: 1, horse: 'SHOOTOUT (IRE)', trainer: 'Doug Watson', jockey: 'Connor Beasley' },
        { num: 2, horse: 'SHAQ DIESEL (USA)', trainer: 'Bhupat Seemar', jockey: 'Daniel Tudhope' },
        { num: 3, horse: 'KHANJAR (IRE)', trainer: 'Doug Watson', jockey: 'Patrick Dobbs' },
        { num: 4, horse: 'STROBE (USA)', trainer: 'Simon & Ed Crisford', jockey: 'Rebecca Stalhandske' },
        { num: 5, horse: "REBEL'S GAMBLE (IRE)", trainer: 'Doug Watson', jockey: 'Bernardo Pinheiro' },
        { num: 6, horse: 'ZANDVOORT (USA)', trainer: 'Bhupat Seemar', jockey: 'Silvestre De Sousa' },
        { num: 7, horse: 'GENEROUS CZAR (USA)', trainer: 'Doug Watson', jockey: 'William Buick' },
        { num: 8, horse: 'ARMY ETHOS (GB)', trainer: 'Fawzi Nass', jockey: 'Bernardo Pinheiro' },
        { num: 9, horse: 'TAMARKOZ (USA)', trainer: 'Doug Watson', jockey: 'Rossa Ryan' },
        { num: 10, horse: 'GO CHROME GO (ARG)', trainer: 'Antonio Cintra & Julio Olascoaga', jockey: 'Andrew Slattery' }
      ]
    },
    {
      raceNumber: 6,
      time: '20:25',
      name: 'BALANCHINE (Group 2)',
      prize: 'AED 850,000',
      surface: 'Turf',
      distance: '1800m',
      entries: [
        { num: 1, horse: 'DUBAI BEACH (IRE)', trainer: 'Saeed bin Suroor', jockey: 'Oisin Orr' },
        { num: 2, horse: 'DUBAI TREASURE (IRE)', trainer: 'Charlie Appleby', jockey: 'William Buick' },
        { num: 3, horse: 'FAIRY GLEN (FR)', trainer: 'Simon & Ed Crisford', jockey: 'Manuel Martinez' },
        { num: 4, horse: 'VILLANELLE (IRE)', trainer: 'Charlie Appleby', jockey: 'Mickael Barzalona' },
        { num: 5, horse: 'RIYABOVKA (FR)', trainer: 'Nicolas Caullery', jockey: 'William Buick' },
        { num: 6, horse: 'SHUWOOS (IRE)', trainer: 'Charlie Appleby', jockey: "Tadhg O'Shea" },
        { num: 7, horse: 'MISS OF CHANGE (FR)', trainer: 'Miroslav Nieslanik', jockey: "Tadhg O'Shea" }
      ]
    },
    {
      raceNumber: 7,
      time: '21:00',
      name: 'DUBAI ROAD TO THE KENTUCKY DERBY (Listed)',
      prize: 'AED 800,000',
      surface: 'Dirt',
      distance: '1900m',
      entries: [
        { num: 1, horse: 'HUKUM (IRE)', trainer: 'Musabbeh Al Mheiri', jockey: 'Connor Beasley' },
        { num: 2, horse: 'LINO PADRINO (USA)', trainer: 'Bhupat Seemar', jockey: 'Saffie Osborne' },
        { num: 3, horse: 'STAR DESERT (IRE)', trainer: 'Musabbeh Al Mheiri', jockey: 'Rossa Ryan' },
        { num: 4, horse: 'RAAJEHH (USA)', trainer: 'Michael Costa', jockey: 'Adrie de Vries' },
        { num: 5, horse: 'FINAL GESTURE (USA)', trainer: 'Bhupat Seemar', jockey: 'Bernardo Pinheiro' },
        { num: 6, horse: 'OMAHA FRONT (USA)', trainer: 'Bhupat Seemar', jockey: 'William Buick' },
        { num: 7, horse: 'KODIAK KODY (USA)', trainer: 'Bhupat Seemar', jockey: 'Silvestre De Sousa' },
        { num: 8, horse: 'DUKE OF IMMATIN (USA)', trainer: 'Musabbeh Al Mheiri', jockey: 'Rossa Ryan' },
        { num: 9, horse: 'AMBASSADOR (USA)', trainer: 'Bhupat Seemar', jockey: 'Mickael Barzalona' },
        { num: 10, horse: 'BRONZE AKHEE (USA)', trainer: 'Doug Watson', jockey: 'Connor Beasley' },
        { num: 11, horse: 'SENATOR OF STATE (IRE)', trainer: 'Bhupat Seemar', jockey: 'Bernardo Pinheiro' },
        { num: 12, horse: 'IRON MIND (USA)', trainer: 'Michael Costa', jockey: 'Jose Santiago' },
        { num: 13, horse: 'SARY SHAYAN (USA)', trainer: 'Doug Watson', jockey: 'Patrick Dobbs' }
      ]
    },
    {
      raceNumber: 8,
      time: '21:45',
      name: 'NAD AL SHEBA TROPHY (Group 3)',
      prize: 'AED 700,000',
      surface: 'Turf',
      distance: '2800m',
      entries: [
        { num: 1, horse: 'SUNWAY (FR)', trainer: 'David Menuisier', jockey: 'Rossa Ryan' },
        { num: 2, horse: 'DE LAGO MIO (IRE)', trainer: 'Charlie Appleby', jockey: 'William Buick' },
        { num: 3, horse: 'BY THE BOOK (IRE)', trainer: 'Charlie Appleby', jockey: 'Andrew Slattery' },
        { num: 4, horse: 'ELLEMENT (GB)', trainer: 'Charlie Appleby', jockey: 'Mickael Barzalona' },
        { num: 5, horse: 'KIHAVAH (GB)', trainer: 'Adrian Keatley', jockey: 'Tom Marquand' },
        { num: 6, horse: 'SALVATOR MUNDI (GB)', trainer: 'Charlie Appleby', jockey: "Tadhg O'Shea" },
        { num: 7, horse: 'NIGHTWALKER (GB)', trainer: 'Richard Spencer', jockey: 'Bernardo Pinheiro' }
      ]
    }
  ]
};

async function analyzeMeydan() {
  const zai = await ZAI.create();
  
  const prompt = `You are an expert horse racing analyst specializing in UAE racing at Meydan. Analyze the following racecard for 20 February 2026 and provide professional predictions.

RACECARD DATA:
${JSON.stringify(racecard, null, 2)}

For EACH race, provide:
1. Top 3 predictions with confidence percentage
2. Key analysis for the predicted winner
3. Value picks (horses with good odds potential)

Consider:
- Trainer form at Meydan (Appleby, Watson, Seemar, bin Suroor are top trainers)
- Jockey bookings (Buick, O'Shea, De Sousa are top jockeys)
- Surface preferences (Turf vs Dirt)
- Distance suitability
- Race class and prize money

Provide output in Arabic with horse names and analysis. Be specific and professional.

Return a JSON object with this structure:
{
  "napOfTheDay": {"horse": "", "race": 0, "reason": ""},
  "nextBest": {"horse": "", "race": 0, "reason": ""},
  "races": [
    {
      "raceNumber": 0,
      "raceName": "",
      "predictions": [
        {"position": 1, "horse": "", "confidence": "0%", "analysis": ""},
        {"position": 2, "horse": "", "confidence": "0%", "analysis": ""},
        {"position": 3, "horse": "", "confidence": "0%", "analysis": ""}
      ],
      "valuePick": {"horse": "", "reason": ""}
    }
  ]
}`;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are an expert horse racing analyst. Always respond with valid JSON only, no markdown formatting.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3
  });

  const responseText = completion.choices[0]?.message?.content || '';
  console.log(responseText);
  
  // Try to parse as JSON
  try {
    // Remove any markdown code blocks if present
    let cleanResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const predictions = JSON.parse(cleanResponse);
    
    // Save to file
    const fs = await import('fs');
    fs.writeFileSync('/home/z/my-project/download/meydan_predictions_feb20.json', JSON.stringify(predictions, null, 2));
    console.log('\n✅ Predictions saved to meydan_predictions_feb20.json');
  } catch (e) {
    console.log('\nNote: Could not parse as JSON, but analysis is above');
  }
}

analyzeMeydan().catch(console.error);
