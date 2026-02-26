#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Wolverhampton Results Analysis - Elghali Ai
Comparing actual results with model predictions
"""

# Actual Results from 16 Feb 2026
actual_results = {
    1: {
        'time': '17:00',
        'name': 'Midnite A Next Generation Betting App Handicap',
        'distance': '5f 21y',
        'runners': 5,
        'results': [
            {'pos': 1, 'horse': 'Cressida Wildes', 'num': 3, 'draw': 2, 'sp': '12/1'},
            {'pos': 2, 'horse': 'Alondra', 'num': 1, 'draw': 5, 'sp': '13/8 F'},
            {'pos': 3, 'horse': "Lion's House", 'num': 5, 'draw': 1, 'sp': '4/1'},
            {'pos': 4, 'horse': 'Gogo Yubari', 'num': 4, 'draw': 3, 'sp': '13/2'},
            {'pos': 5, 'horse': 'El Bufalo', 'num': 2, 'draw': 3, 'sp': '2/1'},
        ]
    },
    2: {
        'time': '17:30',
        'name': 'Bet £10 Get £40 With BetMGM Handicap',
        'distance': '7f 36y',
        'runners': 10,
        'results': [
            {'pos': 1, 'horse': 'Faster Bee', 'num': 10, 'draw': 9, 'sp': '16/1'},
            {'pos': 2, 'horse': 'Nammos', 'num': 6, 'draw': 1, 'sp': '11/2'},
            {'pos': 3, 'horse': 'Instant Bond', 'num': 5, 'draw': 3, 'sp': '7/1'},
        ]
    },
    3: {
        'time': '18:00',
        'name': 'Midnite: Built For 2026 Not 2006 Maiden Stakes',
        'distance': '6f 20y',
        'runners': 5,
        'results': [
            {'pos': 1, 'horse': "Arishka's Dream", 'num': 3, 'draw': 5, 'sp': '5/2'},
            {'pos': 2, 'horse': 'Perola', 'num': 2, 'draw': 1, 'sp': '11/10 F'},
            {'pos': 3, 'horse': 'Lovethiswayagain', 'num': 1, 'draw': 1, 'sp': '15/8'},
        ]
    },
    4: {
        'time': '18:30',
        'name': 'Make The Move To Midnite Handicap',
        'distance': '6f 20y',
        'runners': 8,
        'results': [
            {'pos': 1, 'horse': 'Silky Wilkie', 'num': 1, 'draw': 3, 'sp': '10/3 F'},
            {'pos': 2, 'horse': 'Water Of Leith', 'num': 8, 'draw': 4, 'sp': '13/2'},
            {'pos': 3, 'horse': 'Papa Cocktail', 'num': 2, 'draw': 5, 'sp': '9/4'},
        ]
    },
    5: {
        'time': '19:00',
        'name': 'Midnite Are Upping The Betting Game Handicap',
        'distance': '6f 20y',
        'runners': 8,
        'results': [
            {'pos': 1, 'horse': 'Beauzon', 'num': 3, 'draw': 7, 'sp': '11/10 F'},
            {'pos': 2, 'horse': 'Dark Sun', 'num': 4, 'draw': 1, 'sp': '22/1'},
            {'pos': 3, 'horse': 'Ardaddy', 'num': 7, 'draw': 5, 'sp': '3/1'},
        ]
    },
    6: {
        'time': '19:30',
        'name': 'Watch Race Replays Handicap',
        'distance': '1m 142y',
        'runners': 7,
        'results': [
            {'pos': 1, 'horse': 'Samra Star', 'num': 6, 'draw': None, 'sp': '10/3'},
        ]
    },
    7: {
        'time': '20:00',
        'name': 'Join The Midnite Movement Handicap',
        'distance': '6f 20y',
        'runners': 8,
        'results': [
            {'pos': 1, 'horse': 'Little Miss India', 'num': 4, 'draw': 5, 'sp': None},
            {'pos': 2, 'horse': 'Zenato', 'num': 3, 'draw': None, 'sp': None},
        ]
    }
}

# Model Predictions
model_predictions = {
    1: {'nap': 'Alondra', 'num': 1, 'draw': 5, 'confidence': 85},
    2: {'top': 'Bad Habits', 'num': 1, 'draw': 1},
    3: {'top': 'Lovethiswayagain', 'num': 1, 'draw': 1},
    4: {'top': 'Dandy Khan', 'num': 1, 'draw': 7},
    5: {'top': 'Papa Cocktail', 'num': 1, 'draw': 2},
    6: {'top': 'Diamond River', 'num': 2, 'draw': 1},
    7: {'top': 'Solanna', 'num': 1, 'draw': 1},
}

print("=" * 70)
print("🏇 ELGHALI AI - WOLVERHAMPTON RESULTS ANALYSIS")
print("📅 16 February 2026")
print("=" * 70)

# Analysis
correct_predictions = 0
placed_predictions = 0
total_races = 7

print("\n📊 RACE BY RACE ANALYSIS")
print("-" * 70)

for race_num in range(1, 8):
    race = actual_results[race_num]
    pred = model_predictions.get(race_num, {})
    
    winner = race['results'][0]
    
    # Check prediction
    pred_correct = False
    pred_placed = False
    
    if pred:
        pred_horse = pred.get('nap') or pred.get('top')
        for i, r in enumerate(race['results']):
            if r['horse'] == pred_horse:
                if i == 0:
                    pred_correct = True
                    pred_placed = True
                elif i < 3:
                    pred_placed = True
                break
    
    if pred_correct:
        correct_predictions += 1
    if pred_placed:
        placed_predictions += 1
    
    status = "✅ WINNER" if pred_correct else ("🥈 PLACED" if pred_placed else "❌ MISS")
    
    print(f"\n🏁 RACE {race_num} - {race['time']} ({race['distance']})")
    print(f"   Winner: {winner['horse']} (#{winner['num']}, Draw {winner['draw']}) @ {winner['sp']}")
    print(f"   Model Pick: {pred.get('nap') or pred.get('top', 'N/A')} {status}")
    
    if len(race['results']) > 1:
        print(f"   2nd: {race['results'][1]['horse']} (#{race['results'][1]['num']})")
    if len(race['results']) > 2:
        print(f"   3rd: {race['results'][2]['horse']} (#{race['results'][2]['num']})")

print("\n" + "=" * 70)
print("📈 PERFORMANCE SUMMARY")
print("-" * 70)
print(f"   Winners Found: {correct_predictions}/{total_races} ({correct_predictions/total_races*100:.1f}%)")
print(f"   Placed (Top 3): {placed_predictions}/{total_races} ({placed_predictions/total_races*100:.1f}%)")

# Key Lessons
print("\n" + "=" * 70)
print("🎓 KEY LESSONS FOR MODEL IMPROVEMENT")
print("-" * 70)

lessons = """
1. 🎯 NAP PERFORMANCE (Alondra - Race 1):
   - Finished 2nd by ¾ length
   - Was 13/8 favorite - model correctly identified top chance
   - LESSON: NAP was placed - model on right track

2. 📊 DRAW BIAS ANALYSIS:
   Race 1 (5f sprint): Winner from Draw 2 (LOW) ✓
   Race 2 (7f): Winner from Draw 9 (HIGH) - SURPRISE!
   Race 3 (6f): Winner from Draw 5 (MIDDLE)
   Race 4 (6f): Winner from Draw 3 (LOW-MID) ✓
   Race 5 (6f): Winner from Draw 7 (HIGH)
   
   LESSON: Draw bias less pronounced than expected
   High draws CAN win at Wolverhampton

3. 💰 LONG SHOT WINS:
   - Race 2: Faster Bee won at 16/1 from wide draw 9
   - Model predicted Bad Habits (draw 1)
   - LESSON: Consider horses with good recent form regardless of draw

4. 🔄 FORM CYCLES:
   - Silky Wilkie (Race 4 winner): Was 10/3 favorite
   - Model had different pick but horse was in considerations
   - LESSON: Weight market confidence more heavily

5. ⚠️ FAVORITES PERFORMANCE:
   - Race 1: Alondra (13/8F) - 2nd
   - Race 2: Bad Habits (3/1F) - NOT PLACED
   - Race 3: Perola (11/10F) - 2nd
   - Race 4: Silky Wilkie (10/3F) - WON ✅
   - Race 5: Beauzon (11/10F) - WON ✅
   
   LESSON: Favorites performing well overall
   Model should respect market more

6. 🏇 PAPA COCKTAIL CASE:
   - Race 4: Finished 3rd (placed)
   - Was predicted for Race 5 originally
   - LESSON: Check correct race entries!
"""

print(lessons)

print("\n" + "=" * 70)
print("🔧 RECOMMENDED MODEL ADJUSTMENTS")
print("-" * 70)
print("""
1. DRAW BIAS: Reduce weight of draw bias factor
   - Current: Low draw +3 advantage
   - Suggested: Low draw +1.5 advantage
   
2. MARKET RESPECT: Increase weight of SP/odds
   - Favorites winning ~40% of races
   - Add "market confidence" factor
   
3. FORM WEIGHTING: Recent runs more important
   - Horses with recent good form outperforming
   
4. DISTANCE FACTOR: Draw bias varies by distance
   - 5f: Strong low draw bias
   - 6f-7f: Less pronounced
   - 1m+: Minimal draw impact
""")

print("=" * 70)
print("✅ Analysis Complete - Model Update Required")
print("=" * 70)
