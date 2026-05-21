import { obterHistoricoEmpresas, buscarImpacto } from './api.js';
import { exibirResultados } from './ui.js';

export function abrirModalHistorico() {
    const modal = document.getElementById('modalHistorico');
    if (modal) {
        modal.style.display = "block";
    }
    const campoBusca = document.getElementById('buscaHistoricoInput');
    if (campoBusca) {
        campoBusca.value = '';
    }
    carregarHistorico();
}

export function fecharModalHistorico() {
    const modal = document.getElementById('modalHistorico');
    if (modal) {
        modal.style.display = "none";
    }
}

export function filtrarHistorico() {
    const input = document.getElementById('buscaHistoricoInput');
    if (!input) return;
    
    const filtro = input.value.toLowerCase();
    const linhas = document.querySelectorAll('#corpoHistorico tr');

    linhas.forEach(linha => {
        if (linha.cells.length < 4) return;
        
        const nome = linha.cells[0].innerText.toLowerCase();
        const cnpj = linha.cells[1].innerText.toLowerCase();
        
        if (nome.includes(filtro) || cnpj.includes(filtro)) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

export async function carregarHistorico() {
    const corpo = document.getElementById('corpoHistorico');
    if (!corpo) return;

    corpo.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Carregando histórico...</td></tr>';

    try {
        const simulacoes = await obterHistoricoEmpresas();
        corpo.innerHTML = '';
        
        if (simulacoes.length === 0) {
            corpo.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Nenhuma análise com identificação realizada ainda.</td></tr>';
            return;
        }

        simulacoes.forEach(sim => {
            const dataFormatada = new Date(sim.criadoEm).toLocaleDateString('pt-BR');
            const nomeExibicao = sim.razaoSocial || "Empresa " + sim.cnpj;
            const cnpjExibicao = sim.cnpj || "Não Informado";
            
            const tr = document.createElement('tr');
            
            const tdNome = document.createElement('td');
            tdNome.innerText = nomeExibicao;
            tr.appendChild(tdNome);

            const tdCnpj = document.createElement('td');
            tdCnpj.innerText = cnpjExibicao;
            tr.appendChild(tdCnpj);

            const tdData = document.createElement('td');
            tdData.innerText = dataFormatada;
            tr.appendChild(tdData);

            const tdAcao = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'btn-view';
            btn.innerText = 'VER';
            
            btn.addEventListener('click', () => revisualizar(sim.id, nomeExibicao));
            
            tdAcao.appendChild(btn);
            tr.appendChild(tdAcao);

            corpo.appendChild(tr);
        });
    } catch (err) {
        corpo.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--danger);">Erro ao carregar histórico.</td></tr>';
    }
}

async function revisualizar(idResultado, nomeEmpresa) {
    try {
        const data = await buscarImpacto(idResultado);
        fecharModalHistorico();
        exibirResultados(data, nomeEmpresa, false);
    } catch (err) {
        alert("Erro ao recuperar os dados dessa simulação congelada.");
    }
}
