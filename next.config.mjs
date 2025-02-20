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
  };
  
  export default nextConfig;
  
