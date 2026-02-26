#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import json
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Microsoft YaHei', '/usr/share/fonts/truetype/chinese/msyh.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))

# Enable bold tags
registerFontFamily('Microsoft YaHei', normal='Microsoft YaHei', bold='Microsoft YaHei')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Load predictions
with open('/home/z/my-project/download/meydan_predictions_feb20.json', 'r', encoding='utf-8') as f:
    predictions = json.load(f)

# Create document
output_path = '/home/z/my-project/download/Elghali_Ai_Meydan_Predictions_20Feb2026.pdf'
doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title='Elghali_Ai_Meydan_Predictions_20Feb2026',
    author='Z.ai',
    creator='Z.ai',
    subject='Horse Racing Predictions for Meydan 20 February 2026'
)

# Styles
styles = getSampleStyleSheet()

# Cover title style
cover_title_style = ParagraphStyle(
    name='CoverTitle',
    fontName='Microsoft YaHei',
    fontSize=36,
    leading=44,
    alignment=TA_CENTER,
    spaceAfter=20,
    textColor=colors.HexColor('#8B0000')
)

cover_subtitle_style = ParagraphStyle(
    name='CoverSubtitle',
    fontName='Microsoft YaHei',
    fontSize=20,
    leading=28,
    alignment=TA_CENTER,
    spaceAfter=40,
    textColor=colors.HexColor('#D4AF37')
)

# Section styles
title_style = ParagraphStyle(
    name='ArabicTitle',
    fontName='Microsoft YaHei',
    fontSize=22,
    leading=30,
    alignment=TA_CENTER,
    spaceAfter=16,
    textColor=colors.HexColor('#8B0000')
)

section_style = ParagraphStyle(
    name='SectionTitle',
    fontName='Microsoft YaHei',
    fontSize=16,
    leading=22,
    alignment=TA_RIGHT,
    spaceBefore=16,
    spaceAfter=8,
    textColor=colors.HexColor('#8B0000')
)

body_style = ParagraphStyle(
    name='ArabicBody',
    fontName='SimHei',
    fontSize=11,
    leading=18,
    alignment=TA_RIGHT,
    wordWrap='CJK',
    spaceAfter=8
)

nap_style = ParagraphStyle(
    name='NAPStyle',
    fontName='Microsoft YaHei',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#D4AF37'),
    spaceAfter=12
)

# Table styles
header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Microsoft YaHei',
    fontSize=10,
    textColor=colors.white,
    alignment=TA_CENTER
)

cell_style = ParagraphStyle(
    name='TableCell',
    fontName='SimHei',
    fontSize=9,
    textColor=colors.black,
    alignment=TA_CENTER,
    wordWrap='CJK'
)

cell_style_right = ParagraphStyle(
    name='TableCellRight',
    fontName='SimHei',
    fontSize=9,
    textColor=colors.black,
    alignment=TA_RIGHT,
    wordWrap='CJK'
)

# Build story
story = []

# Cover page
story.append(Spacer(1, 80))
story.append(Paragraph('<b>Elghali Ai</b>', cover_title_style))
story.append(Spacer(1, 20))
story.append(Paragraph('ترشيحات سباقات الخيل الذكية', cover_subtitle_style))
story.append(Spacer(1, 40))
story.append(Paragraph('<b>مضمار ميدان</b>', ParagraphStyle(
    name='Venue',
    fontName='Microsoft YaHei',
    fontSize=24,
    leading=32,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#8B0000')
)))
story.append(Spacer(1, 20))
story.append(Paragraph('20 فبراير 2026', ParagraphStyle(
    name='Date',
    fontName='Microsoft YaHei',
    fontSize=18,
    leading=24,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#333333')
)))
story.append(Spacer(1, 60))

# NAP Box
nap_data = predictions['napOfTheDay']
story.append(Paragraph('<b>🌟 ترشيح اليوم (NAP of the Day) 🌟</b>', nap_style))
story.append(Spacer(1, 10))

nap_table_data = [
    [Paragraph('<b>الترشيح</b>', header_style), Paragraph('<b>السباق</b>', header_style), Paragraph('<b>التحليل</b>', header_style)],
    [
        Paragraph(nap_data['horse'], cell_style),
        Paragraph(f"السباق {nap_data['race']}", cell_style),
        Paragraph(nap_data['reason'], cell_style_right)
    ]
]
nap_table = Table(nap_table_data, colWidths=[3*cm, 2*cm, 11*cm])
nap_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D4AF37')),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFF8DC')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#D4AF37')),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(nap_table)

story.append(Spacer(1, 30))

# Next Best
next_best = predictions['nextBest']
story.append(Paragraph('<b>🏅 الترشيح الثاني (Next Best)</b>', nap_style))
next_table_data = [
    [Paragraph('<b>الترشيح</b>', header_style), Paragraph('<b>السباق</b>', header_style), Paragraph('<b>التحليل</b>', header_style)],
    [
        Paragraph(next_best['horse'], cell_style),
        Paragraph(f"السباق {next_best['race']}", cell_style),
        Paragraph(next_best['reason'], cell_style_right)
    ]
]
next_table = Table(next_table_data, colWidths=[3*cm, 2*cm, 11*cm])
next_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFF5F5')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#8B0000')),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(next_table)

story.append(Spacer(1, 40))

# Race predictions
story.append(Paragraph('<b>📊 تفاصيل الترشيحات لكل سباق</b>', title_style))
story.append(Spacer(1, 20))

for race in predictions['races']:
    # Race header
    story.append(Paragraph(f"<b>السباق {race['raceNumber']}: {race['raceName']}</b>", section_style))
    story.append(Spacer(1, 8))
    
    # Predictions table
    pred_data = [
        [Paragraph('<b>المركز</b>', header_style), 
         Paragraph('<b>الحصان</b>', header_style), 
         Paragraph('<b>الثقة</b>', header_style),
         Paragraph('<b>التحليل</b>', header_style)]
    ]
    
    for pred in race['predictions']:
        pred_data.append([
            Paragraph(f"🥇" if pred['position'] == 1 else f"🥈" if pred['position'] == 2 else "🥉", cell_style),
            Paragraph(pred['horse'], cell_style),
            Paragraph(pred['confidence'], cell_style),
            Paragraph(pred['analysis'], cell_style_right)
        ])
    
    pred_table = Table(pred_data, colWidths=[1.5*cm, 3.5*cm, 1.5*cm, 9.5*cm])
    pred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFFACD')),
        ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#FFF8DC')),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('ALIGN', (0, 1), (2, -1), 'CENTER'),
        ('ALIGN', (3, 1), (3, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(pred_table)
    
    # Value pick
    if race.get('valuePick'):
        story.append(Spacer(1, 8))
        story.append(Paragraph(f"<b>💡 خيار القيمة:</b> {race['valuePick']['horse']} - {race['valuePick']['reason']}", body_style))
    
    story.append(Spacer(1, 16))

# Footer
story.append(Spacer(1, 30))
story.append(Paragraph('© 2026 Elghali Ai - جميع الحقوق محفوظة', ParagraphStyle(
    name='Footer',
    fontName='SimHei',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.grey
)))

# Build PDF
doc.build(story)
print(f"✅ PDF created: {output_path}")
