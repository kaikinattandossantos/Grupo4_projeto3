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
                exibirResultados(dataCalculo);
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

function exibirResultados(data) {
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