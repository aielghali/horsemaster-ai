#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Horse AI Predictor - Web Interface
واجهة ويب لنظام ترشيحات سباقات الخيل
"""

import streamlit as st
from datetime import datetime, timedelta
import sys
import os

# إضافة مسار المشروع
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from race_bot import HorseAIPredictor, RACETRACKS

# إعدادات الصفحة
st.set_page_config(
    page_title="Horse AI Predictor",
    page_icon="🏇",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS مخصص
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, #8B0000 0%, #5C0000 100%);
        padding: 20px;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 20px;
    }
    .nap-card {
        background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        margin: 10px 0;
    }
    .race-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
    }
    .horse-row {
        padding: 10px;
        margin: 5px 0;
        border-radius: 5px;
    }
    .gold { background: rgba(255, 215, 0, 0.3); }
    .silver { background: rgba(192, 192, 192, 0.3); }
    .bronze { background: rgba(205, 127, 50, 0.3); }
</style>
""", unsafe_allow_html=True)


def main():
    # العنوان الرئيسي
    st.markdown("""
    <div class="main-header">
        <h1>🏇 Horse AI Predictor</h1>
        <p>نظام الذكاء الاصطناعي لترشيحات سباقات الخيل</p>
    </div>
    """, unsafe_allow_html=True)
    
    # الشريط الجانبي
    st.sidebar.title("⚙️ الإعدادات")
    
    # اختيار الدولة
    countries = list(RACETRACKS.keys())
    country = st.sidebar.selectbox(
        "🌍 الدولة",
        countries,
        format_func=lambda x: "الإمارات 🇦🇪" if x == "UAE" else "بريطانيا 🇬🇧"
    )
    
    # اختيار المضمار
    tracks = RACETRACKS[country]
    track_names = [t["id"] for t in tracks]
    track_display = [f"{t['name']} ({t['city']})" for t in tracks]
    
    selected_idx = st.sidebar.selectbox(
        "🏟️ المضمار",
        range(len(tracks)),
        format_func=lambda i: track_display[i]
    )
    selected_track = track_names[selected_idx]
    
    # اختيار التاريخ
    today = datetime.now()
    date = st.sidebar.date_input(
        "📅 تاريخ السباق",
        value=today,
        min_value=today - timedelta(days=7),
        max_value=today + timedelta(days=30)
    )
    
    # نوع التحليل
    analysis_type = st.sidebar.radio(
        "📊 نوع التحليل",
        ["ترشيحات الفوز", "تحليل المراهنات", "تحليل شامل"]
    )
    
    # زر التحليل
    analyze_btn = st.sidebar.button("🔍 تحليل السباق", type="primary", use_container_width=True)
    
    # المحتوى الرئيسي
    if analyze_btn:
        with st.spinner("جاري تحليل السباق..."):
            # إنشاء المحلل
            predictor = HorseAIPredictor()
            
            # الحصول على الترشيحات
            date_str = date.strftime("%Y-%m-%d")
            predictions = predictor.predict(selected_track, date_str)
            
            if predictions.get("success"):
                # عرض النتائج
                display_predictions(predictions, analysis_type)
            else:
                st.error(f"❌ فشل التحليل: {predictions.get('message', 'خطأ غير معروف')}")
    else:
        # عرض تعليمات
        display_instructions()


def display_predictions(predictions: dict, analysis_type: str):
    """عرض الترشيحات"""
    
    # NAP of the Day
    nap = predictions.get("nap_of_the_day", {})
    if nap:
        st.markdown("""
        <div class="nap-card">
            <h2>🥇 ترشيح اليوم (NAP)</h2>
            <h1>{}</h1>
            <p>الثقة: {}%</p>
            <p>{}</p>
        </div>
        """.format(
            nap.get("horse_name", "N/A"),
            nap.get("confidence", 0),
            nap.get("reason", "")
        ), unsafe_allow_html=True)
    
    # الترشيحات السريعة
    col1, col2 = st.columns(2)
    
    with col1:
        next_best = predictions.get("next_best", {})
        st.info(f"🥈 **الترشيح الثاني:** {next_best.get('horse_name', 'N/A')}\n\n{next_best.get('reason', '')}")
    
    with col2:
        value_pick = predictions.get("value_pick", {})
        st.warning(f"💎 **ترشيح القيمة:** {value_pick.get('horse_name', 'N/A')}\n\n{value_pick.get('reason', '')}")
    
    # فاصل
    st.markdown("---")
    st.subheader("📋 جميع الأشواط")
    
    # عرض الأشواط
    for race in predictions.get("races", []):
        with st.expander(f"🏁 الشوط {race['race_number']} - {race['race_name']} ({race['race_time']})"):
            # معلومات السباق
            col1, col2, col3 = st.columns(3)
            col1.metric("📏 المسافة", f"{race['distance']}م")
            col2.metric("🏔️ الأرضية", race['surface'])
            col3.metric("🌊 الحالة", race.get('going', 'N/A'))
            
            # جدول الخيول
            st.markdown("**ترتيب الترشيحات:**")
            
            for i, horse in enumerate(race.get("predictions", []), 1):
                medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
                color = "gold" if i == 1 else "silver" if i == 2 else "bronze" if i == 3 else ""
                
                st.markdown(f"""
                <div class="horse-row {color}">
                    {medal} <strong>{horse['name']}</strong> |
                    القوة: {horse['power_score']} |
                    الفوز: {horse['win_probability']}% |
                    الفارس: {horse.get('jockey', 'N/A')}
                </div>
                """, unsafe_allow_html=True)
    
    # توصيات المراهنات (إذا تم اختيارها)
    if analysis_type in ["تحليل المراهنات", "تحليل شامل"]:
        st.markdown("---")
        st.subheader("💰 توصيات المراهنات")
        
        bets = predictions.get("betting_recommendations", {})
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🟢 رهانات متوازنة")
            for bet in bets.get("balanced_bets", []):
                st.success(f"**الشوط {bet['race_number']}:** {bet['horse']}\n\nالنسبة: {bet['win_probability']}% | الثقة: {bet['confidence']}")
        
        with col2:
            st.markdown("### 🟡 رهانات عالية المخاطرة")
            for bet in bets.get("aggressive_bets", []):
                st.warning(f"**الشوط {bet['race_number']}:** {bet['horse']}\n\nالنسبة: {bet['win_probability']}%")


def display_instructions():
    """عرض تعليمات الاستخدام"""
    st.markdown("""
    ## 📖 كيفية الاستخدام
    
    ### 1️⃣ اختر الدولة
    - **الإمارات** 🇦🇪: ميدان، جبل علي، أبوظبي، العين، الشارقة
    - **بريطانيا** 🇬🇧: وولفرهامبتون، لينجفيلد، كيمبتون، نيوكاسل
    
    ### 2️⃣ اختر المضمار
    اختر المضمار من القائمة المنسدلة
    
    ### 3️⃣ اختر التاريخ
    حدد تاريخ السباق المطلوب
    
    ### 4️⃣ اضغط "تحليل السباق"
    سيقوم النظام بتحليل السباق وإعطائك الترشيحات
    
    ---
    
    ## 🧠 كيف يعمل النظام؟
    
    ### محرك التحليل يحسب:
    - 📊 **التقييم الرسمي** (25%)
    - 📝 **الفورمة الأخيرة** (20%)
    - 👨‍✈️ **الفارس** (15%)
    - 🧢 **المدرب** (15%)
    - 📏 **ملاءمة المسافة** (10%)
    - 🏔️ **ملاءمة الأرضية** (10%)
    - 🚪 **بوابة الانطلاق** (5%)
    
    ---
    
    ## 💡 نصائح للمراهنات
    
    ### رهان متوازن (Balanced)
    - احتمال فوز عالي (20%+)
    - مخاطرة منخفضة
    - مناسب للمراهنات اليومية
    
    ### رهان عالي المخاطرة (Aggressive)
    - احتمال متوسط (15-20%)
    - عائد أعلى
    - مناسب للرهانات القيمة
    """)


if __name__ == "__main__":
    main()
