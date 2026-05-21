import { atualizarGrafico } from './chart.js';

let simulacaoAtiva = null;

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


export function exibirResultados(data, nomeEmpresa, isAnonimo, dadosEntrada = null) {
    const tituloRelatorio = document.getElementById('nomeEmpresaRelatorio');
    if (!tituloRelatorio) return;

    if (isAnonimo || !nomeEmpresa) {
        tituloRelatorio.innerText = "Simulação Expressa (Não Identificada)";
        tituloRelatorio.classList.add('titulo-anonimo');
    } else {
        tituloRelatorio.innerText = nomeEmpresa;
        tituloRelatorio.classList.remove('titulo-anonimo');
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

    atualizarGrafico(data.impactoFisico, data.impactoDigital);

    simulacaoAtiva = {
        nome: isAnonimo ? "Simulacao_Expressa" : (nomeEmpresa || "Empresa_Nao_Identificada"),
        cnpj: dadosEntrada?.cnpj || document.getElementById('cnpjInput')?.value.trim() || "Não informado",
        email: dadosEntrada?.email || document.getElementById('emailInput')?.value.trim() || "Não informado",
        transacoes: dadosEntrada?.transacoes || document.getElementById('transacoesInput')?.value.trim() || "Não informado",
        isAnonimo: isAnonimo
    };

    setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

export function baixarRelatorioCSV() {
    if (!simulacaoAtiva) {
        alert("Realize ou abra uma simulação antes de exportar.");
        return;
    }

    const co2 = document.getElementById('co2EvitadoVal') ? document.getElementById('co2EvitadoVal').innerText.replace('.', ',') : "0";
    const arvores = document.getElementById('arvoresVal') ? document.getElementById('arvoresVal').innerText : "0";
    const km = document.getElementById('kmVal') ? document.getElementById('kmVal').innerText : "0";
    const garrafas = document.getElementById('garrafasVal') ? document.getElementById('garrafasVal').innerText : "0";
    
    const metFisicoEl = document.getElementById('fonteMetodologiaFisico');
    const metodologiaFisico = metFisicoEl ? metFisicoEl.innerText.replace('Fonte/Metodologia: ', '').trim() : "Não especificada";
    
    const metDigitalEl = document.getElementById('fonteMetodologiaDigital');
    const metodologiaDigital = metDigitalEl ? metDigitalEl.innerText.replace('Fonte/Metodologia: ', '').trim() : "Não especificada";

    const { nome, cnpj, email, transacoes, isAnonimo } = simulacaoAtiva;
    const nomeAmigavel = isAnonimo ? "Simulação Expressa (Não Identificada)" : nome;
    const status = isAnonimo ? "Expressa (Anônima)" : "Completa (Identificada)";
    const dataAtual = new Date().toLocaleString('pt-BR');

    let csv = '\uFEFF';
    csv += "RELATÓRIO EXECUTIVO DE IMPACTO ESG - EDENRED\n";
    csv += `Data da Geração:;${dataAtual}\n`;
    csv += `Status da Simulação:;${status}\n\n`;

    csv += "DADOS DA EMPRESA ANALISADA\n";
    csv += `Razão Social:;${nomeAmigavel}\n`;
    csv += `CNPJ:;${cnpj}\n`;
    csv += `E-mail Corporativo:;${email}\n`;
    csv += `Volume de Transações Analisado:;${transacoes}\n\n`;

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
    link.setAttribute("download", `Relatorio_Personalizado_ESG_${nome.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}