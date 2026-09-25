// Najma illustration palette: Material colour roles plus a few warm mid-tones.
export const INK = '#1d3228';
export const P = {
  forest: '#315d4b', forestSoft: '#8fb5a2', mint: '#c5ebd6', mintDeep: '#9fd4b8',
  sage: '#dce6cc', sageDeep: '#b9c9a4', olive: '#59634e',
  peach: '#ffdbc9', peachDeep: '#f4b89c', terracotta: '#82533e', clay: '#c9795a',
  sand: '#f3e5cd', sandDeep: '#e2cda8', cream: '#fffaf0', paper: '#ffffff',
};
export const SKIN = ['#f5d0b5', '#e8b48f', '#c98a64', '#9c6446', '#6f4431'];

// Shared motion. Transform and opacity only. Entrances play once; ambient loops run a
// handful of times and then settle, so an idle page costs nothing to keep drawing.
// The page swaps in a still copy of each file when reduced motion is requested.
export const baseCss = `
.spin-slow{animation:settle 2.8s cubic-bezier(.2,.8,.2,1) both}
.spin-rev{animation:settle-rev 3.2s cubic-bezier(.2,.8,.2,1) both}
.breathe{animation:breathe 7s ease-in-out 3}
.float{animation:float 7s ease-in-out 4}
.float2{animation:float 8s ease-in-out -3s 4}
.pop{transform-box:fill-box;transform-origin:20% 100%;animation:pop 9s cubic-bezier(.34,1.56,.64,1) 3}
.p1{animation-delay:.5s}.p2{animation-delay:2.4s}.p3{animation-delay:4.2s}
.pop .line{transform-box:fill-box;transform-origin:0 50%;animation:type 9s ease-out 3}
.p1 .line{animation-delay:.6s}.p2 .line{animation-delay:2.5s}
.dot{animation:dot 1.2s ease-in-out 22}.d1{animation-delay:.15s}.d2{animation-delay:.3s}
.twinkle{transform-box:fill-box;transform-origin:center;animation:twinkle 4.8s ease-in-out 5}
.t2{animation-delay:1.2s}.t3{animation-delay:2.3s}.t4{animation-delay:3.1s}.t5{animation-delay:.7s}
.steam{animation:steam 3.6s ease-in-out 7}.s2{animation-delay:1.1s}
.flow{animation:flow 2.4s linear 10}
@keyframes settle{from{transform:rotate(-14deg) scale(.92);opacity:0}}
@keyframes settle-rev{from{transform:rotate(24deg) scale(.6);opacity:0}}
@keyframes breathe{50%{transform:scale(1.06)}}
@keyframes float{50%{transform:translateY(-7px)}}
@keyframes pop{0%{opacity:0;transform:scale(.6)}7%,100%{opacity:1;transform:scale(1)}}
@keyframes type{0%,6%{transform:scaleX(0)}16%,100%{transform:scaleX(1)}}
@keyframes dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
@keyframes twinkle{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(.6) rotate(45deg)}}
@keyframes steam{0%{opacity:0;transform:translateY(6px)}40%{opacity:1}100%{opacity:0;transform:translateY(-10px)}}
@keyframes flow{to{stroke-dashoffset:-26}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;
export const STILL = '*{animation:none!important}';
