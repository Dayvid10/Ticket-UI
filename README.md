# Ticket Search Dashboard - Frontend

## Overview

This frontend application provides an interactive dashboard for searching and visualizing tickets on a map. Users can filter tickets, view results in a table, and explore ticket locations using Leaflet.

## Technologies

* React.js
* Vite
* Tailwind CSS
* Axios
* React Leaflet
* Leaflet

## Features

* Ticket search dashboard
* Status filtering
* Station code filtering
* Utility type filtering
* Interactive Leaflet map
* Bounding box search
* Debounced map movement search
* Server-side pagination
* Ticket summary display
* Loading and error handling
* Responsive design

## Installation

Install dependencies:

```bash
npm install
```

## Running the Application

Development:

```bash
npm run dev
```

Application URL:

```text
http://localhost:5173
```

## Backend Connection

The frontend communicates with the NestJS backend API:

```text
http://localhost:3000/api/tickets/search
```

Ensure the backend service is running before starting the frontend.

## User Workflow

1. Open the dashboard.
2. Enter optional filters:

   * Status
   * Station Code
   * Utility Type
3. Click Search.
4. View matching tickets in the table.
5. View ticket locations on the map.
6. Move or zoom the map to update the bounding box.
7. Pagination controls allow navigation through results.

## Dashboard Components

### Filter Panel

* Status filter
* Station code filter
* Utility type filter
* Search button

### Ticket Table

Displays:

* Ticket Number
* Status
* Priority
* Station Code
* Utility Type
* Latitude
* Longitude

### Leaflet Map

Displays:

* Ticket markers
* Current map bounds
* Bounding-box driven search

### Pagination

Supports:

* Previous page
* Next page
* Current page indicator
* Server-side paging

## Performance Optimizations

### Debounced Map Search

Map movement events are debounced to reduce unnecessary API requests.

### Server-Side Pagination

Only a subset of records is loaded at a time to improve performance and scalability.

## Project Structure

```text
src/
│
├── components/
│   └── TicketMap.jsx
│
├── pages/
│   └── TicketSearch.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

## Author

David Popoola
