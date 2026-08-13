import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client using your secure environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, idea } = body;

    // Validate that we received the data
    if (!name || !email || !idea) {
      return NextResponse.json(
        { error: "Name, email, and idea are required" },
        { status: 400 }
      );
    }

    // Insert the data into your Supabase 'ideas' table
    const { data, error } = await supabase
      .from('ideas')
      .insert([{ name, email, idea }]);

    // If Supabase throws an error (e.g., table not found), catch it
    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json(
        { error: "Failed to save to database." },
        { status: 500 }
      );
    }

    // Success response!
    return NextResponse.json({ message: "Idea successfully saved!" }, { status: 200 });
    
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}