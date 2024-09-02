import { getPusherServer } from "@/lib/pusher/server";
import { NextResponse } from "next/server";

const pusherServer =  getPusherServer();

export async function POST(req: Request) {
  try {
    console.log("Pusher route send message...");
    await pusherServer.trigger("jambon", "new_message", {
      message: "test",
      date: Date.now(),
    });
    return NextResponse.json({ message: "Send message OK" }, { status: 200 });
  } catch (error: any) {
    console.log("ERROR PUSHER ROUTE MESSAGE : ", error?.message);
    return NextResponse.json(
      { message: "failed to send message", error },
      { status: 500 }
    );
  }
}
