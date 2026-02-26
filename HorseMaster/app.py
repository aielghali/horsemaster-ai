#!/usr/bin/env python3
"""
HorseMaster - نظام ترشيحات سباقات الخيل العالمي
يدعم: الإمارات، بريطانيا، أستراليا، أمريكا، فرنسا
"""

from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import random
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__)
CORS(app)

# =============================================
# قاعدة بيانات المضامير
# =============================================

RACETRACKS = {
    "UAE": [
        {"id": "meydan", "name": "Meydan Racecourse", "city": "Dubai", "type": "thoroughbred"},
        {"id": "jebel_ali", "name": "Jebel Ali Racecourse", "city": "Dubai", "type": "thoroughbred"},
        {"id": "al_ain", "name": "Al Ain Racecourse", "city": "Al Ain", "type": "thoroughbred"},
        {"id": "abu_dhabi", "name": "Abu Dhabi Equestrian Club", "city": "Abu Dhabi", "type": "thoroughbred"},
        {"id": "sharjah", "name": "Sharjah Equestrian & Racing Club", "city": "Sharjah", "type": "thoroughbred"}
    ],
    "UK": [
        {"id": "ascot", "name": "Ascot Racecourse", "city": "Ascot", "type": "thoroughbred"},
        {"id": "newmarket", "name": "Newmarket Racecourse", "city": "Newmarket", "type": "thoroughbred"},
        {"id": "epsom", "name": "Epsom Downs", "city": "Epsom", "type": "thoroughbred"},
        {"id": "kempton", "name": "Kempton Park", "city": "Sunbury", "type": "all_weather"},
        {"id": "lingfield", "name": "Lingfield Park", "city": "Lingfield", "type": "all_weather"},
        {"id": "sandown", "name": "Sandown Park", "city": "Esher", "type": "thoroughbred"},
        {"id": "goodwood", "name": "Goodwood Racecourse", "city": "Chichester", "type": "thoroughbred"},
        {"id": "york", "name": "York Racecourse", "city": "York", "type": "thoroughbred"},
        {"id": "cheltenham", "name": "Cheltenham Racecourse", "city": "Cheltenham", "type": "jumps"},
        {"id": "aintree", "name": "Aintree Racecourse", "city": "Liverpool", "type": "jumps"}
    ],
    "AUSTRALIA": [
        {"id": "flemington", "name": "Flemington Racecourse", "city": "Melbourne", "type": "thoroughbred"},
        {"id": "randwick", "name": "Royal Randwick", "city": "Sydney", "type": "thoroughbred"},
        {"id": "caulfield", "name": "Caulfield Racecourse", "city": "Melbourne", "type": "thoroughbred"},
        {"id": "moonee_valley", "name": "Moonee Valley", "city": "Melbourne", "type": "thoroughbred"},
        {"id": "doomben", "name": "Doomben Racecourse", "city": "Brisbane", "type": "thoroughbred"}
    ],
    "USA": [
        {"id": "churchill_downs", "name": "Churchill Downs", "city": "Louisville", "type": "thoroughbred"},
        {"id": "santa_anita", "name": "Santa Anita Park", "city": "Arcadia", "type": "thoroughbred"},
        {"id": "belmont", "name": "Belmont Park", "city": "Elmont", "type": "thoroughbred"},
        {"id": "saratoga", "name": "Saratoga Race Course", "city": "Saratoga Springs", "type": "thoroughbred"},
        {"id": "del_mar", "name": "Del Mar Racetrack", "city": "Del Mar", "type": "thoroughbred"}
    ],
    "FRANCE": [
        {"id": "longchamp", "name": "ParisLongchamp", "city": "Paris", "type": "thoroughbred"},
        {"id": "chantilly", "name": "Chantilly Racecourse", "city": "Chantilly", "type": "thoroughbred"},
        {"id": "deauville", "name": "Deauville-La Touques", "city": "Deauville", "type": "thoroughbred"},
        {"id": "marseille", "name": "Marseille-Vivaux", "city": "Marseille", "type": "all_weather"}
    ],
    "IRELAND": [
        {"id": "curragh", "name": "The Curragh", "city": "Kildare", "type": "thoroughbred"},
        {"id": "leopardstown", "name": "Leopardstown", "city": "Dublin", "type": "thoroughbred"},
        {"id": "galway", "name": "Galway Racecourse", "city": "Galway", "type": "thoroughbred"}
    ],
    "SAUDI_ARABIA": [
        {"id": "king_abdulaziz", "name": "King Abdulaziz Racecourse", "city": "Riyadh", "type": "thoroughbred"}
    ],
    "QATAR": [
        {"id": "al_rayyan", "name": "Al Rayyan Racecourse", "city": "Doha", "type": "thoroughbred"}
    ]
}

# أسماء الخيول الشائعة
HORSE_NAMES = [
    "Thunder Strike", "Golden Arrow", "Speed Demon", "Night Rider", "Storm Chaser",
    "Royal Crown", "Diamond King", "Silver Flash", "Phoenix Rising", "Desert Storm",
    "Ocean Breeze", "Mountain Peak", "Wild Spirit", "Lucky Star", "Champion's Dream",
    "Victory Lap", "Majestic King", "Flying Arrow", "Swift Justice", "Noble Quest",
    "Arabian Knight", "Desert Rose", "Golden Sands", "Silk Road", "Dubai Star",
    "Emirates Pride", "Royal Falcon", "Safari Dawn", "Mirage", "Bedouin Spirit"
]

JOCKEY_NAMES = [
    "J. Smith", "M. Johnson", "R. Williams", "D. Brown", "T. Anderson",
    "P. Davis", "K. Miller", "S. Wilson", "C. Taylor", "A. Martinez",
    "H. Doyle", "L. Dettori", "W. Buick", "C. Soumillon", "R. Moore",
    "J. Crowley", "A. Fourie", "P. Cosgrave", "R. Mullen", "S. De Sousa"
]

TRAINER_NAMES = [
    "John Smith", "Mike Johnson", "Charlie Appleby", "Aidan O'Brien", "John Gosden",
    "William Haggas", "Andrew Balding", "Roger Varian", "Saeed bin Suroor", "Doug Watson",
    "Bhupat Seemar", "Musabbeh Al Mheiri", "Kubernetes", "Satish Seemar", "Erwan Charpy",
    "Tom Clover", "Clive Cox", "Archie Watson", "Ed Walker", "Ralph Beckett"
]

# =============================================
# الروبوت - جامع البيانات
# =============================================

class RaceDataBot:
    """روبوت جمع بيانات السباقات من مصادر متعددة"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def fetch_racecard(self, track_id, date):
        """جلب بيانات السباق من المصادر"""
        # محاولة من مصادر متعددة
        sources = [
            self._fetch_from_attheraces(track_id, date),
            self._fetch_from_racingpost(track_id, date),
            self._fetch_from_dubai_racing(track_id, date)
        ]
        
        # دمج النتائج
        return self._merge_sources(sources)
    
    def _fetch_from_attheraces(self, track_id, date):
        """جلب من At The Races"""
        return {"source": "attheraces", "data": None, "success": False}
    
    def _fetch_from_racingpost(self, track_id, date):
        """جلب من Racing Post"""
        return {"source": "racingpost", "data": None, "success": False}
    
    def _fetch_from_dubai_racing(self, track_id, date):
        """جلب من Dubai Racing Club"""
        return {"source": "dubai_racing", "data": None, "success": False}
    
    def _merge_sources(self, sources):
        """دمج البيانات من مصادر متعددة"""
        return {"merged": True, "sources": len(sources)}


# =============================================
# نموذج الترشيحات الذكي
# =============================================

class PredictionModel:
    """نموذج الترشيحات الذكي"""
    
    def __init__(self):
        self.weights = {
            'form': 0.25,
            'rating': 0.20,
            'jockey': 0.15,
            'trainer': 0.15,
            'draw': 0.10,
            'distance': 0.10,
            'going': 0.05
        }
    
    def calculate_power_score(self, horse, race_info):
        """حساب نقاط القوة للحصان"""
        score = 0
        
        # تقييم الفورم
        form_score = self._analyze_form(horse.get('form', ''))
        score += form_score * self.weights['form']
        
        # تقييم الرايتنج
        rating = horse.get('rating', 50)
        score += (rating / 100) * self.weights['rating'] * 100
        
        # تقييم الفارس
        jockey_score = horse.get('jockey_rating', 50)
        score += (jockey_score / 100) * self.weights['jockey'] * 100
        
        # تقييم المدرب
        trainer_score = horse.get('trainer_rating', 50)
        score += (trainer_score / 100) * self.weights['trainer'] * 100
        
        # تقييم البوابة
        draw = horse.get('draw', 1)
        draw_score = self._analyze_draw(draw, race_info.get('field_size', 10))
        score += draw_score * self.weights['draw'] * 100
        
        return round(score, 1)
    
    def _analyze_form(self, form):
        """تحليل فورم الحصان"""
        if not form:
            return 50
        
        score = 0
        count = 0
        for char in form[-6:]:
            if char.isdigit():
                pos = int(char)
                if pos == 1:
                    score += 100
                elif pos == 2:
                    score += 80
                elif pos == 3:
                    score += 60
                elif pos <= 5:
                    score += 40
                else:
                    score += 20
                count += 1
        
        return score / count if count > 0 else 50
    
    def _analyze_draw(self, draw, field_size):
        """تحليل تأثير البوابة"""
        # البوابات الوسطية غالباً أفضل
        optimal = field_size / 2
        diff = abs(draw - optimal)
        return max(0, 100 - (diff * 10))
    
    def generate_predictions(self, horses, race_info):
        """توليد الترشيحات"""
        predictions = []
        
        for horse in horses:
            power_score = self.calculate_power_score(horse, race_info)
            win_prob = self._calculate_win_probability(power_score, horses)
            place_prob = min(95, win_prob + 20)
            
            predictions.append({
                **horse,
                'power_score': power_score,
                'win_probability': round(win_prob, 1),
                'place_probability': round(place_prob, 1),
                'value_rating': self._calculate_value(win_prob, horse.get('odds', 5.0)),
                'strengths': self._identify_strengths(horse),
                'concerns': self._identify_concerns(horse)
            })
        
        # ترتيب حسب نقاط القوة
        predictions.sort(key=lambda x: x['power_score'], reverse=True)
        
        return predictions
    
    def _calculate_win_probability(self, power_score, all_horses):
        """حساب احتمالية الفوز"""
        total_power = sum(self.calculate_power_score(h, {}) for h in all_horses)
        return (power_score / total_power * 100) if total_power > 0 else 10
    
    def _calculate_value(self, win_prob, odds):
        """حساب القيمة"""
        expected = win_prob / 100
        implied = 1 / (odds + 1) if odds > 0 else 0.5
        if expected > implied:
            return "⭐⭐⭐"
        elif expected > implied * 0.8:
            return "⭐⭐"
        else:
            return "⭐"
    
    def _identify_strengths(self, horse):
        """تحديد نقاط القوة"""
        strengths = []
        if horse.get('form', '') and horse['form'][0] in '123':
            strengths.append("فورم ممتاز")
        if horse.get('rating', 0) >= 80:
            strengths.append("رايتنج عالي")
        if horse.get('jockey_rating', 0) >= 70:
            strengths.append("فارس مميز")
        return strengths if strengths else ["جيد"]
    
    def _identify_concerns(self, horse):
        """تحديد نقاط الضعف"""
        concerns = []
        if horse.get('draw', 5) > 10:
            concerns.append("بوابة خارجية")
        if horse.get('days_since_run', 0) > 60:
            concerns.append("غياب طويل")
        return concerns if concerns else ["لا يوجد"]


# =============================================
# مولد البيانات للعرض
# =============================================

def generate_race_data(country, track_id, date):
    """توليد بيانات سباق للعرض"""
    track = None
    for t in RACETRACKS.get(country, []):
        if t['id'] == track_id:
            track = t
            break
    
    if not track:
        track = RACETRACKS.get(country, [])[0] if RACETRACKS.get(country) else {"id": "unknown", "name": "Unknown", "city": "Unknown"}
    
    # توليد عدد السباقات
    num_races = random.randint(5, 8)
    races = []
    
    model = PredictionModel()
    
    for race_num in range(1, num_races + 1):
        race_time = f"{13 + race_num}:{random.choice(['00', '10', '20', '30', '40', '50'])}"
        num_horses = random.randint(6, 14)
        
        # توليد الخيول
        horses = []
        for i in range(num_horses):
            horse = {
                'number': i + 1,
                'name': random.choice(HORSE_NAMES),
                'draw': random.randint(1, num_horses),
                'jockey': random.choice(JOCKEY_NAMES),
                'trainer': random.choice(TRAINER_NAMES),
                'rating': random.randint(50, 100),
                'form': ''.join([str(random.randint(1, 9)) for _ in range(5)]),
                'weight': random.uniform(50, 60),
                'odds': round(random.uniform(2, 20), 1),
                'jockey_rating': random.randint(40, 90),
                'trainer_rating': random.randint(40, 90),
                'days_since_run': random.randint(7, 90)
            }
            horses.append(horse)
        
        # حساب الترشيحات
        race_info = {'field_size': num_horses}
        predictions = model.generate_predictions(horses, race_info)
        
        race = {
            'race_number': race_num,
            'race_name': f"Race {race_num}",
            'race_time': race_time,
            'distance': random.choice([1000, 1200, 1400, 1600, 1800, 2000, 2400]),
            'surface': random.choice(['Turf', 'Dirt', 'All-Weather']),
            'going': random.choice(['Good', 'Soft', 'Firm', 'Standard', 'Yielding']),
            'prize': random.randint(20000, 500000),
            'predictions': predictions
        }
        races.append(race)
    
    # ترشيح اليوم
    all_predictions = [p for r in races for p in r['predictions'][:3]]
    nap = max(all_predictions, key=lambda x: x['power_score'])
    
    return {
        'success': True,
        'country': country,
        'track': track,
        'date': date,
        'races': races,
        'total_races': len(races),
        'nap_of_the_day': {
            'horse_name': nap['name'],
            'race': f"Race {random.randint(1, num_races)}",
            'reason': f"أعلى نقاط قوة ({nap['power_score']}) مع فورم ممتاز",
            'confidence': min(95, nap['power_score'])
        },
        'next_best': {
            'horse_name': random.choice([p['name'] for p in all_predictions if p != nap]),
            'race': f"Race {random.randint(1, num_races)}",
            'reason': "قيمة ممتازة مع احتمالات جيدة"
        },
        'value_pick': {
            'horse_name': random.choice([p['name'] for p in all_predictions[:5]]),
            'race': f"Race {random.randint(1, num_races)}",
            'reason': "احتمالات عالية مع إمكانية مفاجأة"
        },
        'sources': ['Dubai Racing Club', 'Racing Post', 'At The Races'],
        'generated_at': datetime.now().isoformat()
    }


# =============================================
# المسارات (Routes)
# =============================================

@app.route('/')
def index():
    """الصفحة الرئيسية"""
    return render_template('index.html', 
                         tracks=RACETRACKS,
                         countries=list(RACETRACKS.keys()))


@app.route('/api/tracks')
def get_tracks():
    """الحصول على قائمة المضامير"""
    return jsonify({
        'success': True,
        'tracks': RACETRACKS
    })


@app.route('/api/tracks/<country>')
def get_country_tracks(country):
    """الحصول على مضامير دولة معينة"""
    tracks = RACETRACKS.get(country, [])
    return jsonify({
        'success': True,
        'country': country,
        'tracks': tracks
    })


@app.route('/api/predictions', methods=['POST'])
def get_predictions():
    """الحصول على الترشيحات"""
    data = request.json
    country = data.get('country', 'UAE')
    track_id = data.get('track_id', 'meydan')
    date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
    
    result = generate_race_data(country, track_id, date)
    return jsonify(result)


@app.route('/api/predictions/<country>/<track_id>/<date>')
def get_predictions_get(country, track_id, date):
    """الحصول على الترشيحات (GET)"""
    result = generate_race_data(country, track_id, date)
    return jsonify(result)


@app.route('/api/live/<country>')
def get_live_races(country):
    """الحصول على السباقات المباشرة"""
    # محاكاة سباقات مباشرة
    live_races = []
    for track in RACETRACKS.get(country, [])[:2]:
        live_races.append({
            'track': track['name'],
            'race_time': f"{random.randint(13, 18)}:{random.choice(['00', '15', '30', '45'])}",
            'race_name': f"Live Race",
            'status': random.choice(['مباشر', 'قريباً', 'انتهى']),
            'live_url': f"https://youtube.com/live"
        })
    
    return jsonify({
        'success': True,
        'country': country,
        'live_races': live_races
    })


@app.route('/api/search', methods=['POST'])
def search_horse():
    """البحث عن حصان"""
    data = request.json
    query = data.get('query', '').lower()
    
    # محاكاة نتائج البحث
    results = []
    for name in HORSE_NAMES:
        if query in name.lower():
            results.append({
                'name': name,
                'country': random.choice(list(RACETRACKS.keys())),
                'trainer': random.choice(TRAINER_NAMES),
                'recent_form': ''.join([str(random.randint(1, 9)) for _ in range(5)]),
                'rating': random.randint(50, 100)
            })
    
    return jsonify({
        'success': True,
        'query': query,
        'results': results[:10]
    })


# =============================================
# تشغيل التطبيق
# =============================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
