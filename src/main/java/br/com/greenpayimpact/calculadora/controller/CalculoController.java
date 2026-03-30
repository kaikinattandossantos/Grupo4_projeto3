package br.com.greenpayimpact.calculadora.controller;

import br.com.greenpayimpact.calculadora.dto.CalculoRequest;
import br.com.greenpayimpact.calculadora.service.CalculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CalculoController {

    @Autowired
    private CalculoService calculoService;

    /**
     * Baseado nos fatores: Físico (0,0005kg) e Digital (0,00002kg)
     */
    @PostMapping("/calcular-impacto")
    public Map<String, BigDecimal> executarCalculo(@RequestBody CalculoRequest request) {
        return calculoService.calcularImpacto(request.getTransacoes());
    }
}