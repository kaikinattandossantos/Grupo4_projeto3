package br.com.greenpayimpact.calculadora.dto;

import java.math.BigDecimal;

public class CalculoResponse {
    private Long id;
    private Long qtdTransacoes;
    private Double percentualMigracao; 
    
    private BigDecimal impactoFisico; 
    private BigDecimal impactoDigital; 
    private BigDecimal impactoHibrido; 
    private BigDecimal co2Evitado;
    
    private Double arvoresEquivalentes;
    private Double kmEvitados;
    private Integer garrafasPetEvitadas;

    private String metodologiaFisico;
    private String metodologiaDigital;
    private EmpresaResponse empresa;

    public CalculoResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getQtdTransacoes() { return qtdTransacoes; }
    public void setQtdTransacoes(Long qtdTransacoes) { this.qtdTransacoes = qtdTransacoes; }

    public Double getPercentualMigracao() { return percentualMigracao; }
    public void setPercentualMigracao(Double percentualMigracao) { this.percentualMigracao = percentualMigracao; }

    public BigDecimal getImpactoFisico() { return impactoFisico; }
    public void setImpactoFisico(BigDecimal impactoFisico) { this.impactoFisico = impactoFisico; }

    public BigDecimal getImpactoDigital() { return impactoDigital; }
    public void setImpactoDigital(BigDecimal impactoDigital) { this.impactoDigital = impactoDigital; }

    public BigDecimal getImpactoHibrido() { return impactoHibrido; }
    public void setImpactoHibrido(BigDecimal impactoHibrido) { this.impactoHibrido = impactoHibrido; }

    public BigDecimal getCo2Evitado() { return co2Evitado; }
    public void setCo2Evitado(BigDecimal co2Evitado) { this.co2Evitado = co2Evitado; }

    public Double getArvoresEquivalentes() { return arvoresEquivalentes; }
    public void setArvoresEquivalentes(Double arvoresEquivalentes) { this.arvoresEquivalentes = arvoresEquivalentes; }

    public Double getKmEvitados() { return kmEvitados; }
    public void setKmEvitados(Double kmEvitados) { this.kmEvitados = kmEvitados; }

    public Integer getGarrafasPetEvitadas() { return garrafasPetEvitadas; }
    public void setGarrafasPetEvitadas(Integer garrafasPetEvitadas) { this.garrafasPetEvitadas = garrafasPetEvitadas; }

    public String getMetodologiaFisico() { return metodologiaFisico; }
    public void setMetodologiaFisico(String metodologiaFisico) { this.metodologiaFisico = metodologiaFisico; }

    public String getMetodologiaDigital() { return metodologiaDigital; }
    public void setMetodologiaDigital(String metodologiaDigital) { this.metodologiaDigital = metodologiaDigital; }

    public EmpresaResponse getEmpresa() { return empresa; }
    public void setEmpresa(EmpresaResponse empresa) { this.empresa = empresa; }

    public static class EmpresaResponse {
        private String nomeEmpresa;
        private String cnpj;
        private String email;

        public EmpresaResponse() {}

        public String getNomeEmpresa() { return nomeEmpresa; }
        public void setNomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; }
        public String getCnpj() { return cnpj; }
        public void setCnpj(String cnpj) { this.cnpj = cnpj; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}