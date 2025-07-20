// convex/auth.config.ts
export default {
  providers: [
    {
      // this must match the Issuer URL from your Clerk JWT template
      domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL!,
      // this must exactly match the ‘aud’ field of your Clerk JWT (i.e. the template name “convex”)
      applicationID: "convex",
    },
  ],
};
