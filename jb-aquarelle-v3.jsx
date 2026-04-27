import { useState, useEffect, useRef, useCallback } from "react"

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
const DEF_CFG = {
  brand: "JB AQUARELLE", tagline: "Aquarelles originales · Prints · Cartes",
  heroTitle: "Peindre\nle monde", heroSub: "Œuvres originales & éditions limitées",
  heroImg: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1800&q=85",
  accent: "#7B9E87", gold: "#C9A96E", adminPwd: "admin123", paypalId: "sb",
  promo: "🎨  Livraison offerte dès 60 € · Code BIENVENUE pour −10% sur votre 1ère commande",
  bio: "Je m'appelle JB. Aquarelliste depuis plus de 10 ans, je peins la lumière, les paysages et le vivant avec la fluidité de l'eau et la spontanéité de la couleur. Chaque œuvre est une rencontre unique entre le papier, le pigment et l'instant présent.",
  email: "contact@jbaquarelle.fr", insta: "@jb.aquarelle",
  aboutImg: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=900&q=80",
}
const DEF_PRODS = [
  { id:1, name:"Brume d'Été", price:220, cat:"Tableau original", desc:"Aquarelle originale sur papier Arches 300g. Pièce unique signée, livrée avec certificat d'authenticité. Format 30×40 cm.", img:"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80", stock:1, featured:true, isnew:true },
  { id:2, name:"Côte Sauvage", price:180, cat:"Tableau original", desc:"Aquarelle originale sur papier Fabriano 300g. Paysage marin aux tons bleutés. Format 24×32 cm.", img:"https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=800&q=80", stock:1, featured:true, isnew:false },
  { id:3, name:"Forêt de Lumière", price:280, cat:"Tableau original", desc:"Grande aquarelle originale, jeu de lumière en sous-bois. Format 40×50 cm, papier Arches 300g.", img:"https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80", stock:1, featured:true, isnew:false },
  { id:4, name:"Brume d'Été — Print", price:38, cat:"Print / Reproduction", desc:"Giclée fine art sur Hahnemühle 308g. Tirage limité 30 exemplaires numérotés et signés. Format 30×40 cm.", img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80", stock:12, featured:false, isnew:false },
  { id:5, name:"Côte Sauvage — Print", price:35, cat:"Print / Reproduction", desc:"Giclée fine art sur Hahnemühle 308g. Tirage limité 30 exemplaires numérotés et signés. Format 24×32 cm.", img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", stock:8, featured:false, isnew:false },
  { id:6, name:"Jardin Secret — Print", price:42, cat:"Print / Reproduction", desc:"Giclée fine art sur Hahnemühle 308g. Tirage limité 20 exemplaires. Format 40×50 cm.", img:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", stock:3, featured:false, isnew:true },
  { id:7, name:"Série Botanica — Pack 4", price:14, cat:"Carte postale", desc:"Lot de 4 cartes postales aquarelle. Impression offset 350g, dorso blanc. Format 10×15 cm.", img:"https://images.unsplash.com/photo-1490750967868-88df5691cc4a?w=800&q=80", stock:40, featured:false, isnew:false },
  { id:8, name:"Marine", price:4, cat:"Carte postale", desc:"Carte postale aquarelle, impression offset 350g. Format 10×15 cm, vendue à l'unité.", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", stock:60, featured:false, isnew:false },
  { id:9, name:"Botanique", price:4, cat:"Carte postale", desc:"Carte postale aquarelle, impression offset 350g. Format 10×15 cm, vendue à l'unité.", img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", stock:45, featured:false, isnew:true },
]
const ORDERS = [
  { id:"JBA-041", date:"22 avr. 2025", customer:"Marie L.", total:222, items:"Brume d'Été Print ×2, Marine ×2", status:"Expédié" },
  { id:"JBA-040", date:"19 avr. 2025", customer:"Thomas R.", total:220, items:"Brume d'Été (Original)", status:"En cours" },
  { id:"JBA-039", date:"15 avr. 2025", customer:"Sophie M.", total:56, items:"Série Botanica ×4", status:"Livré" },
  { id:"JBA-038", date:"10 avr. 2025", customer:"Julien B.", total:280, items:"Forêt de Lumière (Original)", status:"Livré" },
  { id:"JBA-037", date:"04 avr. 2025", customer:"Claire D.", total:77, items:"Jardin Secret Print, Botanica ×2", status:"Livré" },
]
const INSTA = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80",
  "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=400&q=80",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
  "https://images.unsplash.com/photo-1490750967868-88df5691cc4a?w=400&q=80",
]
const CATS = ["Tous","Tableau original","Print / Reproduction","Carte postale"]

// ═══════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════
const buildCss = (a, g) => `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@200;300;400;500&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--bg:#FAFAF8;--bg2:#F2EEE8;--ink:#1A1814;--ink2:#7A736C;--a:${a};--g:${g};--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',Helvetica,sans-serif;}
html{scroll-behavior:smooth;}body{background:var(--bg);color:var(--ink);font-family:var(--sans);}
/* SPLASH */
.splash{position:fixed;inset:0;z-index:9999;background:var(--ink);display:flex;align-items:center;justify-content:center;transition:opacity .7s ease .8s,visibility .7s ease .8s;}
.splash.done{opacity:0;visibility:hidden;pointer-events:none;}
.splash-brand{font-family:var(--serif);font-size:clamp(18px,3.5vw,32px);color:var(--bg);letter-spacing:.45em;text-transform:uppercase;animation:sIn 1s ease forwards;}
@keyframes sIn{from{opacity:0;letter-spacing:.7em;}to{opacity:1;letter-spacing:.45em;}}
/* PROMO */
.promo{background:var(--ink);color:rgba(250,250,248,.75);font-family:var(--sans);font-size:11px;letter-spacing:.09em;text-align:center;padding:9px 52px;position:relative;}
.promo-x{position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(250,250,248,.4);font-size:18px;line-height:1;transition:color .2s;}
.promo-x:hover{color:rgba(250,250,248,.9);}
/* NAV */
.nav{position:sticky;top:0;z-index:100;height:68px;background:rgba(250,250,248,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(26,24,20,.07);display:flex;align-items:center;justify-content:space-between;padding:0 44px;}
.nav-brand{font-family:var(--serif);font-size:16px;letter-spacing:.28em;text-transform:uppercase;cursor:pointer;}
.nav-links{display:flex;gap:32px;}
.nl{font-family:var(--sans);font-size:10.5px;font-weight:300;letter-spacing:.13em;text-transform:uppercase;background:none;border:none;cursor:pointer;color:var(--ink);opacity:.5;position:relative;padding-bottom:3px;transition:opacity .2s;}
.nl::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--a);transform:scaleX(0);transform-origin:left;transition:transform .28s;}
.nl:hover,.nl.act{opacity:1;}.nl:hover::after,.nl.act::after{transform:scaleX(1);}
.nav-r{display:flex;align-items:center;gap:20px;}
.nic{background:none;border:none;cursor:pointer;color:var(--ink);font-size:18px;opacity:.55;transition:opacity .2s;position:relative;padding:4px;}
.nic:hover{opacity:1;}
.nbadge{position:absolute;top:-4px;right:-5px;width:16px;height:16px;border-radius:50%;background:var(--a);color:#fff;font-size:9px;font-family:var(--sans);display:flex;align-items:center;justify-content:center;font-weight:500;}
.burger{display:none;background:none;border:none;cursor:pointer;font-size:20px;color:var(--ink);}
/* SEARCH OVERLAY */
.srch-ov{position:fixed;inset:0;z-index:500;background:var(--bg);opacity:0;pointer-events:none;transition:opacity .3s;display:flex;flex-direction:column;padding:90px 44px 44px;}
.srch-ov.on{opacity:1;pointer-events:all;}
.srch-close{align-self:flex-end;margin-bottom:48px;background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink);opacity:.4;}
.srch-label{font-family:var(--sans);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--a);margin-bottom:14px;}
.srch-inp{width:100%;max-width:700px;background:none;border:none;border-bottom:1px solid var(--ink);font-family:var(--serif);font-size:clamp(28px,5vw,56px);font-style:italic;color:var(--ink);outline:none;padding-bottom:14px;}
.srch-results{margin-top:36px;max-width:700px;display:flex;flex-direction:column;gap:2px;}
.srch-item{display:flex;align-items:center;gap:18px;padding:14px 0;cursor:pointer;border-bottom:1px solid var(--bg2);}
.srch-item img{width:48px;height:60px;object-fit:cover;}
.si-name{font-family:var(--serif);font-size:18px;}.si-price{font-family:var(--sans);font-size:12px;color:var(--ink2);margin-top:4px;}
/* MOBILE MENU */
.mob-menu{position:fixed;inset:0;z-index:400;background:var(--bg);transform:translateX(-100%);transition:transform .42s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;padding:90px 36px 44px;gap:4px;}
.mob-menu.on{transform:translateX(0);}
.mm-link{font-family:var(--serif);font-size:clamp(32px,7vw,48px);font-style:italic;background:none;border:none;cursor:pointer;color:var(--ink);text-align:left;padding:8px 0;opacity:.85;transition:opacity .2s;}
.mm-link:hover{opacity:1;}
.mm-close{position:absolute;top:22px;right:36px;background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.4;}
/* HERO */
.hero{height:calc(100vh - 68px);position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:0 44px 80px;}
.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;animation:hz 16s ease-in-out infinite alternate;}
@keyframes hz{from{transform:scale(1);}to{transform:scale(1.05);}}
.hero-ov{position:absolute;inset:0;background:linear-gradient(155deg,rgba(26,24,20,.06) 0%,rgba(26,24,20,.64) 100%);}
.hero-grain{position:absolute;inset:0;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:100px;}
.hero-c{position:relative;z-index:2;}
.hero-ey{font-family:var(--sans);font-size:10px;font-weight:300;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:18px;display:flex;align-items:center;gap:16px;}
.hero-ey::before{content:'';display:block;width:28px;height:1px;background:rgba(255,255,255,.38);}
.hero-title{font-family:var(--serif);font-size:clamp(68px,10.5vw,148px);font-weight:400;font-style:italic;color:#fff;line-height:.9;white-space:pre-line;}
.hero-acts{display:flex;gap:14px;margin-top:48px;align-items:center;flex-wrap:wrap;}
.hero-btn{font-family:var(--sans);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;padding:15px 42px;border:1px solid rgba(255,255,255,.5);color:#fff;background:none;transition:all .28s;}
.hero-btn:hover{background:#fff;color:var(--ink);border-color:#fff;}
.hero-scroll{position:absolute;bottom:30px;right:44px;z-index:2;font-family:var(--sans);font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.38);writing-mode:vertical-rl;display:flex;align-items:center;gap:10px;}
.hero-scroll::before{content:'';width:1px;height:36px;background:rgba(255,255,255,.28);display:block;}
/* SECTIONS */
.sec{padding:96px 44px;}
.sec-sm{padding:56px 44px;}
.ey{font-family:var(--sans);font-size:10px;font-weight:400;letter-spacing:.24em;text-transform:uppercase;color:var(--a);margin-bottom:14px;}
.sec-title{font-family:var(--serif);font-size:clamp(36px,5vw,70px);font-weight:400;font-style:italic;line-height:1.04;margin-bottom:52px;}
/* GRID & CARDS */
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:3px;}
.ga{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:3px;}
.card{cursor:pointer;background:#fff;position:relative;overflow:hidden;}
.card-iw{overflow:hidden;position:relative;}
.card-img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block;transition:transform .8s cubic-bezier(.4,0,.2,1);}
.card:hover .card-img{transform:scale(1.06);}
.cbadges{position:absolute;top:12px;left:12px;display:flex;flex-direction:column;gap:5px;}
.b-new{background:var(--a);color:#fff;font-family:var(--sans);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 10px;}
.b-unique{background:var(--g);color:#fff;font-family:var(--sans);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 10px;}
.b-limited{background:var(--ink);color:#fff;font-family:var(--sans);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 10px;}
.cwish{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:50%;background:rgba(250,250,248,.9);backdrop-filter:blur(8px);border:none;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;}
.card:hover .cwish,.cwish.on{opacity:1;}
.card-body{padding:16px 20px 24px;}
.cc{font-family:var(--sans);font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--a);margin-bottom:7px;}
.cn{font-family:var(--serif);font-size:18px;margin-bottom:5px;}
.cp{font-family:var(--sans);font-size:13px;color:var(--ink2);}
/* BAND */
.band{background:var(--ink);padding:88px 44px;text-align:center;}
.band-q{font-family:var(--serif);font-size:clamp(28px,4.5vw,60px);font-style:italic;color:var(--bg);line-height:1.22;}
.band-q span{color:var(--g);}
/* ABOUT TEASER */
.at{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
.at img{width:100%;aspect-ratio:4/5;object-fit:cover;}
.at-t{font-family:var(--serif);font-size:clamp(28px,3.5vw,46px);font-style:italic;line-height:1.18;margin-bottom:24px;}
.at-p{font-family:var(--sans);font-size:14px;font-weight:300;line-height:1.9;color:var(--ink2);margin-bottom:32px;}
/* INSTAGRAM */
.ig-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:3px;}
.ig-cell{position:relative;overflow:hidden;cursor:pointer;}
.ig-cell img{width:100%;aspect-ratio:1;object-fit:cover;display:block;transition:transform .6s;}
.ig-cell:hover img{transform:scale(1.07);}
.ig-ov{position:absolute;inset:0;background:rgba(26,24,20,.42);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .28s;color:#fff;font-family:var(--sans);font-size:11px;letter-spacing:.12em;text-transform:uppercase;}
.ig-cell:hover .ig-ov{opacity:1;}
/* NEWSLETTER */
.nl-sec{background:var(--bg2);padding:80px 44px;text-align:center;}
.nl-t{font-family:var(--serif);font-size:clamp(26px,4vw,50px);font-style:italic;margin-bottom:12px;}
.nl-s{font-family:var(--sans);font-size:13.5px;font-weight:300;color:var(--ink2);margin-bottom:36px;}
.nl-form{display:flex;max-width:480px;margin:0 auto;gap:0;}
.nl-inp{flex:1;padding:15px 20px;border:1px solid #ddd;border-right:none;font-family:var(--sans);font-size:13px;background:#fff;outline:none;}
.nl-inp:focus{border-color:var(--a);}
.nl-btn{padding:15px 28px;background:var(--ink);color:var(--bg);font-family:var(--sans);font-size:10px;letter-spacing:.18em;text-transform:uppercase;border:none;cursor:pointer;white-space:nowrap;transition:background .25s;}
.nl-btn:hover{background:var(--a);}
/* SHOP TABS */
.tabs-bar{display:flex;border-bottom:1px solid #e4dfd8;margin-bottom:40px;overflow-x:auto;}
.tab-btn{font-family:var(--sans);font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:14px 26px;background:none;border:none;cursor:pointer;color:var(--ink);opacity:.38;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px;transition:opacity .2s,border-color .2s;}
.tab-btn.on{opacity:1;border-bottom-color:var(--a);}
.sort-row{display:flex;justify-content:flex-end;align-items:center;gap:12px;margin-bottom:20px;}
.sort-lbl{font-family:var(--sans);font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.4;}
.sort-sel{font-family:var(--sans);font-size:12px;background:#fff;border:1px solid #ddd;padding:8px 14px;cursor:pointer;outline:none;color:var(--ink);}
/* PRODUCT PAGE */
.pd{display:grid;grid-template-columns:1fr 1fr;min-height:100vh;}
.pd-gal{overflow:hidden;}
.pd-img{width:100%;height:100vh;object-fit:cover;position:sticky;top:0;}
.pd-info{padding:70px 64px 80px;}
.pd-back{display:inline-flex;align-items:center;gap:10px;margin-bottom:48px;font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);opacity:.4;background:none;border:none;cursor:pointer;transition:opacity .2s;}
.pd-back:hover{opacity:1;}
.pd-badge{display:inline-block;font-family:var(--sans);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--a);border:1px solid var(--a);padding:5px 14px;margin-bottom:20px;}
.pd-name{font-family:var(--serif);font-size:clamp(34px,5vw,58px);font-style:italic;line-height:1.06;margin-bottom:16px;}
.pd-price{font-family:var(--sans);font-size:24px;font-weight:300;margin-bottom:8px;}
.pd-avail{font-family:var(--sans);font-size:10px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:36px;}.pd-avail.unique{color:var(--g);}.pd-avail.low{color:#c0392b;}.pd-avail.ok{color:var(--a);}
.pd-desc{font-family:var(--sans);font-size:14px;font-weight:300;line-height:1.9;color:var(--ink2);margin-bottom:36px;}
.pd-specs{border-top:1px solid #e4dfd8;padding-top:26px;margin-bottom:40px;display:flex;flex-direction:column;gap:12px;}
.spec{display:flex;gap:16px;font-family:var(--sans);font-size:13px;}
.spec-k{width:110px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink2);flex-shrink:0;padding-top:1px;}
.pd-acts{display:flex;gap:10px;flex-wrap:wrap;}
/* ACCORDION */
.acc{border-top:1px solid #e4dfd8;margin-top:32px;}
.acc-item{border-bottom:1px solid #e4dfd8;}
.acc-btn{width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 0;background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);text-align:left;}
.acc-icon{font-size:20px;transition:transform .28s;color:var(--ink2);}
.acc-icon.o{transform:rotate(45deg);}
.acc-body{font-family:var(--sans);font-size:13.5px;font-weight:300;line-height:1.85;color:var(--ink2);padding-bottom:18px;}
/* RELATED */
.related{padding:72px 44px;background:var(--bg2);}
.rel-t{font-family:var(--serif);font-size:30px;font-style:italic;margin-bottom:32px;}
/* ABOUT PAGE */
.about-hero{height:72vh;position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:0 44px 72px;}
.about-hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;}
.about-hero-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,24,20,.68) 0%,rgba(26,24,20,.1) 55%);}
.about-hero-t{position:relative;z-index:2;font-family:var(--serif);font-size:clamp(44px,7.5vw,100px);font-style:italic;color:#fff;font-weight:400;}
.about-body{display:grid;grid-template-columns:1fr 1fr;gap:80px;padding:80px 44px;align-items:start;}
.about-big-q{font-family:var(--serif);font-size:clamp(24px,3.5vw,42px);font-style:italic;line-height:1.3;margin-bottom:28px;}
.about-txt{font-family:var(--sans);font-size:14px;font-weight:300;line-height:1.9;color:var(--ink2);}
.process{background:var(--bg2);padding:80px 44px;}
.proc-g{display:grid;grid-template-columns:repeat(3,1fr);gap:52px;margin-top:52px;}
.proc-n{font-family:var(--serif);font-size:56px;font-style:italic;color:var(--a);opacity:.35;line-height:1;margin-bottom:14px;}
.proc-t{font-family:var(--serif);font-size:22px;font-style:italic;margin-bottom:10px;}
.proc-p{font-family:var(--sans);font-size:13.5px;font-weight:300;line-height:1.8;color:var(--ink2);}
/* CONTACT PAGE */
.contact{display:grid;grid-template-columns:1fr 1fr;min-height:100vh;}
.contact-l{background:var(--ink);padding:80px 52px;display:flex;flex-direction:column;justify-content:space-between;}
.contact-l-t{font-family:var(--serif);font-size:clamp(38px,5vw,70px);font-style:italic;color:var(--bg);line-height:1.06;}
.cinfo{display:flex;flex-direction:column;gap:22px;}
.cir{display:flex;flex-direction:column;gap:4px;}
.ci-lbl{font-family:var(--sans);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(250,250,248,.38);}
.ci-v{font-family:var(--sans);font-size:13.5px;color:var(--bg);font-weight:300;}
.contact-r{padding:80px 52px;}
.contact-r-t{font-family:var(--serif);font-size:34px;font-style:italic;margin-bottom:40px;}
/* WISHLIST */
.wl-page{padding:80px 44px;}
.wl-t{font-family:var(--serif);font-size:clamp(34px,5vw,68px);font-style:italic;margin-bottom:48px;}
.empty{padding:80px 44px;text-align:center;}
.empty-ic{font-size:52px;margin-bottom:24px;}
.empty-t{font-family:var(--serif);font-size:38px;font-style:italic;margin-bottom:12px;}
.empty-s{font-family:var(--sans);font-size:14px;color:var(--ink2);margin-bottom:36px;line-height:1.7;}
/* LEGAL */
.legal{padding:80px 44px;max-width:820px;}
.legal-t{font-family:var(--serif);font-size:clamp(34px,5vw,68px);font-style:italic;margin-bottom:48px;}
.legal-s{margin-bottom:40px;}
.legal-s h3{font-family:var(--serif);font-size:22px;font-style:italic;margin-bottom:12px;}
.legal-s p{font-family:var(--sans);font-size:13.5px;font-weight:300;line-height:1.85;color:var(--ink2);}
/* CHECKOUT */
.ck{display:grid;grid-template-columns:1fr 1fr;min-height:100vh;}
.ck-l{padding:72px 52px;}.ck-r{background:var(--bg2);padding:72px 52px;}
.ck-t{font-family:var(--serif);font-size:clamp(28px,4vw,50px);font-style:italic;margin-bottom:44px;}
.ck-item{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #e4dfd8;}
.ck-item img{width:68px;height:84px;object-fit:cover;flex-shrink:0;}
.cki-n{font-family:var(--serif);font-size:15px;}
.cki-c{font-family:var(--sans);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2);margin:3px 0;}
.cki-p{font-family:var(--sans);font-size:13px;color:var(--a);}
.ck-total{display:flex;justify-content:space-between;padding:24px 0;margin-bottom:32px;}
.ct-l{font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink2);}
.ct-v{font-family:var(--serif);font-size:28px;font-style:italic;}
.pay-tabs{display:flex;gap:2px;margin-bottom:24px;}
.ptab{flex:1;padding:13px;background:#fff;border:1px solid #ddd;font-family:var(--sans);font-size:10px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .22s;color:var(--ink);}
.ptab.on{background:var(--ink);color:var(--bg);border-color:var(--ink);}
.pay-note{padding:16px 18px;background:#fff;border-left:3px solid var(--a);font-family:var(--sans);font-size:12px;font-weight:300;color:var(--ink2);line-height:1.7;}
/* CONFIRM */
.confirm{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:40px;}
.cf-ic{font-size:56px;margin-bottom:28px;}
.cf-t{font-family:var(--serif);font-size:clamp(44px,8vw,90px);font-style:italic;margin-bottom:14px;}
.cf-ref{font-family:var(--sans);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--a);margin-bottom:16px;}
.cf-s{font-family:var(--sans);font-size:14px;color:var(--ink2);line-height:1.8;margin-bottom:48px;}
/* CART DRAWER */
.ov{position:fixed;inset:0;z-index:200;background:rgba(26,24,20,.36);opacity:0;pointer-events:none;transition:opacity .32s;}
.ov.on{opacity:1;pointer-events:all;}
.drawer{position:fixed;right:0;top:0;bottom:0;z-index:201;width:430px;max-width:95vw;background:var(--bg);padding:44px;transform:translateX(110%);transition:transform .42s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;overflow-y:auto;}
.drawer.on{transform:translateX(0);}
.dr-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:38px;}
.dr-t{font-family:var(--serif);font-size:30px;font-style:italic;}
.dr-x{background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);opacity:.4;}
.ci{display:flex;gap:16px;padding:22px 0;border-bottom:1px solid #e4dfd8;}
.ci img{width:68px;height:86px;object-fit:cover;flex-shrink:0;}
.ci-n{font-family:var(--serif);font-size:16px;margin-bottom:4px;}
.ci-cat{font-family:var(--sans);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--a);margin-bottom:12px;}
.ci-p{font-family:var(--sans);font-size:13px;color:var(--ink2);margin-bottom:12px;}
.qty{display:flex;align-items:center;gap:12px;}
.qb{width:28px;height:28px;border:1px solid #d8d3cc;background:none;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .18s;}
.qb:hover{background:var(--ink);color:var(--bg);border-color:var(--ink);}
.qn{font-family:var(--sans);font-size:13px;min-width:18px;text-align:center;}
.rm{background:none;border:none;cursor:pointer;font-family:var(--sans);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#c0c0bb;margin-top:8px;display:block;transition:color .2s;}
.rm:hover{color:#c0392b;}
.dr-foot{margin-top:auto;padding-top:28px;}
.dr-tot{display:flex;justify-content:space-between;margin-bottom:22px;}
.dt-l{font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.45;}
.dt-v{font-family:var(--serif);font-size:26px;font-style:italic;}
/* BUTTONS */
.btn{font-family:var(--sans);font-size:10.5px;font-weight:400;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;padding:16px 36px;border:none;transition:all .25s;}
.btn-d{background:var(--ink);color:var(--bg);}.btn-d:hover{background:var(--a);}
.btn-w{width:100%;padding:18px;}
.btn-o{background:none;color:var(--ink);border:1px solid var(--ink);padding:16px 36px;}.btn-o:hover{background:var(--ink);color:var(--bg);}
.btn-sm{padding:11px 22px;font-size:9.5px;}
.btn-danger{background:none;color:#c0392b;border:1px solid #c0392b;padding:15px 28px;font-family:var(--sans);font-size:10px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:all .22s;}
.btn-danger:hover{background:#c0392b;color:#fff;}
/* FORMS */
.fg{margin-bottom:18px;}
.flbl{font-family:var(--sans);font-size:9.5px;letter-spacing:.17em;text-transform:uppercase;opacity:.5;display:block;margin-bottom:8px;}
.fi{width:100%;padding:13px 16px;background:var(--bg);border:1px solid #dad5ce;font-family:var(--sans);font-size:13.5px;color:var(--ink);outline:none;transition:border-color .2s;}
.fi:focus{border-color:var(--a);}
textarea.fi{min-height:110px;resize:vertical;}
select.fi{cursor:pointer;}
/* ADMIN */
.adm{padding:60px 44px 80px;}
.adm-h{font-family:var(--serif);font-size:clamp(34px,5vw,62px);font-style:italic;margin-bottom:6px;}
.adm-sub{font-family:var(--sans);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--a);margin-bottom:48px;}
.stats-g{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:64px;}
.sc{background:#fff;padding:26px;}
.sc-v{font-family:var(--serif);font-size:44px;font-style:italic;line-height:1;}
.sc-l{font-family:var(--sans);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;opacity:.38;margin-top:8px;}
.sc-tr{font-family:var(--sans);font-size:11px;color:var(--a);margin-top:5px;}
.adm-s{margin-bottom:60px;}
.adm-sh{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #e4dfd8;}
.adm-st{font-family:var(--sans);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--a);}
.ot{width:100%;border-collapse:collapse;}
.ot th{font-family:var(--sans);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink2);padding:10px 14px;text-align:left;border-bottom:1px solid #e4dfd8;}
.ot td{font-family:var(--sans);font-size:12.5px;font-weight:300;padding:14px;border-bottom:1px solid #f2eee8;}
.sbadge{display:inline-block;padding:4px 12px;font-family:var(--sans);font-size:9px;letter-spacing:.12em;text-transform:uppercase;}
.s-Livré{background:rgba(123,158,135,.14);color:var(--a);}
.s-Expédié{background:rgba(201,169,110,.14);color:var(--g);}
.s-En_cours{background:rgba(26,24,20,.07);color:var(--ink2);}
.alert-low{background:rgba(192,57,43,.06);border-left:3px solid #c0392b;padding:13px 18px;margin-bottom:12px;font-family:var(--sans);font-size:12.5px;display:flex;justify-content:space-between;align-items:center;}
.adm-pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;}
.apc{background:#fff;padding:14px;cursor:pointer;border:2px solid transparent;transition:all .22s;}
.apc:hover{border-color:var(--a);}
.apc img{width:100%;aspect-ratio:1;object-fit:cover;margin-bottom:10px;}
.apc-n{font-family:var(--serif);font-size:15px;}
.apc-c{font-family:var(--sans);font-size:8.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--a);margin-top:3px;}
.apc-p{font-family:var(--sans);font-size:12px;color:var(--ink2);margin-top:2px;}
.apc-st{font-family:var(--sans);font-size:10px;margin-top:3px;}
.apc-st.low{color:#c0392b;}
.adm-add{background:#fff;display:flex;align-items:center;justify-content:center;min-height:150px;border:2px dashed #ddd;cursor:pointer;transition:border-color .2s;}
.adm-add:hover{border-color:var(--a);}
/* LOGIN */
.lp{min-height:100vh;display:flex;}
.lp-l{flex:1;background-size:cover;background-position:center;}
.lp-r{width:430px;display:flex;align-items:center;justify-content:center;padding:44px;background:var(--bg);}
.lp-t{font-family:var(--serif);font-size:38px;font-style:italic;margin-bottom:6px;}
.lp-s{font-family:var(--sans);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--a);margin-bottom:44px;}
/* MODAL */
.modal-ov{position:fixed;inset:0;z-index:300;background:rgba(26,24,20,.48);display:flex;align-items:center;justify-content:center;padding:24px;}
.modal{background:var(--bg);padding:50px;max-width:580px;width:100%;max-height:92vh;overflow-y:auto;}
.modal-t{font-family:var(--serif);font-size:34px;font-style:italic;margin-bottom:34px;}
.macts{display:flex;gap:10px;margin-top:32px;flex-wrap:wrap;}
/* TOAST */
.toast{position:fixed;top:84px;right:24px;z-index:700;background:var(--ink);color:var(--bg);padding:13px 24px;font-family:var(--sans);font-size:11px;letter-spacing:.1em;text-transform:uppercase;pointer-events:none;transition:all .35s cubic-bezier(.4,0,.2,1);}
/* COOKIE */
.cookie{position:fixed;bottom:0;left:0;right:0;z-index:800;background:var(--ink);padding:18px 44px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;}
.cookie-t{font-family:var(--sans);font-size:12px;color:rgba(250,250,248,.65);line-height:1.6;flex:1;}
.cookie-btns{display:flex;gap:10px;flex-shrink:0;}
.ck-acc{background:var(--a);color:#fff;border:none;padding:10px 24px;font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;}
.ck-ref{background:none;color:rgba(250,250,248,.45);border:1px solid rgba(250,250,248,.2);padding:10px 24px;font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;}
/* FOOTER */
.footer{background:var(--ink);padding:80px 44px 44px;}
.ft{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:52px;margin-bottom:60px;}
.fb{font-family:var(--serif);font-size:22px;font-style:italic;color:var(--bg);margin-bottom:12px;}
.ftag{font-family:var(--sans);font-size:12px;color:rgba(250,250,248,.32);line-height:1.7;max-width:220px;}
.fch{font-family:var(--sans);font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(250,250,248,.3);margin-bottom:18px;}
.flink{display:block;font-family:var(--sans);font-size:12.5px;color:rgba(250,250,248,.55);background:none;border:none;cursor:pointer;text-align:left;padding:5px 0;transition:color .2s;}
.flink:hover{color:var(--bg);}
.fbot{border-top:1px solid rgba(250,250,248,.09);padding-top:26px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
.fcopy{font-family:var(--sans);font-size:11px;color:rgba(250,250,248,.25);}
.fleg{display:flex;gap:24px;}
.fleg button{font-family:var(--sans);font-size:11px;color:rgba(250,250,248,.25);background:none;border:none;cursor:pointer;transition:color .2s;}
.fleg button:hover{color:rgba(250,250,248,.65);}
/* RESPONSIVE */
@media(max-width:1100px){
  .g4,.g3,.proc-g{grid-template-columns:repeat(2,1fr);}
  .stats-g{grid-template-columns:repeat(2,1fr);}
  .at,.about-body,.contact,.pd,.ck{grid-template-columns:1fr;}
  .pd-img{height:65vw;position:static;}
  .ft{grid-template-columns:1fr 1fr;gap:36px;}
  .ig-grid{grid-template-columns:repeat(3,1fr);}
  .lp-l{display:none;}.lp-r{width:100%;}
}
@media(max-width:700px){
  .nav{padding:0 20px;}.nav-links{display:none;}.burger{display:flex;}
  .hero,.sec,.sec-sm,.band,.nl-sec,.process,.related,.about-body,.adm,.wl-page,.legal,.ck-l,.ck-r,.contact-l,.contact-r,.pd-info{padding-left:20px;padding-right:20px;}
  .footer,.cookie{padding-left:20px;padding-right:20px;}
  .ga,.g3,.g4,.adm-pg{grid-template-columns:repeat(2,1fr);}
  .ig-grid{grid-template-columns:repeat(2,1fr);}
  .stats-g{grid-template-columns:repeat(2,1fr);}
  .drawer{width:100vw;}
  .ft{grid-template-columns:1fr;}
  .modal{padding:32px 20px;}
  .hero-scroll{display:none;}
  .about-hero{height:50vh;}
  .ck{grid-template-columns:1fr;}
  .ot td,.ot th{padding:10px 8px;font-size:11px;}
}
`

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [cfg, setCfg] = useState(DEF_CFG)
  const [products, setProducts] = useState(DEF_PRODS)
  const [page, setPage] = useState("home")
  const [prod, setProd] = useState(null)
  // Shop
  const [cat, setCat] = useState("Tous")
  const [sort, setSort] = useState("Nouveautés")
  // Cart & Wishlist
  const [cart, setCart] = useState([])
  const [wish, setWish] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  // UI
  const [splashDone, setSplashDone] = useState(false)
  const [showPromo, setShowPromo] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState("")
  const [showCookie, setShowCookie] = useState(true)
  const [toast, setToast] = useState({ msg:"", vis:false })
  const [openAcc, setOpenAcc] = useState(null)
  const [nlDone, setNlDone] = useState(false)
  const [cfDone, setCfDone] = useState(false)
  // Checkout
  const [payTab, setPayTab] = useState("paypal")
  const [orderDone, setOrderDone] = useState(false)
  const [orderRef, setOrderRef] = useState("")
  // Admin
  const [adminIn, setAdminIn] = useState(false)
  const [adminPass, setAdminPass] = useState("")
  const [editP, setEditP] = useState(null)
  const [isNewP, setIsNewP] = useState(false)
  const [showCfg, setShowCfg] = useState(false)
  const [cfgDraft, setCfgDraft] = useState(DEF_CFG)
  // Contact form
  const [cfForm, setCfForm] = useState({ name:"", email:"", msg:"" })
  const [cfSent, setCfSent] = useState(false)

  // Splash
  useEffect(() => { const t = setTimeout(() => setSplashDone(true), 2400); return () => clearTimeout(t) }, [])

  // Derived
  const cartTotal = cart.reduce((s,i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s,i) => s + i.qty, 0)
  const totalRevenue = [222,220,56,280,77].reduce((a,b)=>a+b,0)
  const lowStock = products.filter(p => p.stock <= 3)

  let filtered = cat === "Tous" ? [...products] : products.filter(p => p.cat === cat)
  if (sort === "Prix croissant") filtered.sort((a,b) => a.price - b.price)
  else if (sort === "Prix décroissant") filtered.sort((a,b) => b.price - a.price)

  const searchResults = searchQ.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.cat.toLowerCase().includes(searchQ.toLowerCase()))
    : []

  const showToast = (msg) => {
    setToast({ msg, vis:true })
    setTimeout(() => setToast({ msg:"", vis:false }), 2200)
  }

  const nav = useCallback((p, product=null) => {
    setPage(p); if(product) setProd(product)
    setCartOpen(false); setMenuOpen(false); setSearchOpen(false)
    window.scrollTo(0,0)
  }, [])

  const addToCart = useCallback((p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id)
      return ex ? prev.map(i => i.id===p.id ? {...i, qty:i.qty+1} : i) : [...prev, {...p, qty:1}]
    })
    setCartOpen(true); showToast("Ajouté au panier")
  }, [])

  const updateQty = (id, qty) => {
    if(qty<=0) setCart(prev => prev.filter(i=>i.id!==id))
    else setCart(prev => prev.map(i => i.id===id ? {...i,qty} : i))
  }

  const toggleWish = (p) => {
    setWish(prev => prev.includes(p.id) ? prev.filter(i=>i!==p.id) : [...prev, p.id])
    showToast(wish.includes(p.id) ? "Retiré des favoris" : "Ajouté aux favoris ♡")
  }

  // PayPal
  useEffect(() => {
    if(page !== "checkout" || orderDone || payTab !== "paypal") return
    const load = () => {
      const ex = document.getElementById("pp-sdk")
      if(ex) { renderPP(); return }
      const s = document.createElement("script")
      s.id = "pp-sdk"
      s.src = `https://www.paypal.com/sdk/js?client-id=${cfg.paypalId}&currency=EUR`
      s.onload = renderPP
      document.body.appendChild(s)
    }
    load()
  }, [page, orderDone, payTab, cartTotal])

  const renderPP = () => {
    setTimeout(() => {
      const el = document.getElementById("paypal-btn")
      if(!el || !window.paypal) return
      el.innerHTML = ""
      window.paypal.Buttons({
        style: { layout:"vertical", color:"black", shape:"rect", label:"pay" },
        createOrder: (_,a) => a.order.create({ purchase_units:[{ amount:{ value:cartTotal.toFixed(2), currency_code:"EUR" } }] }),
        onApprove: (_,a) => a.order.capture().then(() => {
          const ref = "JBA-" + Math.floor(Math.random()*9000+1000)
          setCart([]); setOrderRef(ref); setOrderDone(true)
        }),
        onError: () => alert("Erreur PayPal. Réessayez.")
      }).render("#paypal-btn")
    }, 380)
  }

  // ── PRODUCT DETAIL helpers ──────────────────────────────
  const relatedProds = prod ? products.filter(p => p.id !== prod.id && p.cat === prod.cat).slice(0,3) : []
  const getAvail = (p) => {
    if(p.cat === "Tableau original") return { label:"Pièce unique — 1 disponible", cls:"unique" }
    if(p.stock <= 3) return { label:`Stock limité — ${p.stock} restants`, cls:"low" }
    return { label:`En stock — ${p.stock} disponibles`, cls:"ok" }
  }
  const getSpecs = (p) => {
    if(p.cat === "Tableau original") return [["Support","Papier Arches 300g"],["Technique","Aquarelle originale"],["Format","Voir description"],["Signé","Oui, avec certificat"]]
    if(p.cat === "Print / Reproduction") return [["Support","Hahnemühle 308g"],["Impression","Giclée fine art"],["Tirage","Limité, numéroté & signé"],["Format","Voir description"]]
    return [["Format","10 × 15 cm"],["Papier","Offset satiné 350g"],["Dorso","Blanc, écrivable"],["Conditionnement","Voir description"]]
  }

  // ── ACCORDION ──────────────────────────────────────────
  const Acc = ({ items }) => (
    <div className="acc">
      {items.map((item,i) => (
        <div key={i} className="acc-item">
          <button className="acc-btn" onClick={() => setOpenAcc(openAcc===i ? null : i)}>
            {item.q}
            <span className={`acc-icon ${openAcc===i?"o":""}`}>+</span>
          </button>
          {openAcc===i && <div className="acc-body">{item.a}</div>}
        </div>
      ))}
    </div>
  )

  // ── CARD ───────────────────────────────────────────────
  const Card = ({ p }) => (
    <div className="card" onClick={() => nav("product", p)}>
      <div className="card-iw">
        <img className="card-img" src={p.img} alt={p.name} loading="lazy" />
        <div className="cbadges">
          {p.isnew && <span className="b-new">Nouveau</span>}
          {p.cat==="Tableau original" && <span className="b-unique">Pièce unique</span>}
          {p.cat==="Print / Reproduction" && p.stock<=5 && <span className="b-limited">Tirage limité</span>}
        </div>
        <button className={`cwish ${wish.includes(p.id)?"on":""}`}
          onClick={e => { e.stopPropagation(); toggleWish(p) }}>
          {wish.includes(p.id) ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-body">
        <p className="cc">{p.cat}</p>
        <p className="cn">{p.name}</p>
        <p className="cp">{p.price} €</p>
      </div>
    </div>
  )

  // ── FOOTER ─────────────────────────────────────────────
  const Footer = () => (
    <footer className="footer">
      <div className="ft">
        <div>
          <p className="fb">{cfg.brand}</p>
          <p className="ftag">{cfg.tagline}</p>
        </div>
        {[
          { h:"Boutique", links:[["Tableaux originaux",()=>{setCat("Tableau original");nav("shop")}],["Prints",()=>{setCat("Print / Reproduction");nav("shop")}],["Cartes postales",()=>{setCat("Carte postale");nav("shop")}],["Nouveautés",()=>nav("shop")]] },
          { h:"Informations", links:[["À propos",()=>nav("about")],["Contact",()=>nav("contact")],["Livraison & retours",()=>{}],["FAQ",()=>{}]] },
          { h:"Légal", links:[["CGV",()=>nav("legal")],["Mentions légales",()=>nav("legal")],["Confidentialité",()=>nav("legal")],["Administration",()=>nav("adminLogin")]] },
        ].map(col => (
          <div key={col.h}>
            <p className="fch">{col.h}</p>
            {col.links.map(([l,fn]) => <button key={l} className="flink" onClick={fn}>{l}</button>)}
          </div>
        ))}
      </div>
      <div className="fbot">
        <p className="fcopy">© 2025 JB Aquarelle · Tous droits réservés · Paiement sécurisé</p>
        <div className="fleg">
          <button onClick={()=>nav("legal")}>CGV</button>
          <button onClick={()=>nav("legal")}>Mentions légales</button>
          <button onClick={()=>nav("legal")}>Cookies</button>
        </div>
      </div>
    </footer>
  )

  // ── ADMIN SAVE ─────────────────────────────────────────
  const saveProduct = () => {
    if(isNewP) setProducts(prev => [...prev, {...editP, id:Date.now(), isnew:true}])
    else setProducts(prev => prev.map(p => p.id===editP.id ? editP : p))
    setEditP(null)
  }

  // ── RENDER ─────────────────────────────────────────────
  return (
    <>
      <style>{buildCss(cfg.accent, cfg.gold)}</style>

      {/* SPLASH */}
      <div className={`splash ${splashDone?"done":""}`}>
        <p className="splash-brand">{cfg.brand}</p>
      </div>

      {/* TOAST */}
      <div className="toast" style={{ transform: toast.vis?"translateY(0)":"translateY(-14px)", opacity: toast.vis?1:0 }}>{toast.msg}</div>

      {/* COOKIE */}
      {showCookie && (
        <div className="cookie">
          <p className="cookie-t">Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. En continuant, vous acceptez notre politique de confidentialité.</p>
          <div className="cookie-btns">
            <button className="ck-acc" onClick={()=>setShowCookie(false)}>Accepter</button>
            <button className="ck-ref" onClick={()=>setShowCookie(false)}>Refuser</button>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      <div className={`srch-ov ${searchOpen?"on":""}`}>
        <button className="srch-close" onClick={()=>setSearchOpen(false)}>✕ Fermer</button>
        <p className="srch-label">Rechercher</p>
        <input autoFocus={searchOpen} className="srch-inp" placeholder="Tableau, print, carte…"
          value={searchQ} onChange={e=>setSearchQ(e.target.value)} />
        <div className="srch-results">
          {searchResults.map(p => (
            <div key={p.id} className="srch-item" onClick={()=>{ setSearchOpen(false); nav("product",p) }}>
              <img src={p.img} alt={p.name} />
              <div><p className="si-name">{p.name}</p><p className="si-price">{p.price} €</p></div>
            </div>
          ))}
          {searchQ.length>1 && searchResults.length===0 && (
            <p style={{fontFamily:"var(--sans)",fontSize:13,opacity:.45,paddingTop:24}}>Aucun résultat pour « {searchQ} »</p>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`mob-menu ${menuOpen?"on":""}`}>
        <button className="mm-close" onClick={()=>setMenuOpen(false)}>✕ Fermer</button>
        {[["Accueil","home"],["Boutique","shop"],["À propos","about"],["Contact","contact"],["Favoris","wishlist"]].map(([l,p])=>(
          <button key={p} className="mm-link" onClick={()=>nav(p)}>{l}</button>
        ))}
      </div>

      {/* PROMO BANNER */}
      {showPromo && (
        <div className="promo">
          {cfg.promo}
          <button className="promo-x" onClick={()=>setShowPromo(false)}>×</button>
        </div>
      )}

      {/* NAV */}
      <nav className="nav">
        <div style={{display:"flex",alignItems:"center",gap:36}}>
          <button className="burger" onClick={()=>setMenuOpen(true)}>☰</button>
          <span className="nav-brand" onClick={()=>nav("home")}>{cfg.brand}</span>
          <div className="nav-links">
            {[["Accueil","home"],["Boutique","shop"],["À propos","about"],["Contact","contact"]].map(([l,p])=>(
              <button key={p} className={`nl ${page===p?"act":""}`} onClick={()=>nav(p)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="nav-r">
          <button className="nic" title="Rechercher" onClick={()=>setSearchOpen(true)}>⌕</button>
          <button className="nic" title="Favoris" onClick={()=>nav("wishlist")}>
            ♡{wish.length>0 && <span className="nbadge">{wish.length}</span>}
          </button>
          <button className="nic" title="Panier" onClick={()=>setCartOpen(true)}>
            ⊡{cartCount>0 && <span className="nbadge">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* ──────────── PAGES ──────────── */}
      <main>
        {/* HOME */}
        {page==="home" && <>
          <div className="hero">
            <div className="hero-bg" style={{backgroundImage:`url(${cfg.heroImg})`}} />
            <div className="hero-ov" /><div className="hero-grain" />
            <div className="hero-c">
              <p className="hero-ey">{cfg.heroSub}</p>
              <h1 className="hero-title">{cfg.heroTitle}</h1>
              <div className="hero-acts">
                <button className="hero-btn" onClick={()=>nav("shop")}>Découvrir la boutique</button>
                <button className="hero-btn" style={{opacity:.7,borderColor:"rgba(255,255,255,.25)"}} onClick={()=>nav("about")}>L'artiste</button>
              </div>
            </div>
            <div className="hero-scroll">Scroll</div>
          </div>

          <div className="sec">
            <p className="ey">— Œuvres à la une</p>
            <h2 className="sec-title">Sélection du moment</h2>
            <div className="g3">{products.filter(p=>p.featured).map(p=><Card key={p.id} p={p}/>)}</div>
          </div>

          <div className="band">
            <p className="band-q">"Chaque aquarelle est un <span>instant de lumière</span><br/>capturé avant qu'il ne s'envole."</p>
          </div>

          <div className="sec">
            <div className="at">
              <img src={cfg.aboutImg} alt="L'artiste" />
              <div>
                <p className="ey">— L'artiste</p>
                <h2 className="at-t">Une pratique de la couleur et du silence</h2>
                <p className="at-p">{cfg.bio}</p>
                <button className="btn btn-o" onClick={()=>nav("about")}>En savoir plus</button>
              </div>
            </div>
          </div>

          <div className="sec" style={{paddingTop:0}}>
            <p className="ey">— Accessibles à tous</p>
            <h2 className="sec-title">Prints & Cartes</h2>
            <div className="g4">{products.filter(p=>p.cat!=="Tableau original").slice(0,4).map(p=><Card key={p.id} p={p}/>)}</div>
          </div>

          <div className="nl-sec">
            <h2 className="nl-t">Restez dans l'atelier</h2>
            <p className="nl-s">Nouvelles œuvres, coulisses et offres exclusives réservées aux abonnés.</p>
            {nlDone ? <p style={{fontFamily:"var(--sans)",fontSize:13,color:"var(--a)"}}>✓ Merci ! Vous êtes inscrit(e).</p> : (
              <div className="nl-form">
                <input className="nl-inp" placeholder="votre@email.fr" />
                <button className="nl-btn" onClick={()=>setNlDone(true)}>S'abonner</button>
              </div>
            )}
          </div>

          <div className="sec-sm">
            <p className="ey" style={{textAlign:"center",justifyContent:"center",marginBottom:24}}>— Suivez l'atelier sur Instagram {cfg.insta}</p>
            <div className="ig-grid">
              {INSTA.map((src,i)=>(
                <div key={i} className="ig-cell">
                  <img src={src} alt="Instagram" loading="lazy" />
                  <div className="ig-ov">Voir sur Instagram</div>
                </div>
              ))}
            </div>
          </div>

          <Footer />
        </>}

        {/* SHOP */}
        {page==="shop" && <>
          <div className="sec" style={{paddingTop:64}}>
            <p className="ey">— Catalogue</p>
            <h1 className="sec-title">Toute la collection</h1>
            <div className="tabs-bar">
              {CATS.map(c=><button key={c} className={`tab-btn ${cat===c?"on":""}`} onClick={()=>setCat(c)}>{c}</button>)}
            </div>
            <div className="sort-row">
              <span className="sort-lbl">Trier par</span>
              <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
                {["Nouveautés","Prix croissant","Prix décroissant"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ga">{filtered.map(p=><Card key={p.id} p={p}/>)}</div>
          </div>
          <Footer />
        </>}

        {/* PRODUCT */}
        {page==="product" && prod && <>
          <div className="pd">
            <div className="pd-gal">
              <img className="pd-img" src={prod.img} alt={prod.name} />
            </div>
            <div className="pd-info">
              <button className="pd-back" onClick={()=>nav("shop")}>← Retour à la boutique</button>
              <span className="pd-badge">{prod.cat}</span>
              <h1 className="pd-name">{prod.name}</h1>
              <p className="pd-price">{prod.price} €</p>
              <p className={`pd-avail ${getAvail(prod).cls}`}>{getAvail(prod).label}</p>
              <p className="pd-desc">{prod.desc}</p>
              <div className="pd-specs">
                {getSpecs(prod).map(([k,v])=>(
                  <div key={k} className="spec"><span className="spec-k">{k}</span><span>{v}</span></div>
                ))}
              </div>
              <div className="pd-acts">
                <button className="btn btn-d" style={{flex:1}} onClick={()=>addToCart(prod)}>Ajouter au panier</button>
                <button className="btn btn-o btn-sm" onClick={()=>toggleWish(prod)}>
                  {wish.includes(prod.id)?"♥ Favori":"♡ Favoris"}
                </button>
              </div>
              <Acc items={[
                { q:"Livraison", a:"Livraison soignée en colissimo suivi sous 2–4 jours ouvrés. Les œuvres originales sont emballées individuellement avec soin. Livraison offerte dès 60 €." },
                { q:"Retours", a:"Vous disposez de 30 jours pour retourner votre commande en parfait état. Contactez-nous à "+cfg.email+" pour initier votre retour." },
                { q:"Authenticité & certificat", a:"Chaque tableau original est accompagné d'un certificat d'authenticité signé par l'artiste. Les prints sont numérotés et signés à la main." },
                { q:"Encadrement", a:"Nos œuvres sont livrées sans cadre pour vous laisser toute liberté. Nous pouvons vous recommander des encadreurs partenaires sur demande." },
              ]} />
            </div>
          </div>
          {relatedProds.length>0 && (
            <div className="related">
              <p className="rel-t">Vous aimerez aussi</p>
              <div className="g3">{relatedProds.map(p=><Card key={p.id} p={p}/>)}</div>
            </div>
          )}
        </>}

        {/* ABOUT */}
        {page==="about" && <>
          <div className="about-hero">
            <div className="about-hero-bg" style={{backgroundImage:`url(${cfg.aboutImg})`}} />
            <div className="about-hero-ov" />
            <h1 className="about-hero-t">L'artiste</h1>
          </div>
          <div className="about-body">
            <div>
              <p className="about-big-q">"La lumière ne se peint pas — elle se laisse traverser."</p>
              <p className="about-txt" style={{marginBottom:24}}>{cfg.bio}</p>
              <p className="about-txt">Formé aux arts plastiques, je travaille principalement l'aquarelle sur papiers grand grain — Arches, Fabriano, Hahnemühle — et m'attache à capturer la lumière naturelle dans ses moments les plus fugaces.</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=80" style={{width:"100%",aspectRatio:"4/5",objectFit:"cover"}} alt="Atelier" />
            </div>
          </div>
          <div className="process">
            <p className="ey">— Ma pratique</p>
            <h2 className="sec-title" style={{marginBottom:0}}>Comment je travaille</h2>
            <div className="proc-g">
              {[
                ["01","Le terrain","Je commence toujours par observer — l'heure, la lumière, la saison. Chaque œuvre naît d'une sortie, d'une sensation, d'un instant qui mérite d'être préservé."],
                ["02","La composition","De retour à l'atelier, je travaille les croquis au crayon sur papier humide. L'aquarelle demande d'accepter l'aléatoire et de dialoguer avec la matière."],
                ["03","La finition","Chaque pièce est séchée lentement, puis signée et numérotée à la main. Les reproductions sont tirées sur des presses fine art certifiées."],
              ].map(([n,t,p])=>(
                <div key={n}>
                  <p className="proc-n">{n}</p>
                  <p className="proc-t">{t}</p>
                  <p className="proc-p">{p}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="sec" style={{textAlign:"center"}}>
            <h2 className="sec-title" style={{marginBottom:28}}>Découvrez les œuvres</h2>
            <button className="btn btn-d" onClick={()=>nav("shop")}>Accéder à la boutique</button>
          </div>
          <Footer />
        </>}

        {/* CONTACT */}
        {page==="contact" && <>
          <div className="contact">
            <div className="contact-l">
              <div>
                <p style={{fontFamily:"var(--sans)",fontSize:10,letterSpacing:".24em",textTransform:"uppercase",color:"rgba(250,250,248,.35)",marginBottom:18}}>— Contact</p>
                <h1 className="contact-l-t">Parlons de votre projet</h1>
              </div>
              <div className="cinfo">
                {[["Email",cfg.email],["Instagram",cfg.insta],["Réponse","Sous 48h ouvrées"],["Commandes sur-mesure","Sur devis"]].map(([l,v])=>(
                  <div key={l} className="cir"><span className="ci-lbl">{l}</span><span className="ci-v">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="contact-r">
              <h2 className="contact-r-t">Envoyer un message</h2>
              {cfSent ? (
                <div style={{paddingTop:40,textAlign:"center"}}>
                  <p style={{fontSize:44}}>✓</p>
                  <p style={{fontFamily:"var(--serif)",fontSize:28,fontStyle:"italic",marginTop:16,marginBottom:12}}>Message envoyé</p>
                  <p style={{fontFamily:"var(--sans)",fontSize:13,color:"var(--ink2)"}}>Merci ! Je vous répondrai sous 48h.</p>
                </div>
              ) : <>
                {[["name","Nom & prénom","text"],["email","Adresse email","email"]].map(([k,l,t])=>(
                  <div key={k} className="fg">
                    <label className="flbl">{l}</label>
                    <input type={t} className="fi" value={cfForm[k]} onChange={e=>setCfForm({...cfForm,[k]:e.target.value})} />
                  </div>
                ))}
                <div className="fg">
                  <label className="flbl">Votre message</label>
                  <textarea className="fi" value={cfForm.msg} onChange={e=>setCfForm({...cfForm,msg:e.target.value})} />
                </div>
                <button className="btn btn-d btn-w" style={{marginTop:8}} onClick={()=>{ if(cfForm.name&&cfForm.email&&cfForm.msg) setCfSent(true) }}>Envoyer</button>
              </>}
            </div>
          </div>
          <Footer />
        </>}

        {/* WISHLIST */}
        {page==="wishlist" && <>
          <div className="wl-page">
            <h1 className="wl-t">Mes favoris</h1>
            {wish.length===0 ? (
              <div className="empty">
                <p className="empty-ic">♡</p>
                <h2 className="empty-t">Votre liste est vide</h2>
                <p className="empty-s">Cliquez sur le cœur d'une œuvre pour l'ajouter à vos favoris<br/>et la retrouver ici facilement.</p>
                <button className="btn btn-d" onClick={()=>nav("shop")}>Explorer la boutique</button>
              </div>
            ) : <div className="ga">{products.filter(p=>wish.includes(p.id)).map(p=><Card key={p.id} p={p}/>)}</div>}
          </div>
          <Footer />
        </>}

        {/* CHECKOUT */}
        {page==="checkout" && !orderDone && <>
          <div className="ck">
            <div className="ck-l">
              <h1 className="ck-t">Paiement</h1>
              <div className="pay-tabs">
                {[["paypal","PayPal"],["sumup","SumUp"]].map(([k,l])=>(
                  <button key={k} className={`ptab ${payTab===k?"on":""}`} onClick={()=>setPayTab(k)}>{l}</button>
                ))}
              </div>
              {payTab==="paypal" && <>
                <div id="paypal-btn" style={{marginBottom:18}} />
                <p className="pay-note">🔒 Paiement sécurisé via PayPal. Mode sandbox actif — renseignez votre Client ID PayPal dans les paramètres admin pour activer les vrais paiements.</p>
              </>}
              {payTab==="sumup" && (
                <div className="pay-note">
                  💳 <strong>SumUp</strong> — Pour activer les paiements par carte via SumUp, renseignez votre clé API dans les paramètres admin. <br/><br/>
                  <a href="https://developer.sumup.com" target="_blank" rel="noreferrer" style={{color:"var(--a)"}}>Créer un compte SumUp →</a>
                </div>
              )}
              <div style={{marginTop:32,paddingTop:24,borderTop:"1px solid #e4dfd8"}}>
                <button className="pd-back" style={{opacity:.5,background:"none",border:"none",cursor:"pointer",fontFamily:"var(--sans)",fontSize:10,letterSpacing:".14em",textTransform:"uppercase"}} onClick={()=>nav("shop")}>← Continuer mes achats</button>
              </div>
            </div>
            <div className="ck-r">
              <h2 className="ck-t">Ma commande</h2>
              {cart.map(item=>(
                <div key={item.id} className="ck-item">
                  <img src={item.img} alt={item.name} />
                  <div>
                    <p className="cki-n">{item.name}</p>
                    <p className="cki-c">{item.cat}</p>
                    <p className="cki-p">{item.price} € × {item.qty}</p>
                  </div>
                  <p style={{marginLeft:"auto",fontFamily:"var(--serif)",fontSize:17,alignSelf:"center"}}>{(item.price*item.qty).toFixed(2)} €</p>
                </div>
              ))}
              <div className="ck-total">
                <span className="ct-l">Total TTC</span>
                <span className="ct-v">{cartTotal.toFixed(2)} €</span>
              </div>
              <div style={{background:"#fff",padding:"14px 18px",fontFamily:"var(--sans)",fontSize:12,color:"var(--ink2)",lineHeight:1.7}}>
                🚚 Livraison {cartTotal>=60?"offerte":"5.90 €"} · Expédition sous 2–4 jours ouvrés
              </div>
            </div>
          </div>
        </>}

        {/* CONFIRMATION */}
        {page==="checkout" && orderDone && (
          <div className="confirm">
            <div>
              <p className="cf-ic">✓</p>
              <h1 className="cf-t">Merci !</h1>
              <p className="cf-ref">Commande {orderRef}</p>
              <p className="cf-s">Votre commande est confirmée et sera expédiée sous 2–4 jours ouvrés.<br />Un email de confirmation vous sera envoyé à l'adresse renseignée.</p>
              <button className="btn btn-d" onClick={()=>{ setOrderDone(false); nav("home") }}>Retour à l'accueil</button>
            </div>
          </div>
        )}

        {/* LEGAL */}
        {page==="legal" && <>
          <div className="sec">
            <div className="legal">
              <h1 className="legal-t">Informations légales</h1>
              {[
                ["Conditions Générales de Vente","Les présentes conditions régissent les ventes effectuées sur jbaquarelle.fr. Toute commande implique l'acceptation des présentes CGV. Les prix sont indiqués en euros TTC. Le paiement est exigible à la commande. JB Aquarelle se réserve le droit de modifier ses prix à tout moment."],
                ["Délais et livraison","Les commandes sont expédiées sous 2 à 4 jours ouvrés après réception du paiement. La livraison est effectuée via Colissimo avec suivi. Les frais de livraison sont offerts à partir de 60 € d'achat."],
                ["Droit de rétractation","Conformément à la loi, vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation, sans justification. Les œuvres originales doivent être retournées dans leur emballage d'origine."],
                ["Mentions légales","Responsable de publication : JB Aquarelle. Email : "+cfg.email+". Hébergeur : Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104."],
                ["Protection des données","Vos données personnelles sont collectées uniquement pour le traitement de vos commandes et ne sont jamais transmises à des tiers à des fins commerciales. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données."],
              ].map(([h,p])=>(
                <div key={h} className="legal-s">
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </>}

        {/* ADMIN LOGIN */}
        {page==="adminLogin" && (
          <div className="lp">
            <div className="lp-l" style={{backgroundImage:"url(https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80)"}} />
            <div className="lp-r">
              <div style={{width:"100%"}}>
                <p className="lp-t">Administration</p>
                <p className="lp-s">JB Aquarelle</p>
                <div className="fg">
                  <label className="flbl">Mot de passe</label>
                  <input type="password" className="fi" value={adminPass} placeholder="••••••••"
                    onChange={e=>setAdminPass(e.target.value)}
                    onKeyDown={e=>e.key==="Enter" && (adminPass===cfg.adminPwd ? (setAdminIn(true),nav("admin")) : alert("Incorrect"))} />
                </div>
                <button className="btn btn-d btn-w" style={{marginTop:6}} onClick={()=>adminPass===cfg.adminPwd?(setAdminIn(true),nav("admin")):alert("Mot de passe incorrect")}>Accéder</button>
                <p style={{marginTop:14,fontFamily:"var(--sans)",fontSize:11,opacity:.3,textAlign:"center"}}>Par défaut : admin123</p>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {page==="admin" && adminIn && (
          <div className="adm">
            <h1 className="adm-h">Tableau de bord</h1>
            <p className="adm-sub">JB Aquarelle — Administration</p>

            {/* STATS */}
            <div className="stats-g">
              {[
                { v:`${totalRevenue} €`, l:"Chiffre d'affaires", tr:"↑ +18% ce mois" },
                { v:ORDERS.length, l:"Commandes totales", tr:"↑ +2 cette semaine" },
                { v:products.length, l:"Œuvres en ligne", tr:`${products.filter(p=>p.isnew).length} nouvelles` },
                { v:"47", l:"Abonnés newsletter", tr:"↑ +6 cette semaine" },
              ].map((s,i)=>(
                <div key={i} className="sc">
                  <p className="sc-v">{s.v}</p>
                  <p className="sc-l">{s.l}</p>
                  <p className="sc-tr">{s.tr}</p>
                </div>
              ))}
            </div>

            {/* ALERTS */}
            {lowStock.length>0 && (
              <div className="adm-s">
                <div className="adm-sh"><p className="adm-st">⚠ Alertes stock bas</p></div>
                {lowStock.map(p=>(
                  <div key={p.id} className="alert-low">
                    <span><strong>{p.name}</strong> — {p.stock} restant{p.stock>1?"s":""}</span>
                    <button className="btn btn-o btn-sm" onClick={()=>{setEditP({...p});setIsNewP(false)}}>Modifier</button>
                  </div>
                ))}
              </div>
            )}

            {/* CONFIG */}
            <div className="adm-s">
              <div className="adm-sh">
                <p className="adm-st">Configuration du site</p>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-o btn-sm" onClick={()=>nav("home")}>Voir le site</button>
                  <button className="btn btn-d btn-sm" onClick={()=>{setCfgDraft({...cfg});setShowCfg(true)}}>Modifier</button>
                </div>
              </div>
            </div>

            {/* ORDERS */}
            <div className="adm-s">
              <div className="adm-sh"><p className="adm-st">Commandes récentes ({ORDERS.length})</p></div>
              <table className="ot">
                <thead>
                  <tr>{["Référence","Date","Client","Produits","Total","Statut"].map(h=><th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {ORDERS.map(o=>(
                    <tr key={o.id}>
                      <td style={{fontFamily:"var(--serif)",fontStyle:"italic"}}>{o.id}</td>
                      <td style={{opacity:.55}}>{o.date}</td>
                      <td>{o.customer}</td>
                      <td style={{opacity:.65,maxWidth:220}}>{o.items}</td>
                      <td style={{fontWeight:500}}>{o.total} €</td>
                      <td><span className={`sbadge s-${o.status.replace(" ","_")}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PRODUCTS */}
            <div className="adm-s">
              <div className="adm-sh"><p className="adm-st">Catalogue ({products.length} œuvres)</p></div>
              <div className="adm-pg">
                {products.map(p=>(
                  <div key={p.id} className="apc" onClick={()=>{setEditP({...p});setIsNewP(false)}}>
                    <img src={p.img} alt={p.name} />
                    <p className="apc-n">{p.name}</p>
                    <p className="apc-c">{p.cat}</p>
                    <p className="apc-p">{p.price} €</p>
                    <p className={`apc-st ${p.stock<=3?"low":""}`}>Stock : {p.stock}</p>
                  </div>
                ))}
                <div className="adm-add" onClick={()=>{setEditP({id:null,name:"",price:0,cat:"Tableau original",desc:"",img:"",stock:1,featured:false,isnew:true});setIsNewP(true)}}>
                  <div style={{textAlign:"center",opacity:.35}}>
                    <p style={{fontSize:32}}>+</p>
                    <p style={{fontFamily:"var(--sans)",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",marginTop:6}}>Ajouter</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-o" onClick={()=>{setAdminIn(false);nav("home")}}>Déconnexion</button>
          </div>
        )}
      </main>

      {/* CART DRAWER */}
      <div className={`ov ${cartOpen?"on":""}`} onClick={()=>setCartOpen(false)} />
      <div className={`drawer ${cartOpen?"on":""}`}>
        <div className="dr-head">
          <h2 className="dr-t">Panier</h2>
          <button className="dr-x" onClick={()=>setCartOpen(false)}>✕ Fermer</button>
        </div>
        {cart.length===0 ? (
          <div>
            <p style={{fontFamily:"var(--sans)",fontSize:13,opacity:.4,letterSpacing:".05em"}}>Votre panier est vide.</p>
            <button className="btn btn-d" style={{marginTop:28,width:"100%"}} onClick={()=>{setCartOpen(false);nav("shop")}}>Explorer la boutique</button>
          </div>
        ) : <>
          {cart.map(item=>(
            <div key={item.id} className="ci">
              <img src={item.img} alt={item.name} />
              <div style={{flex:1}}>
                <p className="ci-n">{item.name}</p>
                <p className="ci-cat">{item.cat}</p>
                <p className="ci-p">{item.price} €</p>
                <div className="qty">
                  <button className="qb" onClick={()=>updateQty(item.id,item.qty-1)}>−</button>
                  <span className="qn">{item.qty}</span>
                  <button className="qb" onClick={()=>updateQty(item.id,item.qty+1)}>+</button>
                </div>
                <button className="rm" onClick={()=>setCart(prev=>prev.filter(i=>i.id!==item.id))}>Retirer</button>
              </div>
            </div>
          ))}
          <div className="dr-foot">
            <div className="dr-tot">
              <span className="dt-l">Total TTC</span>
              <span className="dt-v">{cartTotal.toFixed(2)} €</span>
            </div>
            {cartTotal<60 && <p style={{fontFamily:"var(--sans)",fontSize:11,opacity:.5,marginBottom:14,letterSpacing:".06em"}}>Plus que {(60-cartTotal).toFixed(2)} € pour la livraison offerte</p>}
            <button className="btn btn-d btn-w" onClick={()=>{setCartOpen(false);nav("checkout")}}>Commander</button>
          </div>
        </>}
      </div>

      {/* MODAL PRODUCT EDIT */}
      {editP && (
        <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setEditP(null)}>
          <div className="modal">
            <h2 className="modal-t">{isNewP?"Nouveau produit":"Modifier l'œuvre"}</h2>
            {[["name","Nom de l'œuvre","text"],["img","URL de l'image","text"],["price","Prix (€)","number"],["stock","Stock","number"]].map(([k,l,t])=>(
              <div key={k} className="fg">
                <label className="flbl">{l}</label>
                <input type={t} className="fi" value={editP[k]}
                  onChange={e=>setEditP({...editP,[k]:t==="number"?parseFloat(e.target.value)||0:e.target.value})} />
              </div>
            ))}
            <div className="fg">
              <label className="flbl">Catégorie</label>
              <select className="fi" value={editP.cat} onChange={e=>setEditP({...editP,cat:e.target.value})}>
                {CATS.filter(c=>c!=="Tous").map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg">
              <label className="flbl">Description</label>
              <textarea className="fi" value={editP.desc} onChange={e=>setEditP({...editP,desc:e.target.value})} />
            </div>
            <div className="fg">
              <label className="flbl" style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="checkbox" checked={editP.featured} onChange={e=>setEditP({...editP,featured:e.target.checked})} />
                Mettre en avant (page d'accueil)
              </label>
            </div>
            <div className="macts">
              <button className="btn btn-o" onClick={()=>setEditP(null)}>Annuler</button>
              {!isNewP && <button className="btn-danger" onClick={()=>{setProducts(prev=>prev.filter(p=>p.id!==editP.id));setEditP(null)}}>Supprimer</button>}
              <button className="btn btn-d" style={{flex:1}} onClick={saveProduct}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SITE CONFIG */}
      {showCfg && (
        <div className="modal-ov" onClick={e=>e.target===e.currentTarget&&setShowCfg(false)}>
          <div className="modal">
            <h2 className="modal-t">Paramètres du site</h2>
            {[
              ["brand","Nom de la marque"],["tagline","Slogan"],["heroTitle","Titre hero (\\n = saut de ligne)"],
              ["heroSub","Sous-titre hero"],["heroImg","URL image hero"],["aboutImg","URL photo artiste"],
              ["accent","Couleur accent (#hex)"],["gold","Couleur or (#hex)"],
              ["paypalId","Client ID PayPal (sb = sandbox)"],["adminPwd","Mot de passe admin"],
              ["promo","Texte bannière promo"],["email","Email de contact"],["insta","Handle Instagram"],["bio","Bio artiste"],
            ].map(([k,l])=>(
              <div key={k} className="fg">
                <label className="flbl">{l}</label>
                <input type="text" className="fi" value={cfgDraft[k]} onChange={e=>setCfgDraft({...cfgDraft,[k]:e.target.value})} />
              </div>
            ))}
            <div className="macts">
              <button className="btn btn-o" onClick={()=>setShowCfg(false)}>Annuler</button>
              <button className="btn btn-d" style={{flex:1}} onClick={()=>{setCfg(cfgDraft);setShowCfg(false)}}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
