# King's Todo App

This is a Django-based Todo application named "King's Todo App". It allows users to create, view, edit, resolve, and delete tasks.

## Features

-   **Home Screen:** Displays a list of all active tasks.
    -   Create Task: Add a new task to your list.
    -   View Task: See detailed information about a specific task.
    -   Resolve Task: Mark a task as completed or uncompleted.
    -   Cancel Task: Mark a task as cancelled or uncancelled.
    -   Delete Task: Remove a task from your list.
-   **Navigation Bar:** Provides quick access to different task views:
    -   **Active Tasks:** View tasks that are not yet completed and not cancelled.
    -   **Resolved Tasks:** View all tasks that have been marked as completed.
    -   **Cancelled Tasks:** View tasks that have been marked as cancelled.
    -   **Expired Tasks:** View tasks that are not completed, not cancelled, and whose due date has passed.
    -   **Priority Filtering:** Access tasks filtered by Low, Medium, or High priority.
-   **Create Task Screen:** Form to add new tasks with a title, optional description, optional due date (with a calendar picker), and priority.
-   **Task Detail Screen:** Shows detailed information for a selected task, with options to edit, delete, mark as resolved, or mark as cancelled.
-   **Edit Task Screen:** Form to modify existing tasks.
-   **Resolved Tasks Screen:** View a list of all completed tasks.
-   **Error Handling:** Basic form validation to prevent invalid data submission.

## Setup Instructions

Follow these steps to get the King's Todo App running on your local machine.

### Prerequisites

*   Python 3.8+
*   pip (Python package installer)

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-devtools-zoomcamp
```

### 2. Create and activate a virtual environment

It's recommended to use a virtual environment to manage project dependencies.

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

Install the required Python packages using pip.

```bash
pip install Django
```

### 4. Apply database migrations

The application uses SQLite as its database. Apply the migrations to set up the database schema.

```bash
python app/manage.py makemigrations todos
python app/manage.py migrate
```

### 5. Create a superuser (optional, for admin access)

To access the Django admin panel, you'll need to create a superuser.

```bash
python app/manage.py createsuperuser
```
Follow the prompts to create your superuser account.

### 6. Run the development server

```bash
python app/manage.py runserver
```

The application will be accessible at `http://127.0.0.1:8000/`.

## User Guide

Upon launching the app, you'll see the Home Screen, which now displays **Active Tasks** (tasks that are neither completed nor cancelled).

*   **Navigation Bar:** Use the navigation links in the header to filter your tasks:
    *   **Active Tasks:** View all tasks that are currently pending and not cancelled. This is the default view.
    *   **Resolved Tasks:** See tasks you've marked as completed.
    *   **Cancelled Tasks:** View tasks you've explicitly marked as cancelled.
    *   **Expired Tasks:** See tasks that are not completed, not cancelled, and whose due date has passed.
    *   **Priority Filtering:** Use the "Priority" links to view tasks filtered by Low, Medium, or High priority.
*   **Add Task:** Click the "Add Task" button to create a new task.
*   **View Task Details:** Click on any task's title to view its full details.

### Create Task

On the Create Task Screen, fill in the details for your new task:
*   **Title:** (Required) A brief name for your task.
*   **Description:** (Optional) More details about the task.
*   **Due Date:** (Optional) Set a deadline using the calendar picker. Tasks with a past due date that are not completed or cancelled will appear in "Expired Tasks."
*   **Priority:** (Optional) Select Low, Medium, or High priority.

Click "Save" to add the task or "Back" to return to the task list.

### Task Detail

The Task Detail Screen shows all information for a specific task.
*   **Edit:** Click "Edit" to modify the task.
*   **Delete:** Click "Delete" to remove the task.
*   **Mark as Completed/Uncompleted:** A checkbox is available to toggle the completion status.
*   **Cancel/Uncancel:** A button allows you to mark a task as cancelled or revert its cancelled status.
*   **Back to list:** Returns you to the main task list.

### Edit Task

The Edit Task Screen is similar to the Create Task Screen but pre-fills existing task details. Make your changes and click "Save". Clicking "Back" will return you to the Task Detail Screen.

### Resolved Tasks

Click "Resolved Tasks" in the header navigation to view only the tasks you have marked as completed. You can view, unresolve, or delete tasks from this list.

## Design

The app's UI is inspired by a vibrant design system, utilizing a palette of Sunset Orange, Turquoise, Deep Teal, Burnt Orange, Black, and Cream. Typography features Montserrat for headings, Open Sans for body text, and Bebas Neue for accents, providing a visually engaging experience.

```