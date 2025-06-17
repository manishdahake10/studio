# 🌤️ Weather Weaver

**Weather Weaver** is a modern, responsive web application that provides real-time weather data, 7-day climate forecasting, air quality index (AQI) with visual charts, and local news updates based on the searched location. It is built using React (Next.js) and integrates powerful APIs for a comprehensive weather experience.

---

## 🚀 Live Website

🔗 [https://weather-weaver.netlify.app/](https://weather-weaver.netlify.app/)

---

## 🧠 Features

- Real-time weather data based on city/country
- 7-day climate forecast
- Visual graphs for temperature, humidity, pressure
- Air Quality Index (AQI) with intuitive color indicators
- Localized news feed using GNews API
- Mobile-first responsive UI design

---

## 🧰 Tech Stack

- **Frontend**: React.js (Next.js)
- **Styling**: Tailwind CSS
- **Graphs**: Chart.js
- **Hosting**: Netlify (Live) & Firebase (Optional)
- **APIs Used**:
  - OpenWeather API (for weather data)
  - OpenWeather API (for air quality index)
  - GNews API (for location-based news)

---

## 📁 Project Folder Structure
```
weather-weaver/
├── components/ # Reusable UI components
├── pages/ # Next.js routes (/, /map, /about, /privacy-policy)
├── public/ # Static files like icons and images
├── styles/ # Tailwind and custom CSS
├── out/ # Static export folder for deployment
├── .env.example # Sample environment variable setup
├── firebase.json # Firebase config (optional)
└── README.md # Project overview and instructions
```

---

## 🔐 API Setup (.env)

Create a `.env.local` file and add the following keys:

NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_AIR_QUALITY_API_KEY=your_air_quality_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_gnews_api_key

yaml
Copy
Edit


> ⚠️ Keep your actual API keys private. Don’t upload `.env` to GitHub.

---

## 🛠️ Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/weather-weaver.git
cd weather-weaver

# Install dependencies
npm install

# Add your .env.local file

# Start development server
npm run dev
```
To create production build:
```
npm run build
npx next export
```

## 🌍 Deployment
✅ Live on Netlify:
🔗 https://weather-weaver.netlify.app/

Can also be deployed on:

Firebase Hosting

GitHub Pages (via static export)

Vercel

## Author Info
👨‍💻 Manish Rajendra Dahake

📧 Email: manishdahake2026@gmail.com

🗓️ Date: 17-06-2025
