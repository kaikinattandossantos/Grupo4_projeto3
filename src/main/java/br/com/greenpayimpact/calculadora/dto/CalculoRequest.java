package br.com.greenpayimpact.calculadora.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;

public class CalculoRequest {

    private String nomeEmpresa;
    private String cnpj;

    @Email(message = "Formato de e-mail inválido.")
    private String email;

    @NotNull(message = "O volume de transações é obrigatório.")
    @Min(value = 1, message = "O volume mínimo de transações é 1.")
    private Long transacoes;

    @Min(value = 0, message = "O percentual mínimo é 0%.")
    @Max(value = 100, message = "O percentual máximo é 100%.")
    private Double percentualMigracao; 

    // Getters e Setters
    public String getNomeEmpresa() { return nomeEmpresa; }
    public void setNomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Long getTransacoes() { return transacoes; }
    public void setTransacoes(Long transacoes) { this.transacoes = transacoes; }

    public Double getPercentualMigracao() { return percentualMigracao; }
    public void setPercentualMigracao(Double percentualMigracao) { this.percentualMigracao = percentualMigracao; }
}