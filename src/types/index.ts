
export interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    invoiceId: string;
}

export interface Payment {
    id: string;
    amount: number;
    date: Date | string;
    note?: string | null;
    invoiceId: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    invoiceDate: Date | string;
    dueDate: Date | string;
    status: 'PENDING' | 'PAID' | 'LATE';
    totalAmount: number;
    currency: string;
    isArchived: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    lineItems: LineItem[];
    payments: Payment[];

    // Derived fields from API
    totalPaid?: number;
    balanceDue?: number;
}
