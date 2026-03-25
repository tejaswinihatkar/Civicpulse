# CivicPulse

CivicPulse is a comprehensive platform built to streamline the process of reporting, tracking, and resolving civic issues in local communities. I created this to bridge the gap between citizens, workers, and local authorities, ensuring complaints are addressed efficiently and transparently.

## What it does

The main goal here is to make civic problem-solving simpler. Citizens can report issues—like a broken street light or a pothole—directly through the portal. They can attach photos, pinpoint the location, and track the status of their complaints. 

On the flip side, local authorities can view all these incoming complaints in a dashboard, assign them to specific workers based on the area and task, and track the resolution progress. Workers have their own interface to see what tasks they've been assigned and update the status once they complete the work. This keeps everyone on the same page and holds the right people accountable.

## Tech Stack

I built this using a modern stack to make it reliable and fast:
- **Frontend:** React with Vite. I used TailwindCSS along with Radix UI and Material Icons for the components, keeping the interface clean and responsive.
- **Backend:** Java with Spring Boot. It handles all the business logic, API endpoints, and database interactions reliably.
- **Database:** It connects to a relational database to store users, complaints, assignments, and statuses safely. 

## Project Highlights

- **Role-based Dashboards:** Different views tailored for Citizens, Authorities, and Workers.
- **Issue Tracking:** Real-time updates on ticket statuses from 'Reported' to 'Resolved'.
- **Worker Management:** Authorities can see worker availability and manage task assignments directly.
- **Responsive Design:** Works smoothly on desktop and mobile since people will likely report issues from their phones on the go.

## How to run it locally

If you want to spin this up on your machine, here is what you need to do:

### Frontend
1. Open up a terminal in the root directory.
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
This will get the React app running on your localhost.

### Backend
1. Navigate to the `civicpulse-backend` folder.
2. Make sure you have Java 17+ and Maven installed.
3. Check the `application.properties` in `src/main/resources` to set up your local database credentials if needed.
4. Run the Spring Boot application using Maven wrapper:
   ```bash
   mvnw spring-boot:run
   ```

Once both are running, the frontend will communicate with the backend API, and you can test out the system.