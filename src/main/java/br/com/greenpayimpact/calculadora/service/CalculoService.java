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

    public ResultadoCalculo calcularEPersistirImpacto(Long transacoes, Empresa empresa) {
        BigDecimal qtd = BigDecimal.valueOf(transacoes);

        FatorEmissao fatorFisico = fatorRepository.findByTipoAndAtivoTrue(TipoTransacao.FISICA)
                .orElseThrow(() -> new RuntimeException("Fator de emissão FÍSICA não configurado no painel Admin."));
        FatorEmissao fatorDigital = fatorRepository.findByTipoAndAtivoTrue(TipoTransacao.DIGITAL)
                .orElseThrow(() -> new RuntimeException("Fator de emissão DIGITAL não configurado no painel Admin."));

        BigDecimal impactoFisico = qtd.multiply(fatorFisico.getValor());
        BigDecimal impactoDigital = qtd.multiply(fatorDigital.getValor());
        BigDecimal co2Evitado = impactoFisico.subtract(impactoDigital);

        BigDecimal co2PorArvore = buscarAnalogia("CO2_POR_ARVORE", DEFAULT_CO2_POR_ARVORE);
        BigDecimal co2PorKm = buscarAnalogia("CO2_POR_KM", DEFAULT_CO2_POR_KM);
        BigDecimal pesoCartaoPvc = buscarAnalogia("PESO_CARTAO_PVC_KG", DEFAULT_PESO_CARTAO_PVC);
        BigDecimal garrafasPorKg = buscarAnalogia("GARRAFAS_POR_KG_PVC", DEFAULT_GARRAFAS_POR_KG);

        ResultadoCalculo resultado = new ResultadoCalculo();
        resultado.setQtdTransacoes(transacoes);
        resultado.setImpactoFisico(formatar(impactoFisico, 5));
        resultado.setImpactoDigital(formatar(impactoDigital, 5));
        resultado.setCo2Evitado(formatar(co2Evitado, 5));
        
        resultado.setArvoresEquivalentes(calcularArvores(co2Evitado, co2PorArvore));
        resultado.setKmEvitados(calcularKm(co2Evitado, co2PorKm));
        resultado.setGarrafasPetEvitadas(calcularGarrafas(qtd, pesoCartaoPvc, garrafasPorKg));
        
        resultado.setDataCalculo(LocalDateTime.now());
        resultado.setFatorFisico(fatorFisico);
        resultado.setFatorDigital(fatorDigital);
        resultado.setEmpresa(empresa); 

        return resultadoRepository.save(resultado);
    }

    public CalculoResponse mapearParaResponse(ResultadoCalculo resultado) {
        CalculoResponse response = new CalculoResponse(
                resultado.getImpactoFisico(),
                resultado.getImpactoDigital(),
                resultado.getCo2Evitado(),
                resultado.getArvoresEquivalentes(),
                resultado.getKmEvitados(),
                resultado.getGarrafasPetEvitadas()
        );
        
        response.setId(resultado.getId());
        response.setQtdTransacoes(resultado.getQtdTransacoes());
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
        return analogiaRepository.findByNomeMetrica(nome)
                .map(FatorConversaoAnalogia::getValor)
                .orElse(valorPadrao);
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
        return kgPlastico.multiply(garrafasPorKg)
                         .setScale(0, RoundingMode.HALF_UP).intValue();
    }

    private BigDecimal formatar(BigDecimal valor, int casas) {
        return valor.setScale(casas, RoundingMode.HALF_UP);
    }
}