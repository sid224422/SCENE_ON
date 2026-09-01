# SCENE_ON

Frontend-only recreation of the SceneOn onboarding experience — landing, terms, a 4-step signup wizard, and a success state. Visual language: black canvas, violet atmosphere, white pill CTAs, Poppins.

No real backend. Network calls are simulated.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Flow

1. `/` Landing
2. `/terms` Consent (18+ required)
3. `/signup` Email
4. `/signup/verify` OTP
5. `/signup/about` Name, age, pronouns
6. `/signup/city` State → city → college
7. `/welcome` Success

## Demo behaviour

- Correct OTP: `424242`
- Expired OTP: `000000`
- Forced network failure: email containing `+fail` (example `ada+fail@sceneon.app`)
- Slow network: email containing `+slow`

Progress (except OTP digits) is kept in `sessionStorage` so refresh does not strand the wizard.
