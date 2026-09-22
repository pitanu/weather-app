import { useEffect, useState } from 'react'
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Droplets, LocateFixed, MapPin, Search, Sun, Sunrise, Sunset, Wind } from 'lucide-react'
import { getCondition, getForecast, searchLocation } from './weather'
import Starfield from './components/Starfield'

const icons = { sun: Sun, cloud: Cloud, 'cloud-sun': CloudSun, 'cloud-fog': CloudFog, 'cloud-drizzle': CloudDrizzle, 'cloud-rain': CloudRain, 'cloud-snow': CloudSnow, 'cloud-lightning': CloudLightning }
const copy = {
  fi: { search: 'Hae paikkaa', locate: 'Nykyinen sijainti', today: 'Tänään', feels: 'Tuntuu kuin', humidity: 'Kosteus', wind: 'Tuuli', sunrise: 'Auringonnousu', sunset: 'Auringonlasku', hourly: 'Tuntiennuste', week: '7 päivän ennuste', precipitation: 'Sateen mahdollisuus', loading: 'Haetaan ennustetta...', error: 'Paikkaa ei löytynyt. Kokeile toista hakua.', useLocation: 'Selaimesi ei voi käyttää sijaintia.' },
  en: { search: 'Search location', locate: 'Use my location', today: 'Today', feels: 'Feels like', humidity: 'Humidity', wind: 'Wind', sunrise: 'Sunrise', sunset: 'Sunset', hourly: 'Hourly forecast', week: '7-day forecast', precipitation: 'Chance of rain', loading: 'Loading forecast...', error: 'We could not find that location. Try another search.', useLocation: 'Your browser cannot access location.' },
}

function WeatherIcon({ code, language, className = '' }) {
  const Icon = icons[getCondition(code, language).icon] ?? Cloud
  return <Icon className={className} strokeWidth={1.5} />
}

const dayName = (date, language, options) => new Intl.DateTimeFormat(language === 'fi' ? 'fi-FI' : 'en-GB', options).format(new Date(`${date}T12:00:00`))
const clock = (value, language) => new Intl.DateTimeFormat(language === 'fi' ? 'fi-FI' : 'en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

export default function App() {
  const [language, setLanguage] = useState('fi')
  const [query, setQuery] = useState('Oulu')
  const [place, setPlace] = useState({ name: 'Oulu', country: 'Finland', latitude: 65.0121, longitude: 25.4651 })
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const t = copy[language]

  useEffect(() => { loadForecast(place) }, [place])
  async function loadForecast(location) {
    setLoading(true); setError('')
    try { setWeather(await getForecast(location)) } catch { setError(t.error) } finally { setLoading(false) }
  }
  async function submit(event) {
    event.preventDefault()
    if (!query.trim()) return
    setLoading(true); setError('')
    try { setPlace(await searchLocation(query, language)) } catch { setError(t.error); setLoading(false) }
  }
  function useLocation() {
    if (!navigator.geolocation) return setError(t.useLocation)
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPlace({ name: language === 'fi' ? 'Nykyinen sijainti' : 'Current location', country: '', latitude: coords.latitude, longitude: coords.longitude }),
      () => { setError(t.useLocation); setLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const current = weather?.current
  const currentCondition = current && getCondition(current.weather_code, language)
  const nowHour = current ? Number(current.time.slice(11, 13)) : 0
  const hourly = weather?.hourly.time.map((time, index) => ({ time, index })).filter(({ index }) => index >= nowHour && index < nowHour + 8) ?? []

  return <main className="relative isolate min-h-screen overflow-hidden bg-black text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
    <Starfield />
    <div className="aurora aurora-one" /><div className="aurora aurora-two" />
    <div className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-8 lg:px-10">
      <header className="mb-16 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Sääennuste home"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-300 text-[#02050d] shadow-lg shadow-cyan-500/20"><CloudSun size={23} /></span><span className="hidden text-lg font-semibold tracking-tight sm:block">sää<span className="font-light">ennuste</span></span></a>
        <nav className="rounded-full border border-indigo-300/15 bg-slate-950/70 p-1 shadow-[0_0_28px_rgba(99,102,241,.15)] backdrop-blur-xl"><a href="#top" className="inline-block rounded-full bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-white">{language === 'fi' ? 'Sää' : 'Weather'}</a><a href="#forecast" className="inline-block px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-white">{language === 'fi' ? 'Ennuste' : 'Forecast'}</a></nav>
        <button onClick={() => setLanguage(language === 'fi' ? 'en' : 'fi')} className="rounded-full border border-indigo-300/20 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-slate-200 transition hover:bg-indigo-500/20">{language === 'fi' ? 'EN' : 'FI'}</button>
      </header>
      <section id="top" className="mx-auto max-w-4xl">
        <form onSubmit={submit} className="mx-auto flex max-w-xl rounded-2xl border border-indigo-300/20 bg-slate-950/70 p-1.5 shadow-[0_16px_50px_rgba(0,0,0,.42)] backdrop-blur-xl">
          <Search className="ml-3 self-center text-indigo-200/70" size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t.search} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-500" placeholder={t.search} /><button className="rounded-xl bg-gradient-to-r from-indigo-400 to-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110">{language === 'fi' ? 'Hae' : 'Search'}</button>
        </form>
        <button onClick={useLocation} className="mx-auto mt-4 flex items-center gap-2 text-xs text-slate-300 transition hover:text-sky-300"><LocateFixed size={14} />{t.locate}</button>
      </section>
      {error && <p className="mx-auto mt-8 max-w-xl rounded-xl border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-center text-sm text-rose-100">{error}</p>}
      {loading && !weather ? <div className="py-28 text-center text-slate-300">{t.loading}</div> : weather && <>
        <section className="mt-10 rounded-[2rem] border border-indigo-300/25 bg-slate-900/70 p-6 shadow-[0_18px_65px_rgba(0,0,0,.4)] backdrop-blur-xl sm:p-9">
          <div className="flex items-start justify-between"><div><p className="flex items-center gap-1.5 text-sm text-slate-300"><MapPin size={15} />{place.name}{place.country && `, ${place.country}`}</p><p className="mt-4 text-sm text-slate-400">{t.today}, {dayName(weather.current.time.slice(0, 10), language, { weekday: 'long', day: 'numeric', month: 'long' })}</p></div><p className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-300">{currentCondition.label}</p></div>
          <div className="mt-7 grid gap-8 sm:grid-cols-[1fr_auto]"><div className="flex items-center gap-5"><WeatherIcon code={current.weather_code} language={language} className="h-20 w-20 text-sky-200 sm:h-24 sm:w-24" /><div><div className="text-7xl font-light tracking-tighter">{Math.round(current.temperature_2m)}°</div><p className="mt-1 text-sm text-slate-300">{t.feels} {Math.round(current.apparent_temperature)}°</p></div></div><div className="grid grid-cols-2 gap-x-9 gap-y-5 text-sm sm:place-self-end"><Metric icon={Droplets} label={t.humidity} value={`${current.relative_humidity_2m}%`} /><Metric icon={Wind} label={t.wind} value={`${Math.round(current.wind_speed_10m)} km/h`} /><Metric icon={Sunrise} label={t.sunrise} value={clock(weather.daily.sunrise[0], language)} /><Metric icon={Sunset} label={t.sunset} value={clock(weather.daily.sunset[0], language)} /></div></div>
        </section>
        <section id="forecast" className="mt-5 rounded-[2rem] border border-indigo-300/25 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8"><h2 className="text-base font-semibold">{t.hourly}</h2><div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-8">{hourly.map(({ time, index }) => <div key={time} className="rounded-2xl border border-indigo-200/10 bg-indigo-400/[.12] px-2 py-4 text-center"><p className="text-xs text-slate-400">{index === nowHour ? t.today : time.slice(11, 16)}</p><WeatherIcon code={weather.hourly.weather_code[index]} language={language} className="mx-auto my-3 h-7 w-7 text-cyan-200" /><p className="text-sm font-medium">{Math.round(weather.hourly.temperature_2m[index])}°</p><p className="mt-2 text-[11px] text-cyan-200">{weather.hourly.precipitation_probability[index]}%</p></div>)}</div></section>
        <section className="mt-5 rounded-[2rem] border border-indigo-300/25 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8"><div className="flex items-center justify-between"><h2 className="text-base font-semibold">{t.week}</h2><p className="text-xs text-slate-400">{t.precipitation}</p></div><div className="mt-4 divide-y divide-indigo-200/10">{weather.daily.time.map((date, index) => <div key={date} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 py-4 text-sm sm:grid-cols-[1.2fr_1fr_auto_auto]"><p className="capitalize">{index === 0 ? t.today : dayName(date, language, { weekday: 'long' })}</p><div className="hidden items-center gap-2 text-slate-300 sm:flex"><WeatherIcon code={weather.daily.weather_code[index]} language={language} className="h-5 w-5 text-cyan-200" />{getCondition(weather.daily.weather_code[index], language).label}</div><p className="text-xs text-cyan-200">{weather.daily.precipitation_probability_max[index]}%</p><p className="min-w-20 text-right"><span className="text-slate-400">{Math.round(weather.daily.temperature_2m_min[index])}°</span> <span>{Math.round(weather.daily.temperature_2m_max[index])}°</span></p></div>)}</div></section>
      </>}
      <footer className="pt-10 text-center text-xs text-slate-400">Weather data by Open-Meteo</footer>
    </div>
  </main>
}

function Metric({ icon: Icon, label, value }) { return <div className="flex items-center gap-2"><Icon size={17} className="text-sky-200" /><div><p className="text-[11px] text-slate-400">{label}</p><p className="font-medium">{value}</p></div></div> }
