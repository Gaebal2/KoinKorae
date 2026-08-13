import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  Home,
  ImagePlus,
  Map,
  MapPin,
  MessageCircle,
  Plus,
  Repeat2,
  Search,
  Shield,
  Swords,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import cmcCoins from "./cmc-top100.json";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;

const seedPosts = [
  {
    id: 1,
    author: "blockwhale",
    initials: "BW",
    coin: "BTC",
    age: "12분",
    content:
      "비트코인 오픈소스 개발자 후원 캠페인이 시작됐습니다. 커뮤니티의 힘을 보여주세요.",
    support: 1840,
    oppose: 210,
    comments: 84,
    reposts: 32,
    tone: "orange",
  },
  {
    id: 2,
    author: "sol_runner",
    initials: "SR",
    coin: "SOL",
    age: "38분",
    content:
      "서울 빌더 밋업 후기를 공유합니다. 작은 팀들이 만든 제품이 정말 인상적이었어요.",
    support: 932,
    oppose: 401,
    comments: 51,
    reposts: 18,
    tone: "purple",
  },
  {
    id: 3,
    author: "ethernaut",
    initials: "ET",
    coin: "ETH",
    age: "1시간",
    content:
      "퍼블릭 굿즈는 누가 지켜야 할까요? 지속 가능한 생태계에 대한 제안입니다.",
    support: 1260,
    oppose: 1180,
    comments: 203,
    reposts: 67,
    tone: "blue",
  },
  {
    id: 4,
    author: "xrpulse",
    initials: "XP",
    coin: "XRP",
    age: "3시간",
    content:
      "국경 없는 결제가 지역 소상공인에게 가져올 변화에 대해 이야기해 봅시다.",
    support: 476,
    oppose: 96,
    comments: 29,
    reposts: 11,
    tone: "slate",
  },
];
const seedPins = [
  {
    id: 1,
    title: "블록체인 스터디",
    description: "매주 목요일, 초보자 환영",
    coin: "ETH",
    tradeCoins: ["ETH", "USDT"],
    link: "https://ethereum.org",
    category: "서비스",
    lat: 37.5719,
    lng: 126.9769,
    owner: false,
    image: asset("cinema-feed.png"),
    creator: "ethernaut",
    creatorImage: asset("icon-192.png"),
  },
  {
    id: 2,
    title: "크립토 북카페",
    description: "커피 결제 및 커뮤니티 모임",
    coin: "BTC",
    tradeCoins: ["BTC", "USDT"],
    link: "",
    category: "비즈니스",
    lat: 37.5663,
    lng: 126.9828,
    owner: false,
    image: asset("cinema-feed.png"),
    creator: "blockwhale",
    creatorImage: asset("icon-192.png"),
  },
  {
    id: 3,
    title: "중고 노트북",
    description: "개발용 노트북 판매합니다",
    coin: "SOL",
    tradeCoins: ["SOL", "USDC"],
    link: "",
    category: "판매",
    lat: 37.5628,
    lng: 126.973,
    owner: false,
    image: asset("cinema-feed.png"),
    creator: "sol_runner",
    creatorImage: asset("icon-192.png"),
  },
];
const windows = ["오늘", "이번 달", "올해", "전체"];
const categories = ["노출", "논쟁", "급상승", "최신", "팔로잉"];
const nav = [
  ["home", "홈", Home],
  ["map", "지도", Map],
  ["check", "체크인", CalendarCheck],
  ["profile", "프로필", CircleUserRound],
];
const fmt = (n) =>
  new Intl.NumberFormat("ko-KR", {
    notation: Math.abs(n) > 999 ? "compact" : "standard",
  }).format(n);
const exposure = (p) => p.support - p.oppose;
const coinColor = (s) =>
  ({
    BTC: "#f59e0b",
    ETH: "#627eea",
    SOL: "#14b8a6",
    XRP: "#334155",
    ADA: "#2875d2",
  })[s] || "#266b4f";

function Coin({ symbol, size = "md" }) {
  return (
    <span
      className={`coin coin-${size}`}
      style={{ "--coin": coinColor(symbol) }}
    >
      {symbol.slice(0, 4)}
    </span>
  );
}
function Header({ bp }) {
  return (
    <header className="topbar">
      <div className="logo">
        <span>BF</span>
        <div>
          BattleFeed<small>POWERED BY PEOPLE</small>
        </div>
      </div>
      <div className="bp-pill">
        <Zap /> <b>{bp}</b> BP
      </div>
    </header>
  );
}
function Segments({ items, value, onChange, compact = false }) {
  return (
    <div className={`segments ${compact ? "compact" : ""}`}>
      {items.map((item) => (
        <button
          key={item}
          className={value === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function PostCard({ post, onBattle, onComment, onRepost, rank }) {
  const total = post.support + post.oppose || 1;
  return (
    <article className="post-card">
      <div className="post-head">
        <span className={`avatar tone-${post.tone}`}>{post.initials}</span>
        <div>
          <b>@{post.author}</b>
          <span>{post.age}</span>
        </div>
        {rank && <span className="rank">#{rank}</span>}
        <Coin symbol={post.coin} />
      </div>
      <p className="post-body">{post.content}</p>
      <div className="battle-meter">
        <i style={{ width: `${(post.support / total) * 100}%` }} />
        <span>지지 {fmt(post.support)}</span>
        <span>반대 {fmt(post.oppose)}</span>
      </div>
      <div className="score-row">
        <div>
          <small>노출 점수</small>
          <strong className={exposure(post) < 0 ? "negative" : ""}>
            {exposure(post) > 0 ? "+" : ""}
            {fmt(exposure(post))}
          </strong>
        </div>
        <div className="card-actions">
          <button onClick={() => onComment(post)}>
            <MessageCircle />
            {post.comments}
          </button>
          <button onClick={() => onRepost(post)}>
            <Repeat2 />
            {post.reposts}
          </button>
          <button className="battle-btn" onClick={() => onBattle(post)}>
            <Swords />
            배틀
          </button>
        </div>
      </div>
    </article>
  );
}

function HomePage({ posts, setPosts, bp, setBp, onCompose }) {
  const [feed, setFeed] = useState("유저 피드");
  const [window, setWindow] = useState("오늘");
  const [category, setCategory] = useState("노출");
  const [battle, setBattle] = useState(null);
  const [commentPost, setCommentPost] = useState(null);
  const [comment, setComment] = useState("");
  const sorted = useMemo(
    () =>
      [...posts].sort((a, b) =>
        category === "논쟁"
          ? b.support + b.oppose - (a.support + a.oppose)
          : category === "최신"
            ? b.id - a.id
            : exposure(b) - exposure(a),
      ),
    [posts, category],
  );
  const groups = useMemo(
    () =>
      Object.entries(
        posts.reduce((a, p) => {
          (a[p.coin] ??= []).push(p);
          return a;
        }, {}),
      ).sort(
        (a, b) =>
          b[1].reduce((s, p) => s + exposure(p), 0) -
          a[1].reduce((s, p) => s + exposure(p), 0),
      ),
    [posts],
  );
  const updateScore = (id, type, score) =>
    setPosts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, [type]: p[type] + score } : p)),
    );
  const repost = (p) =>
    setPosts((ps) =>
      ps.map((x) => (x.id === p.id ? { ...x, reposts: x.reposts + 1 } : x)),
    );
  return (
    <>
      <main>
        <div className="hero">
          <div>
            <span>커뮤니티가 만드는 순위</span>
            <h1>
              숨겨진 알고리즘 없이
              <br />
              참여로 노출을 결정하세요.
            </h1>
          </div>
          <Trophy />
        </div>
        <Segments
          items={["유저 피드", "코인 피드"]}
          value={feed}
          onChange={setFeed}
        />
        <div className="filters">
          <Segments
            items={windows}
            value={window}
            onChange={setWindow}
            compact
          />
          <span className="filter-divider" />
          <Segments
            items={categories}
            value={category}
            onChange={setCategory}
            compact
          />
        </div>
        {feed === "유저 피드" ? (
          <div className="feed">
            {sorted.map((p, i) => (
              <PostCard
                key={p.id}
                post={p}
                rank={i + 1}
                onBattle={setBattle}
                onComment={setCommentPost}
                onRepost={repost}
              />
            ))}
          </div>
        ) : (
          <CoinFeed
            groups={groups}
            onBattle={setBattle}
            onComment={setCommentPost}
            onRepost={repost}
          />
        )}
        <button className="fab" onClick={onCompose}>
          <Plus />
        </button>
      </main>
      {battle && (
        <BattleModal
          post={battle}
          bp={bp}
          onClose={() => setBattle(null)}
          onFinish={(type, score) => {
            setBp((v) => v - 1);
            updateScore(battle.id, type, score);
            setBattle(null);
          }}
        />
      )}
      {commentPost && (
        <Modal title="댓글 쓰기" onClose={() => setCommentPost(null)}>
          <p className="quoted">
            @{commentPost.author} · {commentPost.content}
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="의견을 남겨주세요"
          />
          <button
            className="primary"
            disabled={!comment.trim()}
            onClick={() => {
              setPosts((ps) =>
                ps.map((p) =>
                  p.id === commentPost.id
                    ? { ...p, comments: p.comments + 1 }
                    : p,
                ),
              );
              setCommentPost(null);
              setComment("");
            }}
          >
            댓글 게시
          </button>
        </Modal>
      )}
    </>
  );
}
function CoinFeed({ groups, ...actions }) {
  const [closed, setClosed] = useState({});
  return (
    <div>
      {groups.map(([coin, items], i) => {
        const score = items.reduce((s, p) => s + exposure(p), 0);
        return (
          <section className="coin-group" key={coin}>
            <button
              className="coin-group-head"
              onClick={() => setClosed((c) => ({ ...c, [coin]: !c[coin] }))}
            >
              <Coin symbol={coin} />
              <div>
                <b>
                  #{i + 1} {coin}
                </b>
                <small>
                  코인 노출 {score > 0 ? "+" : ""}
                  {fmt(score)}
                </small>
              </div>
              {closed[coin] ? <ChevronDown /> : <ChevronUp />}
            </button>
            {!closed[coin] &&
              items.map((p, n) => (
                <PostCard key={p.id} post={p} rank={n + 1} {...actions} />
              ))}
          </section>
        );
      })}
    </div>
  );
}
function BattleModal({ post, bp, onClose, onFinish }) {
  const [side, setSide] = useState(null),
    [phase, setPhase] = useState("choose"),
    [score, setScore] = useState(0),
    [time, setTime] = useState(5);
  const start = (s) => {
    if (bp < 1) return;
    setSide(s);
    setPhase("game");
    setScore(0);
    setTime(5);
  };
  const tap = () => {
    if (phase !== "game" || time <= 0) return;
    setScore((v) => v + Math.floor(Math.random() * 6) + 5);
    setTime((v) => {
      const next = Math.max(0, v - 1);
      if (next === 0) setPhase("result");
      return next;
    });
  };
  return (
    <Modal title="배틀 참여" onClose={onClose}>
      <div className="battle-title">
        <Coin symbol={post.coin} />
        <div>
          <b>@{post.author}</b>
          <span>참가 비용 1 BP · 보유 {bp} BP</span>
        </div>
      </div>
      {phase === "choose" ? (
        <>
          <p className="center">어느 쪽에서 배틀하시겠어요?</p>
          <div className="side-choice">
            <button disabled={bp < 1} onClick={() => start("support")}>
              <Shield />
              지지
            </button>
            <button disabled={bp < 1} onClick={() => start("oppose")}>
              <Swords />
              반대
            </button>
          </div>
          {bp < 1 && (
            <p className="error">BP가 부족합니다. 체크인으로 BP를 받으세요.</p>
          )}
        </>
      ) : (
        <div className="minigame">
          <span className="game-label">랜덤 게임 · 스피드 탭</span>
          <div className="game-stats">
            <b>{score}</b>
            <span>남은 탭 {time}</span>
          </div>
          {phase === "game" ? (
            <button className="tap-target" onClick={tap}>
              TAP!
            </button>
          ) : (
            <>
              <Trophy />
              <h2>{score}점 획득!</h2>
              <p>{side === "support" ? "지지" : "반대"} 점수에 반영됩니다.</p>
              <button className="primary" onClick={() => onFinish(side, score)}>
                결과 반영
              </button>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

function MapPage({ pins, setPins, lifetime, bp, setBp }) {
  const mapEl = useRef(null),
    mapRef = useRef(null),
    layerRef = useRef(null);
  const [editing, setEditing] = useState(false),
    [selected, setSelected] = useState(null),
    [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const limit = lifetime >= 10000 ? 3 : lifetime >= 1000 ? 2 : 1;
  const mine = pins.filter((p) => p.owner).length;
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(mapEl.current, { zoomControl: false }).setView(
      [center.lat, center.lng],
      14,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    map.on("moveend", () => {
      const c = map.getCenter();
      setCenter({ lat: +c.lat.toFixed(6), lng: +c.lng.toFixed(6) });
    });
    map.on("click", () => setSelected(null));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (!mapRef.current) return;
    layerRef.current?.remove();
    const layer = L.layerGroup().addTo(mapRef.current);
    pins.forEach((p) => {
      const icon = L.divIcon({
        className: "battle-map-marker",
        html: `<span style="--pin:${coinColor(p.coin)}">${p.coin.slice(0, 4)}</span>`,
        iconSize: [40, 48],
        iconAnchor: [20, 45],
      });
      L.marker([p.lat, p.lng], { icon })
        .addTo(layer)
        .on("click", (event) => {
          L.DomEvent.stopPropagation(event.originalEvent);
          setSelected(p);
        });
    });
    layerRef.current = layer;
  }, [pins]);
  return (
    <main className="map-page">
      <div className="map-stage">
        <div className="real-map" ref={mapEl} />
        <div className="map-crosshair" aria-label="핀 생성 위치">
          +
        </div>
        <div className="center-coordinate">
          {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
        </div>
      </div>
      <div className="map-toolbar">
        <span>
          내 핀 {mine}/{limit} · 보유 {bp} BP
        </span>
        <button
          disabled={mine >= limit || bp < 1}
          onClick={() => setEditing(true)}
        >
          <Plus />핀 만들기
        </button>
      </div>
      {selected && (
        <div className="pin-detail">
          {selected.image && (
            <img className="pin-detail-photo" src={selected.image} alt="핀 등록 사진" />
          )}
          <div className="pin-detail-content">
            <div className="pin-creator">
              <Coin symbol={selected.coin} size="sm" />
              <img src={selected.creatorImage || asset("icon-192.png")} alt="핀 생성자 프로필" />
              <span>@{selected.creator || "battle_newbie"}</span>
            </div>
            <small>
              거래 가능한 코인: {selected.tradeCoins?.join(", ")}
            </small>
            <b>{selected.title}</b>
            <p>{selected.description}</p>
            {selected.link && (
              <a href={selected.link} target="_blank" rel="noreferrer">
                링크 열기
              </a>
            )}
          </div>
          {selected.owner && (
            <button className="pin-delete"
              aria-label="핀 삭제"
              title="핀 삭제"
              onClick={() => {
                setPins((ps) => ps.filter((p) => p.id !== selected.id));
                setSelected(null);
              }}
            >
              <X />
            </button>
          )}
        </div>
      )}
      {editing && (
        <PinForm
          center={center}
          onClose={() => setEditing(false)}
          onSave={(p) => {
            setPins((ps) => [
              ...ps,
              { ...p, id: Date.now(), owner: true, category: "커뮤니티", creator: "battle_newbie", creatorImage: asset("icon-192.png") },
            ]);
            setBp((v) => v - 1);
            setEditing(false);
          }}
        />
      )}
    </main>
  );
}
function PinForm({ center, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    coin: "BTC",
    tradeCoins: [],
    link: "",
    lat: center.lat,
    lng: center.lng,
    image: "",
  });
  const fileRef = useRef(null);
  const coins = cmcCoins.slice(0, 30);
  const toggle = (s) =>
    setForm((f) => ({
      ...f,
      tradeCoins: f.tradeCoins.includes(s)
        ? f.tradeCoins.filter((x) => x !== s)
        : [...f.tradeCoins, s],
    }));
  const valid =
    form.title.trim() &&
    form.description.trim() &&
    form.coin &&
    form.tradeCoins.length > 0 &&
    Number.isFinite(+form.lat) &&
    Number.isFinite(+form.lng);
  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };
  return (
    <Modal title="새 지도 핀" onClose={onClose}>
      <div className="pin-location">
        <MapPin />
        <div>
          <b>지도 중앙의 + 위치</b>
          <span>
            위도 {form.lat} · 경도 {form.lng}
          </span>
        </div>
      </div>
      <div className="coordinate-fields">
        <Field label="위도">
          <input
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => setForm({ ...form, lat: e.target.value })}
          />
        </Field>
        <Field label="경도">
          <input
            type="number"
            step="any"
            value={form.lng}
            onChange={(e) => setForm({ ...form, lng: e.target.value })}
          />
        </Field>
      </div>
      <Field label="지지하는 코인 (핀 이미지)">
        <select
          value={form.coin}
          onChange={(e) => setForm({ ...form, coin: e.target.value })}
        >
          {coins.map((c) => (
            <option key={c.id}>{c.symbol}</option>
          ))}
        </select>
      </Field>
      <Field label="거래 가능한 코인 (복수 선택)">
        <div className="trade-coins">
          {coins.map((c) => (
            <button
              type="button"
              key={c.id}
              className={form.tradeCoins.includes(c.symbol) ? "selected" : ""}
              onClick={() => toggle(c.symbol)}
            >
              <Coin symbol={c.symbol} size="sm" />
              {c.symbol}
              {form.tradeCoins.includes(c.symbol) && <Check />}
            </button>
          ))}
        </div>
      </Field>
      <Field label="제목">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="핀 제목을 입력하세요"
        />
      </Field>
      <Field label="설명">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="상품, 서비스 또는 장소를 설명하세요"
        />
      </Field>
      <Field label="링크 (선택)">
        <input
          type="url"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https:// 홈페이지 또는 소셜 링크"
        />
      </Field>
      <Field label="사진 (선택 · 1장)">
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={chooseImage} />
        {form.image ? (
          <div className="pin-photo-preview">
            <img src={form.image} alt="업로드 사진 미리보기" />
            <button type="button" onClick={() => setForm({ ...form, image: "" })}><X /></button>
          </div>
        ) : (
          <button type="button" className="pin-photo-picker" onClick={() => fileRef.current?.click()}><ImagePlus />사진 선택</button>
        )}
      </Field>
      <button
        className="primary"
        disabled={!valid}
        onClick={() => onSave({ ...form, lat: +form.lat, lng: +form.lng })}
      >
        이 위치에 핀 등록 · 1 BP
      </button>
      <button className="secondary" onClick={onClose}>
        취소
      </button>
    </Modal>
  );
}
function CheckinPage({ bp, setBp, lifetime, setLifetime }) {
  const [checked, setChecked] = useState(false),
    [adCount, setAdCount] = useState(0);
  const reward = (n) => {
    setBp((v) => v + n);
    setLifetime((v) => v + n);
  };
  return (
    <main>
      <PageTitle
        icon={CalendarCheck}
        title="오늘의 BP"
        sub="참여에 필요한 Battle Point를 모으세요"
      />
      <section className="balance-card">
        <span>사용 가능한 BP</span>
        <strong>{bp}</strong>
        <small>Lifetime Earned · {lifetime.toLocaleString()} BP</small>
      </section>
      <section className="check-card">
        <div className="calendar-mark">
          <CalendarCheck />
        </div>
        <h2>{checked ? "오늘 출석 완료!" : "매일 출석하고 +10 BP"}</h2>
        <p>
          {checked
            ? "내일 다시 만나요."
            : "연속 참여로 커뮤니티 영향력을 키워보세요."}
        </p>
        <button
          className="primary"
          disabled={checked}
          onClick={() => {
            setChecked(true);
            reward(10);
          }}
        >
          {checked ? (
            <>
              <Check />
              지급 완료
            </>
          ) : (
            <>
              <Zap />
              출석 체크
            </>
          )}
        </button>
      </section>
      <section className="reward-row">
        <div>
          <span>REWARDED AD</span>
          <b>짧은 광고 보고 +20 BP</b>
          <small>오늘 {adCount}/3회 참여</small>
        </div>
        <button
          disabled={adCount >= 3}
          onClick={() => {
            setAdCount((v) => v + 1);
            reward(20);
          }}
        >
          받기
        </button>
      </section>
      <div className="notice-box">
        <Shield />
        <p>
          <b>BP는 플랫폼 참여 자원입니다.</b>
          <br />
          현금이나 암호화폐가 아니며 전송·교환할 수 없습니다.
        </p>
      </div>
    </main>
  );
}
function ProfilePage({ posts, bp, lifetime }) {
  const [tab, setTab] = useState("게시물");
  const tier =
    lifetime >= 10000 ? "Gold" : lifetime >= 1000 ? "Silver" : "Bronze";
  return (
    <main>
      <section className="profile-head">
        <span className="profile-avatar">ME</span>
        <h1>@battle_newbie</h1>
        <p>투명한 피드와 열린 커뮤니티를 응원합니다.</p>
        <div className="profile-stats">
          <div>
            <b>{posts.length}</b>
            <span>게시물</span>
          </div>
          <div>
            <b>{bp}</b>
            <span>현재 BP</span>
          </div>
          <div>
            <b>{lifetime}</b>
            <span>Lifetime BP</span>
          </div>
        </div>
      </section>
      <section className="tier-card">
        <Trophy />
        <div>
          <small>현재 등급</small>
          <b>{tier}</b>
          <span>
            핀 슬롯 {tier === "Gold" ? 3 : tier === "Silver" ? 2 : 1}개 사용
            가능
          </span>
        </div>
        <i style={{ width: `${Math.min(100, lifetime / 10)}%` }} />
      </section>
      <Segments
        items={["게시물", "리포스트", "활동"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "게시물" ? (
        <div className="empty-state">
          <BarChart3 />
          <h3>아직 작성한 게시물이 없습니다</h3>
          <p>첫 의견을 커뮤니티와 나눠보세요.</p>
        </div>
      ) : tab === "리포스트" ? (
        <div className="empty-state">
          <Repeat2 />
          <h3>리포스트가 여기에 표시됩니다</h3>
          <p>리포스트는 글로벌 순위에 포함되지 않습니다.</p>
        </div>
      ) : (
        <div className="activity-list">
          <div>
            <Swords />
            <span>총 배틀 참여</span>
            <b>12회</b>
          </div>
          <div>
            <Zap />
            <span>Lifetime BP</span>
            <b>{lifetime}</b>
          </div>
          <div>
            <MapPin />
            <span>지도 핀</span>
            <b>1개</b>
          </div>
        </div>
      )}
    </main>
  );
}
function Composer({ onClose, onPublish }) {
  const [content, setContent] = useState(""),
    [coin, setCoin] = useState("BTC"),
    [query, setQuery] = useState("");
  const list = cmcCoins
    .filter((c) =>
      `${c.name} ${c.symbol}`.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 12);
  return (
    <Modal title="새 게시물" onClose={onClose}>
      <textarea
        className="composer-text"
        autoFocus
        value={content}
        maxLength={500}
        onChange={(e) => setContent(e.target.value)}
        placeholder="커뮤니티에 어떤 이야기를 전할까요?"
      />
      <span className="counter">{content.length}/500</span>
      <label className="search">
        <Search />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="지원 코인 검색"
        />
      </label>
      <div className="coin-list">
        {list.map((c) => (
          <button
            className={coin === c.symbol ? "selected" : ""}
            key={c.id}
            onClick={() => setCoin(c.symbol)}
          >
            <Coin symbol={c.symbol} />
            <span>
              <b>{c.name}</b>
              <small>
                {c.symbol} · #{c.cmcRank}
              </small>
            </span>
            {coin === c.symbol && <Check />}
          </button>
        ))}
      </div>
      <button
        className="primary"
        disabled={!content.trim()}
        onClick={() =>
          onPublish({
            id: Date.now(),
            author: "battle_newbie",
            initials: "ME",
            coin,
            age: "방금",
            content: content.trim(),
            support: 0,
            oppose: 0,
            comments: 0,
            reposts: 0,
            tone: "green",
          })
        }
      >
        게시하기
      </button>
    </Modal>
  );
}
function Modal({ title, onClose, children }) {
  return (
    <div className="overlay">
      <section className="modal">
        <header>
          <b>{title}</b>
          <button onClick={onClose} aria-label="닫기">
            <X />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function PageTitle({ icon: Icon, title, sub }) {
  return (
    <div className="page-title">
      <span>
        <Icon />
      </span>
      <div>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
    </div>
  );
}
function App() {
  const [page, setPage] = useState("home"),
    [posts, setPosts] = useState(seedPosts),
    [pins, setPins] = useState(seedPins),
    [bp, setBp] = useState(24),
    [lifetime, setLifetime] = useState(680),
    [compose, setCompose] = useState(false);
  return (
    <div className={`app-shell ${page === "map" ? "map-active" : ""}`}>
      <Header bp={bp} />
      {page === "home" && (
        <HomePage
          posts={posts}
          setPosts={setPosts}
          bp={bp}
          setBp={setBp}
          onCompose={() => setCompose(true)}
        />
      )}{" "}
      {page === "map" && (
        <MapPage
          pins={pins}
          setPins={setPins}
          lifetime={lifetime}
          bp={bp}
          setBp={setBp}
        />
      )}{" "}
      {page === "check" && (
        <CheckinPage
          bp={bp}
          setBp={setBp}
          lifetime={lifetime}
          setLifetime={setLifetime}
        />
      )}{" "}
      {page === "profile" && (
        <ProfilePage
          posts={posts.filter((p) => p.author === "battle_newbie")}
          bp={bp}
          lifetime={lifetime}
        />
      )}
      <nav className="bottom-nav">
        {nav.map(([id, label, Icon]) => (
          <button
            key={id}
            className={page === id ? "active" : ""}
            onClick={() => setPage(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {compose && (
        <Composer
          onClose={() => setCompose(false)}
          onPublish={(p) => {
            setPosts((ps) => [p, ...ps]);
            setCompose(false);
            setPage("home");
          }}
        />
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
if ("serviceWorker" in navigator)
  window.addEventListener("load", () =>
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`),
  );
