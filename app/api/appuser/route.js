
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  await connectMongo(); 

  const { firstName, lastName, email, password, confirmPassword } = await req.json();

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ message: "Passwords do not match" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return new Response(
      JSON.stringify({ message: "User registered successfully", token }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
