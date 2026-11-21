/* ============================================================
   오늘의 Q&A 세트 — 상대의 질문(Q)과 내 대답(A)을 한 세트로 익히기
   scene: EN_SCENES 의 장면 키 (data-english.js)
   ============================================================ */

var QA_EN = [
  {
    id: 'cafe-order', place: '카페', scene: 'cafe', bg: '#FBEADB', title: '주문하고 받기',
    q: { text: 'Hi! What can I get for you?', ko: '안녕하세요! 뭐 드릴까요?', pron: '하이! 왓 캔 아이 겟 포 유' },
    a: { text: 'An iced americano, please.', ko: '아이스 아메리카노 한 잔 주세요.', pron: '언 아이스드 아메리카노, 플리즈' },
    tip: '“I’ll have ~”만 바꾸면 어떤 메뉴든 주문할 수 있어요.',
    swaps: [
      { from: 'iced americano', to: 'a latte', say: 'A latte, please.', ko: '라떼 한 잔 주세요.' },
      { from: 'a drink', to: 'two coffees', say: 'Two coffees, please.', ko: '커피 두 잔 주세요.' }
    ]
  },
  {
    id: 'food-order', place: '식당', scene: 'food', bg: '#E2EDF6', title: '메뉴 고르고 주문하기',
    q: { text: 'Are you ready to order?', ko: '주문하시겠어요?', pron: '아 유 레디 투 오더' },
    a: { text: 'Yes, I’ll have the pasta.', ko: '네, 파스타로 할게요.', pron: '예스, 아일 해브 더 파스타' },
    tip: '“I’ll have + 메뉴”가 가장 자연스러운 주문이에요. 물은 “Just water, please.”',
    swaps: [
      { from: 'the pasta', to: 'the steak', say: 'I’ll have the steak.', ko: '스테이크로 할게요.' },
      { from: 'I’ll have', to: 'Can I get', say: 'Can I get the soup?', ko: '수프로 주시겠어요?' }
    ]
  },
  {
    id: 'airport-checkin', place: '공항', scene: 'airport', bg: '#E3EBF6', title: '체크인 카운터에서',
    q: { text: 'May I see your passport?', ko: '여권 보여 주시겠어요?', pron: '메이 아이 씨 유어 패스포트' },
    a: { text: 'Here you go. I’m going to Tokyo.', ko: '여기요. 도쿄에 가요.', pron: '히어 유 고. 아임 고잉 투 도쿄' },
    tip: '“Here you go.”는 무엇이든 건넬 때 쓰는 만능 말이에요.',
    swaps: [
      { from: 'Tokyo', to: 'Osaka', say: 'I’m going to Osaka.', ko: '오사카에 가요.' },
      { from: 'Here you go.', to: 'Here it is.', say: 'Here it is.', ko: '여기 있습니다.' }
    ]
  },
  {
    id: 'hotel-checkin', place: '호텔', scene: 'hotel', bg: '#FBF1CE', title: '프런트에서 체크인',
    q: { text: 'Do you have a reservation?', ko: '예약하셨나요?', pron: '두 유 해브 어 레저베이션' },
    a: { text: 'Yes, under Kim.', ko: '네, 김으로 했어요.', pron: '예스, 언더 김' },
    tip: '예약자 이름은 “under + 이름”. 두 사람이면 “a room for two”를 붙여요.',
    swaps: [
      { from: 'Kim', to: 'Lee', say: 'Yes, under Lee.', ko: '네, 이로 했어요.' },
      { from: 'a reservation', to: 'a room for two', say: 'I’d like a room for two.', ko: '2인실 하나 부탁해요.' }
    ]
  }
];

var QA_JA = [
  {
    id: 'ja-cafe-order', place: '카페', scene: 'cafe', bg: '#FBEADB', title: '점원의 말에 대답하기',
    q: {
      orig: 'いらっしゃいませ。お決まりですか？', kana: 'いらっしゃいませ。おきまりですか？',
      ko: '이랏샤이마세. 오키마리데스카?', romaji: 'irasshaimase. okimari desu ka?', meaning: '어서 오세요. 주문하시겠어요?'
    },
    a: {
      orig: 'はい、これをお願いします。', kana: 'はい、これをおねがいします。',
      ko: '하이, 코레오 오네가이시마스', romaji: 'hai, kore o onegai shimasu', meaning: '네, 이걸로 부탁해요.'
    },
    tip: '물건을 가리키며 「これをお願いします」라고 하면 주문이 끝나요.',
    swaps: [
      { from: 'これ', to: 'それ', say: 'それをお願いします。', kana: 'それをおねがいします。', ko: '그걸로 부탁해요.' },
      { from: '하나', to: '두 개', say: 'これを二つお願いします。', kana: 'これをふたつおねがいします。', ko: '이거 두 개 부탁해요.' }
    ]
  },
  {
    id: 'ja-cafe-togo', place: '카페', scene: 'cafe', bg: '#E2EFE6', title: '포장인지 물어볼 때',
    q: {
      orig: '店内でお召し上がりですか？', kana: 'てんないでおめしあがりですか？',
      ko: '텐나이데 오메시아가리데스카?', romaji: 'tennai de omeshiagari desu ka?', meaning: '매장에서 드시나요?'
    },
    a: {
      orig: '持ち帰りでお願いします。', kana: 'もちかえりでおねがいします。',
      ko: '모치카에리데 오네가이시마스', romaji: 'mochikaeri de onegai shimasu', meaning: '포장으로 부탁해요.'
    },
    tip: '매장에서 먹으면 「店内で」, 포장은 「持ち帰りで」예요.',
    swaps: [
      { from: '持ち帰りで', to: '店内で', say: '店内でお願いします。', kana: 'てんないでおねがいします。', ko: '매장에서 먹을게요.' },
      { from: 'お願いします', to: 'ください', say: '持ち帰りでください。', kana: 'もちかえりでください。', ko: '포장으로 주세요.' }
    ]
  },
  {
    id: 'ja-food-order', place: '식당', scene: 'food', bg: '#E2EDF6', title: '음식 주문하기',
    q: {
      orig: 'ご注文はお決まりですか？', kana: 'ごちゅうもんはおきまりですか？',
      ko: '고추-몬와 오키마리데스카?', romaji: 'gochūmon wa okimari desu ka?', meaning: '주문하시겠어요?'
    },
    a: {
      orig: 'これを二つください。', kana: 'これをふたつください。',
      ko: '코레오 후타츠 쿠다사이', romaji: 'kore o futatsu kudasai', meaning: '이거 두 개 주세요.'
    },
    tip: '「ひとつ・ふたつ・みっつ」로 개수를 세요. 메뉴를 가리키며 말하면 통해요.',
    swaps: [
      { from: '二つ', to: '一つ', say: 'これを一つください。', kana: 'これをひとつください。', ko: '이거 하나 주세요.' },
      { from: 'これ', to: 'おすすめ', say: 'おすすめをください。', kana: 'おすすめをください。', ko: '추천 메뉴 주세요.' }
    ]
  },
  {
    id: 'ja-hotel-checkin', place: '호텔', scene: 'hotel', bg: '#FBF1CE', title: '체크인 이름 말하기',
    q: {
      orig: 'ご予約のお名前は？', kana: 'ごよやくのおなまえは？',
      ko: '고요야쿠노 오나마에와?', romaji: 'goyoyaku no onamae wa?', meaning: '예약하신 이름이 어떻게 되세요?'
    },
    a: {
      orig: 'キムで予約しています。', kana: 'きむでよやくしています。',
      ko: '키무데 요야쿠시테이마스', romaji: 'Kimu de yoyaku shite imasu', meaning: '김으로 예약했어요.'
    },
    tip: '「〜で予約しています」= “~로 예약했습니다”. 이름만 바꿔 말해 보세요.',
    swaps: [
      { from: 'キム', to: 'イ', say: 'イで予約しています。', kana: 'いでよやくしています。', ko: '이로 예약했어요.' },
      { from: '予約しています', to: 'お願いします', say: 'チェックインをお願いします。', kana: 'ちぇっくいんをおねがいします。', ko: '체크인 부탁해요.' }
    ]
  }
];
