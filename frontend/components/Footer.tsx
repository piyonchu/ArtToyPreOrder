import Link from "next/link";
import React from "react";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    // Added theme variants to background color
    <footer className="grid justify-center p-4 gap-8 bg-sky-200 pink:bg-pink-200 green:bg-green-200 purple:bg-purple-200 text-base-content transition-colors duration-300">
      <div className="flex items-center justify-center gap-10">
        <Link href={"#"} className="hover:underline">
          About us
        </Link>
        <Link href={"#"} className="hover:underline">
          Contact
        </Link>
        <Link href={"#"} className="hover:underline">
          Jobs
        </Link>
        <Link href={"#"} className="hover:underline">
          Press kit
        </Link>
      </div>
      <div>
        <div className="flex items-center justify-center gap-8">
          <Link href={"#"} target="_blank">
            <Instagram />
          </Link>
          <Link href={"#"} target="_blank">
            <Twitter />
          </Link>
          <Link href={"#"} target="_blank">
            <Linkedin />
          </Link>
        </div>
      </div>
      <div>
        <p>
          Copyright © 2025 - All rights reserved by{" "}
          <Link
            href={"#"}
            target="_blank"
            className="hover:underline"
          >
            6632134521 Piyongkul Rardyota
          </Link>
        </p>
      </div>
    </footer>
  );
};


export default Footer;
