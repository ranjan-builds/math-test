import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // HTML Meta Tags
  title: "Mind Math By Ranjan",
  description: "Improve your mental math skills with Mind Math By Ranjan",

  // Open Graph / Facebook Meta Tags
  openGraph: {
    url: "https://ranjan-builds.github.io/math-test",
    type: "website",
    title: "Mind Math By Ranjan",
    description: "Improve your mental math skills with Mind Math By Ranjan",
    images: [
      {
        url: "https://ogcdn.net/5616fcd4-080f-4e60-8ae3-58ec936a4ec3/v11/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2Fe437457b-545c-48d6-bbab-f183b31722bf.jpg%3Ftoken%3Dk_x2JT2szDDf-aKEe4WUSG3rkqC0VjBlzzRwVif9WW4%26height%3D800%26width%3D1200%26expires%3D33294037003/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F96903fa3-1ee5-4aef-b021-ac9ccca05a5c.svg%3Ftoken%3DSXObzVPwOeYQ1vZBefSJlYI19NhffjAsjhif3v5uf4g%26height%3D150%26width%3D274%26expires%3D33279328195/Improve%20your%20mental%20math%20skills%20with%20Mind%20Math%20By%20Ranjan/rgba(0%2C0%2C0%2C1)/Practice%20now/rgba(0%2C0%2C0%2C1)/rgba(0%2C0%2C0%2C1)/og.png",
      },
    ],
  },

  // Twitter Meta Tags
  twitter: {
    card: "summary_large_image",
    domain: "ranjan-builds.github.io",
    url: "https://ranjan-builds.github.io/math-test",
    title: "Mind Math By Ranjan",
    description: "Improve your mental math skills with Mind Math By Ranjan",
    images: [
      "https://ogcdn.net/5616fcd4-080f-4e60-8ae3-58ec936a4ec3/v11/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2Fe437457b-545c-48d6-bbab-f183b31722bf.jpg%3Ftoken%3Dk_x2JT2szDDf-aKEe4WUSG3rkqC0VjBlzzRwVif9WW4%26height%3D800%26width%3D1200%26expires%3D33294037003/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F96903fa3-1ee5-4aef-b021-ac9ccca05a5c.svg%3Ftoken%3DSXObzVPwOeYQ1vZBefSJlYI19NhffjAsjhif3v5uf4g%26height%3D150%26width%3D274%26expires%3D33279328195/Improve%20your%20mental%20math%20skills%20with%20Mind%20By%20Ranjan/rgba(0%2C0%2C0%2C1)/Practice%20now/rgba(0%2C0%2C0%2C1)/rgba(0%2C0%2C0%2C1)/og.png",
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
