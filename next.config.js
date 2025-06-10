/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      //Super admin
      {
        source: "/panels/superadmin/dashboard",
        destination: "/admin-panels/superadmin/dashboard",
      },
      {
        source: "/panels/superadmin/employees",
        destination: "/admin-panels/superadmin/employees",
      },
      {
        source: "/panels/superadmin/hirings",
        destination: "/admin-panels/superadmin/hirings",
      },
      {
        source: "/panels/superadmin/interview",
        destination: "/admin-panels/superadmin/interview",
      },
      {
        source: "/panels/superadmin/employer",
        destination: "/admin-panels/superadmin/employer",
      },
      {
        source: "/panels/superadmin/agents",
        destination: "/admin-panels/superadmin/agents",
      },

      // Employees / Candidates
      {
        source: "/panels/employee/dashboard",
        destination: "/admin-panels/employee/dashboard",
      },
      {
        source: "/panels/employee/profile",
        destination: "/admin-panels/employee/profile",
      },
      {
        source: "/panels/employee/interview",
        destination: "/admin-panels/employee/interview",
      },

      //employers
      {
        source: "/panels/employer/profile",
        destination: "/admin-panels/employer/profile",
      },

      {
        source: "/panels/employer/dashboard",
        destination: "/admin-panels/employer/dashboard",
      },
      // {
      //   source: "/panels/employer/employees",
      //   destination: "/admin-panels/employer/employees",
      // },
      {
        source: "/panels/employer/hirings",
        destination: "/admin-panels/employer/hirings",
      },
      {
        source: "/panels/employer/interview",
        destination: "/admin-panels/employer/interview",
      },

      //agency
      {
        source: "/panels/agency/dashboard",
        destination: "/admin-panels/agency/dashboard",
      },
      {
        source: "/panels/agency/profile",
        destination: "/admin-panels/agency/profile",
      },
      {
        source: "/panels/agency/employees",
        destination: "/admin-panels/agency/employees",
      },
      {
        source: "/panels/agency/hirings",
        destination: "/admin-panels/agency/hirings",
      },
      {
        source: "/panels/agency/interviews",
        destination: "/admin-panels/agency/interviews",
      },   
        //website routes
        {
          source: "/home",
          destination: "/website/home",
        }, 
        {
          source: "/about",
          destination: "/website/about",
        }, 
        {
          source: "/contact",
          destination: "/website/contact",
        }, 
        {
          source: "/faq",
          destination: "/website/faq",
        }, 
        {
          source: "/terms",
          destination: "/website/terms",
        }, 
        {
          source: "/employees",
          destination: "/website/employees",
        }, 
        {
          source: "/employers",
          destination: "/website/employers",
        }, 
    ];
  },

  async redirects() {
    return [
      {
        source: "/old-team",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/promo",
        destination: "/special-offer",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
  images: {
    domains: ["your-cdn-domain.com", "images.unsplash.com"],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

module.exports = nextConfig;
