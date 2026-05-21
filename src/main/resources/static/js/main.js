import { cadastrarEmpresa, buscarImpacto } from './api.js';
import { exibirResultados, exibirErro, ocultarErro, baixarRelatorioCSV } from './ui.js';
import { abrirModalHistorico, fecharModalHistorico, filtrarHistorico } from './history.js';
import { abrirModalAdmin, fecharModalAdmin, salvarNovoFator } from './admin.js';

async function realizarAnalise() {
    const nome = document.getElementById('razaoSocialInput').value.trim();
    const cnpj = document.getElementById('cnpjInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const volumeVal = document.getElementById('transacoesInput').value;

    if (cnpj.length > 0 && cnpj.length !== 14) {
        alert("Se preenchido, o CNPJ precisa ter exatamente 14 números!");
        return;
    }

    const volume = parseInt(volumeVal);
    if (isNaN(volume) || volume < 1) {
        alert("Por favor, insira um volume válido de transações.");
        return;
    }

    const payload = {
        nomeEmpresa: nome || null,
        cnpj: cnpj || null,
        email: email || null,
        transacoes: volume
    };

    ocultarErro();

    try {
        const dadosProcessados = await cadastrarEmpresa(payload);
        const dataCalculo = await buscarImpacto(dadosProcessados.id);
        
        exibirResultados(dataCalculo, nome, dadosProcessados.anonimo, payload); 
        
    } catch (err) {
        exibirErro(err.message || "Servidor Offline ou Erro de Rede!");
    }
}

function gerarRelatorio() {
    window.print();
}

document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btnCalcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', realizarAnalise);
    }

    const btnAbrirHistorico = document.getElementById('btnAbrirHistorico');
    if (btnAbrirHistorico) {
        btnAbrirHistorico.addEventListener('click', abrirModalHistorico);
    }

    const btnAbrirAdmin = document.getElementById('btnAbrirAdmin');
    if (btnAbrirAdmin) {
        btnAbrirAdmin.addEventListener('click', abrirModalAdmin);
    }

    const closeHistorico = document.getElementById('closeHistorico');
    if (closeHistorico) {
        closeHistorico.addEventListener('click', fecharModalHistorico);
    }

    const closeAdmin = document.getElementById('closeAdmin');
    if (closeAdmin) {
        closeAdmin.addEventListener('click', fecharModalAdmin);
    }

    const buscaHistorico = document.getElementById('buscaHistoricoInput');
    if (buscaHistorico) {
        buscaHistorico.addEventListener('keyup', filtrarHistorico);
    }

    const btnSalvarFator = document.getElementById('btnSalvarFator');
    if (btnSalvarFator) {
        btnSalvarFator.addEventListener('click', salvarNovoFator);
    }

    const btnExportar = document.getElementById('btnExportar');
    if (btnExportar) {
        btnExportar.addEventListener('click', gerarRelatorio);
    }

    const btnExportarCSV = document.getElementById('btnExportarCSV');
    if (btnExportarCSV) {
        btnExportarCSV.addEventListener('click', baixarRelatorioCSV);
    }

    window.addEventListener('click', (event) => {
        const modalHist = document.getElementById('modalHistorico');
        const modalAdm = document.getElementById('modalAdmin');

        if (event.target === modalHist) {
            fecharModalHistorico();
        }
        if (event.target === modalAdm) {
            fecharModalAdmin();
        }
    });
});