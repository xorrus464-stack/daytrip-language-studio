/* ============================================================
   가나 데이터 — 히라가나 46자 (연상 그림 포함)
   ============================================================ */
var KANA_HIRA = [
  { ch: 'あ', ro: 'a', ko: '아', row: 'あ행', story: '사과에 칼을 콕! 놀라서 "아!"', art:
    '<circle cx="58" cy="136" r="30" fill="#E98B74"/><path d="M58 106c0-7 3-12 8-16" stroke="#8A6242" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M66 110c8-9 19-10 25-4-7 8-18 10-25 4z" fill="#7FB68F"/><path d="M104 52l40 88" stroke="#A4835C" stroke-width="7" stroke-linecap="round"/><path d="M104 52l-12-6" stroke="#A4835C" stroke-width="7" stroke-linecap="round"/><circle cx="44" cy="126" r="5" fill="#fff" opacity=".5"/>' },
  { ch: 'い', ro: 'i', ko: '이', row: 'あ행', story: '나란히 선 두 사람, 키가 달라요. "이~"', art:
    '<circle cx="74" cy="62" r="13" fill="#F2C6A0"/><path d="M74 76v56" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M74 96l-13 20" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><circle cx="126" cy="74" r="11" fill="#F2C6A0"/><path d="M126 86v36" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><path d="M126 100l-11 16" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/>' },
  { ch: 'う', ro: 'u', ko: '우', row: 'あ행', story: '모자 쓴 얼굴이 입을 쭉 내밀어 "우"', art:
    '<path d="M70 48h56" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M104 56c-16 4-22 14-18 24" stroke="#1B4D3E" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="102" cy="100" rx="17" ry="21" fill="#F2C6A0"/><ellipse cx="102" cy="106" rx="7" ry="9" fill="#C9785F"/><circle cx="112" cy="84" r="3.4" fill="#3E4C43"/>' },
  { ch: 'え', ro: 'e', ko: '에', row: 'あ행', story: '두 팔 벌리고 "에너지!" 춤추는 사람', art:
    '<circle cx="96" cy="58" r="14" fill="#F2C6A0"/><path d="M96 72v36" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><path d="M96 82L72 70M96 82l24-12" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M96 108l-16 30M96 108l16 30" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M138 44l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2CE6B"/>' },
  { ch: 'お', ro: 'o', ko: '오', row: 'あ행', story: '볼이 통통한 사람이 "오!" 하고 감탄해요', art:
    '<circle cx="94" cy="104" r="34" fill="#F2C6A0"/><circle cx="116" cy="116" r="13" fill="#EE9F8B"/><path d="M52 52h46" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M94 60c-14 6-18 16-14 26" stroke="#1B4D3E" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="82" cy="98" r="3.5" fill="#3E4C43"/><circle cx="104" cy="98" r="3.5" fill="#3E4C43"/><path d="M86 116c5 5 12 5 17 0" stroke="#3E4C43" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { ch: 'か', ro: 'ka', ko: '카', row: 'か행', story: '부리에 힘을 준 새가 "카" 하고 물어요', art:
    '<circle cx="82" cy="86" r="27" fill="#8FBE9E"/><path d="M108 86l30 12-30 12z" fill="#F2B33D"/><circle cx="90" cy="78" r="3.6" fill="#1B4D3E"/><path d="M72 112c-10 12-12 24-6 34" stroke="#7FA8C9" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M124 48l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#F2CE6B"/>' },
  { ch: 'き', ro: 'ki', ko: '키', row: 'か행', story: '노트에 두 줄, "키" 하고 줄을 그어요', art:
    '<rect x="56" y="86" width="90" height="62" rx="11" fill="#fff" stroke="#1B4D3E" stroke-width="3.5"/><path d="M72 104h58M72 124h58" stroke="#9DBFA9" stroke-width="5" stroke-linecap="round"/><path d="M62 62h78M62 78h78" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/>' },
  { ch: 'く', ro: 'ku', ko: '쿠', row: 'か행', story: '뾰족한 부리를 옆으로, "쿠"', art:
    '<path d="M124 58L78 96l46 38" stroke="#1B4D3E" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="148" r="13" fill="#F2B33D"/><path d="M60 135c4-6 10-8 16-6" stroke="#C98A6C" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="56" cy="144" r="2.6" fill="#3E4C43"/>' },
  { ch: 'け', ro: 'ke', ko: '케', row: 'か행', story: '깃대에 깃발을 단 모습, "케"', art:
    '<path d="M64 52v96" stroke="#8A6242" stroke-width="8" stroke-linecap="round"/><path d="M64 62h46l-11 17 11 17H64z" fill="#8FBE9E"/><path d="M126 92h22" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M126 100v44" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/>' },
  { ch: 'こ', ro: 'ko', ko: '코', row: 'か행', story: '위아래로 굽은 두 길, "코"', art:
    '<path d="M58 66c34-18 66-18 84 0" stroke="#D9A94E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M58 132c34-18 66-18 84 0" stroke="#D9A94E" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="140" cy="106" r="9" fill="#E98B74"/>' },
  { ch: 'さ', ro: 'sa', ko: '사', row: 'さ행', story: '낚싯대를 드리우고 "사" 하고 기다려요', art:
    '<path d="M56 46c38 12 54 48 46 96" stroke="#8A6242" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M102 142c-8-8-8-18 0-26" stroke="#9AA7B5" stroke-width="3" fill="none"/><ellipse cx="130" cy="146" rx="22" ry="12" fill="#7FA8C9"/><path d="M152 146l14-9v18z" fill="#7FA8C9"/><circle cx="122" cy="142" r="2.6" fill="#fff"/>' },
  { ch: 'し', ro: 'shi', ko: '시', row: 'さ행', story: '미끄럼틀을 타고 "시~" 내려와요', art:
    '<path d="M108 50c0 46-20 78-50 94" stroke="#E58A76" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="100" cy="64" r="12" fill="#F2C6A0"/><path d="M58 146c8-6 18-6 26 0" stroke="#9DC3AA" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'す', ro: 'su', ko: '스', row: 'さ행', story: '바늘에 실을 꿰어 "스"', art:
    '<path d="M100 36v128" stroke="#9AA7B5" stroke-width="6" stroke-linecap="round"/><path d="M74 54h52" stroke="#9AA7B5" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="106" r="24" fill="none" stroke="#E58A76" stroke-width="6"/><path d="M124 106c16 10 16 28 0 38" stroke="#E58A76" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'せ', ro: 'se', ko: '세', row: 'さ행', story: '세 사람이 손을 잡고 "세"', art:
    '<circle cx="62" cy="76" r="11" fill="#F2C6A0"/><circle cx="100" cy="66" r="11" fill="#F2C6A0"/><circle cx="138" cy="76" r="11" fill="#F2C6A0"/><path d="M62 87v34M100 77v42M138 87v34" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M62 104h76" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M62 121l-8 16M138 121l8 16" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/>' },
  { ch: 'そ', ro: 'so', ko: '소', row: 'さ행', story: '지그재그로 지나가는 뱀, "소~"', art:
    '<path d="M58 54h60L76 88h50l-46 48" stroke="#7FB392" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="82" cy="134" r="4" fill="#1B4D3E"/><path d="M76 138l-10 8 12 2" stroke="#E98B74" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { ch: 'た', ro: 'ta', ko: '타', row: 'た행', story: '지붕 아래 사람이 앉아 있어요, "타"', art:
    '<path d="M52 64L96 40l44 24" stroke="#B4703C" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="84" cy="106" r="13" fill="#F2C6A0"/><path d="M84 120v28h28" stroke="#1B4D3E" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M126 92h18" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/>' },
  { ch: 'ち', ro: 'chi', ko: '치', row: 'た행', story: '깃발이 펄럭펄럭, "치"', art:
    '<path d="M60 50h56" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M100 52v58c0 20-12 32-30 34" stroke="#1B4D3E" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M128 58l16 22-18 14" stroke="#F2B33D" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
  { ch: 'つ', ro: 'tsu', ko: '츠', row: 'た행', story: '둥글게 감긴 파도, "츠"', art:
    '<path d="M62 60c50-12 82 8 82 34 0 24-22 38-46 32" stroke="#7FA8C9" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="150" cy="108" r="5" fill="#fff" opacity=".75"/><path d="M52 132c14 8 28 10 42 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'て', ro: 'te', ko: '테', row: 'た행', story: '팔을 쭉 뻗은 손, "테"', art:
    '<path d="M56 70c32-16 66-16 86 2" stroke="#F2C6A0" stroke-width="15" stroke-linecap="round"/><path d="M106 80c0 32-7 54-20 70" stroke="#F2C6A0" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M78 64c10-6 20-8 30-8" stroke="#E9A88D" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  { ch: 'と', ro: 'to', ko: '토', row: 'た행', story: '갈고리에 열매가 매달렸어요, "토"', art:
    '<path d="M74 58c28 8 32 32 22 52-6 12-4 22 8 30" stroke="#8A6242" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="128" cy="70" r="15" fill="#E98B74"/><path d="M128 55c2-7 7-10 13-11" stroke="#7FB68F" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="123" cy="66" r="3" fill="#fff" opacity=".6"/>' },
  { ch: 'な', ro: 'na', ko: '나', row: 'な행', story: '십자에 날개를 단 나비, "나"', art:
    '<path d="M62 96h76M100 54v92" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><ellipse cx="74" cy="74" rx="21" ry="14" fill="#E9A88D" transform="rotate(-22 74 74)"/><ellipse cx="126" cy="74" rx="21" ry="14" fill="#E9A88D" transform="rotate(22 126 74)"/><path d="M100 54c-4-10 1-17 9-19" stroke="#1B4D3E" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="100" cy="98" r="14" fill="none" stroke="#F2CE6B" stroke-width="6"/>' },
  { ch: 'に', ro: 'ni', ko: '니', row: 'な행', story: '두 사람이 나란히, "니"', art:
    '<circle cx="72" cy="70" r="13" fill="#F2C6A0"/><path d="M72 84v46" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><circle cx="130" cy="80" r="12" fill="#F2C6A0"/><path d="M130 92v38" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><path d="M112 108h38" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/>' },
  { ch: 'ぬ', ro: 'nu', ko: '누', row: 'な행', story: '실뭉치가 동그랗게 말려 있어요, "누"', art:
    '<circle cx="112" cy="116" r="31" fill="#F6D3BC"/><path d="M88 100c16 6 30 18 36 34M92 130c14-2 28 2 36 8" stroke="#C98A6C" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M84 92c-10 8-14 20-12 32" stroke="#C98A6C" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M72 128c-14 6-20 16-16 26" stroke="#C98A6C" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'ね', ro: 'ne', ko: '네', row: 'な행', story: '꼬리를 동그랗게 말은 고양이, "네"', art:
    '<circle cx="86" cy="96" r="27" fill="#F2C6A0"/><path d="M74 74l-5-18 18 9M100 74l5-18-18 9" fill="#F2C6A0"/><circle cx="78" cy="94" r="3.2" fill="#3E4C43"/><circle cx="96" cy="94" r="3.2" fill="#3E4C43"/><path d="M86 104l-4 6h8z" fill="#E98B74"/><path d="M112 108c26 2 32 24 22 42" stroke="#F2C6A0" stroke-width="9" fill="none" stroke-linecap="round"/>' },
  { ch: 'の', ro: 'no', ko: '노', row: 'な행', story: '한 붓으로 그린 소용돌이, "노"', art:
    '<path d="M124 60c-32-6-60 14-60 42 0 30 32 46 56 30 18-12 16-36-4-42-16-5-28 8-24 20" stroke="#7FB392" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="150" cy="140" r="5" fill="#F2CE6B"/>' },
  { ch: 'は', ro: 'ha', ko: '하', row: 'は행', story: '하마처럼 입을 크게 벌려 "하"', art:
    '<circle cx="84" cy="88" r="27" fill="#F2C6A0"/><circle cx="76" cy="82" r="3" fill="#3E4C43"/><circle cx="92" cy="82" r="3" fill="#3E4C43"/><ellipse cx="84" cy="100" rx="12" ry="9" fill="#C9785F"/><path d="M126 56v84M126 96h22" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M126 124h16" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/>' },
  { ch: 'ひ', ro: 'hi', ko: '히', row: 'は행', story: '히죽 웃는 입 모양, "히"', art:
    '<path d="M54 92c28-28 58-28 86 0" stroke="#E9A88D" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="76" cy="124" r="6" fill="#1B4D3E"/><path d="M102 114c12 9 25 8 35-1" stroke="#1B4D3E" stroke-width="6" fill="none" stroke-linecap="round"/>' },
  { ch: 'ふ', ro: 'fu', ko: '후', row: 'は행', story: '후~ 하고 바람을 불어요, "후"', art:
    '<circle cx="78" cy="102" r="23" fill="#F2C6A0"/><circle cx="70" cy="98" r="2.6" fill="#3E4C43"/><circle cx="84" cy="98" r="2.6" fill="#3E4C43"/><ellipse cx="90" cy="110" rx="5" ry="4.5" fill="#C9785F"/><path d="M106 106c22-4 36-16 42-32M108 118c20 0 32 6 40 16" stroke="#9DC3AA" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'へ', ro: 'he', ko: '헤', row: 'は행', story: '낮은 산 하나, "헤"', art:
    '<path d="M46 120l50-42 58 42" stroke="#8FBE9E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="146" cy="66" r="13" fill="#F2CE6B"/><path d="M52 140h96" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>' },
  { ch: 'ほ', ro: 'ho', ko: '호', row: 'は행', story: '기둥에 사람이 기대어 "호"', art:
    '<path d="M126 52v92" stroke="#8A6242" stroke-width="8" stroke-linecap="round"/><path d="M112 70h34M112 86h34" stroke="#8A6242" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="90" r="25" fill="#F2C6A0"/><circle cx="72" cy="84" r="3" fill="#3E4C43"/><circle cx="88" cy="84" r="3" fill="#3E4C43"/><path d="M70 100c7 7 17 7 24 0" stroke="#3E4C43" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { ch: 'ま', ro: 'ma', ko: '마', row: 'ま행', story: '실을 감은 실패, "마"', art:
    '<ellipse cx="100" cy="66" rx="36" ry="13" fill="#E9A88D"/><ellipse cx="100" cy="134" rx="36" ry="13" fill="#E9A88D"/><path d="M66 74c0 18 0 40 0 48M134 74c0 18 0 40 0 48" stroke="#C98A6C" stroke-width="5" fill="none"/><path d="M74 90h52M74 104h52M74 118h52" stroke="#F6D3BC" stroke-width="7" stroke-linecap="round"/>' },
  { ch: 'み', ro: 'mi', ko: '미', row: 'ま행', story: '물결에 비친 모습, "미"', art:
    '<path d="M50 66c14-11 28-11 42 0s28 11 42 0" stroke="#7FA8C9" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M50 90c14-11 28-11 42 0s28 11 42 0" stroke="#9DC3AA" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="126" cy="128" r="19" fill="#F6D3BC"/><path d="M112 122c10-5 18-5 28 0" stroke="#C98A6C" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M100 148c14 6 30 6 44 0" stroke="#7FA8C9" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  { ch: 'む', ro: 'mu', ko: '무', row: 'ま행', story: '뿔을 세운 소가 "무"', art:
    '<ellipse cx="96" cy="112" rx="30" ry="27" fill="#F2C6A0"/><path d="M74 88c-8-10-8-20-2-26M118 88c8-10 8-20 2-26" stroke="#8A6242" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="86" cy="108" r="3.4" fill="#3E4C43"/><circle cx="106" cy="108" r="3.4" fill="#3E4C43"/><ellipse cx="96" cy="124" rx="9" ry="6" fill="#E9A88D"/><path d="M96 60c0-11 10-17 19-12" stroke="#1B4D3E" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'め', ro: 'me', ko: '메', row: 'ま행', story: '동그란 눈을 크게 뜨고 "메"', art:
    '<path d="M50 90c24-28 60-28 84 0-24 28-60 28-84 0z" fill="#fff" stroke="#1B4D3E" stroke-width="4"/><circle cx="92" cy="90" r="13" fill="#3E4C43"/><circle cx="97" cy="85" r="4.5" fill="#fff"/><path d="M132 106c15 13 19 27 13 40" stroke="#1B4D3E" stroke-width="6" fill="none" stroke-linecap="round"/>' },
  { ch: 'も', ro: 'mo', ko: '모', row: 'ま행', story: '갈고리 두 개, 물고기 뼈 "모"', art:
    '<path d="M100 54v94" stroke="#9AA7B5" stroke-width="7" stroke-linecap="round"/><path d="M64 82c22-13 46-13 68 0M64 118c22-13 46-13 68 0" stroke="#7FA8C9" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="132" cy="146" r="5" fill="#F2CE6B"/>' },
  { ch: 'や', ro: 'ya', ko: '야', row: 'や행', story: '손을 흔들며 "야!"', art:
    '<circle cx="88" cy="72" r="14" fill="#F2C6A0"/><path d="M88 86v40" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><path d="M88 96L62 78M88 96l26-20" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M88 126l-14 26M88 126l14 26" stroke="#1B4D3E" stroke-width="7" stroke-linecap="round"/><path d="M142 44l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2CE6B"/>' },
  { ch: 'ゆ', ro: 'yu', ko: '유', row: 'や행', story: '따뜻한 목욕물이 담긴 통, "유"', art:
    '<path d="M58 88h80v24c0 18-15 30-40 30s-40-12-40-30z" fill="#E9A88D"/><path d="M58 96h80" stroke="#fff" stroke-width="5" opacity=".45"/><path d="M118 78c9-11 21-13 29-6" stroke="#9DC3AA" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M82 74c6-8 6-14 0-20M100 76c6-8 6-14 0-20" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'よ', ro: 'yo', ko: '요', row: 'や행', story: '요요 줄이 팽팽, "요"', art:
    '<circle cx="102" cy="116" r="27" fill="#F2CE6B"/><circle cx="102" cy="116" r="10" fill="#E9A88D"/><path d="M102 89V56" stroke="#8A6242" stroke-width="5"/><path d="M102 56c0-13 12-19 23-13" stroke="#8A6242" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'ら', ro: 'ra', ko: '라', row: 'ら행', story: '물가에 앉은 오리, "라"', art:
    '<ellipse cx="94" cy="114" rx="34" ry="24" fill="#7FA8C9"/><circle cx="120" cy="86" r="16" fill="#7FA8C9"/><path d="M136 86l18 7-18 8z" fill="#F2B33D"/><circle cx="125" cy="83" r="2.8" fill="#fff"/><path d="M56 140c16-7 32-7 48 0" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M74 122c6 6 12 8 18 8" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/>' },
  { ch: 'り', ro: 'ri', ko: '리', row: 'ら행', story: '두 사람이 나란히 서 있어요, "리"', art:
    '<circle cx="80" cy="52" r="9" fill="#F2C6A0"/><path d="M80 62c-6 20-6 40 2 62" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="122" cy="66" r="9" fill="#F2C6A0"/><path d="M122 76v46" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/>' },
  { ch: 'る', ro: 'ru', ko: '루', row: 'ら행', story: '소용돌이 끝에 동그라미, "루"', art:
    '<path d="M58 58h60l-36 36h26c15 0 19 17 8 25-11 8-27 2-27-11" stroke="#E58A76" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="150" cy="146" r="5" fill="#F2CE6B"/>' },
  { ch: 'れ', ro: 're', ko: '레', row: 'ら행', story: '고양이 꼬리가 길게 말려요, "레"', art:
    '<path d="M82 54v40c0 16 8 24 20 24" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M112 58c-9 30-4 54 15 64 12 6 22 0 22-10" stroke="#F2C6A0" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="82" cy="48" r="8" fill="#F2C6A0"/>' },
  { ch: 'ろ', ro: 'ro', ko: '로', row: 'ら행', story: '동그라미를 뺀 소용돌이, "로"', art:
    '<path d="M58 58h58l-34 34h25c14 0 18 15 7 23-10 7-24 1-24-9" stroke="#7FA8C9" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 140c14 6 28 6 42 0" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'わ', ro: 'wa', ko: '와', row: 'わ행', story: '둥근 테두리를 그리며 "와"', art:
    '<circle cx="100" cy="104" r="33" fill="none" stroke="#7FB392" stroke-width="10"/><path d="M133 100c15 9 21 23 17 36" stroke="#7FB392" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="88" cy="96" r="4" fill="#fff" opacity=".7"/>' },
  { ch: 'を', ro: 'wo', ko: '오', row: 'わ행', story: '한 바퀴 돌며 춤추는 사람, "오"', art:
    '<circle cx="100" cy="58" r="13" fill="#F2C6A0"/><path d="M100 72v32" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><path d="M100 80L76 70M100 80l24-4" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/><path d="M100 104c-15 10-19 25-12 36 7 10 24 10 30 0" stroke="#1B4D3E" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M146 44l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2CE6B"/>' },
  { ch: 'ん', ro: 'n', ko: '응', row: 'わ행', story: '한 붓으로 꾹, 콧소리 "응"', art:
    '<path d="M62 58c0 36 17 56 40 62 13 4 22 12 22 24" stroke="#1B4D3E" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="136" cy="56" r="7" fill="#F2CE6B"/><path d="M56 132c10 8 22 10 34 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' }
];

var KANA_KATA = [
  { ch: 'ア', ro: 'a', ko: '아', row: 'ア행', story: '사과를 한 입 베어 문 모양, "아"', art:
    '<path d="M60 64h58" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M114 64v26" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M114 90c0 28-16 44-38 52" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="64" cy="140" r="17" fill="#E98B74"/><path d="M58 126c-1-6 2-10 6-12" stroke="#7FB68F" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  { ch: 'イ', ro: 'i', ko: '이', row: 'ア행', story: '기둥 옆에 사람 하나, "이"', art:
    '<path d="M72 60c-4 20-12 34-22 46" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M110 54v90" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><circle cx="110" cy="46" r="8" fill="#F2C6A0"/><path d="M90 132c8 6 18 8 28 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'ウ', ro: 'u', ko: '우', row: 'ア행', story: '모자를 눌러쓴 얼굴, "우"', art:
    '<path d="M100 40v12" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M62 68l38-16 38 16" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 68v42h76V68" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linejoin="round"/><circle cx="86" cy="92" r="3.4" fill="#3E4C43"/><circle cx="114" cy="92" r="3.4" fill="#3E4C43"/><path d="M94 102c4 3 8 3 12 0" stroke="#3E4C43" stroke-width="3" fill="none" stroke-linecap="round"/>' },
  { ch: 'エ', ro: 'e', ko: '에', row: 'ア행', story: '공사장의 工자 기둥, "에"', art:
    '<path d="M60 66h80M60 132h80M100 66v66" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M60 66h80" stroke="#F2CE6B" stroke-width="4" opacity=".75"/><path d="M50 148c14 6 28 6 42 0" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'オ', ro: 'o', ko: '오', row: 'ア행', story: '팔을 쫙 벌린 사람, "오"', art:
    '<path d="M58 66h76" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M98 66v74" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M98 98l24-30M98 98L74 68" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><circle cx="98" cy="150" r="7" fill="#F2C6A0"/>' },
  { ch: 'カ', ro: 'ka', ko: '카', row: 'カ행', story: '갈고리로 무언가를 당겨요, "카"', art:
    '<path d="M60 68h48v34c0 24-14 38-30 42" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M78 58c-6 18-14 32-24 44" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="132" cy="128" r="14" fill="#F2CE6B"/>' },
  { ch: 'キ', ro: 'ki', ko: '키', row: 'カ행', story: '열쇠의 이빨 두 개, "키"', art:
    '<path d="M62 78h74M62 104h74" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M98 54v84" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><circle cx="140" cy="91" r="7" fill="none" stroke="#D9A94E" stroke-width="4"/><path d="M62 78h74" stroke="#D9A94E" stroke-width="3" opacity=".55"/>' },
  { ch: 'ク', ro: 'ku', ko: '쿠', row: 'カ행', story: '새의 뾰족한 부리, "쿠"', art:
    '<path d="M94 50c-6 16-14 28-26 38" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M64 86h56l-8 40c-2 13-11 20-22 22" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="74" cy="74" r="3.4" fill="#3E4C43"/>' },
  { ch: 'ケ', ro: 'ke', ko: '케', row: 'カ행', story: '하늘에 뜬 연, "케"', art:
    '<path d="M90 48c-8 18-16 30-28 42" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M60 82h62" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M106 82v44c0 13-6 21-16 25" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M128 52l16 14-16 14z" fill="#E58A76"/>' },
  { ch: 'コ', ro: 'ko', ko: '코', row: 'カ행', story: '상자의 모서리, "코"', art:
    '<path d="M60 68h68v50H60" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="60" y="68" width="68" height="50" fill="#F2CE6B" opacity=".18"/><circle cx="132" cy="130" r="12" fill="#E9A88D"/>' },
  { ch: 'サ', ro: 'sa', ko: '사', row: 'サ행', story: '풀잎 세 갈래, "사"', art:
    '<path d="M76 56v58M124 56v58" stroke="#7FB392" stroke-width="9" stroke-linecap="round"/><path d="M56 94h86" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M56 94c-8 12-12 24-12 36" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="76" cy="50" r="5" fill="#F2CE6B"/><circle cx="124" cy="50" r="5" fill="#F2CE6B"/>' },
  { ch: 'シ', ro: 'shi', ko: '시', row: 'サ행', story: '눈물 세 방울이 뚝뚝, "시"', art:
    '<circle cx="74" cy="62" r="7" fill="#7FA8C9"/><circle cx="74" cy="88" r="7" fill="#7FA8C9"/><path d="M76 56l24 18" stroke="#7FA8C9" stroke-width="8" stroke-linecap="round"/><path d="M58 122c16 16 38 22 60 16 10-2 16-8 18-16" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/>' },
  { ch: 'ス', ro: 'su', ko: '스', row: 'サ행', story: '그네를 타고 "스~"', art:
    '<path d="M64 64h48l-30 34h36" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M106 98c-2 22-14 38-30 46" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M108 140h34" stroke="#8A6242" stroke-width="5" stroke-linecap="round"/><path d="M116 140v-14M134 140v-14" stroke="#8A6242" stroke-width="4"/>' },
  { ch: 'セ', ro: 'se', ko: '세', row: 'サ행', story: '사람 위에 십자 표시, "세"', art:
    '<path d="M58 74h46M82 54v76" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M108 74c11 0 17 8 17 20v36" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="82" cy="48" r="6" fill="#F2C6A0"/>' },
  { ch: 'ソ', ro: 'so', ko: '소', row: 'サ행', story: '물방울 두 개가 떨어져요, "소"', art:
    '<circle cx="70" cy="62" r="7" fill="#7FA8C9"/><circle cx="100" cy="74" r="7" fill="#7FA8C9"/><path d="M60 104c18 20 40 26 62 20" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="140" cy="132" r="10" fill="#9DC3AA" opacity=".6"/>' },
  { ch: 'タ', ro: 'ta', ko: '타', row: 'タ행', story: '해가 지는 저녁 하늘, "타"', art:
    '<path d="M90 48c-8 18-16 30-28 40" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M58 82h64" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M102 82c0 30-10 48-28 56" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="146" cy="50" r="15" fill="#F2CE6B"/><path d="M46 140h108" stroke="#E7CDB1" stroke-width="5" stroke-linecap="round"/>' },
  { ch: 'チ', ro: 'chi', ko: '치', row: 'タ행', story: '야자수 한 그루, "치"', art:
    '<path d="M58 64h72M58 92h72" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M94 64v52c0 16-8 26-22 30" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M140 64c-8-10-18-14-28-12M140 64c8-8 18-8 26-2" stroke="#7FB392" stroke-width="6" fill="none" stroke-linecap="round"/>' },
  { ch: 'ツ', ro: 'tsu', ko: '츠', row: 'タ행', story: '파도 두 개가 밀려와요, "츠"', art:
    '<circle cx="72" cy="56" r="7" fill="#7FA8C9"/><circle cx="100" cy="50" r="7" fill="#7FA8C9"/><path d="M56 84c14 22 38 30 64 24" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M56 84c-4 16-6 30-4 42" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M50 142c16 8 32 10 48 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'テ', ro: 'te', ko: '테', row: 'タ행', story: 'T자 기둥, "테"', art:
    '<path d="M62 62h72M62 86h72" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M98 86v52c0 9 5 14 14 14" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M62 62h72" stroke="#F2CE6B" stroke-width="4" opacity=".7"/>' },
  { ch: 'ト', ro: 'to', ko: '토', row: 'タ행', story: '나무에 가지 하나, "토"', art:
    '<path d="M86 52v96" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M86 96l36-32" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M86 140c12-6 24-6 36 0" stroke="#7FB392" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'ナ', ro: 'na', ko: '나', row: 'タ행', story: '나이프 하나, "나"', art:
    '<path d="M58 74h82" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M100 54v58" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M100 112c-8 14-19 24-34 30" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/>' },
  { ch: 'ニ', ro: 'ni', ko: '니', row: 'タ행', story: '젓가락 두 개, "니"', art:
    '<path d="M60 74h80M60 118h80" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M60 74v-6M140 74v-6M60 118v6M140 118v6" stroke="#8A6242" stroke-width="3" stroke-linecap="round"/><circle cx="146" cy="96" r="9" fill="#E9A88D" opacity=".7"/>' },
  { ch: 'ヌ', ro: 'nu', ko: '누', row: 'タ행', story: '국수가 엇갈려요, "누"', art:
    '<path d="M62 64h46l-28 32h36" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M98 96L62 142" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M104 142c14-6 28-6 42 0" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'ネ', ro: 'ne', ko: '네', row: 'タ행', story: '신사 앞 도리이, "네"', art:
    '<path d="M94 44v16" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/><path d="M56 72h88M68 72v64M132 72v64" stroke="#C97F4E" stroke-width="9" stroke-linecap="round"/><path d="M52 98h96" stroke="#C97F4E" stroke-width="8" stroke-linecap="round"/><path d="M96 98v38" stroke="#C97F4E" stroke-width="6" stroke-linecap="round"/>' },
  { ch: 'ノ', ro: 'no', ko: '노', row: 'タ행', story: '바람이 사선으로, "노"', art:
    '<path d="M126 50c-14 36-31 58-52 70" stroke="#1B4D3E" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M52 138c16 8 32 10 48 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="146" cy="40" r="6" fill="#F2CE6B"/>' },
  { ch: 'ハ', ro: 'ha', ko: '하', row: 'ハ행', story: '두 날개를 편 새, "하"', art:
    '<path d="M70 66c-6 26-15 46-28 58" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M126 58c5 26 13 48 26 62" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M96 96c4 10 4 18 0 26" stroke="#8FBE9E" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  { ch: 'ヒ', ro: 'hi', ko: '히', row: 'ハ행', story: '갈고리 하나, "히"', art:
    '<path d="M68 66v48" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M68 92h42c15 0 24 9 24 22" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="68" cy="58" r="6" fill="#F2C6A0"/>' },
  { ch: 'フ', ro: 'fu', ko: '후', row: 'ハ행', story: '밀려오는 파도, "후"', art:
    '<path d="M60 66h70l-9 36c-3 14-14 23-30 27" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 130c16 9 34 11 52 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'ヘ', ro: 'he', ko: '헤', row: 'ハ행', story: '낮은 언덕 하나, "헤"', art:
    '<path d="M56 108l42-38 48 38" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="148" cy="56" r="13" fill="#F2CE6B"/><path d="M48 136h104" stroke="#D9C9AE" stroke-width="5" stroke-linecap="round"/>' },
  { ch: 'ホ', ro: 'ho', ko: '호', row: 'ハ행', story: '십자에 날개, "호"', art:
    '<path d="M58 72h84" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M100 54v88" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M100 98L72 132M100 98l28 34" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/>' },
  { ch: 'マ', ro: 'ma', ko: '마', row: 'マ행', story: '콧수염, "마"', art:
    '<path d="M60 70h68l-30 34" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M104 104c-4 12-11 21-20 27" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M128 128c-8 6-16 8-24 8M128 128c8 6 16 8 24 8" stroke="#8A6242" stroke-width="4" fill="none" stroke-linecap="round"/>' },
  { ch: 'ミ', ro: 'mi', ko: '미', row: 'マ행', story: '세 줄 사선, "미"', art:
    '<path d="M64 64l28 14M64 92l34 17M64 120l38 19" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M132 54l10 10" stroke="#F2CE6B" stroke-width="6" stroke-linecap="round"/>' },
  { ch: 'ム', ro: 'mu', ko: '무', row: 'マ행', story: '벌린 입, "무"', art:
    '<path d="M70 58c-7 26-9 48-4 64h62" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 104l20-22" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><circle cx="128" cy="118" r="9" fill="#E9A88D" opacity=".55"/>' },
  { ch: 'メ', ro: 'me', ko: '메', row: 'マ행', story: '엑스 표시, "메"', art:
    '<path d="M62 60c19 15 34 36 42 66" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M130 68c-17 21-34 36-53 45" stroke="#E58A76" stroke-width="10" fill="none" stroke-linecap="round"/>' },
  { ch: 'モ', ro: 'mo', ko: '모', row: 'マ행', story: '물고기와 갈고리, "모"', art:
    '<path d="M60 68h76M60 96h76" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M100 68v54c0 14 8 22 22 22" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M60 138c18 7 36 7 54 0" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'ヤ', ro: 'ya', ko: '야', row: 'ヤ행', story: '손을 든 모양, "야"', art:
    '<path d="M58 76h48c0 20-7 35-20 44" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M100 58v86" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M100 58l-16 18" stroke="#1B4D3E" stroke-width="8" stroke-linecap="round"/>' },
  { ch: 'ユ', ro: 'yu', ko: '유', row: 'ヤ행', story: 'U자 통, "유"', art:
    '<path d="M60 66h66v46H60" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 114h70" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M74 66v30" stroke="#9DC3AA" stroke-width="4" opacity=".7"/>' },
  { ch: 'ヨ', ro: 'yo', ko: '요', row: 'ヤ행', story: '빗살 세 줄, "요"', art:
    '<path d="M66 62v72M66 62h62M66 98h62M66 134h62" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M66 62v72" stroke="#8A6242" stroke-width="3" opacity=".6"/>' },
  { ch: 'ラ', ro: 'ra', ko: '라', row: 'ラ행', story: '모자 위에 장식, "라"', art:
    '<path d="M60 64h74" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M70 86h52" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><path d="M96 106c0 15-6 26-17 33" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="142" cy="48" r="7" fill="#F2CE6B"/>' },
  { ch: 'リ', ro: 'ri', ko: '리', row: 'ラ행', story: '두 사람 중 한 명은 길쭉, "리"', art:
    '<path d="M76 60v46" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M118 60c0 36-4 58-13 74" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="76" cy="52" r="7" fill="#F2C6A0"/><circle cx="118" cy="52" r="7" fill="#F2C6A0"/>' },
  { ch: 'ル', ro: 'ru', ko: '루', row: 'ラ행', story: '두 다리로 서 있어요, "루"', art:
    '<path d="M74 66c-4 26-4 47 3 61" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M114 66v40c0 15 8 24 22 26" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M66 138c10 5 22 5 32 0" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>' },
  { ch: 'レ', ro: 're', ko: '레', row: 'ラ행', story: '체크 표시처럼, "레"', art:
    '<path d="M70 60v54c0 15 9 22 22 22" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M92 136l32-28" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/>' },
  { ch: 'ロ', ro: 'ro', ko: '로', row: 'ラ행', story: '네모난 입, "로"', art:
    '<rect x="66" y="58" width="68" height="82" rx="4" fill="none" stroke="#1B4D3E" stroke-width="10"/><rect x="66" y="58" width="68" height="82" rx="4" fill="#F2CE6B" opacity=".16"/>' },
  { ch: 'ワ', ro: 'wa', ko: '와', row: 'ワ행', story: '크게 벌린 입, "와"', art:
    '<path d="M58 66h78l-9 34c-4 21-17 32-32 34" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M58 66c-2 8-5 13-9 17" stroke="#1B4D3E" stroke-width="9" fill="none" stroke-linecap="round"/>' },
  { ch: 'ヲ', ro: 'wo', ko: '오', row: 'ワ행', story: '사람이 서 있어요, "오"', art:
    '<path d="M58 68h74M58 96h58" stroke="#1B4D3E" stroke-width="10" stroke-linecap="round"/><path d="M90 96v40c0 11 6 17 17 17" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="90" cy="88" r="6" fill="#F2C6A0"/>' },
  { ch: 'ン', ro: 'n', ko: '응', row: 'ワ행', story: '한 획 미끄러지듯, "응"', art:
    '<path d="M112 58l-16 12" stroke="#1B4D3E" stroke-width="9" stroke-linecap="round"/><circle cx="74" cy="70" r="7" fill="#7FA8C9"/><path d="M62 118c18 18 38 24 58 17" stroke="#1B4D3E" stroke-width="10" fill="none" stroke-linecap="round"/>' }
];
