package br.com.greenpayimpact.calculadora.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.greenpayimpact.calculadora.dto.FatorEmissaoRequest;
import br.com.greenpayimpact.calculadora.dto.FatorEmissaoResponse;
import br.com.greenpayimpact.calculadora.service.FatorEmissaoService;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/fatores")
public class FatorEmissaoController {

    @Autowired
    private FatorEmissaoService service;

    @PostMapping
    public ResponseEntity<?> cadastrarFator(@RequestBody @Valid FatorEmissaoRequest request) {
    try {
        FatorEmissaoResponse response = service.adicionarFator(request);
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
    }
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