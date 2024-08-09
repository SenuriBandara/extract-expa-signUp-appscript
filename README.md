## Automated SignUp Data Extraction to Google Sheets from Expa

This project provides a script to automate the extraction and updating of sign-up data from the EXPA API to Google Sheets. The script fetches a live list of sign-ups and updates their statuses in the Google Sheet, eliminating the need for manual data handling.

## Purpose

The script automates the collection and updating of sign-up data from the EXPA API into a Google Sheet. It ensures that the data is up-to-date and includes the following fields:

- EP ID
- Signed Up At
- Name
- Phone Number
- Gender
- DOB
- Person Status
- Backgrounds
- Program
- Home LC
- Home MC
- Campus
- Is AIESECer?
- EXPA Referral Type
- Opportunity Applications Count
- Latest Graduation Year
- Campaign Name
- Faculty
- First Applied At
- First Approved At
- First Realized At
- First Finished At
- Year of Birth
- ID

## Prerequisites

- Google account with access to Google Sheets
- Google Apps Script project setup
- EXPA API access token

## Files Included

- `main.gs`: The main Google Apps Script file
- `README.md`: Documentation on how to use the script

## Setup Instructions

### 1. Create a Google Sheet

1. Open Google Sheets and create a new spreadsheet.
2. Note the name of the sheet (you will need to use this name in the script).

### 2. Set Up Google Apps Script

1. In your Google Sheet, go to `Extensions > Apps Script`.
2. Delete any existing code in the script editor.
3. Copy and paste the code from `main.gs` into the script editor.

### 3. Configure the Script

1. Replace `'YOUR TOKEN HERE'` with your actual EXPA API access token.
2. Update the `startDate` and `endDate` variables if needed.
3. Update the `sheetName` variable to match the name of your Google Sheet.

### 4. Authorize the Script

1. Click the disk icon to save the script.
2. Click the play button (triangle icon) to run the script.
3. Follow the prompts to authorize the script to access your Google Sheets.

### 5. Run the Script

1. After authorization, click the play button again to run the script.
2. The script will fetch data from the EXPA API and write it to your Google Sheet.

## Explanation of the Code

### Constants and Configuration

- `baseUrl` and `accessToken`: Set the base URL for the EXPA API and the access token for authentication.
- `startDate`, `endDate`, `sheetName`: Configuration for the date range and Google Sheet name.

### Helper Functions

- `dataExtraction_Signups(query)`: Fetches data from the API based on the provided query.
- `writeToSheet(data)`: Writes the fetched data to the Google Sheet.
- `signupsLiveUpdating()`: Main function that orchestrates data extraction and sheet updating.
- `changeProductCode(num)`: Converts product codes into human-readable formats.

### Main Process

- `startProcess()`: The main function that prepares the sheet, fetches data, processes it, and writes it to the sheet.

## Example Output

The script updates the following columns in the Google Sheet:

- EP ID
- Signed Up At
- Name
- Phone Number
- Gender
- DOB
- Person Status
- Backgrounds
- Program
- Home LC
- Home MC
- Campus
- Is AIESECer?
- EXPA Referral Type
- Opportunity Applications Count
- Latest Graduation Year
- Campaign Name
- Faculty
- First Applied At
- First Approved At
- First Realized At
- First Finished At
- Year of Birth
- ID

## Troubleshooting

- Ensure the sheet name matches the `sheetName` variable.
- Ensure the access token is valid and not expired.
- Check the API endpoint and data structure if there are changes in the EXPA API.

## Conclusion

This script automates the process of fetching and updating sign-up data from the EXPA API and writing it to Google Sheets. It is designed to be easily configurable and extendable for various reporting needs.
