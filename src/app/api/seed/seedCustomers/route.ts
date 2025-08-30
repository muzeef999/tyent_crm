import { NextRequest, NextResponse } from 'next/server';
import Customer from '@/models/Customer';
import Service from '@/models/Service';
import Product from '@/models/Product';
import { connectDB } from '@/lib/mongodb';

// Define types for your constants
interface CityData {
  city: string;
  state: string;
}

// Sample Indian names for generating realistic data
const INDIAN_NAMES: string[] = [
  "Rajesh Kumar", "Priya Sharma", "Vikram Singh", "Ananya Patel", "Arun Joshi",
  "Sneha Reddy", "Rahul Mehta", "Divya Nair", "Amit Verma", "Neha Gupta",
  "Sanjay Malhotra", "Pooja Desai", "Ravi Shankar", "Anjali Iyer", "Vishal Agarwal",
  "Kavita Singh", "Manoj Tiwari", "Sunita Menon", "Alok Pandey", "Meera Krishnan",
  "Nitin Choudhary", "Latha Venkatesh", "Harish Shetty", "Sarika Patel", "Deepak Sharma",
  "Anita Deshpande", "Rohan Kapoor", "Swathi Reddy", "Kiran Kumar", "Pooja Mehta"
];

const CITIES: CityData[] = [
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

const WATER_TYPES: string[] = ["RO_company", "RO_third-party", "Bore", "Municipal"];
const WATER_METHODS: string[] = ["Direct", "Booster_company", "Booster_third-party", "Pressure_company", "Pressure_third-party"];
const AMC_OPTIONS: string[] = ["SERVICE_AMC", "SERVICE_FILTER_AMC", "COMPREHENSIVE_AMC"];
const WARRANTY_OPTIONS: string[] = ["1", "2", "3"];

// Your provided IDs
const MANAGER_ID: string = "68a1751e34285f7b0874cff5";
const TECHNICIAN_ID: string = "68a1751e34285f7b0874cffd";

// Generate random date within a range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomPurchaseDate(): Date {
  const today = new Date();
  const tenYearsAgo = new Date(today);
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  return randomDate(tenYearsAgo, today);
}

// Improved phone number generator for Indian numbers
function generatePhoneNumber(): string {
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  // Generate exactly 9 more digits for a total of 10 digits
  const remainingDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
  return prefix + remainingDigits;
}

// Improved email generator to handle special characters in names
function generateEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');
  return `${cleanName}@example.com`;
}

// Improved invoice number generator to avoid duplicates
function generateInvoiceNumber(year: number, index: number): string {
  const sequence = (index % 10000).toString().padStart(4, '0');
  return `INV-${year}-${sequence}`;
}

// Define interface for seeding results
interface SeedingResults {
  created: number;
  failed: number;
  errors: string[];
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Clear old data
    await Service.deleteMany({});
    await Customer.deleteMany({});
    
    // Reset product status
    await Product.updateMany(
      { assignedTo: { $exists: true } },
      { 
        $set: { 
          status: "In Stock", 
          assignedTo: null, 
          stock: 1 
        } 
      }
    );

    // Get available products
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

    const results: SeedingResults = { created: 0, failed: 0, errors: [] };
    const usedInvoiceNumbers = new Set<string>(); // Track used invoice numbers to avoid duplicates

    // Seed customers
    for (let i = 0; i < 830; i++) {
      try {
        const cityData = CITIES[Math.floor(Math.random() * CITIES.length)];
        const hasAMC = Math.random() > 0.4;
        const name = INDIAN_NAMES[i % INDIAN_NAMES.length];
        const product = availableProducts[i % availableProducts.length];
        
        // Generate unique invoice number
        const year = 2020 + Math.floor(i / 1000);
        let invoiceNumber: string;
        do {
          invoiceNumber = generateInvoiceNumber(year, i);
        } while (usedInvoiceNumbers.has(invoiceNumber));
        usedInvoiceNumbers.add(invoiceNumber);

        const purchaseDate = getRandomPurchaseDate();
        
        const customerData = {
          name,
          contactNumber: generatePhoneNumber(),
          alternativeNumber: Math.random() > 0.2 ? generatePhoneNumber() : "", // 20% chance no alt number
          email: generateEmail(name),
          address: `${Math.floor(Math.random() * 100) + 1} ${cityData.city} Road, ${cityData.city}, ${cityData.state}`,
          price: Math.floor(Math.random() * (250000 - 100000 + 1)) + 100000,
          invoiceNumber,
          serialNumber: product.serialNumber || product._id.toString(), // Use actual serial number if available
          warrantyYears: WARRANTY_OPTIONS[Math.floor(Math.random() * WARRANTY_OPTIONS.length)],
          amcRenewed: hasAMC ? AMC_OPTIONS[Math.floor(Math.random() * AMC_OPTIONS.length)] : null,
          remarks: `Sample customer ${i + 1} - ${hasAMC ? 'With AMC' : 'No AMC'}`,
          DOB: randomDate(new Date(1960, 0, 1), new Date(2000, 0, 1)),
          installedBy: TECHNICIAN_ID,
          marketingManager: MANAGER_ID,
          waterType: WATER_TYPES[Math.floor(Math.random() * WATER_TYPES.length)],
          waterMethod: WATER_METHODS[Math.floor(Math.random() * WATER_METHODS.length)],
          state: cityData.state,
          city: cityData.city,
          purchaseDate,
        };

        // Create customer
        const newCustomer = await Customer.create(customerData);

        // Create upcoming services
        const serviceList = [];
        for (let j = 1; j <= 3; j++) {
          const futureDate = new Date(purchaseDate); // Base on purchase date, not today
          futureDate.setMonth(purchaseDate.getMonth() + j * 4);
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
        await Customer.findByIdAndUpdate(newCustomer._id, {
          upcomingServices: createdServices.map((s) => s._id),
        });

        // Update product status
        await Product.findByIdAndUpdate(product._id, {
          status: "Out of Stock",
          assignedTo: newCustomer._id,
          stock: 0,
        });

        results.created++;
        
        // Add a small delay to avoid overwhelming the database
        if (i % 100 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Customer ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Log error but continue with other records
        console.error(`Error creating customer ${i + 1}:`, error);
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