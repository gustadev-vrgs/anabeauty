interface PageTitleProps {
  title: string;
  subtitle: string;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-bold text-coffee-darkRoast sm:text-3xl">{title}</h1>
      <p className="text-sm text-coffee-espresso">{subtitle}</p>
    </header>
  );
}
