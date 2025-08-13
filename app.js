// Estado global do jogo
let jogo = {
    telaAtual: 'cidade',
    heroi: {
        nome: 'Herói',
        nivel: 1,
        hp: 50,
        maxHp: 50,
        xp: 0,
        xpParaProximoNivel: 100
    },
    inimigo: null,
    turnoDoJogador: true,
    batalhaAtiva: false
};

// Configurações
const CONFIG = {
    danoHeroiMin: 10,
    danoHeroiMax: 20,
    danoInimigoMin: 5,
    danoInimigoMax: 15,
    hpInimigoMin: 20,
    hpInimigoMax: 40,
    xpPorVitoria: 50,
    hpBonusPorNivel: 10
};

const INIMIGOS = ['Goblin', 'Orc', 'Esqueleto', 'Lobo', 'Bandido', 'Aranha Gigante'];

// Funções utilitárias
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(mensagem, tipo = '') {
    const container = document.getElementById('log-container');
    if (container) {
        const p = document.createElement('p');
        p.textContent = mensagem;
        p.className = `log-message ${tipo}`;
        container.appendChild(p);
        container.scrollTop = container.scrollHeight;
    }
}

function atualizarHP(elementoId, atual, maximo) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        const percent = Math.max(0, (atual / maximo) * 100);
        elemento.style.width = percent + '%';
        
        elemento.classList.remove('low', 'critical');
        if (percent <= 20) elemento.classList.add('critical');
        else if (percent <= 50) elemento.classList.add('low');
    }
}

// Navegação entre telas
function irParaCidade() {
    document.getElementById('tela-cidade').style.display = 'block';
    document.getElementById('tela-batalha').style.display = 'none';
    jogo.telaAtual = 'cidade';
    atualizarCidade();
}

function irParaBatalha() {
    document.getElementById('tela-cidade').style.display = 'none';
    document.getElementById('tela-batalha').style.display = 'block';
    jogo.telaAtual = 'batalha';
    atualizarBatalha();
}

// Atualizar interfaces
function atualizarCidade() {
    document.getElementById('heroi-nome').textContent = jogo.heroi.nome;
    document.getElementById('heroi-nivel').textContent = jogo.heroi.nivel;
    document.getElementById('heroi-hp').textContent = jogo.heroi.hp;
    document.getElementById('heroi-max-hp').textContent = jogo.heroi.maxHp;
    document.getElementById('heroi-xp').textContent = jogo.heroi.xp;
    document.getElementById('heroi-xp-max').textContent = jogo.heroi.xpParaProximoNivel;
    
    atualizarHP('heroi-hp-bar', jogo.heroi.hp, jogo.heroi.maxHp);
    atualizarHP('heroi-xp-bar', jogo.heroi.xp, jogo.heroi.xpParaProximoNivel);
    
    document.getElementById('btn-recuperar').disabled = (jogo.heroi.hp >= jogo.heroi.maxHp);
}

function atualizarBatalha() {
    document.getElementById('batalla-heroi-nivel').textContent = jogo.heroi.nivel;
    document.getElementById('batalha-heroi-hp').textContent = jogo.heroi.hp;
    document.getElementById('batalha-heroi-max-hp').textContent = jogo.heroi.maxHp;
    atualizarHP('batalha-heroi-hp-bar', jogo.heroi.hp, jogo.heroi.maxHp);
    
    if (jogo.inimigo) {
        document.getElementById('inimigo-nome').textContent = jogo.inimigo.nome;
        document.getElementById('inimigo-hp').textContent = jogo.inimigo.hp;
        document.getElementById('inimigo-max-hp').textContent = jogo.inimigo.maxHp;
        atualizarHP('inimigo-hp-bar', jogo.inimigo.hp, jogo.inimigo.maxHp);
    }
    
    document.getElementById('btn-atacar').disabled = (!jogo.turnoDoJogador || !jogo.batalhaAtiva);
}

// Ações do jogo
function recuperarHP() {
    if (jogo.heroi.hp < jogo.heroi.maxHp) {
        jogo.heroi.hp = jogo.heroi.maxHp;
        atualizarCidade();
    }
}

function criarInimigo() {
    const nome = INIMIGOS[Math.floor(Math.random() * INIMIGOS.length)];
    const hp = random(CONFIG.hpInimigoMin, CONFIG.hpInimigoMax);
    return { nome, hp, maxHp: hp };
}

function iniciarLuta() {
    jogo.inimigo = criarInimigo();
    jogo.turnoDoJogador = true;
    jogo.batalhaAtiva = true;
    
    document.getElementById('log-container').innerHTML = '';
    log(`Um ${jogo.inimigo.nome} selvagem apareceu!`, 'info');
    log('A batalha começou! É sua vez de atacar.', 'info');
    
    irParaBatalha();
}

function atacar() {
    if (!jogo.turnoDoJogador || !jogo.batalhaAtiva) return;
    
    const dano = random(CONFIG.danoHeroiMin, CONFIG.danoHeroiMax);
    jogo.inimigo.hp = Math.max(0, jogo.inimigo.hp - dano);
    
    log(`${jogo.heroi.nome} ataca ${jogo.inimigo.nome} causando ${dano} de dano!`, 'dano');
    
    if (jogo.inimigo.hp <= 0) {
        vitoria();
        return;
    }
    
    jogo.turnoDoJogador = false;
    atualizarBatalha();
    
    setTimeout(() => {
        if (jogo.batalhaAtiva && jogo.inimigo.hp > 0) {
            const danoInimigo = random(CONFIG.danoInimigoMin, CONFIG.danoInimigoMax);
            jogo.heroi.hp = Math.max(0, jogo.heroi.hp - danoInimigo);
            
            log(`${jogo.inimigo.nome} ataca ${jogo.heroi.nome} causando ${danoInimigo} de dano!`, 'dano');
            
            if (jogo.heroi.hp <= 0) {
                derrota();
            } else {
                jogo.turnoDoJogador = true;
                log('É sua vez de atacar!', 'info');
                atualizarBatalha();
            }
        }
    }, 1500);
}

function vitoria() {
    jogo.batalhaAtiva = false;
    log(`${jogo.inimigo.nome} foi derrotado!`, 'vitoria');
    log(`Você ganhou ${CONFIG.xpPorVitoria} XP!`, 'vitoria');
    
    jogo.heroi.xp += CONFIG.xpPorVitoria;
    
    // Verificar level up
    while (jogo.heroi.xp >= jogo.heroi.xpParaProximoNivel) {
        jogo.heroi.xp -= jogo.heroi.xpParaProximoNivel;
        jogo.heroi.nivel++;
        jogo.heroi.maxHp += CONFIG.hpBonusPorNivel;
        jogo.heroi.hp = jogo.heroi.maxHp;
        jogo.heroi.xpParaProximoNivel = jogo.heroi.nivel * 100;
        
        mostrarLevelUp();
    }
    
    setTimeout(() => irParaCidade(), 3000);
}

function derrota() {
    jogo.batalhaAtiva = false;
    log(`${jogo.heroi.nome} foi derrotado!`, 'dano');
    log('Você foi levado de volta à cidade...', 'info');
    
    jogo.heroi.hp = 1;
    setTimeout(() => irParaCidade(), 3000);
}

function fugir() {
    jogo.batalhaAtiva = false;
    log(`${jogo.heroi.nome} fugiu da batalha!`, 'info');
    setTimeout(() => irParaCidade(), 1500);
}

function mostrarLevelUp() {
    const modal = document.getElementById('modal-levelup');
    const texto = document.getElementById('levelup-text');
    
    texto.textContent = `Parabéns! Você subiu para o nível ${jogo.heroi.nivel}!`;
    modal.style.display = 'flex';
}

function fecharLevelUp() {
    document.getElementById('modal-levelup').style.display = 'none';
    atualizarCidade();
    atualizarBatalha();
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    document.getElementById('btn-recuperar').onclick = recuperarHP;
    document.getElementById('btn-lutar').onclick = iniciarLuta;
    document.getElementById('btn-atacar').onclick = atacar;
    document.getElementById('btn-fugir').onclick = fugir;
    document.getElementById('btn-fechar-levelup').onclick = fecharLevelUp;
    
    // Modal click outside
    document.getElementById('modal-levelup').onclick = function(e) {
        if (e.target === this) {
            fecharLevelUp();
        }
    };
    
    // Iniciar na cidade
    irParaCidade();
});
