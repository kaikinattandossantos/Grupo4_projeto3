let impactChart;

export function initChart() {
    const ctx = document.getElementById('impactChart');
    if (!ctx) return;

    impactChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['100% Físico', 'Cenário Híbrido', '100% Digital'], // 3 Barras
            datasets: [{
                label: 'Emissões (kg CO₂)',
                data: [0, 0, 0],
                backgroundColor: [
                    '#e63946', 
                    '#f4a261', 
                    '#2a9d8f'  
                ],
                borderRadius: 6,
                barThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => value.toFixed(4) + ' kg',
                    font: { weight: 'bold', size: 11 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [5, 5] },
                    title: { display: true, text: 'kg CO₂' }
                },
                x: {
                    grid: { display: false }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

export function atualizarGrafico(fisico, hibrido, digital) {
    if (!impactChart) {
        initChart();
    }
    if (impactChart) {
        impactChart.data.datasets[0].data = [fisico, hibrido, digital];
        impactChart.update();
    }
}