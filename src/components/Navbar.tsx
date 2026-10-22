import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/70 border-b border-neutral-800/80">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-neutral-100 hover:text-white transition">
          emil<span className="text-neutral-500">.dev</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-400">
          <Link href="#about" className="hover:text-neutral-100 transition">Tentang</Link>
          <Link href="#projects" className="hover:text-neutral-100 transition">Proyek</Link>
          <Link href="#skills" className="hover:text-neutral-100 transition">Skills</Link>
          <Link href="#contact" className="hover:text-neutral-100 transition">Kontak</Link>
        </nav>
      </div>
    </header>
  );
}