package com.endered.dashboard.dto.cartao;

import com.endered.dashboard.model.DigitalCard;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartaoRequestDTO {

    @NotBlank
    private String nome;

    @Email
    @NotBlank
    private String email;

    private String cpf;

    @NotBlank
    private String telefone;

    @NotBlank
    private String cidade;

    @NotBlank
    private String estado;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @NotNull
    private DigitalCard.TipoCartao tipoCartao;
}