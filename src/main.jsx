import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AlarmClock, CalendarDays, Heart, Home, Map, Menu, MessageCircle, Search, Settings, Share2} from 'lucide-react';
import './styles.css';

const coinData = [
  {id:'BTC', glyph:'₿', className:'bitcoin'},
  {id:'ETH', glyph:'◆', className:'ethereum'},
  {id:'SOL', glyph:'≋', className:'solana'},
  {id:'XRP', glyph:'⌁', className:'xrp'},
  {id:'ADA', glyph:'⠿', className:'cardano'},
];

function Brand(){return <div className="brand" aria-label="코인고래"><span>ㅋ</span><span>ㅇ</span><span>ㄱ</span><span>ㄹ</span></div>}
function CoinBadge({coin,small=false}){return <div className={`coin-badge ${coin.className} ${small?'small':''}`} aria-label={coin.id}><span>{coin.glyph}</span></div>}

function Header(){return <header className="main-header"><button aria-label="메뉴"><Menu/></button><Brand/><div><button aria-label="검색"><Search/></button><button aria-label="설정"><Settings/></button></div></header>}

function HotCoins(){return <section className="hot-coins"><h2>🔥 코인고래 불장 코인</h2><p>지금 호들러들이 가장 불장을 지지하는 코인</p><div className="coin-row">{coinData.map(coin=><CoinBadge key={coin.id} coin={coin}/>)}</div></section>}

function FeedCard(){const [liked,setLiked]=useState(false);return <article className="feed-card"><div className="feed-media"><img src={`${import.meta.env.BASE_URL}cinema-feed.png`} alt="어두운 극장에서 영화를 기다리는 관객들"/><div className="profile-dot"><span>코</span></div><CoinBadge coin={coinData[0]} small/></div><div className="feed-copy"><h2>비트코인 앞으로 5년 안<br/>에 대박ㅋ</h2><p>ㅋㅋㅋㅋ<br/>ㅋㅋㅋㅋ<br/>ㅋㅋ<br/>ㅋㅋㅋㅋㅋㅋzzz<br/>zzzzzzzz<br/>zzzzzzㅋ<br/>ㅋㅋㅋ<br/>ㅋㅋㅋㅋ...</p><div className="feed-actions"><button><MessageCircle/><span>12,456</span></button><button className={liked?'liked':''} onClick={()=>setLiked(!liked)}><Heart fill={liked?'currentColor':'none'}/><span>{liked?'60':'59'}</span></button><button><Share2/></button></div></div></article>}

function MainFeed(){const [tab,setTab]=useState('user');return <><Header/><main className="main-content"><div className="feed-tabs"><button className={tab==='user'?'active':''} onClick={()=>setTab('user')}>유저피드</button><button className={tab==='coin'?'active':''} onClick={()=>setTab('coin')}>코인피드</button></div>{tab==='user'?<><HotCoins/><FeedCard/></>:<div className="empty-feed"><span>₿</span><h2>코인 피드</h2><p>코인별 인기 게시물이 곧 표시됩니다.</p></div>}</main></>}

const navItems=[
  {id:'home',label:'홈',Icon:Home},
  {id:'map',label:'지도화면',Icon:Map},
  {id:'check',label:'출석체크',Icon:CalendarDays},
  {id:'alarm',label:'알람',Icon:AlarmClock},
  {id:'chat',label:'채팅',Icon:MessageCircle},
];

function App(){const [page,setPage]=useState('home');return <div className="app-shell">{page==='home'?<MainFeed/>:<><Header/><main className="placeholder"><span>{navItems.find(item=>item.id===page)?.label}</span><p>이 화면은 다음 단계에서 구현합니다.</p></main></>}<nav className="bottom-nav">{navItems.map(({id,label,Icon})=><button key={id} className={page===id?'active':''} onClick={()=>setPage(id)}><Icon fill={id==='home'&&page===id?'currentColor':'none'}/><span>{label}</span></button>)}</nav></div>}

createRoot(document.getElementById('root')).render(<App/>);
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`));
