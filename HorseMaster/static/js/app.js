/**
 * HorseMaster - Application JavaScript
 */

// =============================================
// Global State
// =============================================

const state = {
    lang: 'ar',
    countries: {},
    selectedCountry: null,
    selectedTrack: null,
    selectedDate: null,
    predictions: null
};

// =============================================
// DOM Elements
// =============================================

const elements = {
    countrySelect: document.getElementById('countrySelect'),
    trackSelect: document.getElementById('trackSelect'),
    dateInput: document.getElementById('dateInput'),
    getPredictionsBtn: document.getElementById('getPredictions'),
    loading: document.getElementById('loading'),
    results: document.getElementById('results'),
    newSearchBtn: document.getElementById('newSearch'),
    langToggle: document.getElementById('langToggle'),
    // Results elements
    trackName: document.getElementById('trackName'),
    resultsDate: document.getElementById('resultsDate'),
    totalRaces: document.getElementById('totalRaces'),
    napHorse: document.getElementById('napHorse'),
    napRace: document.getElementById('napRace'),
    napReason: document.getElementById('napReason'),
    napConfidence: document.getElementById('napConfidence'),
    confidenceProgress: document.getElementById('confidenceProgress'),
    nextBestHorse: document.getElementById('nextBestHorse'),
    nextBestRace: document.getElementById('nextBestRace'),
    nextBestReason: document.getElementById('nextBestReason'),
    valuePickHorse: document.getElementById('valuePickHorse'),
    valuePickRace: document.getElementById('valuePickRace'),
    valuePickReason: document.getElementById('valuePickReason'),
    raceTabs: document.getElementById('raceTabs'),
    raceContent: document.getElementById('raceContent')
};

// =============================================
// Country Names
// =============================================

const countryNames = {
    ar: {
        'UAE': 'الإمارات',
        'UK': 'بريطانيا',
        'AUSTRALIA': 'أستراليا',
        'USA': 'أمريكا',
        'FRANCE': 'فرنسا',
        'IRELAND': 'أيرلندا',
        'SAUDI_ARABIA': 'السعودية',
        'QATAR': 'قطر'
    },
    en: {
        'UAE': 'UAE',
        'UK': 'UK',
        'AUSTRALIA': 'Australia',
        'USA': 'USA',
        'FRANCE': 'France',
        'IRELAND': 'Ireland',
        'SAUDI_ARABIA': 'Saudi Arabia',
        'QATAR': 'Qatar'
    }
};

const countryFlags = {
    'UAE': '🇦🇪',
    'UK': '🇬🇧',
    'AUSTRALIA': '🇦🇺',
    'USA': '🇺🇸',
    'FRANCE': '🇫🇷',
    'IRELAND': '🇮🇪',
    'SAUDI_ARABIA': '🇸🇦',
    'QATAR': '🇶🇦'
};

// =============================================
// Initialization
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    elements.dateInput.value = today;
    state.selectedDate = today;

    // Fetch tracks
    fetchTracks();

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    elements.countrySelect.addEventListener('change', handleCountryChange);
    elements.trackSelect.addEventListener('change', handleTrackChange);
    elements.dateInput.addEventListener('change', handleDateChange);
    elements.getPredictionsBtn.addEventListener('click', fetchPredictions);
    elements.newSearchBtn.addEventListener('click', resetSearch);
    elements.langToggle.addEventListener('click', toggleLanguage);
}

// =============================================
// API Calls
// =============================================

async function fetchTracks() {
    try {
        const response = await fetch('/api/tracks');
        const data = await response.json();
        
        if (data.success) {
            state.countries = data.tracks;
            populateCountries();
        }
    } catch (error) {
        console.error('Error fetching tracks:', error);
    }
}

async function fetchPredictions() {
    if (!state.selectedCountry || !state.selectedTrack || !state.selectedDate) {
        alert('الرجاء اختيار الدولة والمضمار والتاريخ');
        return;
    }

    // Show loading
    elements.loading.classList.remove('hidden');
    elements.results.classList.add('hidden');

    try {
        const response = await fetch('/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: state.selectedCountry,
                track_id: state.selectedTrack,
                date: state.selectedDate
            })
        });

        const data = await response.json();
        
        if (data.success) {
            state.predictions = data;
            displayResults(data);
        } else {
            alert('حدث خطأ في جلب البيانات');
        }
    } catch (error) {
        console.error('Error fetching predictions:', error);
        alert('حدث خطأ في الاتصال');
    } finally {
        elements.loading.classList.add('hidden');
    }
}

// =============================================
// UI Functions
// =============================================

function populateCountries() {
    elements.countrySelect.innerHTML = '<option value="">اختر الدولة</option>';
    
    Object.keys(state.countries).forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = `${countryFlags[country] || '🏁'} ${countryNames.ar[country] || country}`;
        elements.countrySelect.appendChild(option);
    });
}

function handleCountryChange(e) {
    const country = e.target.value;
    state.selectedCountry = country;
    
    if (country && state.countries[country]) {
        populateTracks(country);
        elements.trackSelect.disabled = false;
    } else {
        elements.trackSelect.disabled = true;
        elements.trackSelect.innerHTML = '<option value="">اختر المضمار</option>';
    }
    
    updateButtonState();
}

function populateTracks(country) {
    const tracks = state.countries[country] || [];
    elements.trackSelect.innerHTML = '<option value="">اختر المضمار</option>';
    
    tracks.forEach(track => {
        const option = document.createElement('option');
        option.value = track.id;
        option.textContent = `${track.name} - ${track.city}`;
        elements.trackSelect.appendChild(option);
    });
}

function handleTrackChange(e) {
    state.selectedTrack = e.target.value;
    updateButtonState();
}

function handleDateChange(e) {
    state.selectedDate = e.target.value;
    updateButtonState();
}

function updateButtonState() {
    const isValid = state.selectedCountry && state.selectedTrack && state.selectedDate;
    elements.getPredictionsBtn.disabled = !isValid;
}

function displayResults(data) {
    // Update header
    elements.trackName.textContent = data.track.name;
    elements.resultsDate.textContent = data.date;
    elements.totalRaces.textContent = `${data.total_races} سباقات`;

    // Update NAP
    elements.napHorse.textContent = data.nap_of_the_day.horse_name;
    elements.napRace.textContent = data.nap_of_the_day.race;
    elements.napReason.textContent = data.nap_of_the_day.reason;
    elements.napConfidence.textContent = `${data.nap_of_the_day.confidence}%`;
    elements.confidenceProgress.style.width = `${data.nap_of_the_day.confidence}%`;

    // Update quick picks
    elements.nextBestHorse.textContent = data.next_best.horse_name;
    elements.nextBestRace.textContent = data.next_best.race;
    elements.nextBestReason.textContent = data.next_best.reason;

    elements.valuePickHorse.textContent = data.value_pick.horse_name;
    elements.valuePickRace.textContent = data.value_pick.race;
    elements.valuePickReason.textContent = data.value_pick.reason;

    // Create race tabs
    createRaceTabs(data.races);

    // Show results
    elements.results.classList.remove('hidden');
}

function createRaceTabs(races) {
    elements.raceTabs.innerHTML = '';
    
    races.forEach((race, index) => {
        const tab = document.createElement('button');
        tab.className = `race-tab ${index === 0 ? 'active' : ''}`;
        tab.innerHTML = `<i class="fas fa-clock"></i> ${race.race_time}`;
        tab.onclick = () => selectRaceTab(index);
        elements.raceTabs.appendChild(tab);
    });

    // Show first race
    selectRaceTab(0);
}

function selectRaceTab(index) {
    // Update tab styles
    const tabs = elements.raceTabs.querySelectorAll('.race-tab');
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    // Display race content
    displayRaceContent(state.predictions.races[index]);
}

function displayRaceContent(race) {
    const html = `
        <div class="race-info mb-20">
            <h4>${race.race_name}</h4>
            <p>
                <span class="badge">${race.distance}م</span>
                <span class="badge">${race.surface}</span>
                <span class="badge">${race.going}</span>
            </p>
        </div>
        <div class="table-responsive">
            <table class="predictions-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>رقم</th>
                        <th>الحصان</th>
                        <th>البوابة</th>
                        <th>الفارس</th>
                        <th>المدرب</th>
                        <th>الرايتنج</th>
                        <th>القوة</th>
                        <th>الفوز%</th>
                        <th>القيمة</th>
                    </tr>
                </thead>
                <tbody>
                    ${race.predictions.slice(0, 5).map((horse, i) => `
                        <tr>
                            <td>
                                <span class="position-badge position-${i + 1}">${i + 1}</span>
                            </td>
                            <td><strong>${horse.number}</strong></td>
                            <td class="horse-name-cell">${horse.name}</td>
                            <td>${horse.draw}</td>
                            <td>${horse.jockey}</td>
                            <td>${horse.trainer}</td>
                            <td>${horse.rating}</td>
                            <td><span class="power-score">${horse.power_score}</span></td>
                            <td>${horse.win_probability}%</td>
                            <td class="value-stars">${horse.value_rating}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="horse-analysis mt-20">
            <h4><i class="fas fa-info-circle"></i> تحليل الترشيح الأول</h4>
            <div class="analysis-content">
                <p><strong>نقاط القوة:</strong> ${race.predictions[0].strengths.join(' - ')}</p>
                <p><strong>نقاط الضعف:</strong> ${race.predictions[0].concerns.join(' - ')}</p>
            </div>
        </div>
    `;
    
    elements.raceContent.innerHTML = html;
}

function resetSearch() {
    state.selectedCountry = null;
    state.selectedTrack = null;
    state.predictions = null;
    
    elements.countrySelect.value = '';
    elements.trackSelect.value = '';
    elements.trackSelect.disabled = true;
    elements.getPredictionsBtn.disabled = true;
    elements.results.classList.add('hidden');
}

function toggleLanguage() {
    state.lang = state.lang === 'ar' ? 'en' : 'ar';
    const isArabic = state.lang === 'ar';
    
    // Update HTML attributes
    document.documentElement.lang = state.lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    
    // Update button text
    elements.langToggle.innerHTML = `<i class="fas fa-globe"></i> ${isArabic ? 'English' : 'العربية'}`;
    
    // Re-populate countries with new language
    populateCountries();
}

// =============================================
// Utility Functions
// =============================================

function formatDistance(meters) {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)}كم`;
    }
    return `${meters}م`;
}

function formatTime(time) {
    return time;
}
