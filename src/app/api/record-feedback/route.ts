import { google } from "googleapis";
import { JWT } from "google-auth-library";

const privateKey = process.env.SPREADSHEET_PRIVATE_KEY?.replace(/\\n/g, '\n');
const email = process.env.SPREADSHEET_EMAIL;

// Add validation for environment variables
if (!privateKey || !email) {
  throw new Error("Missing required environment variables SPREADSHEET_PRIVATE_KEY or SPREADSHEET_EMAIL");
}

const authClient = new JWT({
  email,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: authClient });
const spreadsheetId = "1F1nch7fCcHuDKf1hk6lWJ_-W3w6uNasZ1wRBVBPu5sc";
const sheetName = "Sheet1";

export async function POST(req: Request) {
  try {
    const { 
      feedback, 
      code, 
      video_url, 
      timestamp, 
      prompt, 
      model,
      feedback_description  // Add this new field
    } = await req.json();

    // Use feedback_description as prompt if it exists
    const finalPrompt = feedback_description || prompt;

    if (!feedback || !code || !video_url || !timestamp || !finalPrompt || !model) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Append the feedback data to the Google Spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:F`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[timestamp, finalPrompt, code, video_url, model, feedback]],
      },
    });

    return new Response("Feedback recorded successfully", { status: 200 });
  } catch (error: any) {
    console.error("Error recording feedback:", error);
    
    // Add more specific error messages
    if (error.message?.includes('invalid_grant')) {
      return new Response("Authentication failed - please check service account credentials", 
        { status: 401 });
    }
    
    return new Response("Internal Server Error", { status: 500 });
  }
}