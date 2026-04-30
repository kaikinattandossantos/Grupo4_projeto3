Chart.register(ChartDataLabels);
let chartInstance = null;

async function realizarAnalise() {
    const razao = document.getElementById('razaoSocialInput').value;
    const cnpj = document.getElementById('cnpjInput').value;
    const email = document.getElementById('emailInput').value;
    const volume = document.getElementById('transacoesInput').value;

    if (cnpj.length !== 14) {
        alert("O CNPJ precisa de ter exatamente 14 números!");
        return;
    }

    const payload = {
        razaoSocial: razao,
        cnpj: cnpj,
        email: email,
        transacoes: parseInt(volume)
    };

    try {
        const responseCadastro = await fetch('http://localhost:8081/api/empresas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (responseCadastro.ok) {
            const empresaSalva = await responseCadastro.json();
            const idGerado = empresaSalva.id;

            const responseCalculo = await fetch(`http://localhost:8081/api/calcular-impacto/${idGerado}`);

            if (responseCalculo.ok) {
                const dataCalculo = await responseCalculo.json();
                exibirResultados(dataCalculo, razao);
                document.getElementById('msgErro').style.display = "none";
            } else {
                exibirErro("Erro ao realizar o cálculo para esta empresa.");
            }
        } else {
            const erroBackend = await responseCadastro.json();
            exibirErro(erroBackend.erro || "Erro ao cadastrar empresa.");
        }
    } catch (err) {
        alert("Servidor Offline ou Erro de Rede!");
    }
}

function exibirErro(mensagem) {
    const display = document.getElementById('msgErro');
    display.innerText = "⚠️ " + mensagem;
    display.style.display = "block";
}

function exibirResultados(data, nomeEmpresa) {
    document.getElementById('nomeEmpresaRelatorio').innerText = nomeEmpresa || "Empresa Não Identificada";
    
    const section = document.getElementById('resultsSection');
    section.classList.replace('results-hidden', 'results-visible');
    
    document.getElementById('co2EvitadoVal').innerText = data.co2Evitado.toFixed(2);
    
    const arvores = data.arvoresEquivalentes;
    document.getElementById('arvoresVal').innerText = arvores % 1 === 0 ? arvores : arvores.toFixed(1);
    
    document.getElementById('kmVal').innerText = Math.floor(data.kmEvitados).toLocaleString('pt-BR');
    document.getElementById('garrafasVal').innerText = Math.floor(data.garrafasPetEvitadas).toLocaleString('pt-BR');

    atualizarGrafico(data.impactoFisico, data.impactoDigital);
}

function atualizarGrafico(fisico, digital) {
    const ctx = document.getElementById('impactChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    const gradFisico = ctx.createLinearGradient(0, 0, 0, 300);
    gradFisico.addColorStop(0, 'rgba(226, 0, 26, 1)');
    gradFisico.addColorStop(1, 'rgba(226, 0, 26, 0.1)');

    const gradDigital = ctx.createLinearGradient(0, 0, 0, 300);
    gradDigital.addColorStop(0, 'rgba(32, 201, 151, 1)');
    gradDigital.addColorStop(1, 'rgba(32, 201, 151, 0.1)');

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Transação Física', 'Transação Digital'],
            datasets: [{
                data: [fisico, digital],
                backgroundColor: [gradFisico, gradDigital],
                borderColor: ['#E2001A', '#20c997'],
                borderWidth: 1,
                borderRadius: { topLeft: 8, topRight: 8 },
                barPercentage: 0.5
            }]
        },
        options: {
            devicePixelRatio: 3,
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 30 }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Comparativo de Emissão (kg CO₂)',
                    color: '#ffffff',
                    font: { size: 16, weight: 'bold', family: 'Segoe UI' },
                    padding: { bottom: 5 }
                },
                subtitle: {
                    display: true,
                    text: 'A via digital reduz o impacto ambiental em quase 96%',
                    color: '#a0a0a0',
                    font: { size: 13, style: 'italic' },
                    padding: { bottom: 25 }
                },
                datalabels: {
                    color: '#ffffff',
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value.toFixed(4) + ' kg',
                    font: { weight: 'bold', size: 13 }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 17, 17, 0.9)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 14, weight: 'bold' },
                    padding: 15,
                    borderColor: '#333',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: (context) => `Emissão: ${context.raw.toFixed(5)} kg`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { 
                        color: 'rgba(255, 255, 255, 0.05)',
                        borderDash: [5, 5]
                    },
                    ticks: { color: '#666', padding: 10 },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#ccc', font: { size: 13, weight: '600' } },
                    border: { display: false }
                }
            }
        }
    });
}

function abrirModalHistorico() {
    document.getElementById('modalHistorico').style.display = "block";
    carregarHistorico();
}

function fecharModalHistorico() {
    document.getElementById('modalHistorico').style.display = "none";
}

// Fechamento de modais clicando fora
window.onclick = function(event) {
    const modalHist = document.getElementById('modalHistorico');
    const modalAdmin = document.getElementById('modalAdmin');
    if (event.target === modalHist) {
        fecharModalHistorico();
    }
    if (event.target === modalAdmin) {
        fecharModalAdmin();
    }
}

async function carregarHistorico() {
    const corpo = document.getElementById('corpoHistorico');
    corpo.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #888;">Carregando histórico...</td></tr>';

    try {
        const res = await fetch('http://localhost:8081/api/empresas');
        if (!res.ok) throw new Error("Falha na API");
        const empresas = await res.json();
        
        corpo.innerHTML = '';
        
        if (empresas.length === 0) {
            corpo.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #888;">Nenhuma análise realizada ainda.</td></tr>';
            return;
        }

        empresas.forEach(emp => {
            const dataFormatada = new Date(emp.criadoEm).toLocaleDateString('pt-BR');
            const nomeCodificado = encodeURIComponent(emp.razaoSocial);

            corpo.innerHTML += `
                <tr>
                    <td>${emp.razaoSocial}</td>
                    <td>${emp.cnpj}</td>
                    <td>${dataFormatada}</td>
                    <td><button class="btn-view" onclick="revisualizar(${emp.id}, '${nomeCodificado}')">VER</button></td>
                </tr>
            `;
        });
    } catch (err) {
        corpo.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ff4444;">Erro ao carregar histórico.</td></tr>';
    }
}

async function revisualizar(id, nomeCodificado) {
    try {
        const res = await fetch(`http://localhost:8081/api/calcular-impacto/${id}`);
        if (!res.ok) throw new Error("Falha na simulação");
        
        const data = await res.json();
        fecharModalHistorico();
        exibirResultados(data, decodeURIComponent(nomeCodificado));
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        alert("Erro ao recuperar os dados dessa simulação.");
    }
}

function gerarRelatorio() {
    window.print();
}


function abrirModalAdmin() {
    document.getElementById('modalAdmin').style.display = "block";
    carregarHistoricoFatores();
}

function fecharModalAdmin() {
    document.getElementById('modalAdmin').style.display = "none";
}

async function salvarNovoFator() {
    const tipo = document.getElementById('fatorTipo').value;
    const valor = parseFloat(document.getElementById('fatorValor').value);
    const fonte = document.getElementById('fatorFonte').value;

    if (!valor || !fonte) {
        alert("Preencha todos os campos do fator!");
        return;
    }

    const payload = { tipo: tipo, valor: valor, fonteMetodologia: fonte };

    try {
        const response = await fetch('http://localhost:8081/api/fatores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Novo fator de emissão registrado com sucesso! O anterior foi arquivado.");
            document.getElementById('fatorValor').value = '';
            document.getElementById('fatorFonte').value = '';
            carregarHistoricoFatores(); // Recarrega a tabela
        } else {
            const erro = await response.json();
            alert("Erro ao salvar: " + JSON.stringify(erro));
        }
    } catch (err) {
        alert("Erro de conexão com o servidor.");
    }
}

async function carregarHistoricoFatores() {
    const tbody = document.getElementById('corpoTabelaFatores');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Carregando...</td></tr>';

    try {
        const response = await fetch('http://localhost:8081/api/fatores');
        if (!response.ok) throw new Error("Falha ao buscar fatores");
        
        const fatores = await response.json();
        tbody.innerHTML = '';

        if(fatores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum fator cadastrado.</td></tr>';
            return;
        }

        fatores.forEach(f => {
            const data = new Date(f.dataVigencia).toLocaleString('pt-BR');
            const badgeAtivo = f.ativo 
                ? '<span style="background: #28a745; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">ATIVO</span>' 
                : '<span style="background: #666; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">OBSOLETO</span>';

            tbody.innerHTML += `
                <tr>
                    <td>${f.tipo}</td>
                    <td style="font-weight: bold;">${f.valor}</td>
                    <td>${f.fonteMetodologia}</td>
                    <td>${data}</td>
                    <td>${badgeAtivo}</td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Erro ao carregar dados.</td></tr>';
    }
}