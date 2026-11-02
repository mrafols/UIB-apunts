import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import llista from '../../data/assignatures.json';
import { avuiAlCurs, dataIsoValida, encaraNoHaComencat, textInici } from './inici';

export interface Assignatura {
	/** Codi i nom de la carpeta sota `src/content/docs/`. */
	codi: string;
	/** Etiqueta de la barra lateral. */
	label: string;
	/** Títol curt de la targeta de la portada. */
	titol: string;
	/** Descripció de la targeta de la portada. */
	descripcio: string;
	/**
	 * Inici opcional.
	 * Ometre el camp si l’assignatura ja ha començat.
	 * `null` si encara no ha començat i la data no està confirmada.
	 * `AAAA-MM-DD` si hi ha una data d’inici.
	 */
	inici?: string | null;
}

function esAssignatura(valor: unknown): valor is Assignatura {
	if (!valor || typeof valor !== 'object') return false;
	const item = valor as Record<string, unknown>;
	return (
		typeof item.codi === 'string' &&
		typeof item.label === 'string' &&
		typeof item.titol === 'string' &&
		typeof item.descripcio === 'string'
	);
}

function comprova(items: unknown): Assignatura[] {
	if (!Array.isArray(items)) {
		throw new Error('data/assignatures.json ha de ser un array');
	}

	const vistes = new Set<string>();
	const assignatures: Assignatura[] = [];

	for (const item of items) {
		if (!esAssignatura(item)) {
			throw new Error('Assignatura amb camps obligatoris buits o invàlids a data/assignatures.json');
		}
		const { codi, label, titol, descripcio } = item;
		if (!/^\d{5}$/.test(codi)) throw new Error(`Codi d’assignatura invàlid: ${codi}`);
		if (vistes.has(codi)) throw new Error(`Codi d’assignatura repetit: ${codi}`);
		if (label.trim() === '' || titol.trim() === '' || descripcio.trim() === '') {
			throw new Error(`Text buit a l’assignatura ${codi}`);
		}
		vistes.add(codi);

		let inici: string | null | undefined;
		if ('inici' in item) {
			inici = item.inici;
			if (!(inici === null || (typeof inici === 'string' && dataIsoValida(inici)))) {
				throw new Error(`Data d’inici invàlida a ${codi}`);
			}
		}

		const carpeta = join(process.cwd(), 'src/content/docs', codi);
		if (!existsSync(join(carpeta, 'index.md')) && !existsSync(join(carpeta, 'index.mdx'))) {
			throw new Error(`No hi ha index de l’assignatura ${codi}`);
		}

		assignatures.push({
			codi,
			label,
			titol,
			descripcio,
			...('inici' in item ? { inici } : {}),
		});
	}

	const docs = join(process.cwd(), 'src/content/docs');
	for (const entrada of readdirSync(docs, { withFileTypes: true })) {
		if (entrada.isDirectory() && /^\d{5}$/.test(entrada.name) && !vistes.has(entrada.name)) {
			throw new Error(`La carpeta ${entrada.name} no és a data/assignatures.json`);
		}
	}

	return assignatures;
}

export const assignatures = comprova(llista);

export function avuiDelBuild(ara = new Date()): string {
	return avuiAlCurs(ara);
}

export function esPendent(assignatura: Assignatura, avui = avuiDelBuild()): boolean {
	return encaraNoHaComencat(assignatura.inici, avui);
}

export function assignaturesVisibles(avui = avuiDelBuild()): Assignatura[] {
	return assignatures.filter((assignatura) => !esPendent(assignatura, avui));
}

export function assignaturesPendents(avui = avuiDelBuild()): Assignatura[] {
	return assignatures.filter((assignatura) => esPendent(assignatura, avui));
}

interface EntradaLateral {
	label: string;
	collapsed?: boolean;
	badge?: { text: string; class: string };
	autogenerate?: { directory: string };
	items?: EntradaLateral[];
}

function entradaAssignatura(assignatura: Assignatura, pendent: boolean): EntradaLateral {
	const entrada: EntradaLateral = {
		label: assignatura.label,
		autogenerate: { directory: assignatura.codi },
	};
	if (pendent) {
		entrada.collapsed = true;
		entrada.badge = {
			text: textInici(assignatura.inici ?? null),
			class: 'inici-pendent',
		};
	}
	return entrada;
}

/** Grups de la barra lateral: les començades, i «Properament» al final si n’hi ha. */
export function entradesLaterals(avui = avuiDelBuild()): EntradaLateral[] {
	const visibles = assignaturesVisibles(avui).map((assignatura) =>
		entradaAssignatura(assignatura, false),
	);
	const pendents = assignaturesPendents(avui).map((assignatura) =>
		entradaAssignatura(assignatura, true),
	);
	if (pendents.length === 0) return visibles;
	return [
		...visibles,
		{
			label: 'Properament',
			collapsed: true,
			items: pendents,
		},
	];
}
