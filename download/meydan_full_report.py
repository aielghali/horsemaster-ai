# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.lib.units import cm
import arabic_reshaper
from bidi.algorithm import get_display

def reshape_arabic(text):
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)
    return bidi_text

# Register fonts
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))

registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')

# Create document
pdf_path = '/home/z/my-project/download/Elghali_Ai_Meydan_Full_Predictions.pdf'
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=1.5*cm,
    bottomMargin=1.5*cm,
    title='Elghali Ai Meydan Full Predictions',
    author='Z.ai',
    creator='Z.ai',
    subject='Horse Racing Predictions - All Meydan Races 13 February 2026'
)

# Styles
title_style = ParagraphStyle('Title', fontName='DejaVuSans-Bold', fontSize=24, leading=32, alignment=TA_CENTER, textColor=colors.HexColor('#8B0000'), spaceAfter=15)
subtitle_style = ParagraphStyle('Subtitle', fontName='DejaVuSans', fontSize=12, leading=18, alignment=TA_CENTER, textColor=colors.HexColor('#4A4A4A'), spaceAfter=10)
heading_style = ParagraphStyle('Heading', fontName='DejaVuSans-Bold', fontSize=12, leading=18, alignment=TA_LEFT, textColor=colors.HexColor('#8B0000'), spaceBefore=12, spaceAfter=6)
body_style = ParagraphStyle('Body', fontName='DejaVuSans', fontSize=9, leading=14, alignment=TA_LEFT, textColor=colors.black, spaceBefore=3, spaceAfter=3)
cell_style = ParagraphStyle('Cell', fontName='DejaVuSans', fontSize=8, leading=11, alignment=TA_CENTER, textColor=colors.black)
header_style = ParagraphStyle('Header', fontName='DejaVuSans-Bold', fontSize=9, leading=12, alignment=TA_CENTER, textColor=colors.white)
nap_style = ParagraphStyle('NAP', fontName='DejaVuSans-Bold', fontSize=14, leading=20, alignment=TA_CENTER, textColor=colors.white, spaceBefore=10, spaceAfter=10)

# Build content
story = []

# Cover Page
story.append(Spacer(1, 40))
story.append(Paragraph('<b>Elghali Ai</b>', title_style))
story.append(Paragraph(reshape_arabic('<b>ترشيحات جميع سباقات ميدان</b>'), subtitle_style))
story.append(Spacer(1, 15))
story.append(Paragraph('Meydan Racecourse - Dubai', subtitle_style))
story.append(Paragraph('13 February 2026', subtitle_style))
story.append(Spacer(1, 20))

# Sources
sources_text = reshape_arabic('المصادر:') + ' emiratesracing.com | attheraces.com | racingpost.com | skyracingworld.com'
story.append(Paragraph(sources_text, body_style))
story.append(Spacer(1, 15))

# Summary box
summary_data = [
    [Paragraph('<b>' + reshape_arabic('الملخص') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('التفاصيل') + '</b>', header_style)],
    [Paragraph(reshape_arabic('المضمار'), cell_style), Paragraph('Meydan Racecourse - Dubai', cell_style)],
    [Paragraph(reshape_arabic('التاريخ'), cell_style), Paragraph('13 February 2026', cell_style)],
    [Paragraph(reshape_arabic('عدد السباقات'), cell_style), Paragraph('8 ' + reshape_arabic('سباقات'), cell_style)],
    [Paragraph(reshape_arabic('الأسطح'), cell_style), Paragraph('Dirt (Fast) & Turf (Good)', cell_style)],
    [Paragraph(reshape_arabic('بداية السباقات'), cell_style), Paragraph('13:30', cell_style)],
]
summary_table = Table(summary_data, colWidths=[100, 250])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFF8F0')),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(summary_table)
story.append(PageBreak())

# All Races Summary Table
story.append(Paragraph('<b>' + reshape_arabic('ملخص ترشيحات جميع السباقات') + '</b>', heading_style))
story.append(Spacer(1, 8))

all_races_header = [
    Paragraph('<b>#</b>', header_style),
    Paragraph('<b>' + reshape_arabic('الوقت') + '</b>', header_style),
    Paragraph('<b>' + reshape_arabic('السباق') + '</b>', header_style),
    Paragraph('<b>' + reshape_arabic('الأول') + '</b>', header_style),
    Paragraph('<b>' + reshape_arabic('الثاني') + '</b>', header_style),
    Paragraph('<b>' + reshape_arabic('الثالث') + '</b>', header_style),
    Paragraph('<b>%</b>', header_style),
]

all_races_data = [
    all_races_header,
    [Paragraph('1', cell_style), Paragraph('13:30', cell_style), Paragraph('Arabian Hcp\n(Dirt 7f)', cell_style), 
     Paragraph('Ah Tahan (96)', cell_style), Paragraph('Baeed (85)', cell_style), Paragraph('Kayaan SB', cell_style), Paragraph('75%', cell_style)],
    [Paragraph('2', cell_style), Paragraph('14:05', cell_style), Paragraph('Maiden\n(Dirt 1m1f)', cell_style), 
     Paragraph('Fiction Maker', cell_style), Paragraph('Daayyem', cell_style), Paragraph('Hidden Secret', cell_style), Paragraph('70%', cell_style)],
    [Paragraph('3', cell_style), Paragraph('14:40', cell_style), Paragraph('Primaluna Hcp\n(Turf 1m2f)', cell_style), 
     Paragraph('Saafeer (90)', cell_style), Paragraph('Ss Izz Dubai', cell_style), Paragraph('-', cell_style), Paragraph('65%', cell_style)],
    [Paragraph('4', cell_style), Paragraph('15:15', cell_style), Paragraph('Spirit Pilot Hcp\n(Dirt 1m)', cell_style), 
     Paragraph('Diamond Dealer', cell_style), Paragraph('Force And Valour', cell_style), Paragraph('One More', cell_style), Paragraph('60%', cell_style)],
    [Paragraph('5', cell_style), Paragraph('15:50', cell_style), Paragraph('Flyback Hcp\n(Turf 7f)', cell_style), 
     Paragraph('English Oak (100)', cell_style), Paragraph('Cavallo Bay', cell_style), Paragraph('Native Knight', cell_style), Paragraph('80%', cell_style)],
    [Paragraph('6', cell_style), Paragraph('16:25', cell_style), Paragraph('Moon Phase Hcp\n(Dirt 1m2f)', cell_style), 
     Paragraph('Mr Kafoo (85)', cell_style), Paragraph('Dukedom', cell_style), Paragraph('No Escape', cell_style), Paragraph('75%', cell_style)],
    [Paragraph('7', cell_style), Paragraph('17:00', cell_style), Paragraph('Conquest Hcp\n(Turf 6f)', cell_style), 
     Paragraph('Justanotherdance', cell_style), Paragraph('-', cell_style), Paragraph('-', cell_style), Paragraph('65%', cell_style)],
    [Paragraph('8', cell_style), Paragraph('17:35', cell_style), Paragraph('Zulu Time Hcp\n(6f)', cell_style), 
     Paragraph('Dukedom', cell_style), Paragraph('Mr Kafoo', cell_style), Paragraph('Run With Cash', cell_style), Paragraph('70%', cell_style)],
]

all_table = Table(all_races_data, colWidths=[25, 40, 75, 75, 65, 60, 30])
all_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFFACD')),
    ('BACKGROUND', (0, 2), (-1, 2), colors.white),
    ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#FFFACD')),
    ('BACKGROUND', (0, 4), (-1, 4), colors.white),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#FFD700')),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#FFFACD')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#FFFACD')),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(all_table)
story.append(Spacer(1, 20))

# NAP Section
nap_box = Table([
    [Paragraph('<b>' + reshape_arabic('🌟 NAP of the Day: English Oak 🌟') + '</b>', nap_style)],
    [Paragraph(reshape_arabic('السباق 5 (15:50) - تصنيف 100 - فارس: Daniel Tudhope'), cell_style)],
    [Paragraph(reshape_arabic('نسبة الثقة: 80% - أفضل فرصة للفوز اليوم'), cell_style)],
], colWidths=[380])
nap_box.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#006400')),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#E8F5E9')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#006400')),
]))
story.append(nap_box)
story.append(Spacer(1, 10))

# Next Best
next_box = Table([
    [Paragraph('<b>' + reshape_arabic('Next Best: Ah Tahan') + '</b>', nap_style)],
    [Paragraph(reshape_arabic('السباق 1 (13:30) - تصنيف 96 - فارس: Bernardo Pinheiro'), cell_style)],
], colWidths=[380])
next_box.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1565C0')),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#E3F2FD')),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#1565C0')),
]))
story.append(next_box)
story.append(PageBreak())

# Detailed Race Analysis
races_detail = [
    ('1', '13:30', 'Longines Conquest - Purebred Arabian Handicap - Dirt', '7f', 'AED 72,000', '16 runners',
     'Ah Tahan (AE)', '96', 'Bernardo Pinheiro',
     'Baeed (AE)', '85', '-',
     'Kayaan SB (AE)', '-', '-',
     '75%', 'Ah Tahan فاز في آخر سباق في العين على مسافة 1m handicap. Baeed بتصنيف 85 منافس قوي.'),
    
    ('2', '14:05', 'Longines Master Collection Year Of The Horse Maiden - Dirt', '1m 1f 110y', 'AED 99,000', '12 runners',
     'Fiction Maker (GB)', '35', '-',
     'Daayyem (USA)', '27', 'K Neyadi',
     'Hidden Secret (IRE)', '28', '-',
     '70%', 'Fiction Maker أفضل تصنيف في السباق للخيل الجديدة. Daayyem يحمل جينات جيدة من Bolt Doro.'),
    
    ('3', '14:40', 'Longines Primaluna Handicap - Turf', '1m 2f', 'AED 105,000', '-',
     'Saafeer (FR)', '90', 'Silvestre De Sousa',
     'Ss Izz Dubai (AE)', '-', '-',
     '-', '-', '-',
     '65%', 'Saafeer بتصنيف 90 والفارس المحترف Silvestre De Sousa ترشيح قوي.'),
    
    ('4', '15:15', 'Longines Spirit Pilot Handicap - Dirt', '1m', 'AED 114,000', '14 runners',
     'Diamond Dealer', '-', '-',
     'Force And Valour', '-', '-',
     'One More', '-', '-',
     '60%', 'Diamond Dealer بأسعار 4/1 يقدم قيمة جيدة. السباق مفتوح للمنافسة.'),
    
    ('5', '15:50', 'Longines Spirit Pilot Flyback Handicap - Turf', '7f', 'AED 150,000', '14 runners',
     'English Oak (GB)', '100', 'Daniel Tudhope',
     'Cavallo Bay (GB)', '-', 'O J Orr',
     'Native Knight', '40', '-',
     '80%', 'English Oak بتصنيف 100 وفارس محترف - ترشيح واضح. Cavallo Bay بجينات Pinatubo ممتازة.'),
    
    ('6', '16:25', 'Longines Master Collection Moon Phase Chronograph Hcp - Dirt', '1m 2f', 'AED 105,000', '18 runners',
     'Mr Kafoo', '85', 'S Hitchcott',
     'Dukedom (IRE)', '-', '-',
     'No Escape', '-', 'R Mullen',
     '75%', 'Mr Kafoo بتصنيف 85 وأداء قوي. Dukedom المفضل في السوق.'),
    
    ('7', '17:00', 'Longines Conquest Chronograph Handicap - Turf', '6f', 'AED 105,000', '-',
     'Justanotherdance', '-', '-',
     '-', '-', '-',
     '-', '-', '-',
     '65%', 'Justanotherdance مرشح Racing Post للسباق.'),
    
    ('8', '17:35', 'Longines Spirit Zulu Time 1925 Handicap', '6f', 'AED 105,000', '18 runners',
     'Dukedom (IRE)', '-', '-',
     'Mr Kafoo', '85', 'S Hitchcott',
     'Run With The Cash (USA)', '69', 'Royston Ffrench',
     '70%', 'Dukedom المفضل في السوق له فرصة جيدة.'),
]

for race in races_detail:
    r_num, time, name, dist, prize, runners, f1, r1, j1, f2, r2, j2, f3, r3, j3, conf, analysis = race
    
    story.append(Paragraph(f'<b>{reshape_arabic("السباق")} {r_num} ({time})</b>', heading_style))
    story.append(Paragraph(name, body_style))
    story.append(Paragraph(f'{dist} | {prize} | {runners}', body_style))
    story.append(Spacer(1, 5))
    
    race_table = [
        [Paragraph('<b>' + reshape_arabic('المركز') + '</b>', header_style),
         Paragraph('<b>' + reshape_arabic('الحصان') + '</b>', header_style),
         Paragraph('<b>Rating</b>', header_style),
         Paragraph('<b>Jockey</b>', header_style)],
        [Paragraph(reshape_arabic('🥇 الأول'), cell_style), Paragraph(f1, cell_style), Paragraph(r1, cell_style), Paragraph(j1, cell_style)],
        [Paragraph(reshape_arabic('🥈 الثاني'), cell_style), Paragraph(f2, cell_style), Paragraph(r2, cell_style), Paragraph(j2, cell_style)],
        [Paragraph(reshape_arabic('🥉 الثالث'), cell_style), Paragraph(f3, cell_style), Paragraph(r3, cell_style), Paragraph(j3, cell_style)],
    ]
    
    t = Table(race_table, colWidths=[70, 130, 50, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E75B6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFD700')),
        ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#C0C0C0')),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#CD7F32')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 3))
    story.append(Paragraph(reshape_arabic(analysis), body_style))
    story.append(Paragraph(f'{reshape_arabic("نسبة الثقة")}: {conf}', body_style))
    story.append(Spacer(1, 10))

# Notes
story.append(Spacer(1, 15))
story.append(Paragraph('<b>' + reshape_arabic('ملاحظات مهمة') + '</b>', heading_style))
notes = [
    reshape_arabic('هذه الترشيحات مبنية على تحليل نموذج Elghali Ai للبيانات المتاحة.'),
    reshape_arabic('المصادر: emiratesracing.com, attheraces.com, racingpost.com, skyracingworld.com'),
    reshape_arabic('التصنيف (Rating) مؤشر رئيسي على قدرة الخيل التنافسية.'),
    reshape_arabic('حالة الطقس والسطح قد تؤثر على النتائج.'),
    reshape_arabic('المراهنة تنطوي على مخاطر - الرجاء المراهنة بمسؤولية.'),
]
for note in notes:
    story.append(Paragraph('• ' + note, body_style))

# Build PDF
doc.build(story)
print(f"PDF created: {pdf_path}")
