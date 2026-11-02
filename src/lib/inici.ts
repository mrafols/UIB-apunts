/** Zona horària del curs (seu de Menorca). */
export const ZONA_CURS = 'Europe/Madrid';

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Data civil `AAAA-MM-DD` a la zona del curs. */
export function avuiAlCurs(ara = new Date(), zona = ZONA_CURS): string {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: zona,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(ara);
	const valor = (tipus: Intl.DateTimeFormatPartTypes) =>
		parts.find((part) => part.type === tipus)?.value ?? '';
	return `${valor('year')}-${valor('month')}-${valor('day')}`;
}

/** Comprova que la cadena sigui una data ISO real, no només el patró. */
export function dataIsoValida(valor: string): boolean {
	const coincidencia = ISO.exec(valor);
	if (!coincidencia) return false;
	const any = Number(coincidencia[1]);
	const mes = Number(coincidencia[2]);
	const dia = Number(coincidencia[3]);
	const data = new Date(Date.UTC(any, mes - 1, dia));
	return (
		data.getUTCFullYear() === any && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia
	);
}

/**
 * Una assignatura encara no es mostra a la llista principal si `inici` és `null`
 * (no començada, sense data) o si la data és posterior a `avui`.
 * Sense el camp, es considera començada.
 */
export function encaraNoHaComencat(inici: string | null | undefined, avui: string): boolean {
	if (inici === undefined) return false;
	if (inici === null) return true;
	return inici > avui;
}

/** Text curt per a la barra lateral: `7/1/2027` o «data per confirmar». */
export function textInici(inici: string | null): string {
	if (inici === null) return 'data per confirmar';
	const coincidencia = ISO.exec(inici);
	if (!coincidencia) return 'data per confirmar';
	return `${Number(coincidencia[3])}/${Number(coincidencia[2])}/${coincidencia[1]}`;
}
