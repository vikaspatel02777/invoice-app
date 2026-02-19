
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')
  
  // Cleanup existing data
  await prisma.payment.deleteMany()
  await prisma.lineItem.deleteMany()
  await prisma.invoice.deleteMany()

  // Create Invoice 1
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-001',
      customerName: 'Acme Corp',
      invoiceDate: new Date('2023-10-01'),
      dueDate: new Date('2023-10-15'),
      status: 'PENDING',
      totalAmount: 1500.00,
      currency: 'USD',
      lineItems: {
        create: [
          { description: 'Consulting Services', quantity: 10, unitPrice: 100.00 },
          { description: 'Software License', quantity: 1, unitPrice: 500.00 },
        ],
      },
    },
  })

  // Create Invoice 2 (Paid)
  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-002',
      customerName: 'Globex Inc',
      invoiceDate: new Date('2023-09-20'),
      dueDate: new Date('2023-10-05'),
      status: 'PAID',
      totalAmount: 2500.00,
      currency: 'USD',
      lineItems: {
        create: [
          { description: 'Custom Development', quantity: 20, unitPrice: 125.00 },
        ],
      },
      payments: {
        create: [
          { amount: 1000.00, date: new Date('2023-09-25'), note: 'Deposit' },
          { amount: 1500.00, date: new Date('2023-10-04'), note: 'Final Payment' },
        ],
      },
      isArchived: true,
    },
  })

    // Create Invoice 3 (Late)
  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-003',
      customerName: 'Soylent Corp',
      invoiceDate: new Date('2023-11-01'),
      dueDate: new Date('2023-11-15'),
      status: 'LATE',
      totalAmount: 500.00,
      currency: 'USD',
      lineItems: {
        create: [
          { description: 'Maintenance', quantity: 5, unitPrice: 100.00 },
        ],
      },
    },
  })

  console.log({ invoice1, invoice2, invoice3 })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
