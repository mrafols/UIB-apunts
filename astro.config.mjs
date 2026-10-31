// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const assignatures = [
  ['10118', '10118 Complements de Tecnologia i Informàtica 1'],
  ['10119', '10119 Complements de Tecnologia i Informàtica 2'],
  ['10691', '10691 L’alumnat de secundària'],
  ['10692', '10692 Organització i currículum (COCEC)'],
  ['10693', '10693 Processos i contextos educatius'],
  ['10694', '10694 Interacció i convivència'],
  ['10695', '10695 Societat, família i educació'],
  ['10703', '10703 Pràctiques'],
  ['10733', '10733 Disseny curricular'],
  ['10734', '10734 Metodologia i recursos'],
  ['10735', '10735 Avaluació'],
  ['10751', '10751 Català: biologia i geologia'],
  ['10757', '10757 Investigació i innovació'],
];

export default defineConfig({
  integrations: [
    starlight({
      title: 'Apunts MFPR',
      description:
        'Apunts d’estudi del Màster de Formació del Professorat (UIB, seu de Menorca, 2026-27), organitzats per assignatura i per sessió.',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Català',
          lang: 'ca',
        },
      },
      customCss: ['./src/styles/custom.css'],
      lastUpdated: false,
      pagination: true,
      sidebar: [
        { label: 'Inici', link: '/' },
        { label: "Calendari d'entregues", link: '/calendari-entregues/' },
        { label: 'Horaris del curs', link: '/calendari/' },
        {
          label: 'El màster',
          autogenerate: { directory: 'master' },
        },
        ...assignatures.map(([dir, label]) => ({
          label,
          autogenerate: { directory: dir },
        })),
      ],
    }),
  ],
});
