package com.endered.dashboard.controller;

import com.endered.dashboard.dto.cartao.CartaoRequestDTO;
import com.endered.dashboard.dto.cartao.CartaoResponseDTO;
import com.endered.dashboard.service.CartaoService;
import com.endered.dashboard.service.DashboardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final CartaoService cartaoService;

    // DASHBOARD

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }

    @GetMapping("/impacto")
    public ResponseEntity<?> getImpactoAmbiental() {
        return ResponseEntity.ok(dashboardService.calcularImpactoAmbiental());
    }

    @GetMapping("/heatmap")
    public ResponseEntity<?> getHeatMap() {
        return ResponseEntity.ok(dashboardService.gerarHeatMap());
    }

    // CARTÕES

    @GetMapping("/cartoes")
    public ResponseEntity<?> listarCartoes() {
        return ResponseEntity.ok(cartaoService.listarTodos());
    }

    @PostMapping("/cartoes")
    public ResponseEntity<?> solicitarCartao(
            @Valid @RequestBody CartaoRequestDTO dto) {

        CartaoResponseDTO response = cartaoService.solicitarCartao(dto);

        return ResponseEntity.ok(response);
    }
}