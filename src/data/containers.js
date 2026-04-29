export const CONTAINERS_DEFAULT = [
  {
    id: 'MSCU7843291', line: 'MSC', origin: 'Rotterdam, NL', dest: 'Dubai, UAE',
    cargo: 'Pharmaceuticals', cargoIcon: '💊', location: 'Mediterranean Sea',
    lat: 35.5, lng: 18.2, eta: '2025-08-14', etaDays: 3,
    temp: -2.1, tempRange: [-5, 2], humidity: 42, riskScore: 87,
    status: 'CRITICAL', delay: 8, cargoWeight: 4200, cargoValue: 1800000,
    issues: ['Temperature spike detected (+4.2°C above limit)', 'Route deviation: 120nm off course', 'Customs hold risk at Port Jebel Ali'],
    rec: { idealTemp: '-5°C to 2°C', spoilage: 'HIGH — Temp exceedance >6h', delay: 'Likely — Suez congestion', action: 'Reroute via Port Said. Notify consignee. Initiate insurance claim process.' },
    aiReasoning: {
      summary: 'Risk is CRITICAL due to confirmed temperature exceedance combined with route deviation and imminent customs risk.',
      factors: [
        { label: 'Temperature Deviation', score: 92, detail: 'Current -2.1°C is 4.2°C above max threshold. Duration >6h triggers pharmaceutical degradation protocols.' },
        { label: 'Route Deviation', score: 78, detail: '120nm off approved lane. Increases transit time by est. 14h.' },
        { label: 'Delay Probability', score: 74, detail: 'Suez Canal congestion (14 vessels queuing). Average wait: 9.2h.' },
        { label: 'External Events', score: 61, detail: 'Port Jebel Ali issued heightened inspection notice for EU pharmaceutical cold chain cargo.' },
        { label: 'Humidity Stability', score: 28, detail: 'Humidity 42% within acceptable range for pharmaceutical packaging.' },
      ],
    },
    decisionActions: [
      { priority: 1, action: 'Activate emergency temperature recovery protocol', urgency: 'IMMEDIATE' },
      { priority: 2, action: 'Contact MSC operations — request immediate route correction', urgency: 'URGENT' },
      { priority: 3, action: 'Notify consignee and initiate insurance documentation', urgency: 'URGENT' },
      { priority: 4, action: 'Pre-file customs declaration with Port Jebel Ali authority', urgency: 'TODAY' },
      { priority: 5, action: 'Prepare alternate berth at Khalifa Port as contingency', urgency: 'TODAY' },
    ],
    tempHistory: [-4.8,-4.6,-4.2,-3.9,-3.5,-3.1,-2.8,-2.4,-2.1],
    riskHistory: [42,48,51,58,63,69,74,80,87],
    spoilagePct: 34, financialLoss: 612000, wasteKg: 1428, co2Saved: 0,
  },
  {
    id: 'HLCU4521087', line: 'Hapag-Lloyd', origin: 'Shanghai, CN', dest: 'Hamburg, DE',
    cargo: 'Frozen Seafood', cargoIcon: '🐟', location: 'South China Sea',
    lat: 18.2, lng: 115.8, eta: '2025-08-21', etaDays: 10,
    temp: -22.3, tempRange: [-25, -18], humidity: 55, riskScore: 62,
    status: 'WARNING', delay: 2, cargoWeight: 18000, cargoValue: 420000,
    issues: ['Compressor unit 2 performance -15%', 'Tropical storm CIARA projected crossing path'],
    rec: { idealTemp: '-25°C to -18°C', spoilage: 'MODERATE — Monitor compressor', delay: 'Possible — Storm rerouting', action: 'Schedule compressor maintenance at Singapore. Monitor storm track q6h.' },
    aiReasoning: {
      summary: 'WARNING driven by mechanical cooling degradation and approaching storm system with 67% path-crossing probability.',
      factors: [
        { label: 'Compressor Degradation', score: 68, detail: 'Unit 2 at 85% capacity. If unit 1 also degrades, temp will rise above -18°C within 4–6h.' },
        { label: 'Storm Probability', score: 72, detail: 'Tropical storm CIARA Cat-1. 67% probability of direct crossing within 18h.' },
        { label: 'Delay Probability', score: 55, detail: 'Rerouting via Lombok Strait adds 1.8 days. Maintenance stop adds 6h.' },
        { label: 'Temperature Trend', score: 40, detail: 'Currently -22.3°C but trending upward +0.4°C/h. Within range but deteriorating.' },
        { label: 'Humidity Risk', score: 22, detail: 'Humidity 55% normal for frozen seafood. No immediate concern.' },
      ],
    },
    decisionActions: [
      { priority: 1, action: 'Schedule compressor maintenance at Singapore port stop', urgency: 'URGENT' },
      { priority: 2, action: 'Monitor tropical storm CIARA track every 6 hours', urgency: 'URGENT' },
      { priority: 3, action: 'Pre-position spare compressor unit at Singapore depot', urgency: 'TODAY' },
      { priority: 4, action: 'Prepare Lombok Strait alternate route documentation', urgency: 'TODAY' },
    ],
    tempHistory: [-24.1,-23.8,-23.5,-23.2,-22.9,-22.7,-22.5,-22.4,-22.3],
    riskHistory: [28,33,38,42,47,51,55,59,62],
    spoilagePct: 12, financialLoss: 50400, wasteKg: 2160, co2Saved: 4200,
  },
  {
    id: 'CMAU3398812', line: 'CMA CGM', origin: 'Buenos Aires, AR', dest: 'Felixstowe, UK',
    cargo: 'Fresh Produce', cargoIcon: '🥦', location: 'Atlantic Ocean',
    lat: -12.4, lng: -28.6, eta: '2025-08-19', etaDays: 8,
    temp: 4.2, tempRange: [2, 7], humidity: 88, riskScore: 34,
    status: 'OK', delay: 0, cargoWeight: 22000, cargoValue: 280000,
    issues: [],
    rec: { idealTemp: '2°C to 7°C', spoilage: 'LOW — Within parameters', delay: 'None expected', action: 'Continue current route. Pre-notify Felixstowe terminal for expedited customs.' },
    aiReasoning: {
      summary: 'All systems nominal. Risk is LOW. Temperature and humidity within safe parameters. No route disruptions detected.',
      factors: [
        { label: 'Temperature Stability', score: 18, detail: 'Temperature 4.2°C within 2–7°C range. Stable trend for 36h.' },
        { label: 'Humidity Level', score: 22, detail: 'Humidity 88% optimal for leafy produce. No dehumidification required.' },
        { label: 'Delay Probability', score: 12, detail: 'Atlantic route clear. No port congestion at Felixstowe.' },
        { label: 'Route Safety', score: 8, detail: 'No storms, piracy alerts, or geopolitical events on Atlantic corridor.' },
        { label: 'Equipment Health', score: 15, detail: 'All refrigeration units operating at 100% capacity.' },
      ],
    },
    decisionActions: [
      { priority: 1, action: 'Pre-notify Felixstowe terminal for expedited customs clearance', urgency: 'TODAY' },
      { priority: 2, action: 'Confirm cold storage capacity at destination warehouse', urgency: 'THIS WEEK' },
    ],
    tempHistory: [4.8,4.7,4.6,4.5,4.3,4.4,4.2,4.3,4.2],
    riskHistory: [38,36,35,34,33,35,34,33,34],
    spoilagePct: 3, financialLoss: 8400, wasteKg: 660, co2Saved: 8800,
  },
  {
    id: 'EVGU1122334', line: 'Evergreen', origin: 'Kaohsiung, TW', dest: 'Los Angeles, US',
    cargo: 'Temperature Sensors', cargoIcon: '🌡️', location: 'North Pacific',
    lat: 28.1, lng: 168.4, eta: '2025-08-17', etaDays: 6,
    temp: 22.1, tempRange: [15, 30], humidity: 61, riskScore: 18,
    status: 'OK', delay: 0, cargoWeight: 3200, cargoValue: 960000,
    issues: [],
    rec: { idealTemp: '15°C to 30°C', spoilage: 'MINIMAL — Dry electronics', delay: 'None expected', action: 'Standard clearance. No special handling required.' },
    aiReasoning: {
      summary: 'Risk is MINIMAL. Dry electronic cargo has wide tolerance range. All conditions well within specification.',
      factors: [
        { label: 'Temperature Compliance', score: 10, detail: '22.1°C comfortably within 15–30°C range.' },
        { label: 'Humidity Risk', score: 15, detail: '61% humidity within range for packaged electronics. Desiccant packs active.' },
        { label: 'Delay Probability', score: 18, detail: 'LA port queue at normal levels. No congestion expected.' },
        { label: 'Route Risk', score: 12, detail: 'North Pacific route clear. No weather events detected.' },
      ],
    },
    decisionActions: [
      { priority: 1, action: 'Standard customs pre-filing at LA port', urgency: 'THIS WEEK' },
      { priority: 2, action: 'Confirm delivery appointment with consignee', urgency: 'THIS WEEK' },
    ],
    tempHistory: [21.8,22.0,22.2,21.9,22.1,22.3,22.0,22.1,22.1],
    riskHistory: [20,19,18,19,18,17,18,18,18],
    spoilagePct: 0, financialLoss: 0, wasteKg: 0, co2Saved: 1200,
  },
  {
    id: 'OOLU9987543', line: 'OOCL', origin: 'Antwerp, BE', dest: 'Singapore, SG',
    cargo: 'Vaccine Cold Chain', cargoIcon: '💉', location: 'Indian Ocean',
    lat: 5.3, lng: 72.1, eta: '2025-08-16', etaDays: 5,
    temp: 3.8, tempRange: [2, 8], humidity: 39, riskScore: 74,
    status: 'WARNING', delay: 4, cargoWeight: 1800, cargoValue: 3200000,
    issues: ['Humidity sensor offline since 06:00 UTC', 'Backup cooling unit activated', 'Destination port strike warning'],
    rec: { idealTemp: '2°C to 8°C', spoilage: 'HIGH — Sensor blind spot', delay: 'HIGH — Port strike risk', action: 'Deploy redundant humidity monitoring. Contact Singapore MPA. Prepare alternate berth.' },
    aiReasoning: {
      summary: 'WARNING elevated by sensor failure creating a monitoring blind spot on critical vaccine cargo, plus high-probability port strike.',
      factors: [
        { label: 'Sensor Failure', score: 81, detail: 'Humidity sensor offline 4.2h. Vaccine viability unconfirmed. Regulatory non-compliance risk.' },
        { label: 'Port Strike Risk', score: 76, detail: '72% union vote for strike from Aug 17. Container arrives Aug 16 — only 24h margin.' },
        { label: 'Delay Probability', score: 70, detail: 'Strike adds 2–4 days via alternate berth. Cold chain extension cost: $18,000/day.' },
        { label: 'Temperature Compliance', score: 30, detail: '3.8°C within 2–8°C range. Backup unit compensating adequately.' },
        { label: 'Cargo Criticality', score: 88, detail: 'Vaccine cargo has zero tolerance. Any exceedance requires full batch rejection.' },
      ],
    },
    decisionActions: [
      { priority: 1, action: 'Deploy portable redundant humidity logger immediately', urgency: 'IMMEDIATE' },
      { priority: 2, action: 'Contact Singapore MPA for priority berth allocation', urgency: 'URGENT' },
      { priority: 3, action: 'Prepare Tanjong Pagar alternate berth contingency', urgency: 'URGENT' },
      { priority: 4, action: 'Alert consignee (MOH Singapore) of potential delay', urgency: 'TODAY' },
      { priority: 5, action: 'File regulatory deviation report with WHO cold chain registry', urgency: 'TODAY' },
    ],
    tempHistory: [5.2,4.9,4.7,4.4,4.2,4.0,3.9,3.8,3.8],
    riskHistory: [38,42,48,54,58,62,66,70,74],
    spoilagePct: 28, financialLoss: 896000, wasteKg: 504, co2Saved: 0,
  },
  {
    id: 'YMLU6634421', line: 'Yang Ming', origin: 'Osaka, JP', dest: 'Oakland, US',
    cargo: 'Dairy Products', cargoIcon: '🥛', location: 'Pacific Ocean',
    lat: 38.2, lng: 148.9, eta: '2025-08-22', etaDays: 11,
    temp: 1.4, tempRange: [0, 4], humidity: 72, riskScore: 29,
    status: 'OK', delay: 0, cargoWeight: 9500, cargoValue: 185000,
    issues: [],
    rec: { idealTemp: '0°C to 4°C', spoilage: 'LOW — Optimal conditions', delay: 'None expected', action: 'Maintain current protocols. Pre-stage refrigerated trucks at Oakland.' },
    aiReasoning: {
      summary: 'Risk is LOW. Dairy cargo within optimal temperature and humidity range. Route clear with no disruptions.',
      factors: [
        { label: 'Temperature Compliance', score: 20, detail: '1.4°C within optimal 0–4°C range. Stable 48h trend.' },
        { label: 'Humidity Risk', score: 18, detail: '72% humidity acceptable for sealed dairy packaging.' },
        { label: 'Delay Probability', score: 14, detail: 'Oakland port operations normal. No congestion.' },
        { label: 'Route Safety', score: 10, detail: 'Pacific route clear. No typhoon activity in 5-day window.' },
      ],
    },
    decisionActions: [
      { priority: 1, action: 'Pre-stage refrigerated trucks at Oakland terminal', urgency: 'THIS WEEK' },
      { priority: 2, action: 'Confirm cold storage booking at destination', urgency: 'THIS WEEK' },
    ],
    tempHistory: [1.8,1.7,1.6,1.5,1.5,1.4,1.4,1.5,1.4],
    riskHistory: [32,31,30,30,29,29,29,30,29],
    spoilagePct: 2, financialLoss: 3700, wasteKg: 190, co2Saved: 3800,
  },
]

export const ALERTS = [
  { id: 1, time: '10:23 UTC', sev: 'CRITICAL', msg: 'MSCU7843291 — Temperature breach confirmed. +4.2°C above pharmaceutical threshold.', container: 'MSCU7843291' },
  { id: 2, time: '09:47 UTC', sev: 'WARNING',  msg: 'OOLU9987543 — Humidity sensor unit 3 offline. Vaccine cold chain integrity unconfirmed.', container: 'OOLU9987543' },
  { id: 3, time: '08:55 UTC', sev: 'WARNING',  msg: 'HLCU4521087 — Tropical storm CIARA intensifying. Projected path intersects current route T+18h.', container: 'HLCU4521087' },
  { id: 4, time: '07:12 UTC', sev: 'INFO',     msg: 'CMAU3398812 — ETA revised +0d. All parameters nominal. Customs pre-clearance approved.', container: 'CMAU3398812' },
  { id: 5, time: '06:30 UTC', sev: 'CRITICAL', msg: 'OOLU9987543 — Singapore port workers union: 72% vote in favour of strike from Aug 17.', container: 'OOLU9987543' },
]

// Backwards-compatible named export expected by several pages.
export const CONTAINERS = CONTAINERS_DEFAULT

export const SHIPPING_LINES = [
  { name: 'MSC',          containers: 1, critical: 1, warning: 0, avgRisk: 87, delayRate: '68%', onTimeRate: '32%', trend: 'down',    rating: 'D'  },
  { name: 'OOCL',         containers: 1, critical: 0, warning: 1, avgRisk: 74, delayRate: '44%', onTimeRate: '56%', trend: 'down',    rating: 'C'  },
  { name: 'Hapag-Lloyd',  containers: 1, critical: 0, warning: 1, avgRisk: 62, delayRate: '38%', onTimeRate: '62%', trend: 'neutral', rating: 'C+' },
  { name: 'CMA CGM',      containers: 1, critical: 0, warning: 0, avgRisk: 34, delayRate: '12%', onTimeRate: '88%', trend: 'up',      rating: 'A-' },
  { name: 'Yang Ming',    containers: 1, critical: 0, warning: 0, avgRisk: 29, delayRate: '8%',  onTimeRate: '92%', trend: 'up',      rating: 'A'  },
  { name: 'Evergreen',    containers: 1, critical: 0, warning: 0, avgRisk: 18, delayRate: '5%',  onTimeRate: '95%', trend: 'up',      rating: 'A+' },
]

export function simulateRisk(container, tempDelta, delayDelta) {
  const newTemp = container.temp + tempDelta
  const [min, max] = container.tempRange
  const tempDeviation = Math.max(0, newTemp > max ? newTemp - max : min - newTemp)
  const baseSpoilage = container.spoilagePct
  const tempFactor = tempDeviation > 0 ? Math.min(95, baseSpoilage + tempDeviation * 12) : baseSpoilage
  const delayFactor = delayDelta > 0 ? Math.min(95, tempFactor + delayDelta * 4) : tempFactor
  const newRisk = Math.min(99, Math.round(container.riskScore + tempDelta * 8 + delayDelta * 3))
  const newSpoilage = Math.min(99, Math.round(delayFactor))
  const lossMultiplier = 1 + tempDelta * 0.15 + delayDelta * 0.08
  const newLoss = Math.round(Math.max(0, container.financialLoss * lossMultiplier))
  const newWaste = Math.round(container.wasteKg * (1 + tempDelta * 0.1 + delayDelta * 0.05))
  return { newRisk, newSpoilage, newLoss, newWaste, newTemp }
}

export function latLngToSvg(lat, lng) {
  const x = ((lng + 180) / 360) * 960
  const y = ((90 - lat) / 180) * 480
  return { x, y }
}