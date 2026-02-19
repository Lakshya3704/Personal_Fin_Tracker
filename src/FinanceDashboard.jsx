import { useState, useEffect } from "react";

const initialTransactions = [
  { id: 1, date: "2025-07-25", time: "12:30", title: "YouTube", amount: -10, method: "VISA **3254", category: "Subscription", icon: "▶", color: "#FF0000" },
  { id: 2, date: "2025-07-26", time: "15:00", title: "Reserved", amount: -150, method: "Mastercard **2154", category: "Shopping", icon: "🏪", color: "#6366f1" },
  { id: 3, date: "2025-07-27", time: "09:00", title: "Yaposhka", amount: -80, method: "Mastercard **2154", category: "Cafe & Restaurants", icon: "🍜", color: "#f59e0b" },
  { id: 4, date: "2025-07-24", time: "11:00", title: "Freelance Project", amount: 2500, method: "Bank Transfer", category: "Income", icon: "💼", color: "#10b981" },
  { id: 5, date: "2025-07-23", time: "09:30", title: "Netflix", amount: -15, method: "VISA **3254", category: "Subscription", icon: "🎬", color: "#dc2626" },
  { id: 6, date: "2025-07-22", time: "14:00", title: "Grocery Store", amount: -95, method: "Mastercard **2154", category: "Food & Groceries", icon: "🛒", color: "#059669" },
  { id: 7, date: "2025-07-21", time: "08:00", title: "Salary", amount: 6000, method: "Bank Transfer", category: "Income", icon: "💰", color: "#10b981" },
  { id: 8, date: "2025-07-20", time: "19:00", title: "Gym Membership", amount: -45, method: "VISA **3254", category: "Health & Beauty", icon: "🏋️", color: "#8b5cf6" },
];

const budgetData = [
  { name: "Cafe & Restaurants", amount: 400, total: 600, color: "#6366f1" },
  { name: "Entertainment", amount: 150, total: 200, color: "#818cf8" },
  { name: "Investments", amount: 2000, total: 3000, color: "#a5b4fc" },
  { name: "Food & Groceries", amount: 950, total: 1200, color: "#c7d2fe" },
  { name: "Health & Beauty", amount: 250, total: 400, color: "#e0e7ff" },
  { name: "Traveling", amount: 0, total: 500, color: "#ddd6fe" },
];

const savingGoals = [
  { name: "MacBook Pro", current: 1650, goal: 6600, color: "#6366f1" },
  { name: "New car", current: 25200, goal: 60000, color: "#6366f1" },
  { name: "New house", current: 4500, goal: 150000, color: "#6366f1" },
];

const monthlyData = [
  { month: "Jan", income: 7000, expense: 4500 },
  { month: "Feb", income: 8000, expense: 5200 },
  { month: "Mar", income: 10000, expense: 6800 },
  { month: "Apr", income: 7500, expense: 4900 },
  { month: "May", income: 9000, expense: 5800 },
  { month: "Jun", income: 8200, expense: 5100 },
  { month: "Jul", income: 8500, expense: 6222 },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "transactions", label: "Transactions", icon: "↕" },
  { id: "wallet", label: "Wallet", icon: "◎" },
  { id: "goals", label: "Goals", icon: "◈" },
  { id: "budget", label: "Budget", icon: "⊟" },
  { id: "analytics", label: "Analytics", icon: "≋" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

const CATEGORIES = ["Income", "Food & Groceries", "Cafe & Restaurants", "Shopping", "Subscription", "Health & Beauty", "Entertainment", "Traveling", "Investments"];

function formatCurrency(amount) {
  const abs = Math.abs(amount);
  const intPart = Math.floor(abs).toLocaleString();
  return { int: intPart, dec: "00", negative: amount < 0 };
}

function DonutChart({ data, total }) {
  const radius = 60, cx = 80, cy = 80, strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = d.amount / total;
    const dash = pct * circumference;
    const seg = { ...d, dash, offset, pct };
    offset += dash;
    return seg;
  });

  return (
    <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
      {segments.map((seg, i) => (
        <circle key={i} cx={cx} cy={cy} r={radius}
          fill="none" stroke={seg.color} strokeWidth={strokeWidth}
          strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
          strokeDashoffset={-seg.offset}
          style={{ transition: "all 0.5s ease" }}
        />
      ))}
    </svg>
  );
}

function BarChart({ data }) {
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]));
  const chartH = 120;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: `${chartH + 20}px`, padding: "0 10px" }}>
      {data.map((d, i) => {
        const incH = (d.income / maxVal) * chartH;
        const expH = (d.expense / maxVal) * chartH;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
            <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: `${chartH}px` }}>
              <div style={{
                width: "14px", height: `${incH}px`, borderRadius: "4px 4px 0 0",
                background: "linear-gradient(180deg, #6366f1, #818cf8)",
                transition: "height 0.6s ease"
              }} />
              <div style={{
                width: "14px", height: `${expH}px`, borderRadius: "4px 4px 0 0",
                background: "linear-gradient(180deg, #c7d2fe, #e0e7ff)",
                transition: "height 0.6s ease"
              }} />
            </div>
            <span style={{ fontSize: "10px", color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function Modal({ onClose, onSave, editData }) {
  const [form, setForm] = useState(editData || { title: "", amount: "", category: "Shopping", method: "VISA **3254", date: new Date().toISOString().split("T")[0], time: "12:00", type: "expense" });

  const handleSubmit = () => {
    if (!form.title || !form.amount) return;
    const amt = parseFloat(form.amount) * (form.type === "expense" ? -1 : 1);
    onSave({ ...form, amount: amt, icon: form.type === "income" ? "💰" : "💳", color: form.type === "income" ? "#10b981" : "#6366f1" });
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1px solid #e2e8f0", background: "#f8fafc",
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#1e293b",
    outline: "none", boxSizing: "border-box"
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", width: "420px", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#1e293b" }}>
            {editData ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["expense", "income"].map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: form.type === t ? "#6366f1" : "#f1f5f9",
              color: form.type === t ? "#fff" : "#64748b",
              fontFamily: "'DM Sans', sans-serif", fontWeight: "600", textTransform: "capitalize"
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input style={inputStyle} placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <input style={inputStyle} placeholder="Amount" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input style={inputStyle} placeholder="Payment method" value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))} />
          <div style={{ display: "flex", gap: "10px" }}>
            <input style={{ ...inputStyle, flex: 1 }} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <input style={{ ...inputStyle, flex: 1 }} type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
        </div>

        <button onClick={handleSubmit} style={{
          marginTop: "24px", width: "100%", padding: "14px", borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff",
          border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontWeight: "700", fontSize: "15px", letterSpacing: "0.5px",
          boxShadow: "0 4px 15px rgba(99,102,241,0.4)"
        }}>
          {editData ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}

export default function FinanceDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const balance = income - expense;
  const savings = 32913;

  const filtered = transactions.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || t.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = (data) => {
    if (editData) {
      setTransactions(ts => ts.map(t => t.id === editData.id ? { ...data, id: t.id } : t));
    } else {
      setTransactions(ts => [{ ...data, id: Date.now() }, ...ts]);
    }
    setShowModal(false);
    setEditData(null);
  };

  const handleDelete = (id) => setTransactions(ts => ts.filter(t => t.id !== id));
  const handleEdit = (t) => { setEditData(t); setShowModal(true); };

  const bg = darkMode ? "#0f172a" : "#f0f2ff";
  const cardBg = darkMode ? "#1e293b" : "#ffffff";
  const text = darkMode ? "#f1f5f9" : "#1e293b";
  const subText = darkMode ? "#94a3b8" : "#64748b";
  const borderColor = darkMode ? "#334155" : "#e2e8f0";
  const sidebarBg = darkMode ? "#1e293b" : "#ffffff";

  const summaryCards = [
    { label: "Total balance", value: balance, change: 12.1, up: true },
    { label: "Income", value: income, change: 6.3, up: true },
    { label: "Expense", value: expense, change: 2.4, up: false },
    { label: "Total savings", value: savings, change: 12.1, up: true },
  ];

  const styles = {
    container: {
      display: "flex", minHeight: "100vh", background: bg,
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.3s ease",
      opacity: mounted ? 1 : 0,
    },
    sidebar: {
      width: sidebarCollapsed ? "72px" : "220px",
      background: sidebarBg,
      borderRight: `1px solid ${borderColor}`,
      display: "flex", flexDirection: "column",
      padding: "24px 12px",
      transition: "width 0.3s ease",
      position: "relative",
      flexShrink: 0,
      boxShadow: "4px 0 20px rgba(0,0,0,0.04)",
    },
    main: {
      flex: 1, padding: "28px", overflowY: "auto",
    },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", paddingLeft: "4px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: "700", fontSize: "16px", flexShrink: 0
            }}>F</div>
            {!sidebarCollapsed && <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "20px", color: text }}>FinSet</span>}
          </div>

          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 12px", borderRadius: "12px", border: "none",
              background: activeNav === item.id ? "linear-gradient(135deg, #6366f1, #818cf8)" : "transparent",
              color: activeNav === item.id ? "#fff" : subText,
              cursor: "pointer", marginBottom: "4px", width: "100%",
              transition: "all 0.2s ease",
              fontFamily: "'DM Sans', sans-serif", fontWeight: "500", fontSize: "14px",
              whiteSpace: "nowrap", overflow: "hidden",
            }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}

          <div style={{ marginTop: "auto" }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px", borderRadius: "50%",
              background: darkMode ? "#334155" : "#f1f5f9", border: "none",
              cursor: "pointer", color: subText, fontSize: "16px",
              marginBottom: "16px", marginLeft: "4px"
            }}>{sidebarCollapsed ? "›" : "‹"}</button>

            {[{ icon: "?", label: "Help" }, { icon: "⎋", label: "Log out" }].map((item, i) => (
              <button key={i} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 12px", borderRadius: "12px", border: "none",
                background: "transparent", color: subText, cursor: "pointer",
                width: "100%", fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px", marginBottom: "4px"
              }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}

            <div style={{ display: "flex", gap: "8px", padding: "10px 12px", marginTop: "8px" }}>
              <button onClick={() => setDarkMode(!darkMode)} style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: darkMode ? "#334155" : "#f1f5f9",
                border: "none", cursor: "pointer", fontSize: "16px"
              }}>{darkMode ? "☀" : "🌙"}</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "28px", color: text, fontWeight: "700" }}>
                Welcome back, Adaline!
              </h1>
              <p style={{ margin: "4px 0 0", color: subText, fontSize: "14px" }}>It is the best time to manage your finances</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                padding: "8px 16px", borderRadius: "20px",
                background: cardBg, border: `1px solid ${borderColor}`,
                fontSize: "13px", color: subText, display: "flex", alignItems: "center", gap: "6px"
              }}>
                <span>📅</span> <span>This month</span>
              </div>
              <button onClick={() => { setEditData(null); setShowModal(true); }} style={{
                padding: "10px 20px", borderRadius: "20px",
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "#fff", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: "600", fontSize: "13px",
                boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                <span style={{ fontSize: "18px", fontWeight: "300" }}>+</span> Add new widget
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {summaryCards.map((card, i) => {
              const { int, dec } = formatCurrency(card.value);
              return (
                <div key={i} style={{
                  background: cardBg, borderRadius: "18px", padding: "22px",
                  border: `1px solid ${borderColor}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", color: subText, fontWeight: "500" }}>{card.label}</span>
                    <span style={{ fontSize: "12px", color: subText }}>↗</span>
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: "700", color: text, fontFamily: "'Playfair Display', serif", marginBottom: "10px" }}>
                    ${int}<span style={{ fontSize: "14px", fontWeight: "400", color: subText }}>.{dec}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: "600",
                      color: card.up ? "#10b981" : "#ef4444",
                      background: card.up ? "#d1fae5" : "#fee2e2",
                      padding: "2px 8px", borderRadius: "20px"
                    }}>
                      {card.up ? "↑" : "↓"} {card.change}%
                    </span>
                    <span style={{ fontSize: "11px", color: subText }}>vs last month</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px", marginBottom: "24px" }}>
            {/* Money Flow */}
            <div style={{ background: cardBg, borderRadius: "18px", padding: "24px", border: `1px solid ${borderColor}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: text }}>Money flow</h3>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: subText, display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />Income
                  </span>
                  <span style={{ fontSize: "12px", color: subText, display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c7d2fe", display: "inline-block" }} />Expense
                  </span>
                </div>
              </div>
              <BarChart data={monthlyData} />
            </div>

            {/* Budget */}
            <div style={{ background: cardBg, borderRadius: "18px", padding: "24px", border: `1px solid ${borderColor}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: text }}>Budget</h3>
                <span style={{ fontSize: "12px", color: subText }}>↗</span>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <DonutChart data={budgetData} total={5950} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: "10px", color: subText }}>Total for month</div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: text, fontFamily: "'Playfair Display', serif" }}>$5,950</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {budgetData.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.color, flexShrink: 0, display: "inline-block", border: "1px solid #e2e8f0" }} />
                      <span style={{ fontSize: "11px", color: subText, flex: 1 }}>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px" }}>
            {/* Transactions */}
            <div style={{ background: cardBg, borderRadius: "18px", padding: "24px", border: `1px solid ${borderColor}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: text }}>Recent transactions</h3>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      padding: "7px 14px", borderRadius: "20px",
                      border: `1px solid ${borderColor}`, background: darkMode ? "#334155" : "#f8fafc",
                      color: text, fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none"
                    }}
                  />
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{
                    padding: "7px 12px", borderRadius: "20px", border: `1px solid ${borderColor}`,
                    background: darkMode ? "#334155" : "#f8fafc", color: text,
                    fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer"
                  }}>
                    <option>All</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={() => { setEditData(null); setShowModal(true); }} style={{
                    padding: "7px 16px", borderRadius: "20px",
                    background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "#fff",
                    border: "none", cursor: "pointer", fontSize: "12px",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: "600"
                  }}>+ Add</button>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["DATE", "AMOUNT", "PAYMENT NAME", "METHOD", "CATEGORY", "ACTIONS"].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: "11px", color: "#6366f1", fontWeight: "600", paddingBottom: "12px", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 7).map((t, i) => (
                    <tr key={t.id} style={{ borderTop: `1px solid ${borderColor}` }}>
                      <td style={{ padding: "12px 0", fontSize: "13px", color: subText }}>
                        {t.date.slice(5).replace("-", " ")} {t.time}
                      </td>
                      <td style={{ padding: "12px 8px 12px 0", fontSize: "13px", fontWeight: "600", color: t.amount > 0 ? "#10b981" : text }}>
                        {t.amount > 0 ? "+" : ""}{t.amount < 0 ? "-" : ""}${Math.abs(t.amount)}
                      </td>
                      <td style={{ padding: "12px 8px 12px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "8px",
                            background: t.color + "20", display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: "14px"
                          }}>{t.icon}</div>
                          <span style={{ fontSize: "13px", color: text, fontWeight: "500" }}>{t.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 8px 12px 0", fontSize: "12px", color: subText }}>{t.method}</td>
                      <td style={{ padding: "12px 8px 12px 0" }}>
                        <span style={{
                          fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                          background: "#6366f120", color: "#6366f1", fontWeight: "500"
                        }}>{t.category}</span>
                      </td>
                      <td style={{ padding: "12px 0" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleEdit(t)} style={{
                            padding: "4px 10px", borderRadius: "6px", border: "none",
                            background: "#f1f5f9", color: "#64748b", cursor: "pointer", fontSize: "11px"
                          }}>Edit</button>
                          <button onClick={() => handleDelete(t.id)} style={{
                            padding: "4px 10px", borderRadius: "6px", border: "none",
                            background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontSize: "11px"
                          }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Saving Goals */}
            <div style={{ background: cardBg, borderRadius: "18px", padding: "24px", border: `1px solid ${borderColor}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: text }}>Saving goals</h3>
                <span style={{ fontSize: "12px", color: subText }}>↗</span>
              </div>
              {savingGoals.map((goal, i) => {
                const pct = Math.round((goal.current / goal.goal) * 100);
                return (
                  <div key={i} style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: text }}>{goal.name}</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: subText }}>${goal.current.toLocaleString()}</span>
                    </div>
                    <div style={{ height: "6px", background: darkMode ? "#334155" : "#e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`, borderRadius: "6px",
                        background: "linear-gradient(90deg, #6366f1, #818cf8)",
                        transition: "width 0.8s ease"
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                      <span style={{ fontSize: "11px", color: "#6366f1", fontWeight: "600" }}>{pct}%</span>
                      <span style={{ fontSize: "11px", color: subText }}>of ${goal.goal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}

              {/* Quick stats */}
              <div style={{ marginTop: "16px", padding: "16px", background: darkMode ? "#334155" : "#f8fafc", borderRadius: "12px" }}>
                <div style={{ fontSize: "12px", color: subText, marginBottom: "8px", fontWeight: "500" }}>Monthly overview</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#10b981", fontFamily: "'Playfair Display', serif" }}>${income.toLocaleString()}</div>
                    <div style={{ fontSize: "11px", color: subText }}>Income</div>
                  </div>
                  <div style={{ width: "1px", background: borderColor }} />
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#ef4444", fontFamily: "'Playfair Display', serif" }}>${expense.toLocaleString()}</div>
                    <div style={{ fontSize: "11px", color: subText }}>Expense</div>
                  </div>
                  <div style={{ width: "1px", background: borderColor }} />
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#6366f1", fontFamily: "'Playfair Display', serif" }}>${balance.toLocaleString()}</div>
                    <div style={{ fontSize: "11px", color: subText }}>Balance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button onClick={() => { setEditData(null); setShowModal(true); }} style={{
        position: "fixed", bottom: "28px", right: "28px",
        width: "56px", height: "56px", borderRadius: "50%",
        background: "linear-gradient(135deg, #6366f1, #818cf8)",
        color: "#fff", border: "none", cursor: "pointer",
        fontSize: "28px", fontWeight: "300",
        boxShadow: "0 8px 25px rgba(99,102,241,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.2s ease",
        zIndex: 999
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1) rotate(90deg)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
      >+</button>

      {showModal && <Modal onClose={() => { setShowModal(false); setEditData(null); }} onSave={handleSave} editData={editData} />}
    </>
  );
}