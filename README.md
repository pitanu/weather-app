# Sääennuste

A Finnish-first weather application built as a portfolio project. Search any city, use your current location, and see current weather, hourly temperatures, and a seven-day forecast.

The interface follows the visual language of my [portfolio](https://github.com/pitanu/Portfolio): an animated starfield, subtle indigo glow, translucent panels, and cyan accents.

## Features

- City search with global geocoding
- Optional browser geolocation
- Current temperature, feels-like temperature, humidity, wind, sunrise, and sunset
- Hourly forecast and seven-day outlook
- Finnish and English interface toggle
- Animated canvas starfield with shooting meteors
- Respects `prefers-reduced-motion`
- Responsive design for mobile through desktop

## Built with

- [React](https://react.dev/) and [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) icons
- [Open-Meteo](https://open-meteo.com/) Forecast and Geocoding APIs

## Getting started

```bash
git clone https://github.com/pitanu/weather-app.git
cd weather-app
npm install
npm run dev
```

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create an optimized production build in `dist`. |
| `npm run preview` | Preview the production build locally. |

## Deploying to Vercel

Import the repository in [Vercel](https://vercel.com/). Vercel detects Vite automatically.

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: none required

## Data and privacy

Weather and location data is supplied by Open-Meteo. No API key is required. Browser location is requested only after selecting “Use my location”; it is used to load the forecast and is not stored by the app.

## Credits

The animated starfield is adapted from my [portfolio source](https://github.com/pitanu/Portfolio).
