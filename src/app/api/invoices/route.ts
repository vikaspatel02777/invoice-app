
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const invoices = await prisma.invoice.findMany({
            select: {
                id: true,
                invoiceNumber: true,
                customerName: true,
                status: true,
            }
        });
        return NextResponse.json(invoices);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}
