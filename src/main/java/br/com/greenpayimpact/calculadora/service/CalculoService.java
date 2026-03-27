package br.com.greenpayimpact.calculadora.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class CalculoService {

    private static final BigDecimal FATOR_FISICO = new BigDecimal("0.0005");
    private static final BigDecimal FATOR_DIGITAL = new BigDecimal("0.00002");

    public Map<String, BigDecimal> calcularImpacto(Long transacoes) {
        BigDecimal qtd = BigDecimal.valueOf(transacoes);

        BigDecimal impactoFisico = qtd.multiply(FATOR_FISICO);

        BigDecimal impactoDigital = qtd.multiply(FATOR_DIGITAL);

        BigDecimal co2Evitado = impactoFisico.subtract(impactoDigital);

        Map<String, BigDecimal> resultados = new HashMap<>();
        resultados.put("impactoFisico", impactoFisico.setScale(5, RoundingMode.HALF_UP));
        resultados.put("impactoDigital", impactoDigital.setScale(5, RoundingMode.HALF_UP));
        resultados.put("co2Evitado", co2Evitado.setScale(5, RoundingMode.HALF_UP));

        return resultados;
    }
}
