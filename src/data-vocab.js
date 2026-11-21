/* ============================================================
   필수 단어장 — 41개 (명사 16 · 동사 13 · 형용사 12)
   orig: 원래 표기 / reading: 히라가나 읽기 / ko: 한국어 발음 / romaji
   ============================================================ */
var WORDS = [
  /* ---------------- 주어 · 명사 ---------------- */
  { id: 'watashi', cat: 'noun', orig: '私', reading: 'わたし', ko: '와타시', romaji: 'watashi', mean: '나 · 저', bg: '#E2EDF6', art:
    '<circle cx="100" cy="60" r="18" fill="#F2C6A0"/><path d="M100 80c-20 0-32 14-32 34v44h64V114c0-20-12-34-32-34z" fill="#7FA8C9"/><path d="M84 112c10 6 22 6 32 0" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/><path d="M76 96l-14 22" stroke="#F2C6A0" stroke-width="10" stroke-linecap="round"/>',
    kanji: { chars: '私', hun: '나 사(私)', on: 'シ', kun: 'わたし', tip: '벼(禾)를 사사로이(厶) 나눠 가진 사람 → 나. 회사(会社)의 社와 같은 글자 뿌리예요.' } },
  { id: 'anata', cat: 'noun', orig: 'あなた', reading: 'あなた', ko: '아나타', romaji: 'anata', mean: '당신 · 너', bg: '#F9E3E7', art:
    '<circle cx="78" cy="66" r="15" fill="#F2C6A0"/><path d="M78 84c-16 0-26 12-26 28v34h52v-34c0-16-10-28-26-28z" fill="#9DC3AA"/><path d="M124 96h30M146 88l8 8-8 8" stroke="#E58A76" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="124" cy="70" r="12" fill="none" stroke="#E58A76" stroke-width="4"/>',
    kanji: null },
  { id: 'mizu', cat: 'noun', orig: '水', reading: 'みず', ko: '미즈', romaji: 'mizu', mean: '물', bg: '#E2EDF6', art:
    '<path d="M100 46c0 0-34 44-34 64a34 34 0 0 0 68 0c0-20-34-64-34-64z" fill="#7FA8C9"/><path d="M84 108c0 12 8 20 18 22" stroke="#fff" stroke-width="5" fill="none" opacity=".65" stroke-linecap="round"/><path d="M44 150c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0" stroke="#9DC3AA" stroke-width="5" fill="none" stroke-linecap="round"/>',
    kanji: { chars: '水', hun: '물 수(水)', on: 'スイ', kun: 'みず', tip: '가운데 세로줄이 흐르는 물줄기, 양옆은 물이 튀는 방울이에요.' } },
  { id: 'ocha', cat: 'noun', orig: 'お茶', reading: 'おちゃ', ko: '오차', romaji: 'ocha', mean: '차 · 녹차', bg: '#E2EFE6', art:
    '<path d="M62 96h64v22c0 20-14 34-32 34s-32-14-32-34z" fill="#7FB392"/><path d="M126 104h8a14 14 0 0 1 0 28h-8" fill="none" stroke="#7FB392" stroke-width="9" stroke-linecap="round"/><path d="M62 96h64" stroke="#fff" stroke-width="4" opacity=".65"/><path d="M86 72c-6-8 6-12 0-20M104 74c-6-8 6-12 0-20" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M100 154c14 0 24-6 30-14" stroke="#C9DED2" stroke-width="4" fill="none"/><path d="M60 158h80" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '茶', hun: '차 다(茶)', on: 'チャ · サ', kun: 'ちゃ', tip: '위의 초두머리(艹)는 찻잎, 아래 人+木은 사람이 나무에서 잎을 따는 모습이에요.' } },
  { id: 'gohan', cat: 'noun', orig: 'ご飯', reading: 'ごはん', ko: '고한', romaji: 'gohan', mean: '밥', bg: '#FBF1CE', art:
    '<path d="M54 98h92c0 28-20 46-46 46s-46-18-46-46z" fill="#E9A88D"/><path d="M54 98h92" stroke="#fff" stroke-width="5" opacity=".75"/><path d="M74 88c-4-14 8-18 4-32M100 86c-6-16 8-20 4-34M126 88c-4-14 8-18 4-32" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="86" cy="112" rx="7" ry="4" fill="#fff"/><ellipse cx="106" cy="118" rx="6" ry="3.5" fill="#fff"/><ellipse cx="118" cy="108" rx="5" ry="3" fill="#fff"/>',
    kanji: { chars: '飯', hun: '밥 반(飯)', on: 'ハン', kun: 'めし', tip: '밥(食)을 반(反)쯤 먹는다고 기억하면 쉬워요. 아침밥은 朝ご飯.' } },
  { id: 'eki', cat: 'noun', orig: '駅', reading: 'えき', ko: '에키', romaji: 'eki', mean: '역', bg: '#E2EDF6', art:
    '<rect x="44" y="78" width="112" height="66" rx="8" fill="#EFF1EA"/><path d="M36 78h128" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/><rect x="56" y="94" width="34" height="50" fill="#C9DED2"/><rect x="108" y="94" width="34" height="26" fill="#F6D3BC"/><rect x="86" y="58" width="28" height="18" rx="4" fill="#1B4D3E"/><circle cx="100" cy="67" r="4" fill="#F9F7F3"/><path d="M44 144h112" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '駅', hun: '역 역(驛의 略字)', on: 'エキ', kun: '—', tip: '원래 驛은 말(馬)이 쉬어 가는 곳. 지금은 전철이 서는 곳이에요.' } },
  { id: 'densha', cat: 'noun', orig: '電車', reading: 'でんしゃ', ko: '덴샤', romaji: 'densha', mean: '전철', bg: '#E2EDF6', art:
    '<rect x="56" y="60" width="88" height="94" rx="22" fill="#7FA8C9"/><rect x="70" y="76" width="60" height="34" rx="8" fill="#EAF2F8"/><path d="M100 76v34" stroke="#B7D2E8" stroke-width="4"/><circle cx="80" cy="146" r="8" fill="#3E4C43"/><circle cx="120" cy="146" r="8" fill="#3E4C43"/><path d="M56 124h88" stroke="#fff" stroke-width="4" opacity=".7"/><path d="M84 54l-6-10M116 54l6-10" stroke="#9AA7B5" stroke-width="4" stroke-linecap="round"/>',
    kanji: { chars: '電車', hun: '번개 전(電) · 수레 차(車)', on: 'デン · シャ', kun: '—', tip: '번개(電)처럼 빠르게 달리는 수레(車)가 전철. 電車 = でんしゃ.' } },
  { id: 'kuukou', cat: 'noun', orig: '空港', reading: 'くうこう', ko: '쿠코', romaji: 'kūkō', mean: '공항', bg: '#F9E3E7', art:
    '<path d="M46 110l44-14V60c0-8 4-12 10-12s10 4 10 12v36l44 14v14l-44-8v26l14 10v10l-24-6-24 6v-10l14-10v-26l-44 8z" fill="#7FA8C9" transform="rotate(20 100 100)"/><path d="M140 132c14-2 24-10 28-22" stroke="#C9DED2" stroke-width="5" fill="none" stroke-dasharray="7 8" stroke-linecap="round"/>',
    kanji: { chars: '空港', hun: '하늘 공(空) · 항구 항(港)', on: 'クウ · コウ', kun: 'そら · みなと', tip: '하늘(空)로 떠나는 항구(港). 空港은 くうこう, 空은 そら라고도 읽어요.' } },
  { id: 'hoteru', cat: 'noun', orig: 'ホテル', reading: 'ほてる', ko: '호테루', romaji: 'hoteru', mean: '호텔', bg: '#FBF1CE', art:
    '<rect x="52" y="52" width="96" height="108" rx="10" fill="#F6D3BC"/><path d="M52 76h96" stroke="#fff" stroke-width="5" opacity=".8"/><rect x="68" y="88" width="20" height="20" fill="#fff" opacity=".85"/><rect x="112" y="88" width="20" height="20" fill="#fff" opacity=".85"/><rect x="66" y="120" width="68" height="26" rx="5" fill="#1B4D3E"/><text x="100" y="138" font-size="13" fill="#fff" text-anchor="middle" font-family="-apple-system,Segoe UI,sans-serif" font-weight="700">HOTEL</text>',
    kanji: null },
  { id: 'toire', cat: 'noun', orig: 'トイレ', reading: 'といれ', ko: '토이레', romaji: 'toire', mean: '화장실', bg: '#E2EFE6', art:
    '<circle cx="76" cy="62" r="10" fill="#7FA8C9"/><path d="M76 74v38M76 86L62 98M76 86l14 12M76 112l-10 24M76 112l10 24" stroke="#7FA8C9" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="124" cy="62" r="10" fill="#E9A88D"/><path d="M124 74v24l-16 26h32l-16-26M110 124v12M138 124v12" stroke="#E9A88D" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="146" cy="52" r="6" fill="#C9DED2"/>',
    kanji: null },
  { id: 'okane', cat: 'noun', orig: 'お金', reading: 'おかね', ko: '오카네', romaji: 'okane', mean: '돈', bg: '#FBF1CE', art:
    '<circle cx="98" cy="102" r="42" fill="#F2CE6B"/><circle cx="98" cy="102" r="34" fill="none" stroke="#D9A94E" stroke-width="4"/><text x="98" y="118" font-size="42" text-anchor="middle" fill="#8A6242" font-family="-apple-system,Segoe UI,sans-serif" font-weight="700">¥</text><circle cx="82" cy="86" r="7" fill="#fff" opacity=".5"/><path d="M146 138l10 10 16-20" stroke="#7FB392" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    kanji: { chars: '金', hun: '쇠 금(金)', on: 'キン · コン', kun: 'かね', tip: '흙(土) 속에 반짝이는 금 두 점. お金 = おかね, 돈이에요.' } },
  { id: 'kyou', cat: 'noun', orig: '今日', reading: 'きょう', ko: '쿄', romaji: 'kyō', mean: '오늘', bg: '#FBE7D9', art:
    '<rect x="54" y="60" width="92" height="88" rx="10" fill="#fff" stroke="#E4DACA" stroke-width="3"/><rect x="54" y="60" width="92" height="24" rx="10" fill="#E9A88D"/><circle cx="74" cy="72" r="3" fill="#fff"/><circle cx="126" cy="72" r="3" fill="#fff"/><circle cx="100" cy="112" r="17" fill="#F2CE6B"/><path d="M100 95v-6M100 129v6M83 112h-6M123 112h-6M88 100l-4-4M112 100l4-4M88 124l-4 4M112 124l4 4" stroke="#E8A33D" stroke-width="4" stroke-linecap="round"/><path d="M54 150h92" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '今日', hun: '이제 금(今) · 날 일(日)', on: 'コン · ニチ', kun: 'きょう · ひ', tip: '이제(今) 막 해(日)가 밝은 때 → 오늘. 今日은 きょう로 통째로 외워요.' } },
  { id: 'ashita', cat: 'noun', orig: '明日', reading: 'あした', ko: '아시타', romaji: 'ashita', mean: '내일', bg: '#E9E4F4', art:
    '<rect x="42" y="66" width="80" height="76" rx="10" fill="#fff" stroke="#E4DACA" stroke-width="3"/><rect x="42" y="66" width="80" height="20" rx="10" fill="#8FA8C9"/><path d="M56 118a16 16 0 1 0 16-16 12 12 0 1 0 12 12" fill="none" stroke="#F2CE6B" stroke-width="6" stroke-linecap="round"/><path d="M136 96h30M158 88l8 8-8 8" stroke="#E58A76" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="150" cy="132" r="14" fill="#F2CE6B"/><path d="M124 140h20" stroke="#C9DED2" stroke-width="4" stroke-linecap="round"/>',
    kanji: { chars: '明日', hun: '밝을 명(明) · 날 일(日)', on: 'メイ · ニチ', kun: 'あした · あす', tip: '해(日)와 달(月)이 함께 밝아지는 다음 날. 明日은 あした, 격식 있게는 あす.' } },
  { id: 'hito', cat: 'noun', orig: '人', reading: 'ひと', ko: '히토', romaji: 'hito', mean: '사람', bg: '#E2EFE6', art:
    '<circle cx="100" cy="62" r="18" fill="#F2C6A0"/><path d="M100 82c-19 0-31 14-31 34v44h62V116c0-20-12-34-31-34z" fill="#7FB392"/><path d="M86 116v44M114 116v44" stroke="#fff" stroke-width="3" opacity=".45"/><circle cx="54" cy="140" r="10" fill="#C9DED2"/><circle cx="146" cy="140" r="10" fill="#C9DED2"/>',
    kanji: { chars: '人', hun: '사람 인(人)', on: 'ジン · ニン', kun: 'ひと', tip: '두 다리로 서 있는 사람을 옆에서 본 모양. 一人(ひとり)은 한 사람.' } },
  { id: 'michi', cat: 'noun', orig: '道', reading: 'みち', ko: '미치', romaji: 'michi', mean: '길', bg: '#FBE7D9', art:
    '<path d="M66 160c0-44 66-42 66-86 0-24-20-36-38-36" fill="none" stroke="#E0D3BC" stroke-width="20" stroke-linecap="round"/><path d="M66 160c0-44 66-42 66-86 0-24-20-36-38-36" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="9 11"/><path d="M140 62c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34c0-11-9-20-20-20z" fill="#E58A76"/><circle cx="140" cy="82" r="7" fill="#fff"/>',
    kanji: { chars: '道', hun: '길 도(道)', on: 'ドウ · トウ', kun: 'みち', tip: '머리(首)를 내밀고 걸어가는(辶) 길. 北海道(ほっかいどう)에도 쓰여요.' } },
  { id: 'namae', cat: 'noun', orig: '名前', reading: 'なまえ', ko: '나마에', romaji: 'namae', mean: '이름', bg: '#FBF1CE', art:
    '<rect x="44" y="78" width="112" height="58" rx="10" fill="#fff" stroke="#1B4D3E" stroke-width="4"/><circle cx="70" cy="108" r="13" fill="#F2C6A0"/><path d="M88 96h52M88 112h38M88 126h26" stroke="#C9DED2" stroke-width="5" stroke-linecap="round"/><path d="M100 78v-10" stroke="#8A6242" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="64" r="6" fill="none" stroke="#8A6242" stroke-width="4"/>',
    kanji: { chars: '名前', hun: '이름 명(名) · 앞 전(前)', on: 'メイ · ゼン', kun: 'な · まえ', tip: '어두울 때(夕) 입(口)으로 부르는 것이 이름(名). 名前 = なまえ.' } },

  /* ---------------- 동사 ---------------- */
  { id: 'iku', cat: 'verb', orig: '行く', reading: 'いく', ko: '이쿠', romaji: 'iku', mean: '가다', bg: '#E2EDF6', art:
    '<path d="M46 96h62" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><path d="M96 82l18 14-18 14" stroke="#1B4D3E" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="72" cy="132" rx="10" ry="14" fill="#C9DED2"/><ellipse cx="104" cy="146" rx="9" ry="13" fill="#9DC3AA"/><path d="M132 66h36v72h-36z" fill="#F6D3BC" opacity=".55"/><path d="M132 66h36v72h-36z" fill="none" stroke="#E0D3BC" stroke-width="3"/>',
    kanji: { chars: '行', hun: '갈 행(行)', on: 'コウ · ギョウ', kun: 'い(く)', tip: '두 갈래 길을 걷는 발 모양. 行きます(いきます)는 정중한 "갑니다".' } },
  { id: 'kuru', cat: 'verb', orig: '来る', reading: 'くる', ko: '쿠루', romaji: 'kuru', mean: '오다', bg: '#E2EFE6', art:
    '<path d="M100 40v52" stroke="#E58A76" stroke-width="8" stroke-linecap="round"/><path d="M84 78l16 16 16-16" stroke="#E58A76" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M56 116h88v34H56z" fill="#F6D3BC"/><path d="M56 116h88" stroke="#C97F4E" stroke-width="4"/><circle cx="100" cy="133" r="4" fill="#C97F4E"/><path d="M46 158h108" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '来', hun: '올 래(來의 略字)', on: 'ライ', kun: 'く(る)', tip: '나무(木)에 열매가 열리러 오는 모양. 来ます = 옵니다.' } },
  { id: 'taberu', cat: 'verb', orig: '食べる', reading: 'たべる', ko: '타베루', romaji: 'taberu', mean: '먹다', bg: '#FBE7D9', art:
    '<path d="M50 104h100c0 28-22 48-50 48s-50-20-50-48z" fill="#E9A88D"/><path d="M50 104h100" stroke="#fff" stroke-width="5" opacity=".8"/><path d="M92 56v42M108 56v42" stroke="#8A6242" stroke-width="5" stroke-linecap="round"/><ellipse cx="78" cy="122" rx="8" ry="5" fill="#fff"/><ellipse cx="100" cy="128" rx="7" ry="4" fill="#fff"/><ellipse cx="120" cy="120" rx="6" ry="4" fill="#fff"/>',
    kanji: { chars: '食', hun: '밥 식(食)', on: 'ショク', kun: 'た(べる)', tip: '뚜껑(人)이 덮인 그릇(良)에 밥이 가득. 食べる = たべる.' } },
  { id: 'nomu', cat: 'verb', orig: '飲む', reading: 'のむ', ko: '노무', romaji: 'nomu', mean: '마시다', bg: '#E2EDF6', art:
    '<path d="M72 84h56l-6 56c-1 10-10 16-22 16s-21-6-22-16z" fill="#7FA8C9"/><path d="M72 84h56" stroke="#fff" stroke-width="4" opacity=".75"/><path d="M128 56l-16 32" stroke="#E58A76" stroke-width="6" stroke-linecap="round"/><path d="M86 104c8 6 20 6 28 0" stroke="#EAF2F8" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M62 158h76" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '飲', hun: '마실 음(飮의 略字)', on: 'イン', kun: 'の(む)', tip: '술(酉)을 입 벌린 사람(欠)이 마시는 모양. 飲み物 = 음료.' } },
  { id: 'kau', cat: 'verb', orig: '買う', reading: 'かう', ko: '카우', romaji: 'kau', mean: '사다', bg: '#FBF1CE', art:
    '<path d="M60 80h80l-9 74H69z" fill="#F2CE6B"/><path d="M82 80c0-16 8-26 18-26s18 10 18 26" fill="none" stroke="#8A6242" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="116" r="16" fill="#fff" opacity=".55"/><path d="M92 116l6 6 12-14" stroke="#C97F4E" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    kanji: { chars: '買', hun: '살 매(買)', on: 'バイ', kun: 'か(う)', tip: '그물(网)로 돈을 담아 장터에서 사는 모양. 買い物 = 쇼핑.' } },
  { id: 'miru', cat: 'verb', orig: '見る', reading: 'みる', ko: '미루', romaji: 'miru', mean: '보다', bg: '#E2EFE6', art:
    '<path d="M42 102c22-28 40-38 58-38s36 10 58 38c-22 28-40 38-58 38s-36-10-58-38z" fill="#fff" stroke="#1B4D3E" stroke-width="4"/><circle cx="100" cy="102" r="18" fill="#7FA8C9"/><circle cx="100" cy="102" r="8" fill="#3E4C43"/><circle cx="107" cy="95" r="5" fill="#fff"/><path d="M60 72l-8-10M140 72l8-10" stroke="#C9DED2" stroke-width="4" stroke-linecap="round"/>',
    kanji: { chars: '見', hun: '볼 견(見)', on: 'ケン', kun: 'み(る)', tip: '눈(目)이 다리 위에 얹힌 모양 — 멀리 보는 사람이에요.' } },
  { id: 'kiku', cat: 'verb', orig: '聞く', reading: 'きく', ko: '키쿠', romaji: 'kiku', mean: '듣다 · 묻다', bg: '#F9E3E7', art:
    '<path d="M124 76c0-24-16-40-36-40S52 52 52 76c0 18 10 28 20 36 8 6 11 14 9 24-2 10 4 18 14 18" fill="none" stroke="#E9A88D" stroke-width="10" stroke-linecap="round"/><path d="M110 82c0-12-8-22-20-22" fill="none" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/><path d="M140 54c12 13 17 28 15 44M152 44c14 16 20 34 18 54" fill="none" stroke="#C9DED2" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '聞', hun: '들을 문(聞)', on: 'ブン', kun: 'き(く)', tip: '귀(耳)가 문(門) 안에 — 문밖의 소리를 듣는다는 뜻이에요.' } },
  { id: 'hanasu', cat: 'verb', orig: '話す', reading: 'はなす', ko: '하나스', romaji: 'hanasu', mean: '말하다', bg: '#E2EDF6', art:
    '<path d="M44 54h72a12 12 0 0 1 12 12v30a12 12 0 0 1-12 12H78l-18 16V108H44a12 12 0 0 1-12-12V66a12 12 0 0 1 12-12z" fill="#7FA8C9"/><path d="M100 54h56a12 12 0 0 1 12 12v98l-16-14h-52a12 12 0 0 1-12-12V66a12 12 0 0 1 12-12z" fill="#F6D3BC"/><path d="M60 76h44M60 90h30M112 76h40M112 90h28" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>',
    kanji: { chars: '話', hun: '말씀 화(話)', on: 'ワ', kun: 'はな(す)', tip: '말(言)이 혀(舌)로 나온다. 電話(でんわ)는 전화.' } },
  { id: 'matsu', cat: 'verb', orig: '待つ', reading: 'まつ', ko: '마츠', romaji: 'matsu', mean: '기다리다', bg: '#FBF1CE', art:
    '<circle cx="100" cy="100" r="42" fill="#fff" stroke="#1B4D3E" stroke-width="5"/><path d="M100 76v26l18 11" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 58v6M142 100h-6M100 142v-6M58 100h6" stroke="#C9DED2" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="5" fill="#E58A76"/>',
    kanji: { chars: '待', hun: '기다릴 대(待)', on: 'タイ', kun: 'ま(つ)', tip: '두인변(彳)은 길 — 길가 절(寺) 앞에서 사람을 기다리는 모양.' } },
  { id: 'harau', cat: 'verb', orig: '払う', reading: 'はらう', ko: '하라우', romaji: 'harau', mean: '지불하다', bg: '#E2EFE6', art:
    '<rect x="46" y="62" width="100" height="62" rx="10" fill="#7FA8C9"/><rect x="46" y="78" width="100" height="12" fill="#1B4D3E" opacity=".55"/><rect x="58" y="100" width="34" height="8" rx="4" fill="#fff" opacity=".8"/><circle cx="136" cy="136" r="18" fill="#F2CE6B"/><text x="136" y="143" font-size="18" text-anchor="middle" fill="#8A6242" font-weight="700" font-family="-apple-system,Segoe UI,sans-serif">¥</text>',
    kanji: { chars: '払', hun: '떨칠 불(拂의 略字)', on: 'フツ', kun: 'はら(う)', tip: '재방변(扌)은 손 — 손으로 돈을 털어 내듯 지불해요. 払います = 계산합니다.' } },
  { id: 'tomaru', cat: 'verb', orig: '泊まる', reading: 'とまる', ko: '토마루', romaji: 'tomaru', mean: '묵다', bg: '#E9E4F4', art:
    '<rect x="46" y="98" width="104" height="42" rx="8" fill="#7FA8C9"/><rect x="56" y="86" width="32" height="18" rx="7" fill="#fff"/><path d="M46 140h104" stroke="#8A6242" stroke-width="6" stroke-linecap="round"/><path d="M46 98h104" stroke="#fff" stroke-width="4" opacity=".55"/><path d="M150 60c-8 0-14 6-14 14H46" fill="none" stroke="#C9DED2" stroke-width="4" stroke-linecap="round"/>',
    kanji: { chars: '泊', hun: '머물 박(泊)', on: 'ハク', kun: 'と(まる)', tip: '삼수변(氵) 곁에 배(白)를 대고 하룻밤 머무는 모양. 一泊 = 1박.' } },
  { id: 'wakaru', cat: 'verb', orig: '分かる', reading: 'わかる', ko: '와카루', romaji: 'wakaru', mean: '알다 · 이해하다', bg: '#FBF1CE', art:
    '<circle cx="100" cy="84" r="30" fill="#F2CE6B"/><path d="M86 112h28v10H86z" fill="#D9A94E"/><path d="M84 130h32M88 140h24" stroke="#D9A94E" stroke-width="6" stroke-linecap="round"/><path d="M100 52v6M68 66l6 6M132 66l-6 6M60 88h6M134 88h6" stroke="#E8A33D" stroke-width="5" stroke-linecap="round"/><path d="M88 84l9 9 17-19" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    kanji: { chars: '分', hun: '나눌 분(分)', on: 'ブン · フン', kun: 'わ(かる) · わ(ける)', tip: '칼(刀)로 나누면 속이 보여요 → 이해하다. 分かりました = 알겠습니다.' } },
  { id: 'noru', cat: 'verb', orig: '乗る', reading: 'のる', ko: '노루', romaji: 'noru', mean: '타다', bg: '#E2EDF6', art:
    '<rect x="44" y="68" width="104" height="68" rx="12" fill="#F2CE6B"/><rect x="56" y="82" width="30" height="22" rx="4" fill="#fff"/><rect x="94" y="82" width="30" height="22" rx="4" fill="#fff"/><circle cx="68" cy="140" r="9" fill="#3E4C43"/><circle cx="124" cy="140" r="9" fill="#3E4C43"/><path d="M158 102h-14M150 94l8 8-8 8" stroke="#E58A76" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 118h104" stroke="#fff" stroke-width="3" opacity=".6"/>',
    kanji: { chars: '乗', hun: '탈 승(乘의 略字)', on: 'ジョウ', kun: 'の(る)', tip: '나무(木) 위에 올라탄 모양. 乗ります = 탑니다.' } },

  /* ---------------- 형용사 ---------------- */
  { id: 'ookii', cat: 'adj', orig: '大きい', reading: 'おおきい', ko: '오오키이', romaji: 'ōkii', mean: '크다', bg: '#FBE7D9', art:
    '<circle cx="84" cy="102" r="42" fill="#E9A88D"/><circle cx="150" cy="132" r="16" fill="#C9DED2"/><path d="M64 84c6-6 14-10 22-10" stroke="#fff" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/><path d="M148 44l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2CE6B"/>',
    kanji: { chars: '大', hun: '큰 대(大)', on: 'ダイ · タイ', kun: 'おお(きい)', tip: '팔을 벌린 사람 모양 → 크다. 大学(だいがく)는 대학.' } },
  { id: 'chiisai', cat: 'adj', orig: '小さい', reading: 'ちいさい', ko: '치이사이', romaji: 'chīsai', mean: '작다', bg: '#E2EFE6', art:
    '<circle cx="100" cy="100" r="15" fill="#E9A88D"/><circle cx="58" cy="66" r="5" fill="#C9DED2"/><circle cx="144" cy="70" r="6" fill="#C9DED2"/><circle cx="56" cy="136" r="4" fill="#C9DED2"/><circle cx="146" cy="132" r="5" fill="#C9DED2"/><path d="M100 78v-8M100 130v8M78 100h-8M130 100h-8" stroke="#9DC3AA" stroke-width="4" stroke-linecap="round"/>',
    kanji: { chars: '小', hun: '작을 소(小)', on: 'ショウ', kun: 'ちい(さい) · こ', tip: '작은 점 세 개가 흩어진 모양. 小さい = ちいさい.' } },
  { id: 'takai', cat: 'adj', orig: '高い', reading: 'たかい', ko: '타카이', romaji: 'takai', mean: '비싸다 · 높다', bg: '#FBF1CE', art:
    '<path d="M52 106l52-52h44v44l-52 52z" fill="#F6D3BC"/><circle cx="136" cy="66" r="6" fill="#fff"/><path d="M100 128V96M86 110l14-14 14 14" stroke="#C05F45" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="72" y="146" font-size="20" fill="#8A6242" font-family="-apple-system,Segoe UI,sans-serif" font-weight="700">¥</text>',
    kanji: { chars: '高', hun: '높을 고(高)', on: 'コウ', kun: 'たか(い)', tip: '높이 솟은 탑 모양. 가격도 높으면 高い — 비싸다는 뜻도 돼요.' } },
  { id: 'yasui', cat: 'adj', orig: '安い', reading: 'やすい', ko: '야스이', romaji: 'yasui', mean: '싸다', bg: '#E2EFE6', art:
    '<path d="M52 94l52-52h44v44l-52 52z" fill="#C9DED2"/><circle cx="136" cy="54" r="6" fill="#fff"/><path d="M100 80v34M86 100l14 14 14-14" stroke="#3E6B51" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="130" cy="140" r="14" fill="#F2CE6B"/><text x="130" y="146" font-size="15" text-anchor="middle" fill="#8A6242" font-weight="700" font-family="-apple-system,Segoe UI,sans-serif">¥</text>',
    kanji: { chars: '安', hun: '편안 안(安)', on: 'アン', kun: 'やす(い)', tip: '갓머리(宀) 아래 여자(女)가 편안히 쉬는 모양 → 값이 편안하다 = 싸다.' } },
  { id: 'oishii', cat: 'adj', orig: '美味しい', reading: 'おいしい', ko: '오이시이', romaji: 'oishii', mean: '맛있다', bg: '#FBE7D9', art:
    '<path d="M52 100h96c0 28-22 48-48 48s-48-20-48-48z" fill="#E9A88D"/><path d="M52 100h96" stroke="#fff" stroke-width="5" opacity=".8"/><path d="M80 76c-6-9 6-13 0-22M100 74c-6-9 6-13 0-22M120 76c-6-9 6-13 0-22" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="86" cy="118" rx="8" ry="5" fill="#fff"/><ellipse cx="110" cy="124" rx="7" ry="4" fill="#fff"/><path d="M62 156h76" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '美味', hun: '아름다울 미(美) · 맛 미(味)', on: 'ビ · ミ', kun: 'うつく(しい) · あじ', tip: '아름다운(美) 맛(味). 美味しい는 일상에서 おいしい로 더 많이 읽어요.' } },
  { id: 'chikai', cat: 'adj', orig: '近い', reading: 'ちかい', ko: '치카이', romaji: 'chikai', mean: '가깝다', bg: '#E2EDF6', art:
    '<path d="M78 56c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34c0-11-9-20-20-20z" fill="#E58A76"/><circle cx="78" cy="76" r="7" fill="#fff"/><path d="M122 72c-9 0-16 7-16 16 0 12 16 27 16 27s16-15 16-27c0-9-7-16-16-16z" fill="#7FA8C9"/><circle cx="122" cy="88" r="5" fill="#fff"/><path d="M78 128c16 6 30 6 44 0" stroke="#C9DED2" stroke-width="4" fill="none" stroke-linecap="round"/>',
    kanji: { chars: '近', hun: '가까울 근(近)', on: 'キン', kun: 'ちか(い)', tip: '책받침(辶) 위를 걸어가는 사람 옆에 도끼(斤) — 바로 가까운 거리.' } },
  { id: 'tooi', cat: 'adj', orig: '遠い', reading: 'とおい', ko: '토오이', romaji: 'tōi', mean: '멀다', bg: '#E9E4F4', art:
    '<path d="M52 62c-10 0-18 8-18 18 0 14 18 30 18 30s18-16 18-30c0-10-8-18-18-18z" fill="#E58A76"/><circle cx="52" cy="80" r="6" fill="#fff"/><path d="M148 84c-10 0-18 8-18 18 0 14 18 30 18 30s18-16 18-30c0-10-8-18-18-18z" fill="#7FA8C9"/><circle cx="148" cy="102" r="6" fill="#fff"/><path d="M74 108c14-12 38-16 56-6" stroke="#C9DED2" stroke-width="4" fill="none" stroke-dasharray="6 9" stroke-linecap="round"/>',
    kanji: { chars: '遠', hun: '멀 원(遠)', on: 'エン', kun: 'とお(い)', tip: '옷(袁)을 입고 책받침(辶)을 따라 먼 길을 떠나는 모양. 遠慮(えんりょ)는 사양.' } },
  { id: 'atsui', cat: 'adj', orig: '暑い', reading: 'あつい', ko: '아츠이', romaji: 'atsui', mean: '덥다', bg: '#FBE7D9', art:
    '<circle cx="92" cy="88" r="30" fill="#F2CE6B"/><path d="M92 46v-8M92 138v8M50 88h-8M142 88h-8M122 58l6-6M62 118l-6 6M122 118l6 6M62 58l-6 6" stroke="#E8A33D" stroke-width="5" stroke-linecap="round"/><path d="M148 54v56a11 11 0 1 1-7 0V54a3.5 3.5 0 0 1 7 0z" fill="#E58A76"/><circle cx="144.5" cy="116" r="7" fill="#fff" opacity=".7"/><path d="M42 150h112" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '暑', hun: '더울 서(暑)', on: 'ショ', kun: 'あつ(い)', tip: '해(日)가 내리쬐는 한여름. 덥다는 暑い, 뜨겁다는 熱い(あつい)예요.' } },
  { id: 'samui', cat: 'adj', orig: '寒い', reading: 'さむい', ko: '사무이', romaji: 'samui', mean: '춥다', bg: '#E2EDF6', art:
    '<path d="M100 44v112M58 72l84 56M142 72l-84 56" stroke="#7FA8C9" stroke-width="7" stroke-linecap="round"/><path d="M100 62l-10-10M100 62l10-10M100 138l-10 10M100 138l10 10M72 86l-12-4M72 114l-12 4M128 86l12-4M128 114l12 4" stroke="#7FA8C9" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="10" fill="#fff"/><circle cx="100" cy="100" r="4" fill="#9DC3AA"/>',
    kanji: { chars: '寒', hun: '찰 한(寒)', on: 'カン', kun: 'さむ(い)', tip: '갓머리(宀) 아래 이수변(冫)이 있는 모양. 寒い = さむい.' } },
  { id: 'kirei', cat: 'adj', orig: 'きれい', reading: 'きれい', ko: '키레이', romaji: 'kirei', mean: '예쁘다 · 깨끗하다', bg: '#F9E3E7', art:
    '<circle cx="100" cy="78" r="14" fill="#F2CE6B"/><circle cx="76" cy="98" r="14" fill="#F6D3BC"/><circle cx="124" cy="98" r="14" fill="#F6D3BC"/><circle cx="86" cy="122" r="14" fill="#F6D3BC"/><circle cx="114" cy="122" r="14" fill="#F6D3BC"/><circle cx="100" cy="102" r="11" fill="#E58A76"/><path d="M100 138v26" stroke="#7FB392" stroke-width="6" stroke-linecap="round"/><path d="M100 150c-8 0-14-4-16-10M100 158c8 0 14-4 16-10" stroke="#7FB392" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M146 54l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2CE6B"/>',
    kanji: null },
  { id: 'benri', cat: 'adj', orig: '便利', reading: 'べんり', ko: '벤리', romaji: 'benri', mean: '편리하다', bg: '#E2EFE6', art:
    '<circle cx="96" cy="98" r="30" fill="#9DC3AA"/><circle cx="96" cy="98" r="12" fill="#fff"/><path d="M96 58v-10M96 148v-10M56 98h-10M146 98h-10M68 70l-7-7M124 70l7-7M68 126l-7 7M124 126l7 7" stroke="#7FB392" stroke-width="7" stroke-linecap="round"/><path d="M138 138l8 8 16-20" stroke="#E58A76" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    kanji: { chars: '便利', hun: '편할 편(便) · 이로울 리(利)', on: 'ベン · リ', kun: '—', tip: '사람인변(亻)에 이로움(利)이 붙은 글자 → 편리함. 便利ですね = 편리하네요.' } },
  { id: 'genki', cat: 'adj', orig: '元気', reading: 'げんき', ko: '겐키', romaji: 'genki', mean: '건강하다 · 기운차다', bg: '#FBF1CE', art:
    '<circle cx="70" cy="122" r="18" fill="#F2C6A0"/><path d="M70 104c0-30 16-46 40-46 16 0 26 10 26 24 0 12-10 20-22 20h-10" fill="none" stroke="#F2C6A0" stroke-width="16" stroke-linecap="round"/><path d="M132 56l-14 26h16l-10 24" stroke="#F2CE6B" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M54 156h92" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>',
    kanji: { chars: '元気', hun: '으뜸 원(元) · 기운 기(気)', on: 'ゲン · キ', kun: '—', tip: '근본(元)이 되는 기운(気). お元気ですか? = 잘 지내세요?' } }
];
