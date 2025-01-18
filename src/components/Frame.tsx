"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";

function SocialLinkCard({ name, url, icon }: { name: string, url: string, icon: string }) {
  const handleClick = useCallback(() => {
    sdk.actions.openUrl(url);
  }, [url]);

  return (
    <div 
      className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
      onClick={handleClick}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        className="text-neutral-600"
      >
        <path fill="currentColor" d={icon} />
      </svg>
      <div className="flex-1">
        <h3 className="font-medium text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-600">{new URL(url).hostname}</p>
      </div>
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24"
        className="text-neutral-400"
      >
        <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </div>
  );
}

function RecentShareCard({ text, url, timestamp }: { text: string, url: string, timestamp: string }) {
  const handleClick = useCallback(() => {
    sdk.actions.openUrl(url);
  }, [url]);

  return (
    <div 
      className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
      onClick={handleClick}
    >
      <p className="text-neutral-900">{text}</p>
      <p className="text-sm text-neutral-500 mt-1">
        {new Date(timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })}
      </p>
    </div>
  );
}

function LinkTree() {
  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">Avneesh's Links</CardTitle>
        <CardDescription className="text-neutral-600">
          Connect with me across platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-neutral-600">Social Links</Label>
          {SOCIAL_LINKS.map((link) => (
            <SocialLinkCard key={link.name} {...link} />
          ))}
        </div>
        
        <div className="space-y-2">
          <Label className="text-neutral-600">Recent Shares</Label>
          {RECENT_SHARES.map((share, index) => (
            <RecentShareCard key={index} {...share} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">{title}</h1>
        <LinkTree />
      </div>
    </div>
  );
}
