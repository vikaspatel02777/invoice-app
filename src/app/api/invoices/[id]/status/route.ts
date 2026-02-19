
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { action } = await request.json(); // action: 'ARCHIVE' | 'RESTORE'

        if (!id || !action) {
            return NextResponse.json(
                { error: 'Invoice ID and Action are required' },
                { status: 400 }
            );
        }

        let updateData = {};
        if (action === 'ARCHIVE') {
            updateData = { isArchived: true };
        } else if (action === 'RESTORE') {
            updateData = { isArchived: false };
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedInvoice);

    } catch (error) {
        console.error('Error updating invoice status:', error);
        return NextResponse.json(
            { error: 'Failed to update invoice status' },
            { status: 500 }
        );
    }
}
