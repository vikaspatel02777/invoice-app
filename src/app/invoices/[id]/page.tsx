
'use client';

import React, { useEffect, useState, use } from 'react';
import { Invoice } from '@/types';
import { cn } from '@/lib/utils';
import { InvoiceHeader } from '@/components/InvoiceHeader';
import { LineItemsTable } from '@/components/LineItemsTable';
import { PaymentHistory } from '@/components/PaymentHistory';
import { PaymentModal } from '@/components/PaymentModal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

import { motion } from 'framer-motion';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const fetchInvoice = async () => {
        try {
            const res = await fetch(`/api/invoices/${id}`);
            if (!res.ok) throw new Error('Failed to fetch invoice');
            const data = await res.json();
            setInvoice(data);
        } catch (err) {
            setError('Invoice not found or error loading data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const handleArchiveToggle = async () => {
        if (!invoice) return;
        const action = invoice.isArchived ? 'RESTORE' : 'ARCHIVE';
        try {
            const res = await fetch(`/api/invoices/${id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            if (res.ok) {
                fetchInvoice(); // Reload to get updated status
            }
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-destructive">Error</h1>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen p-6 md:p-12 transition-colors duration-500", invoice?.status === 'LATE' ? "bg-red-50/50" : "bg-slate-50/50")}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-5xl space-y-8"
            >

                <InvoiceHeader
                    invoice={invoice}
                    onArchiveToggle={handleArchiveToggle}
                />

                {invoice.status === 'LATE' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200"
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                            <p className="font-semibold">Payment Overdue</p>
                        </div>
                        <p className="text-sm mt-1 text-red-600 dark:text-red-300">
                            This invoice is past its due date. Please process payment immediately.
                        </p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <LineItemsTable invoice={invoice} />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Actions</h3>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => setIsPaymentModalOpen(true)}
                                disabled={invoice.status === 'PAID'}
                            >
                                {invoice.status === 'PAID' ? 'Fully Paid' : 'Record Payment'}
                            </Button>
                        </div>

                        <PaymentHistory invoice={invoice} />
                    </div>
                </div>

                <PaymentModal
                    invoice={invoice}
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentSuccess={fetchInvoice}
                />

            </motion.div>
        </div>
    );
}
