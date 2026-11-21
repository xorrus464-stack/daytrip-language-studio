/* ============================================================
   Shared UI assets: icons + hero illustration
   ============================================================ */
var JP_FONT = "'Hiragino Kaku Gothic ProN','Yu Gothic','Noto Sans JP','Hiragino Sans','Malgun Gothic',sans-serif";

var ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.6 12 4l8 6.6V19a1.4 1.4 0 0 1-1.4 1.4H15v-6H9v6H5.4A1.4 1.4 0 0 1 4 19v-8.4z"/></svg>',
  kana: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.4" y="5" width="7.6" height="14" rx="2"/><rect x="13" y="5" width="7.6" height="14" rx="2"/><path d="M6 9.4h2.2M6 13h2.2M15.6 9.4h2.2M15.6 13h2.2"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.6A2 2 0 0 1 6 3.6h5v16.8H6a2 2 0 0 0-2 2V5.6z"/><path d="M20 5.6a2 2 0 0 0-2-2h-5v16.8h5a2 2 0 0 1 2 2V5.6z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.4c0 3.6-3.6 6.5-8 6.5-1 0-2-.1-2.9-.4L4 20.5l1.3-3.4A6.4 6.4 0 0 1 4 12.4C4 8.8 7.6 6 12 6s8 2.8 8 6.4z"/><path d="M8.6 11.6h6.8M8.6 14.4h4.2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8"/><path d="M12 3.6c2.4 2.3 3.6 5 3.6 8.4S14.4 18.1 12 20.4C9.6 18.1 8.4 15.4 8.4 12S9.6 5.9 12 3.6z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12h14"/><path d="m13 6.5 5.5 5.5L13 17.5"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#5C7A63" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.4"/><circle cx="12" cy="7.9" r="1" fill="#5C7A63" stroke="none"/></svg>'
};

var HERO_ART = '' +
  '<svg viewBox="0 0 340 280" role="img" aria-label="커피 한 잔과 인사말 그림" preserveAspectRatio="xMidYMid meet">' +
  '<ellipse cx="176" cy="146" rx="146" ry="118" fill="#FFF7ED" opacity=".72"/>' +
  /* left bubble */
  '<g><rect x="6" y="52" width="136" height="44" rx="15" fill="#1B4D3E"/>' +
  '<path d="M34 94l-7 15 22-13z" fill="#1B4D3E"/>' +
  '<text x="24" y="81" font-family="' + JP_FONT + '" font-size="17" fill="#F7F1E4">こんにちは</text></g>' +
  /* right bubble */
  '<g><rect x="196" y="20" width="140" height="46" rx="15" fill="#FFFFFF"/>' +
  '<path d="M300 64l10 14-24-11z" fill="#FFFFFF"/>' +
  '<text x="210" y="49" font-family="-apple-system,Segoe UI,Roboto,sans-serif" font-size="13.5" font-weight="600" fill="#3E4C43">A coffee, please.</text></g>' +
  /* plant */
  '<g><path d="M276 196h46l-6 38h-34z" fill="#DCC3A2"/>' +
  '<path d="M299 196c-2-26-14-38-28-44 3 20 11 34 28 44z" fill="#7FB392"/>' +
  '<path d="M299 196c2-24 12-36 26-42-2 20-10 33-26 42z" fill="#96C2A5"/>' +
  '<path d="M299 196c0-18 0-30 0-44" stroke="#4F7E60" stroke-width="3" stroke-linecap="round"/></g>' +
  /* mug */
  '<g><path d="M112 152h78v30c0 19-14 32-32 32h-14c-18 0-32-13-32-32z" fill="#EFA96B"/>' +
  '<path d="M190 162h9a17 17 0 0 1 0 34h-9" fill="none" stroke="#EFA96B" stroke-width="11" stroke-linecap="round"/>' +
  '<ellipse cx="151" cy="153" rx="39" ry="9" fill="#B17A4B"/>' +
  '<ellipse cx="151" cy="152" rx="31" ry="6.5" fill="#7B4A2A"/>' +
  '<ellipse cx="143" cy="150" rx="10" ry="2.6" fill="#C79A70" opacity=".55"/>' +
  '<path d="M136 190c0 8 7 14 15 14s15-6 15-14" fill="#F7C99D" opacity=".5"/>' +
  '<path d="M134 132c-6-9 6-14 0-23" stroke="#E7C7A6" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<path d="M152 128c-6-10 6-15 0-25" stroke="#E7C7A6" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<path d="M170 133c-6-9 6-14 0-22" stroke="#E7C7A6" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '</g>' +
  '<ellipse cx="151" cy="224" rx="56" ry="10" fill="#EBD4B9"/>' +
  '<path d="M36 244h272" stroke="#E7CDB1" stroke-width="7" stroke-linecap="round"/>' +
  /* sparkles */
  '<path d="M72 150l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#F2CE6B"/>' +
  '<path d="M262 116l2.4 7.2 7.2 2.4-7.2 2.4-2.4 7.2-2.4-7.2-7.2-2.4 7.2-2.4z" fill="#E9A88D"/>' +
  '<path d="M86 96l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#9DC3AA"/>' +
  '</svg>';
