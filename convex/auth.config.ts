// convex/auth.config.ts
export default {
  providers: [
    {
      // this must match the Issuer URL from your Clerk JWT template
      domain: "https://full-stinkbug-90.clerk.accounts.dev",
      // this must exactly match the ‘aud’ field of your Clerk JWT (i.e. the template name “convex”)
      applicationID: "convex",
    },
  ],
};
