# IT Service Desk & Ticket Management System

A professional and responsive IT Service Desk & Ticket Management System built using React, TypeScript, Vite, Tailwind CSS, and JSON Server.

The application provides role-based access control, ticket lifecycle management, ticket assignment, comments, resolution tracking, search, filtering, sorting, pagination, dashboard statistics, user management, category management, and activity history.

---

## Project Overview

The IT Service Desk & Ticket Management System is designed to manage internal IT support requests through a centralized service desk application.

The system supports three user roles:

- Admin
- Support Agent
- Employee

Each role has different permissions and access to application features.

The application uses JSON Server as a mock REST API backend and React Query for server-state management.

---

## Features

### Authentication & RBAC

- Email and password login
- Role-based authentication
- Protected application routes
- Role-based navigation
- Unauthorized access protection
- Permission-based UI actions

### Dashboard

Role-specific dashboards are available for:

- Admin
- Support Agent
- Employee

Dashboard statistics are dynamically calculated from JSON Server ticket data.

### Ticket Management

- Create tickets
- View tickets
- View ticket details
- Edit authorized tickets
- Delete tickets
- Assign tickets
- Reassign tickets
- Unassign tickets
- Update ticket status
- Update ticket priority
- Ticket lifecycle management
- Due date tracking
- Resolution tracking

### Ticket Search & Filtering

Tickets can be searched by:

- Ticket ID
- Subject
- Description
- Employee name
- Support Agent name

Tickets can be filtered by:

- Status
- Priority
- Category
- Assigned Agent
- Created Date

Sorting options include:

- Newest tickets
- Oldest tickets
- Highest priority
- Recently updated

Pagination is implemented for ticket listings.

### Comments

Users can add comments according to their permissions.

Comments include:

- Comment ID
- Ticket ID
- User
- Comment content
- Created date
- Created time

### Resolution Management

Authorized Support Agents and Admins can resolve tickets with:

- Resolution
- Resolution Notes
- Resolution Date

Employees can view resolution information.

### Ticket Activity History

Ticket activity is displayed chronologically.

Activity examples include:

- Ticket created
- Ticket assigned
- Ticket reassigned
- Ticket unassigned
- Status changed
- Priority changed
- Comment added
- Ticket resolved
- Ticket reopened

### User Management

Administrators can:

- Add users
- View users
- Edit users
- Delete users
- Activate users
- Deactivate users
- Assign roles

### Category Management

Administrators can:

- Add categories
- View categories
- Edit categories
- Delete categories
- Activate categories
- Deactivate categories

### UI & UX

- Responsive enterprise-style interface
- Responsive sidebar
- Navbar
- Loading states
- Empty states
- Error states
- Form validation
- Toast notifications
- Confirmation modals
- Responsive tables
- Status indicators
- Priority indicators
- Role indicators
- Mobile responsive layout

---

## Technologies Used

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- TanStack React Query
- Axios
- Lucide React
- Recharts
- date-fns

### Backend / Mock API

- JSON Server

### Development Tools

- Node.js
- npm
- Git
- GitHub
- Visual Studio Code

---

## Project Structure

```text
it-service-desk/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── AppRouter.tsx
│   │   └── providers/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── tickets/
│   │   ├── users/
│   │   └── categories/
│   │
│   ├── hooks/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── tickets/
│   │   ├── users/
│   │   ├── categories/
│   │   ├── profile/
│   │   └── reports/
│   │
│   ├── permissions/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── public/
│
├── db.json
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── .env
├── .gitignore
└── README.md

---
```markdown
### Prerequisites
Make sure the following are installed:
# Node.js 18+
# npm
# Git

Verify the installations:
node --version
npm --version
git --version

### Installations
# Clone the repository: git clone https://github.com/ddsdharan/it-service-desk-ticket-management.git
# Navigate into the project: cd it-service-desk-ticket-management
# Install dependencies: npm install

### Environment Configuration
# Create a .env file in the project root: VITE_API_BASE_URL=http://localhost:3001
The .env file is excluded from Git using .gitignore.

### Running the Application
The application requires two processes:
React/Vite frontend
JSON Server backend
Start JSON Server

## Open a terminal in the project root and run: npm run server

## JSON Server will be available at: http://localhost:3001
The API resources are available from this server.

## Start React Application
Open another terminal in the project root and run: npm run dev

## The Vite development server will provide a local URL similar to: http://localhost:5173
Open the displayed URL in a browser.

### Demo Login Credentials

The project includes sample users in db.json.

## Admin
Email: admin@servicedesk.com
Password: Admin@123
Role: Admin
## Support Agent
Email: agent@servicedesk.com
Password: Agent@123
Role: Support Agent
## Employee
Email: employee@servicedesk.com
Password: Employee@123
Role: Employee

# These are demonstration credentials for the assignment and should not be used for real systems.

### User Roles & Permissions
## Admin

# Admin has full access to the system.

# Admin can:
View all tickets
Create tickets
Edit tickets
Delete tickets
Assign tickets
Reassign tickets
Unassign tickets
Update ticket status
Update ticket priority
Add comments
Add resolution information
Manage users
Manage categories
View dashboard
View reports
View ticket activity

## Support Agent

# Support Agents can:
View assigned tickets
View ticket details
Update assigned tickets
Update ticket status
Update ticket priority
Add comments
Add resolution information
Resolve assigned tickets
Close resolved assigned tickets
View dashboard

# Support Agents cannot:
Manage users
Manage categories
Delete tickets
Assign tickets to other agents

## Employee

# Employees can: 
Create support tickets
View their own tickets
Edit their own open tickets
Add comments to their own tickets
View ticket status
Cancel their own open tickets
Reopen resolved tickets
View resolution information
View dashboard

# Employees cannot:
View other employees' tickets
Assign tickets
Manage users
Manage categories
Add resolution notes
Delete tickets

### Ticket Lifecycle

# The normal ticket workflow is:

Open
  ↓
Assigned
  ↓
In Progress
  ↓
Pending
  ↓
Resolved
  ↓
Closed

# Additional workflows:
Open → Cancelled
Pending → In Progress
Resolved → Reopened

## Available status actions depend on the logged-in user's role.

### Ticket Priorities
# The system supports four priority levels:
## Low
## Medium
## High
## Critical

### Ticket Statuses
# The system supports:

Open
Assigned
In Progress
Pending
Resolved
Closed
Cancelled
Reopened

### API Endpoints
The application uses JSON Server.
# Base URL: http://localhost:3001

## Tickets
GET    /tickets
GET    /tickets/:id
POST   /tickets
PUT    /tickets/:id
PATCH  /tickets/:id
DELETE /tickets/:id

## Users
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
PATCH  /users/:id
DELETE /users/:id

## Categories
GET    /categories
GET    /categories/:id
POST   /categories
PUT    /categories/:id
PATCH  /categories/:id
DELETE /categories/:id

## Comments

GET    /comments
GET    /comments/:id
POST   /comments
PUT    /comments/:id
PATCH  /comments/:id
DELETE /comments/:id

## Activities
GET    /activities
GET    /activities/:id
POST   /activities

### JSON Server Database

# The mock backend data is stored in:

## db.json

# The database contains the following resources:
users
tickets
comments
categories
activities

JSON Server automatically exposes these resources as REST endpoints.

## Form Validation

The application implements validation for forms including:
Required fields
Valid email format
Valid phone number
Minimum description length
Required category
Required priority
Required status

# Validation messages are displayed to users when invalid data is submitted.

## Error & Loading Handling

The application includes:
# Loading States
Displayed while data is being fetched from JSON Server.

# Empty States
Displayed when there are no:
Tickets
Users
Categories
Comments
Activities

## Error States
# Meaningful error messages are displayed when API requests fail.

## Toast Notifications
# Toast notifications are displayed after successful or failed operations including:
Create
Update
Delete
Assignment
Reassignment
Status change
Priority change
Comments
Resolution
User activation/deactivation
Category activation/deactivation

### Dashboard
## Admin Dashboard

# Displays:
Total Tickets
Open Tickets
Assigned Tickets
In Progress Tickets
Pending Tickets
Resolved Tickets
Closed Tickets
Critical Tickets
Unassigned Tickets
Support Agent Dashboard

# Displays:
My Assigned Tickets
New Tickets
In Progress Tickets
Pending Tickets
Resolved Tickets
High Priority Tickets
Employee Dashboard

# Displays:
My Total Tickets
Open Tickets
In Progress Tickets
Resolved Tickets
Closed Tickets

Dashboard statistics are calculated from the JSON Server ticket data.

### Reports
# The Admin Reports section provides ticket analytics including:
Ticket Status Distribution
Ticket Priority Distribution
Tickets by Category
Agent Workload
Recent ticket activity
Build for Production

## Run: npm run build

The production build will be generated in:
dist/

To preview the production build locally:
npm run preview
