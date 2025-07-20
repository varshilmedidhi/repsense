import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable ");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_sginature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");
    if (!svix_id || !svix_sginature || !svix_timestamp) {
      return new Response("No svix headers found", { status: 400 });
    }
    const payload = await request.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_sginature,
        "svix-timestamp": svix_timestamp,
      }) as WebhookEvent;
    } catch (error) {
      console.log("Error verifying webhook:", error);
      return new Response("Invalid webhook signature", { status: 400 });
    }

    const eventType = evt.type;
    if (eventType === "user.created") {
      const { id, first_name, last_name, image_url, email_addresses } =
        evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();
      try {
        await ctx.runMutation(api.users.syncUser, {
          clerkId: id,
          name: name,
          email: email,
          image: image_url,
        });
      } catch (error) {
        console.error("Error syncing user:", error);
        return new Response("Error syncing user", { status: 500 });
      }

      // Always return a Response
      return new Response("Webhook processed", { status: 200 });
    }
    // Always return a Response for unhandled event types
    return new Response("Event type not handled", { status: 200 });
  }),
});

export default http;
