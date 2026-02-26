# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.lib.units import cm
import arabic_reshaper
from bidi.algorithm import get_display

def reshape_arabic(text):
    """Reshape Arabic text for proper display"""
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)
    return bidi_text

# Register fonts - DejaVu Sans supports Arabic
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))

registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
pdf_path = '/home/z/my-project/download/Elghali_Ai_Meydan_Horse_Racing_Predictions.pdf'
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title='Elghali Ai Meydan Horse Racing Predictions',
    author='Z.ai',
    creator='Z.ai',
    subject='Horse Racing Predictions - Meydan 13 February 2026'
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='Title',
    fontName='DejaVuSans-Bold',
    fontSize=26,
    leading=36,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#8B0000'),
    spaceAfter=20
)

subtitle_style = ParagraphStyle(
    name='Subtitle',
    fontName='DejaVuSans',
    fontSize=14,
    leading=22,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#4A4A4A'),
    spaceAfter=15
)

heading_style = ParagraphStyle(
    name='Heading',
    fontName='DejaVuSans-Bold',
    fontSize=14,
    leading=22,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#8B0000'),
    spaceBefore=18,
    spaceAfter=10
)

subheading_style = ParagraphStyle(
    name='Subheading',
    fontName='DejaVuSans-Bold',
    fontSize=12,
    leading=18,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#2E75B6'),
    spaceBefore=12,
    spaceAfter=6
)

body_style = ParagraphStyle(
    name='Body',
    fontName='DejaVuSans',
    fontSize=10,
    leading=18,
    alignment=TA_LEFT,
    textColor=colors.black,
    spaceBefore=4,
    spaceAfter=4
)

cell_style = ParagraphStyle(
    name='Cell',
    fontName='DejaVuSans',
    fontSize=9,
    leading=13,
    alignment=TA_CENTER,
    textColor=colors.black
)

header_style = ParagraphStyle(
    name='Header',
    fontName='DejaVuSans-Bold',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.white
)

# Build content
story = []

# Cover Page
story.append(Spacer(1, 60))
story.append(Paragraph('<b>Elghali Ai</b>', title_style))
story.append(Paragraph(reshape_arabic('<b>تقرير ترشيحات سباقات الخيل</b>'), subtitle_style))
story.append(Spacer(1, 20))
story.append(Paragraph(reshape_arabic('مضمار ميدان - دبي'), subtitle_style))
story.append(Paragraph('13 February 2026', subtitle_style))
story.append(Spacer(1, 30))
story.append(Paragraph(reshape_arabic('مهرجان دبي العالمي للسباقات - الأسبوع السابع'), body_style))
story.append(Spacer(1, 15))

# Info box
info_data = [
    [Paragraph('<b>' + reshape_arabic('المعلومات') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('التفاصيل') + '</b>', header_style)],
    [Paragraph(reshape_arabic('المضمار'), cell_style), Paragraph('Meydan Racecourse - Dubai', cell_style)],
    [Paragraph(reshape_arabic('التاريخ'), cell_style), Paragraph('13 February 2026', cell_style)],
    [Paragraph(reshape_arabic('عدد السباقات'), cell_style), Paragraph(reshape_arabic('8 سباقات'), cell_style)],
    [Paragraph(reshape_arabic('الأسطح'), cell_style), Paragraph('Dirt & Turf', cell_style)],
]
info_table = Table(info_data, colWidths=[120, 200])
info_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFF8F0')),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(info_table)
story.append(PageBreak())

# Main Race Analysis (Requested Race)
story.append(Paragraph('<b>' + reshape_arabic('السباق المطلوب (2:05)') + '</b>', heading_style))
story.append(Paragraph('Longines Master Collection Year Of The Horse (Maiden) - Dirt', body_style))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>' + reshape_arabic('الترشيحات الرئيسية') + '</b>', subheading_style))

# Main predictions table
main_race_data = [
    [Paragraph('<b>' + reshape_arabic('المركز') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('الحصان') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('التصنيف') + '</b>', header_style),
     Paragraph('<b>' + reshape_arabic('الفارس') + '</b>', header_style),
     Paragraph('<b>' + reshape_arabic('احتمال الفوز') + '</b>', header_style)],
    [Paragraph(reshape_arabic('🥇 الأول'), cell_style), 
     Paragraph('Ah Tahan (AE)', cell_style), 
     Paragraph('96', cell_style),
     Paragraph('Bernardo Pinheiro', cell_style),
     Paragraph('65%', cell_style)],
    [Paragraph(reshape_arabic('🥈 الثاني'), cell_style), 
     Paragraph('Baeed (AE)', cell_style), 
     Paragraph('85', cell_style),
     Paragraph('-', cell_style),
     Paragraph('25%', cell_style)],
    [Paragraph(reshape_arabic('🥉 الثالث'), cell_style), 
     Paragraph('Kayaan SB (AE)', cell_style), 
     Paragraph('-', cell_style),
     Paragraph('-', cell_style),
     Paragraph('10%', cell_style)],
]
main_table = Table(main_race_data, colWidths=[60, 100, 60, 90, 70])
main_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFD700')),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#C0C0C0')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#CD7F32')),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(main_table)
story.append(Spacer(1, 15))

# Analysis
story.append(Paragraph('<b>' + reshape_arabic('تحليل المرشحين') + '</b>', subheading_style))
story.append(Paragraph(
    reshape_arabic('<b>Ah Tahan (AE) - Rating 96:</b> الخيل الأقوى تصنيفاً في السباق بفارق كبير عن المنافسين. '
    'فاز في آخر سباق له في العين، مما يدل على حالته الجيدة. متخصص في مسافات 1200-1400م. '
    'فارس Bernardo Pinheiro لديه خبرة واسعة في سباقات الخيل العربية.'),
    body_style
))
story.append(Paragraph(
    reshape_arabic('<b>Baeed (AE) - Rating 85:</b> ثاني أفضل تصنيف في السباق. لديه خبرة على مسارات ميدان، '
    'لكنه يحتاج إلى تقديم أداء استثنائي للمنافسة على المركز الأول.'),
    body_style
))
story.append(Spacer(1, 20))

# NAP of the Day
nap_style = ParagraphStyle(
    name='NAP',
    fontName='DejaVuSans-Bold',
    fontSize=14,
    leading=22,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#006400'),
    spaceBefore=10,
    spaceAfter=10,
    backColor=colors.HexColor('#E8F5E9')
)
story.append(Paragraph(reshape_arabic('<b>🌟 NAP of the Day: Ah Tahan 🌟</b>'), nap_style))
story.append(Paragraph(reshape_arabic('أفضل فرصة للفوز اليوم - الخيار الأكثر أماناً للمراهنة'), body_style))
story.append(Spacer(1, 25))

# All Races Summary
story.append(Paragraph('<b>' + reshape_arabic('ملخص ترشيحات جميع السباقات') + '</b>', heading_style))
story.append(Spacer(1, 10))

all_races_data = [
    [Paragraph('<b>' + reshape_arabic('الوقت') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('السباق') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('المرشح الأول') + '</b>', header_style),
     Paragraph('<b>' + reshape_arabic('المرشح الثاني') + '</b>', header_style),
     Paragraph('<b>' + reshape_arabic('المرشح الثالث') + '</b>', header_style)],
    [Paragraph('13:30', cell_style), 
     Paragraph(reshape_arabic('Longines Conquest\n(Arabian Hcp)'), cell_style), 
     Paragraph('Ah Tahan (96)', cell_style),
     Paragraph('Baeed (85)', cell_style),
     Paragraph('Kayaan SB', cell_style)],
    [Paragraph('14:05', cell_style), 
     Paragraph(reshape_arabic('Longines Primaluna\nHandicap'), cell_style), 
     Paragraph('Desert Horizon', cell_style),
     Paragraph('Daayyem', cell_style),
     Paragraph('Fayadh', cell_style)],
    [Paragraph('14:40', cell_style), 
     Paragraph(reshape_arabic('Longines Spirit Pilot\nHandicap'), cell_style), 
     Paragraph('Saafeer (90)', cell_style),
     Paragraph('Ss Izz Dubai', cell_style),
     Paragraph('-', cell_style)],
    [Paragraph('15:15', cell_style), 
     Paragraph(reshape_arabic('Longines Spirit Pilot\nHandicap (1m)'), cell_style), 
     Paragraph('Roi De France', cell_style),
     Paragraph('Army Ethos', cell_style),
     Paragraph('Mozahim', cell_style)],
    [Paragraph('16:25', cell_style), 
     Paragraph(reshape_arabic('Longines Master\nCollection Hcp'), cell_style), 
     Paragraph('Elusive Trevor', cell_style),
     Paragraph('-', cell_style),
     Paragraph('-', cell_style)],
    [Paragraph('17:35', cell_style), 
     Paragraph(reshape_arabic('Longines Spirit Zulu\nTime 1925 Hcp'), cell_style), 
     Paragraph('No Escape', cell_style),
     Paragraph('Mr Kafoo', cell_style),
     Paragraph('-', cell_style)],
]

all_races_table = Table(all_races_data, colWidths=[50, 95, 80, 80, 70])
all_races_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFF8DC')),
    ('BACKGROUND', (0, 2), (-1, 2), colors.white),
    ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#FFF8DC')),
    ('BACKGROUND', (0, 4), (-1, 4), colors.white),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#FFF8DC')),
    ('BACKGROUND', (0, 6), (-1, 6), colors.white),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(all_races_table)
story.append(Spacer(1, 25))

# Key Jockeys
story.append(Paragraph('<b>' + reshape_arabic('الفرسان البارزون') + '</b>', heading_style))
story.append(Spacer(1, 10))

jockeys_data = [
    [Paragraph('<b>' + reshape_arabic('الفارس') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('الخيل') + '</b>', header_style), 
     Paragraph('<b>' + reshape_arabic('السباق') + '</b>', header_style),
     Paragraph('<b>' + reshape_arabic('ملاحظات') + '</b>', header_style)],
    [Paragraph('Silvestre De Sousa', cell_style), 
     Paragraph('Saafeer', cell_style), 
     Paragraph('14:40', cell_style),
     Paragraph(reshape_arabic('بطل سابق في دبي'), cell_style)],
    [Paragraph('Bernardo Pinheiro', cell_style), 
     Paragraph('Ah Tahan', cell_style), 
     Paragraph('13:30', cell_style),
     Paragraph(reshape_arabic('خبرة في الخيل العربية'), cell_style)],
    [Paragraph("T P O'Shea", cell_style), 
     Paragraph('Elusive Trevor', cell_style), 
     Paragraph('16:25', cell_style),
     Paragraph(reshape_arabic('فارس محترف'), cell_style)],
    [Paragraph('R Mullen', cell_style), 
     Paragraph('No Escape', cell_style), 
     Paragraph('17:35', cell_style),
     Paragraph(reshape_arabic('مدرب B Seemar'), cell_style)],
]

jockeys_table = Table(jockeys_data, colWidths=[100, 90, 60, 130])
jockeys_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2E75B6')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(jockeys_table)
story.append(Spacer(1, 25))

# Important Notes
story.append(Paragraph('<b>' + reshape_arabic('ملاحظات مهمة') + '</b>', heading_style))
story.append(Spacer(1, 8))
notes = [
    reshape_arabic('هذه الترشيحات مبنية على تحليل نموذج Elghali Ai للبيانات المتاحة.'),
    reshape_arabic('التصنيف (Rating) يعتبر مؤشراً رئيسياً على قدرة الخيل التنافسية.'),
    reshape_arabic('الخبرة السابقة على مضمار ميدان تعتبر عاملاً مهماً.'),
    reshape_arabic('حالة الطقس والسطح قد تؤثر على النتائج.'),
    reshape_arabic('المراهنة تنطوي على مخاطر - الرجاء المراهنة بمسؤولية.'),
]
for note in notes:
    story.append(Paragraph('• ' + note, body_style))

story.append(Spacer(1, 20))
story.append(Paragraph('<b>' + reshape_arabic('المصدر:') + '</b> Racing Post & Emirates Racing Authority', body_style))

# Build PDF
doc.build(story)
print(f"PDF created successfully: {pdf_path}")
