// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       "example.com", 
//       "another-domain.com", 
//       "uhrpfnyjcvpwoaioviih.supabase.co", // Add your Supabase domain here
//       "drive.usercontent.google.com",
//       "m.media-amazon.com"
//     ],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//       {
//         protocol: "https",
//         hostname: "rukminim2.flixcart.com",
//       },
//       {
//         protocol: "https",
//         hostname: "m.media-amazon.com",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Empty array means no restrictions
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Allows any domain over HTTPS
      },
    ],
  },
};

module.exports = nextConfig;
