# ServiceApp – Projektdokumentation

## Vad appen är
En SaaS-plattform för företag. Företag betalar 300 kr/mån och får tillgång till:
- Arbetshantering (skapa, tilldela, bocka av jobb)
- Intern chatt
- Sjukanmälan
- Påminnelser
- Egna intäkter/utgifter
- AI-assistent (via lokal Ollama)

---

## Filstruktur
```
~/serviceapp/          ← Backend (Node.js + Express + MongoDB)
~/serviceapp-web/      ← Webbsida (React)
~/serviceapp-mobile/   ← Mobilapp (React Native, ej driftsatt än)
~/bot.py               ← Lokal AI-bot (separat från appen)
```

---

## Starta varje dag

### Terminal 1 – Backend
```bash
cd ~/serviceapp
node server.js
```

### Terminal 2 – Webbsida
```bash
cd ~/serviceapp-web
npm start
```

Webbsidan: **http://localhost:3000**

### Om MongoDB inte startar
```bash
sudo systemctl start mongod
```

---

## Inlogg (testkonto)
- E-post: `test@test.se`
- Lösenord: `admin123`
- Roll: owner (byt till superadmin vid behov, se nedan)

---

## Viktiga filer att ändra

### 1. Swish-nummer och bankgiro
Fil: `~/serviceapp/routes/payment.js` (rad 4-5)
```js
swish: '123 456 78 90',   // ← ditt Swish-nummer
bankgiro: '123-4567',      // ← ditt bankgiro
```
Samma info visas på:
- Betalnings-popup (2 min efter registrering)
- Prenumerationssidan
- Registreringssidan

### 2. Pris (just nu 300 kr/mån)
Fil: `~/serviceapp/routes/payment.js` (rad 6)
Fil: `~/serviceapp/routes/revenue.js` (rad 16-17)
Fil: `~/serviceapp-web/src/components/Paywall.js` (rad 48, 95)
Fil: `~/serviceapp-web/src/pages/Billing.js` (rad 42)
Fil: `~/serviceapp-web/src/pages/Register.js` (rad 55, 61)

### 3. Admin-lösenord (för att aktivera kunder)
Fil: `~/serviceapp/.env`
```
ADMIN_KEY=Admin   ← byt till något säkrare
```

### 4. JWT-hemlighet (säkerhet)
Fil: `~/serviceapp/.env`
```
JWT_SECRET=byt_ut_detta_till_nagot_hemligt
```

### 5. Framtida bankkoppling (Stripe el. Billogram)
När du vill ha automatisk betalning – ersätt `~/serviceapp/routes/payment.js` med:
- **Stripe**: lägg in `STRIPE_SECRET_KEY` i `.env` och återskapa routes/stripe.js
- **Billogram**: lägg till `billogram` npm-paket och använd deras API
- **Klarna**: använder REST-API, lägg in `KLARNA_API_KEY` i `.env`

---

## Aktivera betalande kund manuellt
När kund Swishat/banköverfört:
```bash
curl -X POST http://localhost:5000/api/payment/activate/FÖRETAG_ID \
  -H "Content-Type: application/json" \
  -d '{"adminKey":"Admin"}'
```

Hitta FÖRETAG_ID: logga in som superadmin → 💰 Intäkter → se listan

---

## Bli superadmin (din privata intäktspanel)
```bash
cd ~/serviceapp
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  await User.findOneAndUpdate({ email: 'test@test.se' }, { role: 'superadmin' });
  console.log('Klart!'); process.exit();
});"
```

---

## Publicera på internet (när du är redo)
1. Hyr en VPS (t.ex. DigitalOcean, Hetzner ~50 kr/mån)
2. Installera Node.js, MongoDB, Nginx
3. Kopiera `~/serviceapp` och `~/serviceapp-web` till servern
4. Byt `MONGO_URI`, `JWT_SECRET`, `ADMIN_KEY` i `.env`
5. Kör `npm run build` i serviceapp-web och servera via Nginx
6. Sätt upp domän + SSL (gratis via Let's Encrypt)

---

## Teknisk stack
- **Backend**: Node.js, Express 4, MongoDB (Mongoose 8)
- **Frontend**: React 18, React Router 6
- **Auth**: JWT (jsonwebtoken)
- **Filer**: Multer (uppladdning av logotyp)
- **AI**: Ollama lokalt (qwen2.5:7b)
- **Betalning**: Manuell Swish/bankgiro (kan bytas mot Stripe/Klarna)

---

## Senast ändrat
2026-06-13 – Grundstruktur, design, betalningsflöde, AI-chatt, intäktspanel
