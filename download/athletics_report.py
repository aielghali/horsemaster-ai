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
import os

# Register Arabic fonts
pdfmetrics.registerFont(TTFont('Microsoft YaHei', '/usr/share/fonts/truetype/chinese/msyh.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

# Register font families for bold support
registerFontFamily('Microsoft YaHei', normal='Microsoft YaHei', bold='Microsoft YaHei')
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
pdf_path = '/home/z/my-project/download/New_Elghali_Ai_Track_Field_Predictions.pdf'
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title='New Elghali Ai Track Field Predictions',
    author='Z.ai',
    creator='Z.ai',
    subject='Athletics Track and Field Race Predictions - August 24 2025'
)

# Styles
styles = getSampleStyleSheet()

# Title style
title_style = ParagraphStyle(
    name='ArabicTitle',
    fontName='Microsoft YaHei',
    fontSize=28,
    leading=40,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1F4E79'),
    spaceAfter=30
)

# Subtitle style
subtitle_style = ParagraphStyle(
    name='ArabicSubtitle',
    fontName='Microsoft YaHei',
    fontSize=16,
    leading=24,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#2E75B6'),
    spaceAfter=20
)

# Heading style
heading_style = ParagraphStyle(
    name='ArabicHeading',
    fontName='Microsoft YaHei',
    fontSize=16,
    leading=24,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#1F4E79'),
    spaceBefore=20,
    spaceAfter=12
)

# Subheading style
subheading_style = ParagraphStyle(
    name='ArabicSubheading',
    fontName='Microsoft YaHei',
    fontSize=13,
    leading=20,
    alignment=TA_LEFT,
    textColor=colors.HexColor('#2E75B6'),
    spaceBefore=15,
    spaceAfter=8
)

# Body style
body_style = ParagraphStyle(
    name='ArabicBody',
    fontName='Microsoft YaHei',
    fontSize=11,
    leading=20,
    alignment=TA_LEFT,
    textColor=colors.black,
    spaceBefore=6,
    spaceAfter=6
)

# Table cell style
cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Microsoft YaHei',
    fontSize=10,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.black
)

# Header style for tables
header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Microsoft YaHei',
    fontSize=11,
    leading=14,
    alignment=TA_CENTER,
    textColor=colors.white
)

# Build content
story = []

# Cover Page
story.append(Spacer(1, 80))
story.append(Paragraph('<b>New Elghali Ai</b>', title_style))
story.append(Paragraph('تقرير ترشيحات سباقات المضمار والميدان', subtitle_style))
story.append(Spacer(1, 30))
story.append(Paragraph('24 أغسطس 2025', subtitle_style))
story.append(Spacer(1, 50))
story.append(Paragraph('نموذج تحليل سباقات ألعاب القوى', body_style))
story.append(Paragraph('الإصدار الثاني - 2025', body_style))
story.append(PageBreak())

# Section 1: Event Overview
story.append(Paragraph('<b>القسم الأول: نظرة عامة على السباقات</b>', heading_style))
story.append(Spacer(1, 10))

story.append(Paragraph(
    'يوم 24 أغسطس 2025 شهد مجموعة متنوعة من سباقات المضمار والميدان على المستوى العالمي، '
    'تضمنت سباقات الطرق الدولية والبطولات الإقليمية واللقاءات التأهيلية. '
    'يقدم هذا التقرير تحليلاً شاملاً لأبرز السباقات والنتائج، مع ترشيحات للمسابقات القادمة.',
    body_style
))
story.append(Spacer(1, 15))

# Table 1: Today's Events
story.append(Paragraph('<b>جدول سباقات اليوم</b>', subheading_style))
story.append(Spacer(1, 10))

events_data = [
    [Paragraph('<b>السباق</b>', header_style), 
     Paragraph('<b>المكان</b>', header_style), 
     Paragraph('<b>التصنيف</b>', header_style)],
    [Paragraph('ABSA Run Your City Tshwane 10K', cell_style), 
     Paragraph('جنوب أفريقيا', cell_style), 
     Paragraph('ASA 4 - Label Race', cell_style)],
    [Paragraph('Klaverblad International High Jump', cell_style), 
     Paragraph('هولندا', cell_style), 
     Paragraph('Continental Tour Challenger', cell_style)],
    [Paragraph('Winter Track and Field Series 3', cell_style), 
     Paragraph('نيوزيلندا', cell_style), 
     Paragraph('محلي', cell_style)],
    [Paragraph('Charnwood AC Open', cell_style), 
     Paragraph('بريطانيا', cell_style), 
     Paragraph('مفتوح', cell_style)],
    [Paragraph('DSA Elit 15', cell_style), 
     Paragraph('النرويج', cell_style), 
     Paragraph('محلي', cell_style)],
]

events_table = Table(events_data, colWidths=[180, 100, 130])
events_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(events_table)
story.append(Spacer(1, 20))

# Section 2: Results Analysis
story.append(Paragraph('<b>القسم الثاني: تحليل النتائج</b>', heading_style))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>سباق ABSA Run Your City Tshwane 10K</b>', subheading_style))
story.append(Paragraph(
    'حقق كابيلو مولاودزي من جنوب أفريقيا فوزاً دراماتيكياً بزمن 29:00 دقيقة، '
    'متفوقاً على الإثيوبي أكيليو أسفو بفارق ثانية واحدة فقط في نهاية مثيرة. '
    'هذا الفوز يعكس المستوى التنافسي العالي في سباقات الطرق الأفريقية، '
    'ويؤكد تطور العدائين الجنوب أفريقيين على المستوى القاري.',
    body_style
))
story.append(Spacer(1, 10))

# Results Table
results_data = [
    [Paragraph('<b>الترتيب</b>', header_style), 
     Paragraph('<b>العداء</b>', header_style), 
     Paragraph('<b>البلد</b>', header_style),
     Paragraph('<b>الزمن</b>', header_style)],
    [Paragraph('1', cell_style), 
     Paragraph('Kabelo Mulaudzi', cell_style), 
     Paragraph('RSA', cell_style),
     Paragraph('29:00', cell_style)],
    [Paragraph('2', cell_style), 
     Paragraph('Aklilu Asfaw', cell_style), 
     Paragraph('ETH', cell_style),
     Paragraph('29:01', cell_style)],
    [Paragraph('3', cell_style), 
     Paragraph('Mohammed Abdilmejid', cell_style), 
     Paragraph('ETH', cell_style),
     Paragraph('29:10', cell_style)],
]

results_table = Table(results_data, colWidths=[60, 150, 80, 80])
results_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(results_table)
story.append(Spacer(1, 15))

story.append(Paragraph('<b>نتائج السيدات</b>', subheading_style))
story.append(Paragraph(
    'في سباق السيدات، حققت جلينروز زابا من جنوب أفريقيا زمناً ممتازاً بـ 31:50 دقيقة، '
    'مسجلة رقماً جديداً في المسار. هذا الأداء يعكس قوة المرأة العداءة في جنوب أفريقيا '
    'ويضعها كمرشحة قوية للبطولات القارية القادمة.',
    body_style
))
story.append(Spacer(1, 15))

# Diamond League Analysis
story.append(Paragraph('<b>الدوري الماسي - تحليل الأداء</b>', subheading_style))
story.append(Paragraph(
    'شهدت جولات الدوري الماسي الأخيرة في لوزان وبروكسل منافسات قوية. '
    'في سباق 100 متر رجال، حقق أوبليك سيفيل من جامايكا فوزاً لافتاً بزمن 9.87 ثانية، '
    'متفوقاً على البطل الأولمبي نو ليلز. هذا الفوز يؤكد أن سباق 100 متر يشهد تنافساً مفتوحاً '
    'مع وجود عدة مرشحين للذهبية في بطولة العالم القادمة.',
    body_style
))
story.append(Spacer(1, 20))

# Section 3: Predictions
story.append(Paragraph('<b>القسم الثالث: ترشيحات بطولة العالم طوكيو 2025</b>', heading_style))
story.append(Spacer(1, 10))

story.append(Paragraph(
    'بناءً على تحليل الأداء والنتائج الأخيرة، يقدم نموذج New Elghali Ai الترشيحات التالية '
    'لبطولة العالم لألعاب القوى التي ستقام في طوكيو خلال الفترة 13-21 سبتمبر 2025:',
    body_style
))
story.append(Spacer(1, 15))

# Predictions Table
predictions_data = [
    [Paragraph('<b>السباق</b>', header_style), 
     Paragraph('<b>المرشح الأول</b>', header_style), 
     Paragraph('<b>المرشح الثاني</b>', header_style),
     Paragraph('<b>المرشح الثالث</b>', header_style)],
    [Paragraph('100م رجال', cell_style), 
     Paragraph('Oblique Seville (JAM)', cell_style), 
     Paragraph('Noah Lyles (USA)', cell_style),
     Paragraph('Kishane Thompson (JAM)', cell_style)],
    [Paragraph('100م سيدات', cell_style), 
     Paragraph('Sha\'Carri Richardson (USA)', cell_style), 
     Paragraph('Shericka Jackson (JAM)', cell_style),
     Paragraph('Julien Alfred (LCA)', cell_style)],
    [Paragraph('200م رجال', cell_style), 
     Paragraph('Noah Lyles (USA)', cell_style), 
     Paragraph('Erriyon Knighton (USA)', cell_style),
     Paragraph('Letsile Tebogo (BWA)', cell_style)],
    [Paragraph('400م حواجز رجال', cell_style), 
     Paragraph('Karsten Warholm (NOR)', cell_style), 
     Paragraph('Rai Benjamin (USA)', cell_style),
     Paragraph('Alison dos Santos (BRA)', cell_style)],
    [Paragraph('1500م رجال', cell_style), 
     Paragraph('Jakob Ingebrigtsen (NOR)', cell_style), 
     Paragraph('Josh Kerr (GBR)', cell_style),
     Paragraph('Yared Nuguse (USA)', cell_style)],
    [Paragraph('5000م رجال', cell_style), 
     Paragraph('Grant Fisher (USA)', cell_style), 
     Paragraph('Andreas Almgren (SWE)', cell_style),
     Paragraph('Biniam Mehary (ETH)', cell_style)],
    [Paragraph('10,000م رجال', cell_style), 
     Paragraph('Joshua Cheptegei (UGA)', cell_style), 
     Paragraph('Selemon Barega (ETH)', cell_style),
     Paragraph('Grant Fisher (USA)', cell_style)],
    [Paragraph('الوثب العالي رجال', cell_style), 
     Paragraph('Mutaz Essa Barshim (QAT)', cell_style), 
     Paragraph('Gianmarco Tamberi (ITA)', cell_style),
     Paragraph('JuVaughn Harrison (USA)', cell_style)],
    [Paragraph('الوثب العالي سيدات', cell_style), 
     Paragraph('Yaroslava Mahuchikh (UKR)', cell_style), 
     Paragraph('Nicola Olyslagers (AUS)', cell_style),
     Paragraph('Eleanor Patterson (AUS)', cell_style)],
    [Paragraph('القفز بالزانة رجال', cell_style), 
     Paragraph('Armand Duplantis (SWE)', cell_style), 
     Paragraph('Ernest John Obiena (PHI)', cell_style),
     Paragraph('Sam Kendricks (USA)', cell_style)],
]

predictions_table = Table(predictions_data, colWidths=[85, 120, 120, 120])
predictions_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 9), (-1, 9), colors.white),
    ('BACKGROUND', (0, 10), (-1, 10), colors.HexColor('#F5F5F5')),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(predictions_table)
story.append(Spacer(1, 20))

# Section 4: Athletes to Watch
story.append(Paragraph('<b>القسم الرابع: رياضيون يستحقون المتابعة</b>', heading_style))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>النجم الصاعد: أوبليك سيفيل (جامايكا)</b>', subheading_style))
story.append(Paragraph(
    'بعد فوزه على نو ليلز في الدوري الماسي، أصبح سيفيل منافساً رئيسياً في سباقات 100 متر. '
    'زمنه البالغ 9.87 ثانية في ظروف سيئة يظهر إمكاناته الهائلة، ويعتبر مرشحاً قوياً للذهبية في طوكيو. '
    'يتميز سيفيل ببداية قوية وسرعة نهائية مذهلة، مما يجعله تهديداً حقيقياً لأي منافس.',
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>المتفوق المستمر: كارستن وارهولم (النرويج)</b>', subheading_style))
story.append(Paragraph(
    'يظل وارهولم الرائد في سباق 400 متر حواجز، حيث يجمع بين السرعة والتحمل والتقنية المثالية. '
    'أداءه المستمر على أعلى مستوى يجعله المرشح الأول للذهبية، رغم المنافسة الشرسة من راي بنجامين وأليسون دوس سانتوس. '
    'يتوقع أن يحسن رقمه القياسي العالمي في بطولة طوكيو.',
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>القفز الأسطوري: أرماند دوبلانتيس (السويد)</b>', subheading_style))
story.append(Paragraph(
    'يستمر دوبلانتيس في تحطيم الأرقام القياسية العالمية في القفز بالزانة، وهو مرشح حتمي للذهبية في طوكيو. '
    'السؤال ليس حول من سيفوز، بل حول أي رقم قياسي عالمي سيحققه هذه المرة. '
    'منافسه الرئيسي هو الفلبيني إيرنست جون أوبينا الذي يقدم أداءً ثابتاً على مستوى عالٍ.',
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph('<b>العداء المكتمل: جاكوب إنجيبريغتسين (النرويج)</b>', subheading_style))
story.append(Paragraph(
    'يتمتع إنجيبريغتسين بقدرة فريدة على الفوز في مسافات متعددة من 1500 متر إلى 5000 متر. '
    'سرعته النهائية وقدرته على التحكم في إيقاع السباق تجعله مرشحاً للفوز في أي سباق يشارك فيه. '
    'المنافسة مع البريطاني جوش كير تضيف إثارة لسباقات المسافات المتوسطة.',
    body_style
))
story.append(Spacer(1, 20))

# Section 5: Key Insights
story.append(Paragraph('<b>القسم الخامس: النقاط الرئيسية</b>', heading_style))
story.append(Spacer(1, 10))

insights = [
    'سباقات السرعة (100م-200م): تشهد تنافساً مفتوحاً مع وجود عدة مرشحين للذهبية، خاصة بعد صعود أوبليك سيفيل.',
    'سباقات التحمل: الإثيوبيون والكينيون يهيمنون، لكن الأمريكيون والأوروبيون يشكلون تهديداً متزايداً.',
    'سباقات الحواجز: كارستن وارهولم وفيمكه بول يسيطران على سباقات 400م حواجز.',
    'ألعاب الميدان: دوبلانتيس في القفز بالزانة وماهوتشيك في الوثب العالي يقدمان عروضاً استثنائية.',
    'الولايات المتحدة وجامايكا: تتصدران المنافسة في سباقات السرعة، مع وجود مواهب جديدة تظهر باستمرار.',
]

for insight in insights:
    story.append(Paragraph(f'• {insight}', body_style))
story.append(Spacer(1, 20))

# Footer
story.append(Paragraph('<b>ملاحظة:</b> هذه الترشيحات مبنية على تحليل نموذج New Elghali Ai للبيانات المتاحة حتى 24 أغسطس 2025.', body_style))

# Build PDF
doc.build(story)
print(f"PDF created successfully: {pdf_path}")
