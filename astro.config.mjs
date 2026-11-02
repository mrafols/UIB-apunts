// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { entradesLaterals } from './src/lib/assignatures.ts';

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
        ...entradesLaterals(),
      ],
    }),
  ],
});
