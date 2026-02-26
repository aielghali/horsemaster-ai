import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { racecourse, date, totalRaces, predictions, napOfTheDay, nextBest } = data

    if (!racecourse || !date) {
      return NextResponse.json(
        { success: false, message: 'Racecourse and date are required' },
        { status: 400 }
      )
    }

    // On Vercel, we can't generate PDFs with Python
    // Return success without PDF for now
    const pdfFilename = `Elghali_Ai_${racecourse.replace(/\s+/g, '_')}_${date.replace(/-/g, '')}.pdf`
    
    return NextResponse.json({
      success: true,
      pdfPath: null,
      absolutePath: null,
      filename: pdfFilename,
      message: 'PDF generation not available on Vercel - predictions generated successfully'
    })

  } catch (error) {
    console.error('Generate report error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to generate report' 
      },
      { status: 500 }
    )
  }
}
