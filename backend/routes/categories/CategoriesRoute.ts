import express, { Response, Request } from "express";
import { db } from "../../utils/Firebase";
import { CategoryModel } from "../../models/category/Category";
import { v4 as uuid } from "uuid";
const router = express.Router();

// create new category
router.post("/createcategory", async (req: Request, res: Response) => {
    const body = req.body;
    const id = uuid();
    const category: CategoryModel = {
        id,
        name: body.name
    }

    try {
        const response = await db.collection("categories").doc(id).set(category);
        if (response) {
            return res.json({
                message: "Category Created",
                data: category,
            }).status(200)
        }
    } catch (error) {
        console.log(error);
        return res.json({
            message: "error creating category",
        }).status(500)
    }
})


// get all categories
router.get("/getcategories", async (req: Request, res: Response) => {
    try {
        const categories: CategoryModel[] = [];
        const snapshot = await db.collection("categories").get();
        snapshot.forEach((doc) => {
            categories.push(doc.data() as CategoryModel);
        });
        return res.json({
            message: "Categories Fetched",
            data: categories,
        }).status(200)
    } catch (error) {
        console.log(error);
        return res.json({
            message: "error fetching categories",
        }).status(500)
    }
})

// get specific category
router.get("/single/:category", async (req: Request, res: Response) => {
    const category = req.params.category;
    try {
        // categories snapshot
        const categories = db.collection("categories").where("name", "==", category);
        const snapshot = await categories.get();
        if (snapshot.empty) {
            return res.json({
                message: "Category Not Found",
            }).status(404)
        }
        const categoryData: CategoryModel[] = [];
        snapshot.forEach((doc) => {
            categoryData.push(doc.data() as CategoryModel);
        });
        return res.json({
            message: "Category Fetched",
            data: categoryData[0].name,
        }).status(200)

    } catch (error) {
        console.log(error);
        return res.json({
            message: "error fetching category",
        }).status(500)
    }
})

// update category
router.put("/:category", async (req: Request, res: Response) => {
    const category = req.params.category;
    const body = req.body;
    const categoryRef = db.collection("categories").where("name", "==", category);
    const doc = await categoryRef.get();
    if (doc) {
        try {
            doc.forEach((doc) => {
                doc.ref.update(body);
            });
            return res.json({
                message: "Category Updated",
                data: body,
            }).status(200)
        } catch (error) {
            console.log(error);
            return res.json({
                message: "error updating category",
            }).status(500)
        }
    }
    return res.json({
        message: "Category Not Found",
    }).status(404)
})

// delete category
router.delete("/:category", async (req: Request, res: Response) => {
    const category = req.params.category;
    const categoryRef = db.collection("categories").where("id", "==", category);
    // get this category and delete it
    const snapshot = await categoryRef.get();
    if (snapshot) {
        try {
            snapshot.forEach((doc) => {
                doc.ref.delete();
            });
            return res.json({
                message: "Category Deleted",
            }).status(200)
        } catch (error) {
            console.log(error);
            return res.json({
                message: "error deleting category",
            }).status(500)
        }
    }

    return res.json({
        message: "Category Not Found",
    }).status(404)
})

export { router as CategoriesRoute }