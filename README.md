# CURRENT – Technical challenge by Tinne Jacobs. 
Brief: [TASK.md](TASK.md).

## 1. Setup

```bash
npm install
ionic serve      # http://localhost:8100
npm test         # unit tests
npm run lint     # ESLint + Prettier
```

## 2. Users and UX

**The driver could be myself:** on the go, looking for a charger that is nearby, free now and fits the car.

**What I built**

- Map + list in a bottom sheet, sorted by distance
- Map pills showing free chargers ("4/8")
- Details in the sheet: availability, Navigate, price, chargers, support
- Search on station name, quick filter chips and a full filter sheet
- Loading, empty and error states with retry
- Desktop layout from 992 px: side panel next to the map

**Choices**

| Choice | Instead of | Why |
|---|---|---|
| Map and list together | Map/List toggle | You need both "what's near" and "where is it" |
| Details in the sheet | A separate detail page | The map stays visible; going back keeps your place |
| Filter sheet + chips | Only chips | Plug type is multiple choice; chips stay as shortcuts |
| List waits for location | Unsorted list first | It never reorders in front of you |
| 3 charger states | The API's 5 statuses | Available / In use / Out of order is what a driver needs |

**Assumptions**

- Price includes VAT (common for Norwegian consumer prices)
- Fast = 50 kW or more
- Distance is straight-line (Leaflet's `distanceTo`), not driving distance
- No location → Oslo centre, with a notice

**Imperfect data**

| Found | Handled |
|---|---|
| `kWh` fields hold kW | Shown as kW |
| Closed stations reporting free chargers | "Closed" wins |
| All chargers offline | "Out of order", not "Full" |
| Station without chargers | "No chargers" |
| Empty town, long or duplicate names | Street only, names wrap, IDs used |
| Residents-only / private | Lock label + "Public only" filter |
| Unknown values | Safe fallback (out of order / private) |

## 3. Trade-offs

- **Prioritised:** a trustworthy overview, then details to decide, then robustness and UI
- **Many stations:** now all 82 are fetched and sorted on the phone. At scale: backend geo query for nearby/visible stations, marker clustering, virtual scrolling
- **Tests:** unit tests on the logic that's easy to break: API mapping, availability, distance sorting, filters and search
- **Time:** a little over 5 hours. Angular and Ionic were new to me, so I took time to understand each concept

## 4. Next steps

- Address search (geocoding API)
- Marker clustering and live availability
- Sorting by speed or availability
- Preview card on marker tap
- Favourites
- End-to-end tests
- Dark mode

**Known gaps**

- Details endpoint is static, so the header always shows the same station
- No shareable URL per station; Android back doesn't close details
- Location and station data are fetched once

## 5. AI usage

I used Claude Code throughout the build, step by step: first a plan, then the code, one small commit at a time. Since I'm not that familiar with Angular yet, I asked it to explain every concept until I understood it, which helped me finish in a reasonable time while still knowing what I was doing. I reviewed every line and tested each change in the browser, and I corrected it when it built too much or made the wrong UX choice. For the look, I used Claude Design, based on the dark green of CURRENT's website.
