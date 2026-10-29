import { Config } from '@remotion/cli/config';

// Só para o Studio (`npm run studio`): o render.ts monta uma pasta pública por render
// (trabalho/publico-<nome>) com os arquivos que o plano usa; para abrir um plano no
// Studio, aponte para uma delas ou copie-a para trabalho/publico.
Config.setPublicDir('./trabalho/publico');
