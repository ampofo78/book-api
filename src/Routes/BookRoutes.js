import express from "express";
import cloudinary from "../config/cloudinary.js";
import { VerifyToken } from "../Middleware/AuthTokenVerifier.js";
import Book from "../Models/Book.js";
//import { hashPassword } from "../HashPassword.js";
const Router = express.Router();

Router.post("/", VerifyToken, async (req, res) => {
  const { title, caption, image, rating } = req.body;

  try {
    if (!rating || !image || !caption || title)
      return res.status(400).json({ message: "All fields required" });
    const result = await cloudinary.uploader.upload(image, {
      resource_type: "image",
    });

    const ImageUrl = result.secure_url;
    const ImagepublicId = result.public_id;

    const book = new Book({
      title: title,
      rating: rating,
      caption: caption,
      image: ImageUrl,
      imagePublicId: ImagepublicId,
      user: req.user._id,
    });
    await book.save();
    return res.status(201).json({
      book: {
        title: book.title,
        rating: book.rating,
        caption: book.caption,
        image: book.image,
        imagePublicId: book.imagePublicId,
      },
    });
  } catch (error) {}
});

Router.get("/", VerifyToken, async (req, res) => {
  // skip = page * limit
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "username profileImage");
    const totalBooks = Book.countDocuments();
    res.status(200).send({
      books,
      currentPage: page,
      totalBooks: totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in getting all books", error);
  }
});

Router.delete("/:id", VerifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized User" });
    try {
      await cloudinary.uploader.destroy(book.imagePublicId);
    } catch (error) {
      console.log("Error in deleting Image from Cloudinary", error);
    }
    await book.deleteOne();

    res.json({ message: "Book deleted Successfully" });
  } catch (error) {
    console.log("Error in Deleting Book", error);
  }
});

Router.get("/user", VerifyToken, async (req, res) => {
  try {
    const books = Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.log("Get User Books Error", error);
  }
});

export default Router;
