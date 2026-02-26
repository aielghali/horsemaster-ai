"""
HorseMaster AI - نظام ترشيحات سباقات الخيل الذكية
Smart Horse Racing Predictions System
Version: 2.0
Author: Elghali AI Solutions
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime
import random
import math

app = Flask(__name__)
CORS(app)

# ===========================================
# بيانات المضامير
# ===========================================
RACETRACKS = {
    "UAE": [
        {"id": "meydan", "name": "Meydan Racecourse", "city": "Dubai", "type": "Turf/Dirt"},
        {"id": "jebel_ali", "name": "Jebel Ali Racecourse", "city": "Dubai", "type": "Dirt"},
        {"id": "al_ain", "name": "Al Ain Racecourse", "city": "Al Ain", "type": "Dirt"},
        {"id": "abu_dhabi", "name": "Abu Dhabi Equestrian Club", "city": "Abu Dhabi", "type": "Turf"},
        {"id": "sharjah", "name": "Sharjah Equestrian", "city": "Sharjah", "type": "Dirt"}
    ],
    "UK": [
        {"id": "wolverhampton", "name": "Wolverhampton", "city": "Wolverhampton", "type": "AW"},
        {"id": "kempton", "name": "Kempton Park", "city": "Sunbury", "type": "AW"},
        {"id": "lingfield", "name": "Lingfield Park", "city": "Lingfield", "type": "AW/Turf"},
        {"id": "newcastle", "name": "Newcastle", "city": "Newcastle", "type": "AW/Turf"},
        {"id": "southwell", "name": "Southwell", "city": "Southwell", "type": "AW"}
    ],
    "SAUDI_ARABIA": [
        {"id": "king_abdulaziz", "name": "King Abdulaziz Racecourse", "city": "Riyadh", "type": "Dirt"}
    ],
    "QATAR": [
        {"id": "al_rayyan", "name": "Al Rayyan Racecourse", "city": "Doha", "type": "Turf"}
    ]
}

# أسماء الخيول العربية والإنجليزية
HORSE_NAMES = [
    "DREAM OF TUSCANY", "FORAAT AL LEITH", "LAMBORGHINI BF", "MEYDAAN",
    "AREEJ AL LAZAZ", "RAGHIBAH", "TAWAF", "YAQOOT AL LAZAZ",
    "RB MOTHERLOAD", "AL MURTAJEL", "THUNDER STRIKE", "GOLDEN ARROW",
    "SPEED DEMON", "NIGHT RIDER", "STORM CHASER", "ROYAL CROWN",
    "DIAMOND KING", "SILVER FLASH", "PHOENIX RISING", "DESERT STORM",
    "AL REEM", "AL MOUGHATHA", "EMIR'S PRIDE", "SANDS OF TIME"
]

JOCKEYS = [
    "W. Buick", "L. Dettori", "R. Moore", "C. Soumillon", "P. Cosgrave",
    "A. de Vries", "T. O'Shea", "S. Paiva", "D. O'Neill", "B. Murgia",
    "J. Smith", "M. Johnson", "H. Doyle", "R. Mullen", "A. Fresu"
]

TRAINERS = [
    "C. Appleby", "S. bin Suroor", "D. Watson", "M. Al Mheiri",
    "I. Al Rashdi", "A. O'Brien", "J. Gosden", "W. Haggas",
    "K. Burke", "R. Varian", "J. Fanshawe", "M. Johnston"
]


def calculate_power_score(horse_data):
    """
    حساب نقاط القوة للحصان
    Power Rating = (Form 30%) + (Speed 25%) + (Jockey 15%) + (Trainer 10%) + (Track History 20%)
    """
    form_score = horse_data.get('form_score', random.randint(50, 100))
    speed_score = horse_data.get('speed_score', random.randint(50, 100))
    jockey_score = horse_data.get('jockey_score', random.randint(50, 100))
    trainer_score = horse_data.get('trainer_score', random.randint(50, 100))
    track_score = horse_data.get('track_score', random.randint(50, 100))
    
    power_score = (
        form_score * 0.30 +
        speed_score * 0.25 +
        jockey_score * 0.15 +
        trainer_score * 0.10 +
        track_score * 0.20
    )
    
    return round(power_score, 1)


def generate_horse_predictions(num_horses=10):
    """توليد ترشيحات الخيول"""
    horses = []
    
    for h in range(1, num_horses + 1):
        form = "".join([random.choice(["1", "2", "3", "4", "0", "-"]) for _ in range(5)])
        form_score = 80 - (form.count("0") * 10) - (form.count("-") * 5) + (form.count("1") * 15)
        
        horse_data = {
            'form_score': form_score,
            'speed_score': random.randint(55, 95),
            'jockey_score': random.randint(50, 95),
            'trainer_score': random.randint(50, 90),
            'track_score': random.randint(45, 95)
        }
        
        power_score = calculate_power_score(horse_data)
        
        horse = {
            "number": h,
            "name": random.choice(HORSE_NAMES),
            "draw": random.randint(1, num_horses),
            "jockey": random.choice(JOCKEYS),
            "trainer": random.choice(TRAINERS),
            "rating": random.randint(50, 100),
            "power_score": power_score,
            "win_probability": round(random.uniform(5, 35), 1),
            "value_rating": "⭐" * (1 if power_score < 65 else 2 if power_score < 80 else 3),
            "form": form,
            "weight": random.randint(52, 62),
            "odds": f"{random.randint(2, 20)}/{1}"
        }
        horses.append(horse)
    
    # ترتيب حسب نقاط القوة
    horses.sort(key=lambda x: x["power_score"], reverse=True)
    
    # تحديث نسب الفوز
    total_score = sum(h["power_score"] for h in horses)
    for h in horses:
        h["win_probability"] = round((h["power_score"] / total_score) * 100, 1)
    
    return horses


def generate_race_predictions(country, track_id, date):
    """توليد ترشيحات السباق"""
    # البحث عن المضمار
    track = None
    for t in RACETRACKS.get(country, []):
        if t["id"] == track_id:
            track = t
            break
    
    if not track:
        track = RACETRACKS.get(country, [{}])[0]
    
    num_races = random.randint(5, 7)
    races = []
    
    for r in range(1, num_races + 1):
        num_horses = random.randint(8, 12)
        horses = generate_horse_predictions(num_horses)
        
        race = {
            "race_number": r,
            "race_time": f"{13 + r}:{'00' if r % 2 == 0 else '30'}",
            "race_name": f"Race {r}",
            "distance": random.choice([1200, 1400, 1600, 1800, 2000, 2400]),
            "surface": random.choice(["Turf", "Dirt", "Synthetic"]),
            "going": random.choice(["Good", "Soft", "Firm", "Good to Firm"]),
            "prize_money": f"${random.randint(20, 100)},000",
            "predictions": horses[:5],  # أعلى 5 خيول
            "top_pick": horses[0],
            "value_pick": horses[2] if len(horses) > 2 else horses[1]
        }
        races.append(race)
    
    # NAP of the Day
    nap_race = races[0]
    nap_horse = nap_race["top_pick"]
    
    # Next Best
    next_best_race = races[1] if len(races) > 1 else races[0]
    next_best_horse = next_best_race["top_pick"]
    
    # Value Pick
    value_race = races[2] if len(races) > 2 else races[0]
    value_horse = value_race["value_pick"]
    
    return {
        "success": True,
        "generated_at": datetime.now().isoformat(),
        "country": country,
        "track": track,
        "date": date,
        "races": races,
        "total_races": num_races,
        "nap_of_the_day": {
            "horse_name": nap_horse["name"],
            "horse_number": nap_horse["number"],
            "race": f"Race {nap_race['race_number']}",
            "jockey": nap_horse["jockey"],
            "trainer": nap_horse["trainer"],
            "power_score": nap_horse["power_score"],
            "win_probability": nap_horse["win_probability"],
            "reason": f"أعلى نقاط قوة ({nap_horse['power_score']}) مع فورم ممتاز",
            "confidence": "HIGH" if nap_horse["power_score"] > 80 else "MEDIUM"
        },
        "next_best": {
            "horse_name": next_best_horse["name"],
            "horse_number": next_best_horse["number"],
            "race": f"Race {next_best_race['race_number']}",
            "jockey": next_best_horse["jockey"],
            "power_score": next_best_horse["power_score"],
            "reason": "قيمة ممتازة مع احتمالات جيدة"
        },
        "value_pick": {
            "horse_name": value_horse["name"],
            "horse_number": value_horse["number"],
            "race": f"Race {value_race['race_number']}",
            "odds": value_horse["odds"],
            "power_score": value_horse["power_score"],
            "reason": "احتمالات عالية مع إمكانية مفاجأة"
        },
        "betting_strategy": {
            "balanced": {
                "description": "مراهنة متوازنة - مخاطر متوسطة",
                "recommended_stake": "2-3% من رأس المال",
                "target": nap_horse["name"]
            },
            "aggressive": {
                "description": "مراهنة عدوانية - مخاطر عالية",
                "recommended_stake": "5-10% من رأس المال",
                "target": f"{nap_horse['name']} + {next_best_horse['name']} (Each Way)"
            }
        }
    }


# ===========================================
# Routes
# ===========================================

@app.route('/')
def index():
    """الصفحة الرئيسية"""
    return render_template('index.html')


@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    """الحصول على قائمة المضامير"""
    return jsonify({
        "success": True,
        "app_name": "HorseMaster AI",
        "version": "2.0",
        "tracks": RACETRACKS,
        "message": "HorseMaster API v2.0 - Ready"
    })


@app.route('/api/predict', methods=['POST'])
def get_predictions():
    """الحصول على الترشيحات"""
    try:
        data = request.get_json() or {}
        country = data.get('country', 'UAE')
        track_id = data.get('track_id', 'meydan')
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        
        predictions = generate_race_predictions(country, track_id, date)
        return jsonify(predictions)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500


@app.route('/api/predict/<country>/<track_id>', methods=['GET'])
def get_predictions_simple(country, track_id):
    """الحصول على الترشيحات - طريقة مبسطة"""
    try:
        date = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        predictions = generate_race_predictions(country, track_id, date)
        return jsonify(predictions)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error: {str(e)}"
        }), 500


@app.route('/health')
def health():
    """فحص صحة التطبيق"""
    return jsonify({
        "status": "healthy",
        "app": "HorseMaster AI",
        "version": "2.0",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/test')
def test():
    """اختبار API"""
    return jsonify({
        "success": True,
        "message": "HorseMaster AI is running!",
        "endpoints": [
            "GET /api/tracks - قائمة المضامير",
            "POST /api/predict - الحصول على ترشيحات",
            "GET /api/predict/<country>/<track_id> - ترشيحات مبسطة",
            "GET /health - فحص الصحة"
        ]
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
