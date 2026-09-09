import prisma from "../lib/prisma.js";

export const getCreatures = async (req, res, next) => {
  try {
    const {
      search,
      habitat,
      era,
      threatLevel,
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "asc",
    } = req.query;

    // 1. Sanitize & parse pagination params
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.max(1, Math.min(50, parseInt(limit, 10) || 10)); // cap at 50 max
    const skip = (pageNum - 1) * take;

    // 2. Validate sorting whitelist to avoid injection/runtime errors
    const validSortFields = ["name", "threatLevel", "era", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "name";
    const sortDirection = order.toLowerCase() === "desc" ? "desc" : "asc";

    // 3. Build dynamic filter query
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { lore: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(habitat && { habitat: { equals: habitat, mode: "insensitive" } }),
      ...(era && { era: { equals: era, mode: "insensitive" } }),
      ...(threatLevel && { threatLevel: { equals: threatLevel } }),
    };

    // 4. Run total count and paginated query in a single transaction
    const [totalCount, creatures] = await prisma.$transaction([
      prisma.creature.count({ where }),
      prisma.creature.findMany({
        where,
        take,
        skip,
        orderBy: { [sortField]: sortDirection },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    // 5. Return standardized payload with metadata
    res.status(200).json({
      data: creatures,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: pageNum,
        limit: take,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
