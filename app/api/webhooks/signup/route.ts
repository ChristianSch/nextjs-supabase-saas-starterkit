import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import loopsNewsletterProvider from "@/app/modules/newsletter/provider/loops-so";
import { NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
) {
    const authHeader = headers().get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("missing token");
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Initialize Supabase client
    const supabase = createClient();
    const token = authHeader.split(" ")[1];

    // data is a boolean
    const { data, error } = await supabase.rpc("verify_webhook_token", {
        token: token,
    });

    if (error || !data) {
        console.log("token not valid:", error);
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { email, name } = await req.json();

    try {
        await loopsNewsletterProvider
            .addSubscriber({
                email: email,
            });

        console.log(`Signed up ${email} (${name}) to the newsletter`);

        return NextResponse.json({
            message: "User signed up to newsletter successfully",
        });
    } catch (error) {
        console.error("Error signing up user to newsletter:", error);
        return NextResponse.json({
            message: "Error signing up user to newsletter",
        }, { status: 500 });
    }
}
