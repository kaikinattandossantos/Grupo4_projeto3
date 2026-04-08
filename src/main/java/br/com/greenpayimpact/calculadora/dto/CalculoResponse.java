package br.com.greenpayimpact.calculadora.dto;

import java.math.BigDecimal;

public class CalculoResponse {
    private BigDecimal impactoFisico;
    private BigDecimal impactoDigital;
    private BigDecimal co2Evitado;

    public CalculoResponse(BigDecimal fisico, BigDecimal digital, BigDecimal evitado) {
        this.impactoFisico = fisico;
        this.impactoDigital = digital;
        this.co2Evitado = evitado;
    }
    
    public BigDecimal getImpactoFisico() { return impactoFisico; }
    public BigDecimal getImpactoDigital() { return impactoDigital; }
    public BigDecimal getCo2Evitado() { return co2Evitado; }
}