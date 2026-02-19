
import React from 'react';
import { Invoice } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentHistoryProps {
    invoice: Invoice;
}

export function PaymentHistory({ invoice }: PaymentHistoryProps) {
    if (!invoice.payments || invoice.payments.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 border border-green-200">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        Payment Received
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(payment.date)}
                                    </p>
                                    {payment.note && <p className="text-xs text-muted-foreground mt-1">Note: {payment.note}</p>}
                                </div>
                            </div>
                            <div className="font-medium">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {invoice.payments.map((payment, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 border border-green-200">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            Payment Received
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(payment.date)}
                                        </p>
                                        {payment.note && <p className="text-xs text-muted-foreground mt-1">Note: {payment.note}</p>}
                                    </div>
                                </div>
                                <div className="font-medium">
                                    {formatCurrency(payment.amount, invoice.currency)}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
