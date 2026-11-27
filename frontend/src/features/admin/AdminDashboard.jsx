import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, Bell, Check, ChevronDown, ChevronRight,
  CircleHelp, ClipboardList, Download, Leaf, MapPin, Menu, MoreHorizontal,
  Recycle, Search, Settings, ShieldCheck, Truck, Users, X,
} from "lucide-react";
import "./admin.css";

const initialReports = [
  { id: "WWN-24018", subject: "Missed collection", area: "Concepcion Pequeña", time: "8 min ago", status: "Open", tone: "amber" },
  { id: "WWN-24017", subject: "Overflowing public bin", area: "Central Business District", time: "24 min ago", status: "Assigned", tone: "blue" },
  { id: "WWN-24016", subject: "Illegal dumping", area: "Barangay Triangulo", time: "41 min ago", status: "In review", tone: "green" },
  { id: "WWN-24015", subject: "Collection schedule query", area: "Magsaysay Avenue", time: "1 hr ago", status: "Resolved", tone: "muted" },
];

const trucks = [
  { id: "NCG-214", driver: "Joel B. Ramos", route: "Zone 3 · Magsaysay", progress: 72, state: "Collecting", tone: "green" },
  { id: "NCG-308", driver: "Maria L. Santos", route: "Zone 1 · Almeda", progress: 48, state: "En route", tone: "blue" },
  { id: "NCG-117", driver: "Ruben A. Cruz", route: "Zone 5 · Panganiban", progress: 0, state: "Available", tone: "muted" },
];

const navLinks = [
  ["Overview", Activity], ["Collection routes", Truck], ["Residents", Users],
  ["Reports", ClipboardList], ["Analytics", Recycle],
];

function Sidebar({ active, setActive, open, setOpen }) {
  return <>
    {open && <button className="admin-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <div className="admin-brand"><span className="admin-brand-icon"><Recycle size={21} /></span><span>Waste Wise <b>Naga</b><small>ADMIN CONSOLE</small></span><button className="admin-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
      <div className="admin-nav-label">WORKSPACE</div>
      <nav className="admin-nav">{navLinks.map(([label, Icon]) => <button key={label} className={`admin-nav-link ${active === label ? "active" : ""}`} onClick={() => { setActive(label); setOpen(false); }}><Icon size={17} /><span>{label}</span>{label === "Reports" && <i>4</i>}</button>)}</nav>
      <div className="admin-side-bottom"><div className="admin-help"><span><CircleHelp size={17} /></span><strong>Need a hand?</strong><small>Visit the admin help center</small><button onClick={() => setActive("Help center")}>Get support <ArrowRight size={13} /></button></div><button className="admin-nav-link" onClick={() => setActive("Settings")}><Settings size={17} /><span>Settings</span></button><div className="admin-profile"><span className="admin-avatar">AM</span><span><strong>Alf M.</strong><small>City administrator</small></span><MoreHorizontal size={18} /></div></div>
    </aside>
  </>;
}

function MetricCard({ Icon, label, value, note, delta, tone }) {
  return <article className="admin-metric"><div className="admin-metric-top"><span className={`admin-metric-icon ${tone}`}><Icon size={18} /></span><span className="admin-delta"><ArrowDownRight size={13} />{delta}</span></div><p>{label}</p><strong>{value}</strong><small>{note}</small></article>;
}

function CollectionChart() {
  const bars = [44, 58, 49, 69, 57, 83, 64, 74, 53, 91, 71, 78];
  return <div className="admin-chart" role="img" aria-label="Weekly collected waste volume trending upward from Monday to Sunday">
    <div className="admin-chart-y"><span>1,200 kg</span><span>800 kg</span><span>400 kg</span><span>0 kg</span></div>
    <div className="admin-chart-plot"><div className="admin-chart-grid"><i /><i /><i /><i /></div><div className="admin-bars">{bars.map((height, i) => <span key={i} className={i === 9 ? "highlight" : ""} style={{ "--bar-height": `${height}%` }}><i /></span>)}</div></div>
    <div className="admin-chart-x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
  </div>;
}

export default function AdminDashboard() {
  const [active, setActive] = useState("Overview");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [reports, setReports] = useState(initialReports);
  const filteredReports = useMemo(() => reports.filter((report) => `${report.id} ${report.subject} ${report.area}`.toLowerCase().includes(query.toLowerCase())), [reports, query]);

  const advanceReport = (id) => setReports((current) => current.map((report) => report.id === id ? { ...report, status: report.status === "Open" ? "Assigned" : report.status === "Assigned" ? "In review" : "Resolved", tone: report.status === "Open" ? "blue" : report.status === "Assigned" ? "green" : "muted" } : report));

  return <div className="admin-app">
    <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />
    <main className="admin-main">
      <header className="admin-topbar"><button className="admin-menu-toggle" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={20} /></button><div className="admin-breadcrumb">Waste Wise Naga <ChevronRight size={14} /> <strong>{active}</strong></div><div className="admin-top-actions"><span className="admin-live"><i /> All systems operational</span><button aria-label="Notifications" className="admin-icon-button"><Bell size={17} /><i /></button><span className="admin-top-avatar">AM</span></div></header>
      <div className="admin-content">
        <div className="admin-welcome"><div><p className="admin-eyebrow">FRIDAY, NOVEMBER 27, 2026 <span>·</span> NAGA CITY, PHILIPPINES</p><h1>{active === "Overview" ? "Good morning, Alf" : active}</h1><p>Here’s what’s happening across the city today.</p></div><div className="admin-welcome-actions"><button className="admin-button secondary" onClick={() => window.location.assign("/")}><ArrowRight size={15} /> Resident app</button><button className="admin-button primary" onClick={() => setActive("Collection routes")}><Truck size={16} /> Manage collection</button></div></div>
        {active !== "Overview" && <div className="admin-view-note"><ShieldCheck size={18} /><span><strong>{active} workspace</strong><small>This dashboard preview includes live city operations overview and sample records.</small></span></div>}
        <section className="admin-collection-banner"><div><span><Check size={12} /> COLLECTIONS ON SCHEDULE</span><strong>Citywide collection</strong><small>18 trucks active · 12 barangays covered</small></div><div className="admin-banner-total"><strong>8,426 <small>kg</small></strong><span>collected today</span></div></section>
        <section className="admin-metrics"><MetricCard Icon={Recycle} label="Waste collected today" value="8,426 kg" note="Across 12 barangays" delta="12.8%" tone="mint" /><MetricCard Icon={Truck} label="Active collection trucks" value="18 / 22" note="4 vehicles on standby" delta="2 routes" tone="blue" /><MetricCard Icon={ClipboardList} label="Open service reports" value="24" note="7 need attention" delta="3 new" tone="amber" /><MetricCard Icon={Users} label="Residents served" value="12,840" note="This month" delta="8.4%" tone="violet" /></section>
        <section className="admin-middle-grid">
          <article className="admin-panel admin-collection"><div className="admin-panel-heading"><div><h2>Collection overview</h2><p>Waste volume collected across the city</p></div><button className="admin-select">This week <ChevronDown size={14} /></button></div><div className="admin-chart-summary"><strong>42,680 <small>kg</small></strong><span className="admin-positive">↑ 8.2% <i>vs last week</i></span><span className="admin-chart-legend"><i /> Collected waste</span></div><CollectionChart /></article>
          <article className="admin-panel admin-status-panel"><div className="admin-panel-heading"><div><h2>City collection status</h2><p>Collection progress by zone</p></div><button className="admin-more" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="admin-status-hero"><span className="admin-status-check"><Check size={19} /></span><span><strong>On schedule</strong><small>All zones are operating normally</small></span><b>86%</b></div><div className="admin-zone-list">{[["Zone 1", "Naga Centro", 92], ["Zone 2", "Concepcion", 78], ["Zone 3", "Magsaysay", 86], ["Zone 4", "Triangulo", 64]].map(([zone, name, value]) => <div className="admin-zone" key={zone}><span><strong>{zone}</strong><small>{name}</small></span><div className="admin-progress"><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>)}</div><button className="admin-panel-link" onClick={() => setActive("Collection routes")}>View all zones <ArrowRight size={14} /></button></article>
        </section>
        <section className="admin-bottom-grid">
          <article className="admin-panel admin-fleet"><div className="admin-panel-heading"><div><h2>Live fleet</h2><p>Truck status and route progress</p></div><button className="admin-panel-link" onClick={() => setActive("Collection routes")}>View fleet <ArrowRight size={14} /></button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>VEHICLE</th><th>ASSIGNED ROUTE</th><th>PROGRESS</th><th>STATUS</th></tr></thead><tbody>{trucks.map((truck) => <tr key={truck.id}><td><span className="admin-truck"><i><Truck size={15} /></i><span><strong>{truck.id}</strong><small>{truck.driver}</small></span></span></td><td>{truck.route}</td><td><span className="admin-table-progress"><i><b style={{ width: `${truck.progress}%` }} /></i>{truck.progress ? `${truck.progress}%` : "—"}</span></td><td><span className={`admin-pill ${truck.tone}`}><i />{truck.state}</span></td></tr>)}</tbody></table></div></article>
          <article className="admin-panel admin-reports"><div className="admin-panel-heading"><div><h2>Recent service reports</h2><p>Resident submitted requests</p></div><button className="admin-panel-link" onClick={() => setActive("Reports")}>All reports <ArrowRight size={14} /></button></div><label className="admin-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports" /></label><div className="admin-report-list">{filteredReports.map((report) => <div className="admin-report" key={report.id}><span className="admin-report-pin"><MapPin size={15} /></span><span className="admin-report-copy"><strong>{report.subject}</strong><small>{report.area} · {report.time}</small><small>{report.id}</small></span><button className={`admin-pill ${report.tone} admin-report-status`} onClick={() => advanceReport(report.id)} aria-label={`Advance status for ${report.id}`}>{report.status}<ChevronDown size={12} /></button></div>)}{filteredReports.length === 0 && <p className="admin-empty">No reports match that search.</p>}</div></article>
        </section>
        <footer className="admin-footer"><span>Waste Wise Naga <i>·</i> City Operations Dashboard</span><span>Last updated just now <i>·</i> <button><Download size={13} /> Export report</button></span></footer>
      </div>
      <nav className="admin-mobile-nav" aria-label="Admin navigation">{[["Overview", Activity], ["Collection routes", Truck], ["Reports", ClipboardList], ["Residents", Users]].map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => setActive(label)}><Icon size={18} /><span>{label === "Collection routes" ? "Routes" : label}</span></button>)}</nav>
    </main>
  </div>;
}
