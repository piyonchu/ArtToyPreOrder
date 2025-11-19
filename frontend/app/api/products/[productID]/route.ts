import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // http://localhost:5000/api/v1

export async function GET(
  req: NextRequest,
  { params }: { params: { productID: string } }
) {
  try {
    const { productID } = params;

    const token = req.headers.get("authorization"); // optional if user is authenticated

    const res = await fetch(`${API_URL}/arttoys/${productID}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch product" },
        { status: res.status }
      );
    }

    const product = await res.json();
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
