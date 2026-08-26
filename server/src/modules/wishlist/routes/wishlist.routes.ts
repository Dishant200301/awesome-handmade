import { Router, Request, Response } from "express";
import { authenticateCustomer } from "../../auth/middleware/auth.middleware.js";
import { sequelize } from "../../../database/index.js";
import { QueryTypes } from "sequelize";

const router = Router();

// In-memory wishlist fallback store
const memoryWishlistStore: Record<string, string[]> = {};

const getCustomerId = (req: Request): string => {
  const user = (req as any).user || (req as any).customer;
  return user?.id || user?.email || "guest_user";
};

// GET /api/v1/wishlist - Get user wishlist product IDs
router.get("/", authenticateCustomer, async (req: Request, res: Response) => {
  const customerId = getCustomerId(req);

  try {
    const items: any = await sequelize.query(
      `SELECT product_id as productId FROM wishlist_items WHERE customer_id = :customerId`,
      {
        replacements: { customerId },
        type: QueryTypes.SELECT,
      }
    );
    const wishlistIds = items?.map((i: any) => String(i.productId)) || [];

    return res.status(200).json({
      success: true,
      data: wishlistIds,
    });

  } catch {
    return res.status(200).json({
      success: true,
      data: memoryWishlistStore[customerId] || [],
    });
  }
});

// POST /api/v1/wishlist/toggle - Toggle wishlist item
router.post("/toggle", authenticateCustomer, async (req: Request, res: Response) => {
  const customerId = getCustomerId(req);
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "productId is required" });
  }

  const strId = String(productId);
  const itemId = `${customerId}-${strId}`;

  try {
    const existing: any = await sequelize.query(
      `SELECT * FROM wishlist_items WHERE customer_id = :customerId AND product_id = :productId LIMIT 1`,
      {
        replacements: { customerId, productId: strId },
        type: QueryTypes.SELECT,
      }
    );

    if (existing && existing.length > 0) {
      await sequelize.query(`DELETE FROM wishlist_items WHERE id = :id`, {
        replacements: { id: existing[0].id },
      });
    } else {
      await sequelize.query(
        `INSERT INTO wishlist_items (id, customer_id, product_id) VALUES (:id, :customerId, :productId)`,
        {
          replacements: { id: itemId, customerId, productId: strId },
        }
      );
    }
  } catch {
    let list = memoryWishlistStore[customerId] || [];
    if (list.includes(strId)) {
      list = list.filter((id) => id !== strId);
    } else {
      list.push(strId);
    }
    memoryWishlistStore[customerId] = list;
  }

  return res.status(200).json({ success: true, message: "Wishlist updated" });
});

// POST /api/v1/wishlist/merge - Merge local storage wishlist into DB
router.post("/merge", authenticateCustomer, async (req: Request, res: Response) => {
  const customerId = getCustomerId(req);
  const guestWishlistIds: string[] = req.body.wishlistIds || [];

  if (!Array.isArray(guestWishlistIds)) {
    return res.status(400).json({ success: false, message: "wishlistIds must be an array" });
  }

  for (const prodId of guestWishlistIds) {
    const strId = String(prodId);
    const itemId = `${customerId}-${strId}`;

    try {
      const existing: any = await sequelize.query(
        `SELECT * FROM wishlist_items WHERE customer_id = :customerId AND product_id = :productId LIMIT 1`,
        {
          replacements: { customerId, productId: strId },
          type: QueryTypes.SELECT,
        }
      );

      if (!existing || existing.length === 0) {
        await sequelize.query(
          `INSERT INTO wishlist_items (id, customer_id, product_id) VALUES (:id, :customerId, :productId)`,
          {
            replacements: { id: itemId, customerId, productId: strId },
          }
        );
      }
    } catch {
      let list = memoryWishlistStore[customerId] || [];
      if (!list.includes(strId)) {
        list.push(strId);
      }
      memoryWishlistStore[customerId] = list;
    }
  }

  return res.status(200).json({
    success: true,
    message: "Wishlist merged successfully",
  });
});

export default router;
