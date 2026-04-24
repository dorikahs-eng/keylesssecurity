type Props = { doorId: string; size?: 'card' | 'hero' };

export default function DoorIllustration({ doorId, size = 'card' }: Props) {
  const w = size === 'hero' ? 260 : 200;
  const h = size === 'hero' ? 340 : 240;

  const doors: Record<string, JSX.Element> = {
    'front-entry': (
      <svg viewBox="0 0 200 240" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="240" fill="#0d1e35"/>
        <rect y="210" width="200" height="30" fill="#0a1628"/>
        <rect x="30" y="198" width="140" height="14" rx="1" fill="#162540"/>
        <rect x="20" y="208" width="160" height="8" rx="1" fill="#1a2d45"/>
        {/* Wall */}
        <rect x="0" y="60" width="55" height="148" fill="#122035"/>
        <rect x="145" y="60" width="55" height="148" fill="#122035"/>
        {/* Stone texture */}
        {[0,20,40,60,80,100,120,140].map(y => (
          <rect key={y} x="0" y={60+y} width="55" height="1" fill="#0a1628" opacity="0.4"/>
        ))}
        {/* Sidelights */}
        <rect x="33" y="72" width="22" height="130" rx="2" fill="#162848"/>
        <rect x="36" y="76" width="16" height="58" rx="1" fill="#0d2138" opacity="0.9"/>
        <rect x="36" y="140" width="16" height="55" rx="1" fill="#0d2138" opacity="0.9"/>
        <rect x="145" y="72" width="22" height="130" rx="2" fill="#162848"/>
        <rect x="148" y="76" width="16" height="58" rx="1" fill="#0d2138" opacity="0.9"/>
        <rect x="148" y="140" width="16" height="55" rx="1" fill="#0d2138" opacity="0.9"/>
        {/* Door frame */}
        <rect x="54" y="60" width="92" height="148" rx="2" fill="#1a3358"/>
        {/* Transom */}
        <rect x="56" y="62" width="88" height="18" rx="1" fill="#0f2040"/>
        {/* Main door */}
        <rect x="58" y="80" width="84" height="126" rx="2" fill="#0a1825"/>
        {/* Door panels */}
        <rect x="65" y="88" width="70" height="50" rx="3" fill="#0d1f35" stroke="#1a3050" strokeWidth="1.5"/>
        <rect x="65" y="146" width="70" height="30" rx="3" fill="#0d1f35" stroke="#1a3050" strokeWidth="1.5"/>
        <rect x="65" y="183" width="70" height="18" rx="3" fill="#0d1f35" stroke="#1a3050" strokeWidth="1.5"/>
        {/* Smart lock */}
        <rect x="129" y="136" width="16" height="25" rx="4" fill="#FF5500"/>
        <rect x="131" y="139" width="12" height="8" rx="2" fill="#cc4400"/>
        <circle cx="135" cy="153" r="1.2" fill="white" opacity="0.9"/>
        <circle cx="139" cy="153" r="1.2" fill="white" opacity="0.9"/>
        <circle cx="135" cy="158" r="1.2" fill="white" opacity="0.9"/>
        <circle cx="139" cy="158" r="1.2" fill="white" opacity="0.9"/>
        <rect x="127" y="134" width="20" height="29" rx="5" fill="none" stroke="#FF5500" strokeWidth="0.8" opacity="0.6"/>
        {/* Glow */}
        <ellipse cx="137" cy="148" rx="18" ry="22" fill="#FF5500" opacity="0.04"/>
        {/* Wall sconces */}
        <rect x="20" y="118" width="10" height="5" rx="1" fill="#FF5500" opacity="0.5"/>
        <ellipse cx="25" cy="130" rx="6" ry="14" fill="#FF5500" opacity="0.08"/>
        <rect x="170" y="118" width="10" height="5" rx="1" fill="#FF5500" opacity="0.5"/>
        <ellipse cx="175" cy="130" rx="6" ry="14" fill="#FF5500" opacity="0.08"/>
        {/* Stars */}
        <circle cx="25" cy="20" r="0.8" fill="white" opacity="0.5"/>
        <circle cx="70" cy="35" r="0.8" fill="white" opacity="0.4"/>
        <circle cx="130" cy="18" r="0.8" fill="white" opacity="0.5"/>
        <circle cx="180" cy="40" r="0.8" fill="white" opacity="0.3"/>
        <circle cx="155" cy="28" r="0.6" fill="white" opacity="0.4"/>
        {/* Plants */}
        <rect x="8" y="192" width="18" height="18" rx="2" fill="#152540"/>
        <ellipse cx="17" cy="188" rx="11" ry="12" fill="#1a4a2e"/>
        <ellipse cx="12" cy="184" rx="7" ry="9" fill="#1e5534"/>
        <rect x="174" y="192" width="18" height="18" rx="2" fill="#152540"/>
        <ellipse cx="183" cy="188" rx="11" ry="12" fill="#1a4a2e"/>
        <ellipse cx="188" cy="184" rx="7" ry="9" fill="#1e5534"/>
      </svg>
    ),

    'side-door': (
      <svg viewBox="0 0 200 240" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="240" fill="#162d4a"/>
        <rect y="205" width="200" height="35" fill="#0f1f33"/>
        {/* Siding */}
        {[0,12,24,36,48,60,72,84,96,108,120,132,144,156,168,180,192].map(y => (
          <rect key={y} x="0" y={y} width="200" height="13" fill={y%24===0?"#1a3358":"#172e52"} opacity="0.7"/>
        ))}
        {/* Frame */}
        <rect x="60" y="55" width="80" height="152" rx="2" fill="#0f2035"/>
        {/* Door */}
        <rect x="63" y="58" width="74" height="147" rx="2" fill="#0d1e33"/>
        {/* Upper panel with frosted glass */}
        <rect x="70" y="66" width="60" height="70" rx="3" fill="#1a3560" stroke="#1e3d6a" strokeWidth="1.2"/>
        <rect x="73" y="69" width="54" height="64" rx="2" fill="#0f2545" opacity="0.8"/>
        {/* Glass sheen */}
        <rect x="73" y="69" width="20" height="64" rx="2" fill="white" opacity="0.03"/>
        {/* Lower panel */}
        <rect x="70" y="144" width="60" height="54" rx="3" fill="#0d1e33" stroke="#1a3050" strokeWidth="1.2"/>
        {/* Smart lock */}
        <rect x="126" y="132" width="14" height="22" rx="4" fill="#FF5500"/>
        <rect x="128" y="135" width="10" height="7" rx="2" fill="#cc4400"/>
        <circle cx="131" cy="147" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="135" cy="147" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="131" cy="151" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="135" cy="151" r="1.1" fill="white" opacity="0.9"/>
        <rect x="124" y="130" width="18" height="26" rx="5" fill="none" stroke="#FF5500" strokeWidth="0.8" opacity="0.5"/>
        <ellipse cx="133" cy="143" rx="15" ry="18" fill="#FF5500" opacity="0.05"/>
        {/* Handle */}
        <circle cx="125" cy="142" r="3" fill="#1e3a60"/>
        {/* Steps */}
        <rect x="45" y="202" width="110" height="10" rx="1" fill="#162540"/>
        <rect x="35" y="208" width="130" height="8" rx="1" fill="#1a2d45"/>
        {/* Cloud */}
        <ellipse cx="50" cy="25" rx="18" ry="8" fill="#1e3a5a" opacity="0.5"/>
        <ellipse cx="65" cy="22" rx="14" ry="7" fill="#1e3a5a" opacity="0.4"/>
        <ellipse cx="160" cy="35" rx="22" ry="9" fill="#1e3a5a" opacity="0.4"/>
      </svg>
    ),

    'back-door': (
      <svg viewBox="0 0 200 240" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="240" fill="#1a3045"/>
        {/* Sky */}
        <rect width="200" height="160" fill="#1a3550"/>
        {/* Trees/garden bg */}
        <ellipse cx="30" cy="155" rx="35" ry="30" fill="#1a4a2e"/>
        <ellipse cx="170" cy="160" rx="40" ry="28" fill="#1e5030"/>
        <ellipse cx="100" cy="145" rx="25" ry="20" fill="#163d24"/>
        {/* Ground/deck */}
        <rect y="190" width="200" height="50" fill="#162535"/>
        {/* Deck boards */}
        {[192,200,208,216,224].map(y => (
          <rect key={y} x="0" y={y} width="200" height="2" fill="#0f1f30" opacity="0.5"/>
        ))}
        {/* Frame */}
        <rect x="55" y="45" width="90" height="150" rx="2" fill="#0f2035"/>
        {/* Door */}
        <rect x="58" y="48" width="84" height="145" rx="2" fill="#0d1e30"/>
        {/* Glass panels - 4 panes top half */}
        <rect x="64" y="55" width="35" height="40" rx="2" fill="#1a3d60" stroke="#1e456b" strokeWidth="1.2"/>
        <rect x="104" y="55" width="35" height="40" rx="2" fill="#1a3d60" stroke="#1e456b" strokeWidth="1.2"/>
        <rect x="64" y="100" width="35" height="40" rx="2" fill="#1a3d60" stroke="#1e456b" strokeWidth="1.2"/>
        <rect x="104" y="100" width="35" height="40" rx="2" fill="#1a3d60" stroke="#1e456b" strokeWidth="1.2"/>
        {/* Glass sheen */}
        <rect x="64" y="55" width="10" height="40" rx="2" fill="white" opacity="0.04"/>
        <rect x="104" y="55" width="10" height="40" rx="2" fill="white" opacity="0.04"/>
        {/* Lower solid panel */}
        <rect x="64" y="147" width="75" height="40" rx="2" fill="#0d1e30" stroke="#162840" strokeWidth="1.2"/>
        {/* Smart lock */}
        <rect x="132" y="136" width="13" height="21" rx="3" fill="#FF5500"/>
        <rect x="134" y="139" width="9" height="6" rx="2" fill="#cc4400"/>
        <circle cx="137" cy="150" r="1" fill="white" opacity="0.9"/>
        <circle cx="141" cy="150" r="1" fill="white" opacity="0.9"/>
        <circle cx="137" cy="154" r="1" fill="white" opacity="0.9"/>
        <circle cx="141" cy="154" r="1" fill="white" opacity="0.9"/>
        <rect x="130" y="134" width="17" height="25" rx="4" fill="none" stroke="#FF5500" strokeWidth="0.8" opacity="0.5"/>
        {/* Handle */}
        <circle cx="128" cy="145" r="3" fill="#1e3a60"/>
        {/* Light through glass */}
        <rect x="64" y="55" width="75" height="85" fill="#4ade80" opacity="0.02"/>
      </svg>
    ),

    'garage-entry': (
      <svg viewBox="0 0 200 240" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        {/* Interior garage wall */}
        <rect width="200" height="240" fill="#0f1e30"/>
        {/* Floor */}
        <rect y="195" width="200" height="45" fill="#0c1828"/>
        {/* Floor lines */}
        {[0,50,100,150,200].map(x => (
          <rect key={x} x={x} y="195" width="1" height="45" fill="#162540" opacity="0.5"/>
        ))}
        <rect y="215" width="200" height="1" fill="#162540" opacity="0.4"/>
        {/* Wall texture */}
        <rect x="0" y="0" width="200" height="195" fill="#0f1e30"/>
        <rect x="0" y="0" width="200" height="2" fill="#162840"/>
        {/* Door frame */}
        <rect x="52" y="40" width="96" height="160" rx="2" fill="#162848"/>
        {/* Interior door - hollow core white */}
        <rect x="55" y="43" width="90" height="155" rx="2" fill="#1a2e48"/>
        {/* Door panels - 2 rectangle panels */}
        <rect x="62" y="52" width="76" height="62" rx="3" fill="#162642" stroke="#1e3258" strokeWidth="1.2"/>
        <rect x="62" y="122" width="76" height="68" rx="3" fill="#162642" stroke="#1e3258" strokeWidth="1.2"/>
        {/* Smart lock / keypad on door */}
        <rect x="134" y="112" width="14" height="22" rx="4" fill="#FF5500"/>
        <rect x="136" y="115" width="10" height="7" rx="2" fill="#cc4400"/>
        <circle cx="139" cy="127" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="143" cy="127" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="139" cy="131" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="143" cy="131" r="1.1" fill="white" opacity="0.9"/>
        <rect x="132" y="110" width="18" height="26" rx="5" fill="none" stroke="#FF5500" strokeWidth="0.8" opacity="0.5"/>
        <ellipse cx="141" cy="123" rx="15" ry="18" fill="#FF5500" opacity="0.06"/>
        {/* Lever handle */}
        <circle cx="128" cy="122" r="4" fill="#1a3a60"/>
        <rect x="115" y="120" width="14" height="4" rx="2" fill="#1a3a60"/>
        {/* Ceiling light */}
        <rect x="85" y="0" width="30" height="6" rx="1" fill="#1e3560"/>
        <ellipse cx="100" cy="8" rx="40" ry="20" fill="#FF5500" opacity="0.04"/>
        <rect x="90" y="6" width="20" height="3" rx="1" fill="#FF7730" opacity="0.3"/>
        {/* Wall outlet */}
        <rect x="28" y="140" width="14" height="20" rx="2" fill="#162540" stroke="#1e3258" strokeWidth="1"/>
        <circle cx="35" cy="147" r="2" fill="#0f1e30"/>
        <circle cx="35" cy="155" r="2" fill="#0f1e30"/>
      </svg>
    ),

    'basement-exit': (
      <svg viewBox="0 0 200 240" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        {/* Dark sky */}
        <rect width="200" height="240" fill="#0a1628"/>
        {/* Concrete well walls */}
        <rect x="0" y="60" width="30" height="180" fill="#0f1e30"/>
        <rect x="170" y="60" width="30" height="180" fill="#0f1e30"/>
        {/* Steps going down */}
        <rect x="0" y="185" width="200" height="14" rx="1" fill="#162540"/>
        <rect x="10" y="196" width="180" height="14" rx="1" fill="#1a2d45"/>
        <rect x="20" y="207" width="160" height="14" rx="1" fill="#1e3355"/>
        <rect x="30" y="218" width="140" height="14" rx="1" fill="#162540"/>
        {/* Back wall */}
        <rect x="30" y="60" width="140" height="130" fill="#0d1e33"/>
        {/* Door frame */}
        <rect x="55" y="65" width="90" height="128" rx="2" fill="#162848"/>
        {/* Steel/utility door */}
        <rect x="58" y="68" width="84" height="123" rx="2" fill="#0f1e33"/>
        {/* Horizontal ribs on door */}
        {[80,100,120,140,160].map(y => (
          <rect key={y} x="60" y={y} width="80" height="2" rx="1" fill="#162540" opacity="0.6"/>
        ))}
        {/* Vertical center seam */}
        <rect x="99" y="68" width="2" height="123" fill="#162540" opacity="0.5"/>
        {/* Smart lock */}
        <rect x="131" y="120" width="14" height="22" rx="4" fill="#FF5500"/>
        <rect x="133" y="123" width="10" height="7" rx="2" fill="#cc4400"/>
        <circle cx="136" cy="135" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="140" cy="135" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="136" cy="139" r="1.1" fill="white" opacity="0.9"/>
        <circle cx="140" cy="139" r="1.1" fill="white" opacity="0.9"/>
        <rect x="129" y="118" width="18" height="26" rx="5" fill="none" stroke="#FF5500" strokeWidth="0.8" opacity="0.5"/>
        <ellipse cx="138" cy="131" rx="14" ry="17" fill="#FF5500" opacity="0.06"/>
        {/* Handle bar */}
        <rect x="71" y="118" width="6" height="28" rx="3" fill="#1e3560"/>
        {/* Stars */}
        <circle cx="20" cy="20" r="0.8" fill="white" opacity="0.5"/>
        <circle cx="90" cy="30" r="0.8" fill="white" opacity="0.4"/>
        <circle cx="150" cy="15" r="0.8" fill="white" opacity="0.5"/>
        <circle cx="185" cy="35" r="0.8" fill="white" opacity="0.3"/>
        {/* Moss/concrete stain on steps */}
        <rect x="0" y="185" width="200" height="50" fill="#0a1628" opacity="0.1"/>
      </svg>
    ),

    'sliding-door': (
      <svg viewBox="0 0 200 240" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        {/* Background - interior room view looking out */}
        <rect width="200" height="240" fill="#0d1e33"/>
        {/* Floor */}
        <rect y="205" width="200" height="35" fill="#0c1828"/>
        {/* Floor boards */}
        {[0,40,80,120,160,200].map(x => (
          <rect key={x} x={x} y="205" width="1" height="35" fill="#162540" opacity="0.4"/>
        ))}
        {/* Ceiling */}
        <rect y="0" width="200" height="45" fill="#0a1828"/>
        {/* Outside visible through glass - garden/patio */}
        <rect x="22" y="45" width="156" height="162" fill="#162d40"/>
        {/* Sky through glass */}
        <rect x="22" y="45" width="156" height="80" fill="#1a3555"/>
        {/* Garden through glass */}
        <ellipse cx="60" cy="145" rx="30" ry="22" fill="#1a4a2e" opacity="0.7"/>
        <ellipse cx="150" cy="148" rx="28" ry="20" fill="#1e5030" opacity="0.7"/>
        {/* Outer frame */}
        <rect x="20" y="43" width="160" height="167" rx="2" fill="#162848"/>
        {/* Track top and bottom */}
        <rect x="22" y="43" width="156" height="6" rx="1" fill="#1e3560"/>
        <rect x="22" y="203" width="156" height="6" rx="1" fill="#1e3560"/>
        {/* Center divider */}
        <rect x="98" y="43" width="4" height="167" fill="#1e3560"/>
        {/* Left panel - fixed */}
        <rect x="24" y="49" width="72" height="154" fill="#1a3d60" opacity="0.6"/>
        {/* Right panel - sliding */}
        <rect x="103" y="49" width="72" height="154" fill="#1a3d60" opacity="0.7"/>
        {/* Glass sheen left */}
        <rect x="24" y="49" width="18" height="154" fill="white" opacity="0.03"/>
        {/* Glass sheen right */}
        <rect x="103" y="49" width="18" height="154" fill="white" opacity="0.04"/>
        {/* Vertical frame lines */}
        <rect x="22" y="43" width="5" height="167" fill="#1e3560"/>
        <rect x="173" y="43" width="5" height="167" fill="#1e3560"/>
        {/* Smart lock on right panel frame */}
        <rect x="174" y="115" width="13" height="22" rx="4" fill="#FF5500"/>
        <rect x="176" y="118" width="9" height="7" rx="2" fill="#cc4400"/>
        <circle cx="179" cy="130" r="1" fill="white" opacity="0.9"/>
        <circle cx="183" cy="130" r="1" fill="white" opacity="0.9"/>
        <circle cx="179" cy="134" r="1" fill="white" opacity="0.9"/>
        <circle cx="183" cy="134" r="1" fill="white" opacity="0.9"/>
        <rect x="172" y="113" width="17" height="26" rx="4" fill="none" stroke="#FF5500" strokeWidth="0.8" opacity="0.5"/>
        <ellipse cx="181" cy="126" rx="14" ry="17" fill="#FF5500" opacity="0.06"/>
        {/* Handle on sliding panel */}
        <rect x="96" y="115" width="5" height="30" rx="2" fill="#1e3a60"/>
        {/* Stars through glass */}
        <circle cx="50" cy="65" r="0.7" fill="white" opacity="0.3"/>
        <circle cx="130" cy="60" r="0.7" fill="white" opacity="0.3"/>
        <circle cx="80" cy="75" r="0.5" fill="white" opacity="0.2"/>
      </svg>
    ),
  };

  return doors[doorId] ?? doors['front-entry'];
}
