let chartInstance = null;

async function realizarAnalise() {
    const razao = document.getElementById('razaoSocialInput').value;
    const cnpj = document.getElementById('cnpjInput').value;
    const email = document.getElementById('emailInput').value;
    const volume = document.getElementById('transacoesInput').value;

    if (cnpj.length !== 14) {
        alert("O CNPJ precisa ter exatamente 14 números!");
        return;
    }

    const payload = {
        razaoSocial: razao,
        cnpj: cnpj,
        email: email,
        transacoes: parseInt(volume)
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
            display.innerText = "⚠️ " + erroBackend.erro; 
            display.style.display = "block";
        }
    } catch (err) {
        alert("Servidor Offline!");
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
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Físico', 'Digital'],
            datasets: [{
                data: [fisico, digital],
                backgroundColor: ['#E2001A', '#28a745'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#222' } } }
        }
    });
}