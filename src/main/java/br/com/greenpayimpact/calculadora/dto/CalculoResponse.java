package br.com.greenpayimpact.calculadora.dto;

import java.math.BigDecimal;

public class CalculoResponse {
    private BigDecimal impactoFisico;
    private BigDecimal impactoDigital;
    private BigDecimal co2Evitado;
    
    private Double arvoresEquivalentes;
    private Double kmEvitados;
    private Integer garrafasPetEvitadas;

    public CalculoResponse(BigDecimal fisico, BigDecimal digital, BigDecimal evitado, 
                           Double arvores, Double km, Integer garrafas) {
        this.impactoFisico = fisico;
        this.impactoDigital = digital;
        this.co2Evitado = evitado;
        this.arvoresEquivalentes = arvores;
        this.kmEvitados = km;
        this.garrafasPetEvitadas = garrafas;
    }

    public BigDecimal getImpactoFisico() { return impactoFisico; }
    public BigDecimal getImpactoDigital() { return impactoDigital; }
    public BigDecimal getCo2Evitado() { return co2Evitado; }
    public Double getArvoresEquivalentes() { return arvoresEquivalentes; }
    public Double getKmEvitados() { return kmEvitados; }
    public Integer getGarrafasPetEvitadas() { return garrafasPetEvitadas; }
}