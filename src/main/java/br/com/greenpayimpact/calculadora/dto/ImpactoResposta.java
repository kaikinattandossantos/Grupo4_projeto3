package br.com.greenpayimpact.calculadora.dto;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@Builder
public class ImpactoResposta {
    private BigDecimal impactoFisico;
    private BigDecimal impactoDigital;
    private BigDecimal co2Evitado;
    
    private Double arvoresEquivalentes;
    private Double kmEvitados;
    private Integer garrafasPetEvitadas;
}