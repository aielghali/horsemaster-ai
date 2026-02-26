#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Learning Engine - محرك التعلم الذاتي
يتعلم من نتائج السباقات ويحسن الترشيحات
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Tuple
import random

class LearningEngine:
    """محرك التعلم الذاتي"""
    
    def __init__(self, history_file: str = None):
        if history_file is None:
            history_file = os.path.join(os.path.dirname(__file__), "data", "learning_history.json")
        
        self.history_file = history_file
        self.history = self._load_history()
        
        # أوزان العوامل (قابلة للتعديل مع التعلم)
        self.weights = {
            "rating": 0.25,
            "form": 0.20,
            "jockey": 0.15,
            "trainer": 0.15,
            "distance": 0.10,
            "surface": 0.10,
            "draw": 0.05
        }
        
        # أداء الفرسان
        self.jockey_performance = {}
        
        # أداء المدربين
        self.trainer_performance = {}
    
    def _load_history(self) -> Dict:
        """تحميل سجل التعلم"""
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        
        return {
            "predictions": [],
            "results": [],
            "accuracy": {
                "total_predictions": 0,
                "correct_predictions": 0,
                "win_accuracy": 0.0,
                "place_accuracy": 0.0
            },
            "jockey_stats": {},
            "trainer_stats": {},
            "track_stats": {}
        }
    
    def _save_history(self):
        """حفظ سجل التعلم"""
        os.makedirs(os.path.dirname(self.history_file), exist_ok=True)
        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(self.history, f, ensure_ascii=False, indent=2)
    
    def record_prediction(self, prediction: Dict):
        """تسجيل توقع جديد"""
        record = {
            "timestamp": datetime.now().isoformat(),
            "track": prediction.get("track"),
            "date": prediction.get("date"),
            "nap": prediction.get("nap_of_the_day", {}).get("horse_name"),
            "races": [
                {
                    "race_number": r.get("race_number"),
                    "top_pick": r.get("predictions", [{}])[0].get("name") if r.get("predictions") else None,
                    "power_score": r.get("predictions", [{}])[0].get("power_score") if r.get("predictions") else None
                }
                for r in prediction.get("races", [])
            ]
        }
        
        self.history["predictions"].append(record)
        self._save_history()
    
    def record_result(self, track: str, date: str, results: List[Dict]):
        """تسجيل نتيجة سباق"""
        """
        results: [
            {
                "race_number": 1,
                "winner": "Horse Name",
                "second": "Horse Name",
                "third": "Horse Name"
            }
        ]
        """
        
        # البحث عن التوقع المقابل
        matching_prediction = None
        for pred in self.history["predictions"]:
            if pred.get("track") == track and pred.get("date") == date:
                matching_prediction = pred
                break
        
        if not matching_prediction:
            print(f"⚠️ لا يوجد توقع مسجل لـ {track} - {date}")
            return
        
        # حساب الدقة
        correct_wins = 0
        correct_places = 0
        total_races = len(results)
        
        for result in results:
            race_num = result.get("race_number")
            winner = result.get("winner")
            second = result.get("second")
            third = result.get("third")
            
            # البحث عن توقع الشوط المقابل
            for race_pred in matching_prediction.get("races", []):
                if race_pred.get("race_number") == race_num:
                    top_pick = race_pred.get("top_pick")
                    
                    if top_pick == winner:
                        correct_wins += 1
                    
                    if top_pick in [winner, second, third]:
                        correct_places += 1
                    
                    break
        
        # تحديث إحصائيات الدقة
        self.history["accuracy"]["total_predictions"] += total_races
        self.history["accuracy"]["correct_predictions"] += correct_wins
        
        if self.history["accuracy"]["total_predictions"] > 0:
            self.history["accuracy"]["win_accuracy"] = (
                self.history["accuracy"]["correct_predictions"] / 
                self.history["accuracy"]["total_predictions"] * 100
            )
        
        # تسجيل النتيجة
        result_record = {
            "timestamp": datetime.now().isoformat(),
            "track": track,
            "date": date,
            "results": results,
            "correct_wins": correct_wins,
            "correct_places": correct_places,
            "total_races": total_races
        }
        
        self.history["results"].append(result_record)
        self._save_history()
        
        print(f"✅ تم تسجيل النتيجة: {correct_wins}/{total_races} فوز صحيح")
    
    def learn_and_adjust(self):
        """التعلم من النتائج وتعديل الأوزان"""
        results = self.history.get("results", [])
        
        if len(results) < 5:
            print("⚠️ بيانات غير كافية للتعلم (أقل من 5 سباقات)")
            return
        
        # تحليل العوامل الأكثر تأثيراً
        # (هذا تبسيط - يمكن استخدام ML حقيقي لاحقاً)
        
        # تعديل بسيط للأوزان بناءً على الأداء
        accuracy = self.history["accuracy"].get("win_accuracy", 0)
        
        if accuracy > 40:
            # أداء جيد - زيادة وزن العوامل الأساسية
            self.weights["rating"] = min(0.30, self.weights["rating"] + 0.01)
            self.weights["form"] = min(0.25, self.weights["form"] + 0.01)
        elif accuracy < 25:
            # أداء ضعيف - إعادة توزيع
            self.weights["rating"] = max(0.20, self.weights["rating"] - 0.01)
            self.weights["jockey"] = min(0.20, self.weights["jockey"] + 0.01)
        
        self._save_history()
        print(f"🔄 تم تحديث الأوزان بناءً على {len(results)} نتيجة")
    
    def get_accuracy_report(self) -> Dict:
        """تقرير الدقة"""
        return {
            "total_predictions": self.history["accuracy"].get("total_predictions", 0),
            "correct_predictions": self.history["accuracy"].get("correct_predictions", 0),
            "win_accuracy": round(self.history["accuracy"].get("win_accuracy", 0), 2),
            "place_accuracy": round(self.history["accuracy"].get("place_accuracy", 0), 2),
            "total_races_analyzed": len(self.history.get("results", []))
        }
    
    def get_adjusted_weights(self) -> Dict:
        """الحصول على الأوزان المعدلة"""
        return self.weights.copy()
    
    def update_jockey_stats(self, jockey: str, won: bool):
        """تحديث إحصائيات الفارس"""
        if jockey not in self.jockey_performance:
            self.jockey_performance[jockey] = {"rides": 0, "wins": 0}
        
        self.jockey_performance[jockey]["rides"] += 1
        if won:
            self.jockey_performance[jockey]["wins"] += 1
    
    def get_jockey_win_rate(self, jockey: str) -> float:
        """الحصول على معدل فوز الفارس"""
        stats = self.jockey_performance.get(jockey, {"rides": 0, "wins": 0})
        if stats["rides"] == 0:
            return 0.15  # معدل افتراضي
        return stats["wins"] / stats["rides"]
    
    def suggest_improvements(self) -> List[str]:
        """اقتراحات لتحسين الدقة"""
        suggestions = []
        
        accuracy = self.history["accuracy"].get("win_accuracy", 0)
        
        if accuracy < 30:
            suggestions.append("📉 دقة منخفضة - يُنصح بمراجعة معايير التقييم")
            suggestions.append("💡 جرب إضافة المزيد من الوزن للفارس والمدرب")
        
        if accuracy > 50:
            suggestions.append("🎉 دقة ممتازة! النظام يعمل بشكل جيد")
            suggestions.append("📊 يمكنك زيادة حجم المراهنات")
        
        if len(self.history.get("results", [])) < 20:
            suggestions.append("⚠️ بيانات قليلة - استمر في تسجيل النتائج للتعلم")
        
        return suggestions


# ===============================
# اختبار المحرك
# ===============================
def test_learning():
    """اختبار محرك التعلم"""
    engine = LearningEngine()
    
    # تسجيل توقع
    prediction = {
        "track": "meydan",
        "date": "2026-02-18",
        "nap_of_the_day": {"horse_name": "Test Horse"},
        "races": [
            {"race_number": 1, "predictions": [{"name": "Horse A", "power_score": 85}]}
        ]
    }
    
    engine.record_prediction(prediction)
    
    # تسجيل نتيجة
    results = [
        {"race_number": 1, "winner": "Horse A", "second": "Horse B", "third": "Horse C"}
    ]
    
    engine.record_result("meydan", "2026-02-18", results)
    
    # تقرير الدقة
    report = engine.get_accuracy_report()
    print(f"\n📊 تقرير الدقة: {report}")
    
    # اقتراحات
    suggestions = engine.suggest_improvements()
    print(f"\n💡 اقتراحات: {suggestions}")


if __name__ == "__main__":
    test_learning()
