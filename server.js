const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const KNOWLEDGE_BASE = `
Si danovy asistent mesta Bratislava. Odpovedas VYHRADNE na otazky tykajuce sa dani a poplatkov mesta Bratislava.
Odpovedaj vzdy v slovenskom jazyku, strucne a zrozumitelne. Ak otazka nesuvisí s danami/poplatkami Bratislavy, zdvorilo presmeruj.
Pouzivaj spravne diakritiku vo svojich odpovediach.

=== BAZA VEDOMOSTI: DANE A POPLATKY MESTA BRATISLAVA ===

## ROZDELENIE SPRAVY DANI

Magistrat (mesto) spravuje:
- Dan z nehnutelnosti
- Dan za ubytovanie
- Dan za uzivanie verejneho priestranstva (mestske komunikacie I. a II. triedy)
- Poplatok za komunalne odpady a drobne stavebne odpady
- Odvody z hazardnych hier

Mestske casti spravuju samostatne: dan za psa, dan za predajne automaty, dan za nevyherne hracie pristroje, dan za vjazd do historickeho jadra.

---

## DAN Z NEHNUTELNOSTI

### Kedy podat danove priznanie?
- Kupa, darovanie, predaj, BSM, stavebne povolenie, kolaudacia, zmena vymery pozemku -> do 31. januara nasledujuceho roka
- Dedicstvo -> do 30 dni od vzniku danovej povinnosti
- Drazba -> do 31 dni od schvalenia priklep

Pri predaji nehnutelnosti sa podava ciastkove danove priznanie (zanik povinnosti) tiez do 31. januara.

### Danove ulavy (fyzicke osoby)
- 50% znizenie dane z pozemkov pre osoby starsie ako 65 rokov
- 70% znizenie dane zo stavieb a bytov pre osoby nad 65 rokov, drzitelov TZP/TZP-S alebo im blizke zavisle osoby (musi ist o trvale byvanie)
- 50% znizenie dane z garáží pre osoby s TZP, ak sluzba na prepravu
- Ulavy je potrebne uplatnit DO 31. JANUARA daneho roka

### Podanie danoveho priznania
- Online: Bratislavske konto + eID podpis (obciansky preukaz s cipom)
- Papierovo: formular postou alebo osobne na Primacialne nam. 1 alebo Blagoevova 9

### Platba dane z nehnutelnosti
- Online: konto.bratislava.sk (QR kod, platobna brana, Apple Pay, Google Pay)
- Bankovy prevod na zaklade rozhodnutia
- Osobne: Primacialne nam. 1 – hotovost aj karta | Blagoevova 9 – len karta (od 1. 12. 2025)

### Terminy
- Rozhodnutia sa dorucuju: APRIL az MAJ

---

## POPLATOK ZA KOMUNALNY ODPAD

### Kto plati?
Fyzicke osoby s trvalym alebo prechodnym pobytom v Bratislave, vlastnici a spravci nehnutelnosti, podnikatelia.

### Terminy
- Rozhodnutia sa dorucuju: FEBRUAR
- Vznik, zmenu alebo zanik povinnosti hlasite do 30 dni

### Platba
- IBAN: SK36 7500 0000 0000 2592 7013
- Online: konto.bratislava.sk (QR kod, Apple Pay, Google Pay)
- Bankovy prevod alebo postovy poukazm
- Hotovost do 300 EUR na pokladni v Novej radnici (Primacialne nam. 1)
- POZOR: Od 1. januara 2026 su SIPO platby ZRUSENE

### Kontakt pre komunalny odpad
- Tel.: +421 910 520 931 alebo +421 904 099 004 (infolinka)
- Email: zakazka@bratislava.sk
- Spravkyne pridelene podla prveho pismena priezviska

---

## DAN ZA UBYTOVANIE

### Kto plati?
Prevadzkovatelia ubytovacich zariadeni: hotely, penziony, apartmany, Airbnb a pod.

### Sadzba (od 1. 7. 2023)
- 3,50 EUR za osobu/noc – mestska cast Stare Mesto
- 3,00 EUR za osobu/noc – ostatne mestske casti
- Zaklad: pocet prenocovani (max. 60 noci rocne na jedneho hosta)

### Povinnosti prevadzkovatela
1. Podat registracny formular do 30 dni od zacatia prevadzkovania
2. Kazdy mesiac podat mesacne vykazy a platit do 15. dna nasledujuceho mesiaca
3. Variabilny symbol meni sa kazdy mesiac (format: 32[rok][2][c.prevadzky][mesiac])

### Platba
- IBAN: SK91 7500 0000 0000 2592 6993

### Kontakt
- Bc. Dajana Baloghova | Tel.: +421 910 512 674 | Email: dajana.baloghova@bratislava.sk
- Uradne hodiny: pondelok a streda 8:00-12:00, 12:30-17:00

---

## DAN ZA UZIVANIE VEREJNEHO PRIESTRANSTVA

### Co je osobitne uzivanie?
- Umiestnenie terasy alebo letneho sedenia
- Vyykopove a stavebne prace
- Predajny stanok alebo mobilne zariadenie
- Organizovanie podujati a akcii
- Reklamne zariadenia
- Trvale parkovanie na vyhradenom mieste
- Stanoviste taxisluzby
Pravna uprava: VZN c. 5/2023 v zneni VZN c. 7/2024

### Zaklad dane
Vymera v m2 × pocet dni (kazdy aj zacaty m2 a den)

### Oznamovacia povinnost
Oznamenie podat NAJNESKOR V DEN ZACATIA UZIVANIA.

### Oslobodenie
- Humanitarne, kulturne a ekologicke aktivity
- Rozpoctove organizacie mesta
- Podujatia bez vstupneho so charitatívnym vynosom

### Platba
- IBAN: SK07 7500 0000 0000 2533 8163

### Kontakty
- Podujatia, vyykopove prace, parkovanie: Mgr. Ivona Rajtoková | +421 903 456 071
- Stavebne zariadenia, letne sedenia: Mgr. Andrea Bencikova | +421 910 516 293

---

## HAZARDNE HRY – ODVODY

Spravca: Magistrat HM SR Bratislavy
- Kontakt: Ing. Juraj Ciba | Email: juraj.ciba@bratislava.sk | Tel.: +421 902 985 823
- Kancelaria: Blagoevova 9, 3. poschodie, c. 306
- Relevantne VZN: 13/2023, 10/2020, 8/2024, 5/2025 (zakazy prevadzkovania)

---

## DIGITALNA PLATBA – BRATISLAVSKE KONTO

Portal: konto.bratislava.sk/dane-a-poplatky
- Platba QR kodom, platobnou branou, Apple Pay, Google Pay
- Automaticke upozornenia pred splatnostou
- Podmienka: registracia + overenie totoznosti v konte

---

## DOLEZITE ZMENY

- Od 1. decembra 2025: Hotovost len v Novej radnici (Primacialne nam. 1). Blagoevova 9 – len kartou.
- Od 1. januara 2026: SIPO platby za komunalny odpad su ZRUSENE. Nahrada: bankovy prevod, postovy poukazm alebo hotovost do 300 EUR na pokladni.

---

## BANKOVE UCTY

- Dan za uzivanie verejneho priestranstva: SK07 7500 0000 0000 2533 8163
- Poplatok za komunalny odpad: SK36 7500 0000 0000 2592 7013
- Dan za ubytovanie: SK91 7500 0000 0000 2592 6993

---

## KONTAKTNE INFORMACIE

Oddelenie miestnych dani, poplatkov a licencii
- Osobne navstevy: Blagoevova 9, 850 05 Bratislava
- Korespondencia: Primacialne namestie 1, 811 01 Bratislava
- Tel. (infolinka): +421 904 099 004 (volba 2)
- Email: dane@bratislava.sk | komunalny odpad: zakazka@bratislava.sk
- Online infolinka: ba-2.infolinky.textcom.cz/app/
- Online platby: konto.bratislava.sk/dane-a-poplatky

Uradne hodiny (strankove dni):
- Pondelok a Streda: 8:00-12:00, 12:30-17:00
- Utorok a Stvrtok: 8:00-12:00, 12:30-16:00
- Piatok: 8:00-12:00, 12:30-14:00
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
  console.log(`Danovy chatbot bezi na http://localhost:${PORT}`);
});
