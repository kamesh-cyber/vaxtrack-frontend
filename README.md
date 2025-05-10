# README: VaxTrack FrontEnd

## Overview
A comprehensive web application for school coordinators to manage and track student vaccination efforts. `VaxTrack` provides a user-friendly interface for tracking vaccination status, managing vaccination drives, and generating detailed reports.

---
## Techonlogies Used
- React 19.1.0
- Material UI 7.0.2
- Axios for API requests
---
## Prerequisites
1. **Node.js**: Ensure you have Node.js installed (v16 or later).
2. **npm**: Ensure you have Node.js installed (v7.0.0 or later).
3. Backend API Running

**Installation**
1. Clone the repository
     ``` 
        git clone https://github.com/kamesh-cyber/vaxtrack-frontend.git
        cd vaxtrack-frontend
        npm install
    ```
2. Configure the API endpoint:
    ```
   Open client.js
   Update the REACT_APP_BASE_URL constant if your backend is running on a different URL
    ```
3. Start the application
   ```
   # Development mode (with auto-reload)
   npm start
   # Production mode
   npm run build
   ```
## Usage Guide
1. **Login**: Use the login page with default credentials (username/password)
2. **Dashboard**: View key metrics and upcoming vaccination drives
3. **Student Management**:
    1. Add individual students via the form
    2. Bulk import students with CSV
    3. Search and filter students by various criteria
4. **Vaccination Drive Management**:
    1. Create vaccination drives with target classes
    2. Monitor availability and scheduled dates
    3. Update or disable drives as needed
5. **Reports**:
    1. Generate filtered reports based on vaccination status, class, etc.
    2. Export reports in CSV, Excel, or PDF formats