/* ============================================================
   한마디 여행 · 영어와 일본어
   Single-file app logic: routing, rendering, mobile-safe TTS
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- error capture (for verification) ---------------- */
  window.__errors = [];
  window.addEventListener('error', function (e) {
    window.__errors.push(String((e && e.message) || e));
  });
  window.addEventListener('unhandledrejection', function (e) {
    window.__errors.push('promise: ' + String((e && e.reason) || e));
  });

  /* ---------------- utils ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }

  var H2K = {}, K2H = {};
  (function () {
    for (var c = 0x3041; c <= 0x3096; c++) {
      var h = String.fromCharCode(c), k = String.fromCharCode(c + 0x60);
      H2K[h] = k; K2H[k] = h;
    }
    H2K['ゔ'] = 'ヴ'; K2H['ヴ'] = 'ゔ';
  })();
  function toKata(s) { return Array.from(String(s)).map(function (c) { return H2K[c] || c; }).join(''); }
  function toHira(s) { return Array.from(String(s)).map(function (c) { return K2H[c] || c; }).join(''); }

  /* ---------------- persisted state ---------------- */
  var KEY = 'daytrip-language-studio-v1';
  var DEFAULTS = {
    view: 'home', kanaScript: 'hiragana', kanaRow: 'all',
    vocabCat: 'all', vocabMode: 'orig', cardModes: {},
    sentCat: '전체', sentMode: 'orig', rate: 1
  };
  var state = Object.assign({}, DEFAULTS);
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        Object.keys(DEFAULTS).forEach(function (k) {
          if (saved[k] === undefined) return;
          if (k === 'cardModes') { state.cardModes = saved[k] || {}; return; }
          state[k] = saved[k];
        });
      }
    } catch (e) { /* private mode: ignore */ }
    if (state.sentCat === 'all') state.sentCat = '전체';
    if (typeof SITUATIONS !== 'undefined' && SITUATIONS.indexOf(state.sentCat) === -1) state.sentCat = '전체';
    var h = (location.hash || '').replace('#', '');
    if (h && TITLES[h]) state.view = h;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { }
  }

  /* ============================================================
     Speech engine
     - speechSynthesis called synchronously inside the click handler
     - voiceschanged / late voice list handling (iOS Safari)
     - cancel() + immediate speak race guarded by watchdog
     - Google Translate TTS audio fallback with visible state
     ============================================================ */
  var Speech = (function () {
    var synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
    var voices = [];
    var token = 0;
    var audio = null;
    var currentBtn = null;

    var LANG = { ja: 'ja-JP', en: 'en-US', ko: 'ko-KR' };
    var PREFERRED = {
      'ja-JP': ['kyoko', 'o-ren', 'otoya', 'nanami', 'haruka', 'ayumi', 'google 日本語', 'google japanese', 'japanese', 'siri'],
      'en-US': ['samantha', 'alex', 'ava', 'allison', 'susan', 'google us english', 'google english', 'english (united states)', 'siri'],
      'ko-KR': ['yuna', 'sora', 'google 한국의', 'korean']
    };

    function refresh() {
      try { voices = synth ? (synth.getVoices() || []) : []; } catch (e) { voices = []; }
      updateStatus();
      return voices;
    }
    if (synth) {
      if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', refresh);
      else synth.onvoiceschanged = refresh;
      refresh();
      setTimeout(refresh, 250);
      setTimeout(refresh, 900);
      setTimeout(refresh, 2200);
    }

    function norm(l) { return String(l || '').toLowerCase().replace('_', '-'); }

    function score(v, target) {
      var lang = norm(v.lang), base = target.split('-')[0];
      if (lang.indexOf(base) !== 0) return -1;
      var s = 0;
      if (lang === norm(target)) s += 6;
      if (lang.indexOf('-') === -1) s -= 1;
      var name = norm(v.name || '');
      var pref = PREFERRED[target] || [];
      for (var i = 0; i < pref.length; i++) {
        if (name.indexOf(pref[i]) >= 0) { s += (pref.length - i) * 1.2; break; }
      }
      if (v.localService) s += 2.5;
      if (/compact|espeak|festival|pico/.test(name)) s -= 2.5;
      if (v.default) s += 0.3;
      return s;
    }

    function pick(target) {
      var best = null, bestScore = -1;
      for (var i = 0; i < voices.length; i++) {
        var s = score(voices[i], target);
        if (s > bestScore) { bestScore = s; best = voices[i]; }
      }
      return bestScore >= 0 ? best : null;
    }

    function setPlaying(btn, on, how) {
      if (!btn) return;
      btn.classList.toggle('is-playing', !!on);
      if (on && how === 'fallback') btn.classList.add('is-fallback');
      if (!on) setTimeout(function () { btn.classList.remove('is-fallback'); }, 400);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    function clearBtn() {
      if (currentBtn) { setPlaying(currentBtn, false); currentBtn = null; }
    }

    var GTTS = [
      function (t, l) { return 'https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=' + l + '&q=' + encodeURIComponent(t); },
      function (t, l) { return 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + l + '&q=' + encodeURIComponent(t); }
    ];

    function fallback(text, lang, rate, btn, myToken) {
      var l = String(lang || 'ja').slice(0, 2);
      var q = String(text).slice(0, 180);
      var i = 0;
      var tried = 0;
      function next() {
        if (myToken !== token) return;
        if (i >= GTTS.length) {
          setPlaying(btn, false);
          toast('이 기기에서 음성을 재생하지 못했어요 · 읽기: ' + text);
          return;
        }
        var url = GTTS[i++](q, l);
        tried++;
        try {
          var a = new Audio(url);
          a.preload = 'auto';
          audio = a;
          a.onplaying = function () {
            if (myToken !== token) return;
            setPlaying(btn, true, 'fallback');
            toast('기본 음성 대신 온라인 음성으로 재생했어요');
          };
          a.onended = function () { if (myToken === token) setPlaying(btn, false); };
          a.onerror = function () { if (myToken === token) next(); };
          var p = a.play();
          if (p && typeof p.catch === 'function') {
            p.catch(function () { if (myToken === token) setTimeout(next, 10); });
          }
        } catch (e) { next(); }
        if (tried > 4) { setPlaying(btn, false); }
      }
      next();
    }

    function speak(text, lang, rate, btn) {
      text = String(text || '');
      if (!text) return;
      var target = LANG[lang] || lang || 'ja-JP';
      var r = rate || 1;
      var myToken = ++token;
      clearBtn();
      currentBtn = btn || null;
      setPlaying(btn, true);

      if (audio) { try { audio.pause(); audio = null; } catch (e) { } }
      if (synth) {
        try { synth.cancel(); } catch (e) { }
        try { if (synth.paused) synth.resume(); } catch (e) { }
      }

      var voice = synth ? pick(target) : null;
      if (!synth) { fallback(text, target, r, btn, myToken); return; }
      if (!voice) { fallback(text, target, r, btn, myToken); return; }

      var started = false, ended = false;

      function makeUtter() {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = target;
        u.rate = r;
        u.pitch = 1;
        u.volume = 1;
        try { u.voice = voice; } catch (e) { }
        u.onstart = function () { started = true; };
        u.onend = function () { ended = true; if (myToken === token) { setPlaying(btn, false); currentBtn = null; } };
        u.onerror = function (ev) {
          var err = ev && ev.error;
          if (err === 'interrupted' || err === 'canceled') { ended = true; return; }
          if (!started) { if (myToken === token) fallback(text, target, r, btn, myToken); }
          else { ended = true; if (myToken === token) setPlaying(btn, false); }
        };
        return u;
      }

      try {
        synth.speak(makeUtter());
      } catch (e) {
        fallback(text, target, r, btn, myToken);
        return;
      }

      /* Chrome/Safari drop an utterance spoken immediately after cancel();
         re-queue once if nothing started (still inside the same gesture task). */
      setTimeout(function () {
        if (myToken !== token || started || ended) return;
        try { synth.speak(makeUtter()); } catch (e) { }
      }, 140);

      /* still silent? use the online voice so it never ends in silence */
      setTimeout(function () {
        if (myToken !== token || started || ended) return;
        fallback(text, target, r, btn, myToken);
      }, 2400);
    }

    var statusBusy = false;
    function updateStatus() {
      if (statusBusy) return;
      statusBusy = true;
      try { paintStatus(); } finally { statusBusy = false; }
    }

    function paintStatus() {
      var box = document.getElementById('voiceStatus');
      var chip = document.getElementById('topVoiceChip');
      var ja = synth ? pick('ja-JP') : null;
      var en = synth ? pick('en-US') : null;
      if (!synth) {
        if (box) box.innerHTML = '<span class="no">이 브라우저는 음성 합성이 없어</span><br>온라인 음성으로 재생합니다';
        if (chip) chip.textContent = '온라인 음성';
        return;
      }
      if (box) {
        box.innerHTML =
          '<span class="' + (ja ? 'ok' : 'no') + '">일본어 ' + (ja ? '✓' : '온라인') + '</span> · ' +
          '<span class="' + (en ? 'ok' : 'no') + '">영어 ' + (en ? '✓' : '온라인') + '</span>' +
          (ja ? '<br><span style="color:#8A857A">' + esc(ja.name) + '</span>' : '');
      }
      if (chip) chip.textContent = '🔊 ' + (ja ? 'ja' : 'ja?') + ' · ' + (en ? 'en' : 'en?');
    }

    function voiceName(lang) {
      var v = synth ? pick(LANG[lang] || lang) : null;
      return v ? v.name + ' (' + v.lang + ')' : null;
    }

    return {
      speak: speak,
      refresh: refresh,
      updateStatus: updateStatus,
      voiceName: voiceName,
      hasSynth: !!synth,
      pick: pick
    };
  })();

  window.__refreshVoiceStatus = Speech.updateStatus;
  window.__speechRefresh = Speech.refresh;

  /* ---------------- toast ---------------- */
  var toastTimer = null;
  function toast(msg, ms) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, ms || 2600);
  }

  /* ---------------- SVG frames ---------------- */
  var KANA_BG = ['#FBE7D9', '#E2EFE6', '#FBF1CE', '#E2EDF6', '#F9E3E7', '#E9E4F4', '#F7E9D8', '#E3F0EA', '#FAEFD9', '#E6EEF6'];
  var JPF = "'Hiragino Kaku Gothic ProN','Yu Gothic','Noto Sans JP','Hiragino Sans','Malgun Gothic',sans-serif";

  function kanaSVG(ch, inner, idx) {
    var bg = KANA_BG[idx % KANA_BG.length];
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(ch) + ' 연상 그림" preserveAspectRatio="xMidYMid meet">' +
      '<rect width="200" height="200" fill="' + bg + '"/>' +
      '<circle cx="26" cy="28" r="18" fill="#fff" opacity=".34"/>' +
      '<circle cx="178" cy="174" r="24" fill="#fff" opacity=".28"/>' +
      '<text x="100" y="104" text-anchor="middle" dominant-baseline="central" font-family="' + JPF + '" font-size="150" font-weight="600" fill="#1B4D3E" opacity=".10" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="3" paint-order="stroke">' + esc(ch) + '</text>' +
      inner +
      '</svg>';
  }

  function iconSVG(inner, bg) {
    return '<svg viewBox="0 0 200 200" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">' +
      '<rect width="200" height="200" fill="' + (bg || '#F6F1E7') + '"/>' +
      '<circle cx="30" cy="30" r="16" fill="#fff" opacity=".4"/>' +
      inner +
      '</svg>';
  }

  function sceneSVG(inner, bg) {
    return '<svg viewBox="0 0 400 160" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="400" height="160" fill="' + (bg || '#F7EFE2') + '"/>' + inner + '</svg>';
  }

  /* ============================================================
     Views
     ============================================================ */
  var TITLES = { home: '오늘의 학습', kana: '가나 첫 수업', vocab: '필수 단어장', sentences: '자주 쓰는 문장', english: '영어 한마디' };
  var SUBTITLES = {
    kana: '글자 모양이 그림과 겹쳐지는 순간, 가나가 저절로 외워져요.',
    vocab: '여행에서 바로 쓰는 41개 단어. 표기를 바꿔 가며 눈에 익혀 보세요.',
    sentences: '상황별 20문장. 듣고, 표기를 바꾸고, 한 번 따라 말해 보세요.',
    english: '카페 주문부터 길 찾기까지, 짧고 쓸모 있는 영어 한마디.'
  };

  var SPEAKER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.2L12 18V6L7.2 9.5H4z"/><path d="M16 9.2c1.2 1.1 1.2 4.5 0 5.6"/><path d="M18.8 6.6c2.4 2.4 2.4 8.4 0 10.8"/></svg>';
  var SLOW_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/></svg>';

  function spkBtn(text, lang, rate, label) {
    return '<button type="button" class="spk" data-act="speak" data-text="' + esc(text) + '" data-lang="' + lang + '" data-rate="' + (rate || 1) + '" aria-label="' + esc(label || (text + ' 발음 듣기')) + '" aria-pressed="false">' +
      SPEAKER_ICON + '<span>' + esc(label || '듣기') + '</span></button>';
  }

  /* ---------------- home ---------------- */
  function todaySentence() {
    var d = new Date();
    var seed = (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % Math.max(1, SENTENCES.length);
    return SENTENCES[seed] || SENTENCES[0];
  }

  function viewHome() {
    var s = todaySentence();
    var hira = KANA_HIRA.length, kata = KANA_KATA.length;
    var cards = [
      { view: 'kana', title: '일본어 첫 수업', desc: '히라가나 · 가타카나 92자를 그림으로', count: hira + kata + '자', icon: 'kana', bg: '#E4EFE6', color: '#2F6B4F' },
      { view: 'vocab', title: '필수 단어장', desc: '동사 · 형용사 · 명사 + 한자 카드', count: WORDS.length + '개', icon: 'book', bg: '#FBEADB', color: '#A9693A' },
      { view: 'sentences', title: '자주 쓰는 문장', desc: '여행 · 일상 20문장, 4가지 표기', count: SENTENCES.length + '문장', icon: 'chat', bg: '#FBF0CC', color: '#937228' },
      { view: 'english', title: '영어 한마디', desc: '카페 주문부터 호텔 체크인까지', count: ENGLISH.length + '마디', icon: 'globe', bg: '#E3EBF6', color: '#3E5F86' }
    ];
    var quick = cards.map(function (c) {
      return '<button type="button" class="quick-card" data-act="go" data-view="' + c.view + '" style="text-align:left">' +
        '<span class="quick-top"><span class="quick-ico" style="background:' + c.bg + ';color:' + c.color + '">' + ICONS[c.icon] + '</span>' +
        '<span><h4>' + esc(c.title) + '</h4></span></span>' +
        '<p>' + esc(c.desc) + '</p>' +
        '<span class="quick-foot"><span>바로 시작하기 →</span><span class="quick-count">' + esc(c.count) + '</span></span>' +
        '</button>';
    }).join('');

    return '' +
      '<section class="hero">' +
      '<div class="hero-copy">' +
      '<span class="eyebrow">YOUR DAILY LITTLE TRIP</span>' +
      '<h1>주성 님, 오늘도<br>한마디 어때요?</h1>' +
      '<p>영어 한마디, 일본어 한마디. 완벽하지 않아도 괜찮아요. 여행지에서 쓸 문장 하나면 충분해요.</p>' +
      '<div class="hero-meta"><span>🎧 모든 글자·단어·문장 듣기</span><span>🖼️ 그림으로 익히는 가나</span><span>🔁 표기 3·4단 변환</span></div>' +
      '<button type="button" class="btn btn-primary" data-act="go" data-view="kana">오늘의 학습 시작 ' + ICONS.arrow + '</button>' +
      '</div>' +
      '<div class="hero-art">' + HERO_ART + '</div>' +
      '</section>' +

      '<div class="stat-row">' +
      '<div class="stat"><b>' + (hira + kata) + '자</b><span>히라가나 ' + hira + ' · 가타카나 ' + kata + '</span></div>' +
      '<div class="stat"><b>' + WORDS.length + '개</b><span>필수 단어 + 한자 카드</span></div>' +
      '<div class="stat"><b>' + SENTENCES.length + '문장</b><span>여행 · 일상 회화</span></div>' +
      '<div class="stat"><b>' + ENGLISH.length + '마디</b><span>영어 기초 회화</span></div>' +
      '</div>' +

      '<div class="quick-grid">' + quick + '</div>' +

      '<div class="section-head"><h3>오늘의 한마디</h3><span class="hint">매일 바뀌어요</span></div>' +
      '<div class="panel" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      '<div style="flex:1 1 280px;min-width:0">' +
      '<span class="eyebrow" style="color:#A9693A">' + esc(s.cat) + '</span>' +
      '<p style="font-family:var(--jp);font-size:23px;font-weight:600;margin:6px 0 4px">' + esc(s.orig) + '</p>' +
      '<p style="font-size:13px;color:#8A857A">' + esc(s.koPron) + ' · ' + esc(s.romaji) + '</p>' +
      '<p style="font-size:15px;font-weight:700;margin-top:6px">' + esc(s.meaning) + '</p>' +
      '</div>' +
      '<div class="spk-row">' + spkBtn(s.orig, 'ja', 1, '보통') + spkBtn(s.orig, 'ja', 0.85, '천천히') + '</div>' +
      '</div>' +

      '<div class="section-head"><h3>이 기기의 발음</h3><span class="hint">휴대폰에서도 소리가 나는지 먼저 확인해 보세요</span></div>' +
      '<div class="panel">' +
      '<p style="font-size:13.5px;color:#6E6A60;line-height:1.7">듣기 버튼은 <b>기기에 내장된 일본어·영어 음성</b>을 먼저 찾아 재생하고, 없으면 <b>온라인 음성</b>으로 자동 전환해요. 소리가 나지 않으면 이 기기의 무음 모드를 확인해 주세요.</p>' +
      '<div class="spk-row" style="margin-top:12px">' +
      '<button type="button" class="btn btn-soft btn-mini" data-act="test-voice">일본어 음성 확인</button>' +
      '<button type="button" class="btn btn-soft btn-mini" data-act="test-voice-en">영어 음성 확인</button>' +
      '</div>' +
      '</div>';
  }

  /* ---------------- kana ---------------- */
  function viewKana() {
    var isHira = state.kanaScript !== 'katakana';
    var list = isHira ? KANA_HIRA : KANA_KATA;
    var rows = [];
    list.forEach(function (k) { if (rows.indexOf(k.row) === -1) rows.push(k.row); });
    var shown = list.filter(function (k) { return state.kanaRow === 'all' || k.row === state.kanaRow; });

    var rowChips = '<button type="button" class="chip' + (state.kanaRow === 'all' ? ' is-active' : '') + '" data-act="kana-row" data-row="all">전체 ' + list.length + '</button>' +
      rows.map(function (r) {
        return '<button type="button" class="chip' + (state.kanaRow === r ? ' is-active' : '') + '" data-act="kana-row" data-row="' + esc(r) + '">' + esc(r) + '</button>';
      }).join('');

    var cards = shown.map(function (k, i) {
      var idx = list.indexOf(k);
      return '<article class="kana-card">' +
        '<div class="kana-art">' + kanaSVG(k.ch, k.art, idx) + '</div>' +
        '<div class="kana-body">' +
        '<div class="kana-line"><span class="kana-char">' + esc(k.ch) + '</span><span class="kana-ro">' + esc(k.ro) + '</span></div>' +
        '<div class="kana-ko">' + esc(k.ko) + ' 소리</div>' +
        '<p class="kana-story">' + esc(k.story) + '</p>' +
        '<div class="spk-row">' + spkBtn(k.ch, 'ja', 1, '듣기') + '</div>' +
        '</div></article>';
    }).join('');

    return '' +
      '<div class="page-head">' +
      '<div><span class="eyebrow">STEP 1 · かな</span><h2>일본어 첫 수업</h2><p>' + esc(SUBTITLES.kana) + '</p></div>' +
      '<div class="head-tools">' +
      '<div class="seg" role="group" aria-label="가나 종류">' +
      '<button type="button" class="seg-btn' + (isHira ? ' is-active' : '') + '" data-act="kana-script" data-script="hiragana">히라가나 ' + KANA_HIRA.length + '자</button>' +
      '<button type="button" class="seg-btn' + (!isHira ? ' is-active' : '') + '" data-act="kana-script" data-script="katakana">가타카나 ' + KANA_KATA.length + '자</button>' +
      '</div></div></div>' +
      '<div class="chips">' + rowChips + '</div>' +
      '<div class="kana-grid">' + cards + '</div>' +
      '<div class="note" style="margin-top:22px">' + ICONS.info +
      '<div>그림 속 글자 모양을 손가락으로 따라 그려 보세요. 카드의 <b>듣기</b>를 누르면 실제 일본어 발음이 나옵니다. 소리가 안 나면 자동으로 온라인 음성으로 넘어가요.</div></div>';
  }

  /* ---------------- vocab ---------------- */
  var CATS = [{ k: 'all', label: '전체' }, { k: 'noun', label: '주어·명사' }, { k: 'verb', label: '동사' }, { k: 'adj', label: '형용사' }];
  var MODES = [{ k: 'orig', label: '원래대로' }, { k: 'hira', label: '히라가나' }, { k: 'kata', label: '가타카나' }];

  function wordForm(w, mode) {
    if (mode === 'hira') return w.reading;
    if (mode === 'kata') return toKata(w.reading);
    return w.orig;
  }
  function modeLabel(mode) {
    return mode === 'hira' ? '히라가나' : mode === 'kata' ? '가타카나' : '원래대로';
  }

  function viewVocab() {
    var list = WORDS.filter(function (w) { return state.vocabCat === 'all' || w.cat === state.vocabCat; });
    var chips = CATS.map(function (c) {
      var n = c.k === 'all' ? WORDS.length : WORDS.filter(function (w) { return w.cat === c.k; }).length;
      return '<button type="button" class="chip' + (state.vocabCat === c.k ? ' is-active' : '') + '" data-act="vocab-cat" data-cat="' + c.k + '">' + c.label + ' <span style="opacity:.65">' + n + '</span></button>';
    }).join('');

    var segs = MODES.map(function (m) {
      return '<button type="button" class="seg-btn' + (state.vocabMode === m.k ? ' is-active' : '') + '" data-act="v-mode" data-mode="' + m.k + '">' + m.label + '</button>';
    }).join('');

    var cards = list.map(function (w) {
      var mode = state.cardModes[w.id] || state.vocabMode;
      var form = wordForm(w, mode);
      var kanji = w.kanji
        ? '<div class="kanji-box">' +
        '<div class="kanji-box-top"><span class="kanji-glyph">' + esc(w.kanji.chars) + '</span>' +
        '<span class="kanji-lines"><span>훈 <b>' + esc(w.kanji.hun) + '</b></span><span>음독 <b>' + esc(w.kanji.on || '—') + '</b> · 훈독 <b>' + esc(w.kanji.kun || '—') + '</b></span></span></div>' +
        '<p class="kanji-tip">' + esc(w.kanji.tip) + '</p></div>'
        : '<div class="kanji-empty">한자 없이 쓰는 말이에요 · ' + esc(w.reading) + ' (' + esc(w.romaji) + ')</div>';

      return '<article class="word-card">' +
        '<div class="word-top">' +
        '<div class="word-art">' + iconSVG(w.art, w.bg) + '</div>' +
        '<div class="word-headings">' +
        '<div class="word-main" data-tone="' + mode + '">' + esc(form) + '</div>' +
        '<div class="word-meaning">' + esc(w.mean) + '</div>' +
        '<div class="word-read"><span class="ko">' + esc(w.ko) + '</span><span class="ro">' + esc(w.romaji) + '</span></div>' +
        '</div></div>' +
        kanji +
        '<div class="word-actions">' + spkBtn(form, 'ja', 1, '듣기') +
        '<button type="button" class="mode-mini" data-act="card-mode" data-id="' + esc(w.id) + '" title="이 카드만 표기 바꾸기">표기 <b>' + modeLabel(mode) + '</b> ⇄</button>' +
        '</div>' +
        '</article>';
    }).join('');

    var note = state.vocabMode !== 'orig'
      ? '<div class="note" style="margin-bottom:16px">' + ICONS.info + '<div>지금은 <b>' + modeLabel(state.vocabMode) + ' 표기</b>로 보고 있어요. 카드마다 <b>표기 ⇄</b> 버튼으로 하나씩만 바꿀 수도 있습니다.</div></div>'
      : '';

    return '' +
      '<div class="page-head">' +
      '<div><span class="eyebrow">STEP 2 · 単語</span><h2>필수 단어장</h2><p>' + esc(SUBTITLES.vocab) + '</p></div>' +
      '</div>' +
      '<div class="chips">' + chips + '</div>' +
      '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:14px">' +
      '<div class="seg-wrap"><span class="seg-caption">전체 표기 한 번에 바꾸기</span>' +
      '<div class="seg" role="group" aria-label="표기 전환">' + segs + '</div></div>' +
      '</div>' + note +
      '<div class="word-grid">' + cards + '</div>' +
      '<div class="note" style="margin-top:22px">' + ICONS.info +
      '<div>발음은 <b>한국어 표기</b>와 <b>로마자</b>로 항상 함께 보여요. 히라가나·가타카나로 바꿔도 읽는 법은 그대로 확인할 수 있습니다.</div></div>';
  }

  /* ---------------- sentences ---------------- */
  var SITUATIONS = ['전체', '인사', '카페', '식당', '길찾기', '쇼핑', '호텔', '교통', '일상'];
  var SENT_MODES = [{ k: 'orig', label: '원래대로' }, { k: 'hira', label: '히라가나' }, { k: 'kata', label: '가타카나' }, { k: 'furi', label: '한자+후리가나' }];

  function furiHTML(s) {
    var out = '';
    var re = /\[([^\]|]+)\|([^\]]+)\]/g;
    var last = 0, m;
    while ((m = re.exec(s))) {
      out += esc(s.slice(last, m.index));
      out += '<ruby>' + esc(m[1]) + '<rt>' + esc(m[2]) + '</rt></ruby>';
      last = m.index + m[0].length;
    }
    out += esc(s.slice(last));
    return out;
  }

  function sentDisplay(s, mode) {
    if (mode === 'hira') return { html: esc(s.kana), tone: 'hira' };
    if (mode === 'kata') return { html: esc(toKata(s.kana)), tone: 'kata' };
    if (mode === 'furi') return { html: furiHTML(s.furi), tone: 'orig' };
    return { html: esc(s.orig), tone: 'orig' };
  }

  function viewSentences() {
    var list = SENTENCES.filter(function (s) { return state.sentCat === '전체' || s.cat === state.sentCat; });
    var chips = SITUATIONS.map(function (c) {
      var n = c === '전체' ? SENTENCES.length : SENTENCES.filter(function (s) { return s.cat === c; }).length;
      if (!n) return '';
      return '<button type="button" class="chip' + (state.sentCat === c ? ' is-active' : '') + '" data-act="sent-cat" data-cat="' + esc(c) + '">' + esc(c) + ' <span style="opacity:.65">' + n + '</span></button>';
    }).join('');

    var segs = SENT_MODES.map(function (m) {
      return '<button type="button" class="seg-btn' + (state.sentMode === m.k ? ' is-active' : '') + '" data-act="s-mode" data-mode="' + m.k + '">' + m.label + '</button>';
    }).join('');

    var cards = list.map(function (s, i) {
      var d = sentDisplay(s, state.sentMode);
      return '<article class="sent-card">' +
        '<div class="sent-art">' + sceneSVG(s.art, s.bg) + '<span class="sent-tag">' + esc(s.cat) + '</span></div>' +
        '<div class="sent-body">' +
        '<p class="sent-text" data-tone="' + d.tone + '">' + d.html + '</p>' +
        '<div class="sent-read"><span class="ko">' + esc(s.koPron) + '</span><span class="ro">' + esc(s.romaji) + '</span></div>' +
        '<p class="sent-meaning">' + esc(s.meaning) + '</p>' +
        '<div class="sent-tip"><b>포인트</b>' + esc(s.tip) + '</div>' +
        '<div class="sent-actions">' + spkBtn(s.orig, 'ja', 1, '보통') + spkBtn(s.orig, 'ja', 0.85, '천천히') + '</div>' +
        '</div></article>';
    }).join('');

    return '' +
      '<div class="page-head">' +
      '<div><span class="eyebrow">STEP 3 · 会話</span><h2>자주 쓰는 문장</h2><p>' + esc(SUBTITLES.sentences) + '</p></div>' +
      '<div class="head-tools"><div class="seg" role="group" aria-label="문장 표기">' + segs + '</div></div>' +
      '</div>' +
      '<div class="chips">' + chips + '</div>' +
      '<div class="sent-list">' + cards + '</div>' +
      '<div class="note" style="margin-top:22px">' + ICONS.info +
      '<div><b>한자+후리가나</b>는 한자 위에 읽는 법이 작게 붙어요. <b>히라가나</b>·<b>가타카나</b>로 바꿔 읽는 연습을 하고, 마지막엔 <b>원래대로</b> 한자를 확인해 보세요.</div></div>';
  }

  /* ---------------- english ---------------- */
  function viewEnglish() {
    var cats = [];
    ENGLISH.forEach(function (p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });

    var groups = cats.map(function (c) {
      var items = ENGLISH.filter(function (p) { return p.cat === c; });
      var cards = items.map(function (p) {
        return '<article class="en-card" data-lang="en">' +
          '<span class="en-cat">' + esc(p.tag || c) + '</span>' +
          '<p class="en-text">' + esc(p.en) + '</p>' +
          '<p class="en-ko">' + esc(p.ko) + '</p>' +
          '<p class="en-pron">[' + esc(p.pron) + ']</p>' +
          '<div class="en-actions">' + spkBtn(p.en, 'en', 1, '보통') + spkBtn(p.en, 'en', 0.85, '천천히') + '</div>' +
          '</article>';
      }).join('');
      return '<div class="section-head"><h3>' + esc(c) + '</h3><span class="count">' + items.length + '마디</span></div><div class="en-grid">' + cards + '</div>';
    }).join('');

    var dlg = DIALOGUE.map(function (d) {
      var me = d.who === 'me';
      return '<div class="dlg-row' + (me ? ' me' : '') + '">' +
        '<span class="dlg-who">' + (me ? '나' : 'Mia') + '</span>' +
        '<div class="dlg-bubble"><p class="dlg-en">' + esc(d.en) + '</p><p class="dlg-ko">' + esc(d.ko) + '</p>' +
        spkBtn(d.en, 'en', 0.95, '듣기') + '</div></div>';
    }).join('');

    return '' +
      '<div class="page-head">' +
      '<div><span class="eyebrow">STEP 4 · ENGLISH</span><h2>영어 한마디</h2><p>' + esc(SUBTITLES.english) + '</p></div>' +
      '</div>' +
      '<div class="panel" style="margin-bottom:6px">' +
      '<div class="section-head" style="margin:0 0 12px"><h3>카페에서의 첫 주문</h3><span class="count">대화 4마디</span><span class="hint">한 줄씩 듣고 따라 말해 보세요</span></div>' +
      '<div class="dialogue">' + dlg + '</div>' +
      '</div>' +
      groups +
      '<div class="note" style="margin-top:24px">' + ICONS.info +
      '<div>영어는 <b>보통(1.0x)</b>과 <b>천천히(0.8x)</b>로 들을 수 있어요. 발음이 안 들리면 기기 음성 대신 온라인 음성으로 자동 전환됩니다.</div></div>';
  }

  var VIEWS = { home: viewHome, kana: viewKana, vocab: viewVocab, sentences: viewSentences, english: viewEnglish };

  /* ============================================================
     Render + routing
     ============================================================ */
  function render() {
    var view = VIEWS[state.view] ? state.view : 'home';
    var host = document.getElementById('view');
    if (!host) return;
    host.innerHTML = VIEWS[view]();
    var crumb = document.getElementById('crumbNow');
    if (crumb) crumb.textContent = TITLES[view];
    $$('[data-view]').forEach(function (el) {
      var on = el.getAttribute('data-view') === view;
      el.classList.toggle('is-active', on);
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    syncRateButtons();
    Speech.updateStatus();
  }

  function syncRateButtons() {
    $$('[data-rate-btn]').forEach(function (b) {
      b.classList.toggle('is-active', Number(b.getAttribute('data-rate')) === Number(state.rate));
    });
  }

  function go(view) {
    if (!VIEWS[view]) view = 'home';
    var changed = state.view !== view;
    state.view = view;
    save();
    if (location.hash !== '#' + view) {
      try { history.replaceState(null, '', '#' + view); } catch (e) { location.hash = view; }
    }
    render();
    if (changed) window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.remove('menu-open');
  }

  /* ============================================================
     Events (speech is invoked directly in the click task)
     ============================================================ */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!el) return;
    var act = el.getAttribute('data-act');

    if (act === 'nav' || act === 'go') {
      e.preventDefault();
      go(el.getAttribute('data-view'));
      return;
    }
    if (act === 'open-menu') { document.body.classList.add('menu-open'); return; }
    if (act === 'close-menu') { document.body.classList.remove('menu-open'); return; }
    if (act === 'rate') {
      state.rate = Number(el.getAttribute('data-rate')) || 1;
      save(); syncRateButtons();
      toast(state.rate < 1 ? '발음 속도를 천천히(0.85x)로 바꿨어요' : '발음 속도를 보통(1.0x)으로 바꿨어요', 1800);
      return;
    }
    if (act === 'test-voice' || act === 'test-voice-en') {
      var lang = act === 'test-voice' ? 'ja' : 'en';
      var name = Speech.voiceName(lang);
      Speech.speak(lang === 'ja' ? 'こんにちは、はじめまして' : 'Hello, nice to meet you.', lang, 1, null);
      toast(name ? (lang === 'ja' ? '일본어 음성: ' : '영어 음성: ') + name : '기기 음성이 없어 온라인 음성으로 재생합니다');
      return;
    }
    if (act === 'speak') {
      e.preventDefault();
      Speech.speak(el.getAttribute('data-text'), el.getAttribute('data-lang'), Number(el.getAttribute('data-rate')) || 1, el);
      return;
    }
    if (act === 'kana-script') {
      state.kanaScript = el.getAttribute('data-script');
      state.kanaRow = 'all';
      save(); go('kana');
      return;
    }
    if (act === 'kana-row') { state.kanaRow = el.getAttribute('data-row'); save(); render(); return; }
    if (act === 'vocab-cat') { state.vocabCat = el.getAttribute('data-cat'); save(); render(); return; }
    if (act === 'v-mode') {
      state.vocabMode = el.getAttribute('data-mode');
      state.cardModes = {};
      save(); render();
      return;
    }
    if (act === 'card-mode') {
      var id = el.getAttribute('data-id');
      var cur = state.cardModes[id] || state.vocabMode;
      var order = ['orig', 'hira', 'kata'];
      var nx = order[(order.indexOf(cur) + 1) % order.length];
      state.cardModes[id] = nx;
      save(); render();
      return;
    }
    if (act === 's-mode') { state.sentMode = el.getAttribute('data-mode'); save(); render(); return; }
    if (act === 'sent-cat') { state.sentCat = el.getAttribute('data-cat'); save(); render(); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.body.classList.remove('menu-open');
  });

  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    if (VIEWS[h] && h !== state.view) { state.view = h; save(); render(); window.scrollTo({ top: 0, behavior: 'auto' }); }
  });

  /* mobile swipe: close drawer */
  (function () {
    var sx = 0, sy = 0;
    document.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches[0]) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (!document.body.classList.contains('menu-open')) return;
      var t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      if (sx - t.clientX > 60 && Math.abs(sy - t.clientY) < 60) document.body.classList.remove('menu-open');
    }, { passive: true });
  })();

  /* ============================================================
     Boot
     ============================================================ */
  load();
  $$('[data-ico]').forEach(function (el) {
    el.innerHTML = ICONS[el.getAttribute('data-ico')] || '';
  });
  render();

  window.__app = {
    state: state,
    counts: { hiragana: KANA_HIRA.length, katakana: KANA_KATA.length, words: WORDS.length, sentences: SENTENCES.length, english: ENGLISH.length },
    go: go
  };
})();
