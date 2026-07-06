// ===================================================
// SCRIPT DE SIMULAÇÃO E TESTE DE BALANCEAMENTO
// RPG Batalha por Turnos - Análise de Dificuldade
// ===================================================

// Configurações da simulação
const CONFIG_SIMULACAO = {
    numeroSimulacoes: 1000,
    maxBatalhasPorJogo: 100,
    usarConsumiveisIA: true,
    mostrarProgressoACada: 100,
    salvarLogDetalhado: false
};

// Dados do jogo (copiados da versão atual de index.html)
const HEROI_INICIAL = {
    nome: "Herói Teste",
    nivel: 1,
    hpMax: 50,
    hp: 50,
    mpMax: 20,
    mp: 20,
    xp: 0,
    xpProx: 100,
    ouro: 100,
    forca: 10,
    defesa: 5,
    agilidade: 5,
    dano: 15,
    vitorias: 0,
    derrotas: 0,
    xpTotal: 0,
    vitoriasSdeBoss: 0,
    habilidades: ["golpe_forte"],
    equipamento: {
        arma: null,
        armadura: null
    },
    status: {
        veneno: 0,
        paralisia: 0,
        forcaBuff: 0,
        defesaBuff: 0
    },
    inventario: {
        pocao: 2,
        antidoto: 1,
        pocaoForca: 0,
        pocaoDefesa: 0
    }
};

const CONFIG_GAME = { // Using data from index.html's CONFIG
    danoHeroiMin: 10,
    danoHeroiMax: 20,
    danoInimigoMin: 5,
    danoInimigoMax: 15,
    hpInimigoMin: 20,
    hpInimigoMax: 40,
    xpPorVitoria: 50,
    hpBonusPorNivel: 10,
    custoRecuperacao: 50
};

const CONSUMIVEIS_LOJA = [
    { id: "pocao", nome: "Poção de Cura", preco: 30, descricao: "Restaura 30 HP" },
    { id: "antidoto", nome: "Antídoto", preco: 20, descricao: "Remove veneno e paralisia" },
    { id: "pocaoForca", nome: "Poção de Força", preco: 50, descricao: "Aumenta ataque por 5 turnos" },
    { id: "pocaoDefesa", nome: "Poção de Defesa", preco: 40, descricao: "Aumenta defesa por 5 turnos" }
];

const EQUIPAMENTOS = [
    { id: "adaga", nome: "Adaga Enferrujada", tipo: "arma", preco: 60, dano: 3 },
    { id: "espada_curta", nome: "Espada Curta", tipo: "arma", preco: 150, dano: 5 },
    { id: "machado_guerra", nome: "Machado de Guerra", tipo: "arma", preco: 350, dano: 9, forca: 2 },
    { id: "lamina_dragao", nome: "Lâmina do Dragão", tipo: "arma", preco: 800, dano: 15, forca: 4 },
    { id: "couro", nome: "Armadura de Couro", tipo: "armadura", preco: 50, defesa: 3 },
    { id: "cota_malha", nome: "Cota de Malha", tipo: "armadura", preco: 140, defesa: 5 },
    { id: "placas", nome: "Armadura de Placas", tipo: "armadura", preco: 320, defesa: 9 },
    { id: "escama_dragao", nome: "Escama de Dragão", tipo: "armadura", preco: 750, defesa: 13 }
];

const MONSTROS = [
    // Fracos (mais comuns)
    { nome: "Slime", hpMax: 25, forca: 8, defesa: 2, agilidade: 3, peso: 45, tesouro: 8 },
    { nome: "Rato Gigante", hpMax: 23, forca: 7, defesa: 1, agilidade: 5, peso: 44, tesouro: 6 },
    { nome: "Morcego Sombrio", hpMax: 21, forca: 8, defesa: 1, agilidade: 7, peso: 43, tesouro: 7, inflict: "veneno" },
    { nome: "Abelha Assassina", hpMax: 19, forca: 9, defesa: 1, agilidade: 9, peso: 42, tesouro: 8, inflict: "veneno" },
    { nome: "Goblin", hpMax: 27, forca: 9, defesa: 2, agilidade: 4, peso: 41, tesouro: 10 },
    { nome: "Sapinho Tóxico", hpMax: 25, forca: 8, defesa: 2, agilidade: 4, peso: 40, tesouro: 9, inflict: "veneno" },
    { nome: "Enguia Elétrica", hpMax: 26, forca: 8, defesa: 2, agilidade: 6, peso: 39, tesouro: 10, inflict: "paralisia" },
    { nome: "Esquilo Pirata", hpMax: 24, forca: 8, defesa: 2, agilidade: 7, peso: 38, tesouro: 7 },
    { nome: "Lesma Ácida", hpMax: 28, forca: 9, defesa: 1, agilidade: 2, peso: 37, tesouro: 11, inflict: "veneno" },
    { nome: "Planta Mordente", hpMax: 30, forca: 10, defesa: 3, agilidade: 2, peso: 36, tesouro: 12 },

    // Pouco fortes
    { nome: "Lobo", hpMax: 35, forca: 11, defesa: 4, agilidade: 6, peso: 30, tesouro: 15 },
    { nome: "Gnoll", hpMax: 33, forca: 12, defesa: 3, agilidade: 5, peso: 29, tesouro: 16 },
    { nome: "Kobold", hpMax: 31, forca: 11, defesa: 3, agilidade: 7, peso: 28, tesouro: 14 },
    { nome: "Zumbi", hpMax: 40, forca: 10, defesa: 5, agilidade: 2, peso: 27, tesouro: 18, inflict: "paralisia" },
    { nome: "Esqueleto Soldado", hpMax: 37, forca: 11, defesa: 4, agilidade: 3, peso: 26, tesouro: 17 },
    { nome: "Bárbaro Errante", hpMax: 39, forca: 12, defesa: 4, agilidade: 4, peso: 25, tesouro: 18 },
    { nome: "Cão Infernal", hpMax: 36, forca: 13, defesa: 3, agilidade: 6, peso: 24, tesouro: 17, inflict: "veneno" },
    { nome: "Aranha Cinza", hpMax: 34, forca: 11, defesa: 3, agilidade: 7, peso: 23, tesouro: 16, inflict: "veneno" },
    { nome: "Bandido", hpMax: 38, forca: 12, defesa: 4, agilidade: 6, peso: 22, tesouro: 18 },
    { nome: "Guarda Rebelde", hpMax: 41, forca: 13, defesa: 5, agilidade: 3, peso: 21, tesouro: 19 },

    // Médios
    { nome: "Orc", hpMax: 50, forca: 14, defesa: 6, agilidade: 4, peso: 18, tesouro: 25 },
    { nome: "Lançador de Rocha", hpMax: 55, forca: 13, defesa: 7, agilidade: 3, peso: 17, tesouro: 28 },
    { nome: "Arqueiro Bandido", hpMax: 45, forca: 11, defesa: 5, agilidade: 8, peso: 17, tesouro: 26 },
    { nome: "Aranha Gigante", hpMax: 43, forca: 12, defesa: 4, agilidade: 7, peso: 16, tesouro: 22, inflict: "veneno" },
    { nome: "Troglodita", hpMax: 53, forca: 13, defesa: 6, agilidade: 5, peso: 15, tesouro: 24 },
    { nome: "Centauro", hpMax: 51, forca: 14, defesa: 5, agilidade: 7, peso: 14, tesouro: 26 },
    { nome: "Mago das Sombras", hpMax: 47, forca: 15, defesa: 4, agilidade: 8, peso: 13, tesouro: 30, inflict: "paralisia" },
    { nome: "Ogro", hpMax: 57, forca: 16, defesa: 7, agilidade: 3, peso: 13, tesouro: 28 },
    { nome: "Armadilha Viva", hpMax: 49, forca: 13, defesa: 8, agilidade: 4, peso: 12, tesouro: 25, inflict: "paralisia" },
    { nome: "Besouro Titã", hpMax: 52, forca: 14, defesa: 9, agilidade: 3, peso: 12, tesouro: 27 },

    // Fortes
    { nome: "Cavaleiro Negro", hpMax: 65, forca: 17, defesa: 10, agilidade: 7, peso: 9, tesouro: 40 },
    { nome: "Minotauro", hpMax: 70, forca: 19, defesa: 9, agilidade: 6, peso: 8, tesouro: 45 },
    { nome: "Homem Urso", hpMax: 67, forca: 18, defesa: 8, agilidade: 5, peso: 8, tesouro: 42 },
    { nome: "Gárgula Viva", hpMax: 60, forca: 16, defesa: 12, agilidade: 4, peso: 7, tesouro: 38, inflict: "paralisia" },
    { nome: "Elemental de Terra", hpMax: 75, forca: 20, defesa: 14, agilidade: 3, peso: 7, tesouro: 50 },
    { nome: "Assassino Sombrio", hpMax: 63, forca: 18, defesa: 8, agilidade: 9, peso: 6, tesouro: 44, inflict: "veneno" },
    { nome: "Gigante de Gelo", hpMax: 80, forca: 21, defesa: 13, agilidade: 3, peso: 6, tesouro: 48 },
    { nome: "Fênix Menor", hpMax: 65, forca: 17, defesa: 10, agilidade: 8, peso: 5, tesouro: 46 },
    { nome: "Mantícora", hpMax: 85, forca: 22, defesa: 12, agilidade: 7, peso: 4, tesouro: 80, inflict: "veneno" },
    { nome: "Lich Menor", hpMax: 73, forca: 20, defesa: 11, agilidade: 6, peso: 4, tesouro: 55, inflict: "paralisia" },

    // Muito fortes (raros)
    { nome: "Dragão Jovem", hpMax: 95, forca: 24, defesa: 14, agilidade: 8, peso: 3, tesouro: 90 },
    { nome: "Quimera", hpMax: 90, forca: 23, defesa: 13, agilidade: 7, peso: 3, tesouro: 85, inflict: "veneno" },
    { nome: "Hidra Menor", hpMax: 100, forca: 25, defesa: 14, agilidade: 6, peso: 3, tesouro: 95 },
    { nome: "Demônio de Fogo", hpMax: 97, forca: 25, defesa: 13, agilidade: 8, peso: 2, tesouro: 100, inflict: "paralisia" },
    { nome: "Titã Ancião", hpMax: 105, forca: 27, defesa: 15, agilidade: 5, peso: 2, tesouro: 120 },
    { nome: "Dragão Ancião", hpMax: 115, forca: 29, defesa: 16, agilidade: 9, peso: 2, tesouro: 140 },
    { nome: "Demônio Supremo", hpMax: 110, forca: 28, defesa: 15, agilidade: 8, peso: 1, tesouro: 130, inflict: "veneno" },
    { nome: "Leviatã", hpMax: 120, forca: 30, defesa: 17, agilidade: 7, peso: 1, tesouro: 150, inflict: "paralisia" },
    { nome: "Deus Sombrio", hpMax: 125, forca: 32, defesa: 18, agilidade: 10, peso: 1, tesouro: 200 }
];

const BOSSES = [
    { nome: "🐉 Rei Dragão Antigo", hpMax: 150, forca: 28, defesa: 16, agilidade: 8, tesouro: 300, xpBonus: 200, inflict: "paralisia" },
    { nome: "💀 Rainha Lich Suprema", hpMax: 130, forca: 26, defesa: 14, agilidade: 9, tesouro: 280, xpBonus: 180, inflict: "paralisia" },
    { nome: "👹 Titã Gigante da Montanha", hpMax: 160, forca: 30, defesa: 18, agilidade: 6, tesouro: 320, xpBonus: 220 },
    { nome: "🔥 Lorde dos Abismos Ardentes", hpMax: 140, forca: 29, defesa: 15, agilidade: 7, tesouro: 300, xpBonus: 200, inflict: "paralisia" },
    { nome: "⚡ Imperador Elemental", hpMax: 135, forca: 27, defesa: 14, agilidade: 10, tesouro: 290, xpBonus: 190, inflict: "paralisia" },
    { nome: "🗡️ Cavaleiro Sombrio Imortal", hpMax: 145, forca: 26, defesa: 19, agilidade: 8, tesouro: 310, xpBonus: 210 }
];

// Estatísticas globais para análise
let estatisticasGerais = {
    jogosConcluidos: 0,
    vitoriasTotais: 0,
    derrotasTotais: 0,
    nivelMaximoAlcancado: 0,
    ouroMaximoAlcancado: 0,
    batalhasPorJogo: [],
    nivelFinalJogos: [],
    ouroFinalJogos: [],
    monstrosMaisLetais: {},
    consumiveisUsados: { pocao: 0, antidoto: 0, pocaoForca: 0, pocaoDefesa: 0 },
    equipamentosComprados: { adaga: 0, espada_curta: 0, machado_guerra: 0, lamina_dragao: 0, couro: 0, cota_malha: 0, placas: 0, escama_dragao: 0 },
    causasMorte: {},
    tempoMedioJogo: []
};

// ===================================================
// FUNÇÕES DE SIMULAÇÃO DO JOGO
// ===================================================

function criarHeroi() {
    return JSON.parse(JSON.stringify(HEROI_INICIAL));
}

function seleccionarInimigo(heroi) {
    const h = heroi; // usa o herói da partida em andamento para a lógica de boss
    // Verificar se é hora de um boss (a cada 7 vitórias)
    if (h.vitoriasSdeBoss >= 7 && Math.random() < 0.7) {
        return seleccionarBoss();
    }

    const totalPeso = MONSTROS.reduce((sum, m) => sum + m.peso, 0);
    let r = Math.random() * totalPeso;
    
    for (let m of MONSTROS) {
        if (r < m.peso) {
            const inimigo = JSON.parse(JSON.stringify(m));
            inimigo.hp = inimigo.hpMax;
            inimigo.status = { veneno: 0, paralisia: 0 };
            return inimigo;
        }
        r -= m.peso;
    }
    
    // Fallback para o primeiro monstro
    const fallback = JSON.parse(JSON.stringify(MONSTROS[0]));
    fallback.hp = fallback.hpMax;
    fallback.status = { veneno: 0, paralisia: 0 };
    return fallback;
}

function seleccionarBoss() {
    const boss = JSON.parse(JSON.stringify(BOSSES[Math.floor(Math.random() * BOSSES.length)]));
    boss.hp = boss.hpMax;
    boss.status = { veneno: 0, paralisia: 0 };
    boss.isBoss = true;
    return boss;
}

function chanceAcerto(agilAtacante, agilDefensor, bonusForca = 0) {
    let chance = 75 + (agilAtacante - agilDefensor) * 3 + bonusForca;
    return Math.max(20, Math.min(95, chance));
}

// Equipamentos: mesmos helpers do jogo (bônus derivados, sem mutar atributos base)
function equipado(h, slot) {
    return EQUIPAMENTOS.find(e => e.id === h.equipamento[slot]) || null;
}

function bonusEquip(h, attr) {
    let total = 0;
    for (const slot of ["arma", "armadura"]) {
        const eq = equipado(h, slot);
        if (eq && eq[attr]) total += eq[attr];
    }
    return total;
}

function danoTotal(h) { return h.dano + bonusEquip(h, "dano"); }
function forcaTotal(h) { return h.forca + bonusEquip(h, "forca"); }
function defesaTotal(h) { return h.defesa + bonusEquip(h, "defesa"); }

function processarStatus(entidade) {
    let danoVeneno = 0;
    if (entidade.status.veneno > 0) {
        danoVeneno = 3;
        entidade.hp -= danoVeneno;
        entidade.status.veneno--;
    }
    if (entidade.status.forcaBuff > 0) entidade.status.forcaBuff--;
    if (entidade.status.defesaBuff > 0) entidade.status.defesaBuff--;
    if (entidade.status.paralisia > 0) entidade.status.paralisia--;
    return danoVeneno;
}

function iaUsarItem(heroi, inimigo) {
    if (!CONFIG_SIMULACAO.usarConsumiveisIA) return false;
    
    // Lógica da IA para usar itens
    const hpPorcentagem = heroi.hp / heroi.hpMax;
    
    // Usar poção se HP baixo
    if (hpPorcentagem < 0.3 && heroi.inventario.pocao > 0) {
        heroi.inventario.pocao--;
        heroi.hp = Math.min(heroi.hpMax, heroi.hp + 30);
        estatisticasGerais.consumiveisUsados.pocao++;
        return true;
    }
    
    // Usar antídoto se envenenado/paralisado
    if ((heroi.status.veneno > 0 || heroi.status.paralisia > 0) && heroi.inventario.antidoto > 0) {
        heroi.inventario.antidoto--;
        heroi.status.veneno = 0;
        heroi.status.paralisia = 0;
        estatisticasGerais.consumiveisUsados.antidoto++;
        return true;
    }
    
    // Usar buff de força contra inimigos fortes
    if (inimigo.forca > 15 && heroi.status.forcaBuff === 0 && heroi.inventario.pocaoForca > 0) {
        heroi.inventario.pocaoForca--;
        heroi.status.forcaBuff = 5;
        estatisticasGerais.consumiveisUsados.pocaoForca++;
        return true;
    }
    
    // Usar buff de defesa contra inimigos muito fortes
    if (inimigo.forca > 18 && heroi.status.defesaBuff === 0 && heroi.inventario.pocaoDefesa > 0) {
        heroi.inventario.pocaoDefesa--;
        heroi.status.defesaBuff = 5;
        estatisticasGerais.consumiveisUsados.pocaoDefesa++;
        return true;
    }
    
    return false;
}

function comprarItensIA(heroi, capPocao = 5, capAntidoto = 3, incluirBuffs = true) {
    // IA simples para comprar itens
    while (heroi.ouro >= CONSUMIVEIS_LOJA.find(c => c.id === "pocao").preco && heroi.inventario.pocao < capPocao) {
        heroi.ouro -= CONSUMIVEIS_LOJA.find(c => c.id === "pocao").preco;
        heroi.inventario.pocao++;
    }
    while (heroi.ouro >= CONSUMIVEIS_LOJA.find(c => c.id === "antidoto").preco && heroi.inventario.antidoto < capAntidoto) {
        heroi.ouro -= CONSUMIVEIS_LOJA.find(c => c.id === "antidoto").preco;
        heroi.inventario.antidoto++;
    }
    if (!incluirBuffs) return;
    if (heroi.ouro >= CONSUMIVEIS_LOJA.find(c => c.id === "pocaoForca").preco && heroi.inventario.pocaoForca < 2) {
        heroi.ouro -= CONSUMIVEIS_LOJA.find(c => c.id === "pocaoForca").preco;
        heroi.inventario.pocaoForca++;
    }
    if (heroi.ouro >= CONSUMIVEIS_LOJA.find(c => c.id === "pocaoDefesa").preco && heroi.inventario.pocaoDefesa < 2) {
        heroi.ouro -= CONSUMIVEIS_LOJA.find(c => c.id === "pocaoDefesa").preco;
        heroi.inventario.pocaoDefesa++;
    }
}

function comprarEquipamentosIA(heroi) {
    // Compra o melhor upgrade que couber no ouro, com revenda de 50% do atual
    // (mesma regra do jogo); consumíveis e recuperação têm prioridade
    for (const tipo of ["arma", "armadura"]) {
        const atual = equipado(heroi, tipo);
        const revenda = atual ? Math.floor(atual.preco / 2) : 0;
        const melhor = EQUIPAMENTOS
            .filter(e => e.tipo === tipo && (!atual || e.preco > atual.preco) && heroi.ouro + revenda >= e.preco)
            .sort((a, b) => b.preco - a.preco)[0];
        if (melhor) {
            heroi.ouro += revenda - melhor.preco;
            heroi.equipamento[tipo] = melhor.id;
            estatisticasGerais.equipamentosComprados[melhor.id]++;
        }
    }
}

function simularBatalha(heroi, inimigo) {
    let log = [];
    let turnos = 0;
    const maxTurnos = 50; // Evitar batalhas infinitas
    
    while (heroi.hp > 0 && inimigo.hp > 0 && turnos < maxTurnos) {
        turnos++;
        
        // Turno do herói
        if (heroi.status.paralisia > 0 && Math.random() < 0.6) {
            log.push(`Turno ${turnos}: Herói paralisado, perdeu o turno`);
        } else {
            // IA decide se usar item primeiro
            if (iaUsarItem(heroi, inimigo)) {
                log.push(`Turno ${turnos}: Herói usou item`);
            } else {
                // Atacar
                if (Math.random() * 100 < chanceAcerto(heroi.agilidade, inimigo.agilidade, Math.floor(forcaTotal(heroi) / 2))) {
                    let dano = danoTotal(heroi) - Math.floor(inimigo.defesa / 2);
                    if (heroi.status.forcaBuff > 0) dano += 5;
                    dano = Math.max(1, dano);
                    inimigo.hp -= dano;
                    log.push(`Turno ${turnos}: Herói acertou por ${dano} dano`);
                } else {
                    log.push(`Turno ${turnos}: Herói errou o ataque`);
                }
            }
        }
        
        // Processar status
        processarStatus(heroi);
        processarStatus(inimigo);
        
        if (inimigo.hp <= 0) break;
        
        // Turno do inimigo
        if (inimigo.status.paralisia > 0 && Math.random() < 0.6) {
            log.push(`Turno ${turnos}: ${inimigo.nome} paralisado, perdeu o turno`);
        } else {
            if (Math.random() * 100 < chanceAcerto(inimigo.agilidade, heroi.agilidade)) {
                let dano = inimigo.forca - Math.floor((defesaTotal(heroi) + (heroi.status.defesaBuff > 0 ? 5 : 0)) / 2);
                dano = Math.max(1, dano);
                heroi.hp -= dano;
                log.push(`Turno ${turnos}: ${inimigo.nome} acertou por ${dano} dano`);
                
                // Aplicar status especial do monstro
                if (inimigo.inflict && Math.random() < 0.3) {
                    if (inimigo.inflict === "veneno" && heroi.status.veneno === 0) {
                        heroi.status.veneno = 3;
                        log.push(`Turno ${turnos}: Herói foi envenenado!`);
                    } else if (inimigo.inflict === "paralisia" && heroi.status.paralisia === 0) {
                        heroi.status.paralisia = 2;
                        log.push(`Turno ${turnos}: Herói foi paralisado!`);
                    }
                }
            } else {
                log.push(`Turno ${turnos}: ${inimigo.nome} errou o ataque`);
            }
        }
        
        if (heroi.hp <= 0) break;
    }
    
    return {
        vencedor: heroi.hp > 0 ? 'heroi' : 'inimigo',
        turnos: turnos,
        log: log,
        heroiHpFinal: Math.max(0, heroi.hp),
        inimigoHpFinal: Math.max(0, inimigo.hp)
    };
}

function simularJogoCompleto() {
    const heroi = criarHeroi();
    let batalhasVencidas = 0;
    let logJogo = [];
    const inicioJogo = Date.now();
    
    for (let batalha = 0; batalha < CONFIG_SIMULACAO.maxBatalhasPorJogo; batalha++) {
        // Compras na cidade: estoque mínimo de sobrevivência, cura,
        // depois equipamentos e só então completar o estoque
        comprarItensIA(heroi, 2, 1, false);

        // Recuperar HP se necessário e tiver ouro
        if (heroi.hp < heroi.hpMax * 0.7 && heroi.ouro >= CONFIG_GAME.custoRecuperacao) {
            heroi.ouro -= CONFIG_GAME.custoRecuperacao;
            heroi.hp = heroi.hpMax;
        }

        comprarEquipamentosIA(heroi);
        comprarItensIA(heroi);

        // Iniciar batalha
        const inimigo = seleccionarInimigo(heroi);
        const resultadoBatalha = simularBatalha(heroi, inimigo);
        
        logJogo.push({
            batalha: batalha + 1,
            inimigo: inimigo.nome,
            resultado: resultadoBatalha.vencedor,
            turnos: resultadoBatalha.turnos,
            heroiNivel: heroi.nivel,
            heroiOuro: heroi.ouro
        });
        
        if (resultadoBatalha.vencedor === 'heroi') {
            // Vitória
            batalhasVencidas++;
            heroi.vitorias++;
            heroi.ouro += inimigo.tesouro;

            // Recompensa de XP (bosses dão bônus) e contador de boss
            let xpGanho = CONFIG_GAME.xpPorVitoria;
            if (inimigo.isBoss) {
                xpGanho += inimigo.xpBonus;
                heroi.vitoriasSdeBoss = 1;
            } else {
                heroi.vitoriasSdeBoss++;
            }
            heroi.xp += xpGanho;
            heroi.xpTotal += xpGanho;

            // Verificar level up
            if (heroi.xp >= heroi.xpProx) {
                heroi.nivel++;
                heroi.xp = 0;
                heroi.hpMax += CONFIG_GAME.hpBonusPorNivel;
                heroi.hp = heroi.hpMax;
                heroi.forca += 2;
                heroi.defesa += 1;
                heroi.agilidade += 1;
                heroi.xpProx = heroi.nivel * 100;
                
                // Limpar status negativos no level up
                heroi.status.veneno = 0;
                heroi.status.paralisia = 0;
            }
        } else {
            // Derrota
            heroi.derrotas++;
            
            // Registrar causa da morte
            if (!estatisticasGerais.monstrosMaisLetais[inimigo.nome]) {
                estatisticasGerais.monstrosMaisLetais[inimigo.nome] = 0;
            }
            estatisticasGerais.monstrosMaisLetais[inimigo.nome]++;
            
            const causaMorte = `${inimigo.nome} (Nível ${heroi.nivel})`;
            if (!estatisticasGerais.causasMorte[causaMorte]) {
                estatisticasGerais.causasMorte[causaMorte] = 0;
            }
            estatisticasGerais.causasMorte[causaMorte]++;
            
            break; // Game over
        }
    }
    
    const tempoJogo = Date.now() - inicioJogo;
    
    return {
        heroiFinal: heroi,
        batalhasVencidas: batalhasVencidas,
        sobreviveu: heroi.hp > 0,
        tempoJogo: tempoJogo,
        log: CONFIG_SIMULACAO.salvarLogDetalhado ? logJogo : []
    };
}

// ===================================================
// FUNÇÃO PRINCIPAL DE SIMULAÇÃO
// ===================================================

function executarSimulacao() {
    console.log(`🎮 Iniciando simulação de ${CONFIG_SIMULACAO.numeroSimulacoes} jogos...`);
    console.log(`⚙️ Configurações: Max ${CONFIG_SIMULACAO.maxBatalhasPorJogo} batalhas por jogo, IA usa consumíveis: ${CONFIG_SIMULACAO.usarConsumiveisIA}`);
    console.log("");
    
    const inicioSimulacao = Date.now();
    
    for (let i = 0; i < CONFIG_SIMULACAO.numeroSimulacoes; i++) {
        const resultado = simularJogoCompleto();
        
        // Atualizar estatísticas gerais
        estatisticasGerais.jogosConcluidos++;
        estatisticasGerais.vitoriasTotais += resultado.heroiFinal.vitorias;
        estatisticasGerais.derrotasTotais += resultado.heroiFinal.derrotas;
        estatisticasGerais.nivelMaximoAlcancado = Math.max(estatisticasGerais.nivelMaximoAlcancado, resultado.heroiFinal.nivel);
        estatisticasGerais.ouroMaximoAlcancado = Math.max(estatisticasGerais.ouroMaximoAlcancado, resultado.heroiFinal.ouro);
        
        estatisticasGerais.batalhasPorJogo.push(resultado.batalhasVencidas);
        estatisticasGerais.nivelFinalJogos.push(resultado.heroiFinal.nivel);
        estatisticasGerais.ouroFinalJogos.push(resultado.heroiFinal.ouro);
        estatisticasGerais.tempoMedioJogo.push(resultado.tempoJogo);
        
        // Mostrar progresso
        if ((i + 1) % CONFIG_SIMULACAO.mostrarProgressoACada === 0) {
            const progresso = ((i + 1) / CONFIG_SIMULACAO.numeroSimulacoes * 100).toFixed(1);
            console.log(`📊 Progresso: ${progresso}% (${i + 1}/${CONFIG_SIMULACAO.numeroSimulacoes} jogos)`);
        }
    }
    
    const tempoTotalSimulacao = Date.now() - inicioSimulacao;
    
    // ===================================================
    // RELATÓRIO FINAL
    // ===================================================
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 RELATÓRIO DE ANÁLISE DE BALANCEAMENTO");
    console.log("=".repeat(60));
    
    console.log(`\n🎯 ESTATÍSTICAS GERAIS:`);
    console.log(`   Jogos simulados: ${estatisticasGerais.jogosConcluidos}`);
    console.log(`   Tempo total da simulação: ${(tempoTotalSimulacao / 1000).toFixed(2)}s`);
    console.log(`   Vitórias totais: ${estatisticasGerais.vitoriasTotais}`);
    console.log(`   Derrotas totais: ${estatisticasGerais.derrotasTotais}`);
    
    const mediaVitoriasPorJogo = estatisticasGerais.vitoriasTotais / estatisticasGerais.jogosConcluidos;
    const mediaBatalhasPorJogo = estatisticasGerais.batalhasPorJogo.reduce((a, b) => a + b, 0) / estatisticasGerais.batalhasPorJogo.length;
    const mediaNivelFinal = estatisticasGerais.nivelFinalJogos.reduce((a, b) => a + b, 0) / estatisticasGerais.nivelFinalJogos.length;
    const mediaOuroFinal = estatisticasGerais.ouroFinalJogos.reduce((a, b) => a + b, 0) / estatisticasGerais.ouroFinalJogos.length;
    
    console.log(`\n⚖️ MÉTRICAS DE BALANCEAMENTO:`);
    console.log(`   Vitórias médias por jogo: ${mediaVitoriasPorJogo.toFixed(2)}`);
    console.log(`   Batalhas médias por jogo: ${mediaBatalhasPorJogo.toFixed(2)}`);
    console.log(`   Nível final médio: ${mediaNivelFinal.toFixed(2)}`);
    console.log(`   Ouro final médio: ${mediaOuroFinal.toFixed(0)}`);
    console.log(`   Nível máximo alcançado: ${estatisticasGerais.nivelMaximoAlcancado}`);
    console.log(`   Ouro máximo alcançado: ${estatisticasGerais.ouroMaximoAlcancado}`);
    
    console.log(`\n💊 USO DE CONSUMÍVEIS:`);
    console.log(`   Poções usadas: ${estatisticasGerais.consumiveisUsados.pocao}`);
    console.log(`   Antídotos usados: ${estatisticasGerais.consumiveisUsados.antidoto}`);
    console.log(`   Poções de força: ${estatisticasGerais.consumiveisUsados.pocaoForca}`);
    console.log(`   Poções de defesa: ${estatisticasGerais.consumiveisUsados.pocaoDefesa}`);
    
    console.log(`\n🗡️ EQUIPAMENTOS COMPRADOS:`);
    EQUIPAMENTOS.forEach(eq => {
        console.log(`   ${eq.nome}: ${estatisticasGerais.equipamentosComprados[eq.id]}`);
    });

    console.log(`\n💀 TOP 10 MONSTROS MAIS LETAIS:`);
    const monstrosOrdenados = Object.entries(estatisticasGerais.monstrosMaisLetais)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    monstrosOrdenados.forEach(([nome, mortes], index) => {
        console.log(`   ${index + 1}. ${nome}: ${mortes} mortes`);
    });
    
    console.log(`\n⚠️ ANÁLISE DE DIFICULDADE:`);
    const taxaSobrevivencia = (estatisticasGerais.batalhasPorJogo.filter(b => b >= CONFIG_SIMULACAO.maxBatalhasPorJogo).length / estatisticasGerais.jogosConcluidos * 100).toFixed(1);
    console.log(`   Taxa de "sobrevivência" (máx batalhas): ${taxaSobrevivencia}%`);
    
    if (mediaBatalhasPorJogo < 5) {
        console.log(`   🔴 JOGO MUITO DIFÍCIL - Heróis morrem muito cedo`);
    } else if (mediaBatalhasPorJogo > 20) {
        console.log(`   🟢 JOGO MUITO FÁCIL - Heróis sobrevivem demais`);
    } else {
        console.log(`   🟡 DIFICULDADE BALANCEADA`);
    }
    
    console.log(`\n🔧 SUGESTÕES DE AJUSTE:`);
    if (mediaVitoriasPorJogo < 3) {
        console.log(`   • Considere reduzir força dos monstros iniciais`);
        console.log(`   • Aumente HP inicial do herói`);
        console.log(`   • Diminua preço dos consumíveis`);
    }
    if (mediaVitoriasPorJogo > 15) {
        console.log(`   • Considere aumentar força dos monstros`);
        console.log(`   • Reduza tesouro dos monstros mais fracos`);
        console.log(`   • Aumente preço da recuperação de HP`);
    }
    if (estatisticasGerais.consumiveisUsados.pocao < estatisticasGerais.jogosConcluidos) {
        console.log(`   • IA usa poucas poções - considere ajustar lógica ou preços`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ Simulação concluída!");
    console.log("=".repeat(60));
    
    return estatisticasGerais;
}

// ===================================================
// EXECUÇÃO DO SCRIPT
// ===================================================

// Para rodar a simulação, descomente a linha abaixo:
// executarSimulacao();

// Para usar no navegador, abra o console e digite: executarSimulacao()
console.log("📋 Script de teste carregado!");
console.log("💡 Para executar a simulação, digite: executarSimulacao()");
console.log("⚙️ Para ajustar configurações, modifique CONFIG_SIMULACAO");

executarSimulacao();