#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Elghali Ai - Dynamic Horse Racing Predictions PDF Generator
This script generates professional PDF reports with Arabic text support
"""

import sys
import json
import os
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.lib.units import cm

try:
    import arabic_reshaper
    from bidi.algorithm import get_display
    ARABIC_SUPPORT = True
except ImportError:
    ARABIC_SUPPORT = False
    print("Warning: Arabic support libraries not installed. Arabic text may not display correctly.")

def reshape_arabic(text):
    """Reshape Arabic text for proper display"""
    if ARABIC_SUPPORT:
        reshaped_text = arabic_reshaper.reshape(text)
        bidi_text = get_display(reshaped_text)
        return bidi_text
    return text

def register_fonts():
    """Register fonts for the PDF"""
    font_paths = [
        ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 'DejaVuSans'),
        ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 'DejaVuSans-Bold'),
        ('/usr/share/fonts/truetype/chinese/msyh.ttf', 'Microsoft YaHei'),
        ('/usr/share/fonts/truetype/chinese/SimHei.ttf', 'SimHei'),
        ('/usr/share/fonts/truetype/english/Times-New-Roman.ttf', 'Times New Roman'),
    ]
    
    registered_fonts = {}
    
    for font_path, font_name in font_paths:
        if os.path.exists(font_path):
            try:
                pdfmetrics.registerFont(TTFont(font_name, font_path))
                registered_fonts[font_name] = True
            except Exception as e:
                print(f"Warning: Could not register font {font_name}: {e}")
    
    # Try to register font families
    if 'DejaVuSans' in registered_fonts and 'DejaVuSans-Bold' in registered_fonts:
        try:
            registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')
        except:
            pass
    
    return registered_fonts

def create_styles(registered_fonts):
    """Create paragraph styles for the PDF"""
    main_font = 'DejaVuSans' if 'DejaVuSans' in registered_fonts else 'Helvetica'
    bold_font = 'DejaVuSans-Bold' if 'DejaVuSans-Bold' in registered_fonts else 'Helvetica-Bold'
    
    styles = {}
    
    # Title style
    styles['title'] = ParagraphStyle(
        name='Title',
        fontName=bold_font,
        fontSize=28,
        leading=38,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#8B0000'),
        spaceAfter=20
    )
    
    # Subtitle style
    styles['subtitle'] = ParagraphStyle(
        name='Subtitle',
        fontName=main_font,
        fontSize=14,
        leading=22,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#4A4A4A'),
        spaceAfter=15
    )
    
    # Heading style
    styles['heading'] = ParagraphStyle(
        name='Heading',
        fontName=bold_font,
        fontSize=16,
        leading=24,
        alignment=TA_LEFT,
        textColor=colors.HexColor('#8B0000'),
        spaceBefore=18,
        spaceAfter=12
    )
    
    # Subheading style
    styles['subheading'] = ParagraphStyle(
        name='Subheading',
        fontName=bold_font,
        fontSize=12,
        leading=18,
        alignment=TA_LEFT,
        textColor=colors.HexColor('#2E75B6'),
        spaceBefore=12,
        spaceAfter=8
    )
    
    # Body style
    styles['body'] = ParagraphStyle(
        name='Body',
        fontName=main_font,
        fontSize=10,
        leading=16,
        alignment=TA_LEFT,
        textColor=colors.black,
        spaceBefore=4,
        spaceAfter=4
    )
    
    # Cell style
    styles['cell'] = ParagraphStyle(
        name='Cell',
        fontName=main_font,
        fontSize=9,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.black
    )
    
    # Header style
    styles['header'] = ParagraphStyle(
        name='Header',
        fontName=bold_font,
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.white
    )
    
    # NAP style
    styles['nap'] = ParagraphStyle(
        name='NAP',
        fontName=bold_font,
        fontSize=14,
        leading=22,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#006400'),
        spaceBefore=10,
        spaceAfter=10,
        backColor=colors.HexColor('#E8F5E9')
    )
    
    return styles

def generate_pdf(data, output_path):
    """Generate the PDF report from prediction data"""
    
    # Register fonts
    registered_fonts = register_fonts()
    styles = create_styles(registered_fonts)
    
    # Create document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm,
        title=f"Elghali Ai - {data.get('racecourse', 'Horse Racing')} Predictions",
        author='Elghali Ai',
        creator='Elghali Ai',
        subject=f"Horse Racing Predictions - {data.get('date', '')}"
    )
    
    story = []
    
    # Extract data
    racecourse = data.get('racecourse', 'Unknown')
    date = data.get('date', '')
    total_races = data.get('totalRaces', 0)
    predictions = data.get('predictions', [])
    nap_of_day = data.get('napOfTheDay', {})
    next_best = data.get('nextBest', {})
    sources = data.get('sources', [])
    
    # ===== COVER PAGE =====
    story.append(Spacer(1, 40))
    
    # Logo
    logo_path = '/home/z/my-project/public/elghali-logo.png'
    if os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=4*cm, height=4*cm)
            logo.hAlign = 'CENTER'
            story.append(logo)
        except Exception as e:
            print(f"Warning: Could not add logo: {e}")
    
    story.append(Spacer(1, 20))
    story.append(Paragraph('<b>Elghali Ai</b>', styles['title']))
    story.append(Paragraph(reshape_arabic('<b>تقرير ترشيحات سباقات الخيل</b>'), styles['subtitle']))
    story.append(Spacer(1, 15))
    story.append(Paragraph(reshape_arabic(f'مضمار {racecourse}'), styles['subtitle']))
    story.append(Paragraph(date, styles['subtitle']))
    story.append(Spacer(1, 30))
    
    # Info box
    info_data = [
        [Paragraph('<b>' + reshape_arabic('المعلومات') + '</b>', styles['header']), 
         Paragraph('<b>' + reshape_arabic('التفاصيل') + '</b>', styles['header'])],
        [Paragraph(reshape_arabic('المضمار'), styles['cell']), Paragraph(racecourse, styles['cell'])],
        [Paragraph(reshape_arabic('التاريخ'), styles['cell']), Paragraph(date, styles['cell'])],
        [Paragraph(reshape_arabic('عدد السباقات'), styles['cell']), Paragraph(reshape_arabic(f'{total_races} سباقات'), styles['cell'])],
        [Paragraph(reshape_arabic('المصادر'), styles['cell']), Paragraph(', '.join(sources[:3]) if sources else 'Multiple Sources', styles['cell'])],
    ]
    
    info_table = Table(info_data, colWidths=[140, 220])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#FFF8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(info_table)
    story.append(PageBreak())
    
    # ===== NAP OF THE DAY =====
    if nap_of_day:
        story.append(Paragraph(reshape_arabic('<b>🌟 ترشيح اليوم (NAP of the Day) 🌟</b>'), styles['nap']))
        story.append(Spacer(1, 10))
        
        nap_data = [
            [Paragraph('<b>' + reshape_arabic('الحصان') + '</b>', styles['header']),
             Paragraph('<b>' + reshape_arabic('السباق') + '</b>', styles['header']),
             Paragraph('<b>' + reshape_arabic('السبب') + '</b>', styles['header'])],
            [Paragraph(nap_of_day.get('horseName', '-'), styles['cell']),
             Paragraph(nap_of_day.get('raceName', '-'), styles['cell']),
             Paragraph(reshape_arabic(nap_of_day.get('reason', '-')[:100]), styles['cell'])]
        ]
        
        nap_table = Table(nap_data, colWidths=[100, 150, 150])
        nap_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#006400')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#E8F5E9')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(nap_table)
        story.append(Spacer(1, 20))
    
    # ===== NEXT BEST =====
    if next_best:
        story.append(Paragraph('<b>' + reshape_arabic('⭐ الترشيح الثاني (Next Best) ⭐') + '</b>', styles['heading']))
        
        next_data = [
            [Paragraph('<b>' + reshape_arabic('الحصان') + '</b>', styles['header']),
             Paragraph('<b>' + reshape_arabic('السباق') + '</b>', styles['header']),
             Paragraph('<b>' + reshape_arabic('السبب') + '</b>', styles['header'])],
            [Paragraph(next_best.get('horseName', '-'), styles['cell']),
             Paragraph(next_best.get('raceName', '-'), styles['cell']),
             Paragraph(reshape_arabic(next_best.get('reason', '-')[:100]), styles['cell'])]
        ]
        
        next_table = Table(next_data, colWidths=[100, 150, 150])
        next_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4A4A4A')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F0F0F0')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(next_table)
        story.append(Spacer(1, 25))
    
    # ===== ALL RACES SUMMARY =====
    story.append(Paragraph('<b>' + reshape_arabic('ملخص ترشيحات جميع السباقات') + '</b>', styles['heading']))
    story.append(Spacer(1, 10))
    
    summary_header = [
        Paragraph('<b>' + reshape_arabic('#') + '</b>', styles['header']),
        Paragraph('<b>' + reshape_arabic('الوقت') + '</b>', styles['header']),
        Paragraph('<b>' + reshape_arabic('السباق') + '</b>', styles['header']),
        Paragraph('<b>' + reshape_arabic('المرشح الأول') + '</b>', styles['header']),
        Paragraph('<b>' + reshape_arabic('المرشح الثاني') + '</b>', styles['header']),
        Paragraph('<b>' + reshape_arabic('المرشح الثالث') + '</b>', styles['header']),
    ]
    
    summary_data = [summary_header]
    
    for race in predictions:
        race_preds = race.get('predictions', [])
        row = [
            Paragraph(str(race.get('raceNumber', '-')), styles['cell']),
            Paragraph(race.get('raceTime', '-'), styles['cell']),
            Paragraph((race.get('raceName', '-')[:20]), styles['cell']),
            Paragraph(race_preds[0].get('horseName', '-') if race_preds else '-', styles['cell']),
            Paragraph(race_preds[1].get('horseName', '-') if len(race_preds) > 1 else '-', styles['cell']),
            Paragraph(race_preds[2].get('horseName', '-') if len(race_preds) > 2 else '-', styles['cell']),
        ]
        summary_data.append(row)
    
    summary_table = Table(summary_data, colWidths=[30, 50, 100, 85, 85, 85])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    # Alternate row colors
    for i in range(1, len(summary_data)):
        if i % 2 == 1:
            summary_table.setStyle(TableStyle([('BACKGROUND', (0, i), (-1, i), colors.HexColor('#FFF8DC'))]))
        else:
            summary_table.setStyle(TableStyle([('BACKGROUND', (0, i), (-1, i), colors.white)]))
    
    story.append(summary_table)
    story.append(PageBreak())
    
    # ===== DETAILED PREDICTIONS FOR EACH RACE =====
    story.append(Paragraph('<b>' + reshape_arabic('التفاصيل الكاملة لكل سباق') + '</b>', styles['heading']))
    story.append(Spacer(1, 15))
    
    for race in predictions:
        race_num = race.get('raceNumber', 0)
        race_name = race.get('raceName', 'Unknown Race')
        race_time = race.get('raceTime', '')
        surface = race.get('surface', '')
        race_preds = race.get('predictions', [])
        
        # Race header
        story.append(Paragraph(
            f'<b>{reshape_arabic("السباق")} {race_num}: {race_name}</b>',
            styles['subheading']
        ))
        story.append(Paragraph(
            f'{race_time} | {surface}',
            styles['body']
        ))
        
        # Predictions table for this race
        pred_header = [
            Paragraph('<b>' + reshape_arabic('المركز') + '</b>', styles['header']),
            Paragraph('<b>' + reshape_arabic('الحصان') + '</b>', styles['header']),
            Paragraph('<b>' + reshape_arabic('التصنيف') + '</b>', styles['header']),
            Paragraph('<b>' + reshape_arabic('الفارس') + '</b>', styles['header']),
            Paragraph('<b>' + reshape_arabic('الاحتمال') + '</b>', styles['header']),
        ]
        
        pred_data = [pred_header]
        
        for idx, pred in enumerate(race_preds):
            position_text = ['🥇', '🥈', '🥉'][idx] if idx < 3 else str(idx + 1)
            row = [
                Paragraph(reshape_arabic(position_text), styles['cell']),
                Paragraph(pred.get('horseName', '-'), styles['cell']),
                Paragraph(pred.get('rating', '-'), styles['cell']),
                Paragraph(pred.get('jockey', '-'), styles['cell']),
                Paragraph(pred.get('winProbability', '-'), styles['cell']),
            ]
            pred_data.append(row)
        
        pred_table = Table(pred_data, colWidths=[50, 130, 60, 100, 60])
        
        table_style = [
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8B0000')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]
        
        # Color code positions
        if len(pred_data) > 1:
            table_style.append(('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#FFD700')))  # Gold
        if len(pred_data) > 2:
            table_style.append(('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#C0C0C0')))  # Silver
        if len(pred_data) > 3:
            table_style.append(('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#CD7F32')))  # Bronze
        
        pred_table.setStyle(TableStyle(table_style))
        story.append(pred_table)
        
        # Analysis text
        if race_preds and race_preds[0].get('analysis'):
            story.append(Paragraph(
                reshape_arabic(f'تحليل: {race_preds[0].get("analysis", "")[:200]}'),
                styles['body']
            ))
        
        story.append(Spacer(1, 15))
    
    story.append(PageBreak())
    
    # ===== IMPORTANT NOTES =====
    story.append(Paragraph('<b>' + reshape_arabic('ملاحظات مهمة') + '</b>', styles['heading']))
    story.append(Spacer(1, 10))
    
    notes = [
        reshape_arabic('هذه الترشيحات مبنية على تحليل نموذج Elghali Ai للبيانات المتاحة.'),
        reshape_arabic('التصنيف (Rating) يعتبر مؤشراً رئيسياً على قدرة الخيل التنافسية.'),
        reshape_arabic('الخبرة السابقة على المضمار تعتبر عاملاً مهماً.'),
        reshape_arabic('حالة الطقس والسطح قد تؤثر على النتائج.'),
        reshape_arabic('المراهنة تنطوي على مخاطر - الرجاء المراهنة بمسؤولية.'),
    ]
    
    for note in notes:
        story.append(Paragraph(f'• {note}', styles['body']))
    
    story.append(Spacer(1, 30))
    
    # Footer
    story.append(Paragraph(
        '<b>' + reshape_arabic('المصادر:') + '</b> ' + ', '.join(sources) if sources else 'Multiple Racing Sources',
        styles['body']
    ))
    story.append(Paragraph(
        f'<b>Generated by Elghali Ai</b> | {datetime.now().strftime("%Y-%m-%d %H:%M")}',
        styles['body']
    ))
    
    # Build PDF
    doc.build(story)
    
    return output_path

def main():
    """Main function to generate PDF from JSON input"""
    if len(sys.argv) < 3:
        print("Usage: python generate_report.py <json_file> <output_pdf>")
        sys.exit(1)
    
    json_file = sys.argv[1]
    output_path = sys.argv[2]
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        sys.exit(1)
    
    try:
        generate_pdf(data, output_path)
        print(f"PDF generated successfully: {output_path}")
    except Exception as e:
        print(f"Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
