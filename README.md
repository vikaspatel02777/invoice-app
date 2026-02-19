
# Invoice Application

A full-stack Invoice Details Module built with Next.js 14, TypeScript, Tailwind CSS, and Prisma (SQLite).

## Features

- **View Invoice Details**: See line items, total amounts, and statuses.
- **Payments**: Record partial or full payments with notes.
- **Status Tracking**: Automatically updates status to PAID when balance is 0.
- **Archiving**: Archive and restore invoices.
- **Responsive Design**: Works on mobile and desktop.

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Database Setup**
    Ensure you have `prisma` set up. If you encounter issues (like `prisma:cli:bin Failed`), try reinstalling node_modules.

    ```bash
    # Push schema to database
    npx prisma db push

    # Seed the database with sample data
    npx prisma db seed
    ```

    *Note: If `npx prisma` commands fail, ensure your environment variables and node version are compatible.*

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:3000/invoices/[invoice-id]](http://localhost:3000/invoices/[invoice-id])
    
    *Find a valid Invoice ID from your database or seed output.*

## API Endpoints

- `GET /api/invoices/[id]` - Fetch invoice details.
- `POST /api/invoices/[id]/payments` - Record a payment.
- `POST /api/invoices/[id]/status` - Archive/Restore invoice.

## Troubleshooting

- **Prisma Client Errors**: Run `npx prisma generate` to refresh the client.
- **Typescript Errors**: If generated types are missing, the frontend uses fallback interfaces in `src/types/index.ts`.
