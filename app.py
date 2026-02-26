"""
HorseMaster AI - نظام ترشيحات سباقات الخيل الذكية
Version: 3.0 - Ultra Fast
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import random
from datetime import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# المضامير المتاحة
RACETRACKS = {
    "UAE": [
        {"id": "meydan", "name": "Meydan", "city": "Dubai"},
        {"id": "jebel_ali", "name": "Jebel Ali", "city": "Dubai"},
        {"id": "al_ain", "name": "Al Ain", "city": "Al Ain"},
        {"id": "abu_dhabi", "name": "Abu Dhabi", "city": "Abu Dhabi"},
        {"id": "sharjah", "name": "Sharjah", "city": "Sharjah"}
    ],
    "UK": [
        {"id": "wolverhampton", "name": "Wolverhampton", "city": "Wolverhampton"},
        {"id": "kempton", "name": "Kempton", "city": "Kempton"},
        {"id": "lingfield", "name": "Lingfield", "city": "Lingfield"},
        {"id": "newcastle", "name": "Newcastle", "city": "Newcastle"},
        {"id": "southwell", "name": "Southwell", "city": "Southwell"}
    ]
}

HORSES = [
    "DREAM OF TUSCANY", "FORAAT AL LEITH", "LAMBORGHINI BF", "MEYDAAN",
    "AREEJ AL LAZAZ", "RAGHIBAH", "TAWAF", "YAQOOT AL LAZAZ",
    "RB MOTHERLOAD", "AL MURTAJEL", "THUNDER STRIKE", "GOLDEN ARROW"
]

JOCKEYS = ["W. Buick", "L. Dettori", "R. Moore", "C. Soumillon", "P. Cosgrave"]

def generate_race():
    """توليد سباق واحد"""
    horses = []
    for i in range(1, 6):
        horses.append({
            "number": i,
            "name": random.choice(HORSES),
            "jockey": random.choice(JOCKEYS),
            "draw": random.randint(1, 12),
            "rating": 70 + random.randint(0, 25),
            "powerScore": 75 + random.randint(0, 20) - i * 3,
            "winProbability": max(5, 35 - i * 5),
            "valueRating": "Excellent" if i == 1 else "Good" if i == 2 else "Fair"
        })
    return horses

@app.route('/')
def index():
    return '''
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐎 HorseMaster AI</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cairo', sans-serif; background: linear-gradient(135deg, #1a1a2e, #0f3460); min-height: 100vh; color: #fff; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 15px; margin-bottom: 20px; }
        .header h1 { font-size: 2rem; background: linear-gradient(90deg, #ffd700, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .control-group { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; }
        .control-group label { display: block; margin-bottom: 8px; color: #ffd700; font-size: 0.9rem; }
        .control-group select, .control-group input { width: 100%; padding: 10px; border: 2px solid rgba(255,215,0,0.3); border-radius: 8px; background: rgba(0,0,0,0.3); color: #fff; font-family: inherit; }
        .btn { width: 100%; padding: 15px; background: linear-gradient(90deg, #ffd700, #ff6b6b); border: none; border-radius: 10px; color: #000; font-size: 1.1rem; font-weight: 700; cursor: pointer; }
        .btn:hover { opacity: 0.9; }
        .results { display: none; margin-top: 20px; }
        .results.active { display: block; }
        .nap { background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,107,107,0.2)); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center; }
        .nap h2 { color: #ffd700; margin-bottom: 15px; }
        .nap .horse { font-size: 1.5rem; font-weight: 700; }
        .race-card { background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 15px; overflow: hidden; }
        .race-header { background: rgba(255,215,0,0.1); padding: 12px 15px; display: flex; justify-content: space-between; }
        .race-header h3 { color: #ffd700; }
        table { width: 100%; border-collapse: collapse; }
        th { background: rgba(255,215,0,0.1); padding: 8px; text-align: right; color: #ffd700; font-size: 0.85rem; }
        td { padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; }
        tr:nth-child(1) td { background: rgba(255,215,0,0.1); }
        .loading { text-align: center; padding: 30px; display: none; }
        .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,215,0,0.3); border-top-color: #ffd700; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .footer { text-align: center; padding: 20px; color: #666; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐎 HorseMaster AI</h1>
            <p>ترشيحات سباقات الخيل الذكية</p>
        </div>
        <div class="controls">
            <div class="control-group">
                <label>🌍 الدولة</label>
                <select id="country" onchange="updateTracks()">
                    <option value="UAE">الإمارات 🇦🇪</option>
                    <option value="UK">بريطانيا 🇬🇧</option>
                </select>
            </div>
            <div class="control-group">
                <label>🏇 المضمار</label>
                <select id="track"></select>
            </div>
            <div class="control-group">
                <label>📅 التاريخ</label>
                <input type="date" id="date">
            </div>
            <div class="control-group" style="display: flex; align-items: flex-end;">
                <button class="btn" onclick="getPredictions()">🔍 تحليل</button>
            </div>
        </div>
        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>جاري التحليل...</p>
        </div>
        <div id="results" class="results">
            <div class="nap">
                <h2>🏆 ترشيح اليوم</h2>
                <div id="napHorse" class="horse">-</div>
                <div id="napDetails" style="color: #888; margin-top: 10px;">-</div>
            </div>
            <div id="races"></div>
        </div>
        <div class="footer">
            <p>© 2026 Elghali AI - HorseMaster AI v3.0</p>
        </div>
    </div>
    <script>
        const tracks = {
            'UAE': [{id:'meydan',name:'Meydan'},{id:'jebel_ali',name:'Jebel Ali'},{id:'al_ain',name:'Al Ain'},{id:'abu_dhabi',name:'Abu Dhabi'},{id:'sharjah',name:'Sharjah'}],
            'UK': [{id:'wolverhampton',name:'Wolverhampton'},{id:'kempton',name:'Kempton'},{id:'lingfield',name:'Lingfield'},{id:'newcastle',name:'Newcastle'},{id:'southwell',name:'Southwell'}]
        };
        document.getElementById('date').valueAsDate = new Date();
        function updateTracks() {
            const country = document.getElementById('country').value;
            const trackSelect = document.getElementById('track');
            trackSelect.innerHTML = tracks[country].map(t => '<option value="'+t.id+'">'+t.name+'</option>').join('');
        }
        updateTracks();
        async function getPredictions() {
            const country = document.getElementById('country').value;
            const trackId = document.getElementById('track').value;
            const date = document.getElementById('date').value;
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').classList.remove('active');
            try {
                const res = await fetch('/api/predict', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({country, track_id: trackId, date})
                });
                const data = await res.json();
                document.getElementById('napHorse').textContent = data.nap.name;
                document.getElementById('napDetails').textContent = data.nap.race + ' | ' + data.nap.jockey + ' | ' + data.nap.powerScore + ' نقطة';
                document.getElementById('races').innerHTML = data.races.map(r => 
                    '<div class="race-card"><div class="race-header"><h3>'+r.name+'</h3><span>'+r.time+'</span></div><table><thead><tr><th>#</th><th>الحصان</th><th>الفارس</th><th>القوة</th><th>%</th></tr></thead><tbody>' +
                    r.predictions.map((h,i) => '<tr><td>'+(i+1)+'</td><td>'+h.name+'</td><td>'+h.jockey+'</td><td>'+h.powerScore+'</td><td>'+h.winProbability+'%</td></tr>').join('') +
                    '</tbody></table></div>'
                ).join('');
                document.getElementById('results').classList.add('active');
            } catch(e) {
                alert('خطأ في الاتصال');
            }
            document.getElementById('loading').style.display = 'none';
        }
    </script>
</body>
</html>
'''

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "version": "3.0", "time": datetime.now().isoformat()})

@app.route('/api/tracks')
def api_tracks():
    return jsonify({"success": True, "tracks": RACETRACKS})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json() or {}
        country = data.get('country', 'UAE')
        track_id = data.get('track_id', 'meydan')
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        
        # توليد السباقات
        races = []
        for i in range(1, 6):
            races.append({
                "number": i,
                "name": f"Race {i}",
                "time": f"{13+i}:00",
                "distance": [1200, 1400, 1600, 1800, 2000][i-1],
                "surface": "Turf" if i % 2 == 0 else "Dirt",
                "predictions": generate_race()
            })
        
        # NAP
        nap = races[0]["predictions"][0]
        nap["race"] = races[0]["name"]
        
        return jsonify({
            "success": True,
            "country": country,
            "track_id": track_id,
            "date": date,
            "races": races,
            "nap": nap,
            "total_races": len(races)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
