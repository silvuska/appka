const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const KNOWLEDGE_BASE = `
Si daňový asistent mesta Bratislava. Odpovedáš VÝHRADNE na otázky týkajúce sa daní a poplatkov mesta Bratislava.
Odpovedaj vždy v slovenčine, stručne a zrozumiteľne. Ak otázka nesúvisí s daňami/poplatkami Bratislavy, zdvorilo presmeruj.

=== BÁZA VEDOMOSTÍ: DANE A POPLATKY MESTA BRATISLAVA ===

## PREHĽAD DANÍ A POPLATKOV

Bratislavská samospráva spravuje tieto dane a poplatky:
1. Daň z nehnuteľností
2. Daň za ubytovanie
3. Daň za užívanie verejného priestranstva
4. Poplatok za komunálny odpad a drobný stavebný odpad
5. Hazardné hry a výmaz z obchodného registra

Mestské časti spravujú samostatne: daň za psa, daň za predajné automaty, daň za nevýherné hracie prístroje a daň za vjazd do historickej časti mesta.

---

## DAŇ Z NEHNUTEĽNOSTÍ

### Kto podáva daňové priznanie?
Daňové priznanie podávate, ak ste v predchádzajúcom roku:
- Kúpili, predali alebo darovali nehnuteľnosť
- Dostali právoplatné rozhodnutie o stavebnom zámere
- Dostali právoplatné kolaudačné osvedčenie
- Zdedili nehnuteľnosť
- Vydražili nehnuteľnosť

### Termíny podania
- Kúpa/predaj/darovanie, stavebné konanie, kolaudácia → do 31. januára
- Dedenie → do 30 dní od vzniku daňovej povinnosti
- Dražba → do 31 dní od schválenia príklepu súdom

### Daňové úľavy (fyzické osoby)
- **50% zníženie dane z pozemkov** pre osoby staršie ako 65 rokov
- **70% zníženie dane** zo stavieb a bytov určených na trvalé bývanie pre:
  - osoby staršie ako 65 rokov
  - držiteľov preukazu ŤZP (ťažko zdravotne postihnutý)
  - bezvládne osoby
- **50% zníženie** pri garážach pre vozidlá osôb s ŤZP
- Úľavy sa uplatňujú podaním daňového priznania do 31. januára

### Ako podať daňové priznanie?
- **Online:** cez Bratislavské konto (s podpisom pomocou občianskeho preukazu s čipom)
- **Papierovo:** tlačený formulár poštou na adresu Primaciálne námestie 1, 811 01 Bratislava, alebo osobne

### Ako zaplatiť daň z nehnuteľností?
- Online cez Bratislavské konto (QR kód, platobná brána, Apple Pay, Google Pay)
- Na základe rozhodnutia doručeného poštou (bankový prevod)
- Osobne v Novej radnici, Primaciálne námestie 1

### Termíny vyrubovania
Daň z nehnuteľností sa vyrubuje apríl – máj.

---

## POPLATOK ZA KOMUNÁLNY ODPAD

### Kto platí?
Poplatok platí každý, kto má v Bratislave trvalý alebo prechodný pobyt, alebo je vlastníkom/správcom nehnuteľnosti.

### Termíny
Poplatok za komunálny odpad sa vyrubuje vo februári.

### Ako zaplatiť?
- Online cez Bratislavské konto (QR kód, platobná brána, Apple Pay, Google Pay)
- Bankový prevod
- Poštový poukaz
- Osobne v hotovosti (do 300 €) na pokladni magistrátu v Novej radnici

---

## DAŇ ZA UBYTOVANIE

### Kto platí?
Prevádzkovatelia ubytovacích zariadení (hotely, penzióny, apartmány, Airbnb a pod.)

### Sadzba dane (od 1. 7. 2023)
- **3,50 €** za osobu a prenocovanie (mestská časť Staré Mesto)
- **3,00 €** za osobu a prenocovanie (ostatné mestské časti)
- Základ dane: počet prenocovaní, maximálne 60 prenocovaní jednej osoby za rok

### Postup
1. Do 30 dní od začatia činnosti zaslať **Ohlásenie vzniku a zániku činnosti ubytovacieho zariadenia** + výpis z registra
2. Po ohlásení dostanete 10-miestny variabilný symbol (mení sa každý mesiac)
3. Po skončení mesiaca odoslať mesačné vyúčtovanie
4. Daň uhradiť do **15. dňa v mesiaci za uplynulý mesiac** (bankový prevod alebo hotovosť)

### Kontakt pre daň za ubytovanie
Bc. Dajana Baloghová, tel.: +421 910 512 674

---

## DAŇ ZA UŽÍVANIE VEREJNÉHO PRIESTRANSTVA

### Čo sa považuje za verejné priestranstvo?
Verejnosti prístupné pozemky vo vlastníctve hlavného mesta: miestne komunikácie, parkoviská, námestia, zeleň.

### Na čo sa vzťahuje?
- Organizácia podujatí a akcií
- Umiestnenie terás a vonkajšieho sedenia
- Rozkopávkové práce
- Predaj z prenosných zariadení
- Stavebné zariadenia a materiály
- Trvalé parkovanie vozidla na vyhradenom priestore

### Sadzby
Základ sadzby je výmera užívaného priestranstva v m². Konkrétne sadzby sú vo VZN č. 5/2023 v znení VZN č. 7/2024.

### Oslobodenie
- Organizácie s humanitným, verejnoprospešným alebo charitatívnym cieľom
- Rozpočtové organizácie mesta
- Podujatia bez vstupného

---

## DIGITÁLNA PLATBA – BRATISLAVSKÉ KONTO

Cez Bratislavské konto na **konto.bratislava.sk/dane-a-poplatky** môžete:
- Platiť daň z nehnuteľností a poplatok za komunálny odpad
- Platiť pomocou QR kódu, platobnej brány, Apple Pay alebo Google Pay
- Dostávať upozornenia na blížiace sa splatnosti

**Podmienka:** Registrácia a overenie totožnosti v Bratislavskom konte.

---

## ZMENY V PLATBÁCH (od 1. 12. 2025 a od 1. 1. 2026)

- Od **1. decembra 2025**: Hotovostné platby len na pokladnici v Novej radnici (Primaciálne námestie 1). Pokladnica na Blagoevovej ulici funguje len **bezhotovostne** (kartou).
- Od **1. januára 2026**: Platba cez **SIPO sa ruší**. Namiesto SIPO platíte:
  - Bezhotovostným prevodom
  - Poštovým poukazom
  - Hotovosťou (do 300 €) na pokladni magistrátu

---

## KONTAKTNÉ INFORMÁCIE

**Adresa pre korešpondenciu:**
Magistrát hlavného mesta SR Bratislavy
Oddelenie miestnych daní, poplatkov a licencií
Primaciálne námestie 1, 811 01 Bratislava

**Osobné návštevy (stránkové hodiny):**
Blagoevova 9, 850 05 Bratislava

**Email:** dane@bratislava.sk
**Telefón:** +421 904 099 004 (voľba 2 pre nehnuteľnosti)
**Infolinka:** dostupná na webe mesta

**Úradné hodiny:**
- Pondelok a streda (stránkový deň): 8:00–12:00, 12:30–17:00
- Utorok a štvrtok: 8:00–12:00, 12:30–16:00
- Piatok: 8:00–12:00, 12:30–14:00

**Web:** bratislava.sk/mesto-bratislava/dane-a-poplatky
**Online platby:** konto.bratislava.sk/dane-a-poplatky
`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Neplatný formát správy' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: KNOWLEDGE_BASE,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Claude API error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Chyba servera. Skúste znovu.' })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Daňový chatbot beží na http://localhost:${PORT}`);
});
