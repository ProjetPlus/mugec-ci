import logo from "@/assets/mugec-logo.png";

/** Logo MUGEC-CI en filigrane discret derrière un formulaire ou document. */
export function Watermark({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <img
        src={logo}
        alt=""
        style={{ opacity }}
        className="w-[140%] max-w-none -rotate-12 select-none"
      />
    </div>
  );
}
