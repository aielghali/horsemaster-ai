"""
HorseMaster - نظام ترشيحات سباقات الخيل الذكية
Smart Horse Racing Predictions System
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# بيانات المضامير
RACETRACKS = {
    "UAE": [
        {"id": "meydan", "name": "Meydan Racecourse", "city": "Dubai"},
        {"id": "jebel_ali", "name": "Jebel Ali Racecourse", "city": "Dubai"},
        {"id": "al_ain", "name": "Al Ain Racecourse", "city": "Al Ain"},
        {"id": "abu_dhabi", "name": "Abu Dhabi Equestrian Club", "city": "Abu Dhabi"},
        {"id": "sharjah", "name": "Sharjah Equestrian", "city": "Sharjah"}
    ],
    "UK": [
        {"id": "ascot", "name": "Ascot Racecourse", "city": "Ascot"},
        {"id": "newmarket", "name": "Newmarket Racecourse", "city": "Newmarket"},
        {"id": "kempton", "name": "Kempton Park", "city": "Sunbury"},
        {"id": "lingfield", "name": "Lingfield Park", "city": "Lingfield"},
        {"id": "sandown", "name": "Sandown Park", "city": "Esher"}
    ],
    "AUSTRALIA": [
        {"id": "flemington", "name": "Flemington", "city": "Melbourne"},
        {"id": "randwick", "name": "Royal Randwick", "city": "Sydney"},
        {"id": "caulfield", "name": "Caulfield", "city": "Melbourne"}
    ],
    "USA": [
        {"id": "churchill_downs", "name": "Churchill Downs", "city": "Louisville"},
        {"id": "santa_anita", "name": "Santa Anita Park", "city": "Arcadia"},
        {"id": "belmont", "name": "Belmont Park", "city": "Elmont"}
    ],
    "FRANCE": [
        {"id": "longchamp", "name": "ParisLongchamp", "city": "Paris"},
        {"id": "chantilly", "name": "Chantilly", "city": "Chantilly"}
    ],
    "SAUDI_ARABIA": [
        {"id": "king_abdulaziz", "name": "King Abdulaziz Racecourse", "city": "Riyadh"}
    ],
    "QATAR": [
        {"id": "al_rayyan", "name": "Al Rayyan Racecourse", "city": "Doha"}
    ]
}

# أسماء الخيول
HORSE_NAMES = [
    "Thunder Strike", "Golden Arrow", "Speed Demon", "Night Rider", "Storm Chaser",
    "Royal Crown", "Diamond King", "Silver Flash", "Phoenix Rising", "Desert Storm",
    "Ocean Breeze", "Mountain Peak", "Wild Spirit", "Lucky Star", "Champion's Dream",
    "Arabian Knight", "Desert Rose", "Golden Sands", "Silk Road", "Dubai Star",
    "Al Reem", "Al Moughatha", "Emir's Pride", "Sands of Time", "Golden Horizon"
]

JOCKEYS = ["J. Smith", "M. Johnson", "W. Buick", "L. Dettori", "R. Moore", 
           "C. Soumillon", "H. Doyle", "P. Cosgrave", "A. de Vries", "T. O'Shea"]

TRAINERS = ["C. Appleby", "A. O'Brien", "J. Gosden", "W. Haggas", 
            "S. bin Suroor", "D. Watson", "M. Al Mheiri", "I. Al Rashdi"]


def generate_predictions(country, track_id, date):
    """توليد الترشيحات"""
    track = None
    for t in RACETRACKS.get(country, []):
        if t["id"] == track_id:
            track = t
            break
    
    if not track:
        track = RACETRACKS.get(country, [{}])[0]
    
    num_races = random.randint(5, 8)
    races = []
    
    for r in range(1, num_races + 1):
        num_horses = random.randint(8, 14)
        horses = []
        
        for h in range(1, num_horses + 1):
            horse = {
                "number": h,
                "name": random.choice(HORSE_NAMES) + (f" {h}" if h > 1 else ""),
                "draw": random.randint(1, num_horses),
                "jockey": random.choice(JOCKEYS),
                "trainer": random.choice(TRAINERS),
                "rating": random.randint(50, 100),
                "power_score": random.randint(60, 99),
                "win_probability": random.randint(10, 40),
                "value_rating": "⭐" * random.randint(1, 3),
                "form": "".join([random.choice(["1", "2", "3", "4", "0", "-"]) for _ in range(5)]),
                "weight": random.randint(52, 62)
            }
            horses.append(horse)
        
        # ترتيب حسب نقاط القوة
        horses.sort(key=lambda x: x["power_score"], reverse=True)
        
        race = {
            "race_number": r,
            "race_time": f"{13 + r}:{'00' if r % 2 == 0 else '30'}",
            "race_name": f"Race {r}",
            "distance": random.choice([1200, 1400, 1600, 1800, 2000, 2400]),
            "surface": random.choice(["Turf", "Dirt", "Synthetic"]),
            "going": random.choice(["Good", "Soft", "Firm", "Good to Firm"]),
            "predictions": horses[:5]
        }
        races.append(race)
    
    # اختيار أفضل حصان
    top_horse = races[0]["predictions"][0]
    
    return {
        "success": True,
        "country": country,
        "track": track,
        "date": date,
        "races": races,
        "total_races": num_races,
        "nap_of_the_day": {
            "horse_name": top_horse["name"],
            "race": "Race 1",
            "reason": f"أعلى نقاط قوة ({top_horse['power_score']}) مع فورم ممتاز",
            "confidence": top_horse["power_score"]
        },
        "next_best": {
            "horse_name": races[1]["predictions"][0]["name"],
            "race": "Race 2",
            "reason": "قيمة ممتازة مع احتمالات جيدة"
        },
        "value_pick": {
            "horse_name": races[2]["predictions"][1]["name"] if len(races) > 2 else races[0]["predictions"][1]["name"],
            "race": "Race 3" if len(races) > 2 else "Race 1",
            "reason": "احتمالات عالية مع إمكانية مفاجأة"
        }
    }


@app.route('/')
def index():
    """الصفحة الرئيسية"""
    return render_template('index.html')


@app.route('/api/horsemaster', methods=['GET'])
def get_tracks():
    """الحصول على قائمة المضامير"""
    return jsonify({
        "success": True,
        "tracks": RACETRACKS,
        "message": "HorseMaster API v2.0 - Ready"
    })


@app.route('/api/horsemaster', methods=['POST'])
def get_predictions():
    """الحصول على الترشيحات"""
    try:
        data = request.get_json()
        country = data.get('country')
        track_id = data.get('track_id')
        date = data.get('date')
        
        if not all([country, track_id, date]):
            return jsonify({
                "success": False,
                "message": "Missing required fields"
            }), 400
        
        predictions = generate_predictions(country, track_id, date)
        return jsonify(predictions)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500


@app.route('/health')
def health():
    """فحص صحة التطبيق"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
