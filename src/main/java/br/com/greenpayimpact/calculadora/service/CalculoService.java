package br.com.greenpayimpact.calculadora.service;

import br.com.greenpayimpact.calculadora.dto.CalculoResponse;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CalculoService {

    private static final BigDecimal FATOR_FISICO = new BigDecimal("0.0005");
    private static final BigDecimal FATOR_DIGITAL = new BigDecimal("0.00002");
    
    private static final BigDecimal CO2_POR_ARVORE = new BigDecimal("15.0");
    private static final BigDecimal CO2_POR_KM = new BigDecimal("0.12");
    private static final BigDecimal PESO_CARTAO_PVC_KG = new BigDecimal("0.005");
    private static final int GARRAFAS_POR_KG_PVC = 50;

    public CalculoResponse calcularImpacto(Long transacoes) {
        BigDecimal qtd = BigDecimal.valueOf(transacoes);

        BigDecimal impactoFisico = qtd.multiply(FATOR_FISICO);
        BigDecimal impactoDigital = qtd.multiply(FATOR_DIGITAL);
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
}