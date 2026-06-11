package br.com.greenpayimpact.calculadora.dto;

import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FatorEmissaoResponse(
        Long id,
        TipoTransacao tipo,
        BigDecimal valor,
        String fonteMetodologia,
        LocalDateTime dataVigencia,
        Boolean ativo
)
 {

    public FatorEmissaoResponse(FatorEmissao fator) {
        this(fator.getId(), fator.getTipo(), fator.getValor(), 
             fator.getFonteMetodologia(), fator.getDataVigencia(), fator.getAtivo());
    }
}