import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-purple-900">
        <div tw="flex flex-col items-center p-8 bg-white/90 rounded-2xl shadow-2xl">
          <h1 tw="text-6xl font-bold text-purple-900 mb-4">{PROJECT_TITLE}</h1>
          <h3 tw="text-2xl text-purple-800 text-center max-w-[80%]">{PROJECT_DESCRIPTION}</h3>
          <div tw="mt-6 flex items-center">
            <svg tw="w-12 h-12 mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
            </svg>
            <span tw="text-xl font-medium text-purple-900">Farcaster Frame</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
