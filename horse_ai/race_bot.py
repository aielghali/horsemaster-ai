#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Horse AI Predictor - Investment Racing AI System
نظام الذكاء الاصطناعي لترشيحات سباقات الخيل
Author: Elghali AI Team
Version: 1.0.0
"""

import os
import json
import time
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("⚠️ Selenium غير مثبت - سيتم استخدام وضع المحاكاة")

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False
    print("⚠️ Pandas غير مثبت")


# ===============================
# التكوين الأساسي
# ===============================
CONFIG = {
    "chrome_driver_path": r"C:\Users\Elghali Ali\chromedriver.exe",
    "output_dir": os.path.join(os.path.dirname(__file__), "output"),
    "data_dir": os.path.join(os.path.dirname(__file__), "data"),
    "sources": {
        "emirates_racing": "https://www.emiratesracing.com",
        "tipmeerkat": "https://tipmeerkat.com/tracks#country-united-arab-emirates",
        "attheraces": "https://www.attheraces.com"
    }
}

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
        {"id": "wolverhampton", "name": "Wolverhampton Racecourse", "city": "Wolverhampton"},
        {"id": "lingfield", "name": "Lingfield Park", "city": "Lingfield"},
        {"id": "kempton", "name": "Kempton Park", "city": "Sunbury"},
        {"id": "newcastle", "name": "Newcastle Racecourse", "city": "Newcastle"}
    ]
}

# أسماء الخيول للتوليد
HORSE_NAMES = [
    "Thunder Strike", "Golden Arrow", "Speed Demon", "Night Rider", "Storm Chaser",
    "Royal Crown", "Diamond King", "Silver Flash", "Phoenix Rising", "Desert Storm",
    "Ocean Breeze", "Mountain Peak", "Wild Spirit", "Lucky Star", "Champion's Dream",
    "Arabian Knight", "Desert Rose", "Golden Sands", "Silk Road", "Dubai Star"
]

JOCKEYS = [
    "J. Smith", "M. Johnson", "W. Buick", "L. Dettori", "R. Moore",
    "C. Soumillon", "H. Doyle", "P. Cosgrave", "A. de Vries", "T. O'Shea",
    "Bernardo Pinheiro", "Connor Beasley", "Ray Dawson", "James Doyle",
    "Silvestre De Sousa", "Mickael Barzalona", "Adrie de Vries", "Tadhg O'Shea"
]

TRAINERS = [
    "C. Appleby", "A. O'Brien", "J. Gosden", "W. Haggas",
    "S. bin Suroor", "D. Watson", "M. Al Mheiri", "I. Al Rashdi",
    "Doug Watson", "Ahmad bin Harmash", "Fawzi Nass", "Julio Olascoaga",
    "Simon & Ed Crisford", "Michael Costa", "Musabbeh Al Mheiri"
]


# ===============================
# فئة الحصان
# ===============================
class Horse:
    """فئة الحصان مع جميع بياناته"""
    
    def __init__(self, number: int, name: str, draw: int = 0, 
                 jockey: str = "", trainer: str = "", rating: int = 0,
                 weight: int = 0, form: str = "", surface: str = "",
                 distance: int = 0, pedigree: str = ""):
        self.number = number
        self.name = name
        self.draw = draw
        self.jockey = jockey
        self.trainer = trainer
        self.rating = rating
        self.weight = weight
        self.form = form
        self.surface = surface
        self.distance = distance
        self.pedigree = pedigree
        
        # النتائج المحسوبة
        self.power_score = 0
        self.win_probability = 0.0
        self.value_rating = ""
        self.strengths = []
        self.concerns = []
        
    def to_dict(self) -> Dict:
        """تحويل إلى قاموس"""
        return {
            "number": self.number,
            "name": self.name,
            "draw": self.draw,
            "jockey": self.jockey,
            "trainer": self.trainer,
            "rating": self.rating,
            "weight": self.weight,
            "form": self.form,
            "power_score": self.power_score,
            "win_probability": self.win_probability,
            "value_rating": self.value_rating,
            "strengths": self.strengths,
            "concerns": self.concerns
        }


# ===============================
# فئة السباق
# ===============================
class Race:
    """فئة السباق"""
    
    def __init__(self, race_number: int, race_name: str, race_time: str,
                 distance: int, surface: str, going: str = ""):
        self.race_number = race_number
        self.race_name = race_name
        self.race_time = race_time
        self.distance = distance
        self.surface = surface
        self.going = going
        self.horses: List[Horse] = []
        self.analysis = ""
        self.withdrawals = []
        
    def add_horse(self, horse: Horse):
        """إضافة حصان للسباق"""
        self.horses.append(horse)
        
    def to_dict(self) -> Dict:
        """تحويل إلى قاموس"""
        return {
            "race_number": self.race_number,
            "race_name": self.race_name,
            "race_time": self.race_time,
            "distance": self.distance,
            "surface": self.surface,
            "going": self.going,
            "predictions": [h.to_dict() for h in self.horses],
            "analysis": self.analysis,
            "withdrawals": self.withdrawals
        }


# ===============================
# محرك جمع البيانات
# ===============================
class DataEngine:
    """محرك جمع البيانات من المواقع الرسمية"""
    
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.driver = None
        
    def init_driver(self):
        """تهيئة المتصفح"""
        if not SELENIUM_AVAILABLE:
            print("⚠️ Selenium غير متاح - استخدام وضع المحاكاة")
            return False
            
        try:
            options = Options()
            if self.headless:
                options.add_argument("--headless")
            options.add_argument("--disable-gpu")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--window-size=1920,1080")
            
            # البحث عن ChromeDriver
            driver_path = CONFIG["chrome_driver_path"]
            if not os.path.exists(driver_path):
                # محاولة العثور على chromedriver في PATH
                driver_path = "chromedriver"
            
            service = Service(driver_path)
            self.driver = webdriver.Chrome(service=service, options=options)
            print("✅ تم تهيئة المتصفح بنجاح")
            return True
        except Exception as e:
            print(f"❌ فشل تهيئة المتصفح: {e}")
            return False
    
    def close_driver(self):
        """إغلاق المتصفح"""
        if self.driver:
            self.driver.quit()
            self.driver = None
    
    def fetch_racecard(self, track: str, date: str) -> Dict:
        """جلب بطاقة السباق"""
        print(f"🔍 جلب بيانات السباق: {track} - {date}")
        
        # محاولة استخدام Selenium
        if self.init_driver():
            try:
                url = f"https://www.emiratesracing.com/racecard/{track}/{date}"
                self.driver.get(url)
                time.sleep(3)
                
                # استخراج البيانات الأساسية
                data = self._parse_racecard_page()
                self.close_driver()
                return data
            except Exception as e:
                print(f"⚠️ خطأ في جلب البيانات: {e}")
                self.close_driver()
        
        # استخدام البيانات المحاكاة
        return self._generate_simulated_data(track, date)
    
    def _parse_racecard_page(self) -> Dict:
        """تحليل صفحة السباق"""
        # هذا سيُستكمل لاحقاً مع التحليل الفعلي
        return {"success": False, "message": "Parsing not implemented"}
    
    def _generate_simulated_data(self, track: str, date: str) -> Dict:
        """توليد بيانات محاكاة للسباق"""
        print("📊 توليد بيانات محاكاة...")
        
        num_races = random.randint(5, 7)
        races = []
        
        for r in range(1, num_races + 1):
            race = Race(
                race_number=r,
                race_name=f"Race {r}",
                race_time=f"{13 + r}:{'00' if r % 2 == 0 else '30'}",
                distance=random.choice([1200, 1400, 1600, 1800, 2000, 2400]),
                surface=random.choice(["Dirt", "Turf", "Tapeta"]),
                going=random.choice(["Good", "Soft", "Firm", "Standard"])
            )
            
            num_horses = random.randint(6, 12)
            for h in range(1, num_horses + 1):
                horse = Horse(
                    number=h,
                    name=random.choice(HORSE_NAMES) + (f" {h}" if h > 1 else ""),
                    draw=random.randint(1, num_horses),
                    jockey=random.choice(JOCKEYS),
                    trainer=random.choice(TRAINERS),
                    rating=random.randint(50, 110),
                    weight=random.randint(52, 62),
                    form="".join([random.choice(["1", "2", "3", "4", "0", "-"]) for _ in range(5)])
                )
                race.add_horse(horse)
            
            races.append(race)
        
        return {
            "success": True,
            "track": track,
            "date": date,
            "races": [r.to_dict() for r in races],
            "total_races": num_races
        }


# ===============================
# محرك التحليل والتقييم
# ===============================
class PowerRatingEngine:
    """محرك حساب نقاط القوة لكل حصان"""
    
    # أوزان العوامل
    WEIGHTS = {
        "rating": 0.25,      # التقييم الرسمي
        "form": 0.20,        # الفورمة الأخيرة
        "jockey": 0.15,      # الفارس
        "trainer": 0.15,     # المدرب
        "distance": 0.10,    # ملاءمة المسافة
        "surface": 0.10,     # ملاءمة الأرضية
        "draw": 0.05         # بوابة الانطلاق
    }
    
    @staticmethod
    def calculate_power_score(horse: Horse, race: Race) -> int:
        """حساب نقاط القوة للحصان"""
        score = 0
        
        # 1. التقييم الرسمي (25%)
        rating_score = min(horse.rating / 120 * 100, 100)
        score += rating_score * PowerRatingEngine.WEIGHTS["rating"]
        
        # 2. الفورمة الأخيرة (20%)
        form_score = PowerRatingEngine._calculate_form_score(horse.form)
        score += form_score * PowerRatingEngine.WEIGHTS["form"]
        
        # 3. الفارس (15%)
        jockey_score = PowerRatingEngine._calculate_jockey_score(horse.jockey)
        score += jockey_score * PowerRatingEngine.WEIGHTS["jockey"]
        
        # 4. المدرب (15%)
        trainer_score = PowerRatingEngine._calculate_trainer_score(horse.trainer)
        score += trainer_score * PowerRatingEngine.WEIGHTS["trainer"]
        
        # 5. ملاءمة المسافة (10%)
        distance_score = PowerRatingEngine._calculate_distance_score(horse, race.distance)
        score += distance_score * PowerRatingEngine.WEIGHTS["distance"]
        
        # 6. ملاءمة الأرضية (10%)
        surface_score = PowerRatingEngine._calculate_surface_score(horse, race.surface)
        score += surface_score * PowerRatingEngine.WEIGHTS["surface"]
        
        # 7. بوابة الانطلاق (5%)
        draw_score = PowerRatingEngine._calculate_draw_score(horse.draw, len(race.horses))
        score += draw_score * PowerRatingEngine.WEIGHTS["draw"]
        
        return int(score)
    
    @staticmethod
    def _calculate_form_score(form: str) -> float:
        """حساب نقاط الفورمة"""
        if not form:
            return 50
        
        score = 0
        weights = [5, 4, 3, 2, 1]  # وزن كل نتيجة (الأحدث أعلى)
        
        for i, result in enumerate(form[:5]):
            if i < len(weights):
                if result == '1':
                    score += 100 * weights[i]
                elif result == '2':
                    score += 70 * weights[i]
                elif result == '3':
                    score += 50 * weights[i]
                elif result == '4':
                    score += 30 * weights[i]
                elif result == '0':
                    score += 10 * weights[i]
        
        return min(score / 15, 100)  # تطبيع النتيجة
    
    @staticmethod
    def _calculate_jockey_score(jockey: str) -> float:
        """حساب نقاط الفارس"""
        top_jockeys = ["W. Buick", "L. Dettori", "R. Moore", "C. Soumillon", 
                      "James Doyle", "Silvestre De Sousa", "Mickael Barzalona"]
        
        if jockey in top_jockeys:
            return 90
        elif any(name in jockey for name in ["Buick", "Dettori", "Moore"]):
            return 85
        else:
            return random.randint(50, 75)
    
    @staticmethod
    def _calculate_trainer_score(trainer: str) -> float:
        """حساب نقاط المدرب"""
        top_trainers = ["C. Appleby", "A. O'Brien", "J. Gosden", "Doug Watson",
                       "S. bin Suroor", "Simon & Ed Crisford"]
        
        if trainer in top_trainers:
            return 90
        elif any(name in trainer for name in ["Appleby", "Gosden", "Watson"]):
            return 85
        else:
            return random.randint(50, 75)
    
    @staticmethod
    def _calculate_distance_score(horse: Horse, race_distance: int) -> float:
        """حساب ملاءمة المسافة"""
        # تقييم بناءً على نوع السباق
        if race_distance <= 1200:  # Sprint
            return random.randint(60, 95)
        elif race_distance <= 1600:  # Mile
            return random.randint(55, 90)
        else:  # Long distance
            return random.randint(50, 85)
    
    @staticmethod
    def _calculate_surface_score(horse: Horse, surface: str) -> float:
        """حساب ملاءمة الأرضية"""
        # تقييم عشوائي مع تحيز للـ Dirt في الإمارات
        if surface == "Dirt":
            return random.randint(60, 95)
        elif surface == "Turf":
            return random.randint(55, 90)
        else:  # Tapeta
            return random.randint(55, 85)
    
    @staticmethod
    def _calculate_draw_score(draw: int, total_horses: int) -> float:
        """حساب تأثير بوابة الانطلاق"""
        # البوابات الداخلية أفضل في المسافات القصيرة
        if draw <= 3:
            return 85
        elif draw <= 6:
            return 75
        elif draw <= 10:
            return 65
        else:
            return 55


# ===============================
# محرك الاحتمالات
# ===============================
class ProbabilityEngine:
    """محرك حساب احتمالات الفوز"""
    
    @staticmethod
    def calculate_probabilities(horses: List[Horse]) -> List[Horse]:
        """حساب احتمالات الفوز لجميع الخيول"""
        total_score = sum(h.power_score for h in horses)
        
        if total_score == 0:
            total_score = 1
        
        for horse in horses:
            # نسبة الفوز الأساسية
            horse.win_probability = round((horse.power_score / total_score) * 100, 1)
            
            # تصنيف القيمة
            if horse.win_probability >= 25:
                horse.value_rating = "⭐⭐⭐"
            elif horse.win_probability >= 18:
                horse.value_rating = "⭐⭐"
            elif horse.win_probability >= 12:
                horse.value_rating = "⭐"
            else:
                horse.value_rating = "−"
        
        return horses


# ===============================
# محرك الترشيحات
# ===============================
class PredictionEngine:
    """محرك إصدار الترشيحات"""
    
    @staticmethod
    def generate_predictions(race_data: Dict) -> Dict:
        """توليد الترشيحات الكاملة"""
        if not race_data.get("success"):
            return race_data
        
        races = race_data.get("races", [])
        all_races = []
        
        for race_dict in races:
            race = Race(
                race_number=race_dict["race_number"],
                race_name=race_dict["race_name"],
                race_time=race_dict["race_time"],
                distance=race_dict["distance"],
                surface=race_dict["surface"],
                going=race_dict.get("going", "")
            )
            
            for h in race_dict.get("predictions", []):
                horse = Horse(
                    number=h["number"],
                    name=h["name"],
                    draw=h.get("draw", 0),
                    jockey=h.get("jockey", ""),
                    trainer=h.get("trainer", ""),
                    rating=h.get("rating", 0),
                    weight=h.get("weight", 0),
                    form=h.get("form", "")
                )
                
                # حساب نقاط القوة
                horse.power_score = PowerRatingEngine.calculate_power_score(horse, race)
                race.add_horse(horse)
            
            # حساب الاحتمالات
            race.horses = ProbabilityEngine.calculate_probabilities(race.horses)
            
            # ترتيب حسب نقاط القوة
            race.horses.sort(key=lambda x: x.power_score, reverse=True)
            
            # أخذ أفضل 5 فقط
            race.horses = race.horses[:5]
            
            all_races.append(race.to_dict())
        
        # اختيار NAP
        top_horse = all_races[0]["predictions"][0] if all_races else None
        
        return {
            "success": True,
            "track": race_data.get("track"),
            "date": race_data.get("date"),
            "total_races": len(all_races),
            "races": all_races,
            "nap_of_the_day": {
                "horse_name": top_horse["name"] if top_horse else "",
                "race": "Race 1",
                "reason": f"أعلى نقاط قوة ({top_horse['power_score'] if top_horse else 0})",
                "confidence": top_horse["power_score"] if top_horse else 0
            } if top_horse else {},
            "next_best": {
                "horse_name": all_races[1]["predictions"][0]["name"] if len(all_races) > 1 else "",
                "race": "Race 2",
                "reason": "قيمة ممتازة مع احتمالات جيدة"
            },
            "value_pick": {
                "horse_name": all_races[2]["predictions"][1]["name"] if len(all_races) > 2 else "",
                "race": "Race 3",
                "reason": "احتمالات عالية مع إمكانية مفاجأة"
            }
        }


# ===============================
# محرك المراهنات
# ===============================
class BettingEngine:
    """محرك توصيات المراهنات"""
    
    @staticmethod
    def generate_bet_recommendations(predictions: Dict) -> Dict:
        """توليد توصيات المراهنات"""
        recommendations = {
            "balanced_bets": [],   # رهانات متوازنة
            "aggressive_bets": [],  # رهانات عالية المخاطرة
            "no_bet_races": []      # سباقات بدون قيمة
        }
        
        for race in predictions.get("races", []):
            horses = race.get("predictions", [])
            if not horses:
                continue
            
            top_horse = horses[0]
            
            # رهان متوازن (أعلى احتمال)
            if top_horse["win_probability"] >= 20:
                recommendations["balanced_bets"].append({
                    "race_number": race["race_number"],
                    "horse": top_horse["name"],
                    "win_probability": top_horse["win_probability"],
                    "bet_type": "Win",
                    "confidence": "High" if top_horse["win_probability"] >= 30 else "Medium"
                })
            
            # رهان عالي المخاطرة (ثاني أو ثالث)
            if len(horses) > 1 and horses[1]["win_probability"] >= 15:
                recommendations["aggressive_bets"].append({
                    "race_number": race["race_number"],
                    "horse": horses[1]["name"],
                    "win_probability": horses[1]["win_probability"],
                    "bet_type": "Each Way",
                    "confidence": "Medium"
                })
            
            # لا رهان (احتمالات متساوية)
            elif top_horse["win_probability"] < 15:
                recommendations["no_bet_races"].append(race["race_number"])
        
        return recommendations


# ===============================
# النظام الرئيسي
# ===============================
class HorseAIPredictor:
    """النظام الرئيسي للترشيحات"""
    
    def __init__(self):
        self.data_engine = DataEngine()
        self.prediction_engine = PredictionEngine()
        self.betting_engine = BettingEngine()
        self.results_history = []
    
    def predict(self, track: str, date: str) -> Dict:
        """الحصول على الترشيحات"""
        print(f"\n🏇 Horse AI Predictor")
        print(f"📍 المضمار: {track}")
        print(f"📅 التاريخ: {date}")
        print("=" * 50)
        
        # 1. جمع البيانات
        race_data = self.data_engine.fetch_racecard(track, date)
        
        if not race_data.get("success"):
            return race_data
        
        # 2. تحليل وترشيح
        predictions = self.prediction_engine.generate_predictions(race_data)
        
        # 3. توصيات المراهنات
        bet_recommendations = self.betting_engine.generate_bet_recommendations(predictions)
        predictions["betting_recommendations"] = bet_recommendations
        
        # 4. حفظ النتائج
        self._save_predictions(predictions)
        
        return predictions
    
    def _save_predictions(self, predictions: Dict):
        """حفظ الترشيحات في ملف"""
        output_dir = CONFIG["output_dir"]
        os.makedirs(output_dir, exist_ok=True)
        
        filename = f"predictions_{predictions.get('track', 'unknown')}_{predictions.get('date', 'today')}.json"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(predictions, f, ensure_ascii=False, indent=2)
        
        print(f"✅ تم حفظ الترشيحات: {filepath}")
    
    def display_predictions(self, predictions: Dict):
        """عرض الترشيحات بشكل جميل"""
        print("\n" + "=" * 60)
        print("🏇 الترشيحات النهائية")
        print("=" * 60)
        
        # NAP of the Day
        nap = predictions.get("nap_of_the_day", {})
        if nap:
            print(f"\n🥇 ترشيح اليوم (NAP): {nap.get('horse_name', 'N/A')}")
            print(f"   📊 الثقة: {nap.get('confidence', 0)}%")
            print(f"   📝 السبب: {nap.get('reason', 'N/A')}")
        
        # الأشواط
        for race in predictions.get("races", []):
            print(f"\n📍 الشوط {race['race_number']} - {race['race_name']}")
            print(f"   ⏱️ الوقت: {race['race_time']} | 📏 المسافة: {race['distance']}م | 🏔️ الأرضية: {race['surface']}")
            print("-" * 50)
            
            for i, horse in enumerate(race.get("predictions", []), 1):
                medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
                print(f"   {medal} {horse['name']} - القوة: {horse['power_score']} | الفوز: {horse['win_probability']}%")
        
        # توصيات المراهنات
        bets = predictions.get("betting_recommendations", {})
        
        print("\n" + "=" * 60)
        print("💰 توصيات المراهنات")
        print("=" * 60)
        
        if bets.get("balanced_bets"):
            print("\n🟢 رهانات متوازنة (Balanced):")
            for bet in bets["balanced_bets"]:
                print(f"   الشوط {bet['race_number']}: {bet['horse']} - {bet['win_probability']}% ({bet['confidence']})")
        
        if bets.get("aggressive_bets"):
            print("\n🟡 رهانات عالية المخاطرة (Aggressive):")
            for bet in bets["aggressive_bets"]:
                print(f"   الشوط {bet['race_number']}: {bet['horse']} - {bet['win_probability']}%")
        
        if bets.get("no_bet_races"):
            print(f"\n🔴 سباقات بدون قيمة: {bets['no_bet_races']}")


# ===============================
# نقطة الدخول
# ===============================
def main():
    """الدالة الرئيسية"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Horse AI Predictor - نظام ترشيحات سباقات الخيل")
    parser.add_argument("--track", "-t", type=str, help="اسم المضمار (مثل: meydan, wolverhampton)")
    parser.add_argument("--date", "-d", type=str, help="تاريخ السباق (YYYY-MM-DD)")
    parser.add_argument("--interactive", "-i", action="store_true", help="الوضع التفاعلي")
    
    args = parser.parse_args()
    
    predictor = HorseAIPredictor()
    
    if args.interactive or (not args.track and not args.date):
        # الوضع التفاعلي
        print("🏇 Horse AI Predictor - نظام ترشيحات سباقات الخيل")
        print("=" * 50)
        
        # عرض المضامير المتاحة
        print("\n📍 المضامير المتاحة:")
        for country, tracks in RACETRACKS.items():
            print(f"\n{country}:")
            for track in tracks:
                print(f"  - {track['id']}: {track['name']} ({track['city']})")
        
        track = input("\n📌 أدخل اسم المضمار: ").strip().lower()
        date = input("📅 أدخل التاريخ (YYYY-MM-DD) أو اضغط Enter لليوم: ").strip()
        
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
    else:
        track = args.track.lower()
        date = args.date if args.date else datetime.now().strftime("%Y-%m-%d")
    
    # الحصول على الترشيحات
    predictions = predictor.predict(track, date)
    
    # عرض النتائج
    if predictions.get("success"):
        predictor.display_predictions(predictions)
    else:
        print(f"❌ فشل: {predictions.get('message', 'خطأ غير معروف')}")


if __name__ == "__main__":
    main()
