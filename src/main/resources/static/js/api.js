import { API_BASE_URL } from './config.js';

/**
 * Cadastra uma empresa/simulação no banco de dados.
 * @param {Object} payload Dados da simulação (nomeEmpresa, cnpj, email, transacoes)
 * @returns {Promise<Object>} Resposta em JSON do backend contendo os dados processados
 */
export async function cadastrarEmpresa(payload) {
    const res = await fetch(`${API_BASE_URL}/empresas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.erro || "Erro ao processar simulação.");
    }
    return res.json();
}

/**
 * Busca a matemática e os resultados do cálculo de impacto.
 * @param {number} idResultado ID do resultado gerado
 * @returns {Promise<Object>} Resposta em JSON com o impacto físico/digital e as equivalências
 */
export async function buscarImpacto(idResultado) {
    const res = await fetch(`${API_BASE_URL}/empresas/${idResultado}/impacto`);
    if (!res.ok) {
        throw new Error("Erro ao recuperar a matemática do cálculo.");
    }
    return res.json();
}

/**
 * Carrega a lista completa de simulações cadastradas.
 * @returns {Promise<Array>} Lista de empresas/simulações
 */
export async function obterHistoricoEmpresas() {
    const res = await fetch(`${API_BASE_URL}/empresas`);
    if (!res.ok) {
        throw new Error("Falha ao buscar histórico de simulações.");
    }
    return res.json();
}

/**
 * Cadastra um novo fator de emissão ativo para cálculos futuros.
 * @param {Object} payload Fator de emissão (tipo, valor, fonteMetodologia)
 * @returns {Promise<Object>} Fator salvo
 */
export async function salvarFator(payload) {
    const res = await fetch(`${API_BASE_URL}/fatores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.erro || JSON.stringify(err));
    }
    return res.json();
}

/**
 * Obtém a lista e o histórico completo de fatores cadastrados.
 * @returns {Promise<Array>} Lista de fatores
 */
export async function obterFatores() {
    const res = await fetch(`${API_BASE_URL}/fatores`);
    if (!res.ok) {
        throw new Error("Falha ao carregar fatores de emissão.");
    }
    return res.json();
}
