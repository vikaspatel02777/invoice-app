
'use client';

import React from 'react';
import { Invoice } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Download, Share2, Archive, RefreshCcw } from 'lucide-react';

import { motion } from 'framer-motion';

interface InvoiceHeaderProps {
    invoice: Invoice;
    onArchiveToggle: () => void;
}

export function InvoiceHeader({ invoice, onArchiveToggle }: InvoiceHeaderProps) {
    const isPaid = invoice.status === 'PAID';
    const isLate = invoice.status === 'LATE';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
                        <Badge variant={isPaid ? 'success' : isLate ? 'destructive' : 'secondary'}>
                            {invoice.status}
                        </Badge>
                        {invoice.isArchived && <Badge variant="outline">ARCHIVED</Badge>}
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Issued: {formatDate(invoice.invoiceDate)} • Due: {formatDate(invoice.dueDate)}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={onArchiveToggle}>
                        {invoice.isArchived ? (
                            <>
                                <RefreshCcw className="mr-2 h-4 w-4" /> Restore
                            </>
                        ) : (
                            <>
                                <Archive className="mr-2 h-4 w-4" /> Archive
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="bg-card rounded-lg border p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="font-medium text-lg">{invoice.customerName}</p>
                    <p className="text-sm text-muted-foreground">vikash@example.com</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                    <p className="font-medium text-lg">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">**** 1234</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="font-medium text-lg">{invoice.currency} {invoice.totalAmount}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Balance Due</p>
                    <p className="font-medium text-lg text-primary">{invoice.currency} {invoice.balanceDue?.toFixed(2)}</p>
                </div>
            </div>
        </motion.div>
    );
}
