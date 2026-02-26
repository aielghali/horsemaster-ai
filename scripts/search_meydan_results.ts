import ZAI from 'z-ai-web-dev-sdk';

async function searchMeydanResults() {
  try {
    console.log('Searching for Meydan race results...');
    const zai = await ZAI.create();
    
    const results = await zai.functions.invoke('web_search', {
      query: 'Meydan race results 2025 February emiratesracing.com horses winners jockeys trainers',
      num: 10
    });
    
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

searchMeydanResults();
