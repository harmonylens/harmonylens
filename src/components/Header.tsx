import { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-mark.png";
import { events } from "../data/photos";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const currentEvent = location.pathname.startsWith("/event/")
    ? decodeURIComponent(location.pathname.split("/event/")[1] ?? "")
    : "";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive ? "text-black" : "text-black/70 hover:text-black/90"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-black/10">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Redeemed"
            className="h-20 w-20 cursor-pointer hover:[animation:spin-2d-slow_12s_linear_infinite]"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass} end>
            Alle fotos
          </NavLink>

          <div className="flex items-center gap-3">
            <span className="text-sm text-black/70">Evenement</span>
            <select
              className="text-sm border border-black/20 rounded-md px-3 py-2 bg-white"
              value={currentEvent}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                navigate(`/event/${encodeURIComponent(v)}`);
              }}
            >
              <option value="" disabled>
                Kies evenement…
              </option>
              {events.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>
        </nav>

        {/* Burger button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-black/15 px-3 py-2 text-sm"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black/10 bg-white/95">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4">
            <NavLink
              to="/"
              className="text-sm font-medium"
              end
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-black/60">Evenement</span>
              <select
                className="text-sm border border-black/20 rounded-md px-3 py-2 bg-white"
                value={currentEvent}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  navigate(`/event/${encodeURIComponent(v)}`);
                  setOpen(false);
                }}
              >
                <option value="" disabled>
                  Kies evenement…
                </option>
                {events.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
