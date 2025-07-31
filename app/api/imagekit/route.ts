import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters() );
}

// this file handles the authentication for ImageKit
// it exports a GET route that returns the authentication parameters needed for ImageKit
// this is used in the ImageUpload component to upload images and videos
// the authentication parameters include a signature, expire time, and token
// the ImageUpload component uses these parameters to upload files to ImageKit