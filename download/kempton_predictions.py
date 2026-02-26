from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
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
    "/home/z/my-project/public/Kempton_Predictions_25Feb2026.pdf",
    pagesize=A4,
    title="Kempton Predictions 25 Feb 2026",
    author="Z.ai - Elghali AI",
    creator="Z.ai",
    subject="Horse Racing Predictions - Kempton 25 February 2026"
)

story = []
styles = getSampleStyleSheet()

# Styles
title_style = ParagraphStyle(name='Title', fontName='Times New Roman', fontSize=22, alignment=TA_CENTER, spaceAfter=8)
subtitle_style = ParagraphStyle(name='Subtitle', fontName='Times New Roman', fontSize=12, alignment=TA_CENTER, spaceAfter=4)
header_style = ParagraphStyle(name='Header', fontName='Times New Roman', fontSize=10, textColor=colors.white, alignment=TA_CENTER)
cell_style = ParagraphStyle(name='Cell', fontName='Times New Roman', fontSize=8, alignment=TA_CENTER)
cell_left = ParagraphStyle(name='CellLeft', fontName='Times New Roman', fontSize=8, alignment=TA_LEFT)
pick_style = ParagraphStyle(name='Pick', fontName='Times New Roman', fontSize=10, alignment=TA_LEFT, spaceBefore=6, spaceAfter=4)
race_header = ParagraphStyle(name='RaceHeader', fontName='Times New Roman', fontSize=14, alignment=TA_LEFT, spaceBefore=12, spaceAfter=6)
gold_style = ParagraphStyle(name='Gold', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#DAA520'))
silver_style = ParagraphStyle(name='Silver', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#808080'))
bronze_style = ParagraphStyle(name='Bronze', fontName='Times New Roman', fontSize=10, alignment=TA_CENTER, textColor=colors.HexColor('#CD7F32'))

# Cover Page
story.append(Spacer(1, 80))
story.append(Paragraph("<b>🏇 KEMPTON PARK RACECARD</b>", title_style))
story.append(Paragraph("<b>& PREDICTIONS</b>", title_style))
story.append(Spacer(1, 20))
story.append(Paragraph("Wednesday 25th February 2026", subtitle_style))
story.append(Paragraph("Polytrack | Going: Standard to Slow | Weather: Mostly Sunny", subtitle_style))
story.append(Spacer(1, 30))
story.append(Paragraph("<b>7 Races | Artificial Intelligence Analysis</b>", subtitle_style))
story.append(Spacer(1, 20))
story.append(Paragraph("Powered by Elghali AI v26.0", subtitle_style))
story.append(PageBreak())

# Race 1
story.append(Paragraph("<b>RACE 1 - 17:05 (5:05 PM)</b>", race_header))
story.append(Paragraph("<b>Unibet Support Safer Gambling Handicap (Class 6)</b>", subtitle_style))
story.append(Paragraph("3yo 0-55 | 7 Furlongs | Prize: £3,140 | 11 Runners", subtitle_style))
story.append(Spacer(1, 8))

# Race 1 table
r1_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>Horse</b>', header_style), Paragraph('<b>Jockey</b>', header_style), 
     Paragraph('<b>Trainer</b>', header_style), Paragraph('<b>OR</b>', header_style), Paragraph('<b>RPR</b>', header_style), Paragraph('<b>Odds</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Electrocution', cell_left), Paragraph('J Haynes', cell_style), 
     Paragraph('Chelsea Banham', cell_style), Paragraph('55', cell_style), Paragraph('63', cell_style), Paragraph('11/4', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Private Project (IRE)', cell_left), Paragraph('D Keenan', cell_style), 
     Paragraph('Pat Phelan', cell_style), Paragraph('55', cell_style), Paragraph('-', cell_style), Paragraph('50/1', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Giles Glory', cell_left), Paragraph('C Fallon', cell_style), 
     Paragraph('Joseph Parr', cell_style), Paragraph('55', cell_style), Paragraph('63', cell_style), Paragraph('9/2', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Telling Time', cell_left), Paragraph('F Marsh', cell_style), 
     Paragraph('C Longsdon', cell_style), Paragraph('55', cell_style), Paragraph('60', cell_style), Paragraph('12/1', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Hove Ranger', cell_left), Paragraph('T Queally', cell_style), 
     Paragraph('G & J Moore', cell_style), Paragraph('54', cell_style), Paragraph('62', cell_style), Paragraph('100/30', cell_style)],
    [Paragraph('6', cell_style), Paragraph('Hamish Leek', cell_left), Paragraph('J Mitchell', cell_style), 
     Paragraph('J Horton', cell_style), Paragraph('53', cell_style), Paragraph('58', cell_style), Paragraph('9/1', cell_style)],
    [Paragraph('7', cell_style), Paragraph('Starakova (NR)', cell_left), Paragraph('R Ryan', cell_style), 
     Paragraph('W Greatrex', cell_style), Paragraph('53', cell_style), Paragraph('61', cell_style), Paragraph('25/1', cell_style)],
    [Paragraph('8', cell_style), Paragraph('Grand Echo', cell_left), Paragraph('T Heard', cell_style), 
     Paragraph('M Usher', cell_style), Paragraph('52', cell_style), Paragraph('57', cell_style), Paragraph('50/1', cell_style)],
    [Paragraph('9', cell_style), Paragraph('Saturday Again', cell_left), Paragraph('P Bradley', cell_style), 
     Paragraph('S Dow', cell_style), Paragraph('50', cell_style), Paragraph('58', cell_style), Paragraph('11/2', cell_style)],
    [Paragraph('10', cell_style), Paragraph('Lady Birgma', cell_left), Paragraph('P Edwards', cell_style), 
     Paragraph('M Usher', cell_style), Paragraph('46', cell_style), Paragraph('59', cell_style), Paragraph('50/1', cell_style)],
    [Paragraph('11', cell_style), Paragraph('Dawn Melody', cell_left), Paragraph("K O'Neill", cell_style), 
     Paragraph('R Cook & J Bridger', cell_style), Paragraph('46', cell_style), Paragraph('55', cell_style), Paragraph('50/1', cell_style)],
]

r1_table = Table(r1_data, colWidths=[20, 90, 55, 80, 25, 25, 35])
r1_table.setStyle(TableStyle([
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
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(r1_table)
story.append(Spacer(1, 8))

# Predictions Race 1
story.append(Paragraph("<b>🥇 TOP PICK: Electrocution</b> - Highest RPR (63), favorite at 11/4, consistent form", pick_style))
story.append(Paragraph("<b>🥈 DANGER: Hove Ranger</b> - Strong RPR (62), good odds at 100/30", pick_style))
story.append(Paragraph("<b>🥉 VALUE: Giles Glory</b> - Equal best RPR (63), each-way value at 9/2", pick_style))
story.append(Spacer(1, 12))

# Race 2
story.append(Paragraph("<b>RACE 2 - 17:40 (5:40 PM)</b>", race_header))
story.append(Paragraph("<b>Try Unibet's New Improved Acca Boosts Novice Stakes (Class 4)</b>", subtitle_style))
story.append(Paragraph("4yo+ | 7 Furlongs | Prize: £5,400 | 5 Runners", subtitle_style))
story.append(Spacer(1, 8))

r2_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>Horse</b>', header_style), Paragraph('<b>Jockey</b>', header_style), 
     Paragraph('<b>Trainer</b>', header_style), Paragraph('<b>OR</b>', header_style), Paragraph('<b>RPR</b>', header_style), Paragraph('<b>Odds</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Marlborough Place', cell_left), Paragraph('T Langley', cell_style), 
     Paragraph('A Wintle', cell_style), Paragraph('89', cell_style), Paragraph('-', cell_style), Paragraph('8/1', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Pulsar Star', cell_left), Paragraph('R Havlin', cell_style), 
     Paragraph('T Faulkner', cell_style), Paragraph('72', cell_style), Paragraph('85', cell_style), Paragraph('7/1', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Ablon', cell_left), Paragraph('S Levey', cell_style), 
     Paragraph('R Hannon', cell_style), Paragraph('69', cell_style), Paragraph('87', cell_style), Paragraph('7/4', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Cosi Bear', cell_left), Paragraph('D Muscutt', cell_style), 
     Paragraph('J Fanshawe', cell_style), Paragraph('-', cell_style), Paragraph('-', cell_style), Paragraph('13/2', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Holly Mist', cell_left), Paragraph('J Mitchell', cell_style), 
     Paragraph('R Varian', cell_style), Paragraph('64', cell_style), Paragraph('88', cell_style), Paragraph('13/8', cell_style)],
]

r2_table = Table(r2_data, colWidths=[20, 90, 55, 80, 25, 25, 35])
r2_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(r2_table)
story.append(Spacer(1, 8))

story.append(Paragraph("<b>🥇 TOP PICK: Holly Mist</b> - Best RPR (88), Roger Varian yard, favorite at 13/8", pick_style))
story.append(Paragraph("<b>🥈 DANGER: Ablon</b> - High RPR (87), Richard Hannon stable in good form", pick_style))
story.append(Paragraph("<b>🥉 VALUE: Pulsar Star</b> - Solid RPR (85), each-way value at 7/1", pick_style))
story.append(Spacer(1, 12))

# Race 3
story.append(Paragraph("<b>RACE 3 - 18:10 (6:10 PM)</b>", race_header))
story.append(Paragraph("<b>Bet £20 Get £20 With Unibet Handicap (Class 3)</b>", subtitle_style))
story.append(Paragraph("4yo+ 0-95 | 7 Furlongs | Prize: £8,374 | 5 Runners", subtitle_style))
story.append(Spacer(1, 8))

r3_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>Horse</b>', header_style), Paragraph('<b>Jockey</b>', header_style), 
     Paragraph('<b>Trainer</b>', header_style), Paragraph('<b>OR</b>', header_style), Paragraph('<b>RPR</b>', header_style), Paragraph('<b>Odds</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Popmaster', cell_left), Paragraph('A Lewis', cell_style), 
     Paragraph('Ed Walker', cell_style), Paragraph('97', cell_style), Paragraph('107', cell_style), Paragraph('15/8', cell_style)],
    [Paragraph('2', cell_style), Paragraph('God Of War', cell_left), Paragraph('J Callan', cell_style), 
     Paragraph('T Clover', cell_style), Paragraph('96', cell_style), Paragraph('104', cell_style), Paragraph('11/2', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Kingdom Come', cell_left), Paragraph('R Ryan', cell_style), 
     Paragraph('Clive Cox', cell_style), Paragraph('96', cell_style), Paragraph('106', cell_style), Paragraph('7/2', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Nikovo', cell_left), Paragraph('J Hart', cell_style), 
     Paragraph('M Herrington', cell_style), Paragraph('91', cell_style), Paragraph('108', cell_style), Paragraph('4/1', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Brunel Nation', cell_left), Paragraph('T Heard', cell_style), 
     Paragraph('R Hughes', cell_style), Paragraph('76', cell_style), Paragraph('109', cell_style), Paragraph('11/2', cell_style)],
]

r3_table = Table(r3_data, colWidths=[20, 90, 55, 80, 25, 25, 35])
r3_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(r3_table)
story.append(Spacer(1, 8))

story.append(Paragraph("<b>🥇 TOP PICK: Brunel Nation</b> - Highest RPR (109), massive each-way value at 11/2", pick_style))
story.append(Paragraph("<b>🥈 DANGER: Nikovo</b> - Strong RPR (108), solid contender at 4/1", pick_style))
story.append(Paragraph("<b>🥉 VALUE: Popmaster</b> - Top OR (97), consistent favorite at 15/8", pick_style))
story.append(PageBreak())

# Race 4
story.append(Paragraph("<b>RACE 4 - 18:40 (6:40 PM)</b>", race_header))
story.append(Paragraph("<b>Try Unibet's New Smartview Racecards Handicap (Class 5)</b>", subtitle_style))
story.append(Paragraph("4yo+ 0-70 | 1 Mile | Prize: £4,187 | 12 Runners", subtitle_style))
story.append(Spacer(1, 8))

r4_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>Horse</b>', header_style), Paragraph('<b>Jockey</b>', header_style), 
     Paragraph('<b>OR</b>', header_style), Paragraph('<b>RPR</b>', header_style), Paragraph('<b>Odds</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Tronido', cell_left), Paragraph('P Bradley', cell_style), 
     Paragraph('70', cell_style), Paragraph('79', cell_style), Paragraph('14/1', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Pursuit Of Truth', cell_left), Paragraph('K Fraser', cell_style), 
     Paragraph('70', cell_style), Paragraph('79', cell_style), Paragraph('50/1', cell_style)],
    [Paragraph('3', cell_style), Paragraph('I Am Me', cell_left), Paragraph('C Fallon', cell_style), 
     Paragraph('68', cell_style), Paragraph('86', cell_style), Paragraph('5/1', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Rhythm N Rock (NR)', cell_left), Paragraph('R Ryan', cell_style), 
     Paragraph('68', cell_style), Paragraph('84', cell_style), Paragraph('13/2', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Top Of The Class', cell_left), Paragraph('B Loughnane', cell_style), 
     Paragraph('67', cell_style), Paragraph('86', cell_style), Paragraph('15/2', cell_style)],
    [Paragraph('6', cell_style), Paragraph('Penfolds Grange', cell_left), Paragraph('D Muscutt', cell_style), 
     Paragraph('67', cell_style), Paragraph('82', cell_style), Paragraph('11/1', cell_style)],
    [Paragraph('7', cell_style), Paragraph('Holy Fire', cell_left), Paragraph('C Shepherd', cell_style), 
     Paragraph('66', cell_style), Paragraph('83', cell_style), Paragraph('11/2', cell_style)],
    [Paragraph('8', cell_style), Paragraph('Apache Green', cell_left), Paragraph("K O'Neill", cell_style), 
     Paragraph('66', cell_style), Paragraph('82', cell_style), Paragraph('9/2', cell_style)],
    [Paragraph('9', cell_style), Paragraph('Luminous Warrior', cell_left), Paragraph('S Levey', cell_style), 
     Paragraph('66', cell_style), Paragraph('82', cell_style), Paragraph('9/1', cell_style)],
    [Paragraph('10', cell_style), Paragraph('Enpassant', cell_left), Paragraph('J Mitchell', cell_style), 
     Paragraph('63', cell_style), Paragraph('81', cell_style), Paragraph('12/1', cell_style)],
    [Paragraph('11', cell_style), Paragraph('Bronte Beach', cell_left), Paragraph('J Hart', cell_style), 
     Paragraph('62', cell_style), Paragraph('78', cell_style), Paragraph('16/1', cell_style)],
    [Paragraph('12', cell_style), Paragraph('Simply Blue', cell_left), Paragraph('A Lewis', cell_style), 
     Paragraph('57', cell_style), Paragraph('81', cell_style), Paragraph('12/1', cell_style)],
]

r4_table = Table(r4_data, colWidths=[20, 110, 70, 35, 35, 40])
r4_table.setStyle(TableStyle([
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
    ('BACKGROUND', (0, 12), (-1, 12), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 2),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
]))
story.append(r4_table)
story.append(Spacer(1, 8))

story.append(Paragraph("<b>🥇 TOP PICK: I Am Me</b> - Best RPR (86), each-way value at 5/1", pick_style))
story.append(Paragraph("<b>🥈 DANGER: Top Of The Class</b> - Equal best RPR (86), Billy Loughnane on board", pick_style))
story.append(Paragraph("<b>🥉 VALUE: Apache Green</b> - Solid RPR (82), favorite at 9/2", pick_style))
story.append(Spacer(1, 12))

# Race 5 - Kentucky Derby Qualifier
story.append(Paragraph("<b>RACE 5 - 19:10 (7:10 PM) ⭐ FEATURE RACE</b>", race_header))
story.append(Paragraph("<b>'European Road To The Kentucky Derby' Conditions Stakes</b>", subtitle_style))
story.append(Paragraph("3yo | 1 Mile | Prize: £30,924 | 4 Runners | GBB Race", subtitle_style))
story.append(Spacer(1, 8))

r5_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>Horse</b>', header_style), Paragraph('<b>Jockey</b>', header_style), 
     Paragraph('<b>Trainer</b>', header_style), Paragraph('<b>OR</b>', header_style), Paragraph('<b>RPR</b>', header_style), Paragraph('<b>Odds</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Hidden Force', cell_left), Paragraph('W Buick', cell_style), 
     Paragraph('C Appleby', cell_style), Paragraph('71', cell_style), Paragraph('104', cell_style), Paragraph('8/15', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Tadej', cell_left), Paragraph('H Doyle', cell_style), 
     Paragraph('A Watson', cell_style), Paragraph('105', cell_style), Paragraph('109', cell_style), Paragraph('5/1', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Utmost Good Faith', cell_left), Paragraph('D Muscutt', cell_style), 
     Paragraph('G Boughey', cell_style), Paragraph('89', cell_style), Paragraph('95', cell_style), Paragraph('8/1', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Venetian Prince', cell_left), Paragraph('PJ McDonald', cell_style), 
     Paragraph('A Balding', cell_style), Paragraph('87', cell_style), Paragraph('93', cell_style), Paragraph('11/2', cell_style)],
]

r5_table = Table(r5_data, colWidths=[20, 90, 55, 80, 25, 25, 35])
r5_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(r5_table)
story.append(Spacer(1, 8))

story.append(Paragraph("<b>🥇 TOP PICK: Tadej</b> - Highest RPR (109), Archie Watson + Hollie Doyle combo, value at 5/1", pick_style))
story.append(Paragraph("<b>🥈 DANGER: Hidden Force</b> - Charlie Appleby + William Buick, Godolphin runner at 8/15", pick_style))
story.append(Paragraph("<b>🥉 VALUE: Venetian Prince</b> - Andrew Balding yard, each-way at 11/2", pick_style))
story.append(Spacer(1, 12))

# Race 6
story.append(Paragraph("<b>RACE 6 - 19:40 (7:40 PM)</b>", race_header))
story.append(Paragraph("<b>Get Best Odds Guaranteed At Unibet Handicap (Class 4)</b>", subtitle_style))
story.append(Paragraph("3yo 0-85 | 1m2f219y | Prize: £6,281 | 5 Runners", subtitle_style))
story.append(Spacer(1, 8))

r6_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>Horse</b>', header_style), Paragraph('<b>Jockey</b>', header_style), 
     Paragraph('<b>Trainer</b>', header_style), Paragraph('<b>OR</b>', header_style), Paragraph('<b>RPR</b>', header_style), Paragraph('<b>Odds</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Parisian Scholar', cell_left), Paragraph('J Hart', cell_style), 
     Paragraph('C Johnston', cell_style), Paragraph('79', cell_style), Paragraph('85', cell_style), Paragraph('5/1', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Helga', cell_left), Paragraph('C Hutchinson', cell_style), 
     Paragraph('A Balding', cell_style), Paragraph('77', cell_style), Paragraph('87', cell_style), Paragraph('11/4', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Toastmaster', cell_left), Paragraph('R Havlin', cell_style), 
     Paragraph('S & E Crisford', cell_style), Paragraph('75', cell_style), Paragraph('92', cell_style), Paragraph('100/30', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Only In Manila', cell_left), Paragraph('H Davies', cell_style), 
     Paragraph('S & E Crisford', cell_style), Paragraph('75', cell_style), Paragraph('85', cell_style), Paragraph('3/1', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Moment Of Light', cell_left), Paragraph('P Cosgrave', cell_style), 
     Paragraph('J Owen', cell_style), Paragraph('72', cell_style), Paragraph('88', cell_style), Paragraph('4/1', cell_style)],
]

r6_table = Table(r6_data, colWidths=[20, 90, 55, 80, 25, 25, 35])
r6_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(r6_table)
story.append(Spacer(1, 8))

story.append(Paragraph("<b>🥇 TOP PICK: Toastmaster</b> - Best RPR (92), Crisford yard in form, value at 100/30", pick_style))
story.append(Paragraph("<b>🥈 DANGER: Moment Of Light</b> - Strong RPR (88), each-way at 4/1", pick_style))
story.append(Paragraph("<b>🥉 VALUE: Helga</b> - Andrew Balding runner, favorite at 11/4", pick_style))
story.append(PageBreak())

# Race 7
story.append(Paragraph("<b>RACE 7 - 20:10 (8:10 PM)</b>", race_header))
story.append(Paragraph("<b>Get Daily Price Boosts At Unibet Handicap (Class 5)</b>", subtitle_style))
story.append(Paragraph("4yo+ 0-75 | 6 Furlongs | Prize: £4,187 | 7 Runners", subtitle_style))
story.append(Spacer(1, 8))

r7_data = [
    [Paragraph('<b>#</b>', header_style), Paragraph('<b>Horse</b>', header_style), Paragraph('<b>Jockey</b>', header_style), 
     Paragraph('<b>Trainer</b>', header_style), Paragraph('<b>OR</b>', header_style), Paragraph('<b>RPR</b>', header_style), Paragraph('<b>Odds</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Tyger Bay', cell_left), Paragraph('J Gilligan', cell_style), 
     Paragraph('C Allen', cell_style), Paragraph('75', cell_style), Paragraph('86', cell_style), Paragraph('4/1', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Combustion', cell_left), Paragraph('J Haynes', cell_style), 
     Paragraph('C Banham', cell_style), Paragraph('73', cell_style), Paragraph('85', cell_style), Paragraph('5/2', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Em Four', cell_left), Paragraph('C Whiteley', cell_style), 
     Paragraph('J Osborne', cell_style), Paragraph('73', cell_style), Paragraph('87', cell_style), Paragraph('9/2', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Invincible Speed', cell_left), Paragraph('B Loughnane', cell_style), 
     Paragraph('M Loughnane', cell_style), Paragraph('73', cell_style), Paragraph('86', cell_style), Paragraph('6/1', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Serenity Dream', cell_left), Paragraph('J Doughty', cell_style), 
     Paragraph('T Carroll', cell_style), Paragraph('71', cell_style), Paragraph('86', cell_style), Paragraph('10/1', cell_style)],
    [Paragraph('6', cell_style), Paragraph('Jesse Luc', cell_left), Paragraph('C Shepherd', cell_style), 
     Paragraph('M Murphy', cell_style), Paragraph('70', cell_style), Paragraph('86', cell_style), Paragraph('6/1', cell_style)],
    [Paragraph('7', cell_style), Paragraph('Distant Rumble', cell_left), Paragraph('C Fallon', cell_style), 
     Paragraph('R Teal', cell_style), Paragraph('67', cell_style), Paragraph('84', cell_style), Paragraph('14/1', cell_style)],
]

r7_table = Table(r7_data, colWidths=[20, 90, 55, 80, 25, 25, 35])
r7_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
]))
story.append(r7_table)
story.append(Spacer(1, 8))

story.append(Paragraph("<b>🥇 TOP PICK: Em Four</b> - Best RPR (87), each-way value at 9/2", pick_style))
story.append(Paragraph("<b>🥈 DANGER: Combustion</b> - Strong RPR (85), favorite at 5/2", pick_style))
story.append(Paragraph("<b>🥉 VALUE: Serenity Dream</b> - Good RPR (86), big odds at 10/1", pick_style))
story.append(Spacer(1, 20))

# Summary - Best Bets
story.append(Paragraph("<b>═══════════════════════════════════════</b>", subtitle_style))
story.append(Paragraph("<b>🏆 SUMMARY - BEST BETS OF THE DAY</b>", race_header))
story.append(Paragraph("<b>═══════════════════════════════════════</b>", subtitle_style))
story.append(Spacer(1, 12))

# Best Bets Table
best_bets = [
    [Paragraph('<b>Race</b>', header_style), Paragraph('<b>Time</b>', header_style), Paragraph('<b>🥇 TOP PICK</b>', header_style), 
     Paragraph('<b>Odds</b>', header_style), Paragraph('<b>Confidence</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('17:05', cell_style), Paragraph('Electrocution', cell_left), 
     Paragraph('11/4', cell_style), Paragraph('⭐⭐⭐⭐', cell_style)],
    [Paragraph('2', cell_style), Paragraph('17:40', cell_style), Paragraph('Holly Mist', cell_left), 
     Paragraph('13/8', cell_style), Paragraph('⭐⭐⭐⭐⭐', cell_style)],
    [Paragraph('3', cell_style), Paragraph('18:10', cell_style), Paragraph('Brunel Nation', cell_left), 
     Paragraph('11/2', cell_style), Paragraph('⭐⭐⭐', cell_style)],
    [Paragraph('4', cell_style), Paragraph('18:40', cell_style), Paragraph('I Am Me', cell_left), 
     Paragraph('5/1', cell_style), Paragraph('⭐⭐⭐⭐', cell_style)],
    [Paragraph('5 ⭐', cell_style), Paragraph('19:10', cell_style), Paragraph('Tadej', cell_left), 
     Paragraph('5/1', cell_style), Paragraph('⭐⭐⭐⭐⭐', cell_style)],
    [Paragraph('6', cell_style), Paragraph('19:40', cell_style), Paragraph('Toastmaster', cell_left), 
     Paragraph('100/30', cell_style), Paragraph('⭐⭐⭐⭐', cell_style)],
    [Paragraph('7', cell_style), Paragraph('20:10', cell_style), Paragraph('Em Four', cell_left), 
     Paragraph('9/2', cell_style), Paragraph('⭐⭐⭐', cell_style)],
]

bb_table = Table(best_bets, colWidths=[35, 40, 100, 40, 70])
bb_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#DAA520')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#FFFACD')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#FFFACD')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor('#FFD700')),
    ('BACKGROUND', (0, 6), (-1, 6), colors.white),
    ('BACKGROUND', (0, 7), (-1, 7), colors.HexColor('#FFFACD')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
]))
story.append(bb_table)
story.append(Spacer(1, 20))

# NAP
story.append(Paragraph("<b>💎 NAP (Nap of the Day): Tadej - Race 5 @ 5/1</b>", pick_style))
story.append(Paragraph("Highest RPR in the Kentucky Derby qualifier, Archie Watson stable in excellent form, Hollie Doyle booking is a positive. Each-way recommended.", pick_style))
story.append(Spacer(1, 12))

story.append(Paragraph("<b>🔥 Best Each-Way Value: Brunel Nation - Race 3 @ 11/2</b>", pick_style))
story.append(Paragraph("Highest RPR (109) in the race but overlooked in the market. Richard Hughes yard can surprise.", pick_style))
story.append(Spacer(1, 20))

story.append(Paragraph("<b>Data Source:</b> Racing Post, At The Races, Timeform", subtitle_style))
story.append(Paragraph("Generated by Elghali AI v26.0 | 25 February 2026", subtitle_style))

doc.build(story)
print("✓ PDF created successfully!")
