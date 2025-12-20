const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // владелец карточки
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxLength: 1000 },
    image: { type: String, trim: true },
    pages: { type: Number, min: 0 },
    publishedYear: { type: Number, min: 0, max: new Date().getFullYear() },
    rating: { type: Number, min: 0, max: 5, default: 0 },   
    notes: { type: String, trim: true, default: "" },  
    readYear: { type: Number, min: 0, max: new Date().getFullYear() },
    likes: [{ type: String }],     
    wants: [{ type: String }], 
    states: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["reading", "finished", "unread"], required: true },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

bookSchema.index({ "states.user": 1 });
bookSchema.index({ likes: 1 });
bookSchema.index({ wants: 1 });

module.exports = mongoose.models.Book || mongoose.model("Book", bookSchema);
