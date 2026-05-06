import React from 'react';

interface Props {
  doorId: string;
  size?: 'card' | 'large';
}

const GOLD = '#C9A84C';
const GOLD_DARK = '#A8873A';
const DOOR_BG = '#F5F5F5';
const FRAME = '#E0E0E0';
const DARK = '#222222';

function LockKeypad() {
  return (
    <g>
      <rect x="52" y="52" width="16" height="24" rx="3" fill={GOLD} opacity="0.95"/>
      <rect x="54" y="54" width="12" height="8" rx="1.5" fill={GOLD_DARK}/>
      <circle cx="55.5" cy="65" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="58.5" cy="65" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="61.5" cy="65" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="55.5" cy="69" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="58.5" cy="69" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="61.5" cy="69" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="58.5" cy="73" r="1.2" fill={GOLD} opacity="0.5"/>
    </g>
  );
}

function DoorHandle({ x = 68, y = 58 }: { x?: number; y?: number }) {
  return (
    <g>
      <rect x={x} y={y} width="3" height="12" rx="1.5" fill={GOLD}/>
      <circle cx={x + 1.5} cy={y + 14} r="2.5" fill={GOLD_DARK}/>
    </g>
  );
}

// Front Entry — classic paneled door
function FrontEntry() {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Frame */}
      <rect x="8" y="5" width="84" height="112" rx="2" fill={FRAME}/>
      <rect x="8" y="112" width="84" height="5" fill="#D0D0D0"/>
      {/* Door body */}
      <rect x="12" y="8" width="76" height="109" rx="1" fill={DOOR_BG}/>
      {/* Top panels */}
      <rect x="18" y="14" width="28" height="22" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      <rect x="54" y="14" width="28" height="22" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      {/* Middle panels */}
      <rect x="18" y="42" width="28" height="32" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      <rect x="54" y="42" width="28" height="32" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      {/* Bottom panels */}
      <rect x="18" y="80" width="28" height="28" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      <rect x="54" y="80" width="28" height="28" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      {/* Gold accent strip */}
      <rect x="12" y="8" width="76" height="2" fill={GOLD} opacity="0.6"/>
      <LockKeypad/>
      <DoorHandle/>
    </svg>
  );
}

// Side Door — simpler, narrower
function SideDoor() {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect x="15" y="5" width="70" height="112" rx="2" fill={FRAME}/>
      <rect x="15" y="112" width="70" height="5" fill="#D0D0D0"/>
      <rect x="19" y="8" width="62" height="109" rx="1" fill={DOOR_BG}/>
      {/* Single upper window */}
      <rect x="26" y="14" width="48" height="32" rx="2" fill="#E8F4FD" stroke={FRAME} strokeWidth="1"/>
      <line x1="50" y1="14" x2="50" y2="46" stroke={FRAME} strokeWidth="1"/>
      <line x1="26" y1="30" x2="74" y2="30" stroke={FRAME} strokeWidth="1"/>
      {/* Lower panel */}
      <rect x="26" y="54" width="48" height="50" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      <rect x="19" y="8" width="62" height="2" fill={GOLD} opacity="0.6"/>
      <LockKeypad/>
      <DoorHandle x={70} y={58}/>
    </svg>
  );
}

// Back Door — utility style
function BackDoor() {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect x="10" y="5" width="80" height="112" rx="2" fill={FRAME}/>
      <rect x="10" y="112" width="80" height="5" fill="#D0D0D0"/>
      <rect x="14" y="8" width="72" height="109" rx="1" fill={DOOR_BG}/>
      {/* Storm door lines */}
      <rect x="20" y="14" width="60" height="40" rx="2" fill="#E8F4FD" stroke={FRAME} strokeWidth="1"/>
      <line x1="50" y1="14" x2="50" y2="54" stroke={FRAME} strokeWidth="0.75"/>
      <line x1="20" y1="34" x2="80" y2="34" stroke={FRAME} strokeWidth="0.75"/>
      <rect x="20" y="60" width="60" height="48" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      <rect x="14" y="8" width="72" height="2" fill={GOLD} opacity="0.6"/>
      <LockKeypad/>
      <DoorHandle x={70} y={58}/>
    </svg>
  );
}

// Garage Entry — wider, heavier
function GarageEntry() {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect x="6" y="5" width="88" height="112" rx="2" fill={FRAME}/>
      <rect x="6" y="112" width="88" height="5" fill="#D0D0D0"/>
      <rect x="10" y="8" width="80" height="109" rx="1" fill="#EBEBEB"/>
      {/* Heavy utility door - horizontal rails */}
      <rect x="10" y="8" width="80" height="20" fill="#E2E2E2" stroke={FRAME} strokeWidth="0.5"/>
      <rect x="10" y="30" width="80" height="20" fill={DOOR_BG} stroke={FRAME} strokeWidth="0.5"/>
      <rect x="10" y="52" width="80" height="20" fill="#E2E2E2" stroke={FRAME} strokeWidth="0.5"/>
      <rect x="10" y="74" width="80" height="43" fill={DOOR_BG} stroke={FRAME} strokeWidth="0.5"/>
      {/* Rail handles */}
      <rect x="35" y="16" width="30" height="4" rx="2" fill={GOLD} opacity="0.7"/>
      <rect x="35" y="38" width="30" height="4" rx="2" fill={GOLD} opacity="0.4"/>
      <rect x="35" y="60" width="30" height="4" rx="2" fill={GOLD} opacity="0.7"/>
      <rect x="10" y="8" width="80" height="2" fill={GOLD} opacity="0.6"/>
      <LockKeypad/>
      <DoorHandle x={70} y={84}/>
    </svg>
  );
}

// Basement Exit — lower, ground level feel
function BasementExit() {
  return (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Ground */}
      <rect x="0" y="108" width="100" height="12" fill="#D8D8D8"/>
      <rect x="0" y="105" width="100" height="5" fill="#E5E5E5"/>
      {/* Frame */}
      <rect x="12" y="18" width="76" height="90" rx="2" fill={FRAME}/>
      <rect x="16" y="21" width="68" height="87" rx="1" fill={DOOR_BG}/>
      {/* Step indicator */}
      <rect x="5" y="100" width="90" height="5" rx="1" fill="#CCC"/>
      {/* Simple panels */}
      <rect x="22" y="27" width="56" height="28" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      <line x1="50" y1="27" x2="50" y2="55" stroke={FRAME} strokeWidth="0.75"/>
      <rect x="22" y="62" width="56" height="36" rx="2" fill="white" stroke={FRAME} strokeWidth="1"/>
      {/* Gold accent */}
      <rect x="16" y="21" width="68" height="2" fill={GOLD} opacity="0.6"/>
      {/* Lock - centered since door opens outward */}
      <g transform="translate(-4, 0)">
        <LockKeypad/>
      </g>
      <DoorHandle x={70} y={68}/>
    </svg>
  );
}

const DOORS: Record<string, React.FC> = {
  'front-entry': FrontEntry,
  'side-door': SideDoor,
  'back-door': BackDoor,
  'garage-entry': GarageEntry,
  'basement-exit': BasementExit,
};

export default function DoorIllustration({ doorId, size = 'card' }: Props) {
  const Door = DOORS[doorId] || FrontEntry;
  const height = size === 'large' ? '200px' : '140px';

  return (
    <div style={{
      width: '100%',
      height,
      background: '#F8F8F8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: size === 'large' ? '1rem' : '0.75rem',
      borderBottom: '1px solid #f0f0f0',
    }}>
      <div style={{ width: '100%', height: '100%', maxWidth: size === 'large' ? '160px' : '90px', margin: '0 auto' }}>
        <Door />
      </div>
    </div>
  );
}
