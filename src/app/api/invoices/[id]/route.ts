
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+, params is async
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
        }

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                lineItems: true,
                payments: {
                    orderBy: { date: 'desc' },
                },
            },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Calculate derived fields
        const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const balanceDue = invoice.totalAmount - totalPaid;

        // Check overdue status (if not paid)
        let dynamicStatus = invoice.status;
        if (invoice.status !== 'PAID' && new Date() > new Date(invoice.dueDate)) {
            dynamicStatus = 'LATE'; // Or OVERDUE, logic handled in UI too
        }

        // Return enhanced invoice object
        return NextResponse.json({
            ...invoice,
            status: dynamicStatus,
            totalPaid,
            balanceDue
        });

    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice details' },
            { status: 500 }
        );
    }
}
