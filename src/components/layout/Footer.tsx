
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 px-4 border-t mt-auto">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Weather Weaver. Powered by OpenWeatherMap.</p>
      </div>
    </footer>
  );
}
