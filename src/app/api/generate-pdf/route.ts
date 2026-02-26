import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export interface PredictionData {
  racecourse: string;
  date: string;
  totalRaces: number;
  predictions: {
    raceNumber: number;
    raceName: string;
    raceTime: string;
    surface: string;
    predictions: {
      position: number;
      horseName: string;
      rating: string;
      jockey: string;
      winProbability: string;
      analysis: string;
    }[];
  }[];
  napOfTheDay: {
    horseName: string;
    raceName: string;
    reason: string;
  };
  nextBest: {
    horseName: string;
    raceName: string;
    reason: string;
  };
  sources: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data: PredictionData = await request.json();
    
    // Validate input
    if (!data.racecourse || !data.date) {
      return NextResponse.json(
        { success: false, message: 'Racecourse and date are required' },
        { status: 400 }
      );
    }
    
    // Create download directory if it doesn't exist
    const downloadDir = path.join(process.cwd(), 'download');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    
    // Create temp JSON file
    const timestamp = Date.now();
    const jsonFileName = `predictions_${timestamp}.json`;
    const jsonFilePath = path.join(downloadDir, jsonFileName);
    
    // Write JSON data to file
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
    
    // Generate PDF filename
    const pdfFileName = `Elghali_Ai_${data.racecourse.replace(/\s+/g, '_')}_${data.date}_Predictions.pdf`;
    const pdfFilePath = path.join(downloadDir, pdfFileName);
    
    // Get the Python script path
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_report.py');
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      console.error(`Python script not found: ${scriptPath}`);
      return NextResponse.json(
        { success: false, message: 'PDF generation script not found' },
        { status: 500 }
      );
    }
    
    // Execute Python script to generate PDF
    try {
      const { stdout, stderr } = await execAsync(
        `python3 "${scriptPath}" "${jsonFilePath}" "${pdfFilePath}"`,
        { timeout: 60000 }
      );
      
      console.log('PDF generation stdout:', stdout);
      if (stderr) {
        console.log('PDF generation stderr:', stderr);
      }
      
    } catch (execError) {
      console.error('Error executing PDF generation:', execError);
      // Clean up JSON file
      if (fs.existsSync(jsonFilePath)) {
        fs.unlinkSync(jsonFilePath);
      }
      return NextResponse.json(
        { success: false, message: 'Failed to generate PDF' },
        { status: 500 }
      );
    }
    
    // Check if PDF was created
    if (!fs.existsSync(pdfFilePath)) {
      console.error('PDF file was not created');
      return NextResponse.json(
        { success: false, message: 'PDF file was not created' },
        { status: 500 }
      );
    }
    
    // Clean up JSON file
    if (fs.existsSync(jsonFilePath)) {
      fs.unlinkSync(jsonFilePath);
    }
    
    // Return the PDF path (relative to public for download)
    const publicPdfPath = `/download/${pdfFileName}`;
    
    return NextResponse.json({
      success: true,
      message: 'PDF generated successfully',
      pdfPath: publicPdfPath,
      absolutePath: pdfFilePath
    });
    
  } catch (error) {
    console.error('Error in PDF generation API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
