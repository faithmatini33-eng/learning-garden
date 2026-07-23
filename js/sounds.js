/* Learning Garden — sound kit (WebAudio, no audio files needed)
   Soft, kid-friendly synthesized sounds. Usage:
     GardenSounds.tap() correct() wrong() star() water() grow() cheer() key()
   All sounds are short (<700ms), gentle, and share one AudioContext. */
(function () {
  let ctx = null;
  const ac = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());

  function tone({ freq = 440, to = null, type = 'sine', dur = 0.15, vol = 0.18, delay = 0 }) {
    const a = ac();
    const t0 = a.currentTime + delay;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  function noise({ dur = 0.06, vol = 0.08, delay = 0, freq = 1800 }) {
    const a = ac();
    const t0 = a.currentTime + delay;
    const len = Math.max(1, Math.floor(a.sampleRate * dur));
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = a.createBufferSource();
    src.buffer = buf;
    const f = a.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    const g = a.createGain();
    g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination);
    src.start(t0);
  }

  window.GardenSounds = {
    // UI tap — any button press
    tap()   { tone({ freq: 620, to: 830, type: 'sine', dur: 0.07, vol: 0.12 }); },
    // typing key — softer, clicky
    key()   { noise({ dur: 0.04, vol: 0.06, freq: 2600 }); },
    // correct answer — warm two-note chime (C5 → E5)
    correct() {
      tone({ freq: 523, type: 'triangle', dur: 0.14, vol: 0.16 });
      tone({ freq: 659, type: 'triangle', dur: 0.22, vol: 0.16, delay: 0.09 });
    },
    // gentle wrong — soft low "hmm", never harsh
    wrong() { tone({ freq: 260, to: 210, type: 'sine', dur: 0.22, vol: 0.10 }); },
    // star earned — quick sparkle arpeggio up
    star() {
      [784, 988, 1319].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: 0.10, vol: 0.12, delay: i * 0.06 }));
    },
    // watering — two little bubble drops
    water() {
      tone({ freq: 520, to: 300, type: 'sine', dur: 0.10, vol: 0.12 });
      tone({ freq: 640, to: 360, type: 'sine', dur: 0.12, vol: 0.10, delay: 0.10 });
      noise({ dur: 0.08, vol: 0.04, freq: 900, delay: 0.05 });
    },
    // plant grows a stage — rising swell
    grow()  { tone({ freq: 330, to: 660, type: 'triangle', dur: 0.35, vol: 0.14 }); },
    // plan complete / level up — tiny fanfare (C E G C)
    cheer() {
      [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, type: 'triangle', dur: i === 3 ? 0.3 : 0.12, vol: 0.15, delay: i * 0.09 }));
    },
  };
})();
