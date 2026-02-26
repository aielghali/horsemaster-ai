#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import json

# Register fonts
pdfmetrics.registerFont(TTFont('Microsoft YaHei', '/usr/share/fonts/truetype/chinese/msyh.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))

registerFontFamily('Microsoft YaHei', normal='Microsoft YaHei', bold='Microsoft YaHei')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Load predictions
with open('/home/z/my-project/download/meydan_predictions_final.json', 'r', encoding='utf-8') as f:
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
    fontSize=18,
    leading=26,
    alignment=TA_CENTER,
    spaceAfter=40,
    textColor=colors.HexColor('#D4AF37')
)

section_style = ParagraphStyle(
    name='SectionTitle',
    fontName='Microsoft YaHei',
    fontSize=14,
    leading=20,
    alignment=TA_RIGHT,
    spaceBefore=14,
    spaceAfter=8,
    textColor=colors.HexColor('#8B0000')
)

body_style = ParagraphStyle(
    name='ArabicBody',
    fontName='SimHei',
    fontSize=10,
    leading=16,
    alignment=TA_RIGHT,
    wordWrap='CJK',
    spaceAfter=6
)

nap_style = ParagraphStyle(
    name='NAPStyle',
    fontName='Microsoft YaHei',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#D4AF37'),
    spaceAfter=10
)

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
story.append(Spacer(1, 60))
story.append(Paragraph('<b>Elghali Ai</b>', cover_title_style))
story.append(Spacer(1, 10))
story.append(Paragraph('ترشيحات سباقات الخيل الذكية', cover_subtitle_style))
story.append(Spacer(1, 30))
story.append(Paragraph('<b>مضمار ميدان - 20 فبراير 2026</b>', ParagraphStyle(
    name='Venue',
    fontName='Microsoft YaHei',
    fontSize=20,
    leading=28,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#8B0000')
)))
story.append(Spacer(1, 50))

# NAP Box
nap = predictions['napOfTheDay']
draw_str = f"#{nap['draw']} " if nap.get('draw') and nap['draw'] != '-' else ''
story.append(Paragraph('<b>🌟 ترشيح اليوم (NAP of the Day) 🌟</b>', nap_style))

nap_table_data = [
    [Paragraph('<b>الرقم</b>', header_style), 
     Paragraph('<b>الحصان</b>', header_style), 
     Paragraph('<b>السباق</b>', header_style), 
     Paragraph('<b>الثقة</b>', header_style)],
    [
        Paragraph(f"#{nap['draw']}" if nap.get('draw') and nap['draw'] != '-' else '-', cell_style),
        Paragraph(nap['horse'], cell_style),
        Paragraph(f"السباق {nap['race']}", cell_style),
        Paragraph('85%', cell_style)
    ]
]
nap_table = Table(nap_table_data, colWidths=[2*cm, 4*cm, 2.5*cm, 2*cm])
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
story.append(Spacer(1, 6))
story.append(Paragraph(nap['reason'], body_style))

story.append(Spacer(1, 25))

# Next Best
nb = predictions['nextBest']
story.append(Paragraph('<b>🏅 الترشيح الثاني (Next Best)</b>', nap_style))

nb_table_data = [
    [Paragraph('<b>الرقم</b>', header_style), 
     Paragraph('<b>الحصان</b>', header_style), 
     Paragraph('<b>السباق</b>', header_style), 
     Paragraph('<b>الثقة</b>', header_style)],
    [
        Paragraph(f"#{nb['draw']}" if nb.get('draw') and nb['draw'] != '-' else '-', cell_style),
        Paragraph(nb['horse'], cell_style),
        Paragraph(f"السباق {nb['race']}", cell_style),
        Paragraph('80%', cell_style)
    ]
]
nb_table = Table(nb_table_data, colWidths=[2*cm, 4*cm, 2.5*cm, 2*cm])
nb_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFF5F5')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#8B0000')),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(nb_table)
story.append(Spacer(1, 6))
story.append(Paragraph(nb['reason'], body_style))

story.append(Spacer(1, 30))

# Race predictions
story.append(Paragraph('<b>📊 تفاصيل الترشيحات لكل سباق</b>', ParagraphStyle(
    name='MainTitle',
    fontName='Microsoft YaHei',
    fontSize=18,
    leading=24,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#8B0000'),
    spaceAfter=16
)))

for race in predictions['races']:
    # Race header
    story.append(Paragraph(f"<b>السباق {race['raceNumber']}: {race['raceName']}</b>", section_style))
    
    # Predictions table with draw numbers
    pred_data = [
        [Paragraph('<b>الرقم</b>', header_style),
         Paragraph('<b>المركز</b>', header_style), 
         Paragraph('<b>الحصان</b>', header_style), 
         Paragraph('<b>الثقة</b>', header_style),
         Paragraph('<b>التحليل</b>', header_style)]
    ]
    
    for pred in race['predictions']:
        draw = f"#{pred['draw']}" if pred.get('draw') and pred['draw'] != '-' else '-'
        medal = "🥇" if pred['position'] == 1 else "🥈" if pred['position'] == 2 else "🥉"
        pred_data.append([
            Paragraph(draw, cell_style),
            Paragraph(medal, cell_style),
            Paragraph(pred['horse'], cell_style),
            Paragraph(pred['confidence'], cell_style),
            Paragraph(pred['analysis'][:80] + '...' if len(pred['analysis']) > 80 else pred['analysis'], cell_style_right)
        ])
    
    pred_table = Table(pred_data, colWidths=[1.3*cm, 1.3*cm, 3.2*cm, 1.5*cm, 8*cm])
    pred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFFACD')),
        ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#FFF8DC')),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('ALIGN', (0, 1), (3, -1), 'CENTER'),
        ('ALIGN', (4, 1), (4, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(pred_table)
    
    # Value pick
    if race.get('valuePick'):
        vp = race['valuePick']
        draw = f"#{vp['draw']} " if vp.get('draw') and vp['draw'] != '-' else ''
        story.append(Spacer(1, 4))
        story.append(Paragraph(f"<b>💡 خيار القيمة:</b> {draw}{vp['horse']}", body_style))
    
    story.append(Spacer(1, 12))

# Footer
story.append(Spacer(1, 25))
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
