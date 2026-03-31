package br.com.greenpayimpact.calculadora.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
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
}