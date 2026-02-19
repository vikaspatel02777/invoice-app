
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use the singleton

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { amount, note, date } = await request.json();

        if (!id || !amount) {
            return NextResponse.json(
                { error: 'Invoice ID and Amount are required' },
                { status: 400 }
            );
        }

        // 1. Fetch current invoice to validate balance
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { payments: true },
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
        const balanceDue = invoice.totalAmount - totalPaid;

        if (amount > balanceDue) {
            return NextResponse.json(
                { error: 'Payment amount exceeds balance due' },
                { status: 400 }
            );
        }

        // 2. Create the payment
        const payment = await prisma.payment.create({
            data: {
                amount: parseFloat(amount),
                note,
                date: date ? new Date(date) : new Date(),
                invoice: { connect: { id } },
            },
        });

        // 3. Update invoice status if fully paid
        const newTotalPaid = totalPaid + parseFloat(amount);
        // tolerance for floating point errors
        if (newTotalPaid >= invoice.totalAmount - 0.01) {
            await prisma.invoice.update({
                where: { id },
                data: { status: 'PAID' }
            });
        }

        return NextResponse.json(payment);

    } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json(
            { error: 'Failed to process payment' },
            { status: 500 }
        );
    }
}
