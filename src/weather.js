const WEATHER_CODES = {
  0: { label: 'Clear sky', fi: 'Selkeää', icon: 'sun' },
  1: { label: 'Mainly clear', fi: 'Enimmäkseen selkeää', icon: 'sun' },
  2: { label: 'Partly cloudy', fi: 'Puolipilvistä', icon: 'cloud-sun' },
  3: { label: 'Overcast', fi: 'Pilvistä', icon: 'cloud' },
  45: { label: 'Foggy', fi: 'Sumua', icon: 'cloud-fog' },
  48: { label: 'Rime fog', fi: 'Huurresumua', icon: 'cloud-fog' },
  51: { label: 'Light drizzle', fi: 'Heikkoa tihkua', icon: 'cloud-drizzle' },
  53: { label: 'Drizzle', fi: 'Tihkua', icon: 'cloud-drizzle' },
  55: { label: 'Heavy drizzle', fi: 'Voimakasta tihkua', icon: 'cloud-rain' },
  61: { label: 'Slight rain', fi: 'Heikkoa sadetta', icon: 'cloud-rain' },
  63: { label: 'Rain', fi: 'Sadetta', icon: 'cloud-rain' },
  65: { label: 'Heavy rain', fi: 'Voimakasta sadetta', icon: 'cloud-rain' },
  71: { label: 'Light snow', fi: 'Heikkoa lumisadetta', icon: 'cloud-snow' },
  73: { label: 'Snow', fi: 'Lumisadetta', icon: 'cloud-snow' },
  75: { label: 'Heavy snow', fi: 'Voimakasta lumisadetta', icon: 'cloud-snow' },
  80: { label: 'Rain showers', fi: 'Sadekuuroja', icon: 'cloud-rain' },
  81: { label: 'Rain showers', fi: 'Sadekuuroja', icon: 'cloud-rain' },
  82: { label: 'Heavy showers', fi: 'Voimakkaita sadekuuroja', icon: 'cloud-rain' },
  95: { label: 'Thunderstorm', fi: 'Ukkosta', icon: 'cloud-lightning' },
}

export const getCondition = (code, language) => {
  const condition = WEATHER_CODES[code] ?? WEATHER_CODES[3]
  return { ...condition, label: language === 'fi' ? condition.fi : condition.label }
}

export async function searchLocation(query, language = 'fi') {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=${language}&format=json`)
  const data = await response.json()
  if (!data.results?.length) throw new Error('Location not found')
  return data.results[0]
}

export async function getForecast({ latitude, longitude }) {
  const parameters = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    timezone: 'auto',
    forecast_days: '7',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`)
  if (!response.ok) throw new Error('Could not load the forecast')
  return response.json()
}
