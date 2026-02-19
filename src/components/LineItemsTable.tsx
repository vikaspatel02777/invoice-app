import React from 'react';
import { Invoice } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LineItemsTableProps {
    invoice: Invoice;
}

export function LineItemsTable({ invoice }: LineItemsTableProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Invoice Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quantity</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unit Price</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                                initial="hidden"
                                animate="show"
                                className="[&_tr:last-child]:border-0"
                            >
                                {invoice.lineItems.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="p-4 align-middle">{item.description}</td>
                                        <td className="p-4 align-middle">{item.quantity}</td>
                                        <td className="p-4 align-middle">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                                        <td className="p-4 align-middle text-right">{formatCurrency(item.quantity * item.unitPrice, invoice.currency)}</td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                            <tfoot className="bg-muted/50 font-medium">
                                <tr>
                                    <td colSpan={3} className="p-4 align-middle text-right">Total</td>
                                    <td className="p-4 align-middle text-right">{formatCurrency(invoice.totalAmount, invoice.currency)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
