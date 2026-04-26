export function Header() {
  return (
    <header className="bg-brand-navy border-b-[3px] border-brand-gold">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <p className="text-brand-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          BELOZ &middot; Strategy &amp; Ops Demo
        </p>
        <h1 className="text-white text-2xl md:text-3xl font-semibold mb-2">
          Two agents that operationalize the GTM
        </h1>
        <p className="text-white/80 italic text-sm md:text-base">
          Interview deliverable for the Strategy and Ops Lead position. Click
          any agent to try it live.
        </p>
      </div>
    </header>
  );
}
