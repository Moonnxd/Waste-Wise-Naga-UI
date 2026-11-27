import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Bell, CalendarDays, Camera, Check, CheckCircle2,
  ChevronRight, Circle, Clock3, Crosshair, Home, Leaf, Lightbulb, ListChecks,
  LocateFixed, Map as MapIcon, MapPin, MessageCircle, MoreHorizontal, Navigation,
  PackageCheck, Recycle, RefreshCw, ScanLine, Search, Send, Share2, ShieldCheck,
  Sparkles, Truck, Trash2, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { submitCollectionRequest } from "./lib/api";

const truckRows = [
  { id: "NCG-214", street: "Magsaysay Ave", distance: "0.8 km", eta: "6 min", state: "Collecting now", space: "2.9 m³", best: true },
  { id: "NCG-308", street: "Almeda Hwy", distance: "1.6 km", eta: "12 min", state: "En route", space: "4.1 m³", best: false },
  { id: "NCG-117", street: "Panganiban Dr", distance: "2.1 km", eta: "18 min", state: "Available", space: "5.4 m³", best: false },
];


const navItems = [
  { id: "home", label: "Home", Icon: Home },
  { id: "map", label: "Map", Icon: MapIcon },
  { id: "scan", label: "Scan", Icon: Camera },
  { id: "trucks", label: "Trucks", Icon: Truck },
  { id: "activity", label: "Activity", Icon: ListChecks },
];

function StatusBar() {
  return <div className="status-bar" aria-hidden="true"><span>9:41</span><span className="status-icons"><span className="status-signal">▮▮▮</span><span>◔</span><span className="battery" /></span></div>;
}

function BrandMark() {
  return <div className="brand-mark" aria-label="Waste Wise Naga logo"><span>W</span><span>W</span><Recycle size={27} strokeWidth={2.3} /></div>;
}

function AppHeader({ title, subtitle, onBack, onAction, actionIcon: ActionIcon = MoreHorizontal }) {
  return <div className="screen-header">
    {onBack ? <button className="round-control" aria-label="Go back" onClick={onBack}><ArrowLeft size={19} /></button> : null}
    <div className="screen-heading"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    {onAction ? <button className="round-control" aria-label="Open options" onClick={onAction}><ActionIcon size={19} /></button> : null}
  </div>;
}

function ScreenTitle({ eyebrow, title, children }) {
  return <div className="section-title"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{children}</div>;
}

function StatusPill({ children, tone = "green" }) {
  return <Badge variant={tone === "blue" ? "secondary" : tone === "amber" ? "warning" : "default"}><i className={`dot dot-${tone}`} />{children}</Badge>;
}

function TruckRow({ truck = truckRows[0], onClick, compact = false }) {
  return <button onClick={onClick} className={`truck-row ${compact ? "compact" : ""}`}>
    <span className="truck-icon"><Truck size={19} /></span>
    <span className="truck-copy"><strong>Truck {truck.id}</strong><small>{truck.street} • {truck.distance}</small></span>
    <span className="truck-meta"><strong>{truck.eta}</strong>{!compact && <small>away</small>}</span>
    {!compact && <ChevronRight size={16} className="row-chevron" />}
  </button>;
}

function ProgressTrack({ compact = false }) {
  return <div className={`progress-card ${compact ? "small" : ""}`}>
    <div className="section-title"><h3>Dispatch progress</h3><StatusPill tone="blue">Live</StatusPill></div>
    <div className="timeline">
      <div className="timeline-item done"><span className="timeline-icon"><Check size={14} /></span><span><strong>Request received</strong><small>7:52 AM • Waste details verified</small></span></div>
      <div className="timeline-item current"><span className="timeline-icon"><Truck size={14} /></span><span><strong>Truck NCG-214 dispatched</strong><small>7:56 AM • 0.8 km away</small></span></div>
      <div className="timeline-item"><span className="timeline-icon"><Circle size={10} /></span><span><strong>Pickup and confirmation</strong><small>Estimated 8:02–8:07 AM</small></span></div>
    </div>
  </div>;
}

function BottomNavigation({ active, onNavigate }) {
  return <nav className="bottom-nav" aria-label="Main navigation">
    {navItems.map(({ id, label, Icon }) => id === "scan" ? <button key={id} onClick={() => onNavigate(id)} className="nav-item scan-nav" aria-label="Scan waste"><span><Icon size={20} /></span></button> :
      <button key={id} onClick={() => onNavigate(id)} className={`nav-item ${active === id ? "active" : ""}`} aria-current={active === id ? "page" : undefined}><Icon size={18} strokeWidth={1.6} /><span>{label}</span></button>)}
  </nav>;
}

function DesktopNavigation({ active, onNavigate }) {
  return <nav className="desktop-nav" aria-label="Main navigation">
    <div className="desktop-brand"><span className="brand-leaf"><Leaf size={18} /></span><span>Waste Wise <b>Naga</b></span></div>
    <div className="desktop-links">{navItems.map(({ id, label, Icon }) => <button key={id} onClick={() => onNavigate(id)} className={`desktop-link ${active === id ? "active" : ""}`}><Icon size={17} />{label}</button>)}</div>
    <span className="desktop-location"><MapPin size={15} /> Concepcion Pequeña, Naga City</span>
  </nav>;
}

function Onboarding({ onContinue }) {
  const requestLocation = () => {
    if (!navigator.geolocation) { onContinue(); return; }
    navigator.geolocation.getCurrentPosition(() => onContinue(), () => onContinue(), { timeout: 5000 });
    window.setTimeout(onContinue, 1800);
  };
  return <main className="welcome-screen">
    <StatusBar />
    <section className="welcome-brand"><BrandMark /><h1>WASTE WISE <span>NAGA</span></h1><p>Empowering a Cleaner Future</p></section>
    <section className="welcome-copy"><p className="eyebrow">SMART WASTE. CLEANER CITY.</p><h2>Never miss the waste<br className="mobile-only" /> truck again</h2><p>Waste Wise Naga connects every household to live collection routes across Naga City.</p></section>
    <Card className="location-card"><div className="location-intro"><span className="location-icon"><MapPin size={19} /></span><span><strong>Enable your location</strong><small>See nearby trucks and barangay schedules.</small></span></div><Button onClick={requestLocation} className="w-full"><Navigation size={17} />Use my current location</Button><small className="location-note">Location is used only while you use the app.</small></Card>
    <p className="civic-note">An eco-civic service for every Nagueño</p>
  </main>;
}

function HomeScreen({ onNavigate, onOpenNotifications, pickupActive }) {
  const [alerts, setAlerts] = useState(true);
  return <div className="screen-content home-screen">
    <div className="greeting"><span className="greeting-leaf"><Leaf size={19} /></span><span><strong>Good Morning, Alf</strong><small>Concepcion Pequeña, Naga City</small></span><button className="round-control" aria-label="Notifications" onClick={onOpenNotifications}><Bell size={18} /></button></div>
    <Card className="schedule-card"><div className="schedule-top"><Badge className="schedule-status"><CheckCircle2 size={12} />On schedule</Badge><span>Wed, Sep 30</span></div><div className="schedule-main"><div className="date-tile"><span>OCT</span><strong>01</strong></div><div><small>Next collection</small><strong className="pickup-time">6:30–8:00 AM</strong><small>Biodegradable • Zone 3 route</small></div></div></Card>
    <section className="quick-section"><h2>Quick actions</h2><div className="quick-grid">
      <button onClick={() => onNavigate("map")} className="quick-action"><span className="quick-icon cyan"><MapIcon size={18} /></span><strong>Track<br />trucks</strong></button>
      <button onClick={() => onNavigate("scan")} className="quick-action"><span className="quick-icon green"><Camera size={17} /></span><strong>Scan<br />waste</strong></button>
      <button onClick={() => onNavigate("analysis")} className="quick-action"><span className="quick-icon amber"><Trash2 size={17} /></span><strong>Check bins</strong></button>
      <button onClick={() => onNavigate("schedule")} className="quick-action"><span className="quick-icon blue"><CalendarDays size={17} /></span><strong>Schedule</strong></button>
    </div></section>
    <section className="nearby-section"><ScreenTitle title="Nearby trucks"><button className="text-link" onClick={() => onNavigate("map")}>View map</button></ScreenTitle><div className="truck-list">{truckRows.slice(0, 2).map((truck) => <TruckRow key={truck.id} truck={truck} compact onClick={() => onNavigate("truck")} />)}</div></section>
    {pickupActive && <button className="active-pickup-card" onClick={() => onNavigate("confirmed")}><span className="quick-icon green"><PackageCheck size={18} /></span><span><strong>Pickup request confirmed</strong><small>Truck NCG-214 • 6 min away</small></span><ChevronRight size={16} /></button>}
    <div className="tip-card"><Lightbulb size={17} /><span>Keep recyclables clean and dry before pickup.</span></div>
    <div className="alert-row"><span><Bell size={17} /></span><div><strong>Pickup alerts are on</strong><small>We'll notify you at arrival and completion.</small></div><Switch checked={alerts} onCheckedChange={setAlerts} label="Pickup alerts" /></div>
  </div>;
}

function MapScreen({ onNavigate }) {
  const [filter, setFilter] = useState("All trucks");
  const [query, setQuery] = useState("");
  const visibleTrucks = useMemo(() => truckRows.filter((truck) => `${truck.id} ${truck.street}`.toLowerCase().includes(query.toLowerCase())).filter((truck) => filter === "All trucks" || (filter === "En route" ? truck.state !== "Available" : truck.state === "Available")), [filter, query]);
  return <div className="map-screen">
    <div className="map-top"><span className="eyebrow">LIVE AROUND</span><div className="map-title-line"><h1><MapPin size={17} />Concepcion Pequeña</h1><button className="round-control" aria-label="Search map" onClick={() => document.getElementById("map-search")?.focus()}><Search size={18} /></button></div>
      <div className="map-search-wrap"><Search size={16} /><Input id="map-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search truck or street" /></div>
      <TabsList className="map-filters">{["All trucks", "En route", "Available"].map((item) => <TabsTrigger key={item} active={filter === item} onClick={() => setFilter(item)}><i className={`dot ${item === "En route" ? "dot-blue" : item === "Available" ? "dot-muted" : "dot-green"}`} />{item}</TabsTrigger>)}</TabsList>
    </div>
    <div className="map-canvas"><img src="/images/naga-map.png" alt="Map of Naga City collection routes" /><div className="map-route route-one" /><div className="map-route route-two" />
      {visibleTrucks.map((truck, index) => <button key={truck.id} className={`map-marker marker-${index}`} onClick={() => onNavigate("truck")}><Truck size={13} />{truck.id}</button>)}
      <button className="map-pin" aria-label="Your location"><span /></button><button className="locate-button" aria-label="Center on your location"><LocateFixed size={18} /></button>
    </div>
    <Card className="map-truck-card"><TruckRow truck={visibleTrucks[0] || truckRows[0]} compact onClick={() => onNavigate("truck")} /><div className="map-card-footer"><StatusPill>Collecting now</StatusPill><button className="text-link" onClick={() => onNavigate("truck")}>View details <ChevronRight size={14} /></button></div></Card>
  </div>;
}

function TruckDetailScreen({ onNavigate, onMessage }) {
  return <div className="screen-content detail-screen">
    <AppHeader title="Truck NCG-214" subtitle="Zone 3 collection route" onBack={() => onNavigate("map")} onAction={() => onMessage()} actionIcon={Share2} />
    <Card className="truck-hero"><img src="/images/truck-photo.png" alt="Waste Wise collection truck" /><div className="truck-hero-copy"><StatusPill>Collecting now</StatusPill><strong>6 min</strong><span>ETA to your<br />street</span><small><Navigation size={12} /> 0.8 km away</small></div></Card>
    <div className="driver-load-grid"><Card className="info-card"><span className="eyebrow">DRIVER &amp; VEHICLE</span><div className="driver-row"><span className="avatar">JR</span><span><strong>Joel B. Ramos</strong><small>City SWMO • 4.9 ★</small></span></div><p>Isuzu N-Series • Plate ABG 7421</p></Card><Card className="info-card capacity-card"><span className="eyebrow">LOAD CAPACITY</span><div className="capacity-ring"><strong>64%</strong></div><small>2.9 m³ available</small></Card></div>
    <Card className="route-card"><div className="section-title"><h3>Route progress</h3><strong className="green-text">8 of 13 stops</strong></div><div className="route-stops"><span><i className="stop-dot done" /><strong>Panganiban</strong><small>7:18</small></span><span><i className="stop-dot done" /><strong>Magsaysay</strong><small>7:42</small></span><span><i className="stop-dot now" /><strong>Zone 3</strong><small>Now</small></span><span><i className="stop-dot" /><strong>Del Rosario</strong><small>8:05</small></span></div></Card>
    <div className="detail-actions"><Button variant="secondary" onClick={onMessage}><MessageCircle size={17} />Message</Button><Button onClick={() => onNavigate("map")}><Crosshair size={17} />Track live</Button></div>
  </div>;
}

function ScanScreen({ onNavigate, onPhotoSelected }) {
  return <div className="scan-screen">
    <input
      id="resident-photo-input"
      type="file"
      accept="image/*"
      capture="environment"
      hidden
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) onPhotoSelected(file);
        event.target.value = "";
      }}
    />
    <div className="scan-top"><button className="scan-close" aria-label="Close scanner" onClick={() => onNavigate("home")}><X size={19} /></button><strong>Scan waste</strong><button className="scan-close" aria-label="Toggle flash"><Sparkles size={17} /></button></div>
    <div className="scan-view"><img src="/images/camera-still.png" alt="Waste bags, cardboard and a green collection bin" /><div className="scan-guidance"><ScanLine size={15} />Fit the entire waste pile inside the frame</div></div>
    <div className="scan-controls"><div className="scan-hint"><Crosshair size={15} />Stand 1–2 meters away</div><div className="camera-row"><button className="gallery-button" aria-label="Choose a photo" onClick={() => document.getElementById("resident-photo-input")?.click()}><img src="/images/waste-photo.png" alt="" /></button><button className="shutter" aria-label="Capture waste" onClick={() => document.getElementById("resident-photo-input")?.click()}><span /></button><button className="scan-close refresh-button" aria-label="Retake photo"><RefreshCw size={18} /></button></div><p className="scan-caption">Keep the items in good light</p></div>
  </div>;
}

function AnalysisScreen({ onNavigate, imagePreview, submitState, onSubmit }) {
  return <div className="screen-content analysis-screen"><AppHeader title="Waste analysis" subtitle="Scan complete • 94% confidence" onBack={() => onNavigate("scan")} onAction={() => onNavigate("scan")} />
    <Card className="analysis-card"><img src={imagePreview || "/images/waste-photo.png"} alt="Resident submitted waste" /><div className="analysis-copy"><Badge variant="secondary"><Sparkles size={13} />Mixed dry waste</Badge><small>Estimated volume</small><strong className="volume">0.42 m³</strong><span>≈ 4 standard bags • 31 kg</span><Badge variant="warning" className="cardboard-badge"><i className="dot dot-amber" />Cardboard 62%</Badge></div></Card>
    <Card className="capacity-match"><div className="capacity-head"><span className="success-icon"><Check size={18} /></span><span><strong>Selected bin can accommodate it</strong><small>Zone 3 Materials Hub • 180 m away</small></span><strong className="percent">53%</strong></div><div className="capacity-bar"><span /></div><div className="capacity-foot"><small>18% current</small><small><b>53% after deposit</b></small></div></Card>
    <section className="matches-section"><ScreenTitle title="Available truck matches"><button className="text-link" onClick={() => onNavigate("truck")}>Why these?</button></ScreenTitle><div className="match-list">{truckRows.slice(0, 2).map((truck) => <button key={truck.id} className={`match-row ${truck.best ? "recommended" : ""}`} onClick={() => onNavigate("truck")}><span className="truck-icon"><Truck size={18} /></span><span className="match-copy"><strong>{truck.id}{truck.best && <Badge>Best match</Badge>}</strong><small>{truck.best ? "Zone 3 route • 2.9 m³ space" : "Almeda route • 4.1 m³ space"}</small></span><span className="match-eta"><b>{truck.eta}</b><small>ETA</small></span></button>)}</div></section>
    <div className="tip-card amber-tip"><Recycle size={16} /><span>Flatten cardboard and keep it separate from residual waste.</span></div>
    <Button className="request-button" onClick={onSubmit} disabled={submitState.loading}><Send size={17} />{submitState.loading ? "Sending photo..." : "Request pickup with NCG-214"}</Button>
    {submitState.error && <p role="alert" className="submit-error">{submitState.error}</p>}
  </div>;
}

function ConfirmationScreen({ onNavigate, pickupActive, submittedRequest }) {
  return <div className="screen-content confirm-screen"><div className="confirm-intro"><span className="confirm-check"><Check size={23} /></span><h1>Pickup request confirmed</h1><p>Truck NCG-214 has accepted your dispatch request.</p><Badge className="request-id">{submittedRequest ? `REQUEST #${submittedRequest.id}` : "REQUEST RECEIVED"}</Badge></div>
    <Card className="eta-card"><div className="mini-map"><img src="/images/naga-map.png" alt="Map showing the truck's route" /><span className="mini-truck"><Truck size={14} /></span></div><div className="eta-copy"><StatusPill>Driver en route</StatusPill><strong>6 min</strong><small>Expected by 8:02 AM</small><span>Joel Ramos • ABG 7421</span></div></Card>
    <ProgressTrack />
    <div className="alert-row confirmation-alert"><span><Bell size={17} /></span><div><strong>Pickup alerts are on</strong><small>We'll notify you at arrival and completion.</small></div><span className="switch-static"><span /></span></div>
    <Button className="track-pickup" onClick={() => onNavigate("truck")}><Navigation size={18} />Track pickup live</Button>
    {pickupActive && <button className="return-home" onClick={() => onNavigate("home")}>Back to home <ArrowRight size={14} /></button>}
  </div>;
}

function TrucksScreen({ onNavigate }) {
  const [search, setSearch] = useState("");
  const rows = truckRows.filter((truck) => `${truck.id} ${truck.street}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="screen-content list-screen"><AppHeader title="Nearby trucks" subtitle="Live around Concepcion Pequeña" onAction={() => onNavigate("map")} actionIcon={MapIcon} />
    <div className="search-box"><Search size={17} /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search truck or street" /></div>
    <TabsList className="wide-filters"><TabsTrigger active>All trucks</TabsTrigger><TabsTrigger>En route</TabsTrigger><TabsTrigger>Available</TabsTrigger></TabsList>
    <div className="truck-directory">{rows.map((truck) => <Card key={truck.id} className="directory-card"><TruckRow truck={truck} onClick={() => onNavigate("truck")} /><div className="directory-state"><StatusPill tone={truck.best ? "green" : "blue"}>{truck.state}</StatusPill><span>{truck.space} available</span></div></Card>)}</div>
    <Card className="schedule-info"><CalendarDays size={18} /><span><strong>Zone 3 collection route</strong><small>Next collection • Oct 01, 6:30–8:00 AM</small></span></Card>
  </div>;
}

function ActivityScreen({ onNavigate, pickupActive }) {
  return <div className="screen-content activity-screen"><AppHeader title="Your activity" subtitle="Collection updates and requests" onAction={() => onNavigate("home")} actionIcon={Bell} />
    {pickupActive ? <><div className="activity-date"><span>Today</span><span>Wed, Sep 30</span></div><Card className="activity-request" onClick={() => onNavigate("confirmed")}><div className="activity-icon"><Check size={17} /></div><div><strong>Pickup request confirmed</strong><small>Waste Wise Naga • 7:56 AM</small><StatusPill>Driver en route · 6 min away</StatusPill></div><ChevronRight size={16} /></Card><ProgressTrack compact /><button className="text-link activity-view" onClick={() => onNavigate("confirmed")}>View request details <ChevronRight size={14} /></button></> : <div className="empty-activity"><span><ListChecks size={23} /></span><strong>No recent activity</strong><small>Your pickup requests and collection updates will appear here.</small><Button onClick={() => onNavigate("scan")}>Scan waste to get started</Button></div>}
  </div>;
}

function ScheduleScreen({ onNavigate }) {
  return <div className="screen-content list-screen"><AppHeader title="Collection schedule" subtitle="Concepcion Pequeña • Zone 3" onBack={() => onNavigate("home")} /><Card className="schedule-detail"><span className="date-tile"><span>OCT</span><strong>01</strong></span><span><Badge>Next collection</Badge><strong>6:30–8:00 AM</strong><small>Thursday • Biodegradable waste</small></span></Card><ScreenTitle title="Your collection week" /><div className="week-list">{[["MON", "Sep 28", "No collection"], ["TUE", "Sep 29", "Recyclables • 6:30–8:00 AM"], ["WED", "Sep 30", "No collection"], ["THU", "Oct 01", "Biodegradable • 6:30–8:00 AM"], ["FRI", "Oct 02", "Residual • 6:30–8:00 AM"]].map(([day, date, desc], i) => <div key={day} className={`week-row ${i === 3 ? "today" : ""}`}><span><small>{day}</small><strong>{date}</strong></span><span>{desc}</span>{i === 3 && <CheckCircle2 size={17} />}</div>)}</div></div>;
}

export default function App() {
  const [view, setView] = useState("welcome");
  const [activeTab, setActiveTab] = useState("home");
  const [sheet, setSheet] = useState(null);
  const [pickupActive, setPickupActive] = useState(false);
  const [message, setMessage] = useState("");
  const [sentMessage, setSentMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitState, setSubmitState] = useState({ loading: false, error: "" });
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const navigate = (target) => {
    if (target === "confirmed") setPickupActive(true);
    setView(target);
    if (["home", "map", "scan", "trucks", "activity"].includes(target)) setActiveTab(target);
    if (target === "truck" || target === "analysis" || target === "confirmed" || target === "schedule") {
      if (target === "confirmed") setActiveTab("activity");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhotoSelected = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSubmitState({ loading: false, error: "Choose an image file." });
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setSubmitState({ loading: false, error: "" });
    navigate("analysis");
  };

  const submitRequest = async () => {
    if (!selectedImage) {
      setSubmitState({ loading: false, error: "Choose a photo first." });
      return;
    }
    setSubmitState({ loading: true, error: "" });
    try {
      const request = await submitCollectionRequest({
        image: selectedImage,
        residentName: "Alf M.",
        barangay: "Concepcion Pequeña",
        address: "Concepcion Pequeña, Naga City",
        wasteType: "Mixed dry waste",
        estimatedVolume: "0.42 m³",
        estimatedWeight: "31 kg",
        confidence: "94%",
        truckId: "NCG-214",
      });
      setSubmittedRequest(request);
      setSubmitState({ loading: false, error: "" });
      navigate("confirmed");
    } catch (error) {
      setSubmitState({ loading: false, error: error.message || "Could not send the request." });
    }
  };

  const notificationSheet = <Sheet open={sheet === "notifications"} onOpenChange={(open) => !open && setSheet(null)}><SheetContent><SheetTitle>Pickup notifications</SheetTitle><SheetDescription>Stay up to date with collections around your home.</SheetDescription><div className="sheet-notice"><span className="quick-icon green"><Truck size={18} /></span><span><strong>{pickupActive ? "Truck NCG-214 is on the way" : "Your next collection is tomorrow"}</strong><small>{pickupActive ? "Estimated arrival in 6 minutes." : "Biodegradable • 6:30–8:00 AM"}</small></span></div><Button className="w-full" onClick={() => setSheet(null)}>Done</Button></SheetContent></Sheet>;
  const messageSheet = <Sheet open={sheet === "message"} onOpenChange={(open) => !open && setSheet(null)}><SheetContent><SheetTitle>Message your driver</SheetTitle><SheetDescription>Truck NCG-214 • Joel B. Ramos</SheetDescription><div className="chat-bubble">{sentMessage ? message : "Good morning! I'm on my way to Zone 3. See you in about 6 minutes."}</div><form className="message-form" onSubmit={(event) => { event.preventDefault(); if (message.trim()) setSentMessage(true); }}><Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." aria-label="Message to driver" /><Button size="icon" aria-label="Send message"><Send size={16} /></Button></form></SheetContent></Sheet>;

  if (view === "welcome") return <div className="app-page"><div className="app-shell welcome-shell"><Onboarding onContinue={() => navigate("home")} /></div></div>;

  let content;
  if (view === "home") content = <HomeScreen onNavigate={navigate} onOpenNotifications={() => setSheet("notifications")} pickupActive={pickupActive} />;
  else if (view === "map") content = <MapScreen onNavigate={navigate} />;
  else if (view === "scan") content = <ScanScreen onNavigate={navigate} onPhotoSelected={handlePhotoSelected} />;
  else if (view === "analysis") content = <AnalysisScreen onNavigate={navigate} imagePreview={imagePreview} submitState={submitState} onSubmit={submitRequest} />;
  else if (view === "confirmed") content = <ConfirmationScreen onNavigate={navigate} pickupActive={pickupActive} submittedRequest={submittedRequest} />;
  else if (view === "truck") content = <TruckDetailScreen onNavigate={navigate} onMessage={() => setSheet("message")} />;
  else if (view === "trucks") content = <TrucksScreen onNavigate={navigate} />;
  else if (view === "activity") content = <ActivityScreen onNavigate={navigate} pickupActive={pickupActive} />;
  else content = <ScheduleScreen onNavigate={navigate} />;

  return <div className="app-page"><div className={`app-shell ${view === "scan" ? "scan-shell" : ""}`}>
    <StatusBar />
    {view !== "scan" && <DesktopNavigation active={activeTab} onNavigate={navigate} />}
    <main className={`screen-wrap view-${view}`}>{content}</main>
    {view !== "scan" && <BottomNavigation active={activeTab} onNavigate={navigate} />}
    {notificationSheet}{messageSheet}
  </div></div>;
}
