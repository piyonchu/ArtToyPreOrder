import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { productID: string } }
) {
  try {
    const { productID } = params;
    const token = req.headers.get("authorization");
    
    // FIX: Use proper template literal syntax
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    console.log(`Fetching product: ${apiUrl}/arttoys/${productID}`);

    const res = await fetch(`${apiUrl}/arttoys/${productID}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      cache: 'no-store', // Prevent caching issues on Vercel
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
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Add other methods if needed
export async function PUT(
  req: NextRequest,
  { params }: { params: { productID: string } }
) {
  try {
    const { productID } = params;
    const token = req.headers.get("authorization");
    const body = await req.json();
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(`${apiUrl}/arttoys/${productID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to update product" },
        { status: res.status }
      );
    }

    const product = await res.json();
    return NextResponse.json(product);
  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productID: string } }
) {
  try {
    const { productID } = params;
    const token = req.headers.get("authorization");
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(`${apiUrl}/arttoys/${productID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to delete product" },
        { status: res.status }
      );
    }

    const product = await res.json();
    return NextResponse.json(product);
  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}