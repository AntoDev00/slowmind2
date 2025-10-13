# Slow Mind - App di Meditazione

Slow Mind è un'applicazione web progettata per aiutare gli utenti a praticare la meditazione mindfulness e a mantenere una routine di benessere mentale.

## 🧘 Descrizione del Progetto

L'app offre sessioni di meditazione guidata, monitoraggio delle sessioni e citazioni motivazionali per aiutare gli utenti a mantenere uno stato mentale calmo e consapevole nel loro quotidiano.

## 🛠️ Tecnologie Utilizzate

### Frontend
- React.js
- React Router
- Styled Components
- Axios per le chiamate API

### Backend
- Node.js
- Express
- JWT per l'autenticazione
- bcryptjs per la crittografia delle password

## 📁 Struttura del Progetto

Il progetto è organizzato nelle seguenti cartelle principali:

```
slow-mind/
├── frontend/              # Applicazione React
│   ├── public/            # File pubblici
│   └── src/               # Codice sorgente
│       ├── components/    # Componenti React riutilizzabili
│       ├── context/       # Contesti React (es. AuthContext)
│       ├── pages/         # Pagine/Viste dell'applicazione
│       └── services/      # Servizi per la gestione dati
│
└── backend/               # Server Node.js
    └── server.js          # Punto di ingresso del backend
```

## 🚀 Come Installare

1. Clona il repository:
   ```
   git clone https://github.com/AntoDev00/slowmind2.git
   cd slowmind2
   ```

2. Installa tutte le dipendenze:
   ```
   npm run install:all
   ```

## 🏃‍♂️ Come Eseguire

Per avviare sia il frontend che il backend contemporaneamente:

```
npm start
```

Per avviare solo il backend:
```
npm run start:backend
```

Per avviare solo il frontend:
```
npm run start:frontend
```

## 🌟 Funzionalità Principali

- **Autenticazione**: Registrazione e login utenti
- **Sessioni di Meditazione**: Timer configurabili per sessioni di meditazione
- **Dashboard Personale**: Monitoraggio delle sessioni completate
- **Citazioni Motivazionali**: Quote giornaliere per ispirare la pratica
- **Profilo Utente**: Gestione delle informazioni personali

## 📱 Screenshot

[Qui potrebbero essere inseriti screenshot dell'applicazione]

## 👨‍💻 Autore

- **Antonio Abbruzzese** - [AntoDev00](https://github.com/AntoDev00)

## 📄 Licenza

Questo progetto è sotto licenza ISC.
