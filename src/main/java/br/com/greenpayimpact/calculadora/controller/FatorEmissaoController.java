package br.com.greenpayimpact.calculadora.controller;

import br.com.greenpayimpact.calculadora.dto.FatorEmissaoRequest;
import br.com.greenpayimpact.calculadora.dto.FatorEmissaoResponse;
import br.com.greenpayimpact.calculadora.service.FatorEmissaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fatores")
public class FatorEmissaoController {

    @Autowired
    private FatorEmissaoService service;

    @PostMapping
    public ResponseEntity<FatorEmissaoResponse> cadastrarFator(@RequestBody @Valid FatorEmissaoRequest request) {
        FatorEmissaoResponse response = service.adicionarFator(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<FatorEmissaoResponse>> listarHistorico() {
        return ResponseEntity.ok(service.listarHistoricoCompleto());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<FatorEmissaoResponse>> listarAtivos() {
        return ResponseEntity.ok(service.listarFatoresAtivos());
    }
}