import React, { useEffect, useState } from 'react'

const DEMO_DROP = {
  id: '123',
  title: 'NFT do Episódio #1 — Estreia Ao Vivo',
  cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
  description: 'Colecionável oficial do episódio #1. Resgate grátis durante a live. Após o término, disponível por Podcast Coins.',
  tokenId: 1,
  supplyTotal: 500,
  priceCoins: 30,
  liveWindowStart: new Date(Date.now() - 1000 * 60 * 60), // começou 1h atrás
  liveWindowEnd: new Date(Date.now() + 1000 * 60 * 60),   // termina em 1h
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { const it = localStorage.getItem(key); return it ? JSON.parse(it) : initialValue }
    catch { return initialValue }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)) }, [key, value])
  return [value, setValue]
}
function useNow(tickMs = 1000) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), tickMs); return () => clearInterval(id) }, [tickMs])
  return now
}
function countdownString(target, now) {
  const diff = target - now
  if (diff <= 0) return '00:00'
  const m = Math.floor(diff / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function useAuth() {
  const [user, setUser] = useLocalStorage('mvp_user', null)
  const login = async (email) => { await new Promise(r=>setTimeout(r,500)); setUser({ id: crypto.randomUUID(), email, coins: 100 }); return true }
  const logout = () => setUser(null)
  return { user, login, logout }
}
function useInventory() {
  const [minted, setMinted] = useLocalStorage('mvp_minted', 0)
  return { minted, remaining: Math.max(0, DEMO_DROP.supplyTotal - minted), dec: () => setMinted(m => m + 1) }
}
function useUserNFTs() {
  const [items, setItems] = useLocalStorage('mvp_nfts', [])
  const add = (nft) => setItems(arr => [nft, ...arr])
  return { items, add }
}

function Navbar({ route, setRoute, user, logout }) {
  return (
    <div className='w-full border-b bg-white/70 backdrop-blur sticky top-0 z-50'>
      <div className='container py-3 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='h-9 w-9 rounded-2xl bg-black text-white grid place-items-center font-bold'>P</div>
          <button onClick={()=>setRoute('/')} className='text-xl font-semibold'>Podcast NFTs</button>
          <span className='ml-2 px-2 py-0.5 text-xs border rounded'>MVP</span>
        </div>
        <div className='flex items-center gap-2'>
          <button className={'px-3 py-2 rounded ' + (route==='/'?'bg-black text-white':'hover:bg-slate-100')} onClick={()=>setRoute('/')}>Home</button>
          <button className={'px-3 py-2 rounded ' + (route==='/episodio/'+DEMO_DROP.id?'bg-black text-white':'hover:bg-slate-100')} onClick={()=>setRoute('/episodio/'+DEMO_DROP.id)}>Episódio</button>
          <button className={'px-3 py-2 rounded ' + (route==='/perfil'?'bg-black text-white':'hover:bg-slate-100')} onClick={()=>setRoute('/perfil')}>Perfil</button>
          {user ? <button className='px-3 py-2 rounded border' onClick={logout}>Sair</button> : null}
        </div>
      </div>
    </div>
  )
}

function AuthGate({ user, onLogin }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  if (user) return null
  return (
    <div className='container'>
      <div className='max-w-md mx-auto mt-8 border rounded-2xl overflow-hidden'>
        <div className='p-4 border-b'>
          <div className='text-lg font-semibold'>Entre para continuar</div>
          <div className='text-sm text-slate-500'>Login por e-mail (OTP simulado). Depois trocamos por Clerk/Auth.js.</div>
        </div>
        <div className='p-4 flex gap-2'>
          <input className='flex-1 border rounded px-3 py-2' placeholder='seu@email.com'
                 value={email} onChange={e=>setEmail(e.target.value)} />
          <button className='px-3 py-2 rounded bg-black text-white disabled:opacity-60'
                  disabled={!email||loading}
                  onClick={async()=>{setLoading(true); await onLogin(email); setLoading(false); alert('Login realizado!')}}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}

function Home({ setRoute, inventory, user }) {
  const now = useNow()
  const isLive = now >= DEMO_DROP.liveWindowStart && now <= DEMO_DROP.liveWindowEnd
  const countdown = countdownString(isLive?DEMO_DROP.liveWindowEnd:DEMO_DROP.liveWindowStart, now)
  return (
    <div className='container p-4'>
      <div className='grid md:grid-cols-2 gap-6 items-start mt-6'>
        <div className='border rounded-2xl overflow-hidden bg-white'>
          <img src={DEMO_DROP.cover} alt={DEMO_DROP.title} className='h-56 w-full object-cover' />
          <div className='p-5 border-b'>
            <div className='text-xl font-semibold'>{DEMO_DROP.title}</div>
            <div className='text-slate-600 text-sm mt-1'>{DEMO_DROP.description}</div>
            <div className='flex items-center gap-2 mt-3 flex-wrap'>
              <span className={'px-2 py-1 text-xs rounded border ' + (isLive?'bg-black text-white border-black':'')}>{isLive?'Ao vivo — resgate grátis':'Pré/Pós live'}</span>
              <span className='px-2 py-1 text-xs rounded border'>Polygon</span>
              <span className='px-2 py-1 text-xs rounded border'>Supply: {inventory.remaining} / {DEMO_DROP.supplyTotal}</span>
            </div>
            <div className='text-sm text-slate-500 mt-3'>{isLive?`Encerra em ${countdown}`:`Começa em ${countdown}`}</div>
          </div>
          <div className='p-5 flex justify-between'>
            <button onClick={()=>setRoute('/episodio/'+DEMO_DROP.id)} className='px-4 py-2 bg-black text-white rounded text-base'>{isLive?'Resgatar grátis':`Comprar por ${DEMO_DROP.priceCoins} Coins`}</button>
            <button onClick={()=>setRoute('/perfil')} className='px-4 py-2 border rounded'>Meu Perfil</button>
          </div>
        </div>
        <div className='border rounded-2xl p-5 bg-white'>
          <div className='text-lg font-semibold'>Como funciona</div>
          <div className='text-sm text-slate-600 mt-2 space-y-2'>
            <p>1. Login por e-mail (criamos carteira segura pra você).</p>
            <p>2. Durante a live, resgate grátis. Depois, use Podcast Coins (em breve: compra com cartão/Pix).</p>
            <p>3. O colecionável aparece no Perfil, com opção de exportar para sua própria carteira.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Episodio({ inventory, user, addNFT }) {
  const now = useNow()
  const isLive = now >= DEMO_DROP.liveWindowStart && now <= DEMO_DROP.liveWindowEnd
  const [loading, setLoading] = useState(false)

  async function handleMint(source) {
    if (!user) return alert('Faça login primeiro.')
    if (inventory.remaining <= 0) return alert('Esgotado.')
    setLoading(true)
    try {
      await new Promise(r=>setTimeout(r,800)) // simula mint
      addNFT({ tokenId: DEMO_DROP.tokenId, title: DEMO_DROP.title, cover: DEMO_DROP.cover, txHash: Math.random().toString(16).slice(2), when: new Date().toISOString(), source })
      inventory.dec()
      alert('NFT entregue no seu perfil!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container p-4'>
      <div className='grid md:grid-cols-2 gap-6 items-start mt-6'>
        <div className='border rounded-2xl overflow-hidden bg-white'>
          <img src={DEMO_DROP.cover} className='h-56 w-full object-cover' />
          <div className='p-5 border-b'>
            <div className='text-xl font-semibold'>{DEMO_DROP.title}</div>
            <div className='text-slate-600 text-sm mt-1'>Supply restante: {inventory.remaining} / {DEMO_DROP.supplyTotal}</div>
            <div className='flex items-center gap-2 mt-3 flex-wrap'>
              <span className={'px-2 py-1 text-xs rounded border ' + (isLive?'bg-black text-white border-black':'')}>{isLive?'Ao vivo — resgate grátis':'Pós-live'}</span>
              <span className='px-2 py-1 text-xs rounded border'>Polygon</span>
              <span className='px-2 py-1 text-xs rounded border'>Token ID: {DEMO_DROP.tokenId}</span>
            </div>
          </div>
          <div className='p-5 flex gap-2 flex-wrap'>
            <button className='px-4 py-2 rounded bg-black text-white disabled:opacity-60' disabled={!isLive || loading || inventory.remaining<=0} onClick={()=>handleMint('live')}>Resgatar grátis</button>
            <button className='px-4 py-2 rounded border disabled:opacity-60' disabled={isLive || loading || inventory.remaining<=0} onClick={()=>alert('Em breve: comprar por Coins (cartão/Pix).')}>Comprar por {DEMO_DROP.priceCoins} Coins</button>
          </div>
        </div>
        <div className='border rounded-2xl p-5 bg-white'>
          <div className='text-lg font-semibold'>Segurança & Custódia</div>
          <div className='text-sm text-slate-600 mt-2 space-y-2'>
            <p>• Mint executado por provedor (Crossmint/Paper) no Polygon (testnet Amoy no MVP).</p>
            <p>• Carteira custodial por e-mail. Exportação opcional para carteira própria depois.</p>
            <p>• Exibiremos link do Polygonscan após o mint real.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Perfil({ user, items }) {
  return (
    <div className='container p-4'>
      <div className='mt-6'>
        <div className='text-2xl font-semibold'>Meu Perfil</div>
        <div className='text-sm text-slate-600'>{user ? user.email : 'Você não está logado.'}</div>
        <div className='mt-3 flex items-center gap-3'>
          <span className='px-2 py-1 text-xs border rounded'>Carteira custodial</span>
          <span className='px-2 py-1 text-xs border rounded bg-slate-100'>Saldo: {user?.coins ?? 0} Coins</span>
        </div>
      </div>
      <div className='my-4 h-px bg-slate-200' />
      <div className='grid md:grid-cols-3 sm:grid-cols-2 gap-4'>
        {items.length===0 ? (
          <div className='col-span-full border rounded-2xl p-5 bg-white'>
            <div className='text-lg font-semibold'>Nenhum NFT ainda</div>
            <div className='text-sm text-slate-600'>Resgate durante a live ou compre após o episódio.</div>
          </div>
        ) : items.map((it, idx)=>(
          <div key={idx} className='border rounded-2xl overflow-hidden bg-white'>
            <img src={it.cover} className='h-40 w-full object-cover' />
            <div className='p-4'>
              <div className='font-semibold'>{it.title}</div>
              <div className='text-xs text-slate-500'>Token #{it.tokenId} • {new Date(it.when).toLocaleString()}</div>
              <div className='mt-3 flex justify-between'>
                <button className='px-3 py-1 border rounded' onClick={()=>navigator.clipboard.writeText(it.txHash)}>Copiar Tx Hash</button>
                <button className='px-3 py-1 border rounded'>Exportar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App(){
  const [route, setRoute] = useState('/')
  const { user, login, logout } = useAuth()
  const inventory = useInventory()
  const { items, add } = useUserNFTs()

  useEffect(()=>{
    const apply = () => { const h = location.hash.replace('#',''); if(h) setRoute(h) }
    apply(); window.addEventListener('hashchange', apply)
    return ()=>window.removeEventListener('hashchange', apply)
  },[])
  useEffect(()=>{ window.location.hash = route },[route])

  return (
    <div>
      <Navbar route={route} setRoute={setRoute} user={user} logout={logout}/>
      <main className='min-h-[calc(100vh-64px)]'>
        {!user && <AuthGate onLogin={login} />}
        {route==='/' && <Home setRoute={setRoute} inventory={inventory} user={user} />}
        {route==='/episodio/'+DEMO_DROP.id && <Episodio inventory={inventory} user={user} addNFT={add} />}
        {route==='/perfil' && <Perfil user={user} items={items} />}
      </main>
      <footer className='border-t bg-white/50'>
        <div className='container py-6 text-sm text-slate-600 flex flex-wrap gap-4 justify-between'>
          <div>© {new Date().getFullYear()} Podcast NFTs — MVP</div>
          <div className='flex gap-2'>
            <span className='px-2 py-1 text-xs border rounded'>Next: integrar Crossmint/Paper</span>
            <span className='px-2 py-1 text-xs border rounded'>Amoy → Mainnet</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
