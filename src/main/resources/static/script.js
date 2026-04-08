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