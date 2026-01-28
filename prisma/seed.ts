import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.task.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleaned\n');

  // Create Admin User
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@crmapp.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create Employee Users
  console.log('\n👥 Creating employee users...');
  const employeePassword = await bcrypt.hash('employee123', 10);
  
  const employee1 = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@crmapp.com',
      password: employeePassword,
      role: Role.EMPLOYEE,
    },
  });
  console.log(`✅ Employee created: ${employee1.email}`);

  const employee2 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@crmapp.com',
      password: employeePassword,
      role: Role.EMPLOYEE,
    },
  });
  console.log(`✅ Employee created: ${employee2.email}`);

  const employee3 = await prisma.user.create({
    data: {
      name: 'Mike Wilson',
      email: 'mike.wilson@crmapp.com',
      password: employeePassword,
      role: Role.EMPLOYEE,
    },
  });
  console.log(`✅ Employee created: ${employee3.email}`);

  // Create Customers
  console.log('\n🏢 Creating customers...');
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Acme Corporation',
        email: 'contact@acmecorp.com',
        phone: '+1-555-0101',
        company: 'Acme Corp',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Tech Solutions Inc',
        email: 'info@techsolutions.com',
        phone: '+1-555-0102',
        company: 'Tech Solutions Inc',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Global Enterprises',
        email: 'hello@globalent.com',
        phone: '+1-555-0103',
        company: 'Global Enterprises Ltd',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Startup Innovators',
        email: 'team@startupinnovators.io',
        phone: '+1-555-0104',
        company: 'Startup Innovators',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Enterprise Solutions',
        email: 'sales@enterprisesolutions.com',
        phone: '+1-555-0105',
        company: 'Enterprise Solutions Group',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Digital Marketing Co',
        email: 'contact@digitalmarketing.com',
        phone: '+1-555-0106',
        company: 'Digital Marketing Co',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Cloud Services Ltd',
        email: 'info@cloudservices.com',
        phone: '+1-555-0107',
        company: 'Cloud Services Ltd',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Data Analytics Corp',
        email: 'hello@dataanalytics.com',
        phone: '+1-555-0108',
        company: 'Data Analytics Corp',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'AI Solutions Inc',
        email: 'contact@aisolutions.com',
        phone: '+1-555-0109',
        company: 'AI Solutions Inc',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Mobile Apps Studio',
        email: 'info@mobileappsstudio.com',
        phone: '+1-555-0110',
        company: 'Mobile Apps Studio',
      },
    }),
  ]);
  console.log(`✅ Created ${customers.length} customers`);

  // Create Tasks
  console.log('\n📋 Creating tasks...');
  const tasks = await Promise.all([
    // Tasks for John Smith
    prisma.task.create({
      data: {
        title: 'Initial consultation call',
        description: 'Schedule and conduct initial consultation with Acme Corporation',
        status: TaskStatus.DONE,
        assignedToId: employee1.id,
        customerId: customers[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prepare proposal document',
        description: 'Create detailed proposal for Tech Solutions Inc project',
        status: TaskStatus.IN_PROGRESS,
        assignedToId: employee1.id,
        customerId: customers[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Follow-up meeting',
        description: 'Schedule follow-up meeting with Global Enterprises',
        status: TaskStatus.PENDING,
        assignedToId: employee1.id,
        customerId: customers[2].id,
      },
    }),

    // Tasks for Sarah Johnson
    prisma.task.create({
      data: {
        title: 'Product demo presentation',
        description: 'Prepare and deliver product demo for Startup Innovators',
        status: TaskStatus.IN_PROGRESS,
        assignedToId: employee2.id,
        customerId: customers[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Contract negotiation',
        description: 'Negotiate contract terms with Enterprise Solutions',
        status: TaskStatus.PENDING,
        assignedToId: employee2.id,
        customerId: customers[4].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Onboarding process',
        description: 'Complete onboarding for Digital Marketing Co',
        status: TaskStatus.DONE,
        assignedToId: employee2.id,
        customerId: customers[5].id,
      },
    }),

    // Tasks for Mike Wilson
    prisma.task.create({
      data: {
        title: 'Technical requirements gathering',
        description: 'Gather technical requirements from Cloud Services Ltd',
        status: TaskStatus.IN_PROGRESS,
        assignedToId: employee3.id,
        customerId: customers[6].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implementation timeline',
        description: 'Create implementation timeline for Data Analytics Corp',
        status: TaskStatus.PENDING,
        assignedToId: employee3.id,
        customerId: customers[7].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Project kickoff meeting',
        description: 'Organize kickoff meeting with AI Solutions Inc',
        status: TaskStatus.PENDING,
        assignedToId: employee3.id,
        customerId: customers[8].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Customer feedback review',
        description: 'Review and address feedback from Mobile Apps Studio',
        status: TaskStatus.DONE,
        assignedToId: employee3.id,
        customerId: customers[9].id,
      },
    }),
  ]);
  console.log(`✅ Created ${tasks.length} tasks`);

  // Summary
  console.log('\n📊 Seeding Summary:');
  console.log('═══════════════════════════════════════');
  console.log(`👤 Users:     ${await prisma.user.count()}`);
  console.log(`   - Admins:  1`);
  console.log(`   - Employees: 3`);
  console.log(`🏢 Customers: ${await prisma.customer.count()}`);
  console.log(`📋 Tasks:     ${await prisma.task.count()}`);
  console.log('═══════════════════════════════════════');
  
  console.log('\n🔑 Test Credentials:');
  console.log('Admin:');
  console.log('  Email: admin@crmapp.com');
  console.log('  Password: admin123');
  console.log('\nEmployees:');
  console.log('  Email: john.smith@crmapp.com');
  console.log('  Email: sarah.johnson@crmapp.com');
  console.log('  Email: mike.wilson@crmapp.com');
  console.log('  Password (all): employee123');
  
  console.log('\n✨ Database seeding completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
