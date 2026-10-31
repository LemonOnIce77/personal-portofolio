export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-enter will-change-[opacity]">{children}</div>;
}

