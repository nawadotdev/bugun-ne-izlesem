import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { verifyToken } from "../../../../lib/auth";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Yetkilendirme başarısız" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const userId = await verifyToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: "Yetkilendirme başarısız" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Me endpoint error:", error);
    return NextResponse.json(
      { message: "Yetkilendirme başarısız" },
      { status: 401 }
    );
  }
} 