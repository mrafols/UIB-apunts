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

Les pàgines d’una assignatura que encara no té material ho diuen. Les unitats tancades de 10733 en són un exemple: l’assignatura ja ha començat i es queda a la llista principal. Quan s’obri l’Aula Digital, s’afegeix la sessió com qualsevol altra.

## Inici d’una assignatura

La llista d’assignatures és a `data/assignatures.json`. D’aquí surten tant la barra lateral com les targetes de la portada. Cada objecte té el codi (el nom de la carpeta), l’etiqueta de la barra, el títol curt de la targeta i la descripció.

El camp `inici` és opcional:

- Si no hi és, l’assignatura es tracta com a ja començada i es mostra amb la resta.
- Si és una data ISO `AAAA-MM-DD` posterior al dia de la construcció, encara no es mostra a la llista principal.
- Si és `null`, queda marcada com a no començada i sense data confirmada.

La comparació es fa amb la data civil d’Europa/Madrid en el moment de `npm run build`, no amb l’hora UTC. El dia d’inici ja compta com a començada.

Les que encara no han començat s’agrupen al final de la barra lateral, dins un sol grup plegat que es diu «Properament». Sota el nom de cada una es mostra la data (`7/1/2027`) o el text «data per confirmar» quan `inici` és `null`. Les pàgines es continuen publicant a la mateixa adreça, de manera que un enllaç directe no es trenca. Si s’obre una d’aquestes pàgines, el grup es desplega.

Quan arriba la data, la construcció següent ja la torna a la llista principal i a la portada. El lloc es reconstrueix almenys cada nit feinera, així que no cal tocar el fitxer perquè reaparegui. Esborrar el camp `inici` també la torna a la llista, i és el que s’ha de fer si ha de ser visible abans de la data prevista (o per treure una marca `null` quan el curs ja ha començat). Una data d’avui o passada té el mateix efecte que esborrar el camp: l’assignatura es mostra amb la resta. Una data mal formada atura la construcció.

Exemple amb data:

```json
"inici": "2027-01-07"
```

Exemple sense data confirmada:

```json
"inici": null
```

Ara mateix, 10118 i 10119 tenen `inici` a `null` (l’Aula Digital encara no està oberta) i 10751 té `inici` el 7 de gener de 2027. La resta, incloses les pràctiques (10703), no porten el camp.

Els terminis de `data/entregues.json` no depenen d’aquest camp. Una assignatura que encara no ha començat continua sortint al calendari d’entregues si hi té entrades.

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
