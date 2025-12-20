import {
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg md:text-xl font-bold">KARA</span>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                AI-Powered Learning Intelligence Tool for Internship or Training
                platform.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/atharva-deo-454248320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  className="w-10 h-10 bg-[#FF6B7A] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/AtharvaDeo101"
                  className="w-10 h-10 bg-[#FF6B7A] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact us</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a
                    href="mailto:hello@john.com"
                    className="hover:text-white transition-colors"
                  >
                    deoatharva44@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
