import watermark from "@/assets/mugec-watermark.png";

/** Visuel MUGEC-CI en filigrane discret derrière un formulaire ou document. */
export function Watermark({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <img
        src={watermark}
        alt=""
        style={{ opacity }}
        className="w-[120%] max-w-none select-none"
      />
    </div>
  );
}
