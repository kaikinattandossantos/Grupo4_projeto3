package br.com.greenpayimpact.calculadora.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.greenpayimpact.calculadora.dto.CalculoResponse;
import br.com.greenpayimpact.calculadora.model.Empresa;
import br.com.greenpayimpact.calculadora.model.FatorConversaoAnalogia;
import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.model.ResultadoCalculo;
import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import br.com.greenpayimpact.calculadora.repository.FatorConversaoAnalogiaRepository;
import br.com.greenpayimpact.calculadora.repository.FatorEmissaoRepository;
import br.com.greenpayimpact.calculadora.repository.ResultadoCalculoRepository;

@Service
public class CalculoService {

    @Autowired
    private FatorEmissaoRepository fatorRepository;

    @Autowired
    private ResultadoCalculoRepository resultadoRepository;

    @Autowired
    private FatorConversaoAnalogiaRepository analogiaRepository;

    private static final BigDecimal DEFAULT_CO2_POR_ARVORE = new BigDecimal("15.0");
    private static final BigDecimal DEFAULT_CO2_POR_KM = new BigDecimal("0.12");
    private static final BigDecimal DEFAULT_PESO_CARTAO_PVC = new BigDecimal("0.005");
    private static final BigDecimal DEFAULT_GARRAFAS_POR_KG = new BigDecimal("50");

    public ResultadoCalculo calcularEPersistirImpacto(Long transacoes, Double percentualMigracao, Empresa empresa) {
        BigDecimal qtdTotal = BigDecimal.valueOf(transacoes);
        
        Double percentual = (percentualMigracao != null) ? percentualMigracao : 100.0;
        BigDecimal percDecimal = BigDecimal.valueOf(percentual).divide(BigDecimal.valueOf(100));

        BigDecimal qtdDigitais = qtdTotal.multiply(percDecimal);
        BigDecimal qtdFisicas = qtdTotal.subtract(qtdDigitais);

        FatorEmissao fatorFisico = fatorRepository.findByTipoAndAtivoTrue(TipoTransacao.FISICA)
                .orElseThrow(() -> new RuntimeException("Fator FÍSICA não configurado."));
        FatorEmissao fatorDigital = fatorRepository.findByTipoAndAtivoTrue(TipoTransacao.DIGITAL)
                .orElseThrow(() -> new RuntimeException("Fator DIGITAL não configurado."));

        BigDecimal impacto100Fisico = qtdTotal.multiply(fatorFisico.getValor());
        BigDecimal impacto100Digital = qtdTotal.multiply(fatorDigital.getValor());
        BigDecimal impactoHibrido = (qtdFisicas.multiply(fatorFisico.getValor()))
                                    .add(qtdDigitais.multiply(fatorDigital.getValor()));
        BigDecimal co2Evitado = impacto100Fisico.subtract(impactoHibrido);

        BigDecimal co2PorArvore = buscarAnalogia("CO2_POR_ARVORE", DEFAULT_CO2_POR_ARVORE);
        BigDecimal co2PorKm = buscarAnalogia("CO2_POR_KM", DEFAULT_CO2_POR_KM);
        BigDecimal pesoCartaoPvc = buscarAnalogia("PESO_CARTAO_PVC_KG", DEFAULT_PESO_CARTAO_PVC);
        BigDecimal garrafasPorKg = buscarAnalogia("GARRAFAS_POR_KG_PVC", DEFAULT_GARRAFAS_POR_KG);

        ResultadoCalculo resultado = new ResultadoCalculo();
        resultado.setQtdTransacoes(transacoes);
        resultado.setPercentualMigracao(percentual);
        
        resultado.setImpactoFisico(formatar(impacto100Fisico, 5));
        resultado.setImpactoDigital(formatar(impacto100Digital, 5));
        resultado.setImpactoHibrido(formatar(impactoHibrido, 5));
        resultado.setCo2Evitado(formatar(co2Evitado, 5));
        
        resultado.setArvoresEquivalentes(calcularArvores(co2Evitado, co2PorArvore));
        resultado.setKmEvitados(calcularKm(co2Evitado, co2PorKm));
        // O plástico poupado é proporcional apenas à cota de transações digitais
        resultado.setGarrafasPetEvitadas(calcularGarrafas(qtdDigitais, pesoCartaoPvc, garrafasPorKg));
        
        resultado.setDataCalculo(LocalDateTime.now());
        resultado.setFatorFisico(fatorFisico);
        resultado.setFatorDigital(fatorDigital);
        resultado.setEmpresa(empresa); 

        return resultadoRepository.save(resultado);
    }

    public CalculoResponse mapearParaResponse(ResultadoCalculo resultado) {
        CalculoResponse response = new CalculoResponse();
        response.setId(resultado.getId());
        response.setQtdTransacoes(resultado.getQtdTransacoes());
        
        Double percentualReal = resultado.getPercentualMigracao() != null ? resultado.getPercentualMigracao() : 100.0;
        BigDecimal impactoHibridoReal = resultado.getImpactoHibrido() != null ? resultado.getImpactoHibrido() : resultado.getImpactoDigital();
        
        response.setPercentualMigracao(percentualReal);
        response.setImpactoFisico(resultado.getImpactoFisico());
        response.setImpactoDigital(resultado.getImpactoDigital());
        response.setImpactoHibrido(impactoHibridoReal);
        response.setCo2Evitado(resultado.getCo2Evitado());
        response.setArvoresEquivalentes(resultado.getArvoresEquivalentes());
        response.setKmEvitados(resultado.getKmEvitados());
        response.setGarrafasPetEvitadas(resultado.getGarrafasPetEvitadas());

        if (resultado.getFatorFisico() != null) {
            response.setMetodologiaFisico(resultado.getFatorFisico().getFonteMetodologia());
        }
        if (resultado.getFatorDigital() != null) {
            response.setMetodologiaDigital(resultado.getFatorDigital().getFonteMetodologia());
        }

        if (resultado.getEmpresa() != null) {
            CalculoResponse.EmpresaResponse emp = new CalculoResponse.EmpresaResponse();
            emp.setNomeEmpresa(resultado.getEmpresa().getNomeEmpresa());
            emp.setCnpj(resultado.getEmpresa().getCnpj());
            emp.setEmail(resultado.getEmpresa().getEmail());
            response.setEmpresa(emp);
        }

        return response;
    }

    private BigDecimal buscarAnalogia(String nome, BigDecimal valorPadrao) {
        return analogiaRepository.findByNomeMetrica(nome).map(FatorConversaoAnalogia::getValor).orElse(valorPadrao);
    }

    private Double calcularArvores(BigDecimal co2, BigDecimal fator) {
        if (fator.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return co2.divide(fator, 2, RoundingMode.HALF_UP).doubleValue();
    }

    private Double calcularKm(BigDecimal co2, BigDecimal fator) {
        if (fator.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return co2.divide(fator, 2, RoundingMode.HALF_UP).doubleValue();
    }

    private Integer calcularGarrafas(BigDecimal qtdTransacoes, BigDecimal pesoCartao, BigDecimal garrafasPorKg) {
        BigDecimal kgPlastico = qtdTransacoes.multiply(pesoCartao);
        return kgPlastico.multiply(garrafasPorKg).setScale(0, RoundingMode.HALF_UP).intValue();
    }

    private BigDecimal formatar(BigDecimal valor, int casas) {
        return valor.setScale(casas, RoundingMode.HALF_UP);
    }
}