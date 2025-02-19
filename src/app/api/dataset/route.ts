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

export async function GET() {
  try {
    // Fetch the data from the Google Spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:F`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // The first row contains headers
    const headers = rows[0];
    
    // Convert the remaining rows to an array of objects
    const data = rows.slice(1).map(row => {
      const obj: { [key: string]: string } = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error fetching dataset:", error);
    
    if (error.message?.includes('invalid_grant')) {
      return new Response(
        JSON.stringify({ error: "Authentication failed - please check service account credentials" }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 