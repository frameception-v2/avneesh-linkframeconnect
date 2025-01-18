import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAiYXZuZWVzaC1saW5rZnJhbWVjb25uZWN0LnZlcmNlbC5hcHAifQ",
      signature: "MHgwZTFkMjBmNzUxYWQ2M2RiNTk5MTZjZGQyZDU3NGExMjFkYmFiYTQ1MTYxNmY2MzUzZGFkYzNkZjdkMTY0YmI5MDZjNTRkZmU4ZGZlYmIzYmMyMTM1ZmIyMGE2YzMwYTZiZGVhNzg5ZjhjODkxMTM2NzVlZmUxNzlhNjEzZGJjYTFi"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
