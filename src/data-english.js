/* ============================================================
   영어 — 여행 회화 장면 그림 + 회화 데이터
   장면(EN_SCENES)은 400x180 안에 그리는 '상황 그림'입니다.
   사람·배경 소품·제스처까지 그려서 문장이 놓인 상황이 한눈에 보이게 합니다.
   ============================================================ */

var ENF = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/* ---------- 사람 ---------- */
/* opt: {skin, hair, shirt, arms, legs, face:'smile'|'talk'|'flat', flip} */
function ep(x, y, s, shirt, opt) {
  opt = opt || {};
  var skin = opt.skin || '#F2C6A0';
  var hair = opt.hair || '#4A3B2E';
  var g = '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')' + (opt.flip ? ' scale(-1,1)' : '') + '">';
  if (opt.behind) g += opt.behind;
  g += '<path d="M-10 32v26M10 32v26" stroke="' + (opt.pants || '#4A5A66') + '" stroke-width="10" stroke-linecap="round"/>';
  g += '<path d="M-18 0c0-10 8-17 18-17s18 7 18 17v20c0 6-5 11-11 11H-7c-6 0-11-5-11-11z" fill="' + shirt + '"/>';
  g += opt.arms || '<path d="M-18 4l-14 20M18 4l14 20" stroke="' + shirt + '" stroke-width="8" stroke-linecap="round"/>';
  g += '<circle cx="0" cy="-32" r="14.5" fill="' + skin + '"/>';
  g += '<path d="M-14.5 -36c0-9.5 6.5-15 14.5-15s14.5 5.5 14.5 15c-4-3-8-4-14.5-4s-10.5 1-14.5 4z" fill="' + hair + '"/>';
  g += '<circle cx="-4.8" cy="-31" r="1.9" fill="#2B3A32"/><circle cx="4.8" cy="-31" r="1.9" fill="#2B3A32"/>';
  g += opt.face === 'talk'
    ? '<ellipse cx="0" cy="-24" rx="3.6" ry="4.4" fill="#B4553E"/>'
    : opt.face === 'flat'
      ? '<path d="M-4 -24h8" stroke="#2B3A32" stroke-width="1.7" stroke-linecap="round"/>'
      : '<path d="M-4 -24q4 3.4 8 0" stroke="#2B3A32" stroke-width="1.7" fill="none" stroke-linecap="round"/>';
  return g + '</g>';
}

/* ---------- 말풍선 ---------- */
function enWrap(text, max) {
  var words = String(text).split(' '), lines = [], cur = '';
  for (var i = 0; i < words.length; i++) {
    var t = cur ? cur + ' ' + words[i] : words[i];
    if (t.length > max && cur) { lines.push(cur); cur = words[i]; }
    else cur = t;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

/* opt: {w, mine:true, from:'left'|'right', fs} */
function enBubble(cx, y, text, opt) {
  opt = opt || {};
  var fs = opt.fs || 12;
  var max = opt.w ? Math.round(opt.w / (fs * 0.52)) : 22;
  var lines = enWrap(text, Math.max(10, max));
  var w = opt.w || Math.min(230, Math.max(84, lines.reduce(function (n, l) { return Math.max(n, l.length); }, 0) * fs * 0.54 + 22));
  var h = lines.length * (fs + 3) + 14;
  var x = cx - w / 2;
  var tail = opt.from === 'right'
    ? '<path d="M' + (x + w - 22) + ' ' + (y + h - 1) + 'l2 12-14-11z" fill="' + (opt.mine ? '#FDF3E9' : '#fff') + '"/>'
    : '<path d="M' + (x + 22) + ' ' + (y + h - 1) + 'l-2 12 14-11z" fill="' + (opt.mine ? '#FDF3E9' : '#fff') + '"/>';
  var out = '<g>' + '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="11" fill="' + (opt.mine ? '#FDF3E9' : '#fff') + '" stroke="' + (opt.mine ? '#EBD3B8' : '#E6DDCC') + '" stroke-width="1.4"/>' + tail;
  lines.forEach(function (l, i) {
    out += '<text x="' + (x + w / 2) + '" y="' + (y + 15 + i * (fs + 3)) + '" text-anchor="middle" font-size="' + fs + '" font-weight="700" fill="#3E4C43" font-family="' + ENF + '">' + l.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>';
  });
  return out + '</g>';
}

/* ---------- 소품 ---------- */
function enCounter(y, c1, c2) {
  return '<rect x="0" y="' + y + '" width="400" height="' + (180 - y) + '" fill="' + (c1 || '#E0B08A') + '"/>' +
    '<rect x="0" y="' + (y - 8) + '" width="400" height="10" rx="4" fill="' + (c2 || '#C99A6E') + '"/>';
}
function enMenuBoard(x, y, w, h) {
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="#2F4A3C"/>' +
    '<path d="M' + (x + 10) + ' ' + (y + 14) + 'h' + (w - 40) + 'M' + (x + 10) + ' ' + (y + 26) + 'h' + (w - 60) + 'M' + (x + 10) + ' ' + (y + 38) + 'h' + (w - 50) + '" stroke="#8FB79B" stroke-width="4" stroke-linecap="round"/>';
}
function enSuitcase(x, y, s, c) {
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><rect x="-16" y="-22" width="32" height="26" rx="4" fill="' + (c || '#C97F4E') + '"/>' +
    '<path d="M-6 -22v-5h12v5M0 -22v26" stroke="#8A5A3B" stroke-width="2.4" fill="none"/></g>';
}
function enCup(x, y, s, c) {
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-11 0h22v9c0 7-5 11-11 11S-11 16-11 9z" fill="' + (c || '#C97F4E') + '"/>' +
    '<path d="M11 3h4a6 6 0 0 1 0 12h-4" fill="none" stroke="' + (c || '#C97F4E') + '" stroke-width="3"/></g>';
}
function enPlant(x, y, s) {
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-14 0h28l-4 26h-20z" fill="#DCC3A2"/>' +
    '<path d="M0 0c-2-16-10-24-20-28 2 14 8 22 20 28zM0 0c2-14 8-22 18-26-2 14-8 21-18 26z" fill="#7FB392"/></g>';
}
function enWindow(x, y, w, h) {
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="#CFE2F0"/>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="none" stroke="#B7D2E8" stroke-width="4"/>' +
    '<path d="M' + (x + w / 2) + ' ' + y + 'v' + h + '" stroke="#B7D2E8" stroke-width="4"/>';
}
function enPlane(x, y, s) {
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-26 4l16-4v-10c0-3 2-5 4-5s4 2 4 5v10l16 4v5l-16-2v8l5 4v3l-9-2-9 2v-3l5-4v-8l-16 2z" fill="#8FA8C9"/></g>';
}

/* ---------- 장면 ---------- */
var EN_SCENES = {
  cafe:
    '<rect width="400" height="180" fill="#FBEADB"/>' +
    '<rect x="0" y="118" width="400" height="62" fill="#EBD4B9"/>' +
    enMenuBoard(24, 22, 118, 62) +
    '<rect x="250" y="24" width="126" height="34" rx="7" fill="#fff" opacity=".92"/>' +
    '<text x="313" y="40" text-anchor="middle" font-size="12" font-weight="800" fill="#8A6242" font-family="' + ENF + '">MENU</text>' +
    '<path d="M262 47h50M262 52h30" stroke="#D9A98A" stroke-width="2.6" stroke-linecap="round"/>' +
    enCup(300, 84, 1.1) + enCup(332, 92, .9, '#8FA8C9') +
    ep(330, 108, 1.05, '#7FB392', { arms: '<path d="M-18 2l-16 20M18 2l16 14" stroke="#7FB392" stroke-width="8" stroke-linecap="round"/>', face: 'talk', hair: '#3B3128' }) +
    ep(96, 112, 1.15, '#8FA8C9', { flip: false, arms: '<path d="M-18 4l-12 22M18 4l14 18" stroke="#8FA8C9" stroke-width="8" stroke-linecap="round"/>', face: 'smile', hair: '#4A3B2E' }) +
    '<rect x="0" y="146" width="400" height="10" fill="#D9B88E"/>' +
    enPlant(368, 150, .9),
  food:
    '<rect width="400" height="180" fill="#E2EDF6"/>' +
    '<rect x="0" y="128" width="400" height="52" fill="#DCE7EF"/>' +
    enWindow(250, 18, 110, 54) +
    '<rect x="60" y="104" width="150" height="12" rx="5" fill="#C9A227"/>' +
    '<path d="M74 116v34M196 116v34" stroke="#A9843F" stroke-width="6" stroke-linecap="round"/>' +
    '<ellipse cx="104" cy="100" rx="24" ry="7" fill="#fff"/><ellipse cx="104" cy="94" rx="16" ry="5" fill="#E9A88D"/>' +
    '<ellipse cx="158" cy="100" rx="20" ry="6" fill="#fff"/><ellipse cx="158" cy="95" rx="12" ry="4" fill="#9DC3AA"/>' +
    ep(196, 100, 1.12, '#E58A76', { flip: true, arms: '<path d="M-18 4l-16 18M18 4l14 22" stroke="#E58A76" stroke-width="8" stroke-linecap="round"/>', face: 'talk' }) +
    '<rect x="238" y="126" width="120" height="12" rx="5" fill="#C9A227"/>' +
    '<path d="M250 138v26M346 138v26" stroke="#A9843F" stroke-width="6" stroke-linecap="round"/>' +
    ep(300, 120, 1.0, '#7FB392', { arms: '<path d="M-18 4l-14 20M18 4l16 16" stroke="#7FB392" stroke-width="8" stroke-linecap="round"/>', face: 'talk' }) +
    '<rect x="336" y="128" width="16" height="22" rx="3" fill="#fff" transform="rotate(-12 344 139)"/>' +
    enPlant(24, 132, .85),
  hotel:
    '<rect width="400" height="180" fill="#FBF1CE"/>' +
    '<rect x="0" y="120" width="400" height="60" fill="#E8D9B6"/>' +
    '<rect x="210" y="60" width="170" height="66" rx="8" fill="#C99A6E"/>' +
    '<rect x="210" y="60" width="170" height="12" rx="6" fill="#8A6242"/>' +
    '<path d="M228 92h134M228 106h96" stroke="#F0DCC2" stroke-width="4" stroke-linecap="round"/>' +
    '<rect x="300" y="30" width="76" height="26" rx="6" fill="#fff" opacity=".95"/>' +
    '<text x="338" y="47" text-anchor="middle" font-size="11" font-weight="800" fill="#8A6242" font-family="' + ENF + '">ROOMS</text>' +
    ep(300, 100, 1.1, '#8E86B8', { arms: '<path d="M-18 4l-16 20M18 4l14 16" stroke="#8E86B8" stroke-width="8" stroke-linecap="round"/>', face: 'talk', hair: '#2F2A3A' }) +
    ep(104, 110, 1.15, '#7FB392', { arms: '<path d="M-18 4l-14 18M18 4l14 20" stroke="#7FB392" stroke-width="8" stroke-linecap="round"/>', face: 'smile' }) +
    enSuitcase(56, 150, 1.1) +
    '<rect x="24" y="30" width="54" height="40" rx="6" fill="#fff" opacity=".85"/>' +
    '<path d="M32 40h38M32 50h26M32 60h32" stroke="#D9C9AE" stroke-width="3" stroke-linecap="round"/>',
  directions:
    '<rect width="400" height="180" fill="#E2EDF6"/>' +
    '<rect x="0" y="132" width="400" height="48" fill="#C9DCEB"/>' +
    '<rect x="252" y="34" width="126" height="78" rx="8" fill="#EFF1EA"/>' +
    '<path d="M246 34h138" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/>' +
    '<rect x="268" y="52" width="34" height="60" fill="#C9DED2"/><rect x="318" y="52" width="34" height="26" fill="#F6D3BC"/>' +
    '<rect x="300" y="16" width="30" height="16" rx="3" fill="#1B4D3E"/><circle cx="315" cy="24" r="3.4" fill="#fff"/>' +
    '<path d="M120 150h150" stroke="#fff" stroke-width="14" stroke-linecap="round"/>' +
    '<path d="M250 136l16 14-16 14" fill="none" stroke="#E58A76" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
    ep(96, 108, 1.15, '#E58A76', { arms: '<path d="M-18 2l-18 14M18 2l20 12" stroke="#E58A76" stroke-width="8" stroke-linecap="round"/>', face: 'talk' }) +
    '<rect x="34" y="96" width="46" height="34" rx="4" fill="#fff" transform="rotate(-8 57 113)"/>' +
    '<path d="M42 104h30M42 112h22M42 120h26" stroke="#C9DED2" stroke-width="3" stroke-linecap="round" transform="rotate(-8 57 113)"/>' +
    enPlant(376, 132, .8),
  shopping:
    '<rect width="400" height="180" fill="#FBF1CE"/>' +
    '<rect x="0" y="130" width="400" height="50" fill="#EFE2C3"/>' +
    '<rect x="18" y="34" width="150" height="96" rx="6" fill="#E4D6B4"/>' +
    '<path d="M18 66h150M18 98h150M68 34v96" stroke="#C9B98C" stroke-width="4"/>' +
    '<rect x="30" y="44" width="26" height="16" rx="3" fill="#E9A88D"/><rect x="80" y="44" width="26" height="16" rx="3" fill="#8FA8C9"/>' +
    '<rect x="30" y="76" width="26" height="16" rx="3" fill="#9DC3AA"/><rect x="108" y="76" width="26" height="16" rx="3" fill="#F2CE6B"/>' +
    '<rect x="132" y="106" width="24" height="14" rx="3" fill="#fff"/><path d="M136 112h16" stroke="#C97F4E" stroke-width="2.6"/>' +
    ep(300, 110, 1.15, '#8E86B8', { arms: '<path d="M-18 2l-16 16M18 2l14 14" stroke="#8E86B8" stroke-width="8" stroke-linecap="round"/>', face: 'talk', hair: '#2F2A3A' }) +
    ep(196, 116, 1.1, '#7FB392', { arms: '<path d="M-18 4l-10 20M18 4l16 18" stroke="#7FB392" stroke-width="8" stroke-linecap="round"/>', face: 'smile' }) +
    '<rect x="212" y="88" width="30" height="34" rx="4" fill="#E9A88D"/><path d="M212 96h30" stroke="#fff" stroke-width="3" opacity=".7"/>' +
    enPlant(372, 138, .8),
  airport:
    '<rect width="400" height="180" fill="#E3EBF6"/>' +
    '<rect x="0" y="126" width="400" height="54" fill="#D3DFEC"/>' +
    enWindow(214, 16, 160, 70) + enPlane(316, 44, .95) +
    '<rect x="16" y="86" width="184" height="46" rx="6" fill="#C99A6E"/>' +
    '<rect x="16" y="78" width="184" height="12" rx="5" fill="#8A6242"/>' +
    '<rect x="34" y="98" width="46" height="26" rx="3" fill="#fff"/><path d="M40 106h32M40 114h20" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>' +
    ep(158, 104, 1.05, '#8FA8C9', { arms: '<path d="M-18 2l-14 18M18 2l16 16" stroke="#8FA8C9" stroke-width="8" stroke-linecap="round"/>', face: 'talk', hair: '#3B3128' }) +
    ep(276, 110, 1.15, '#E58A76', { arms: '<path d="M-18 4l-12 18M18 4l14 20" stroke="#E58A76" stroke-width="8" stroke-linecap="round"/>', face: 'smile' }) +
    enSuitcase(320, 152, 1.0, '#8FA8C9') +
    '<rect x="352" y="122" width="34" height="24" rx="3" fill="#7FB392"/><path d="M358 130h22v8h-22z" fill="#fff" opacity=".8"/>',
  transit:
    '<rect width="400" height="180" fill="#FBE7D9"/>' +
    '<rect x="0" y="128" width="400" height="52" fill="#E0D3BC"/>' +
    '<path d="M0 146h400" stroke="#fff" stroke-width="4" stroke-dasharray="16 14" opacity=".7"/>' +
    '<path d="M26 132v-42c0-8 6-14 14-14h44l24-22h120l20 22h84c8 0 14 6 14 14v42z" fill="#F2CE6B"/>' +
    '<rect x="96" y="88" width="52" height="34" rx="5" fill="#CFE2F0"/><rect x="176" y="88" width="52" height="34" rx="5" fill="#CFE2F0"/>' +
    '<rect x="252" y="88" width="46" height="34" rx="5" fill="#CFE2F0"/>' +
    '<rect x="120" y="64" width="70" height="16" rx="4" fill="#1B4D3E"/>' +
    '<circle cx="94" cy="134" r="18" fill="#3E4C43"/><circle cx="94" cy="134" r="7" fill="#E9E3D6"/>' +
    '<circle cx="286" cy="134" r="18" fill="#3E4C43"/><circle cx="286" cy="134" r="7" fill="#E9E3D6"/>' +
    ep(340, 118, .92, '#8FA8C9', { arms: '<path d="M-18 2l-16 16M18 2l12 18" stroke="#8FA8C9" stroke-width="8" stroke-linecap="round"/>', face: 'talk', hair: '#2F2A3A' }) +
    '<rect x="34" y="44" width="46" height="30" rx="3" fill="#fff" transform="rotate(-6 57 59)"/><path d="M40 52h32M40 60h22" stroke="#C9DED2" stroke-width="3" stroke-linecap="round" transform="rotate(-6 57 59)"/>'
};

/* ---------- 영어 한마디 (19) ---------- */
var ENGLISH = [
  { id: 'coffee', cat: '카페', tag: 'COFFEE', en: 'A coffee, please.', ko: '커피 한 잔 주세요.', pron: '어 커피 플리즈', scene: 'cafe' },
  { id: 'iced', cat: '카페', tag: 'ORDER', en: 'I’ll have an iced americano.', ko: '아이스 아메리카노로 할게요.', pron: '아일 해브 언 아이스드 아메리카노', scene: 'cafe' },
  { id: 'here', cat: '카페', tag: 'HERE', en: 'For here, please.', ko: '여기서 마실게요.', pron: '포 히어, 플리즈', scene: 'cafe' },
  { id: 'togo', cat: '카페', tag: 'TO GO', en: 'To go, please.', ko: '포장해 주세요.', pron: '투 고, 플리즈', scene: 'cafe' },
  { id: 'receipt', cat: '카페', tag: 'RECEIPT', en: 'Could I get a receipt?', ko: '영수증 받을 수 있을까요?', pron: '쿠드 아이 겟 어 리시트', scene: 'cafe' },

  { id: 'menu', cat: '식당', tag: 'MENU', en: 'Can I see the menu?', ko: '메뉴 좀 볼 수 있을까요?', pron: '캔 아이 씨 더 메뉴', scene: 'food' },
  { id: 'check', cat: '식당', tag: 'PAY', en: 'The check, please.', ko: '계산서 주세요.', pron: '더 체크, 플리즈', scene: 'food' },
  { id: 'water', cat: '식당', tag: 'WATER', en: 'Some water, please.', ko: '물 좀 주세요.', pron: '썸 워터, 플리즈', scene: 'food' },

  { id: 'reservation', cat: '호텔', tag: 'CHECK-IN', en: 'I have a reservation.', ko: '예약했어요.', pron: '아이 해브 어 레저베이션', scene: 'hotel' },
  { id: 'checkout', cat: '호텔', tag: 'CHECK-OUT', en: 'What time is check-out?', ko: '체크아웃이 몇 시예요?', pron: '왓 타임 이즈 체크아웃', scene: 'hotel' },
  { id: 'wifi', cat: '호텔', tag: 'WI-FI', en: 'What’s the Wi-Fi password?', ko: '와이파이 비밀번호가 뭐예요?', pron: '왓츠 더 와이파이 패스워드', scene: 'hotel' },

  { id: 'station', cat: '길찾기', tag: 'DIRECTIONS', en: 'How do I get to the station?', ko: '역에 어떻게 가요?', pron: '하우 두 아이 겟 투 더 스테이션', scene: 'directions' },
  { id: 'restroom', cat: '길찾기', tag: 'RESTROOM', en: 'Where is the restroom?', ko: '화장실이 어디예요?', pron: '웨어 이즈 더 레스트룸', scene: 'directions' },

  { id: 'price', cat: '쇼핑', tag: 'PRICE', en: 'How much is this?', ko: '이거 얼마예요?', pron: '하우 머치 이즈 디스', scene: 'shopping' },
  { id: 'card', cat: '쇼핑', tag: 'PAY BY CARD', en: 'Can I pay by card?', ko: '카드로 결제할 수 있나요?', pron: '캔 아이 페이 바이 카드', scene: 'shopping' },

  { id: 'gate', cat: '공항', tag: 'GATE', en: 'Where is the gate?', ko: '게이트가 어디예요?', pron: '웨어 이즈 더 게이트', scene: 'airport' },
  { id: 'boarding', cat: '공항', tag: 'CHECK-IN', en: 'Where do I check in?', ko: '체크인은 어디서 해요?', pron: '웨어 두 아이 체크 인', scene: 'airport' },

  { id: 'time', cat: '교통', tag: 'TIME', en: 'How long does it take?', ko: '얼마나 걸려요?', pron: '하우 롱 더즈 잇 테이크', scene: 'transit' },
  { id: 'address', cat: '교통', tag: 'TAXI', en: 'Please take me to this address.', ko: '이 주소로 가 주세요.', pron: '플리즈 테이크 미 투 디스 어드레스', scene: 'transit' }
];

/* ---------- 카페 주문 대화 (6) ---------- */
var DIALOGUE = [
  { who: 'mia', en: 'Hi, welcome! What can I get for you?', ko: '안녕하세요! 뭐 드릴까요?', pron: '하이, 웰컴! 왓 캔 아이 겟 포 유' },
  { who: 'me', en: 'An iced americano, please.', ko: '아이스 아메리카노 한 잔 주세요.', pron: '언 아이스드 아메리카노, 플리즈' },
  { who: 'mia', en: 'For here or to go?', ko: '드시고 가세요, 포장이세요?', pron: '포 히어 오어 투 고' },
  { who: 'me', en: 'For here, please.', ko: '여기서 마실게요.', pron: '포 히어, 플리즈' },
  { who: 'mia', en: 'Sure. That’s five dollars.', ko: '네. 5달러예요.', pron: '슈어. 댓츠 파이브 달러스' },
  { who: 'me', en: 'Here you go. Can I get a receipt?', ko: '여기요. 영수증도 받을 수 있을까요?', pron: '히어 유 고. 캔 아이 겟 어 리시트' }
];

/* ---------- 상황별 여행 영어 회화 (7) ---------- */
var EN_SITUATIONS = [
  {
    key: 'cafe', label: '카페', sub: '주문하고 받기', scene: 'cafe', bg: '#FBEADB',
    tip: '“What can I get for you?”는 “뭐 드릴까요?”예요. 원하는 것 + please만 붙이면 주문이 끝나요.',
    lines: [
      { who: 'A', en: 'Hi! What can I get for you?', ko: '안녕하세요! 뭐 드릴까요?', pron: '왓 캔 아이 겟 포 유' },
      { who: 'B', en: 'An iced latte, please.', ko: '아이스 라떼 한 잔 주세요.', pron: '언 아이스드 라떼, 플리즈' },
      { who: 'A', en: 'For here or to go?', ko: '드시고 가세요, 포장이세요?', pron: '포 히어 오어 투 고' },
      { who: 'B', en: 'To go, please.', ko: '포장해 주세요.', pron: '투 고, 플리즈' }
    ]
  },
  {
    key: 'food', label: '식당', sub: '주문하고 계산하기', scene: 'food', bg: '#E2EDF6',
    tip: '“I’ll have ~”는 메뉴를 고를 때 가장 자연스러운 표현이에요. 계산은 “The check, please.”',
    lines: [
      { who: 'A', en: 'Are you ready to order?', ko: '주문하시겠어요?', pron: '아 유 레디 투 오더' },
      { who: 'B', en: 'Yes, I’ll have the pasta.', ko: '네, 파스타로 할게요.', pron: '예스, 아일 해브 더 파스타' },
      { who: 'A', en: 'Anything to drink?', ko: '음료는 필요하세요?', pron: '에니씽 투 드링크' },
      { who: 'B', en: 'Just water, please.', ko: '물만 주세요.', pron: '저스트 워터, 플리즈' }
    ]
  },
  {
    key: 'hotel', label: '호텔', sub: '체크인과 안내', scene: 'hotel', bg: '#FBF1CE',
    tip: '예약자 이름은 “under + 이름”으로 말해요. “Under Kim.”이면 “김으로 예약했어요.”',
    lines: [
      { who: 'A', en: 'Do you have a reservation?', ko: '예약하셨나요?', pron: '두 유 해브 어 레저베이션' },
      { who: 'B', en: 'Yes, under Kim.', ko: '네, 김으로 했어요.', pron: '예스, 언더 김' },
      { who: 'A', en: 'Your room is on the fifth floor.', ko: '방은 5층이에요.', pron: '유어 룸 이즈 온 더 피프스 플로어' },
      { who: 'B', en: 'Thank you. What time is breakfast?', ko: '감사합니다. 조식은 몇 시예요?', pron: '땡큐. 왓 타임 이즈 브렉퍼스트' }
    ]
  },
  {
    key: 'directions', label: '길찾기', sub: '물어보고 확인하기', scene: 'directions', bg: '#E2EDF6',
    tip: '“Go straight and turn left.”만 알아도 길 안내를 절반은 알아들어요.',
    lines: [
      { who: 'A', en: 'Where are you trying to go?', ko: '어디 가시려고요?', pron: '웨어 아 유 트라잉 투 고' },
      { who: 'B', en: 'How do I get to the station?', ko: '역에 어떻게 가요?', pron: '하우 두 아이 겟 투 더 스테이션' },
      { who: 'A', en: 'Go straight and turn left.', ko: '직진해서 왼쪽으로 도세요.', pron: '고 스트레이트 앤 턴 레프트' },
      { who: 'B', en: 'Is it far from here?', ko: '여기서 먼가요?', pron: '이즈 잇 파 프롬 히어' }
    ]
  },
  {
    key: 'shopping', label: '쇼핑', sub: '가격 묻고 결제하기', scene: 'shopping', bg: '#FBF1CE',
    tip: '“Can I pay by card?”는 어느 가게에서나 통하는 한 문장이에요.',
    lines: [
      { who: 'A', en: 'Can I help you find something?', ko: '뭐 찾으시는 거 있으세요?', pron: '캔 아이 헬프 유 파인드 썸씽' },
      { who: 'B', en: 'How much is this?', ko: '이거 얼마예요?', pron: '하우 머치 이즈 디스' },
      { who: 'A', en: 'It’s twenty dollars.', ko: '20달러예요.', pron: '잇츠 트웬티 달러스' },
      { who: 'B', en: 'Can I pay by card?', ko: '카드로 결제할 수 있나요?', pron: '캔 아이 페이 바이 카드' }
    ]
  },
  {
    key: 'airport', label: '공항', sub: '체크인과 탑승', scene: 'airport', bg: '#E3EBF6',
    tip: '여권은 “passport”, 부칠 짐은 “bags to check”. “Just this one”은 “이것 하나만요”.',
    lines: [
      { who: 'A', en: 'May I see your passport?', ko: '여권 보여 주시겠어요?', pron: '메이 아이 씨 유어 패스포트' },
      { who: 'B', en: 'Here you go.', ko: '여기요.', pron: '히어 유 고' },
      { who: 'A', en: 'Any bags to check?', ko: '부칠 짐이 있으세요?', pron: '에니 배그즈 투 체크' },
      { who: 'B', en: 'Just this one, please.', ko: '이거 하나만요.', pron: '저스트 디스 원, 플리즈' }
    ]
  },
  {
    key: 'transit', label: '교통', sub: '택시 타고 목적지 말하기', scene: 'transit', bg: '#FBE7D9',
    tip: '기사님께는 주소를 보여 주며 “Please take me to this address.”라고 말하면 가장 확실해요.',
    lines: [
      { who: 'A', en: 'Where to?', ko: '어디까지 가세요?', pron: '웨어 투' },
      { who: 'B', en: 'Please take me to this address.', ko: '이 주소로 가 주세요.', pron: '플리즈 테이크 미 투 디스 어드레스' },
      { who: 'A', en: 'Sure. About fifteen minutes.', ko: '네. 15분쯤 걸려요.', pron: '슈어. 어바웃 피프틴 미닛츠' },
      { who: 'B', en: 'How much will it be?', ko: '요금이 얼마예요?', pron: '하우 머치 윌 잇 비' }
    ]
  }
];
