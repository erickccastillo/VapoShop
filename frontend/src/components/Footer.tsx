import React from "react";

export default function Footer() {
  const logoUrl = "https://lh3.googleusercontent.com/aida/AP1WRLuGFln6hE_hBbU5dgQHUDCGwgXTOzXpcxd3HgTTTlStSwZSdpc6Zcj27ESsyWg99u_9t-2xBvfzrIYSR1DPJYZeUMK4TOSqLIj_ucFyG-Z6XmNzRtRGg01qZ6c0m6F40ELqjd4SQ-PTK8X7-dUtSSOh0-gQTlHNJRBNPZ1S7eIlhLUOfzujsMWYA9ISomZsABPabCKb054tUZwlWtD5GEJS-0-TXgWQBFGitsvtIBgUTsDu7rASx2bknA";

  return (
    <footer className="bg-[#0c0f0f] w-full py-24 border-t border-white/5" id="main-footer">
      <div className="max-w-[1280px] mx-auto px-[20px] md:px-[64px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          
          {/* Columna 1: Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img alt="Logo" className="h-8 w-8 opacity-80" src={logoUrl} />
              <span className="font-['EB_Garamond'] text-[32px] font-normal leading-[1.3] text-[#c5a059] tracking-tight">
                Glass Therapy
              </span>
            </div>
            <p className="text-[#d1c5b4]/70 max-w-xs leading-relaxed">
              Curating the world's finest glass artistry and technical vaporization systems for the discerning collector.
            </p>
          </div>
          
          {/* Columna 2: Navegación */}
          <nav className="flex flex-col gap-4">
            <h4 className="font-['Hanken_Grotesk'] text-[14px] font-medium tracking-[0.2em] text-[#e2e2e2] uppercase mb-2">
              Navigation
            </h4>
            <a className="text-[#d1c5b4] hover:text-[#c5a059] transition-colors duration-300" href="#">Philosophy</a>
            <a className="text-[#d1c5b4] hover:text-[#c5a059] transition-colors duration-300" href="#">Shipping & Returns</a>
            <a className="text-[#d1c5b4] hover:text-[#c5a059] transition-colors duration-300" href="#">Care Guide</a>
            <a className="text-[#d1c5b4] hover:text-[#c5a059] transition-colors duration-300" href="#">Contact Us</a>
          </nav>
          
          {/* Columna 3: Redes y Copyright */}
          <div className="flex flex-col gap-4">
            <h4 className="font-['Hanken_Grotesk'] text-[14px] font-medium tracking-[0.2em] text-[#e2e2e2] uppercase mb-2">
              Connect
            </h4>
            <div className="flex gap-6">
              <a className="text-[#d1c5b4] hover:text-[#c5a059] transition-all duration-300" href="#">Instagram</a>
              <a className="text-[#d1c5b4] hover:text-[#c5a059] transition-all duration-300" href="#">Pinterest</a>
            </div>
            <p className="text-[#d1c5b4]/50 text-[13px] mt-12">
              © 2024 Glass Therapy. All rights reserved. <br />Crafted for excellence.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}