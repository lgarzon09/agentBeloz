export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-brand-muted">
      <p className="mb-2">
        Built with Next.js and n8n. Memos and workflow JSONs available on
        request.
      </p>
      <div className="flex justify-center gap-6">
        <a href="#" className="text-brand-gold underline hover:opacity-80">
          View Case 1 memo
        </a>
        <a href="#" className="text-brand-gold underline hover:opacity-80">
          View Case 2 memo
        </a>
      </div>
    </footer>
  );
}
