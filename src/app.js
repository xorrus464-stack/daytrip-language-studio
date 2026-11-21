/* ============================================================
   한마디 여행 · 영어와 일본어
   Single-file app logic: language modes, routing, rendering,
   mnemonic SVG art, PWA install flow, mobile-safe TTS
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

  /* ---------------- language model ---------------- */
  var LANGS = {
    ja: {
      label: '일본어', flag: '🇯🇵', views: ['home', 'kana', 'vocab', 'sentences'],
      navLabel: '나의 작은 여행 준비', note: '가나 92자부터 시작하는 일본어 코스'
    },
    en: {
      label: '영어', flag: '🇺🇸', views: ['home', 'english', 'en-situations', 'en-cafe'],
      navLabel: '나의 작은 영어 여행', note: '질문 + 대답 Q&A 세트 · 상황 회화 7가지'
    }
  };

  var NAV = {
    ja: [
      { view: 'home', label: '오늘의 학습', tab: '학습', ico: 'home' },
      { view: 'kana', label: '가나 첫 수업', tab: '가나', ico: 'kana' },
      { view: 'vocab', label: '필수 단어장', tab: '단어', ico: 'book' },
      { view: 'sentences', label: '자주 쓰는 문장', tab: '문장', ico: 'chat' }
    ],
    en: [
      { view: 'home', label: '오늘의 학습', tab: '학습', ico: 'home' },
      { view: 'english', label: '영어 한마디', tab: '한마디', ico: 'globe' },
      { view: 'en-situations', label: '여행 영어 회화', tab: '회화', ico: 'chat' },
      { view: 'en-cafe', label: '카페 주문 대화', tab: '카페', ico: 'cup' }
    ]
  };

  /* ---------------- persisted state ---------------- */
  var KEY = 'daytrip-language-studio-v1';
  var DEFAULTS = {
    lang: 'ja',
    view: 'home', kanaScript: 'hiragana', kanaRow: 'all',
    vocabCat: 'all', vocabMode: 'orig', cardModes: {},
    sentCat: '전체', sentMode: 'orig', enCat: '전체', rate: 1, qaMode: 'orig'
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
    if (!LANGS[state.lang]) state.lang = 'ja';
    if (state.sentCat === 'all') state.sentCat = '전체';
    if (typeof SITUATIONS !== 'undefined' && SITUATIONS.indexOf(state.sentCat) === -1) state.sentCat = '전체';
    if (state.enCat === 'all') state.enCat = '전체';

    var h = (location.hash || '').replace('#', '');
    if (h && TITLES[h]) {
      state.view = h;
      var inEn = LANGS.en.views.indexOf(h) !== -1;
      var inJa = LANGS.ja.views.indexOf(h) !== -1;
      if (inEn && !inJa) state.lang = 'en';
      else if (inJa && !inEn) state.lang = 'ja';
    }
    if (LANGS[state.lang].views.indexOf(state.view) === -1) state.view = 'home';
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

  function kanaSVG(k, idx) {
    var bg = KANA_BG[idx % KANA_BG.length];
    var g = (typeof KANA_GLYPH !== 'undefined' && KANA_GLYPH[k.ch]) ? KANA_GLYPH[k.ch] : null;
    var ink = k.ink || '#1B4D3E';
    var glyph = g
      ? '<path d="' + g.d + '" transform="' + g.t + '" fill="' + ink + '" stroke="' + ink +
        '" stroke-width="26" stroke-linejoin="round" stroke-linecap="round"/>'
      : '<text x="100" y="104" text-anchor="middle" dominant-baseline="central" font-family="' + JPF +
        '" font-size="140" font-weight="600" fill="' + ink + '">' + esc(k.ch) + '</text>';
    if (k.dy) glyph = '<g transform="translate(0,' + k.dy + ')">' + glyph + '</g>';
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(k.ch) + ' 연상 그림" preserveAspectRatio="xMidYMid meet">' +
      '<rect width="200" height="200" fill="' + bg + '"/>' +
      '<circle cx="26" cy="28" r="18" fill="#fff" opacity=".34"/>' +
      '<circle cx="178" cy="174" r="24" fill="#fff" opacity=".28"/>' +
      (k.back || '') + glyph + (k.front || '') +
      '</svg>';
  }

  function iconSVG(inner, bg) {
    return '<svg viewBox="0 0 200 200" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">' +
      '<rect width="200" height="200" fill="' + (bg || '#F6F1E7') + '"/>' +
      '<circle cx="30" cy="30" r="16" fill="#fff" opacity=".4"/>' +
      inner +
      '</svg>';
  }

  /* 상황 장면: 사람·소품·제스처가 그려진 400x180 장면 그림 */
  function enScene(bg, key, fit) {
    var inner = (typeof EN_SCENES !== 'undefined' && EN_SCENES[key]) || '';
    return '<svg viewBox="0 0 400 180" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid ' + (fit || 'slice') + '">' +
      '<rect width="400" height="180" fill="' + (bg || '#F7EFE2') + '"/>' + inner + '</svg>';
  }

  function sceneSVG(inner, bg) {
    return '<svg viewBox="0 0 400 160" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="400" height="160" fill="' + (bg || '#F7EFE2') + '"/>' + inner + '</svg>';
  }

  /* ============================================================
     Views
     ============================================================ */
  var TITLES = {
    home: '오늘의 학습', kana: '가나 첫 수업', vocab: '필수 단어장', sentences: '자주 쓰는 문장',
    english: '영어 한마디', 'en-situations': '여행 영어 회화', 'en-cafe': '카페 주문 대화'
  };
  var SUBTITLES = {
    kana: '글자 모양이 그림과 겹쳐지는 순간, 가나가 저절로 외워져요.',
    vocab: '여행에서 바로 쓰는 41개 단어. 표기를 바꿔 가며 눈에 익혀 보세요.',
    sentences: '상황별 20문장. 듣고, 표기를 바꾸고, 한 번 따라 말해 보세요.',
    english: '카페·식당·호텔·길찾기·쇼핑·공항·교통. 발음을 보고 바로 듣는 19마디.',
    'en-situations': '상대의 말과 내 대답을 짝으로 익히는 7가지 상황 회화.',
    'en-cafe': '주문부터 영수증까지, 카페에서 실제로 오가는 6마디 대화.'
  };

  var SPEAKER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.2L12 18V6L7.2 9.5H4z"/><path d="M16 9.2c1.2 1.1 1.2 4.5 0 5.6"/><path d="M18.8 6.6c2.4 2.4 2.4 8.4 0 10.8"/></svg>';

  function spkBtn(text, lang, rate, label) {
    return '<button type="button" class="spk" data-act="speak" data-text="' + esc(text) + '" data-lang="' + lang + '" data-rate="' + (rate || 1) + '" aria-label="' + esc(label || (text + ' 발음 듣기')) + '" aria-pressed="false">' +
      SPEAKER_ICON + '<span>' + esc(label || '듣기') + '</span></button>';
  }

  /* ---------------- today's phrase ---------------- */
  function todaySentence() {
    var d = new Date();
    var seed = (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % Math.max(1, SENTENCES.length);
    return SENTENCES[seed] || SENTENCES[0];
  }
  function todayEnglish() {
    var d = new Date();
    var seed = (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % Math.max(1, ENGLISH.length);
    return ENGLISH[seed] || ENGLISH[0];
  }

  /* ---------------- 오늘의 Q&A 세트 ---------------- */
  function qaBubbleHTML(role, text, read, meaning, lang, audio) {
    return '<div class="qa-turn" data-who="' + role + '">' +
      '<span class="qa-who">' + (role === 'q' ? '상대' : '나') + '</span>' +
      '<div class="qa-bubble">' +
      '<p class="qa-text">' + text + '</p>' +
      (read ? '<p class="qa-read">' + read + '</p>' : '') +
      (meaning ? '<p class="qa-mean">' + meaning + '</p>' : '') +
      '<div class="spk-row">' + spkBtn(audio, lang, 1, '보통') + spkBtn(audio, lang, 0.85, '천천히') + '</div>' +
      '</div></div>';
  }

  function qaSetHTMLEN(s, i) {
    return '<article class="qa-card">' +
      '<div class="qa-art">' + enScene(s.bg, s.scene) +
      '<span class="qa-tag">' + esc(s.place) + '</span><span class="qa-set">SET ' + (i + 1) + '</span></div>' +
      '<div class="qa-body">' +
      '<div class="qa-head"><h4>' + esc(s.title) + '</h4></div>' +
      qaBubbleHTML('q', esc(s.q.text), '[' + esc(s.q.pron) + ']', esc(s.q.ko), 'en', s.q.text) +
      '<div class="qa-arrow" aria-hidden="true">↓</div>' +
      qaBubbleHTML('a', esc(s.a.text), '[' + esc(s.a.pron) + ']', esc(s.a.ko), 'en', s.a.text) +
      '<div class="qa-tip"><b>바꿔 끼우기</b><span>' + esc(s.tip) + '</span>' +
      '<div class="qa-swaps">' + s.swaps.map(function (w) {
        return '<button type="button" class="qa-swap" data-act="speak" data-text="' + esc(w.say) + '" data-lang="en" data-rate="1">' +
          esc(w.from) + ' → <b>' + esc(w.to) + '</b><small>' + esc(w.say) + '</small></button>';
      }).join('') + '</div></div>' +
      '</div></article>';
  }

  function qaSetHTMLJA(s, i) {
    var hira = state.qaMode === 'hira';
    function line(o) {
      var text = hira ? o.kana : o.orig;
      return { text: esc(text), read: '[' + esc(o.ko) + ']', mean: esc(o.meaning), audio: text };
    }
    var q = line(s.q), a = line(s.a);
    return '<article class="qa-card">' +
      '<div class="qa-art">' + enScene(s.bg, s.scene) +
      '<span class="qa-tag">' + esc(s.place) + '</span><span class="qa-set">SET ' + (i + 1) + '</span></div>' +
      '<div class="qa-body">' +
      '<div class="qa-head"><h4>' + esc(s.title) + '</h4></div>' +
      qaBubbleHTML('q', '<span class="qa-jp">' + q.text + '</span>', q.read, q.mean, 'ja', q.audio) +
      '<div class="qa-arrow" aria-hidden="true">↓</div>' +
      qaBubbleHTML('a', '<span class="qa-jp">' + a.text + '</span>', a.read, a.mean, 'ja', a.audio) +
      '<div class="qa-tip"><b>바꿔 끼우기</b><span>' + esc(s.tip) + '</span>' +
      '<div class="qa-swaps">' + s.swaps.map(function (w) {
        var say = hira && w.kana ? w.kana : w.say;
        return '<button type="button" class="qa-swap" data-act="speak" data-text="' + esc(say) + '" data-lang="ja" data-rate="1">' +
          esc(w.from) + ' → <b>' + esc(w.to) + '</b><small>' + esc(say) + ' · ' + esc(w.ko) + '</small></button>';
      }).join('') + '</div></div>' +
      '</div></article>';
  }

  function qaSection(lang) {
    var isEn = lang === 'en';
    var sets = isEn ? (typeof QA_EN !== 'undefined' ? QA_EN : []) : (typeof QA_JA !== 'undefined' ? QA_JA : []);
    if (!sets.length) return '';
    var tools = isEn
      ? '<div class="qa-tools"><span class="qa-tools-label">질문을 먼저 듣고, 내 대답으로 답해 보세요</span></div>'
      : '<div class="qa-tools"><div class="seg" role="group" aria-label="Q&amp;A 표기">' +
        '<button type="button" class="seg-btn' + (state.qaMode !== 'hira' ? ' is-active' : '') + '" data-act="qa-mode" data-mode="orig">원래 표기</button>' +
        '<button type="button" class="seg-btn' + (state.qaMode === 'hira' ? ' is-active' : '') + '" data-act="qa-mode" data-mode="hira">히라가나</button>' +
        '</div><span class="qa-tools-label">질문을 먼저 듣고, 내 대답으로 답해 보세요</span></div>';
    return '<div class="section-head"><h3>' + (isEn ? '오늘의 영어 Q&A 세트' : '오늘의 일본어 Q&A 세트') + '</h3>' +
      '<span class="count">' + sets.length + '세트</span><span class="hint">질문 → 대답을 한 세트로</span></div>' +
      tools +
      '<div class="qa-list">' + sets.map(isEn ? qaSetHTMLEN : qaSetHTMLJA).join('') + '</div>';
  }

  function courseHTML(items) {
    return '<div class="course">' + items.map(function (c, i) {
      return '<button type="button" class="course-card" data-act="go" data-view="' + c.view + '">' +
        '<span class="course-step">' + (i + 1) + '</span>' +
        '<span class="course-ico" style="background:' + c.bg + ';color:' + c.color + '">' + (ICONS[c.icon] || '') + '</span>' +
        '<span class="course-txt"><strong>' + esc(c.title) + '</strong><small>' + esc(c.desc) + '</small></span>' +
        '</button>';
    }).join('') + '</div>';
  }

  function quickCard(c) {
    return '<button type="button" class="quick-card" data-act="go" data-view="' + c.view + '" style="text-align:left">' +
      '<span class="quick-top"><span class="quick-ico" style="background:' + c.bg + ';color:' + c.color + '">' + ICONS[c.icon] + '</span>' +
      '<span><h4>' + esc(c.title) + '</h4></span></span>' +
      '<p>' + esc(c.desc) + '</p>' +
      '<span class="quick-foot"><span>바로 시작하기 →</span><span class="quick-count">' + esc(c.count) + '</span></span>' +
      '</button>';
  }

  function voicePanel(firstLang) {
    return '<div class="section-head"><h3>이 기기의 발음</h3><span class="hint">휴대폰에서도 소리가 나는지 먼저 확인해 보세요</span></div>' +
      '<div class="panel">' +
      '<p style="font-size:13.5px;color:#6E6A60;line-height:1.7">듣기 버튼은 <b>기기에 내장된 일본어·영어 음성</b>을 먼저 찾아 재생하고, 없으면 <b>온라인 음성</b>으로 자동 전환해요. 소리가 나지 않으면 이 기기의 무음 모드를 확인해 주세요.</p>' +
      '<div class="spk-row" style="margin-top:12px">' +
      '<button type="button" class="btn btn-soft btn-mini" data-act="test-voice">일본어 음성 확인</button>' +
      '<button type="button" class="btn btn-soft btn-mini" data-act="test-voice-en">영어 음성 확인</button>' +
      '</div></div>';
  }

  /* ---------------- home · 일본어 ---------------- */
  function viewHomeJa() {
    var s = todaySentence();
    var hira = KANA_HIRA.length, kata = KANA_KATA.length;
    var cards = [
      { view: 'kana', title: '일본어 첫 수업', desc: '히라가나 · 가타카나 92자를 그림으로', count: hira + kata + '자', icon: 'kana', bg: '#E4EFE6', color: '#2F6B4F' },
      { view: 'vocab', title: '필수 단어장', desc: '동사 · 형용사 · 명사 + 한자 카드', count: WORDS.length + '개', icon: 'book', bg: '#FBEADB', color: '#A9693A' },
      { view: 'sentences', title: '자주 쓰는 문장', desc: '여행 · 일상 20문장, 4가지 표기', count: SENTENCES.length + '문장', icon: 'chat', bg: '#FBF0CC', color: '#937228' }
    ];

    return '' +
      '<section class="hero">' +
      '<div class="hero-copy">' +
      '<span class="eyebrow">YOUR DAILY LITTLE TRIP · 日本語</span>' +
      '<h1>주성 님, 오늘은<br>일본어 한마디 어때요?</h1>' +
      '<p>가나 92자, 여행 단어 41개, 상황별 문장 20개. 그림을 보고 뜻을 떠올리면 글자가 저절로 익어요.</p>' +
      '<div class="hero-meta"><span>🎧 모든 글자·단어·문장 듣기</span><span>🖼️ 그림으로 익히는 가나</span><span>🔁 표기 3·4단 변환</span></div>' +
      '<button type="button" class="btn btn-primary" data-act="go" data-view="kana">가나부터 시작하기 ' + ICONS.arrow + '</button>' +
      '</div>' +
      '<div class="hero-art">' + HERO_ART + '</div>' +
      '</section>' +

      '<div class="stat-row">' +
      '<div class="stat"><b>' + (hira + kata) + '자</b><span>히라가나 ' + hira + ' · 가타카나 ' + kata + '</span></div>' +
      '<div class="stat"><b>' + WORDS.length + '개</b><span>필수 단어 + 한자 카드</span></div>' +
      '<div class="stat"><b>' + SENTENCES.length + '문장</b><span>여행 · 일상 회화</span></div>' +
      '</div>' +

      qaSection('ja') +

      '<div class="quick-grid" style="margin-top:26px">' + cards.map(quickCard).join('') + '</div>' +

      '<div class="section-head"><h3>오늘의 일본어 한마디</h3><span class="hint">매일 바뀌어요</span></div>' +
      '<div class="panel" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      '<div style="flex:1 1 280px;min-width:0">' +
      '<span class="eyebrow" style="color:#A9693A">' + esc(s.cat) + '</span>' +
      '<p style="font-family:var(--jp);font-size:23px;font-weight:600;margin:6px 0 4px">' + esc(s.orig) + '</p>' +
      '<p style="font-size:13px;color:#8A857A">' + esc(s.koPron) + ' · ' + esc(s.romaji) + '</p>' +
      '<p style="font-size:15px;font-weight:700;margin-top:6px">' + esc(s.meaning) + '</p>' +
      '</div>' +
      '<div class="spk-row">' + spkBtn(s.orig, 'ja', 1, '보통') + spkBtn(s.orig, 'ja', 0.85, '천천히') + '</div>' +
      '</div>' +

      '<div class="section-head"><h3>추천 코스</h3><span class="hint">이 순서로 하루 10분</span></div>' +
      courseHTML([
        { view: 'kana', title: '가나 첫 수업', desc: '히라가나·가타카나 92자', icon: 'kana', bg: '#E4EFE6', color: '#2F6B4F' },
        { view: 'vocab', title: '필수 단어장', desc: '여행 단어 41개', icon: 'book', bg: '#FBEADB', color: '#A9693A' },
        { view: 'sentences', title: '자주 쓰는 문장', desc: '상황별 20문장', icon: 'chat', bg: '#FBF0CC', color: '#937228' }
      ]) +

      voicePanel();
  }

  /* ---------------- home · 영어 ---------------- */
  function viewHomeEn() {
    var p = todayEnglish();
    var cards = [
      { view: 'english', title: '영어 한마디', desc: '상황별 19마디, 발음·듣기 중심', count: ENGLISH.length + '마디', icon: 'globe', bg: '#E3EBF6', color: '#3E5F86' },
      { view: 'en-cafe', title: '카페 주문 대화', desc: '주문 · 포장 · 계산까지 6마디', count: DIALOGUE.length + '마디', icon: 'cup', bg: '#FBEADB', color: '#A9693A' },
      { view: 'en-situations', title: '여행 영어 회화', desc: '7가지 상황에서 주고받기', count: EN_SITUATIONS.length + '상황', icon: 'map', bg: '#FBF1CE', color: '#937228' }
    ];
    var sitCount = EN_SITUATIONS.reduce(function (n, s) { return n + s.lines.length; }, 0);

    return '' +
      '<section class="hero hero-en">' +
      '<div class="hero-copy">' +
      '<span class="eyebrow">TODAY\u2019S LITTLE ENGLISH · ENGLISH</span>' +
      '<h1>주성 님, 오늘은<br>영어 한마디 어때요?</h1>' +
      '<p>카페 주문부터 공항 게이트까지. 질문과 대답을 한 세트로 익히고, 짧은 한마디를 소리 내어 따라 말해 보세요.</p>' +
      '<div class="hero-meta"><span>🎧 보통 · 천천히 듣기</span><span>💬 질문 + 대답 Q&A 세트</span><span>🗣️ 카페 대화 6마디</span></div>' +
      '<button type="button" class="btn btn-primary" data-act="go" data-view="english">영어 한마디 시작 ' + ICONS.arrow + '</button>' +
      '</div>' +
      '<div class="hero-art">' + HERO_ART_EN + '</div>' +
      '</section>' +

      '<div class="stat-row">' +
      '<div class="stat"><b>' + ENGLISH.length + '마디</b><span>상황별 여행 영어 표현</span></div>' +
      '<div class="stat"><b>' + EN_SITUATIONS.length + '상황</b><span>주고받는 회화 ' + sitCount + '줄</span></div>' +
      '<div class="stat"><b>' + DIALOGUE.length + '마디</b><span>카페 주문 대화</span></div>' +
      '</div>' +

      qaSection('en') +

      '<div class="quick-grid" style="margin-top:26px">' + cards.map(quickCard).join('') + '</div>' +

      '<div class="section-head"><h3>오늘의 영어 한마디</h3><span class="hint">매일 바뀌어요</span></div>' +
      '<div class="panel today-en" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      '<div style="flex:1 1 260px;min-width:0">' +
      '<span class="eyebrow" style="color:#A9693A">' + esc(p.cat) + ' · ' + esc(p.tag) + '</span>' +
      '<p style="font-size:23px;font-weight:750;letter-spacing:-.01em;margin:6px 0 4px">' + esc(p.en) + '</p>' +
      '<p style="font-size:14px;font-weight:700;color:#514C42">' + esc(p.ko) + '</p>' +
      '<p style="font-size:12.5px;color:#9A9384;margin-top:4px">[' + esc(p.pron) + ']</p>' +
      '</div>' +
      '<div class="spk-row">' + spkBtn(p.en, 'en', 1, '보통') + spkBtn(p.en, 'en', 0.85, '천천히') + '</div>' +
      '</div>' +

      '<div class="section-head"><h3>추천 코스</h3><span class="hint">그림 → 대화 → 상황 순서로</span></div>' +
      courseHTML([
        { view: 'english', title: '영어 한마디', desc: '발음·듣기 중심 19마디', icon: 'globe', bg: '#E3EBF6', color: '#3E5F86' },
        { view: 'en-cafe', title: '카페 주문 대화', desc: '6마디로 주문 끝내기', icon: 'cup', bg: '#FBEADB', color: '#A9693A' },
        { view: 'en-situations', title: '여행 영어 회화', desc: '7가지 상황 주고받기', icon: 'map', bg: '#FBF1CE', color: '#937228' }
      ]) +

      voicePanel('en');
  }

  function viewHome() { return state.lang === 'en' ? viewHomeEn() : viewHomeJa(); }

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
        '<div class="kana-art">' + kanaSVG(k, idx) + '</div>' +
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
        '<div class="word-art">' + iconSVG((typeof VOCAB_ART !== 'undefined' && VOCAB_ART[w.id]) || w.art, w.bg) + '</div>' +
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

    var cards = list.map(function (s) {
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

  /* ---------------- english · 한마디 ---------------- */
  var EN_CATS = (function () {
    var out = ['전체'];
    ENGLISH.forEach(function (p) { if (out.indexOf(p.cat) === -1) out.push(p.cat); });
    return out;
  })();

  function enCard(p) {
    return '<article class="en-card" data-lang="en" data-cat="' + esc(p.cat) + '">' +
      '<div class="en-body">' +
      '<span class="en-cat">' + esc(p.cat) + ' · ' + esc(p.tag) + '</span>' +
      '<p class="en-text">' + esc(p.en) + '</p>' +
      '<p class="en-ko">' + esc(p.ko) + '</p>' +
      '<p class="en-pron">[' + esc(p.pron) + ']</p>' +
      '<div class="en-actions">' + spkBtn(p.en, 'en', 1, '보통') + spkBtn(p.en, 'en', 0.85, '천천히') +
      '<button type="button" class="en-scene" data-act="go" data-view="en-situations">상황 회화 →</button>' +
      '</div></div></article>';
  }

  function viewEnglish() {
    var active = EN_CATS.indexOf(state.enCat) === -1 ? '전체' : state.enCat;
    var list = ENGLISH.filter(function (p) { return active === '전체' || p.cat === active; });

    var chips = EN_CATS.map(function (c) {
      var n = c === '전체' ? ENGLISH.length : ENGLISH.filter(function (p) { return p.cat === c; }).length;
      return '<button type="button" class="chip' + (active === c ? ' is-active' : '') + '" data-act="en-cat" data-cat="' + esc(c) + '">' + esc(c) + ' <span style="opacity:.65">' + n + '</span></button>';
    }).join('');

    var body;
    if (active === '전체') {
      body = EN_CATS.slice(1).map(function (c) {
        var items = list.filter(function (p) { return p.cat === c; });
        if (!items.length) return '';
        return '<div class="section-head"><h3>' + esc(c) + '</h3><span class="count">' + items.length + '마디</span></div>' +
          '<div class="en-grid">' + items.map(enCard).join('') + '</div>';
      }).join('');
    } else {
      body = '<div class="en-grid">' + list.map(enCard).join('') + '</div>';
    }

    return '' +
      '<div class="page-head">' +
      '<div><span class="eyebrow">ENGLISH · 한마디</span><h2>영어 한마디</h2><p>' + esc(SUBTITLES.english) + '</p></div>' +
      '</div>' +
      '<div class="chips">' + chips + '</div>' +
      body +
      '<div class="note" style="margin-top:24px">' + ICONS.info +
      '<div>문장을 먼저 소리 내어 읽고 <b>듣기</b>로 확인해 보세요. 그 상황이 궁금하면 카드의 <b>상황 회화 →</b>에서 장면 그림과 주고받는 대화를 볼 수 있어요. <b>보통(1.0x)</b>·<b>천천히(0.85x)</b> 모두 지원합니다.</div></div>';
  }

  /* ---------------- english · 상황 회화 ---------------- */
  function sitLine(l) {
    return '<div class="sit-line" data-who="' + esc(l.who) + '">' +
      '<span class="sit-who">' + (l.who === 'A' ? '상대' : '나') + '</span>' +
      '<div class="sit-line-body">' +
      '<p class="sit-en">' + esc(l.en) + '</p>' +
      '<p class="sit-ko">' + esc(l.ko) + '</p>' +
      (l.pron ? '<p class="sit-pron">[' + esc(l.pron) + ']</p>' : '') +
      '</div>' +
      spkBtn(l.en, 'en', 0.95, '듣기') +
      '</div>';
  }

  function viewEnSituations() {
    var cards = EN_SITUATIONS.map(function (s) {
      return '<article class="sit-card">' +
        '<div class="sit-art">' + enScene(s.bg, s.scene) + '<span class="sent-tag">' + esc(s.label) + '</span></div>' +
        '<div class="sit-body">' +
        '<div class="sit-head"><h3>' + esc(s.label) + '</h3><span>' + esc(s.sub) + '</span></div>' +
        '<div class="sit-lines">' + s.lines.map(sitLine).join('') + '</div>' +
        '<div class="sent-tip"><b>포인트</b>' + esc(s.tip) + '</div>' +
        '</div></article>';
    }).join('');

    return '' +
      '<div class="page-head">' +
      '<div><span class="eyebrow">ENGLISH · 会話</span><h2>여행 영어 회화</h2><p>' + esc(SUBTITLES['en-situations']) + '</p></div>' +
      '</div>' +
      '<div class="sit-grid">' + cards + '</div>' +
      '<div class="note" style="margin-top:24px">' + ICONS.info +
      '<div><b>상대</b>의 말을 먼저 듣고, <b>나</b>의 대답을 따라 말해 보세요. 한 줄씩 번갈아 소리 내면 실제 대화처럼 익혀집니다.</div></div>';
  }

  /* ---------------- english · 카페 대화 ---------------- */
  function viewEnCafe() {
    var rows = DIALOGUE.map(function (d) {
      var me = d.who === 'me';
      return '<div class="dlg-row' + (me ? ' me' : '') + '">' +
        '<span class="dlg-who">' + (me ? '나' : 'Mia') + '</span>' +
        '<div class="dlg-bubble">' +
        '<div class="dlg-text">' +
        '<p class="dlg-en">' + esc(d.en) + '</p>' +
        '<p class="dlg-ko">' + esc(d.ko) + '</p>' +
        (d.pron ? '<p class="dlg-pron">[' + esc(d.pron) + ']</p>' : '') +
        '</div>' +
        spkBtn(d.en, 'en', 0.95, '듣기') +
        '</div></div>';
    }).join('');

    return '' +
      '<div class="page-head">' +
      '<div><span class="eyebrow">ENGLISH · CAFE</span><h2>카페 주문 대화</h2><p>' + esc(SUBTITLES['en-cafe']) + '</p></div>' +
      '</div>' +
      '<div class="cafe-scene">' + enScene('#FBEADB', 'cafe', 'meet') + '</div>' +
      '<div class="panel cafe-panel">' +
      '<div class="section-head" style="margin:0 0 14px"><h3>주문하고 받기</h3><span class="count">' + DIALOGUE.length + '마디</span><span class="hint">Mia의 말 다음에 내 대답을 따라 해 보세요</span></div>' +
      '<div class="dialogue">' + rows + '</div>' +
      '</div>' +
      '<div class="section-head"><h3>이 대화에서 바로 쓰는 한마디</h3><span class="hint">그림을 보고 떠올려 보세요</span></div>' +
      '<div class="en-grid">' + ENGLISH.filter(function (p) { return p.cat === '카페'; }).map(enCard).join('') + '</div>' +
      '<div class="note" style="margin-top:24px">' + ICONS.info +
      '<div>처음에는 <b>Mia</b>의 말만 듣고, 다음에는 <b>나</b>의 대답을 소리 내어 따라 해 보세요. “For here or to go?”는 카페에서 가장 자주 듣는 질문이에요.</div></div>';
  }

  var VIEWS = {
    home: viewHome, kana: viewKana, vocab: viewVocab, sentences: viewSentences,
    english: viewEnglish, 'en-situations': viewEnSituations, 'en-cafe': viewEnCafe
  };

  /* ============================================================
     Render + routing + chrome (nav / language bar)
     ============================================================ */
  function renderChrome() {
    var nav = NAV[state.lang] || NAV.ja;
    var navHost = document.getElementById('nav');
    if (navHost) {
      navHost.innerHTML = nav.map(function (n) {
        return '<a href="#' + n.view + '" class="nav-item" data-act="nav" data-view="' + n.view + '">' +
          '<span class="nav-ico" aria-hidden="true">' + (ICONS[n.ico] || '') + '</span>' + n.label + '</a>';
      }).join('');
    }
    var tabHost = document.getElementById('tabbar');
    if (tabHost) {
      tabHost.innerHTML = nav.map(function (n) {
        return '<a href="#' + n.view + '" class="tab-item" data-act="nav" data-view="' + n.view + '">' +
          '<span class="tab-ico" aria-hidden="true">' + (ICONS[n.ico] || '') + '</span><span>' + n.tab + '</span></a>';
      }).join('');
    }
    $$('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === state.lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var cfg = LANGS[state.lang] || LANGS.ja;
    var note = document.getElementById('langNote');
    if (note) note.textContent = cfg.note;
    var lbl = document.getElementById('navLabel');
    if (lbl) lbl.textContent = cfg.navLabel;
    document.body.setAttribute('data-lang', state.lang);
  }

  function render() {
    var view = VIEWS[state.view] ? state.view : 'home';
    var host = document.getElementById('view');
    if (!host) return;
    renderChrome();
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

  function setHash(view) {
    if (location.hash !== '#' + view) {
      try { history.replaceState(null, '', '#' + view); } catch (e) { location.hash = view; }
    }
  }

  function go(view) {
    if (!VIEWS[view]) view = 'home';
    if (LANGS[state.lang].views.indexOf(view) === -1) {
      state.lang = LANGS.en.views.indexOf(view) !== -1 ? 'en' : 'ja';
    }
    var changed = state.view !== view;
    state.view = view;
    save();
    setHash(view);
    render();
    if (changed) window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.remove('menu-open');
  }

  function setLang(lang) {
    if (!LANGS[lang] || state.lang === lang) return;
    state.lang = lang;
    if (LANGS[lang].views.indexOf(state.view) === -1) state.view = 'home';
    save();
    setHash(state.view);
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.remove('menu-open');
    toast(lang === 'en' ? '영어 학습으로 바꿨어요 · 영어 한마디부터' : '일본어 학습으로 바꿨어요 · 가나부터', 1900);
  }

  /* ============================================================
     홈 화면에 추가 (PWA install)
     ============================================================ */
  var Install = (function () {
    var deferred = null;
    var lastOutcome = '';

    function isStandalone() {
      try {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
        if (window.matchMedia && window.matchMedia('(display-mode: minimal-ui)').matches) return true;
      } catch (e) { }
      return window.navigator.standalone === true;
    }
    function platform() {
      var ua = navigator.userAgent || '';
      var iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      return iOS ? 'ios' : (/Android/.test(ua) ? 'android' : 'other');
    }

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      paintIfOpen();
    });
    window.addEventListener('appinstalled', function () {
      deferred = null;
      lastOutcome = 'installed';
      paintIfOpen();
      toast('홈 화면에 추가됐어요! 아이콘을 눌러 바로 열 수 있어요', 3400);
    });

    function steps(list) {
      return '<ol class="steps">' + list.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol>';
    }

    function bodyHTML() {
      var here = platform();
      var html = '';
      if (isStandalone()) {
        html += '<p class="imodal-done">이미 <b>앱처럼 열린 화면</b>이에요. 홈 화면 아이콘을 눌러 바로 시작할 수 있어요.</p>';
      }
      if (deferred) {
        html += '<button type="button" class="btn btn-primary imodal-install" data-act="do-install">지금 바로 설치하기</button>' +
          '<p class="imodal-sub">버튼을 누르면 설치 창이 떠요. 한 번만 누르면 끝나요.</p>';
      } else if (lastOutcome === 'installed') {
        html += '<p class="imodal-done">설치가 끝났어요. 홈 화면에서 <b>한마디 여행</b> 아이콘을 찾아보세요.</p>';
      } else if (lastOutcome === 'accepted') {
        html += '<p class="imodal-done">설치를 진행 중이에요. 잠시 뒤 홈 화면에서 <b>한마디 여행</b> 아이콘을 확인해 보세요.</p>';
      } else if (lastOutcome === 'dismissed') {
        html += '<p class="imodal-sub">설치를 취소했어요. 아래 방법으로도 홈 화면에 추가할 수 있어요.</p>';
      } else {
        html += '<p class="imodal-sub">아래 방법으로 홈 화면에 아이콘을 만들 수 있어요. (설치 창이 뜨지 않는 브라우저예요)</p>';
      }

      html += '<div class="imodal-plat' + (here === 'android' ? ' is-here' : '') + '">' +
        '<div class="imodal-plat-head"><span class="plat-flag" aria-hidden="true">🤖</span><h3>안드로이드 · 크롬</h3>' + (here === 'android' ? '<span class="plat-now">지금 이 기기</span>' : '') + '</div>' +
        steps([
          '크롬 오른쪽 위 <b>⋮</b> 메뉴를 눌러요.',
          '<b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 골라요.',
          '<b>설치</b>를 누르면 바탕화면에 아이콘이 생겨요.'
        ]) + '</div>';

      html += '<div class="imodal-plat' + (here === 'ios' ? ' is-here' : '') + '">' +
        '<div class="imodal-plat-head"><span class="plat-flag" aria-hidden="true">🍎</span><h3>아이폰 · 아이패드 · 사파리</h3>' + (here === 'ios' ? '<span class="plat-now">지금 이 기기</span>' : '') + '</div>' +
        steps([
          '<b>사파리</b>로 이 페이지를 열고 아래 <b>공유</b> 버튼(⬆️)을 눌러요.',
          '목록에서 <b>홈 화면에 추가</b>를 골라요.',
          '오른쪽 위 <b>추가</b>를 누르면 아이콘이 생겨요.'
        ]) +
        '<p class="plat-tip">카카오톡·인스타그램 안의 브라우저에서는 안 돼요. 꼭 사파리로 열어 주세요.</p></div>';

      html += '<p class="imodal-foot">아이콘을 한 번 만들면 주소를 입력하지 않고 앱처럼 열 수 있어요.</p>';
      return html;
    }

    function paint() {
      var body = document.getElementById('installBody');
      if (body) body.innerHTML = bodyHTML();
    }
    function paintIfOpen() {
      var m = document.getElementById('installModal');
      if (m && !m.hidden) paint();
    }
    function open() {
      var m = document.getElementById('installModal');
      if (!m) return;
      lastOutcome = '';
      paint();
      m.hidden = false;
      requestAnimationFrame(function () { m.classList.add('is-open'); });
      document.body.classList.add('modal-open');
      var first = m.querySelector('[data-act="do-install"]') || m.querySelector('[data-act="close-install"]');
      if (first) { try { first.focus(); } catch (e) { } }
      updateUi();
    }
    function close() {
      var m = document.getElementById('installModal');
      if (!m) return;
      m.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      setTimeout(function () { if (!m.classList.contains('is-open')) m.hidden = true; }, 180);
    }
    function updateUi() {
      var btns = $$('[data-act="install"]');
      btns.forEach(function (b) {
        if (isStandalone()) b.setAttribute('data-state', 'installed');
      });
    }
    function promptNow() {
      if (!deferred) return false;
      var ev = deferred;
      deferred = null;
      try {
        ev.prompt();
        ev.userChoice.then(function (choice) {
          lastOutcome = (choice && choice.outcome) || 'dismissed';
          paintIfOpen();
          if (lastOutcome === 'accepted') toast('설치를 시작했어요', 2200);
          else toast('설치를 취소했어요 · 나중에 다시 추가할 수 있어요', 2600);
        }).catch(function () { paintIfOpen(); });
      } catch (e) {
        paintIfOpen();
        return false;
      }
      setTimeout(paintIfOpen, 400);
      return true;
    }
    function start() {
      if (isStandalone()) { toast('이미 홈 화면 앱처럼 열려 있어요', 2400); return; }
      open();
      if (deferred) promptNow();
    }

    return { start: start, open: open, close: close, prompt: promptNow, isStandalone: isStandalone, hasPrompt: function () { return !!deferred; } };
  })();

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
    if (act === 'lang') {
      e.preventDefault();
      setLang(el.getAttribute('data-lang'));
      return;
    }
    if (act === 'install') { e.preventDefault(); Install.start(); return; }
    if (act === 'do-install') { e.preventDefault(); Install.prompt(); return; }
    if (act === 'close-install') { e.preventDefault(); Install.close(); return; }
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
    if (act === 'qa-mode') { state.qaMode = el.getAttribute('data-mode'); save(); render(); return; }
    if (act === 'sent-cat') { state.sentCat = el.getAttribute('data-cat'); save(); render(); return; }
    if (act === 'en-cat') { state.enCat = el.getAttribute('data-cat'); save(); render(); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.body.classList.remove('menu-open');
      Install.close();
    }
  });

  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    if (!VIEWS[h] || h === state.view) return;
    var inEn = LANGS.en.views.indexOf(h) !== -1;
    var inJa = LANGS.ja.views.indexOf(h) !== -1;
    if (inEn && !inJa) state.lang = 'en';
    else if (inJa && !inEn) state.lang = 'ja';
    state.view = h;
    save();
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
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

  /* 홈 화면 추가(PWA) — 서비스 워커는 http(s)에서만 등록해요 */
  (function () {
    if (!('serviceWorker' in navigator)) return;
    if (!/^https?:$/.test(location.protocol)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { });
    });
  })();

  window.__app = {
    state: state,
    counts: {
      hiragana: KANA_HIRA.length, katakana: KANA_KATA.length, words: WORDS.length,
      sentences: SENTENCES.length, english: ENGLISH.length,
      dialogue: DIALOGUE.length, situations: EN_SITUATIONS.length
    },
    go: go,
    setLang: setLang,
    install: Install
  };
})();
