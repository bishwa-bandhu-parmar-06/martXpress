import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Share2,
  ShoppingBag,
  Zap,
  Heart,
  Star,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { toCategorySlug } from "../../utils/categorySlug";
import { addProductToCart } from "../../API/Cart/getAllCartProductApi.js";
import { setCartQuantity } from "../../Features/Cart/CartSlice.js";
import {
  addProductToWishList,
  removeASingleWishlistProduct,
} from "../../API/Cart/wishListApi.js";
import {
  addToWishlistRedux,
  removeFromWishlistRedux,
} from "../../Features/Cart/WishlistSlice";

/* ─── inject styles once ─────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cp-root { font-family: 'DM Sans', sans-serif; }
  .cp-root * { box-sizing: border-box; }

  .cp-card {
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border: 1.5px solid #F0F4F8;
    box-shadow: 0 1px 4px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.04);
    transform: translateY(0) scale(1);
    transition: transform 0.38s cubic-bezier(.34,1.56,.64,1),
                box-shadow 0.38s ease,
                border-color 0.2s ease;
    position: relative;
    height: 100%;
  }
  .cp-card:hover {
    transform: translateY(-7px) scale(1.018);
  }

  .dark .cp-card {
    background: #1E2533;
    border-color: #2A3347;
    box-shadow: 0 2px 8px rgba(0,0,0,.25), 0 8px 32px rgba(0,0,0,.2);
  }

  .cp-img-wrap {
    position: relative;
    aspect-ratio: 1/1;
    background: #F8FAFC;
    overflow: hidden;
    transition: background .3s;
  }
  .dark .cp-img-wrap { background: #151C28; }

  .cp-card:hover .cp-img-wrap { background: #F1F7FF; }
  .dark .cp-card:hover .cp-img-wrap { background: #1A2235; }

  .cp-img {
    width: 100%; height: 100%;
    object-fit: contain; padding: 12px;
    transform: scale(1);
    transition: transform 0.5s cubic-bezier(.34,1.56,.64,1);
  }
  .cp-card:hover .cp-img { transform: scale(1.1); }

  .cp-actions {
    position: absolute; top: 10px; right: 10px;
    display: flex; flex-direction: column; gap: 6px;
    opacity: 0; transform: translateX(6px);
    transition: all .3s ease;
  }
  .cp-card:hover .cp-actions { opacity: 1; transform: translateX(0); }

  .cp-action-btn {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0,0,0,.06);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,.12);
    transition: transform .2s, background .2s;
  }
  .cp-action-btn:hover { transform: scale(1.12); }
  .dark .cp-action-btn { background: rgba(30,37,51,.9); border-color: rgba(255,255,255,.1); }

  .cp-nav-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 10; width: 42px; height: 42px; border-radius: 50%;
    background: #fff; border: 1.5px solid transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,.1), 0 2px 8px rgba(0,0,0,.06);
    transition: all .25s cubic-bezier(.34,1.56,.64,1);
  }
  .cp-nav-btn:hover { transform: translateY(-50%) scale(1.1); }
  .dark .cp-nav-btn { background: #1E2533; }

  .cp-dot {
    height: 7px; border-radius: 4px; border: none; cursor: pointer; padding: 0;
    transition: all .4s cubic-bezier(.34,1.56,.64,1);
  }

  .cp-cta-cart {
    flex: 1; padding: 8px 0; border-radius: 10px;
    font-size: 11px; font-weight: 700; letter-spacing: .04em;
    display: flex; align-items: center; justify-content: center; gap: 4px;
    transition: all .2s; cursor: pointer; border: 1.5px solid transparent;
  }
  .cp-cta-buy {
    flex: 1; padding: 8px 0; border-radius: 10px; border: none;
    font-size: 11px; font-weight: 700; letter-spacing: .04em; color: #fff;
    display: flex; align-items: center; justify-content: center; gap: 4px;
    transition: all .2s; cursor: pointer;
  }

  .cp-viewall-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
    background: rgba(255,255,255,.15); border: 1.5px solid rgba(255,255,255,.3);
    color: #fff; cursor: pointer; backdrop-filter: blur(8px);
    transition: background .2s, transform .2s;
    flex-shrink: 0; z-index: 1;
  }
  .cp-viewall-btn:hover { background: rgba(255,255,255,.28); transform: translateY(-1px); }
`;

let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = STYLES;
  document.head.appendChild(tag);
  stylesInjected = true;
};

/* ─── category config ────────────────────────────────────────────── */
const CATS = {
  Fashion: {
    icon: "👗",
    accent: "#F43F5E",
    dark: "#881337",
    badge: "Trending",
    line: "Dress your best self",
  },
  Electronics: {
    icon: "💻",
    accent: "#3B82F6",
    dark: "#1E3A5F",
    badge: "New Arrivals",
    line: "Power your world",
  },
  "TV & Appliances": {
    icon: "📺",
    accent: "#8B5CF6",
    dark: "#2E1065",
    badge: "Best Sellers",
    line: "Upgrade your home",
  },
  "Mobiles & Tablets": {
    icon: "📱",
    accent: "#06B6D4",
    dark: "#0C4A6E",
    badge: "Hot Deals",
    line: "Stay always connected",
  },
  "Home & Furniture": {
    icon: "🏠",
    accent: "#10B981",
    dark: "#064E3B",
    badge: "Featured",
    line: "Craft your sanctuary",
  },
  "Beauty & Personal Care": {
    icon: "💄",
    accent: "#EC4899",
    dark: "#500724",
    badge: "Top Rated",
    line: "Glow from within",
  },
  Grocery: {
    icon: "🛒",
    accent: "#22C55E",
    dark: "#14532D",
    badge: "Fresh Picks",
    line: "Farm fresh everyday",
  },
};
const DFLT = {
  icon: "📦",
  accent: "#64748B",
  dark: "#0F172A",
  badge: "Popular",
  line: "Explore more",
};

/* ─── mini star row ─────────────────────────────────────────────── */
const Stars = ({ r = 0, n = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          style={{
            fill: i <= Math.round(r) ? "#FBBF24" : "none",
            color: i <= Math.round(r) ? "#FBBF24" : "#D1D5DB",
          }}
        />
      ))}
    </div>
    <span style={{ fontSize: 11, color: "#94A3B8" }}>({n})</span>
  </div>
);

/* ─── discount pill ─────────────────────────────────────────────── */
const DiscBadge = ({ p }) => {
  const pct =
    p.price && p.finalPrice
      ? Math.round(((p.price - p.finalPrice) / p.price) * 100)
      : 0;
  if (pct <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "linear-gradient(135deg,#EF4444,#F97316)",
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 20,
        zIndex: 3,
        boxShadow: "0 2px 8px rgba(239,68,68,.4)",
        letterSpacing: ".04em",
      }}
    >
      -{pct}%
    </div>
  );
};

/* ─── product card ──────────────────────────────────────────────── */
const Card = ({
  product: p,
  accent,
  isW,
  isAdding,
  onCard,
  onCart,
  onBuy,
  onWish,
  onShare,
}) => {
  const [imgErr, setImgErr] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <div
      className="cp-card"
      onClick={() => onCard(p)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderColor: hov ? accent + "50" : undefined,
        boxShadow: hov
          ? `0 20px 50px -8px ${accent}28, 0 4px 16px rgba(0,0,0,.07)`
          : undefined,
      }}
    >
      <div className="cp-img-wrap">
        <DiscBadge p={p} />
        {imgErr ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#CBD5E1",
            }}
          >
            <Package size={36} />
          </div>
        ) : (
          <img
            className="cp-img"
            src={p.images?.[0]}
            alt={p.name}
            onError={() => setImgErr(true)}
          />
        )}

        {/* action buttons */}
        <div className="cp-actions">
          <button className="cp-action-btn" onClick={(e) => onWish(e, p._id)}>
            <Heart
              size={13}
              fill={isW ? "#EF4444" : "none"}
              color={isW ? "#EF4444" : "#64748B"}
            />
          </button>
          <button className="cp-action-btn" onClick={(e) => onShare(e, p)}>
            <Share2 size={13} color="#64748B" />
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "12px 14px 14px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 34,
            color: "var(--cp-text, #374151)",
          }}
        >
          {p.name}
        </p>

        <Stars r={p.averageRating || 0} n={p.totalRatings || 0} />

        <div style={{ margin: "8px 0 10px" }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--cp-heading, #0F172A)",
            }}
          >
            ₹{(p.finalPrice || p.price || 0).toLocaleString()}
          </span>
          {p.price && p.finalPrice && p.price !== p.finalPrice && (
            <span
              style={{
                fontSize: 11,
                color: "#94A3B8",
                textDecoration: "line-through",
                marginLeft: 5,
              }}
            >
              ₹{p.price.toLocaleString()}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
          <button
            className="cp-cta-cart"
            onClick={(e) => onCart(e, p)}
            disabled={isAdding || p.stock <= 0}
            style={{
              borderColor: p.stock <= 0 ? "#E2E8F0" : accent + "33",
              background:
                hov && p.stock > 0
                  ? accent + "0D"
                  : typeof document !== "undefined" &&
                      document.documentElement.classList.contains("dark")
                    ? "#2A3347"
                    : "#F8FAFC",
              color: p.stock <= 0 ? "#94A3B8" : accent,
              cursor: p.stock <= 0 ? "not-allowed" : "pointer",
            }}
          >
            <ShoppingBag size={12} />
            {isAdding
              ? "Adding…"
              : p.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
          </button>
          <button
            className="cp-cta-buy"
            onClick={(e) => onBuy(e, p)}
            disabled={p.stock <= 0}
            style={{
              background:
                p.stock <= 0
                  ? "#E2E8F0"
                  : `linear-gradient(135deg, ${accent}, ${accent}CC)`,
              color: p.stock <= 0 ? "#94A3B8" : "#fff",
              cursor: p.stock <= 0 ? "not-allowed" : "pointer",
              boxShadow: p.stock > 0 ? `0 4px 12px ${accent}44` : "none",
            }}
          >
            <Zap size={12} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── main component ─────────────────────────────────────────────── */
const CategoryProducts = ({
  categoryName,
  dbProducts = [],
  totalCount = 0,
}) => {
  injectStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishIds = useSelector((s) => s.wishlist.wishlistItems);

  const [idx, setIdx] = useState(0);
  const [ipv, setIpv] = useState(5);
  const [adding, setAdding] = useState({});
  const [busy, setBusy] = useState(false);

  const cat = categoryName || "Fashion";
  const s = CATS[cat] || DFLT;
  const { accent, dark: darkHex, icon, badge, line } = s;

  useEffect(() => {
    const upd = () => {
      const w = window.innerWidth;
      if (w < 480) setIpv(1.5);
      else if (w < 640) setIpv(2.3);
      else if (w < 900) setIpv(3);
      else if (w < 1200) setIpv(4);
      else setIpv(5);
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  const products = dbProducts;
  const maxIdx = Math.max(0, products.length - Math.floor(ipv));
  const canSlide = products.length > Math.floor(ipv);
  const GAP = 14;

  const slide = (dir) => {
    if (busy) return;
    setBusy(true);
    setIdx((p) => Math.min(Math.max(p + dir, 0), maxIdx));
    setTimeout(() => setBusy(false), 420);
  };

  /* handlers */
  const onCard = (p) => navigate(`/product/${p._id}`);
  const onCart = async (e, p) => {
    e.stopPropagation();
    if (p.stock <= 0) return toast.error("Out of stock");
    try {
      setAdding((a) => ({ ...a, [p._id]: true }));
      const r = await addProductToCart({ productId: p._id, quantity: 1 });
      if (r?.success) {
        toast.success("Added to cart!");
        dispatch(setCartQuantity(r.cart.totalQuantity));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setAdding((a) => ({ ...a, [p._id]: false }));
    }
  };
  const onBuy = (e, p) => {
    e.stopPropagation();
    if (p.stock <= 0) return toast.error("Out of stock");
    navigate("/checkout", {
      state: { buyNowProduct: [{ product: p, quantity: 1 }] },
    });
  };
  const onWish = async (e, id) => {
    e.stopPropagation();
    const isW = wishIds.includes(id);
    try {
      if (isW) {
        const r = await removeASingleWishlistProduct(id);
        if (r?.success) {
          dispatch(removeFromWishlistRedux(id));
          toast.info("Removed from wishlist");
        }
      } else {
        const r = await addProductToWishList(id);
        if (r?.success || r?.message === "Added to wishlist") {
          dispatch(addToWishlistRedux(id));
          toast.success("Added to wishlist ❤️");
        }
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };
  const onShare = async (e, p) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${p._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: p.name, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };
  const onViewAll = () =>
    navigate(`/category/${toCategorySlug(cat)}`, {
      state: { categoryName: cat },
    });

  const translatePct = (idx * 100) / ipv;

  return (
    <div
      className="cp-root"
      style={{
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,.06)",
        background: "var(--cp-card-bg, #fff)",
        border: "1.5px solid var(--cp-border, #F0F4F8)",
      }}
    >
      {/* ── header band ─────────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${darkHex} 0%, ${accent} 100%)`,
          padding: "clamp(16px, 3vw, 22px) clamp(16px, 3vw, 28px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative circles */}
        {[
          { r: -20, t: -20, sz: 130 },
          { r: 55, b: -55, sz: 190, op: 0.04 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: c.r,
              top: c.t,
              bottom: c.b,
              width: c.sz,
              height: c.sz,
              borderRadius: "50%",
              background: `rgba(255,255,255,${c.op || 0.06})`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 1,
            minWidth: 0,
          }}
        >
          {/* icon tile */}
          <div
            style={{
              width: "clamp(44px,8vw,54px)",
              height: "clamp(44px,8vw,54px)",
              borderRadius: 14,
              flexShrink: 0,
              background: "rgba(255,255,255,.18)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(20px,4vw,24px)",
            }}
          >
            {icon}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "'Sora',sans-serif",
                  fontSize: "clamp(15px,3vw,20px)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                {cat}
              </h2>
              <span
                style={{
                  background: "rgba(255,255,255,.2)",
                  border: "1px solid rgba(255,255,255,.35)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 20,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {badge}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(11px,2vw,13px)",
                color: "rgba(255,255,255,.72)",
                marginTop: 2,
              }}
            >
              {line} ·{" "}
              <strong
                style={{ color: "rgba(255,255,255,.92)", fontWeight: 700 }}
              >
                {totalCount}
              </strong>{" "}
              products
            </p>
          </div>
        </div>

        <button className="cp-viewall-btn" onClick={onViewAll}>
          View All <ArrowUpRight size={14} />
        </button>
      </div>

      {/* ── carousel ─────────────────────────────────────────────── */}
      <div
        style={{
          padding:
            "clamp(14px,3vw,22px) clamp(14px,3vw,28px) clamp(16px,3vw,24px)",
          position: "relative",
        }}
      >
        {/* prev */}
        {canSlide && idx > 0 && (
          <button
            className="cp-nav-btn"
            onClick={() => slide(-1)}
            style={{
              left: -4,
              borderColor: accent + "33",
              boxShadow: `0 4px 20px ${accent}22, 0 2px 8px rgba(0,0,0,.08)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accent;
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.querySelector("svg").style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.borderColor = accent + "33";
              e.currentTarget.querySelector("svg").style.color = "";
            }}
          >
            <ChevronLeft
              size={20}
              color="#374151"
              style={{ transition: "color .2s" }}
            />
          </button>
        )}

        {/* track */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              gap: GAP,
              transform: `translateX(-${translatePct}%)`,
              transition: "transform .45s cubic-bezier(.25,.46,.45,.94)",
            }}
          >
            {products.map((p) => (
              <div
                key={p._id}
                style={{
                  width: `calc(${100 / ipv}% - ${(GAP * (ipv - 1)) / ipv}px)`,
                  flexShrink: 0,
                }}
              >
                <Card
                  product={p}
                  accent={accent}
                  isW={wishIds.includes(p._id)}
                  isAdding={!!adding[p._id]}
                  onCard={onCard}
                  onCart={onCart}
                  onBuy={onBuy}
                  onWish={onWish}
                  onShare={onShare}
                />
              </div>
            ))}
          </div>
        </div>

        {/* next */}
        {canSlide && idx < maxIdx && (
          <button
            className="cp-nav-btn"
            onClick={() => slide(1)}
            style={{
              right: -4,
              borderColor: accent + "33",
              boxShadow: `0 4px 20px ${accent}22, 0 2px 8px rgba(0,0,0,.08)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accent;
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.querySelector("svg").style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              e.currentTarget.style.borderColor = accent + "33";
              e.currentTarget.querySelector("svg").style.color = "";
            }}
          >
            <ChevronRight
              size={20}
              color="#374151"
              style={{ transition: "color .2s" }}
            />
          </button>
        )}

        {/* dots */}
        {canSlide && maxIdx > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
              marginTop: 18,
            }}
          >
            {Array.from({ length: maxIdx + 1 }, (_, i) => (
              <button
                key={i}
                className="cp-dot"
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 22 : 7,
                  background: i === idx ? accent : "#E2E8F0",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
