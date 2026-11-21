/* ============================================================
   영어 한마디 — 19개 표현 + 카페 주문 대화 6마디 + 상황별 회화 7가지
   art: 200x200 상자 안에 그리는 연상 SVG 조각(배경은 bg 색)
   ============================================================ */

var ENF = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

var EN_ART = {
  /* ---------- 카페 ---------- */
  coffee:
    '<ellipse cx="100" cy="158" rx="58" ry="12" fill="#EBD4B9"/>' +
    '<path d="M58 92h84v26c0 22-19 40-42 40s-42-18-42-40z" fill="#EFA96B"/>' +
    '<path d="M142 100h8a17 17 0 0 1 0 34h-8" fill="none" stroke="#EFA96B" stroke-width="10" stroke-linecap="round"/>' +
    '<ellipse cx="100" cy="92" rx="42" ry="11" fill="#B17A4B"/>' +
    '<ellipse cx="100" cy="90" rx="34" ry="8" fill="#7B4A2A"/>' +
    '<ellipse cx="90" cy="88" rx="10" ry="2.6" fill="#C79A70" opacity=".55"/>' +
    '<path d="M78 70c-7-10 6-14 0-24M100 66c-7-11 6-15 0-26M122 70c-7-10 6-14 0-24" stroke="#E7C7A6" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M58 162h84" stroke="#E7CDB1" stroke-width="5" stroke-linecap="round"/>',
  iced:
    '<rect x="66" y="52" width="68" height="104" rx="14" fill="#EAF2F8" stroke="#B7D2E8" stroke-width="4"/>' +
    '<path d="M71 96h58v44c0 9-6 15-15 15H86c-9 0-15-6-15-15z" fill="#9CC4E0"/>' +
    '<path d="M112 46l-14 52" stroke="#E58A76" stroke-width="8" stroke-linecap="round"/>' +
    '<rect x="76" y="84" width="20" height="20" rx="4" fill="#FFFFFF" opacity=".85" transform="rotate(-14 86 94)"/>' +
    '<rect x="98" y="102" width="20" height="20" rx="4" fill="#FFFFFF" opacity=".8" transform="rotate(12 108 112)"/>' +
    '<ellipse cx="100" cy="54" rx="30" ry="6" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".9"/>' +
    '<path d="M76 68c6-4 12-4 18 0" stroke="#FFFFFF" stroke-width="4" opacity=".8" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="100" cy="160" rx="40" ry="8" fill="#DCE7EF"/>',
  here:
    '<rect x="40" y="42" width="120" height="66" rx="10" fill="#DCEAF4" opacity=".85"/>' +
    '<path d="M40 75h120M100 42v66" stroke="#FFFFFF" stroke-width="5"/>' +
    '<path d="M34 108h132" stroke="#E7CDB1" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M60 116h80v22c0 18-15 32-40 32s-40-14-40-32z" fill="#7FB392"/>' +
    '<path d="M140 122h8a15 15 0 0 1 0 30h-8" fill="none" stroke="#7FB392" stroke-width="9" stroke-linecap="round"/>' +
    '<ellipse cx="100" cy="116" rx="40" ry="10" fill="#5C9A74"/>' +
    '<path d="M84 96c-6-8 6-12 0-20M112 98c-6-8 6-12 0-20" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M44 172h112" stroke="#D9C9AE" stroke-width="6" stroke-linecap="round"/>',
  togo:
    '<path d="M68 72h64l-8 84c-1 10-9 16-24 16s-23-6-24-16z" fill="#F6D3BC"/>' +
    '<rect x="60" y="54" width="80" height="20" rx="9" fill="#E9A88D"/>' +
    '<path d="M66 76h68l-2 18H68z" fill="#FFFFFF" opacity=".55"/>' +
    '<path d="M74 122h52" stroke="#FFFFFF" stroke-width="5" opacity=".65" stroke-linecap="round"/>' +
    '<path d="M100 54V42" stroke="#E58A76" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M136 128h24l-5 38h-14z" fill="#9DC3AA"/>' +
    '<path d="M142 128v-8h12v8" stroke="#9DC3AA" stroke-width="4" fill="none"/>' +
    '<ellipse cx="100" cy="174" rx="42" ry="7" fill="#EBD4B9"/>',
  receipt:
    '<path d="M70 34h60v114l-10-7-10 7-10-7-10 7-10-7-10 7z" fill="#FFFFFF" stroke="#E4DACA" stroke-width="3"/>' +
    '<path d="M80 54h40M80 68h40M80 82h30M80 96h22" stroke="#C9DED2" stroke-width="5" stroke-linecap="round"/>' +
    '<text x="100" y="126" text-anchor="middle" font-size="19" font-weight="700" fill="#8A6242" font-family="' + ENF + '">$5</text>' +
    '<circle cx="143" cy="140" r="16" fill="#F2CE6B"/><circle cx="143" cy="140" r="10" fill="none" stroke="#D9A94E" stroke-width="3"/>' +
    '<path d="M56 168h88" stroke="#E7CDB1" stroke-width="5" stroke-linecap="round"/>',

  /* ---------- 식당 ---------- */
  menu:
    '<rect x="38" y="42" width="102" height="104" rx="10" fill="#FFFFFF" stroke="#1B4D3E" stroke-width="5"/>' +
    '<rect x="38" y="42" width="102" height="26" rx="10" fill="#1B4D3E"/>' +
    '<path d="M54 86h70M54 102h70M54 118h44" stroke="#C9DED2" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M88 146v14M77 166h22" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M143 92h27v18a13.5 13.5 0 0 1-27 0z" fill="#EFA96B"/>' +
    '<path d="M170 96h5a8 8 0 0 1 0 16h-5" fill="none" stroke="#EFA96B" stroke-width="6" stroke-linecap="round"/>' +
    '<ellipse cx="156" cy="92" rx="13.5" ry="4" fill="#7B4A2A"/>' +
    '<path d="M149 78c-4-6 4-9 0-15M164 78c-4-6 4-9 0-15" stroke="#E7C7A6" stroke-width="4" fill="none" stroke-linecap="round"/>',
  check:
    '<rect x="46" y="118" width="108" height="18" rx="9" fill="#1B4D3E"/>' +
    '<rect x="56" y="58" width="76" height="64" rx="6" fill="#FFFFFF" stroke="#E4DACA" stroke-width="3"/>' +
    '<path d="M68 74h52M68 88h52M68 102h30" stroke="#C9DED2" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="100" y="94" width="58" height="36" rx="6" fill="#7FA8C9" transform="rotate(-14 129 112)"/>' +
    '<rect x="106" y="102" width="14" height="10" rx="2" fill="#F2CE6B" transform="rotate(-14 129 112)"/>' +
    '<circle cx="150" cy="146" r="11" fill="#F2CE6B"/>',
  water:
    '<path d="M74 58h52l-6 92c-1 10-9 16-20 16s-19-6-20-16z" fill="#EAF2F8" stroke="#B7D2E8" stroke-width="4"/>' +
    '<path d="M78 96h44l-4 54c0 8-7 12-18 12s-18-4-18-12z" fill="#9CC4E0"/>' +
    '<path d="M74 58h52" stroke="#B7D2E8" stroke-width="5"/>' +
    '<circle cx="112" cy="72" r="10" fill="#F2CE6B"/><path d="M112 62v20M102 72h20" stroke="#E8A33D" stroke-width="2"/>' +
    '<path d="M142 40c-8 10-8 18 0 26" stroke="#9CC4E0" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="100" cy="170" rx="34" ry="7" fill="#DCE7EF"/>',

  /* ---------- 호텔 ---------- */
  keycard:
    '<rect x="42" y="42" width="82" height="118" rx="8" fill="#F6D3BC"/>' +
    '<rect x="54" y="54" width="58" height="46" rx="5" fill="#FFFFFF" opacity=".55"/>' +
    '<circle cx="110" cy="106" r="5" fill="#8A6242"/>' +
    '<rect x="130" y="94" width="56" height="36" rx="6" fill="#1B4D3E" transform="rotate(-8 158 112)"/>' +
    '<rect x="136" y="102" width="11" height="9" rx="2" fill="#F2CE6B" transform="rotate(-8 158 112)"/>' +
    '<path d="M136 148h46" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
  checkout:
    '<circle cx="84" cy="90" r="44" fill="#FFFFFF" stroke="#8E86B8" stroke-width="6"/>' +
    '<path d="M84 64v28l20 12" stroke="#5C5680" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<circle cx="84" cy="90" r="4" fill="#5C5680"/>' +
    '<rect x="128" y="70" width="52" height="60" rx="9" fill="#9A93C4"/>' +
    '<path d="M144 70V60a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v10" fill="none" stroke="#9A93C4" stroke-width="5"/>' +
    '<path d="M128 94h52" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>' +
    '<circle cx="140" cy="132" r="5" fill="#5C5680"/><circle cx="168" cy="132" r="5" fill="#5C5680"/>' +
    '<path d="M40 156h120" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
  wifi:
    '<rect x="70" y="66" width="60" height="102" rx="12" fill="#FFFFFF" stroke="#8E86B8" stroke-width="5"/>' +
    '<rect x="78" y="78" width="44" height="70" rx="6" fill="#E1ECF5"/>' +
    '<circle cx="100" cy="158" r="4" fill="#8E86B8"/>' +
    '<path d="M60 62c22-22 56-22 78 0" stroke="#1B4D3E" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<path d="M74 44c14-14 36-14 50 0" stroke="#2A6A55" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<path d="M87 26c7-7 17-7 24 0" stroke="#7FB392" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    '<circle cx="100" cy="74" r="6" fill="#1B4D3E"/>',

  /* ---------- 길찾기 ---------- */
  station:
    '<path d="M34 166c52-4 52-58 96-62s36-38 36-38" stroke="#E0D3BC" stroke-width="18" fill="none" stroke-linecap="round"/>' +
    '<path d="M34 166c52-4 52-58 96-62s36-38 36-38" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="9 11" fill="none" stroke-linecap="round"/>' +
    '<path d="M150 34c-15 0-26 12-26 26 0 20 26 46 26 46s26-26 26-46c0-14-11-26-26-26z" fill="#E58A76"/>' +
    '<circle cx="150" cy="60" r="9" fill="#FFFFFF"/>' +
    '<rect x="38" y="58" width="48" height="36" rx="6" fill="#EFF1EA"/>' +
    '<path d="M32 58h60" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/>' +
    '<rect x="46" y="68" width="13" height="26" fill="#C9DED2"/>' +
    '<rect x="65" y="68" width="13" height="14" fill="#F6D3BC"/>' +
    '<ellipse cx="100" cy="172" rx="66" ry="8" fill="#F0E4D2"/>',
  restroom:
    '<rect x="52" y="36" width="96" height="86" rx="12" fill="#FFFFFF" stroke="#1B4D3E" stroke-width="5"/>' +
    '<path d="M100 40v78" stroke="#E4DACA" stroke-width="3"/>' +
    '<circle cx="82" cy="58" r="9" fill="#7FA8C9"/>' +
    '<path d="M82 70v22M82 78l-9 10M82 78l9 10M82 92l-7 18M82 92l7 18" stroke="#7FA8C9" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<circle cx="118" cy="58" r="9" fill="#E9A88D"/>' +
    '<path d="M118 70v16l-12 26h24l-12-26M106 112v10M130 112v10" stroke="#E9A88D" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<path d="M60 142h80" stroke="#D8E4DA" stroke-width="5" stroke-linecap="round"/>',

  /* ---------- 쇼핑 ---------- */
  price:
    '<path d="M52 84l40-40h58v58l-40 40z" fill="#F6D3BC" stroke="#E2B998" stroke-width="4"/>' +
    '<circle cx="140" cy="52" r="7" fill="#FFFFFF"/>' +
    '<text x="98" y="106" font-size="46" font-weight="800" fill="#C97F4E" text-anchor="middle" font-family="' + ENF + '">$</text>' +
    '<circle cx="146" cy="142" r="16" fill="#F2CE6B"/>' +
    '<circle cx="164" cy="150" r="12" fill="#E8A33D"/>',
  card:
    '<rect x="38" y="70" width="116" height="72" rx="10" fill="#7FB392"/>' +
    '<rect x="38" y="88" width="116" height="12" fill="#1B4D3E" opacity=".55"/>' +
    '<rect x="52" y="112" width="26" height="18" rx="3" fill="#F2CE6B"/>' +
    '<path d="M86 122h48" stroke="#FFFFFF" stroke-width="5" opacity=".75" stroke-linecap="round"/>' +
    '<path d="M164 62c10 8 10 26 0 34M174 52c16 14 16 40 0 54" stroke="#9DC3AA" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="60" cy="160" r="12" fill="#F2CE6B"/>',

  /* ---------- 공항 ---------- */
  gate:
    '<path d="M44 104l40-13V62c0-7 4-11 9-11s9 4 9 11v29l40 13v12l-40-7v22l13 9v8l-22-5-22 5v-8l13-9v-22l-40 7z" fill="#7FA8C9" transform="rotate(18 106 92)"/>' +
    '<path d="M150 130c14-2 22-10 26-22" stroke="#C9DED2" stroke-width="5" fill="none" stroke-dasharray="6 7" stroke-linecap="round"/>' +
    '<rect x="126" y="34" width="48" height="34" rx="6" fill="#1B4D3E"/>' +
    '<text x="150" y="57" text-anchor="middle" font-size="12" font-weight="700" fill="#F9F7F3" font-family="' + ENF + '">GATE</text>',
  boarding:
    '<rect x="36" y="80" width="120" height="58" rx="8" fill="#FFFFFF" stroke="#8FA8C9" stroke-width="4"/>' +
    '<path d="M116 80v58" stroke="#8FA8C9" stroke-width="4" stroke-dasharray="6 6"/>' +
    '<path d="M48 96h54M48 110h40M48 124h30" stroke="#C9DED2" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M126 96v26M132 96v26M138 96v26M144 96v26" stroke="#8FA8C9" stroke-width="3"/>' +
    '<rect x="46" y="38" width="44" height="30" rx="4" fill="#E9A88D"/><circle cx="68" cy="53" r="7" fill="#FFFFFF" opacity=".7"/>' +
    '<path d="M58 148h84" stroke="#D6E2EC" stroke-width="5" stroke-linecap="round"/>',

  /* ---------- 교통 ---------- */
  time:
    '<circle cx="90" cy="92" r="48" fill="#FFFFFF" stroke="#7FA8C9" stroke-width="6"/>' +
    '<path d="M90 62v30l22 13" stroke="#1B4D3E" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<circle cx="90" cy="92" r="4" fill="#1B4D3E"/>' +
    '<path d="M152 60a42 42 0 0 1 0 72" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="7 8"/>' +
    '<path d="M154 42l10 20-20-3z" fill="#C9DED2"/>' +
    '<path d="M40 158h108" stroke="#D6E2EC" stroke-width="5" stroke-linecap="round"/>',
  taxi:
    '<path d="M40 128v-26c0-6 4-10 10-10h14l12-18h48l12 18h14c6 0 10 4 10 10v26z" fill="#F2CE6B"/>' +
    '<rect x="64" y="94" width="26" height="20" rx="4" fill="#EAF2F8"/>' +
    '<rect x="104" y="94" width="26" height="20" rx="4" fill="#EAF2F8"/>' +
    '<rect x="82" y="62" width="36" height="14" rx="4" fill="#1B4D3E"/>' +
    '<circle cx="66" cy="130" r="12" fill="#3E4C43"/><circle cx="134" cy="130" r="12" fill="#3E4C43"/>' +
    '<circle cx="66" cy="130" r="5" fill="#E9E3D6"/><circle cx="134" cy="130" r="5" fill="#E9E3D6"/>' +
    '<path d="M40 142h120" stroke="#E7CDB1" stroke-width="5" stroke-linecap="round"/>',

  /* ---------- 카페 대화 ---------- */
  barista:
    '<circle cx="100" cy="66" r="18" fill="#F2C6A0"/>' +
    '<path d="M100 86c-20 0-32 14-32 34v14h64v-14c0-20-12-34-32-34z" fill="#7FB392"/>' +
    '<path d="M132 98l16-16" stroke="#F2C6A0" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M148 82l4-10M154 90l10-4" stroke="#E58A76" stroke-width="4" stroke-linecap="round"/>' +
    '<rect x="34" y="134" width="132" height="16" rx="6" fill="#E0B08A"/>' +
    '<rect x="136" y="112" width="20" height="22" rx="4" fill="#EFA96B"/>' +
    '<path d="M56 150v14M144 150v14" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
  choice:
    '<path d="M100 150V96l-34-30M100 96l34-30" stroke="#C97F4E" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M58 58l-4 16 16-4z" fill="#C97F4E"/>' +
    '<path d="M142 58l4 16-16-4z" fill="#C97F4E"/>' +
    '<circle cx="54" cy="44" r="16" fill="#EFA96B"/><path d="M38 44h32" stroke="#FFFFFF" stroke-width="3" opacity=".75"/>' +
    '<path d="M132 32h24l-3 26h-18z" fill="#9DC3AA"/>' +
    '<path d="M138 32v-5h12v5" stroke="#9DC3AA" stroke-width="3" fill="none"/>' +
    '<circle cx="100" cy="152" r="7" fill="#1B4D3E"/>',
  dollars:
    '<rect x="34" y="74" width="132" height="66" rx="8" fill="#E4EFE6" stroke="#9DC3AA" stroke-width="4"/>' +
    '<circle cx="100" cy="107" r="21" fill="#F2CE6B"/>' +
    '<text x="100" y="117" text-anchor="middle" font-size="26" font-weight="800" fill="#8A6242" font-family="' + ENF + '">$</text>' +
    '<circle cx="52" cy="107" r="4" fill="#9DC3AA"/><circle cx="148" cy="107" r="4" fill="#9DC3AA"/>' +
    '<circle cx="150" cy="152" r="14" fill="#F2CE6B"/><circle cx="132" cy="156" r="10" fill="#E8A33D"/>'
};

var ENGLISH = [
  { id: 'coffee', cat: '카페', tag: 'COFFEE', en: 'A coffee, please.', ko: '커피 한 잔 주세요.', pron: '어 커피 플리즈', art: 'coffee', bg: '#FBEADB' },
  { id: 'iced', cat: '카페', tag: 'ORDER', en: 'I’ll have an iced americano.', ko: '아이스 아메리카노로 할게요.', pron: '아일 해브 언 아이스드 아메리카노', art: 'iced', bg: '#E2EDF6' },
  { id: 'here', cat: '카페', tag: 'HERE', en: 'For here, please.', ko: '여기서 마실게요.', pron: '포 히어, 플리즈', art: 'here', bg: '#E2EFE6' },
  { id: 'togo', cat: '카페', tag: 'TO GO', en: 'To go, please.', ko: '포장해 주세요.', pron: '투 고, 플리즈', art: 'togo', bg: '#FBE7D9' },
  { id: 'receipt', cat: '카페', tag: 'RECEIPT', en: 'Could I get a receipt?', ko: '영수증 받을 수 있을까요?', pron: '쿠드 아이 겟 어 리시트', art: 'receipt', bg: '#FBF1CE' },

  { id: 'menu', cat: '식당', tag: 'MENU', en: 'Can I see the menu?', ko: '메뉴 좀 볼 수 있을까요?', pron: '캔 아이 씨 더 메뉴', art: 'menu', bg: '#E2EDF6' },
  { id: 'check', cat: '식당', tag: 'PAY', en: 'The check, please.', ko: '계산서 주세요.', pron: '더 체크, 플리즈', art: 'check', bg: '#F9E3E7' },
  { id: 'water', cat: '식당', tag: 'WATER', en: 'Some water, please.', ko: '물 좀 주세요.', pron: '썸 워터, 플리즈', art: 'water', bg: '#E2EDF6' },

  { id: 'reservation', cat: '호텔', tag: 'CHECK-IN', en: 'I have a reservation.', ko: '예약했어요.', pron: '아이 해브 어 레저베이션', art: 'keycard', bg: '#FBF1CE' },
  { id: 'checkout', cat: '호텔', tag: 'CHECK-OUT', en: 'What time is check-out?', ko: '체크아웃이 몇 시예요?', pron: '왓 타임 이즈 체크아웃', art: 'checkout', bg: '#E9E4F4' },
  { id: 'wifi', cat: '호텔', tag: 'WI-FI', en: 'What’s the Wi-Fi password?', ko: '와이파이 비밀번호가 뭐예요?', pron: '왓츠 더 와이파이 패스워드', art: 'wifi', bg: '#E3EBF6' },

  { id: 'station', cat: '길찾기', tag: 'DIRECTIONS', en: 'How do I get to the station?', ko: '역에 어떻게 가요?', pron: '하우 두 아이 겟 투 더 스테이션', art: 'station', bg: '#E2EDF6' },
  { id: 'restroom', cat: '길찾기', tag: 'RESTROOM', en: 'Where is the restroom?', ko: '화장실이 어디예요?', pron: '웨어 이즈 더 레스트룸', art: 'restroom', bg: '#E2EFE6' },

  { id: 'price', cat: '쇼핑', tag: 'PRICE', en: 'How much is this?', ko: '이거 얼마예요?', pron: '하우 머치 이즈 디스', art: 'price', bg: '#FBF1CE' },
  { id: 'card', cat: '쇼핑', tag: 'PAY BY CARD', en: 'Can I pay by card?', ko: '카드로 결제할 수 있나요?', pron: '캔 아이 페이 바이 카드', art: 'card', bg: '#E2EFE6' },

  { id: 'gate', cat: '공항', tag: 'GATE', en: 'Where is the gate?', ko: '게이트가 어디예요?', pron: '웨어 이즈 더 게이트', art: 'gate', bg: '#F9E3E7' },
  { id: 'boarding', cat: '공항', tag: 'CHECK-IN', en: 'Where do I check in?', ko: '체크인은 어디서 해요?', pron: '웨어 두 아이 체크 인', art: 'boarding', bg: '#E3EBF6' },

  { id: 'time', cat: '교통', tag: 'TIME', en: 'How long does it take?', ko: '얼마나 걸려요?', pron: '하우 롱 더즈 잇 테이크', art: 'time', bg: '#E2EDF6' },
  { id: 'address', cat: '교통', tag: 'TAXI', en: 'Please take me to this address.', ko: '이 주소로 가 주세요.', pron: '플리즈 테이크 미 투 디스 어드레스', art: 'taxi', bg: '#FBF1CE' }
];

var DIALOGUE = [
  { who: 'mia', en: 'Hi, welcome! What can I get for you?', ko: '안녕하세요! 뭐 드릴까요?', pron: '하이, 웰컴! 왓 캔 아이 겟 포 유', art: 'barista', bg: '#E4EFE6' },
  { who: 'me', en: 'An iced americano, please.', ko: '아이스 아메리카노 한 잔 주세요.', pron: '언 아이스드 아메리카노, 플리즈', art: 'iced', bg: '#E2EDF6' },
  { who: 'mia', en: 'For here or to go?', ko: '드시고 가세요, 포장이세요?', pron: '포 히어 오어 투 고', art: 'choice', bg: '#FBF1CE' },
  { who: 'me', en: 'For here, please.', ko: '여기서 마실게요.', pron: '포 히어, 플리즈', art: 'here', bg: '#E2EFE6' },
  { who: 'mia', en: 'Sure. That’s five dollars.', ko: '네. 5달러예요.', pron: '슈어. 댓츠 파이브 달러스', art: 'dollars', bg: '#FBF0CC' },
  { who: 'me', en: 'Here you go. Can I get a receipt?', ko: '여기요. 영수증도 받을 수 있을까요?', pron: '히어 유 고. 캔 아이 겟 어 리시트', art: 'receipt', bg: '#FBEADB' }
];

/* 상황별 여행 영어 회화 — 상대(A)와 나(B)가 주고받는 두 쌍 */
var EN_SITUATIONS = [
  {
    key: 'cafe', label: '카페', sub: '주문하고 받기', art: 'coffee', bg: '#FBEADB',
    tip: '“What can I get for you?”는 “뭐 드릴까요?”예요. 원하는 것 + please만 붙이면 주문이 끝나요.',
    lines: [
      { who: 'A', en: 'Hi! What can I get for you?', ko: '안녕하세요! 뭐 드릴까요?', pron: '왓 캔 아이 겟 포 유' },
      { who: 'B', en: 'An iced latte, please.', ko: '아이스 라떼 한 잔 주세요.', pron: '언 아이스드 라떼, 플리즈' },
      { who: 'A', en: 'For here or to go?', ko: '드시고 가세요, 포장이세요?', pron: '포 히어 오어 투 고' },
      { who: 'B', en: 'To go, please.', ko: '포장해 주세요.', pron: '투 고, 플리즈' }
    ]
  },
  {
    key: 'food', label: '식당', sub: '주문하고 계산하기', art: 'menu', bg: '#E2EDF6',
    tip: '“I’ll have ~”는 메뉴를 고를 때 가장 자연스러운 표현이에요. 계산은 “The check, please.”',
    lines: [
      { who: 'A', en: 'Are you ready to order?', ko: '주문하시겠어요?', pron: '아 유 레디 투 오더' },
      { who: 'B', en: 'Yes, I’ll have the pasta.', ko: '네, 파스타로 할게요.', pron: '예스, 아일 해브 더 파스타' },
      { who: 'A', en: 'Anything to drink?', ko: '음료는 필요하세요?', pron: '에니씽 투 드링크' },
      { who: 'B', en: 'Just water, please.', ko: '물만 주세요.', pron: '저스트 워터, 플리즈' }
    ]
  },
  {
    key: 'hotel', label: '호텔', sub: '체크인과 안내', art: 'keycard', bg: '#FBF1CE',
    tip: '예약자 이름은 “under + 이름”으로 말해요. “Under Kim.”이면 “김으로 예약했어요.”',
    lines: [
      { who: 'A', en: 'Do you have a reservation?', ko: '예약하셨나요?', pron: '두 유 해브 어 레저베이션' },
      { who: 'B', en: 'Yes, under Kim.', ko: '네, 김으로 했어요.', pron: '예스, 언더 김' },
      { who: 'A', en: 'Your room is on the fifth floor.', ko: '방은 5층이에요.', pron: '유어 룸 이즈 온 더 피프스 플로어' },
      { who: 'B', en: 'Thank you. What time is breakfast?', ko: '감사합니다. 조식은 몇 시예요?', pron: '땡큐. 왓 타임 이즈 브렉퍼스트' }
    ]
  },
  {
    key: 'directions', label: '길찾기', sub: '물어보고 확인하기', art: 'station', bg: '#E2EDF6',
    tip: '“Go straight and turn left.”만 알아도 길 안내를 절반은 알아들어요.',
    lines: [
      { who: 'A', en: 'Where are you trying to go?', ko: '어디 가시려고요?', pron: '웨어 아 유 트라잉 투 고' },
      { who: 'B', en: 'How do I get to the station?', ko: '역에 어떻게 가요?', pron: '하우 두 아이 겟 투 더 스테이션' },
      { who: 'A', en: 'Go straight and turn left.', ko: '직진해서 왼쪽으로 도세요.', pron: '고 스트레이트 앤 턴 레프트' },
      { who: 'B', en: 'Is it far from here?', ko: '여기서 먼가요?', pron: '이즈 잇 파 프롬 히어' }
    ]
  },
  {
    key: 'shopping', label: '쇼핑', sub: '가격 묻고 결제하기', art: 'price', bg: '#FBF1CE',
    tip: '“Can I pay by card?”는 어느 가게에서나 통하는 한 문장이에요.',
    lines: [
      { who: 'A', en: 'Can I help you find something?', ko: '뭐 찾으시는 거 있으세요?', pron: '캔 아이 헬프 유 파인드 썸씽' },
      { who: 'B', en: 'How much is this?', ko: '이거 얼마예요?', pron: '하우 머치 이즈 디스' },
      { who: 'A', en: 'It’s twenty dollars.', ko: '20달러예요.', pron: '잇츠 트웬티 달러스' },
      { who: 'B', en: 'Can I pay by card?', ko: '카드로 결제할 수 있나요?', pron: '캔 아이 페이 바이 카드' }
    ]
  },
  {
    key: 'airport', label: '공항', sub: '체크인과 탑승', art: 'boarding', bg: '#E3EBF6',
    tip: '여권은 “passport”, 부칠 짐은 “bags to check”. “Just this one”은 “이것 하나만요”.',
    lines: [
      { who: 'A', en: 'May I see your passport?', ko: '여권 보여 주시겠어요?', pron: '메이 아이 씨 유어 패스포트' },
      { who: 'B', en: 'Here you go.', ko: '여기요.', pron: '히어 유 고' },
      { who: 'A', en: 'Any bags to check?', ko: '부칠 짐이 있으세요?', pron: '에니 배그즈 투 체크' },
      { who: 'B', en: 'Just this one, please.', ko: '이거 하나만요.', pron: '저스트 디스 원, 플리즈' }
    ]
  },
  {
    key: 'transit', label: '교통', sub: '택시 타고 목적지 말하기', art: 'taxi', bg: '#FBE7D9',
    tip: '기사님께는 주소를 보여 주며 “Please take me to this address.”라고 말하면 가장 확실해요.',
    lines: [
      { who: 'A', en: 'Where to?', ko: '어디까지 가세요?', pron: '웨어 투' },
      { who: 'B', en: 'Please take me to this address.', ko: '이 주소로 가 주세요.', pron: '플리즈 테이크 미 투 디스 어드레스' },
      { who: 'A', en: 'Sure. About fifteen minutes.', ko: '네. 15분쯤 걸려요.', pron: '슈어. 어바웃 피프틴 미닛츠' },
      { who: 'B', en: 'How much will it be?', ko: '요금이 얼마예요?', pron: '하우 머치 윌 잇 비' }
    ]
  }
];
