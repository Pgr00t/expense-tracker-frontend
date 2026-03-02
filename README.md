# CiteWorks Expense Tracker - Frontend (Next.js)

## Prerequisites
- Node.js 18.x or 20.x
- npm

## Local Setup

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Environment Variables:
   If your backend is running elsewhere, create a `.env.local` file and add:
   ```
   NEXT_PUBLIC_API_URL=http://your-backend-url/api/
   ```
   *(Default is `http://127.0.0.1:8000/api/`)*

3. Run the Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages & Navigation

- `/` (Dashboard): Shows the total expenses, category breakdown (Recharts), and a live currency converter widget fetching data from the Frankfurter API (via Django Backend).
- `/expenses` (Ledger): A complete list of transactions where you can Create, Read, Update, and Delete (CRUD) expenses via a responsive modal.

## Design
This application was styled using Tailwind CSS for a premium dark mode aesthetic with glassmorphism effects, smooth animations, and `lucide-react` icons. All state updates provide feedback via `react-hot-toast` notifications.
