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
