import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const url = new URL(req.url);
    const { startDate, endDate } = Object.fromEntries(
      url.searchParams.entries()
    );

    const matchDate: any = {};
    if (startDate) matchDate.serviceDate = { $gte: new Date(startDate) };
    if (endDate) {
      matchDate.serviceDate = {
        ...matchDate.serviceDate,
        $lte: new Date(endDate),
      };
    }

    const stats = await Service.aggregate([
      { $match: matchDate },
      {
        $facet: {
          // Existing counts
          totalTickets: [{ $count: "count" }],
          ticketsToday: [
            {
              $match: {
                serviceDate: {
                  $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  $lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
            },
            { $count: "count" },
          ],

          inProgress: [{ $match: { status: "ONGOING" } }, { $count: "count" }],
          closed: [{ $match: { status: "CLOSED" } }, { $count: "count" }],
          cancelled: [{ $match: { status: "CANCELLED" } }, { $count: "count" }],
          pending: [{ $match: { status: "PENDING" } }, { $count: "count" }],
          serviceNotAssigned: [
            { $match: { employeeId: null } },
            { $count: "count" },
          ],
          inWarranty: [
            { $match: { serviceType: "IN_WARRANTY_BREAKDOWN" } },
            { $count: "count" },
          ],
          outWarranty: [
            {
              $match: {
                serviceType: {
                  $in: [
                    "RO_SYSTEM_MALFUNCTIONING",
                    "PRESSURE_TANK_NOT_FUNCTIONING",
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          sparesChanged: [
            { $match: { serviceType: "SPARE_PART_REPLACEMENT" } },
            { $count: "count" },
          ],
          generalServicesDue: [
            { $match: { serviceType: "GENERAL_SERVICE" } },
            { $count: "count" },
          ],

          // Average Response Time (hours)
          avgResponseTime: [
            {
              $project: {
                responseTimeInHours: {
                  $cond: [
                    { $and: ["$closingDate", "$serviceDate"] },
                    {
                      $divide: [
                        { $subtract: ["$closingDate", "$serviceDate"] },
                        1000 * 60 * 60,
                      ],
                    },
                    null,
                  ],
                },
              },
            },
            { $group: { _id: null, avg: { $avg: "$responseTimeInHours" } } },
          ],

          // Monthly Tickets for Graph
          serviceType: [
            { $unwind: "$serviceType" }, // flatten the array of service types
            { $group: { _id: "$serviceType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }, // optional: sort by most common service type
          ],
        },
      },
    ]);

    const result = {
      totalTickets: stats[0].totalTickets[0]?.count || 0,
      ticketsToday: stats[0].ticketsToday[0]?.count || 0,
      inProgress: stats[0].inProgress[0]?.count || 0,
      closed: stats[0].closed[0]?.count || 0,
      cancelled: stats[0].cancelled[0]?.count || 0,
      pending: stats[0].pending[0]?.count || 0,
      serviceNotAssigned: stats[0].serviceNotAssigned[0]?.count || 0,
      inWarranty: stats[0].inWarranty[0]?.count || 0,
      outWarranty: stats[0].outWarranty[0]?.count || 0,
      sparesChanged: stats[0].sparesChanged[0]?.count || 0,
      generalServicesDue: stats[0].generalServicesDue[0]?.count || 0,
      avgResponseTime: stats[0].avgResponseTime[0]?.avg || 0,
      serviceType: stats[0].serviceType.map((m: any) => ({
        type: m._id,
        count: m.count,
      })),
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};
