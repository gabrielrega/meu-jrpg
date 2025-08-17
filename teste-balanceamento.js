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

// Dados do jogo (copiados da versão atual)
const HEROI_INICIAL = {
    nome: "Herói Teste",
    nivel: 1,
    hpMax: 50,
    hp: 50,
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
    status: { veneno: 0, paralisia: 0, forcaBuff: 0, defesaBuff: 0 },
    inventario: { pocao: 2, antidoto: 1, pocaoForca: 0, pocaoDefesa: 0 }
};

const CONSUMIVEIS_LOJA = [
    {nome: "Poção de Cura", id: "pocao", preco: 30, descricao: "Restaura 30 HP"},
    {nome: "Antídoto", id: "antidoto", preco: 20, descricao: "Remove veneno e paralisia"},
    {nome: "Poção de Força", id: "pocaoForca", preco: 50, descricao: "Aumenta ataque por 5 turnos"},
    {nome: "Poção de Defesa", id: "pocaoDefesa", preco: 40, descricao: "Aumenta defesa por 5 turnos"}
];

const MONSTROS = [
    {nome: "Slime", hpMax: 20, forca: 5, defesa: 2, agilidade: 3, peso: 40, tesouro: 10},
    {nome: "Rato Gigante", hpMax: 18, forca: 4, defesa: 1, agilidade: 5, peso: 38, tesouro: 8},
    {nome: "Morcego Sombrio", hpMax: 16, forca: 5, defesa: 1, agilidade: 7, peso: 35, tesouro: 9},
    {nome: "Abelha Assassina", hpMax: 14, forca: 6, defesa: 1, agilidade: 9, peso: 34, tesouro: 10, status: "veneno"},
    {nome: "Goblin", hpMax: 22, forca: 6, defesa: 2, agilidade: 4, peso: 32, tesouro: 12},
    {nome: "Lobo", hpMax: 30, forca: 8, defesa: 4, agilidade: 6, peso: 25, tesouro: 15},
    {nome: "Gnoll", hpMax: 28, forca: 9, defesa: 3, agilidade: 5, peso: 24, tesouro: 16},
    {nome: "Kobold", hpMax: 26, forca: 8, defesa: 3, agilidade: 7, peso: 23, tesouro: 14},
    {nome: "Zumbi", hpMax: 35, forca: 7, defesa: 5, agilidade: 2, peso: 22, tesouro: 18, status: "paralisia"},
    {nome: "Esqueleto Soldado", hpMax: 32, forca: 8, defesa: 4, agilidade: 3, peso: 21, tesouro: 17},
    {nome: "Orc", hpMax: 45, forca: 12, defesa: 6, agilidade: 4, peso: 20, tesouro: 25},
    {nome: "Lançador de Rocha", hpMax: 50, forca: 11, defesa: 7, agilidade: 3, peso: 18, tesouro: 28},
    {nome: "Arqueiro Bandido", hpMax: 40, forca: 9, defesa: 5, agilidade: 8, peso: 18, tesouro: 26},
    {nome: "Aranha Gigante", hpMax: 38, forca: 10, defesa: 4, agilidade: 7, peso: 17, tesouro: 22, status: "veneno"},
    {nome: "Troglodita", hpMax: 48, forca: 11, defesa: 6, agilidade: 5, peso: 16, tesouro: 24},
    {nome: "Cavaleiro Negro", hpMax: 60, forca: 15, defesa: 10, agilidade: 7, peso: 10, tesouro: 40},
    {nome: "Minotauro", hpMax: 65, forca: 17, defesa: 9, agilidade: 6, peso: 9, tesouro: 45},
    {nome: "Homem Urso", hpMax: 62, forca: 16, defesa: 8, agilidade: 5, peso: 8, tesouro: 42},
    {nome: "Gárgula Viva", hpMax: 55, forca: 14, defesa: 12, agilidade: 4, peso: 8, tesouro: 38, status: "paralisia"},
    {nome: "Elemental de Terra", hpMax: 70, forca: 18, defesa: 14, agilidade: 3, peso: 7, tesouro: 50},
    {nome: "Dragão Jovem", hpMax: 80, forca: 20, defesa: 12, agilidade: 8, peso: 5, tesouro: 80},
    {nome: "Quimera", hpMax: 85, forca: 21, defesa: 13, agilidade: 7, peso: 4, tesouro: 85, status: "veneno"},
    {nome: "Hidra Menor", hpMax: 90, forca: 22, defesa: 14, agilidade: 6, peso: 3, tesouro: 90},
    {nome: "Dragão Ancião", hpMax: 100, forca: 25, defesa: 15, agilidade: 9, peso: 2, tesouro: 120},
    {nome: "Demônio de Fogo", hpMax: 95, forca: 23, defesa: 13, agilidade: 8, peso: 2, tesouro: 100, status: "paralisia"}
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
    causasMorte: {},
    tempoMedioJogo: []
};

// ===================================================
// FUNÇÕES DE SIMULAÇÃO DO JOGO
// ===================================================

function criarHeroi() {
    return JSON.parse(JSON.stringify(HEROI_INICIAL));
}

function selecionarInimigo() {
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
    return JSON.parse(JSON.stringify(MONSTROS[0]));
}

function chanceAcerto(agilAtacante, agilDefensor) {
    let chance = 75 + (agilAtacante - agilDefensor) * 3;
    return Math.max(20, Math.min(95, chance));
}

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

function comprarItensIA(heroi) {
    // IA simples para comprar itens
    while (heroi.ouro >= 30 && heroi.inventario.pocao < 5) {
        heroi.ouro -= 30;
        heroi.inventario.pocao++;
    }
    while (heroi.ouro >= 20 && heroi.inventario.antidoto < 3) {
        heroi.ouro -= 20;
        heroi.inventario.antidoto++;
    }
    if (heroi.ouro >= 50 && heroi.inventario.pocaoForca < 2) {
        heroi.ouro -= 50;
        heroi.inventario.pocaoForca++;
    }
    if (heroi.ouro >= 40 && heroi.inventario.pocaoDefesa < 2) {
        heroi.ouro -= 40;
        heroi.inventario.pocaoDefesa++;
    }
}

function simularBatalha(heroi, inimigo) {
    let log = [];
    let turnos = 0;
    const maxTurnos = 50; // Evitar batalhas infinitas
    
    while (heroi.hp > 0 && inimigo.hp > 0 && turnos < maxTurnos) {
        turnos++;
        
        // Turno do herói
        if (heroi.status.paralisia > 0 && Math.random() < 0.3) {
            log.push(`Turno ${turnos}: Herói paralisado, perdeu o turno`);
        } else {
            // IA decide se usar item primeiro
            if (iaUsarItem(heroi, inimigo)) {
                log.push(`Turno ${turnos}: Herói usou item`);
            } else {
                // Atacar
                if (Math.random() * 100 < chanceAcerto(heroi.agilidade, inimigo.agilidade)) {
                    let dano = heroi.dano - Math.floor(inimigo.defesa / 2);
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
        if (inimigo.status.paralisia > 0 && Math.random() < 0.3) {
            log.push(`Turno ${turnos}: ${inimigo.nome} paralisado, perdeu o turno`);
        } else {
            if (Math.random() * 100 < chanceAcerto(inimigo.agilidade, heroi.agilidade)) {
                let dano = inimigo.forca - Math.floor((heroi.defesa + (heroi.status.defesaBuff > 0 ? 5 : 0)) / 2);
                dano = Math.max(1, dano);
                heroi.hp -= dano;
                log.push(`Turno ${turnos}: ${inimigo.nome} acertou por ${dano} dano`);
                
                // Aplicar status especial do monstro
                if (inimigo.status && Math.random() < 0.3) {
                    if (inimigo.status === "veneno" && heroi.status.veneno === 0) {
                        heroi.status.veneno = 3;
                        log.push(`Turno ${turnos}: Herói foi envenenado!`);
                    } else if (inimigo.status === "paralisia" && heroi.status.paralisia === 0) {
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
        // Comprar itens na cidade
        comprarItensIA(heroi);
        
        // Recuperar HP se necessário e tiver ouro
        if (heroi.hp < heroi.hpMax * 0.7 && heroi.ouro >= 20) {
            heroi.ouro -= 20;
            heroi.hp = heroi.hpMax;
        }
        
        // Iniciar batalha
        const inimigo = selecionarInimigo();
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
            heroi.xp += 50;
            heroi.xpTotal += 50;
            
            // Verificar level up
            if (heroi.xp >= heroi.xpProx) {
                heroi.nivel++;
                heroi.xp = 0;
                heroi.hpMax += 10;
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
