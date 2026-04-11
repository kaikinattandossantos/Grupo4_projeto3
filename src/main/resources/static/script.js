let chartInstance = null;

async function realizarAnalise() {
    const fields = {
        razao: document.getElementById('razaoSocialInput').value,
        cnpj: document.getElementById('cnpjInput').value,
        email: document.getElementById('emailInput').value,
        volume: document.getElementById('transacoesInput').value
    };

    if (fields.cnpj.length !== 14) {
        alert("O CNPJ precisa ter exatamente 14 números!");
        return;
    }

    const payload = {
        razaoSocial: fields.razao,
        cnpj: fields.cnpj,
        email: fields.email,
        transacoes: parseInt(fields.volume)
    };

    try {
        const response = await fetch('http://localhost:8081/api/calcular-impacto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            exibirResultados(data);
            document.getElementById('msgErro').style.display = "none"; 
        } else {
            const erroBackend = await response.json();
            const display = document.getElementById('msgErro');
            display.innerText = "⚠️ " + (erroBackend.erro || "Erro no processamento"); 
            display.style.display = "block";
        }
    } catch (err) {
        console.error(err);
        alert("Servidor Offline! Verifique se o backend Spring Boot está rodando.");
    }
}

function exibirResultados(data) {
    const section = document.getElementById('resultsSection');
    section.classList.replace('results-hidden', 'results-visible');

    const co2 = data.co2Evitado;
    document.getElementById('co2EvitadoVal').innerText = co2.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    const arvores = data.arvores || (co2 / 15);
    const km = data.distanciaKm || (co2 / 0.12);
    
    const volume = parseInt(document.getElementById('transacoesInput').value);
    const garrafas = data.garrafasPet || (volume * 0.005 * 50);

    document.getElementById('arvoresVal').innerText = arvores.toFixed(1);
    document.getElementById('kmVal').innerText = Math.floor(km).toLocaleString('pt-BR');
    document.getElementById('garrafasVal').innerText = Math.floor(garrafas).toLocaleString('pt-BR');

    atualizarGrafico(data.impactoFisico, data.impactoDigital);
}

function atualizarGrafico(fisico, digital) {
    const ctx = document.getElementById('impactChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Emissão Física', 'Emissão Digital'],
            datasets: [{
                label: 'kg CO₂',
                data: [fisico, digital],
                backgroundColor: ['#E2001A', '#28a745'],
                borderRadius: 8,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => ` ${context.raw.toFixed(5)} kg CO₂`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#888' }
                },
                x: {
                    ticks: { color: '#fff' }
                }
            }
        }
    });
}