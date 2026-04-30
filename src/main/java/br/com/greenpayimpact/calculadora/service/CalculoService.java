package br.com.greenpayimpact.calculadora.service;

import br.com.greenpayimpact.calculadora.dto.CalculoResponse;
import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import br.com.greenpayimpact.calculadora.repository.FatorEmissaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CalculoService {

    @Autowired
    private FatorEmissaoRepository fatorRepository;

    private static final BigDecimal CO2_POR_ARVORE = new BigDecimal("15.0");
    private static final BigDecimal CO2_POR_KM = new BigDecimal("0.12");
    private static final BigDecimal PESO_CARTAO_PVC_KG = new BigDecimal("0.005");
    private static final int GARRAFAS_POR_KG_PVC = 50;

    public CalculoResponse calcularImpacto(Long transacoes) {
        BigDecimal qtd = BigDecimal.valueOf(transacoes);

        BigDecimal fatorFisico = buscarFatorAtivo(TipoTransacao.FISICA);
        BigDecimal fatorDigital = buscarFatorAtivo(TipoTransacao.DIGITAL);

        BigDecimal impactoFisico = qtd.multiply(fatorFisico);
        BigDecimal impactoDigital = qtd.multiply(fatorDigital);
        BigDecimal co2Evitado = impactoFisico.subtract(impactoDigital);

        return new CalculoResponse(
                formatar(impactoFisico, 5),
                formatar(impactoDigital, 5),
                formatar(co2Evitado, 5),
                calcularArvores(co2Evitado),
                calcularKm(co2Evitado),
                calcularGarrafas(transacoes)
        );
    }

    private BigDecimal buscarFatorAtivo(TipoTransacao tipo) {
        return fatorRepository.findByTipoAndAtivoTrue(tipo)
                .map(FatorEmissao::getValor)
                .orElseThrow(() -> new RuntimeException(
                        "Fator de emissão para transação " + tipo + " não configurado no painel Admin. Por favor, cadastre-o primeiro."
                ));
    }

    private Double calcularArvores(BigDecimal co2) {
        return co2.divide(CO2_POR_ARVORE, 2, RoundingMode.HALF_UP).doubleValue();
    }

    private Double calcularKm(BigDecimal co2) {
        return co2.divide(CO2_POR_KM, 2, RoundingMode.HALF_UP).doubleValue();
    }

    private Integer calcularGarrafas(Long transacoes) {
        BigDecimal kgPlastico = BigDecimal.valueOf(transacoes).multiply(PESO_CARTAO_PVC_KG);
        return kgPlastico.multiply(BigDecimal.valueOf(GARRAFAS_POR_KG_PVC))
                         .setScale(0, RoundingMode.HALF_UP).intValue();
    }

    private BigDecimal formatar(BigDecimal valor, int casas) {
        return valor.setScale(casas, RoundingMode.HALF_UP);
    }

    public CalculoResponse calcularImpactoHistorico(Long transacoes, Long idFisico, Long idDigital) {
        BigDecimal qtd = BigDecimal.valueOf(transacoes);

        FatorEmissao fatorFisico = fatorRepository.findById(idFisico)
            .orElseThrow(() -> new RuntimeException("Registro do fator físico histórico não encontrado."));
        FatorEmissao fatorDigital = fatorRepository.findById(idDigital)
            .orElseThrow(() -> new RuntimeException("Registro do fator digital histórico não encontrado."));

        BigDecimal impactoFisico = qtd.multiply(fatorFisico.getValor());
        BigDecimal impactoDigital = qtd.multiply(fatorDigital.getValor());
        BigDecimal co2Evitado = impactoFisico.subtract(impactoDigital);

        return new CalculoResponse(
                formatar(impactoFisico, 5),
                formatar(impactoDigital, 5),
                formatar(co2Evitado, 5),
                calcularArvores(co2Evitado),
                calcularKm(co2Evitado),
                calcularGarrafas(transacoes)
        );
    }
}