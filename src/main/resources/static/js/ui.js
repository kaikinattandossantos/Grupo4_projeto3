import { atualizarGrafico } from './chart.js';
import { buscarImpacto } from './api.js';

let idCalculoAtual = null;

export function exibirErro(mensagem) {
    const display = document.getElementById('msgErro');
    if (display) {
        display.innerText = "⚠️ " + mensagem;
        display.style.display = "block";
        display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

export function ocultarErro() {
    const display = document.getElementById('msgErro');
    if (display) {
        display.style.display = "none";
    }
}

export function exibirResultados(data, nomeEmpresa, isAnonimo) {
    idCalculoAtual = data.id;

    const tituloRelatorio = document.getElementById('nomeEmpresaRelatorio');
    if (!tituloRelatorio) return;

    if (isAnonimo || !nomeEmpresa) {
        tituloRelatorio.innerText = "Simulação Expressa (Não Identificada)";
        tituloRelatorio.classList.add('titulo-anonimo');
    } else {
        tituloRelatorio.innerText = nomeEmpresa;
        tituloRelatorio.classList.remove('titulo-anonimo');
    }

    const cenarioText = document.getElementById('cenarioSimuladoText');
    if (cenarioText) {
        const perc = data.percentualMigracao !== undefined && data.percentualMigracao !== null ? data.percentualMigracao : 100;
        cenarioText.innerText = `Cenário Simulado: ${perc}% de migração para o digital`;
    }

    const section = document.getElementById('resultsSection');
    if (section) {
        section.classList.remove('results-hidden');
        section.classList.add('results-visible');
    }

    const co2El = document.getElementById('co2EvitadoVal');
    if (co2El) co2El.innerText = data.co2Evitado.toFixed(2);

    const arvoresEl = document.getElementById('arvoresVal');
    if (arvoresEl) {
        const arvores = data.arvoresEquivalentes;
        arvoresEl.innerText = arvores % 1 === 0 ? arvores : arvores.toFixed(1);
    }

    const kmEl = document.getElementById('kmVal');
    if (kmEl) kmEl.innerText = Math.floor(data.kmEvitados).toLocaleString('pt-BR');

    const garrafasEl = document.getElementById('garrafasVal');
    if (garrafasEl) garrafasEl.innerText = Math.floor(data.garrafasPetEvitadas).toLocaleString('pt-BR');

    atualizarGrafico(data.impactoFisico, data.impactoHibrido, data.impactoDigital);

    setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

export async function baixarRelatorioCSV() {
    if (!idCalculoAtual) {
        alert("Nenhuma simulação ativa para exportar.");
        return;
    }

    try {
        const dbData = await buscarImpacto(idCalculoAtual);

        const nomeEmpresa = (dbData.empresa && dbData.empresa.nomeEmpresa) ? dbData.empresa.nomeEmpresa : "Empresa Não Identificada";
        const cnpjTexto = (dbData.empresa && dbData.empresa.cnpj) ? dbData.empresa.cnpj : "Não informado";
        const emailTexto = (dbData.empresa && dbData.empresa.email) ? dbData.empresa.email : "Não informado";
        const volumeTexto = dbData.qtdTransacoes || "Não informado";
        const tipoSimulacao = dbData.empresa ? "Completa (Identificada)" : "Expressa (Anônima)";
        const percentualMigracao = dbData.percentualMigracao !== null && dbData.percentualMigracao !== undefined ? dbData.percentualMigracao : "100";

        const co2 = document.getElementById('co2EvitadoVal').innerText.replace('.', ',');
        const arvores = document.getElementById('arvoresVal').innerText;
        const km = document.getElementById('kmVal').innerText;
        const garrafas = document.getElementById('garrafasVal').innerText;

        const metodologiaFisico = dbData.metodologiaFisico || "Não especificada";
        const metodologiaDigital = dbData.metodologiaDigital || "Não especificada";

        const dataAtual = new Date().toLocaleString('pt-BR');

        let csv = '\uFEFF';
        csv += "RELATÓRIO EXECUTIVO DE IMPACTO ESG - EDENRED\n";
        csv += `Data da Geração:;${dataAtual}\n`;
        csv += `Status da Simulação:;${tipoSimulacao}\n\n`;

        csv += "DADOS DA EMPRESA ANALISADA\n";
        csv += `Razão Social:;${nomeEmpresa}\n`;
        csv += `CNPJ:;${cnpjTexto}\n`;
        csv += `E-mail Corporativo:;${emailTexto}\n`;
        csv += `Volume de Transações Analisado:;${volumeTexto}\n`;
        csv += `Percentual de Migração Simulado:;${percentualMigracao}%\n\n`;

        csv += "RESULTADOS DE IMPACTO (CO2 E EQUIVALÊNCIAS)\n";
        csv += "Métrica;Valor\n";
        csv += `Emissões de CO2 Evitadas (kg);${co2}\n`;
        csv += `Equivalência em Árvores Plantadas;${arvores}\n`;
        csv += `Km Evitados em Veículos a Combustão;${km}\n`;
        csv += `Redução de Garrafas PET;${garrafas}\n\n`;

        csv += "NOTA TÉCNICA E METODOLOGIA\n";
        csv += "Cálculo comparativo baseado nos Fatores de Emissão de Transações Físicas versus Transações Digitais.\n";
        csv += `Metodologia Transação Física:;${metodologiaFisico}\n`;
        csv += `Metodologia Transação Digital:;${metodologiaDigital}\n`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        const nomeArquivoSeguro = nomeEmpresa.replace(/[^a-zA-Z0-9]/g, '_');
        link.setAttribute("download", `Dados_Cálculo_${nomeArquivoSeguro}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        alert("Erro ao conectar com o banco de dados para gerar o CSV.");
        console.error(error);
    }
}