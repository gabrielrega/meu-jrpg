# CLAUDE.md — meu-jrpg

Guia para o Claude Code neste repositório. As convenções gerais da pasta `projetos` valem aqui; detalhes no `README.md`.

## Ficha

- **Pergunta**: Um RPG de batalha por turnos em HTML único consegue ter progressão e tática com dificuldade equilibrada?
- **Status**: v0.3.0, ativo. Roteiro: equipamentos (feito) → habilidades de chefes → eventos → mapas.
- **Entradas**: Nenhuma externa; progresso salvo no `localStorage`.
- **Saídas**: O jogo em `index.html`.
- **Rodar**: Abrir `index.html` no navegador; balanceamento `node teste-balanceamento.js`.
- **Pronto quando**: O `teste-balanceamento.js`, sincronizado com as regras do `index.html`, roda sem erro e a curva de dificuldade fica dentro do esperado.

## Notas

- Toda mudança de regra de jogo no `index.html` precisa ser espelhada no `teste-balanceamento.js`.
