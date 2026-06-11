package br.com.greenpayimpact.calculadora.dto;

import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record FatorEmissaoRequest(
        @NotNull(message = "O tipo de transação é obrigatório") 
        TipoTransacao tipo,
        
        @NotNull(message = "O valor do fator é obrigatório") 
        @DecimalMin(value = "0.0", inclusive = false, message = "O valor deve ser maior que zero")
        BigDecimal valor,
        
        @NotBlank(message = "A fonte/metodologia é obrigatória") 
        String fonteMetodologia
) {}
