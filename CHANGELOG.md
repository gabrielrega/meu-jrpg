# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
versionamento conforme [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]
### Removido
- Arquivos de configuração do Replit (`.replit`, `replit.md`); o projeto
  vive no GitHub e roda abrindo o `index.html`.

## [0.2.0] - 2026-06-05
### Modificado
- Rebalanceamento de dificuldade: monstros com mais HP e força e menos
  tesouro.
- Custo de recuperação de HP/MP aumentado de 20 para 50 de ouro.
- Ataque básico do herói passa a usar a Força para aumentar a chance de
  acerto (o dano ainda não escala com Força).
- Não é mais possível fugir de chefes.
- Chance de perder o turno por paralisia aumentada de 30% para 60%.
- Feedback visual de clique nos botões; o botão de recuperar deixa claro
  que restaura HP e MP.

### Corrigido
- "Novo Jogo" não restaurava MP nem habilidades, deixando a barra de MP
  como `NaN%` e travando a tela ao abrir o menu de habilidades.
- HP máximo do herói não aumentava ao subir de nível.
- Veneno e buffs não eram processados no turno em que uma habilidade era
  usada; veneno não matava o inimigo ao usar item (ordem de processamento).
- Chefes podiam reaparecer em intervalos muito curtos.
- Interface de recuperação mostrava custo de 20 ouro, mas cobrava 50.
- Mensagem de "recuperou MP pela vitória" não aparece mais quando o MP
  já está cheio.
- Simulação de balanceamento agora inclui chefes e usa os mesmos valores
  do jogo (dano do herói, custo de recuperação, Força no acerto,
  paralisia e intervalo entre chefes).

## [0.1.0] - 2026-06-05
### Adicionado
- Sistema de batalha por turnos com chance de acerto baseada em agilidade.
- 50 monstros com atributos próprios e efeitos especiais (veneno, paralisia).
- Encontros com chefes a cada 7 vitórias (6 chefes lendários com recompensas maiores).
- Sistema de status/debuffs: veneno, paralisia, buff de força e de defesa.
- Pontos de magia (MP) e habilidades especiais desbloqueadas por nível.
- Inventário de consumíveis e loja na cidade.
- Economia de ouro: ganho em batalhas, gasto em cura e itens.
- Evolução de atributos do herói a cada nível.
- Tela de fim de jogo com estatísticas finais e opção de novo jogo.
- Salvar/carregar progresso via `localStorage`.
- Layout responsivo para desktop e mobile.
- Script de simulação `teste-balanceamento.js` para análise de dificuldade.
</content>
