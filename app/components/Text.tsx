export function ThiccTitle({
  as = "h1",
  children,
}: {
  as?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  const Component = as as React.ElementType;
  return <Component className="text-4xl font-bold">{children}</Component>;
}

export function ValidationError({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-red-500 dark:text-red-300" role="alert">
      {children}
    </div>
  );
}
