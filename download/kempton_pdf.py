from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/Kempton_Racecard_25_Feb_2026.pdf",
    pagesize=A4,
    title="Kempton Racecard 25 Feb 2026",
    author="Z.ai",
    creator="Z.ai",
    subject="Horse Racing Racecard"
)

story = []
styles = getSampleStyleSheet()

# Title style
title_style = ParagraphStyle(
    name='Title',
    fontName='Times New Roman',
    fontSize=24,
    alignment=TA_CENTER,
    spaceAfter=12
)

# Subtitle style
subtitle_style = ParagraphStyle(
    name='Subtitle',
    fontName='Times New Roman',
    fontSize=14,
    alignment=TA_CENTER,
    spaceAfter=6
)

# Header style
header_style = ParagraphStyle(
    name='Header',
    fontName='Times New Roman',
    fontSize=12,
    textColor=colors.white,
    alignment=TA_CENTER
)

# Cell style
cell_style = ParagraphStyle(
    name='Cell',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)

# Cell left style
cell_left = ParagraphStyle(
    name='CellLeft',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_LEFT
)

# Section header
section_style = ParagraphStyle(
    name='Section',
    fontName='Times New Roman',
    fontSize=14,
    alignment=TA_LEFT,
    spaceBefore=12,
    spaceAfter=6
)

# Title
story.append(Paragraph("<b>Kempton Racecard</b>", title_style))
story.append(Paragraph("Wednesday 25th February 2026", subtitle_style))
story.append(Paragraph("Polytrack | Going: Standard to Slow | Weather: Mostly Sunny", subtitle_style))
story.append(Spacer(1, 20))

# Race 1
story.append(Paragraph("<b>Race 1 - 17:05 (5:05 PM)</b>", section_style))
story.append(Paragraph("<b>Unibet Support Safer Gambling Handicap (Class 6)</b>", subtitle_style))
story.append(Paragraph("3yo 0-55 | 7 Furlongs | Prize: £3,140 | 11 Runners", subtitle_style))
story.append(Spacer(1, 12))

# Table data
headers = ['No', 'Horse', 'Age', 'Wgt', 'Jockey', 'Trainer', 'OR', 'TS', 'RPR']
data = [
    [Paragraph('<b>No</b>', header_style), Paragraph('<b>Horse</b>', header_style), 
     Paragraph('<b>Age</b>', header_style), Paragraph('<b>Wgt</b>', header_style),
     Paragraph('<b>Jockey</b>', header_style), Paragraph('<b>Trainer</b>', header_style),
     Paragraph('<b>OR</b>', header_style), Paragraph('<b>TS</b>', header_style), Paragraph('<b>RPR</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Electrocution', cell_left), Paragraph('23', cell_style),
     Paragraph('9-9', cell_style), Paragraph('Joey Haynes', cell_style), Paragraph('Chelsea Banham', cell_style),
     Paragraph('55', cell_style), Paragraph('56', cell_style), Paragraph('63', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Private Project (IRE)', cell_left), Paragraph('169', cell_style),
     Paragraph('9-9', cell_style), Paragraph('Darragh Keenan', cell_style), Paragraph('Pat Phelan', cell_style),
     Paragraph('55', cell_style), Paragraph('57', cell_style), Paragraph('-', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Giles Glory', cell_left), Paragraph('34', cell_style),
     Paragraph('9-9', cell_style), Paragraph('Cieren Fallon', cell_style), Paragraph('Joseph Parr', cell_style),
     Paragraph('55', cell_style), Paragraph('49', cell_style), Paragraph('63', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Telling Time', cell_left), Paragraph('22', cell_style),
     Paragraph('9-9', cell_style), Paragraph('Finley Marsh', cell_style), Paragraph('Charlie Longsdon', cell_style),
     Paragraph('55', cell_style), Paragraph('33', cell_style), Paragraph('60', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Hove Ranger', cell_left), Paragraph('42', cell_style),
     Paragraph('9-8', cell_style), Paragraph('Tom Queally', cell_style), Paragraph('Gary & Josh Moore', cell_style),
     Paragraph('54', cell_style), Paragraph('49', cell_style), Paragraph('62', cell_style)],
    [Paragraph('6', cell_style), Paragraph('Hamish Leek', cell_left), Paragraph('22', cell_style),
     Paragraph('9-7', cell_style), Paragraph('Jack Mitchell', cell_style), Paragraph('James Horton', cell_style),
     Paragraph('53', cell_style), Paragraph('37', cell_style), Paragraph('58', cell_style)],
    [Paragraph('7', cell_style), Paragraph('Starakova (NR)', cell_left), Paragraph('155', cell_style),
     Paragraph('9-7', cell_style), Paragraph('Rossa Ryan', cell_style), Paragraph('Warren Greatrex', cell_style),
     Paragraph('53', cell_style), Paragraph('17', cell_style), Paragraph('61', cell_style)],
    [Paragraph('8', cell_style), Paragraph('Grand Echo', cell_left), Paragraph('42', cell_style),
     Paragraph('9-6', cell_style), Paragraph('Tyler Heard', cell_style), Paragraph('Mark Usher', cell_style),
     Paragraph('52', cell_style), Paragraph('41', cell_style), Paragraph('57', cell_style)],
    [Paragraph('9', cell_style), Paragraph('Saturday Again', cell_left), Paragraph('27', cell_style),
     Paragraph('9-4', cell_style), Paragraph('Paddy Bradley', cell_style), Paragraph('Simon Dow', cell_style),
     Paragraph('50', cell_style), Paragraph('24', cell_style), Paragraph('58', cell_style)],
    [Paragraph('10', cell_style), Paragraph('Lady Birgma', cell_left), Paragraph('29', cell_style),
     Paragraph('9-0', cell_style), Paragraph('Phoebe Edwards', cell_style), Paragraph('Mark Usher', cell_style),
     Paragraph('46', cell_style), Paragraph('40', cell_style), Paragraph('59', cell_style)],
    [Paragraph('11', cell_style), Paragraph('Dawn Melody', cell_left), Paragraph('42', cell_style),
     Paragraph('9-0', cell_style), Paragraph("Kieran O'Neill", cell_style), Paragraph('Rachel Cook & John Bridger', cell_style),
     Paragraph('46', cell_style), Paragraph('17', cell_style), Paragraph('55', cell_style)],
]

table = Table(data, colWidths=[25, 100, 25, 30, 75, 100, 25, 25, 25])
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
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
    ('BACKGROUND', (0, 11), (-1, 11), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))

story.append(table)
story.append(Spacer(1, 6))
story.append(Paragraph("Table 1: Race 1 Runners and Form", subtitle_style))

# Race times summary
story.append(Spacer(1, 20))
story.append(Paragraph("<b>Today's Races at Kempton:</b>", section_style))

race_times = [
    "17:05 - Unibet Support Safer Gambling Handicap (Class 6)",
    "17:40 - Race 2",
    "18:10 - Race 3", 
    "18:40 - Race 4",
    "19:10 - Race 5",
    "19:40 - Race 6",
    "20:10 - Race 7"
]

for race in race_times:
    story.append(Paragraph(race, subtitle_style))

story.append(Spacer(1, 20))
story.append(Paragraph("<b>Data Source:</b> Racing Post, At The Races", subtitle_style))
story.append(Paragraph("URL: https://www.attheraces.com/racecards/Kempton/25-February-2026", subtitle_style))

doc.build(story)
print("PDF created successfully!")
