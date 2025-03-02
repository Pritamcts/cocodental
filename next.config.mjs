/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cocodentalcare.com",
        },
      ],
    },
    env: {
      CALCOM_API_KEY: process.env.CALCOM_API_KEY,
      CALCOM_EVENT_TYPE_ID: process.env.CALCOM_EVENT_TYPE_ID,
    },
  };
  
  export default nextConfig;
  

  
