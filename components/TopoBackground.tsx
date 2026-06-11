export default function TopoBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="#1E363B" strokeWidth="1.2">
        <path d="M-50,120 C200,60 380,180 620,130 S1000,40 1260,110" />
        <path d="M-50,190 C220,130 400,250 640,200 S1010,110 1260,180" />
        <path d="M-50,270 C240,210 420,330 660,280 S1020,190 1260,260" />
        <path d="M-50,360 C260,300 440,420 680,370 S1030,280 1260,350" />
        <path d="M-50,460 C280,400 460,520 700,470 S1040,380 1260,450" />
        <path d="M-50,560 C300,500 480,620 720,570 S1050,480 1260,550" />
        <path d="M-50,660 C320,600 500,720 740,670 S1060,580 1260,650" />
      </g>
      <g fill="#234047">
        <circle cx="950" cy="160" r="3" />
        <circle cx="240" cy="430" r="3" />
        <circle cx="640" cy="560" r="3" />
      </g>
    </svg>
  );
}
