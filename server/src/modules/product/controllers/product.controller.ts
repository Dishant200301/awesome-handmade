import { Request, Response } from "express";
import { productStore } from "../store/productStore.js";
import { AiProductGeneratorService } from "../services/aiProductGenerator.service.js";

export class ProductController {
  // GET /api/v1/products (with pagination & search)
  public static getAllProducts(req: Request, res: Response): void {
    if (req.query.page || req.query.limit || req.query.search || req.query.category || req.query.status || req.query.sort) {
      const result = productStore.queryProducts({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        search: req.query.search as string,
        category: req.query.category as string,
        status: req.query.status as string,
        sort: req.query.sort as string
      });
      res.status(200).json({
        success: true,
        ...result
      });
      return;
    }

    const isWebsiteClient = req.query.admin !== "true";
    const products = productStore.getAll(isWebsiteClient);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  }

  // POST /api/v1/products/bulk-delete
  public static bulkDeleteProducts(req: Request, res: Response): void {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: "Invalid product IDs array" });
      return;
    }
    const count = productStore.bulkDelete(ids);
    res.status(200).json({ success: true, count, message: `Successfully deleted ${count} products` });
  }

  // POST /api/v1/products/bulk-status
  public static bulkUpdateStatus(req: Request, res: Response): void {
    const { ids, isPublished } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: "Invalid product IDs array" });
      return;
    }
    const count = productStore.bulkStatus(ids, isPublished !== false);
    res.status(200).json({ success: true, count, message: `Successfully updated ${count} products` });
  }

  // GET /api/v1/products/export
  public static exportProducts(_req: Request, res: Response): void {
    const products = productStore.getAll(false);
    res.status(200).json({ success: true, data: products });
  }

  // GET /api/v1/products/:query
  public static getProductByIdOrSlug(req: Request, res: Response): void {
    const { query } = req.params;
    const product = productStore.getByIdOrSlug(query);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product not found for: ${query}`
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product
    });
  }

  // POST /api/v1/products (Admin API)
  public static createProduct(req: Request, res: Response): void {
    try {
      const newProduct = productStore.add(req.body);
      res.status(201).json({
        success: true,
        message: "Product created successfully!",
        data: newProduct
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: (err as Error).message
      });
    }
  }

  // PUT /api/v1/products/:id (Admin API)
  public static updateProduct(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const updated = productStore.update(id, req.body);

      if (!updated) {
        res.status(404).json({
          success: false,
          message: "Product not found to update"
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updated
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: (err as Error).message
      });
    }
  }

  // DELETE /api/v1/products/:id (Admin API)
  public static deleteProduct(req: Request, res: Response): void {
    const { id } = req.params;
    const deleted = productStore.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Product not found to delete"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  }

  // POST /api/v1/products/ai-generate (AI Image to Product Generator)
  public static async generateFromImage(req: Request, res: Response): Promise<void> {
    try {
      const { image, hint } = req.body;
      if (!image) {
        res.status(400).json({ success: false, message: "Product image is required for AI generation" });
        return;
      }

      const generatedData = await AiProductGeneratorService.generateFromImage(image, hint);
      res.status(200).json({
        success: true,
        data: generatedData,
        message: "Product content generated successfully"
      });
    } catch (error: any) {
      console.error("AI Generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate product details"
      });
    }
  }
}
