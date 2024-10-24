import { getPusherServer } from "@/lib/pusher/server";

const pusherServer = await getPusherServer();

export async function POST(req: Request) {
  const data = await req.text();
  console.log('Pusher authentication ...', data);
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);
  
    const authResponse = pusherServer.authorizeChannel(socketId, channelName);

    return new Response(JSON.stringify(authResponse));
}