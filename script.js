let chartInstance = null;

async function realizarAnalise() {
    const volume = document.getElementById('transacoesInput').value;
    
    if (!volume) return;

    try {
        const response = await fetch('http://localhost:8081/api/calcular-impacto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transacoes: parseInt(volume) })
        });

        if (response.ok) {
            const data = await response.json();
            exibirResultados(data);
        }
    } catch (err) {
        console.error("Falha na conexão com o backend.");
    }
}

function exibirResultados(data) {
    const section = document.getElementById('resultsSection');
    section.classList.replace('results-hidden', 'results-visible');

    document.getElementById('co2EvitadoVal').innerText = data.co2Evitado.toFixed(5);

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
                data: [fisico, digital],
                backgroundColor: ['#E2001A', '#28a745'],
                borderRadius: 6,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#222' },
                    ticks: { color: '#666' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#aaa' }
                }
            }
        }
    });
}