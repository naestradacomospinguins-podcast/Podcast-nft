 import React, { useEffect, useState } from "react";

// ============================================= // Tema & Config // ============================================= const THEME = { brandName: "Na Estrada com os Pinguins", colors: { bg: "bg-black", text: "text-white", accent: "text-purple-500", accentBg: "bg-purple-600", accent2: "text-yellow-400", accent2Bg: "bg-yellow-400", card: "bg-zinc-900", border: "border-zinc-800", muted: "text-zinc-300", }, };

// Logo em /public/logo.png const LOGO_SRC = "/logo.png";

// Imagens placeholder (motos custom) const MOTO_IMG_1 = "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1200&auto=format&fit=crop"; const MOTO_IMG_2 = "https://images.unsplash.com/photo-1533139502658-0198f920d8ae?q=80&w=1200&auto=format&fit=crop"; const MOTO_IMG_3 = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop";

// ============================================= // Estado Simples (MVP) // ============================================= const DEMO_DROP = { id: "123", title: "NFT do Episódio #1 — Estreia Ao Vivo", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop", description: "Colecionável oficial do episódio #1. Resgate grátis durante a live. Após o término, disponível por Birita Coins.", tokenId: 1, supplyTotal: 500, priceCoins: 30, liveWindowStart: new Date(Date.now() - 1000 * 60 * 60), liveWindowEnd: new Date(Date.now() + 1000 * 60 * 60), };

function useLocalStorage(key, initialValue) { const [value, setValue] = useState(() => { try { const it = localStorage.getItem(key); return it ? JSON.parse(it) : initialValue; } catch { return initialValue; } }); useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]); return [value, setValue]; }

function useNow(tickMs = 1000) { const [now, setNow] = useState(new Date()); useEffect(() => { const id = setInterval(() => setNow(new Date()), tickMs); return () => clearInterval(id); }, [tickMs]); return now; }

function countdownString(target, now) {
  const diff = target - now;
  if (diff <= 0) return "00:00";
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useAuth() { const [user, setUser] = useLocalStorage("mvp_user", null); const login = async (email) => { await new Promise((r) => setTimeout(r, 350)); setUser({ id: crypto.randomUUID(), email, coins: 120 }); return true; }; const logout = () => setUser(null); return { user, login, logout }; }

function useInventory() { const [minted, setMinted] = useLocalStorage("mvp_minted", 0); return { minted, remaining: Math.max(0, DEMO_DROP.supplyTotal - minted), dec: () => setMinted((m) => m + 1), }; }

function useUserNFTs() { const [items, setItems] = useLocalStorage("mvp_nfts", []); const add = (nft) => setItems((arr) => [nft, ...arr]); return { items, add }; }

// ============================================= // Layout // ============================================= function Container({ children, className = "" }) { return <div className={max-w-6xl mx-auto px-4 ${className}}>{children}</div>; }

function Navbar({ route, setRoute, user, logout }) { const c = THEME.colors; return ( <div className={w-full ${c.bg} ${c.text} border-b ${c.border} sticky top-0 z-50}> <Container className="py-3 flex items-center justify-between"> <div className="flex items-center gap-3"> <img src={LOGO_SRC} alt="logo" className="h-9 w-9 rounded-lg object-contain bg-white"/> <button onClick={() => setRoute("/historia")} className="text-lg md:text-xl font-semibold"> {THEME.brandName} </button> </div> <nav className="flex items-center gap-2 text-sm"> <NavBtn label="Nossa história" active={route === "/historia"} onClick={() => setRoute("/historia")} /> <NavBtn label="Patrocinadores" active={route === "/patrocinadores"} onClick={() => setRoute("/patrocinadores")} /> <NavBtn label="Birita Coins" active={route === "/birita"} onClick={() => setRoute("/birita")} /> <NavBtn label="Loja" active={route === "/loja"} onClick={() => setRoute("/loja")} /> <NavBtn label="Perfil" active={route === "/perfil"} onClick={() => setRoute("/perfil")} /> {user ? ( <button onClick={logout} className={ml-2 px-3 py-1.5 rounded border ${c.border} hover:bg-zinc-800}> Sair </button> ) : null} </nav> </Container> </div> ); }

function NavBtn({ label, active, onClick }) { const c = THEME.colors; return ( <button onClick={onClick} className={px-3 py-1.5 rounded ${active ? ${c.accentBg} text-white : "hover:bg-zinc-800"}} > {label} </button> ); }

function Footer() { const c = THEME.colors; return ( <div className={border-t ${c.border} bg-zinc-950 ${c.text}}> <Container className="py-6 text-sm flex flex-wrap items-center gap-4 justify-between"> <div>© {new Date().getFullYear()} {THEME.brandName}</div> <div className="flex gap-2"> <span className={px-2 py-1 text-xs rounded border ${c.border}}>Cores: preto, roxo, amarelo, branco</span> <span className={px-2 py-1 text-xs rounded border ${c.border}}>MVP</span> </div> </Container> </div> ); }

// ============================================= // Páginas // ============================================= function HomeLogo() { return ( <div className="flex flex-col items-center justify-center text-center py-16"> <img src={LOGO_SRC} alt="logo grande" className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6"/> <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">Na Estrada com os Pinguins</h1> <p className="mt-3 text-zinc-300 max-w-xl">Podcast sobre motos, viagens, rock e a cultura motoclubista. Ao vivo e gravado, direto para todas as plataformas.</p> </div> ); }

function Historia() { /* ... igual ao código anterior ... / } function Patrocinadores() { / ... igual ... / } function BiritaCoins() { / ... igual ... / } function Loja() { / ... igual ... / } function Perfil() { / ... igual ... / } function AuthGate() { / ... igual ... */ }

// ============================================= // App // ============================================= export default function App() { const [route, setRoute] = useState("/home"); const { user, login, logout } = useAuth(); const inventory = useInventory(); const { items, add } = useUserNFTs();

useEffect(() => { const apply = () => { const h = location.hash.replace("#", ""); if (h) setRoute(h); }; apply(); window.addEventListener("hashchange", apply); return () => window.removeEventListener("hashchange", apply); }, []);

useEffect(() => { window.location.hash = route; }, [route]);

return ( <div className="min-h-screen bg-black text-white"> <Navbar route={route} setRoute={setRoute} user={user} logout={logout} /> {!user && <AuthGate user={user} onLogin={login} />} {route === "/home" && <HomeLogo />} {route === "/historia" && <Historia />} {route === "/patrocinadores" && <Patrocinadores />} {route === "/birita" && <BiritaCoins user={user} />} {route === "/loja" && <Loja inventory={inventory} user={user} addNFT={add} />} {route === "/perfil" && <Perfil user={user} items={items} />} <Footer /> </div> ); }

