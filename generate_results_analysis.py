#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Elghali Ai - Wolverhampton Results Analysis Report
Comparison of Predictions vs Actual Results - 16 February 2026
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('SimHei', normal='SimHei', bold='SimHei')
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Colors
HEADER_COLOR = colors.HexColor('#8B0000')
SUCCESS_COLOR = colors.HexColor('#28a745')
FAIL_COLOR = colors.HexColor('#dc3545')
WARNING_COLOR = colors.HexColor('#ffc107')
TABLE_ROW_ODD = colors.HexColor('#FFF8F0')

output_path = '/home/z/my-project/download/Wolverhampton_Results_Analysis.pdf'

# Results data
results = [
    {'race': 1, 'time': '17:00', 'distance': '5f 21y',
     'winner': 'Cressida Wildes', 'winner_draw': 2, 'winner_odds': '15/2',
     'predicted': 'Alondra', 'predicted_draw': 5, 'predicted_odds': '13/8 fav',
     'nap_finished': '2nd', 'correct': False},
    {'race': 2, 'time': '17:30', 'distance': '6f 20y',
     'winner': 'Faster Bee', 'winner_draw': 9, 'winner_odds': '16/1',
     'predicted': 'Bad Habits', 'predicted_draw': 1, 'predicted_odds': '3/1',
     'nap_finished': '-', 'correct': False},
    {'race': 3, 'time': '18:00', 'distance': '6f 20y',
     'winner': "Arishka's Dream", 'winner_draw': 5, 'winner_odds': '5/2',
     'predicted': 'Lovethiswayagain', 'predicted_draw': 1, 'predicted_odds': '15/8',
     'nap_finished': '-', 'correct': False},
    {'race': 4, 'time': '18:30', 'distance': '6f 20y',
     'winner': 'Silky Wilkie', 'winner_draw': 7, 'winner_odds': '9/2',
     'predicted': 'Dandy Khan', 'predicted_draw': 7, 'predicted_odds': '3/1',
     'nap_finished': '-', 'correct': False},
    {'race': 5, 'time': '19:00', 'distance': '1m 2f 34y',
     'winner': 'Beauzon', 'winner_draw': '-', 'winner_odds': 'n/s',
     'predicted': 'Papa Cocktail', 'predicted_draw': 2, 'predicted_odds': '9/4',
     'nap_finished': '-', 'correct': False},
    {'race': 6, 'time': '19:30', 'distance': '1m 142y',
     'winner': 'Samra Star', 'winner_draw': 4, 'winner_odds': '9/1',
     'predicted': 'Diamond River', 'predicted_draw': 1, 'predicted_odds': '9/2',
     'nap_finished': '-', 'correct': False},
    {'race': 7, 'time': '20:00', 'distance': '6f 20y',
     'winner': 'Little Miss India', 'winner_draw': 4, 'winner_odds': '9/2',
     'predicted': 'Solanna', 'predicted_draw': 1, 'predicted_odds': '4/1',
     'nap_finished': '-', 'correct': False},
]

def create_pdf():
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                           rightMargin=1.5*cm, leftMargin=1.5*cm,
                           topMargin=1.5*cm, bottomMargin=1.5*cm)
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', fontName='Times New Roman', fontSize=22,
                                  leading=28, alignment=TA_CENTER, spaceAfter=12)
    heading_style = ParagraphStyle('Heading', fontName='Times New Roman', fontSize=14,
                                    leading=18, alignment=TA_LEFT, spaceBefore=12, spaceAfter=8)
    body_style = ParagraphStyle('Body', fontName='Times New Roman', fontSize=10,
                                 leading=14, alignment=TA_LEFT, spaceAfter=6)
    cell_style = ParagraphStyle('Cell', fontName='Times New Roman', fontSize=9,
                                 leading=12, alignment=TA_CENTER)
    header_style = ParagraphStyle('Header', fontName='Times New Roman', fontSize=9,
                                   leading=12, alignment=TA_CENTER, textColor=colors.white)
    
    story = []
    
    # Title
    story.append(Paragraph('<b>ELGHALI AI - RESULTS ANALYSIS</b>', title_style))
    story.append(Paragraph('Wolverhampton - 16 February 2026', 
                          ParagraphStyle('Sub', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER)))
    story.append(Spacer(1, 0.5*cm))
    
    # Summary Box
    summary_data = [
        ['Total Races', '7'],
        ['Correct Winners', '0 (0%)'],
        ['NAP in Top 3', '1 (Alondra - 2nd)'],
    ]
    summary_table = Table(summary_data, colWidths=[5*cm, 4*cm])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FFF8DC')),
        ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#D4AF37')),
        ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.5*cm))
    
    # Results Comparison Table
    story.append(Paragraph('<b>RACE BY RACE COMPARISON</b>', heading_style))
    
    table_data = [
        [Paragraph('<b>Race</b>', header_style),
         Paragraph('<b>Time</b>', header_style),
         Paragraph('<b>Winner (Draw)</b>', header_style),
         Paragraph('<b>Odds</b>', header_style),
         Paragraph('<b>Model Pick</b>', header_style),
         Paragraph('<b>Result</b>', header_style)]
    ]
    
    for r in results:
        result_color = SUCCESS_COLOR if r['correct'] else FAIL_COLOR
        result_text = '✓ CORRECT' if r['correct'] else '✗ WRONG'
        
        row = [
            Paragraph(str(r['race']), cell_style),
            Paragraph(r['time'], cell_style),
            Paragraph(f"<b>{r['winner']}</b> ({r['winner_draw']})", cell_style),
            Paragraph(r['winner_odds'], cell_style),
            Paragraph(r['predicted'], cell_style),
            Paragraph(f"<b>{result_text}</b>", 
                     ParagraphStyle('ResultCell', fontName='Times New Roman', fontSize=9,
                                   alignment=TA_CENTER, textColor=result_color))
        ]
        table_data.append(row)
    
    results_table = Table(table_data, colWidths=[1.2*cm, 1.5*cm, 4*cm, 1.5*cm, 2.5*cm, 2*cm])
    results_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    # Add alternating colors
    for i in range(1, len(results) + 1):
        results_table.setStyle(TableStyle([
            ('BACKGROUND', (0, i), (-1, i), TABLE_ROW_ODD if i % 2 == 1 else colors.white)
        ]))
    
    story.append(results_table)
    story.append(Spacer(1, 0.5*cm))
    
    # Key Findings
    story.append(Paragraph('<b>KEY FINDINGS & LESSONS LEARNED</b>', heading_style))
    
    findings = '''
<b>1. No Strong Draw Bias on This Day</b><br/>
Winning draws were distributed across all positions (2, 4, 5, 7, 9). The model's assumption of 
strong low-draw advantage in sprints was NOT validated.<br/><br/>

<b>2. Favorites Failed Completely</b><br/>
No favorite won any race today. Alondra (13/8) finished 2nd. This suggests value in opposing 
short-priced favorites at Wolverhampton.<br/><br/>

<b>3. High Odds Winners</b><br/>
- Faster Bee won at 16/1 from draw 9 (highest draw in race)<br/>
- Samra Star won at 9/1<br/>
- Cressida Wildes won at 15/2<br/><br/>

<b>4. NAP Performance</b><br/>
Alondra (NAP of the Day) finished 2nd, beaten only ¾ length. A placed finish for the NAP 
represents a reasonable outcome.
'''
    story.append(Paragraph(findings, body_style))
    story.append(Spacer(1, 0.5*cm))
    
    # Model Adjustments
    story.append(Paragraph('<b>RECOMMENDED MODEL ADJUSTMENTS</b>', heading_style))
    
    adjustments = '''
<b>1. Reduce Draw Bias Weight</b><br/>
Current: +3 for draws 1-4 in sprints<br/>
Proposed: +1 for draws 1-4, neutral for draws 5-7, +0.5 for draws 8+<br/><br/>

<b>2. Add "Value Horse" Factor</b><br/>
Horses priced 8/1 or higher should receive additional consideration, especially if they have:<br/>
- Previous all-weather form<br/>
- Trainer/jockey in form<br/><br/>

<b>3. Add "Oppose Favorite" Alert</b><br/>
When favorite is shorter than 2/1, flag for potential lay consideration.<br/><br/>

<b>4. Track-Specific Form</b><br/>
Give extra weight to horses with winning form at Wolverhampton specifically.
'''
    story.append(Paragraph(adjustments, body_style))
    
    # Footer
    story.append(Spacer(1, 1*cm))
    story.append(Paragraph('<i>Elghali Ai - Machine Learning Horse Racing Predictions</i>',
                          ParagraphStyle('Footer', fontName='Times New Roman', fontSize=8, alignment=TA_CENTER)))
    
    doc.build(story)
    print(f"PDF generated: {output_path}")

if __name__ == '__main__':
    create_pdf()
