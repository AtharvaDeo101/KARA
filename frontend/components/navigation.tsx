 
import Link from "next/link"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <nav className="flex items-center justify-between bg-background border-2 border-border rounded-xl px-5 py-3 max-w-4xl mx-auto shadow-lg">
        <Link
          href="/"
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
        >
          <Brain className="w-6 h-6 text-primary-foreground" />
        </Link>

        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          <Link href="/" className="text-[18px] font-bold leading-[20px] hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#features" className="text-[18px] font-bold leading-[20px] hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/predict" className="text-[18px] font-bold leading-[20px] hover:text-primary transition-colors">
            Predictions
          </Link>
          <Link href="/#about" className="text-[18px] font-bold leading-[20px] hover:text-primary transition-colors">
            About
          </Link>
        </div>

        <Link href="/predict">
          <Button className="rounded-sm px-5 h-12 min-w-[48px] flex-shrink-0">Get Started</Button>
        </Link>
      </nav>
    </div>
  )
}
