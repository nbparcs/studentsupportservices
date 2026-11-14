# Student Connect – Accessible University Support Website

## About the Project

Student Connect is a web-based university support platform developed as part of a Master of Information Technology research project.

The project investigates how accessible web design influences usability and user engagement among tertiary students, including students with and without self-reported vision-related difficulties.

The research evaluates two versions of the Student Connect website:

- **Baseline Version:** Uses a traditional website layout with top navigation and standard typography and styling.
- **Accessible Version:** Incorporates accessibility-focused design improvements, including enhanced colour contrast, typography, spacing, visual hierarchy, and persistent side navigation.

The project uses webcam-based eye tracking to collect gaze-related data during user interactions with both website versions.

## Research Objectives

The main objectives are to:

- Evaluate the effectiveness of accessibility-focused web design.
- Compare user interactions with the Baseline and Accessible website versions.
- Investigate differences in visual attention and task performance.
- Explore how accessible design may improve website usability for students with vision-related difficulties.

## Features

### 1. Two Website Versions
- Baseline website interface.
- Accessible website interface.
- Equivalent content and functionality for comparison.

### 2. Webcam-Based Eye Tracking
- Integrated WebGazer.js for webcam-based gaze estimation.
- Nine-point calibration process.
- Real-time gaze indicator.
- Gaze sample collection and recording.
- Area of Interest (AOI) tracking.

### 3. Participant Management
- Participant information collection.
- Research consent process.
- Participant background questionnaire.
- Research session management.

### 4. User Tasks
Participants complete six tasks across both website versions:

- Academic Support
- Disability Support
- IT Support

### 5. Data Collection and Analysis
The application records research data, including:

- Task completion time.
- Task success.
- Gaze samples.
- Time to First Fixation (TTFF).
- AOI attention.
- Fixation information.
- Participant feedback and usability responses.

### 6. Feedback Questionnaire
Participants complete a questionnaire after finishing the tasks to provide feedback about their experience with both website versions.

## Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Frontend development server and build tool |
| JavaScript | Application functionality |
| CSS | Website styling and responsive layouts |
| Node.js | Backend runtime |
| Express.js | Backend API |
| Microsoft SQL Server | Research database |
| WebGazer.js | Webcam-based eye tracking |
| Git & GitHub | Version control and source code management |

## Database

The application uses Microsoft SQL Server to store research information.

The database includes the following main tables:

- `ResearchSessions`
- `TaskResults`
- `GazeSamples`
- `ParticipantQuestionnaires`
- `ParticipantFeedback`

These tables support the collection and management of participant sessions, task performance, gaze information, questionnaires, and feedback.

## Getting Started

### Prerequisites

Before running the application, install:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/ssms/install/install)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/nbparcs/studentsupportservices.git
```

**2. Navigate to the project directory**

```bash
cd studentsupportservices
```

**3. Install dependencies**

```bash
npm install
```

*Note: If the frontend and backend use separate package.json files, install their dependencies separately.*

**4. Configure the database**

- Install and configure Microsoft SQL Server.
- Create or restore the StudentSupportResearch database.
- Configure the database connection settings.
- Ensure the backend can successfully connect to SQL Server.

**5. Configure environment variables**

Create the required `.env` configuration file using the project's database and server settings.

Do not upload database passwords, credentials, or other sensitive configuration details to GitHub.

**6. Run the application**

Use the appropriate development commands defined in the project's `package.json` files.

*The exact frontend and backend commands should be confirmed against the repository configuration.*

## Eye Tracking Requirements

The eye-tracking functionality requires:

- A working webcam.
- A supported web browser.
- Adequate lighting.
- The participant's face to remain visible to the webcam.
- Completion of the calibration process before research tasks.

Webcam-based gaze estimation is approximate and should not be interpreted as precise clinical eye-tracking measurement.

## Research and Privacy

This application was developed for academic research purposes.

Participant information, webcam-related research data, gaze samples, and questionnaire responses must be handled in accordance with the approved research ethics requirements.

Do not upload identifiable participant information, research database backups, or confidential research data to this public repository.

## Project Status

**Development and research testing stage.**

The application is being prepared for participant testing, research data collection, and subsequent analysis as part of the COMP903 Master of Information Technology project.

## Author

**Nathalie Bliss P. Arcolas**

Master of Information Technology  
Auckland Institute of Studies (AIS)

## Acknowledgements

Special thanks to the project supervisor and all participants who contribute to the research.

---

*Student Connect – Evaluating Web Design Accessibility Using Webcam-Based Eye Tracking Among Tertiary Students with and without Self-Reported Vision-Related Difficulties.*
