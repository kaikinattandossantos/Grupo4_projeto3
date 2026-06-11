import { useState, useEffect, useLayoutEffect } from 'react';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Slider } from './components/Slider';
import { MetricCard } from './components/MetricCard';

interface CalculoRequest {
  nomeEmpresa: string;
  cnpj: string;
  email: string;
  transacoes: number;
  percentualMigracao: number;
}

interface CalculoResponse {
  id: number;
  qtdTransacoes: number;
  percentualMigracao: number;
  impactoFisico: number;
  impactoDigital: number;
  impactoHibrido: number;
  co2Evitado: number;
  arvoresEquivalentes: number;
  kmEvitados: number;
  garrafasPetEvitadas: number;
  metodologiaFisico?: string;
  metodologiaDigital?: string;
  empresa?: {
    id?: number;
    nomeEmpresa: string;
    cnpj: string;
    email: string;
  };
  dataCalculo?: string;
}

interface FatorEmissao {
  id: number;
  tipo: 'FISICA' | 'DIGITAL';
  valor: number;
  fonteMetodologia: string;
  dataVigencia: string;
  ativo: boolean;
}

function App() {
  // Navigation / View State
  const [showCalculator, setShowCalculator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const scrollToSection = (id: string) => {
    setShowCalculator(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Calculator Form State
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');

  const formatarCnpj = (valor: string) => {
    const nums = valor.replace(/\D/g, '').slice(0, 14);
    return nums
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };
  const [email, setEmail] = useState('');
  const [transacoes, setTransacoes] = useState<number | ''>('');
  const [percentualMigracao, setPercentualMigracao] = useState(100);
  const [formError, setFormError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Result State
  const [resultado, setResultado] = useState<CalculoResponse | null>(null);

  // Data Lists State
  const [historico, setHistorico] = useState<CalculoResponse[]>([]);
  const [fatores, setFatores] = useState<FatorEmissao[]>([]);
  const [filtroBusca, setFiltroBusca] = useState('');

  // Admin Form State
  const [novoFatorTipo, setNovoFatorTipo] = useState<'FISICA' | 'DIGITAL'>('FISICA');
  const [novoFatorValor, setNovoFatorValor] = useState<number | ''>('');
  const [novoFatorFonte, setNovoFatorFonte] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [isSavingFator, setIsSavingFator] = useState(false);

  // Synchronous scroll restoration before paint
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedScrollY = localStorage.getItem('scroll_position');
    if (savedScrollY !== null) {
      window.scrollTo(0, Number(savedScrollY));
    }
  }, []);

  // Fetch History and Factors on load, and restore states
  useEffect(() => {
    carregarHistorico();
    carregarFatores();

    // Restore showCalculator
    const savedShowCalc = localStorage.getItem('show_calculator');
    if (savedShowCalc !== null) {
      setShowCalculator(JSON.parse(savedShowCalc));
    }

    // Restore resultado
    const savedResultado = localStorage.getItem('resultado_simulacao');
    if (savedResultado !== null) {
      setResultado(JSON.parse(savedResultado));
    }

    // Scroll listener to save position
    const handleScroll = () => {
      localStorage.setItem('scroll_position', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('show_calculator', JSON.stringify(showCalculator));
  }, [showCalculator]);

  useEffect(() => {
    if (resultado) {
      localStorage.setItem('resultado_simulacao', JSON.stringify(resultado));
    } else {
      localStorage.removeItem('resultado_simulacao');
    }
  }, [resultado]);

  const carregarHistorico = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/empresas');
      if (response.ok) {
        const data = await response.json();
        // The backend returns a list of maps, let's map them to our interface
        const mappedData = data.map((item: any) => ({
          id: item.id,
          empresa: {
            nomeEmpresa: item.razaoSocial || 'Empresa Sem Nome',
            cnpj: item.cnpj || 'Não Informado',
            email: ''
          },
          qtdTransacoes: 0,
          percentualMigracao: 0,
          impactoFisico: 0,
          impactoDigital: 0,
          impactoHibrido: 0,
          co2Evitado: 0,
          arvoresEquivalentes: 0,
          kmEvitados: 0,
          garrafasPetEvitadas: 0,
          dataCalculo: item.criadoEm || new Date().toLocaleDateString()
        }));
        setHistorico(mappedData);
      }
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    }
  };

  const carregarFatores = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/fatores');
      if (response.ok) {
        const data = await response.json();
        setFatores(data);
      }
    } catch (err) {
      console.error('Erro ao carregar fatores:', err);
    }
  };

  const handleCalcular = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setResultado(null);

    if (!transacoes || Number(transacoes) <= 0) {
      setFormError('O volume de transações é obrigatório e deve ser maior que 0.');
      return;
    }

    setIsCalculating(true);

    const payload: CalculoRequest = {
      nomeEmpresa: nomeEmpresa.trim() || 'Empresa Simulada',
      cnpj: cnpj.replace(/\D/g, ''),
      email: email.trim(),
      transacoes: Number(transacoes),
      percentualMigracao: percentualMigracao
    };

    try {
      const postResponse = await fetch('http://localhost:8081/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!postResponse.ok) {
        const errData = await postResponse.json();
        throw new Error(errData.erro || 'Erro ao processar simulação.');
      }

      const postData = await postResponse.json(); // Gets { id, empresaId, anonimo }

      // Immediately fetch full calculation details using details endpoint
      const detailsResponse = await fetch(`http://localhost:8081/api/empresas/${postData.id}/impacto`);
      if (!detailsResponse.ok) {
        throw new Error('Falha ao recuperar os detalhes do cálculo gerado.');
      }

      const detailsData = await detailsResponse.json();
      setResultado(detailsData);
      carregarHistorico(); // Refresh list
    } catch (err: any) {
      setFormError(err.message || 'Falha na comunicação com o servidor backend.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSalvarFator = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!novoFatorValor || Number(novoFatorValor) <= 0) {
      setAdminError('O valor do fator deve ser maior que zero.');
      return;
    }

    if (!novoFatorFonte.trim()) {
      setAdminError('A fonte/metodologia é obrigatória.');
      return;
    }

    setIsSavingFator(true);

    const payload = {
      tipo: novoFatorTipo,
      valor: Number(novoFatorValor),
      fonteMetodologia: novoFatorFonte.trim()
    };

    try {
      const response = await fetch('http://localhost:8081/api/fatores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.erro || 'Erro ao cadastrar fator.');
      }

      setAdminSuccess('Fator de emissão salvo com sucesso!');
      setNovoFatorValor('');
      setNovoFatorFonte('');
      carregarFatores(); // Refresh list
    } catch (err: any) {
      setAdminError(err.message || 'Falha na rede ao salvar fator.');
    } finally {
      setIsSavingFator(false);
    }
  };

  const handleVerImpactoDoHistorico = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/empresas/${id}/impacto`);
      if (response.ok) {
        const data = await response.json();
        setResultado(data);
        setShowHistory(false);
        setShowCalculator(true);
        setTimeout(() => {
          window.scrollTo({ top: 50, behavior: 'smooth' });
        }, 80);
      }
    } catch (err) {
      console.error('Erro ao carregar impacto do histórico:', err);
    }
  };

  // Exportação de Dados em CSV 
  const handleExportarCSV = () => {
    if (!resultado) {
      alert('Nenhuma simulação ativa para exportar.');
      return;
    }

    const nomeEmpresa = resultado.empresa?.nomeEmpresa || 'Empresa Não Identificada';
    const cnpjTexto   = resultado.empresa?.cnpj        || 'Não informado';
    const emailTexto  = resultado.empresa?.email       || 'Não informado';
    const dataAtual   = new Date().toLocaleString('pt-BR');

    let csv = '\uFEFF'; // BOM UTF-8 para o Excel reconhecer acentos
    csv += 'RELATÓRIO EXECUTIVO DE IMPACTO ESG - EDENRED\n';
    csv += `Data da Geração:;${dataAtual}\n\n`;

    csv += 'DADOS DA EMPRESA ANALISADA\n';
    csv += `Razão Social:;${nomeEmpresa}\n`;
    csv += `CNPJ:;${cnpjTexto}\n`;
    csv += `E-mail Corporativo:;${emailTexto}\n`;
    csv += `Volume de Transações Analisado:;${resultado.qtdTransacoes ?? 'Não informado'}\n`;
    csv += `Percentual de Migração Simulado:;${resultado.percentualMigracao ?? 100}%\n\n`;

    csv += 'RESULTADOS DE IMPACTO (CO2 E EQUIVALÊNCIAS)\n';
    csv += 'Métrica;Valor\n';
    csv += `Emissões de CO2 Evitadas (kg);${(resultado.co2Evitado || 0).toFixed(2).replace('.', ',')}\n`;
    csv += `Equivalência em Árvores Plantadas;${Math.round(resultado.arvoresEquivalentes || 0).toLocaleString('pt-BR')}\n`;
    csv += `Km Evitados em Veículos a Combustão;${Math.round(resultado.kmEvitados || 0).toLocaleString('pt-BR')}\n`;
    csv += `Redução de Garrafas PET;${Math.round(resultado.garrafasPetEvitadas || 0).toLocaleString('pt-BR')}\n\n`;

    csv += 'NOTA TÉCNICA E METODOLOGIA\n';
    csv += `Metodologia Transação Física:;${resultado.metodologiaFisico || 'Não especificada'}\n`;
    csv += `Metodologia Transação Digital:;${resultado.metodologiaDigital || 'Não especificada'}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href  = url;
    const nomeSeguro = nomeEmpresa.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `Dados_Calculo_${nomeSeguro}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Gerar Relatório PDF
  const handleGerarRelatorio = () => {
    if (!resultado) {
      alert('Nenhuma simulação ativa para gerar relatório.');
      return;
    }
    window.print();
  };

  const filtrarSimulacoes = historico.filter(item =>
    (item.empresa?.nomeEmpresa || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
    (item.empresa?.cnpj && item.empresa.cnpj.includes(filtroBusca))
  );

  return (
    <div className="font-sans antialiased text-text-main bg-zinc-100 min-h-screen flex flex-col justify-start items-center">

      {/* HEADER NAVBAR */}
      <header className="w-full bg-white/95 border-b border-black/10 fixed top-0 left-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-20 px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowCalculator(false)}>
            <div className="p-2 bg-primary-red rounded-[5px] flex flex-col justify-start items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.0002 20C9.24428 20.0053 7.55048 19.3505 6.25474 18.1654C4.959 16.9803 4.15599 15.3515 4.00496 13.6021C3.85393 11.8527 4.36591 10.1104 5.43937 8.72074C6.51283 7.33112 8.06935 6.3957 9.80022 6.1C15.5002 5 17.0002 4.48 19.0002 2C20.0002 4 21.0002 6.18 21.0002 10C21.0002 15.5 16.2202 20 11.0002 20Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 21C2 18 3.85 15.64 7.08 15C9.5 14.52 12 13 13 12" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-black text-xl font-bold leading-7">GreenPay Impact</span>
              <span className="text-neutral-700 text-xs font-normal leading-4">by Edenred</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => { setShowCalculator(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-black text-sm font-semibold hover:text-primary-red transition-all cursor-pointer">Início</button>
            <button onClick={() => scrollToSection('sobre')} className="text-black text-sm font-semibold hover:text-primary-red transition-all cursor-pointer">Sobre</button>
            <button onClick={() => scrollToSection('solucao')} className="text-black text-sm font-semibold hover:text-primary-red transition-all cursor-pointer">Solução</button>
            <button onClick={() => scrollToSection('beneficios')} className="text-black text-sm font-semibold hover:text-primary-red transition-all cursor-pointer">Benefícios</button>
            <Button
              variant="primary"
              className="w-auto h-11 px-6 bg-primary-red rounded-[5px] shadow-md hover:shadow-lg text-sm font-semibold"
              onClick={() => setShowCalculator(true)}
            >
              Acessar Plataforma
            </Button>
          </nav>
        </div>
      </header>

      {/* RENDER CALCULATOR VIEW OR LANDING PAGE */}
      {showCalculator ? (
        <main className="w-full pt-32 pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowCalculator(false)}
              className="text-text-muted hover:text-text-main font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left" /> Voltar para Home
            </button>
            <div className="flex gap-3">
              <Button variant="secondary" className="w-auto py-2 px-4 text-xs" onClick={() => setShowHistory(true)}>
                <i className="fa-solid fa-history" /> Ver Histórico
              </Button>
              <Button variant="secondary" className="w-auto py-2 px-4 text-xs border-amber-500 text-amber-600 hover:bg-amber-50" onClick={() => setShowAdmin(true)}>
                <i className="fa-solid fa-cog" /> Painel Admin
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Input Form Column */}
            <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-text-light/20 flex flex-col gap-6">
              <h2 className="text-lg font-bold text-text-main border-b border-text-light/10 pb-3 flex items-center gap-2">
                <i className="fa-solid fa-calculator text-primary-red" /> Nova Simulação
              </h2>
              <form onSubmit={handleCalcular} className="flex flex-col gap-5">
                <Input
                  id="calc-nome"
                  label="Nome Fantasia / Razão Social"
                  helperText="Opcional"
                  placeholder="Ex: Empresa Exemplo"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                />
                <Input
                  id="calc-cnpj"
                  label="CNPJ"
                  helperText="Opcional"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  value={cnpj}
                  onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
                />
                <Input
                  id="calc-email"
                  label="E-mail de Contato"
                  helperText="Opcional"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  id="calc-transacoes"
                  label="Volume de Transações Anuais"
                  type="number"
                  placeholder="Ex: 500000"
                  required
                  value={transacoes}
                  onChange={(e) => setTransacoes(e.target.value === '' ? '' : Number(e.target.value))}
                />
                <Slider
                  label="Percentual de Migração para o Digital"
                  value={percentualMigracao}
                  onChange={setPercentualMigracao}
                />

                {formError && (
                  <p className="text-sm font-semibold text-primary-red bg-primary-red-light p-3 rounded-lg flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation" /> {formError}
                  </p>
                )}

                <Button type="submit" isLoading={isCalculating}>
                  Gerar Cálculo de Impacto
                </Button>
              </form>
            </section>

            {/* Results Column */}
            <section id="results-dashboard" className="lg:col-span-3 flex flex-col gap-6">
              {resultado ? (
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-text-light/20 flex flex-col gap-6 animate-fade-in">
                  <div className="border-b border-text-light/10 pb-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Relatório gerado para:</p>
                    <h2 className="text-2xl font-bold text-text-main mt-1">{resultado.empresa?.nomeEmpresa || 'Empresa Simulada'}</h2>
                    <p className="text-xs text-text-muted mt-1">
                      Cenário: <span className="font-bold text-accent-green">{resultado.percentualMigracao}%</span> de transações migradas para o digital.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-accent-green-light to-accent-green-light/40 p-5 rounded-xl border border-accent-green-light flex flex-col justify-between items-center gap-2 text-center">
                    <span className="text-xs font-bold text-accent-green uppercase tracking-wider">CO₂ Evitado Estimado</span>
                    <h2 className="text-4xl font-extrabold text-accent-green">{(resultado.co2Evitado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <small className="text-xs text-text-muted font-medium">kg por ano</small>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MetricCard
                      value={Math.round(resultado.arvoresEquivalentes || 0).toLocaleString('pt-BR')}
                      title="Árvores"
                      description="Cultivo anual purificando a atmosfera."
                      iconClass="fa-solid fa-tree"
                      glowColor="green"
                    />
                    <MetricCard
                      value={Math.round(resultado.kmEvitados || 0).toLocaleString('pt-BR')}
                      title="Km Evitados"
                      description="Km não rodados em carro a combustão."
                      iconClass="fa-solid fa-car-side"
                      glowColor="blue"
                    />
                    <MetricCard
                      value={Math.round(resultado.garrafasPetEvitadas || 0).toLocaleString('pt-BR')}
                      title="PET a menos"
                      description="Redução de garrafas nos oceanos e aterros."
                      iconClass="fa-solid fa-bottle-water"
                      glowColor="teal"
                    />
                  </div>

                  {/* SVG Chart Comparison */}
                  <div className="border border-text-light/20 p-5 rounded-xl bg-bg-hover flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
                      <i className="fa-solid fa-chart-bar text-accent-blue" /> Comparação de Emissões (kg CO₂e)
                    </h3>
                    <div className="flex flex-col gap-4 py-2">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Física (Sem Migração)</span>
                          <span>{(resultado.impactoFisico || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg</span>
                        </div>
                        <div className="w-full bg-text-light/30 h-4 rounded-full overflow-hidden">
                          <div className="bg-primary-red h-full rounded-full transition-all duration-1000" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Digital (Com Migração)</span>
                          <span>{(resultado.impactoDigital || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kg</span>
                        </div>
                        <div className="w-full bg-text-light/30 h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-accent-green h-full rounded-full transition-all duration-1000"
                            style={{ width: `${resultado.impactoFisico ? Math.max(10, Math.min(100, ((resultado.impactoDigital || 0) / resultado.impactoFisico) * 100)) : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exportação*/}
                  <div className="border-t border-text-light/10 pt-8 flex flex-col sm:flex-row gap-3">
                    {/* Relatório PDF */}
                    <button
                      onClick={handleGerarRelatorio}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary-red hover:bg-primary-red-hover text-white text-sm font-bold shadow-md transition-all duration-300 cursor-pointer"
                    >
                      <i className="fa-solid fa-file-pdf" aria-hidden="true" />
                      Gerar Relatório Executivo (PDF)
                    </button>

                    {/* Exportar CSV */}
                    <button
                      onClick={handleExportarCSV}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-accent-green hover:opacity-90 text-white text-sm font-bold shadow-md transition-all duration-300 cursor-pointer"
                    >
                      <i className="fa-solid fa-file-csv" aria-hidden="true" />
                      Baixar Dados Brutos (CSV)
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-text-light/20 flex flex-col items-center justify-center text-center gap-4 text-text-muted">
                  <div className="w-16 h-16 rounded-full bg-bg-page flex items-center justify-center text-2xl text-text-light">
                    <i className="fa-solid fa-chart-line" />
                  </div>
                  <h3 className="text-lg font-bold text-text-main">Aguardando Parâmetros</h3>
                  <p className="text-sm max-w-xs leading-relaxed">
                    Insira as informações da sua empresa no painel ao lado e clique em <strong>Gerar Cálculo</strong> para ver os resultados.
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      ) : (
        /* LANDING PAGE FROM FIGMA DESIGN */
        <div className="w-full pt-20 flex flex-col justify-start items-start">

          {/* HERO BANNER SECTION */}
          <section className="relative w-full h-[700px] md:h-[800px] bg-gradient-to-br from-primary-red via-primary-red via-[7%] to-blue-950 overflow-hidden flex flex-col justify-center items-center px-6 text-center">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,161,132,0.15),transparent)] pointer-events-none" />

            <div className="max-w-4xl mx-auto flex flex-col justify-start items-center gap-6 z-10">
              <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 inline-flex justify-start items-center gap-2">
                <i className="fa-solid fa-globe text-white text-xs" />
                <span className="text-white text-xs font-semibold leading-5">Transforme dados em impacto ambiental real</span>
              </div>

              <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
                Calcule o impacto <br />
                <span className="text-lime-300">ambiental</span> dos seus <br />
                pagamentos digitais
              </h1>

              <p className="text-white/90 text-md sm:text-xl md:text-2xl font-medium max-w-3xl leading-relaxed mt-2">
                Descubra quanto <span className="font-bold text-white">CO₂</span>, <span className="font-bold text-white">plástico</span> e <span className="font-bold text-white">recursos naturais</span> sua empresa economiza ao adotar soluções de pagamento digital da Edenred.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full max-w-md">
                <Button
                  variant="primary"
                  className="bg-white hover:bg-zinc-100 text-primary-red border border-transparent shadow-2xl py-4 text-lg font-bold leading-7"
                  onClick={() => setShowCalculator(true)}
                >
                  <span className="text-primary-red">Começar agora</span> <i className="fa-solid fa-arrow-right ml-2 text-primary-red" />
                </Button>
                <button
                  onClick={() => scrollToSection('solucao')}
                  className="w-full py-4 text-center text-white text-base font-bold bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all cursor-pointer"
                >
                  Ver demonstração
                </button>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-8 md:gap-16 mt-12 w-full max-w-2xl border-t border-white/10 pt-8">
                <div className="flex flex-col items-center">
                  <span className="text-white text-3xl md:text-4xl font-extrabold">70%</span>
                  <span className="text-white/80 text-xs md:text-sm mt-1">Redução média</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white text-3xl md:text-4xl font-extrabold">500+</span>
                  <span className="text-white/80 text-xs md:text-sm mt-1">Empresas ativas</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-white text-3xl md:text-4xl font-extrabold">2.5M</span>
                  <span className="text-white/80 text-xs md:text-sm mt-1">Toneladas CO₂</span>
                </div>
              </div>
            </div>
          </section>

          {/* SOBRE A EDENRED SECTION */}
          <section id="sobre" className="w-full py-24 bg-zinc-100 flex flex-col justify-start items-center px-6">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left Column Text */}
              <div className="flex flex-col justify-start items-start gap-5">
                <div className="px-4 py-1.5 bg-primary-red-light rounded-full inline-flex items-center gap-2 border border-primary-red/10">
                  <i className="fa-solid fa-circle-info text-primary-red text-xs" />
                  <span className="text-primary-red text-xs font-bold">Sobre a Edenred</span>
                </div>
                <h2 className="text-black text-3xl sm:text-4xl font-bold leading-tight">
                  Líderes globais em soluções de pagamento digital
                </h2>
                <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                  A Edenred é líder mundial em soluções de pagamento digital para empresas, colaboradores e comerciantes. Com presença em mais de 45 países, transformamos a forma como as empresas gerenciam benefícios e despesas.
                </p>
                <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                  Nosso compromisso com a sustentabilidade nos levou a criar o <strong className="text-text-main font-bold">GreenPay Impact</strong>, uma ferramenta que quantifica o impacto ambiental positivo da digitalização de pagamentos.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 w-full pt-4 border-t border-black/5 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-primary-red rounded-lg text-white">
                      <i className="fa-solid fa-earth-americas text-lg" />
                    </div>
                    <div>
                      <strong className="text-black text-md font-bold block">45+ países</strong>
                      <span className="text-neutral-700 text-xs">Presença global</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-primary-red rounded-lg text-white">
                      <i className="fa-solid fa-users text-lg" />
                    </div>
                    <div>
                      <strong className="text-black text-md font-bold block">50M+ usuários</strong>
                      <span className="text-neutral-700 text-xs">Em todo o mundo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Gradient Card */}
              <div className="bg-gradient-to-br from-primary-red via-primary-red to-blue-950 p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-start items-start gap-6 text-white w-full">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl text-white">
                  <i className="fa-solid fa-seedling" />
                </div>
                <h3 className="text-2xl font-bold">Nossa missão ambiental</h3>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  Reduzir o impacto ambiental através da digitalização, eliminando milhões de cartões plásticos e reduzindo emissões de CO₂ associadas à produção e logística.
                </p>
                <div className="bg-white/10 rounded-xl p-6 grid grid-cols-2 gap-6 w-full mt-4 border border-white/5">
                  <div>
                    <h4 className="text-3xl font-bold">-85%</h4>
                    <span className="text-white/80 text-xs">Plástico</span>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold">-70%</h4>
                    <span className="text-white/80 text-xs">CO₂</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* COMO FUNCIONA SECTION */}
          <section id="solucao" className="w-full py-24 bg-white flex flex-col justify-start items-center px-6">
            <div className="max-w-6xl w-full flex flex-col justify-start items-center gap-12">
              <div className="text-center flex flex-col items-center gap-4">
                <div className="px-4 py-1.5 bg-primary-red-light rounded-full inline-flex items-center gap-2 border border-primary-red/10">
                  <i className="fa-solid fa-gears text-primary-red text-xs" />
                  <span className="text-primary-red text-xs font-bold">Nossa Solução</span>
                </div>
                <h2 className="text-black text-4xl sm:text-5xl font-bold">Como o GreenPay Impact funciona</h2>
                <p className="text-neutral-700 text-lg sm:text-xl max-w-2xl leading-relaxed mt-2">
                  Uma plataforma completa para calcular, visualizar e reportar o impacto ambiental das suas operações de pagamento
                </p>
              </div>

              {/* Steps Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
                <article className="p-8 bg-gradient-to-br from-zinc-100 via-neutral-100 to-white rounded-2xl border border-black/10 flex flex-col justify-start items-start gap-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-primary-red rounded-lg flex items-center justify-center text-white text-lg">
                    <i className="fa-solid fa-calculator" />
                  </div>
                  <h3 className="text-black text-xl font-bold">1. Calculadora de Impacto</h3>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    Insira dados da sua empresa como número de colaboradores e transações mensais. Nossa metodologia cientificamente validada calcula o impacto ambiental.
                  </p>
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="mt-auto flex items-center gap-2 text-primary-red text-sm font-bold hover:underline cursor-pointer"
                  >
                    Saber mais <i className="fa-solid fa-arrow-right text-xs" />
                  </button>
                </article>

                <article className="p-8 bg-gradient-to-br from-zinc-100 via-neutral-100 to-white rounded-2xl border border-black/10 flex flex-col justify-start items-start gap-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-950 rounded-lg flex items-center justify-center text-white text-lg">
                    <i className="fa-solid fa-chart-line" />
                  </div>
                  <h3 className="text-black text-xl font-bold">2. Dashboard Interativo</h3>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    Visualize métricas consolidadas, comparações físico vs digital, tendências históricas e equivalências ambientais em tempo real.
                  </p>
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="mt-auto flex items-center gap-2 text-blue-950 text-sm font-bold hover:underline cursor-pointer"
                  >
                    Saber mais <i className="fa-solid fa-arrow-right text-xs" />
                  </button>
                </article>

                <article className="p-8 bg-gradient-to-br from-zinc-100 via-neutral-100 to-white rounded-2xl border border-black/10 flex flex-col justify-start items-start gap-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-lg">
                    <i className="fa-solid fa-file-invoice-dollar" />
                  </div>
                  <h3 className="text-black text-xl font-bold">3. Relatórios ESG</h3>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    Exporte relatórios detalhados para integrar aos seus reportes de sustentabilidade e comunicações ESG corporativas.
                  </p>
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="mt-auto flex items-center gap-2 text-emerald-600 text-sm font-bold hover:underline cursor-pointer"
                  >
                    Saber mais <i className="fa-solid fa-arrow-right text-xs" />
                  </button>
                </article>
              </div>
            </div>
          </section>

          {/* BENEFICIOS SECTION */}
          <section id="beneficios" className="w-full py-24 bg-zinc-100 flex flex-col justify-start items-center px-6">
            <div className="max-w-6xl w-full flex flex-col justify-start items-center gap-12">
              <div className="text-center flex flex-col items-center gap-4">
                <div className="px-4 py-1.5 bg-lime-300 rounded-full inline-flex items-center gap-2 border border-lime-400/20">
                  <i className="fa-solid fa-star text-blue-950 text-xs" />
                  <span className="text-blue-950 text-xs font-bold">Benefícios</span>
                </div>
                <h2 className="text-black text-4xl sm:text-5xl font-bold">Por que usar o GreenPay Impact</h2>
              </div>

              {/* Benefits Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-8">
                <div className="p-6 bg-white rounded-xl border border-black/10 flex flex-col gap-4 hover:shadow-md transition-all">
                  <div className="text-primary-red text-2xl">
                    <i className="fa-solid fa-cloud-arrow-down" />
                  </div>
                  <h3 className="text-black text-base font-bold">Redução de CO₂</h3>
                  <p className="text-neutral-700 text-xs leading-relaxed">
                    Mensure a economia de emissões com pagamentos digitais
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl border border-black/10 flex flex-col gap-4 hover:shadow-md transition-all">
                  <div className="text-blue-950 text-2xl">
                    <i className="fa-solid fa-ban" />
                  </div>
                  <h3 className="text-black text-base font-bold">Menos Plástico</h3>
                  <p className="text-neutral-700 text-xs leading-relaxed">
                    Elimine toneladas de cartões plásticos descartáveis
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl border border-black/10 flex flex-col gap-4 hover:shadow-md transition-all">
                  <div className="text-emerald-500 text-2xl">
                    <i className="fa-solid fa-thumbs-up" />
                  </div>
                  <h3 className="text-black text-base font-bold">Impacto Positivo</h3>
                  <p className="text-neutral-700 text-xs leading-relaxed">
                    Contribua ativamente para metas de sustentabilidade
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl border border-black/10 flex flex-col gap-4 hover:shadow-md transition-all">
                  <div className="text-lime-600 text-2xl">
                    <i className="fa-solid fa-shield-halved" />
                  </div>
                  <h3 className="text-black text-base font-bold">Conformidade ESG</h3>
                  <p className="text-neutral-700 text-xs leading-relaxed">
                    Relatórios prontos para auditorias e comunicações
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CALL TO ACTION BANNER */}
          <section className="w-full py-24 bg-gradient-to-r from-primary-red via-primary-red to-red-700 flex flex-col justify-start items-center text-center px-6">
            <div className="max-w-3xl w-full flex flex-col justify-start items-center gap-6">
              <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight">
                Pronto para calcular seu impacto?
              </h2>
              <p className="text-white/95 text-lg sm:text-xl leading-relaxed mt-2 max-w-xl">
                Junte-se a centenas de empresas que já estão medindo e reduzindo seu impacto ambiental
              </p>
              <Button
                variant="primary"
                className="w-auto bg-white hover:bg-zinc-100 text-primary-red px-10 py-4 shadow-2xl mt-4 text-lg font-bold leading-7"
                onClick={() => setShowCalculator(true)}
              >
                <span className="text-primary-red">Começar gratuitamente</span> <i className="fa-solid fa-arrow-right ml-2 text-primary-red" />
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full py-16 bg-blue-950 px-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-red rounded-[5px] flex flex-col justify-start items-start">
                  <div className="w-5 h-5 relative overflow-hidden">
                    <div className="w-3.5 h-3.5 left-[3.32px] top-[1.67px] absolute border-2 border-white rounded-xs" />
                    <div className="w-2.5 h-2 left-[1.67px] top-[10px] absolute border-2 border-white rounded-xs" />
                  </div>
                </div>
                <span className="text-white text-lg font-bold">GreenPay Impact</span>
              </div>
              <p className="text-white/70 text-sm">
                by Edenred
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white text-base font-bold">Produto</h4>
              <nav className="flex flex-col gap-2 text-white/70 text-sm">
                <button onClick={() => setShowCalculator(true)} className="text-left hover:text-white transition">Calculadora</button>
                <button onClick={() => setShowCalculator(true)} className="text-left hover:text-white transition">Dashboard</button>
                <button onClick={() => setShowCalculator(true)} className="text-left hover:text-white transition">Relatórios</button>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white text-base font-bold">Empresa</h4>
              <nav className="flex flex-col gap-2 text-white/70 text-sm">
                <button onClick={() => scrollToSection('sobre')} className="text-left hover:text-white transition cursor-pointer">Sobre</button>
                <a href="#contato" className="hover:text-white transition">Contato</a>
                <a href="#carreiras" className="hover:text-white transition">Carreiras</a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white text-base font-bold">Legal</h4>
              <nav className="flex flex-col gap-2 text-white/70 text-sm">
                <a href="#privacidade" className="hover:text-white transition">Privacidade</a>
                <a href="#termos" className="hover:text-white transition">Termos</a>
                <a href="#cookies" className="hover:text-white transition">Cookies</a>
              </nav>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex justify-center items-center text-center">
            <p className="text-white/60 text-sm">
              © 2026 Edenred. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL: SIMULATION HISTORY */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-text-light/20 w-full max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-text-light/10 pb-4 mb-4">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                <i className="fa-solid fa-history text-primary-red" /> Histórico de Impacto
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-text-muted hover:text-text-main text-2xl font-bold leading-none cursor-pointer">
                &times;
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                <input
                  type="text"
                  placeholder="Buscar por Empresa ou CNPJ..."
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-page border border-text-light rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary-red-light focus:border-primary-red"
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 rounded-lg border border-text-light/20">
              {filtrarSimulacoes.length > 0 ? (
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-bg-page text-text-muted font-bold text-xs uppercase tracking-wider sticky top-0 border-b border-text-light/20">
                    <tr>
                      <th className="py-3 px-4">Empresa</th>
                      <th className="py-3 px-4">CNPJ</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-text-light/15 font-semibold text-text-main">
                    {filtrarSimulacoes.map((item) => (
                      <tr key={item.id} className="hover:bg-bg-hover">
                        <td className="py-3.5 px-4">{item.empresa?.nomeEmpresa}</td>
                        <td className="py-3.5 px-4 font-mono text-xs">{item.empresa?.cnpj ? item.empresa.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") : 'Não Informado'}</td>
                        <td className="py-3.5 px-4 text-xs font-medium text-text-muted">{item.dataCalculo}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleVerImpactoDoHistorico(item.id)}
                            className="bg-primary-red/10 text-primary-red hover:bg-primary-red hover:text-white font-bold py-1.5 px-3 rounded-md text-xs transition-all cursor-pointer"
                          >
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 px-4 text-center text-text-muted text-sm">
                  Nenhuma simulação encontrada no histórico.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMINISTRATIVE EMISSION FACTORS */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-text-light/20 w-full max-w-3xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-text-light/10 pb-4 mb-4">
              <h2 className="text-xl font-bold text-primary-red flex items-center gap-2">
                <i className="fa-solid fa-sliders text-primary-red" /> Painel Admin - Fatores de Emissão
              </h2>
              <button onClick={() => setShowAdmin(false)} className="text-text-muted hover:text-text-main text-2xl font-bold leading-none cursor-pointer">
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-hidden flex-1">
              {/* Insert Form */}
              <div className="md:col-span-2 flex flex-col gap-4 border-r border-text-light/10 pr-0 md:pr-6">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Adicionar Novo Fator</h3>
                <form onSubmit={handleSalvarFator} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-bold text-text-main uppercase tracking-wider">Tipo de Transação</label>
                    <select
                      className="w-full px-4 py-3 border border-text-light rounded-lg bg-bg-input text-text-main text-sm outline-hidden focus:ring-2 focus:ring-primary-red-light focus:border-primary-red font-semibold"
                      value={novoFatorTipo}
                      onChange={(e) => setNovoFatorTipo(e.target.value as 'FISICA' | 'DIGITAL')}
                    >
                      <option value="FISICA">FÍSICA</option>
                      <option value="DIGITAL">DIGITAL</option>
                    </select>
                  </div>
                  <Input
                    id="fator-valor"
                    label="Valor (kg CO2e)"
                    type="number"
                    step="0.00001"
                    placeholder="Ex: 0.0543"
                    required
                    value={novoFatorValor}
                    onChange={(e) => setNovoFatorValor(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  <Input
                    id="fator-fonte"
                    label="Fonte / Metodologia"
                    placeholder="Ex: GHG Protocol 2026"
                    required
                    value={novoFatorFonte}
                    onChange={(e) => setNovoFatorFonte(e.target.value)}
                  />

                  {adminError && (
                    <p className="text-xs font-semibold text-primary-red bg-primary-red-light p-2.5 rounded-lg">
                      {adminError}
                    </p>
                  )}
                  {adminSuccess && (
                    <p className="text-xs font-semibold text-accent-green bg-accent-green-light p-2.5 rounded-lg">
                      {adminSuccess}
                    </p>
                  )}

                  <Button type="submit" isLoading={isSavingFator}>
                    Salvar Nova Versão
                  </Button>
                </form>
              </div>

              {/* Factors Table List */}
              <div className="md:col-span-3 flex flex-col gap-4 overflow-hidden">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Histórico de Fatores</h3>
                <div className="overflow-y-auto flex-1 rounded-lg border border-text-light/20">
                  {fatores.length > 0 ? (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-bg-page text-text-muted font-bold uppercase tracking-wider sticky top-0 border-b border-text-light/20">
                        <tr>
                          <th className="py-2.5 px-3">Tipo</th>
                          <th className="py-2.5 px-3">Valor</th>
                          <th className="py-2.5 px-3">Fonte</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-text-light/15 font-semibold text-text-main">
                        {fatores.map((item) => (
                          <tr key={item.id} className="hover:bg-bg-hover">
                            <td className="py-2 px-3 text-xs">{item.tipo}</td>
                            <td className="py-2 px-3 font-mono">{item.valor.toFixed(5)}</td>
                            <td className="py-2 px-3 truncate max-w-[120px]" title={item.fonteMetodologia}>{item.fonteMetodologia}</td>
                            <td className="py-2 px-3 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.ativo ? 'bg-accent-green-light text-accent-green' : 'bg-text-light/50 text-text-muted'}`}>
                                {item.ativo ? 'ATIVO' : 'INATIVO'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-12 px-3 text-center text-text-muted">
                      Nenhum fator cadastrado.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;