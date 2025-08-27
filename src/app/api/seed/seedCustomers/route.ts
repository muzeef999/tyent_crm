// app/api/seed/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Customer from '@/models/Customer';
import Service from '@/models/Service';
import Product from '@/models/Product';
import { connectDB } from '@/lib/mongodb';

// Sample Indian names for generating realistic data
const INDIAN_NAMES = [
  "Rajesh Kumar", "Priya Sharma", "Vikram Singh", "Ananya Patel", "Arun Joshi",
  "Sneha Reddy", "Rahul Mehta", "Divya Nair", "Amit Verma", "Neha Gupta",
  "Sanjay Malhotra", "Pooja Desai", "Ravi Shankar", "Anjali Iyer", "Vishal Agarwal",
  "Kavita Singh", "Manoj Tiwari", "Sunita Menon", "Alok Pandey", "Meera Krishnan",
  "Nitin Choudhary", "Latha Venkatesh", "Harish Shetty", "Sarika Patel", "Deepak Sharma",
  "Anita Deshpande", "Rohan Kapoor", "Swathi Reddy", "Kiran Kumar", "Pooja Mehta"
];

const CITIES = [
  { city: "Bengaluru", state: "Karnataka" },
  { city: "New Delhi", state: "Delhi" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Kochi", state: "Kerala" },
  { city: "Gurgaon", state: "Haryana" },
  { city: "Noida", state: "Uttar Pradesh" }
];

const WATER_TYPES = ["RO_company", "RO_third-party", "Bore", "Municipal"];
const WATER_METHODS = ["Direct", "Booster_company", "Booster_third-party", "Pressure_company", "Pressure_third-party"];
const AMC_OPTIONS = ["SERVICE_AMC", "SERVICE_FILTER_AMC", "COMPREHENSIVE_AMC"];
const WARRANTY_OPTIONS = ["1", "2", "3"];

// Your provided IDs
const MANAGER_ID = "68a1751e34285f7b0874cff5";
const TECHNICIAN_ID = "68a1751e34285f7b0874cffd";

// Generate random Indian phone number
function generatePhoneNumber() {
  return '9' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

// Generate random date within a range
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomPurchaseDate() {
  const today = new Date();
  const tenYearsAgo = new Date(today);
  tenYearsAgo.setFullYear(today.getFullYear() - 10);

  return randomDate(tenYearsAgo, today); // already have randomDate util
}

const purchaseDate = getRandomPurchaseDate();

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 🧹 1. Clear old data
    await Service.deleteMany({});
    await Customer.deleteMany({});
    await Product.updateMany(
      { assignedTo: { $exists: true } },
      { $set: { status: "In Stock", assignedTo: null, stock: 1 } }
    );

    // 2. Get fresh products
    const availableProducts = await Product.find({
      status: "In Stock",
      stock: { $gt: 0 }
    });

    if (availableProducts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No products available. Please add products first."
        },
        { status: 400 }
      );
    }

    const results = { created: 0, failed: 0, errors: [] as string[] };

    // 3. Seed loop
    for (let i = 0; i < 830; i++) {
      try {
        const cityData = CITIES[Math.floor(Math.random() * CITIES.length)];
        const hasAMC = Math.random() > 0.4; // 60% have AMC

        // Pick safe name + product using modulo
        const name = INDIAN_NAMES[i % INDIAN_NAMES.length];
        const product = availableProducts[i % availableProducts.length];

        const customerData = {
          name,
          contactNumber: generatePhoneNumber(),
          alternativeNumber: generatePhoneNumber(),
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          address: `${Math.floor(Math.random() * 100) + 1} ${cityData.city} Road, ${cityData.city}, ${cityData.state}`,
          price: Math.floor(Math.random() * (250000 - 100000 + 1)) + 100000,
          invoiceNumber: `INV-${2020 + Math.floor(i / 10)}-${(i % 10) + 1}`.padEnd(15, '0'),
          serialNumber: product._id,
          warrantyYears: WARRANTY_OPTIONS[Math.floor(Math.random() * WARRANTY_OPTIONS.length)],
          amcRenewed: hasAMC ? AMC_OPTIONS[Math.floor(Math.random() * AMC_OPTIONS.length)] : undefined,
          remarks: `Sample customer ${i + 1} - ${hasAMC ? 'With AMC' : 'No AMC'}`,
          DOB: randomDate(new Date(1960, 0, 1), new Date(2000, 0, 1)),
          installedBy: TECHNICIAN_ID,
          marketingManager: MANAGER_ID,
          waterType: WATER_TYPES[Math.floor(Math.random() * WATER_TYPES.length)],
          waterMethod: WATER_METHODS[Math.floor(Math.random() * WATER_METHODS.length)],
          state: cityData.state,
          city: cityData.city,
          createdAt: purchaseDate,
        };

        // Create customer
        const newCustomer = await Customer.create(customerData);

        // Create 3 upcoming services every 4 months
        const today = new Date();
        const serviceList = [];
        for (let j = 1; j <= 3; j++) {
          const futureDate = new Date(today);
          futureDate.setMonth(today.getMonth() + j * 4);
          serviceList.push({
            customerId: newCustomer._id,
            visitNo: j,
            serviceDate: futureDate,
            serviceType: ["GENERAL_SERVICE"],
            status: "PENDING",
          });
        }

        const createdServices = await Service.insertMany(serviceList);

        // Link services to customer
        newCustomer.upcomingServices = createdServices.map((s) => s._id);
        newCustomer.updatedAt = new Date();
        await newCustomer.save();

        // Update product → assigned
        await Product.findByIdAndUpdate(product._id, {
          status: "Out of Stock",
          assignedTo: newCustomer._id,
          stock: 0,
        });

        results.created++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Customer ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Seeding completed. Created: ${results.created} customers, Failed: ${results.failed}`,
        details: results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error during seeding",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

