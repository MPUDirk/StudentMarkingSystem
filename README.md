# Student Marking System

A web-based student grading management system built with Vue.js and Node.js that allows efficient tracking and analysis of student performance across multiple subjects.

## Features

- **Real-time Data Management**: Add, view, and delete student records
- **Performance Analytics**: Automatic calculation of averages and identification of highest scorers
- **Subject-specific Analysis**: Filter statistics by English, Mathematics, or Physical Education
- **Interactive Dashboard**: Visual representation of key metrics
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Demo

Live demo available at: [http://p2304362.dc-yan.top/sms](http://p2304362.dc-yan.top/sms)

## Technologies Used

- **Frontend**: Vue.js 3, Tailwind CSS, Element Plus
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Build Tools**: Vite

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MPUDirk/StudentMarkingSystem.git
   ```


2. Install dependencies:
   ```bash
   npm install
   ```


3. Build the project:
   ```bash
   npm run build
   ```


4. Start the server:
   ```bash
   node server.mjs
   ```


5. Access the application at `http://localhost:8000`

## Usage

- Click "Add New Record" to create a new student entry
- Use the navigation arrows to switch between subjects for analytics
- Delete records using the "Delete" button in each row
- View real-time statistics including number of students, average grades, and highest scores

## Project Structure

```
├── src/                 # Frontend source code
│   ├── App.vue          # Main application component
│   ├── components/      # Reusable components
│   └── assets/          # Static assets
├── dist/               # Built frontend files
├── server.mjs          # Backend server
├── api.mjs             # API routes
└── db.sqlite           # SQLite database
```


## API Endpoints

- `GET /api/grades` - Retrieve all student records
- `POST /api/grade` - Create a new student record
- `DELETE /api/grade/:id` - Delete a student record by ID

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[https://github.com/MPUDirk/StudentMarkingSystem](https://github.com/MPUDirk/StudentMarkingSystem)