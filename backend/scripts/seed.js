require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Book = require("../books/models/Book");
const User = require("../users/models/User");

async function seed() {
  // Защита от случайного запуска
  if ((process.env.SEED || "").toLowerCase() !== "true") {
    console.log("Seed is disabled. Set SEED=true in backend/.env to run it.");
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production") {
    console.log("Refusing to seed in production.");
    process.exit(1);
  }

  const uri =
  process.env.MONGO_URI ||
  process.env.DB_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_LOCAL_URI ||
  process.env.MONGO_ATLAS_URI;


  if (!uri) {
    console.log("No MongoDB URI found. Set MONGO_URI/DB_URI/MONGODB_URI in backend/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const reset = (process.env.SEED_RESET || "").toLowerCase() === "true";
  if (reset) {
    await Promise.all([User.deleteMany({}), Book.deleteMany({})]);
    console.log("Cleared Users and Books (SEED_RESET=true)");
  }

  // пароль должен проходить PASSWORD_REGEX
  const plainPassword = "1qazxsw2!Q";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // users
  const usersData = [
    {
      name: { first: "User", middle: "", last: "Test" },
      email: "user-test12@gmail.com",
      password: hashedPassword,
      country: "Israel",
      city: "Tel Aviv",
      image: { url: "https://picsum.photos/200", alt: "User avatar" },
      isAdmin: false,
    },
    {
      name: { first: "User", middle: "", last: "Admin" },
      email: "user-admin13@gmail.com",
      password: hashedPassword,
      country: "Israel",
      city: "Jerusalem",
      image: { url: "https://picsum.photos/200", alt: "Admin avatar" },
      isAdmin: true,
    },
  ];

  const users = [];
  for (const u of usersData) {
    const existing = await User.findOne({ email: u.email });
    if (existing) users.push(existing);
    else users.push(await User.create(u));
  }

  const [testUser, adminUser] = users;
  console.log(`Users ready: ${users.map(u => u.email).join(", ")}`);

  // books
  const booksData = [
    {
      user_id: testUser._id,
      title: "The Adventures of Tom Sawyer",
      author: "Mark Twain",
      language: "English",
      genre: "other",
      description: "First seed book.",
      image: "https://picsum.photos/seed/book1/400/600",
      pages: 230,
      publishedYear: 1876,
      rating: 4,
      notes: "Seed notes",
      readYear: new Date().getFullYear(),
      likes: [testUser._id.toString()],
      wants: [],
      states: [{ user: testUser._id, status: "finished" }],
    },
    {
      user_id: testUser._id,
      title: "Animal Farm",
      author: "George Orwell",
      language: "English",
      genre: "Classic",
      description: "Second seed book.",
      image: "https://res.cloudinary.com/bloomsbury-atlas/image/upload/w_360,c_scale,dpr_1.5/jackets/9781847498588.jpg",
      pages: 112,
      publishedYear: 1945,
      rating: 5,
      notes: "",
      readYear: 2020,
      likes: [],
      wants: [testUser._id.toString()],
      states: [{ user: testUser._id, status: "reading" }],
    },
    {
      user_id: adminUser._id,
      title: "1984",
      author: "George Orwell",
      language: "English",
      genre: "Fiction",
      description: "Admin-owned seed book.",
      image: "https://m.media-amazon.com/images/I/61NAx5pd6XL._AC_UF1000,1000_QL80_.jpg",
      pages: 328,
      publishedYear: 1949,
      rating: 5,
      notes: "",
      readYear: 2021,
      likes: [testUser._id.toString()],
      wants: [],
      states: [{ user: testUser._id, status: "unread" }],
    },
  ];

  // чтобы не плодить дубликаты по тайтлу у владельца
  for (const b of booksData) {
    await Book.deleteMany({ user_id: b.user_id, title: b.title });
  }

  const inserted = await Book.insertMany(booksData);
  console.log(`Books seeded: ${inserted.length}`);

  console.log("Seed credentials:");
  console.log("user-test12@gmail.com / 1qazxsw2!Q");
  console.log("user-admin13@gmail.com / 1qazxsw2!Q");

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
