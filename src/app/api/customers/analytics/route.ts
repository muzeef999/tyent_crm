import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const pipeline: any = [
  {
    $lookup: {
      from: "products",
      localField: "serialNumber",
      foreignField: "serialNumber",
      as: "productInfo",
    },
  },
  { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },

  {
    $facet: {
      summary: [
        {
          $group: {
            _id: null,
            uniqueStates: { $addToSet: "$state" },
            uniqueCities: { $addToSet: "$city" },
            totalCustomers: { $sum: 1 },
            totalPrice: { $sum: "$price" },
          },
        },
        {
          $project: {
            _id: 0,
            totalCustomers: 1,
            totalPrice: 1,
            totalStates: { $size: "$uniqueStates" },
            totalCities: { $size: "$uniqueCities" },
          },
        },
      ],

      amcAnalytics: [
        { $group: { _id: "$amcRenewed", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],

      waterTypeAnalytics: [
        { $group: { _id: "$waterType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],

      modelAnalytics: [
        { $group: { _id: "$productInfo.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],

      warrantyAnalytics: [
        {
          $project: {
            bucket: {
              $switch: {
                branches: [
                  { case: { $lt: ["$warrantyYears", 1] }, then: "<1 yr" },
                  {
                    case: {
                      $and: [
                        { $gte: ["$warrantyYears", 1] },
                        { $lt: ["$warrantyYears", 2] },
                      ],
                    },
                    then: "1-2 yrs",
                  },
                  {
                    case: {
                      $and: [
                        { $gte: ["$warrantyYears", 2] },
                        { $lt: ["$warrantyYears", 3] },
                      ],
                    },
                    then: "2-3 yrs",
                  },
                  { case: { $gte: ["$warrantyYears", 3] }, then: ">3 yrs" },
                ],
                default: "Unknown",
              },
            },
          },
        },
        { $group: { _id: "$bucket", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ],

      waterMethodAnalytics: [
        { $group: { _id: "$waterMethod", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],

      stateAnalytics: [
        { $group: { _id: "$state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],

      cityAnalytics: [
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],
    },
  },
];


    const result = await Customer.aggregate(pipeline);
    const analytics = result[0];

    return NextResponse.json({
      success: true,

      summary: result[0].summary[0] || {
        totalCustomers: 0,
        totalPrice: 0,
        totalStates: 0,
        totalCities: 0,
      },

      analytics: {
        amc: analytics.amcAnalytics,
        waterType: analytics.waterTypeAnalytics,
        model: analytics.modelAnalytics,
        warranty: analytics.warrantyAnalytics,
        waterMethod: analytics.waterMethodAnalytics,
        states: analytics.stateAnalytics,
        cities: analytics.cityAnalytics,
      },
    });
  } catch (err) {
    console.error("Search Error:", err);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
};
