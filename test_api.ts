import { fetchRealRaceData, generatePredictionsFromRealData } from './src/lib/real-race-fetcher'

async function testAPI() {
  try {
    console.log('=== Testing Real Race Data Fetcher ===\n')
    
    // Test with Al Ain 22 Feb 2026
    console.log('Fetching Al Ain races for 2026-02-22...\n')
    const raceDay = await fetchRealRaceData('Al Ain', '2026-02-22')
    
    if (!raceDay) {
      console.log('No race data found!')
      return
    }
    
    console.log(`Racecourse: ${raceDay.racecourse}`)
    console.log(`Country: ${raceDay.country}`)
    console.log(`Date: ${raceDay.date}`)
    console.log(`Number of races: ${raceDay.races.length}`)
    console.log(`Sources: ${raceDay.sources.slice(0, 3).join(', ')}`)
    
    console.log('\n=== Races Summary ===')
    for (const race of raceDay.races) {
      console.log(`\nRace ${race.number}: ${race.name}`)
      console.log(`  Time: ${race.time || 'N/A'}, Distance: ${race.distance}m, Surface: ${race.surface}`)
      console.log(`  Horses: ${race.horses.length}`)
      if (race.horses.length > 0) {
        console.log(`  First 3 horses:`)
        for (const horse of race.horses.slice(0, 3)) {
          console.log(`    #${horse.number} ${horse.name} (Draw: ${horse.draw}) - Jockey: ${horse.jockey}, Trainer: ${horse.trainer}`)
        }
      }
    }
    
    console.log('\n=== Generating Predictions ===\n')
    const predictions = await generatePredictionsFromRealData(raceDay)
    
    console.log(`NAP of the Day: ${predictions.napOfTheDay.horseName}`)
    console.log(`  Race: ${predictions.napOfTheDay.raceName}`)
    console.log(`  Confidence: ${predictions.napOfTheDay.confidence}%`)
    console.log(`  Reason: ${predictions.napOfTheDay.reason}`)
    
    console.log('\n=== SUCCESS! Real data is working! ===')
    
  } catch (error: any) {
    console.error('Error:', error.message)
  }
}

testAPI()
