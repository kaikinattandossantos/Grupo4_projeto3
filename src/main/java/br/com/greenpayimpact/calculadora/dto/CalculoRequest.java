package br.com.greenpayimpact.calculadora.dto;

import jakarta.validation.constraints.*;

public class CalculoRequest {
    
    @NotBlank(message = "Razão social é obrigatória")
    private String razaoSocial;

    @NotBlank(message = "CNPJ é obrigatório")
    @Size(min = 14, max = 14, message = "O CNPJ deve ter exatamente 14 dígitos")
    private String cnpj;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    @NotNull(message = "Volume de transações é obrigatório")
    @Min(value = 1, message = "O volume deve ser pelo menos 1")
    private Long transacoes;

    public CalculoRequest() {}

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getTransacoes() {
        return transacoes;
    }

    public void setTransacoes(Long transacoes) {
        this.transacoes = transacoes;
    }
}