type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return (
    <main className={`max-w-6xl mx-auto px-6 py-16 ${className}`.trim()}>
      {children}
    </main>
  );
}
