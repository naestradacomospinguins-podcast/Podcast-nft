import React, { useEffect, useState } from "react";

// =============================================
// Tema & Config
// =============================================
const THEME = {
  brandName: "Na Estrada com os Pinguins",
  colors: {
    bg: "bg-black",
    text: "text-white",
    accent: "text-purple-500",
    accentBg: "bg-purple-600",
    accent2: "text-yellow-400",
    accent2Bg: "bg-yellow-400",
    card: "bg-black",
    border: "border-zinc-800",
    muted: "text-zinc-300",
  },
};

// Logo em /public/logo.png
const LOGO_SRC = "/logo.png";

// Imagens placeholder (motos custom)
const MOTO_IMG_1 =
  "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1200&auto=format&fit=crop";
const MOTO_IMG_2 =
  "https://images.unsplash.com/photo-1533139502658-0198f920d8ae?q=80&w=1200&auto=format&fit=crop";
const MOTO_IMG_3 =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop";

// =============================================
// Estado Simples (MVP)
// =============================================
const DEMO_DROP = {
  id: "123",
  title: "NFT do Episódio #1 — Estreia Ao Vivo",
  cover:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  description:
    "Colecionável oficial do episódio #1. Resgate grátis durante a live. Após o término, disponível por Birita Coins.",
  tokenId: 1,
  supplyTotal: 500,
  priceCoins: 30,
  liveWindowStart: new Date(Date.now() - 1000 * 60 * 60),
  liveWindowEnd: new Date(Date.now() + 1000 * 60 * 60),
};

// =============================================
// Hooks utilitários
// =============================================
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const it = localStorage.getItem(key);
      return it ? JSON.parse(it) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
  return now;
}

function countdownString(target, now) {
  const diff = target - now;
  if (diff <= 0) return "00:00";
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function useAuth() {
  const [user, setUser] = useLocalStorage("mvp_user", null);
  const login = async (email) => {
    await new Promise((r) => setTimeout(r, 350));
    setUser({ id: crypto.randomUUID(), email, coins: 120 });
    return true;
  };
  const logout = () => setUser(null);
  return { user, login, logout };
}

function useInventory() {
  const [minted, setMinted] = useLocalStorage("mvp_minted", 0);
  return {
    minted,
    remaining: Math.max(0, DEMO_DROP.supplyTotal - minted),
    dec: () => setMinted((m) => m + 1),
  };
}

function useUserNFTs() {
  const [items, setItems] = useLocalStorage("mvp_nfts", []);
  const add = (nft) => setItems((arr) => [nft, ...arr]);
  return { items, add };
}

// =============================================
// Layout
// =============================================
function Container({ children, className = "" }) {
  return <div className={`max-w-6xl mx-auto px-4 ${className}`}>{children}</div>;
}

function Navbar({ route, setRoute, user, logout }) {
  const c = THEME.colors;
  return (
    <div className={`w-full ${c.bg} ${c.text} border-b ${c.border} sticky top-0 z-50`}>
      <Container className="py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_SRC} alt="logo" className="h-9 w-9 rounded-lg object-contain bg-white" />
          <button onClick={() => setRoute("/home")} className="text-lg md:text-xl font-semibold">
            {THEME.brandName}
          </button>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <NavBtn label="Home" active={route === "/home"} onClick={() => setRoute("/home")} />
          <NavBtn label="Nossa história" active={route === "/historia"} onClick={() => setRoute("/historia")} />
          <NavBtn label="Patrocinadores" active={route === "/patrocinadores"} onClick={() => setRoute("/patrocinadores")} />
          <NavBtn label="Birita Coins" active={route === "/birita"} onClick={() => setRoute("/birita")} />
          <NavBtn label="Loja" active={route === "/loja"} onClick={() => setRoute("/loja")} />
          <NavBtn label="Perfil" active={route === "/perfil"} onClick={() => setRoute("/perfil")} />
          {user ? (
            <button
              onClick={logout}
              className={`ml-2 px-3 py-1.5 rounded border ${c.border} hover:bg-zinc-800`}
            >
              Sair
            </button>
          ) : null}
        </nav>
      </Container>
    </div>
  );
}

function NavBtn({ label, active, onClick }) {
  const c = THEME.colors;
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded ${active ? `${c.accentBg} text-white` : "hover:bg-zinc-800"}`}
    >
      {label}
    </button>
  );
}

function Footer() {
  const c = THEME.colors;
  return (
    <div className={`border-t ${c.border} bg-zinc-950 ${c.text}`}>
      <Container className="py-6 text-sm flex flex-wrap items-center gap-4 justify-between">
        <div>© {new Date().getFullYear()} {THEME.brandName}</div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded border ${c.border}`}>Cores: preto, roxo, amarelo, branco</span>
          <span className={`px-2 py-1 text-xs rounded border ${c.border}`}>MVP</span>
        </div>
      </Container>
    </div>
  );
}

// =============================================
// Páginas
// =============================================
function HomeLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <img src={LOGO_SRC} alt="logo grande" className="w-48 h-48 md:w-64 md:h-64 object-contain mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">Na Estrada com os Pinguins</h1>
      <p className="mt-3 text-zinc-300 max-w-xl">
        Podcast sobre motos, viagens, rock e a cultura motoclubista. Ao vivo e gravado, direto para todas as plataformas.
      </p>
    </div>
  );
}

function Historia() {
  const c = THEME.colors;
  return (
    <Container className={`py-8 ${THEME.colors.text}`}>
      <header className="mb-6">
        <h1 className={`text-3xl md:text-4xl font-bold ${THEME.colors.accent}`}>Nossa história</h1>
        <p className={`mt-2 ${c.muted}`}>Motos, viagens e a irmandade motoclubista — do asfalto para o microfone.</p>
      </header>
      <article className={`prose prose-invert max-w-none ${c.text}`}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus laoreet risus nec
          sem interdum, sed fermentum velit consequat. Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Maecenas vitae mauris lacinia, ultrices mi id,
          pretium arcu. Integer vulputate, augue et dignissim hendrerit, nunc neque efficitur sapien,
          id lacinia massa magna non libero.
        </p>
        <img src={MOTO_IMG_1} alt="moto custom" className="rounded-xl border border-zinc-800 my-6"/>
        <p>
          Curabitur faucibus velit in lorem volutpat, vel tristique nulla dictum. Quisque suscipit,
          purus vitae rhoncus pretium, elit purus vestibulum lorem, non ultrices tortor augue sed magna.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc
          posuere tellus a nibh condimentum, vitae ultrices nulla ultricies.
        </p>
        <img src={MOTO_IMG_2} alt="moto custom" className="rounded-xl border border-zinc-800 my-6"/>
        <p>
          Aliquam erat volutpat. Fusce interdum, ipsum at dignissim efficitur, felis ligula facilisis
          arcu, vitae dictum nibh est nec tortor. Integer sagittis, velit in cursus mattis, nibh ante
          convallis nunc, id vulputate mi mi in ipsum. Nullam in dignissim nisi.
        </p>
        <img src={MOTO_IMG_3} alt="moto custom" className="rounded-xl border border-zinc-800 my-6"/>
      </article>
    </Container>
  );
}

function Patrocinadores() {
  const c = THEME.colors;
  const sponsors = [
    { name: "Garage 77", url: "#", desc: "Custom bikes & parts" },
    { name: "RiderWear", url: "#", desc: "Vestuário e acessórios" },
    { name: "RockFuel", url: "#", desc: "Eventos e festivais" },
    { name: "RouteLab", url: "#", desc: "Mapas e rotas exclusivas" },
  ];
  return (
    <Container className="py-8">
      <h1 className={`text-3xl font-bold ${THEME.colors.accent2}`}>Patrocinadores</h1>
      <p className={`mt-2 ${c.muted}`}>Nossos parceiros que aceleram com a gente.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {sponsors.map((s, i) => (
          <div key={i} className={`rounded-2xl p-5 border ${c.border} ${THEME.colors.card}`}>
            <div className="text-lg font-semibold">{s.name}</div>
            <div className={`text-sm ${c.muted}`}>{s.desc}</div>
            <a href={s.url} className={`inline-block mt-3 px-3 py-1.5 rounded ${THEME.colors.accentBg}`}>Visitar</a>
          </div>
        ))}
      </div>
    </Container>
  );
}

function BiritaCoins({ user }) {
  const [qty, setQty] = useState(100);
  const priceBRL = (qty / 10).toFixed(2); // exemplo: 100 coins = R$10,00
  return (
    <Container className="py-8">
      <h1 className={`text-3xl font-bold ${THEME.colors.accent2}`}>Birita Coins</h1>
      <p className="text-zinc-300 mt-2">Compre moedas para resgatar NFTs, enviar perguntas e destacar mensagens.</p>
      <div className={`mt-6 rounded-2xl p-5 border ${THEME.colors.border} ${THEME.colors.card}`}>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm text-zinc-400">Quantidade</label>
            <input
              type="number"
              min={50}
              step={10}
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value || "0"))}
              className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm text-zinc-400">Preço estimado</div>
            <div className="text-2xl font-bold">R$ {priceBRL}</div>
          </div>
          <button className={`px-4 py-2 rounded-lg ${THEME.colors.accentBg}`}>Comprar (em breve)</button>
        </div>
        <p className="text-xs text-zinc-500 mt-3">Pagamento por cartão/Pix via Stripe/Mercado Pago (integração futura).</p>
      </div>
    </Container>
  );
}

function Loja({ inventory, user, addNFT }) {
  const now = useNow();
  const isLive = now >= DEMO_DROP.liveWindowStart && now <= DEMO_DROP.liveWindowEnd;
  const countdown = countdownString(isLive ? DEMO_DROP.liveWindowEnd : DEMO_DROP.liveWindowStart, now);

  async function handleMint(source) {
    if (!user) return alert("Faça login primeiro.");
    if (inventory.remaining <= 0) return alert("Esgotado.");
    await new Promise((r) => setTimeout(r, 800)); // simula mint
    addNFT({
      tokenId: DEMO_DROP.tokenId,
      title: DEMO_DROP.title,
      cover: DEMO_DROP.cover,
      txHash: Math.random().toString(16).slice(2),
      when: new Date().toISOString(),
      source,
    });
    inventory.dec();
    alert("NFT entregue no seu perfil!");
  }

  return (
    <Container className="py-8">
      <h1 className={`text-3xl font-bold ${THEME.colors.accent}`}>Loja</h1>
      <p className="text-zinc-300 mt-2">Compre NFTs e interaja ao vivo com Birita Coins.</p>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Card do NFT do episódio */}
        <div className={`rounded-2xl overflow-hidden border ${THEME.colors.border} ${THEME.colors.card}`}>
          <img src={DEMO_DROP.cover} className="h-48 w-full object-cover" />
          <div className="p-5 border-t border-zinc-800">
            <div className="text-lg font-semibold">{DEMO_DROP.title}</div>
            <div className="text-sm text-zinc-400 mt-1">{DEMO_DROP.description}</div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-3">
              <span className="px-2 py-1 border border-zinc-700 rounded">Supply: {inventory.remaining}/{DEMO_DROP.supplyTotal}</span>
              <span className="px-2 py-1 border border-zinc-700 rounded">Polygon</span>
              <span className="px-2 py-1 border border-zinc-700 rounded">{isLive ? `Encerra em ${countdown}` : `Começa em ${countdown}`}</span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                className={`px-4 py-2 rounded-lg ${isLive ? THEME.colors.accent2Bg + " text-black" : "bg-zinc-800 text-zinc-400 cursor-not-allowed"}`}
                disabled={!isLive || inventory.remaining <= 0}
                onClick={() => handleMint("live")}
              >
                Resgatar grátis (ao vivo)
              </button>
              <button
                className={`px-4 py-2 rounded-lg border border-zinc-700`}
                disabled={isLive || inventory.remaining <= 0}
                onClick={() => alert("Em breve: comprar por Birita Coins")}
              >
                Comprar por {DEMO_DROP.priceCoins} Birita
              </button>
            </div>
          </div>
        </div>

        {/* Card Enviar Mensagem */}
        <div className={`rounded-2xl p-5 border ${THEME.colors.border} ${THEME.colors.card}`}>
          <div className="text-lg font-semibold">Enviar mensagem ao vivo</div>
          <div className="text-sm text-zinc-400">Participe do programa com uma pergunta ou comentário.</div>
          <textarea className="mt-3 w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white" rows={4} placeholder="Escreva sua pergunta aqui..."></textarea>
          <button className={`mt-3 px-4 py-2 rounded-lg ${THEME.colors.accentBg}`}>Enviar (5 Birita)</button>
        </div>

        {/* Card Destaque */}
        <div className={`rounded-2xl p-5 border ${THEME.colors.border} ${THEME.colors.card}`}>
          <div className="text-lg font-semibold">Mensagem destaque</div>
          <div className="text-sm text-zinc-400">Sua mensagem em destaque na tela durante a live.</div>
          <button className={`mt-3 px-4 py-2 rounded-lg ${THEME.colors.accent2Bg} text-black`}>Destacar (20 Birita)</button>
        </div>
      </div>
    </Container>
  );
}

function Perfil({ user, items }) {
  return (
    <Container className="py-8">
      <h1 className={`text-3xl font-bold ${THEME.colors.accent}`}>Meu Perfil</h1>
      <div className="text-zinc-300">{user ? user.email : "Você não está logado."}</div>
      <div className="my-4 h-px bg-zinc-800"/>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className={`col-span-full rounded-2xl p-5 border ${THEME.colors.border} ${THEME.colors.card}`}>
            <div className="text-lg font-semibold">Nenhum NFT ainda</div>
            <div className="text-sm text-zinc-400">Resgate durante a live ou compre após o episódio.</div>
          </div>
        ) : (
          items.map((it, idx) => (
            <div key={idx} className={`rounded-2xl overflow-hidden border ${THEME.colors.border} ${THEME.colors.card}`}>
              <img src={it.cover} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="font-semibold">{it.title}</div>
                <div className="text-xs text-zinc-400">Token #{it.tokenId} • {new Date(it.when).toLocaleString()}</div>
                <div className="mt-3 flex justify-between">
                  <button className="px-3 py-1 border border-zinc-700 rounded" onClick={() => navigator.clipboard.writeText(it.txHash)}>Copiar Tx Hash</button>
                  <button className="px-3 py-1 border border-zinc-700 rounded">Exportar</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}

function AuthGate({ user, onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  if (user) return null;
  return (
    <Container>
      <div className="max-w-md mx-auto mt-8 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950 text-white">
        <div className="p-4 border-b border-zinc-800">
          <div className="text-lg font-semibold">Entre para continuar</div>
          <div className="text-sm text-zinc-400">Login por e-mail (OTP simulado). Depois trocamos por Clerk/Auth.js.</div>
        </div>
        <div className="p-4 flex gap-2">
          <input className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className={`px-3 py-2 rounded ${THEME.colors.accentBg}`} disabled={!email || loading} onClick={async () => { setLoading(true); await onLogin(email); setLoading(false); alert("Login realizado!"); }}>Entrar</button>
        </div>
      </div>
    </Container>
  );
}

// =============================================
// App
// =============================================
export default function App() {
  const [route, setRoute] = useState("/home");
  const { user, login, logout } = useAuth();
  const inventory = useInventory();
  const { items, add } = useUserNFTs();

  useEffect(() => {
    const apply = () => {
      const h = location.hash.replace("#", "");
      if (h) setRoute(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    window.location.hash = route;
  }, [route]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar route={route} setRoute={setRoute} user={user} logout={logout} />
      {!user && <AuthGate user={user} onLogin={login} />}
      {route === "/home" && <HomeLogo />}
      {route === "/historia" && <Historia />}
      {route === "/patrocinadores" && <Patrocinadores />}
      {route === "/birita" && <BiritaCoins user={user} />}
      {route === "/loja" && <Loja inventory={inventory} user={user} addNFT={add} />}
      {route === "/perfil" && <Perfil user={user} items={items} />}
      <Footer />
    </div>
  );
}
