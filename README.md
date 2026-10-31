# Apunts del MFPR (Menorca, 2026-27)

Lloc estàtic, en català, per estudiar el Màster de Formació del Professorat de la UIB a la seu de Menorca. Cada assignatura té una pàgina de presentació i, quan hi ha material, pàgines de sessió o d’unitat. Les notes són una reelaboració per estudiar: no són els apunts originals del professorat ni els PDF del curs.

El lloc està fet amb [Astro](https://astro.build) i [Starlight](https://starlight.astro.build). `npm run build` genera la carpeta `dist/`. A Vercel n’hi ha prou de connectar el repositori: el framework es detecta sol.

```bash
npm install
npm run dev
npm run build
```

## Afegir una sessió

1. Crea un fitxer Markdown dins `src/content/docs/<codi>/`. El nom ha de començar per un número d’ordre, per exemple `05-nova-sessio.md`, perquè la barra lateral quedi ordenada.
2. Encapçalament mínim:

```markdown
---
title: Sessió 5. Títol curt
description: Una frase que digui de què va.
draft: false
sidebar:
  order: 5
---
```

El camp `draft: false` és necessari. Sense ell, la construcció de producció no publica la pàgina.

3. Escriu amb paraules teves: un resum, els conceptes clau, les definicions i unes preguntes de repàs. Les respostes van dins d’un `<details>`, així queden amagades fins que es despleguen:

```markdown
<details>
<summary>1. Pregunta?</summary>

Resposta breu.

</details>
```

4. Enllaça la sessió des de l’`index.md` de l’assignatura.
5. No copiïs fragments llargs dels materials del professorat. Una cita curta, si cal, n’hi ha prou. No pugis PDF ni el text extret dels originals.

Les assignatures sense material (10118, 10119, 10751, i les unitats tancades de 10733) tenen una pàgina que ho diu. Quan s’obri l’Aula Digital, s’afegeix la sessió com qualsevol altra.

## Calendari d’entregues

Tots els terminis surten d’un sol fitxer: `data/entregues.json`. La pàgina «Calendari d’entregues» i el bloc «Properes entregues» de la portada llegeixen aquest fitxer. La data d’avui es calcula al navegador: el que ja ha passat i el que venç en set dies es marquen sense haver de reconstruir el lloc cada dia. Quan canviï el contingut del JSON, sí que cal un desplegament nou perquè el fitxer quedi incorporat a la pàgina.

Cada element és un objecte amb aquests camps:

| Camp | Obligatori | Format |
| --- | --- | --- |
| `id` | sí | Text únic, estable, sense espais. No es reutilitza si s’esborra una entrada. |
| `codi` | sí | Codi d’assignatura (`10694`) o `MFPR` per a les jornades i el TFM. |
| `assignatura` | sí | Nom en català, per mostrar-lo. |
| `titol` | sí | Què venç o què passa. |
| `tipus` | sí | Un d’aquests valors: `entrega`, `qüestionari`, `examen`, `sessió`, `pràctiques`. |
| `data` | sí | Data ISO `AAAA-MM-DD`. |
| `hora` | sí | `HH:MM` en 24 hores, o `null` si no hi ha hora. Sense hora, el termini es considera vigent fins a les 23:59 d’aquell dia. |
| `notes` | no | Text curt, o `null`. Advertiments, finestres d’obertura, dates per confirmar. |
| `enllac` | no | URL de l’Aula Digital, o `null`. Només `http` o `https`. |

Exemple:

```json
{
  "id": "10694-quadern-4",
  "codi": "10694",
  "assignatura": "Interacció i convivència a l'aula",
  "titol": "Quadern 4. Diari de la sessió 3",
  "tipus": "entrega",
  "data": "2026-11-02",
  "hora": "17:00",
  "notes": "La numeració i la data s'estan contrastant amb el professorat.",
  "enllac": null
}
```

El color de cada codi és a `src/styles/custom.css` (classes `.ent-c-…`). Si s’afegeix un codi nou, convé donar-li un color; si no n’hi ha, es fa servir un gris.

La construcció comprova que el JSON sigui un array, que els `id` no es repeteixin i que `tipus`, `data` i `hora` tinguin la forma indicada. Un fitxer mal format atura `npm run build`.
