package com.endered.dashboard.service.impl;

import com.endered.dashboard.model.DigitalCard;
import com.endered.dashboard.model.HeatMapPoint;
import com.endered.dashboard.model.ImpactoAmbiental;
import com.endered.dashboard.repository.DigitalCardRepository;
import com.endered.dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DigitalCardRepository repository;

    @Override
    @Transactional(readOnly = true)
    public ImpactoAmbiental calcularImpactoAmbiental() {
        long total = repository.count();
        long ativos = repository.countByStatus(DigitalCard.StatusSolicitacao.ATIVO);
        return ImpactoAmbiental.calcular(total, ativos);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HeatMapPoint> gerarHeatMap() {

        List<Object[]> rawData = repository.findHeatMapData();
        if (rawData.isEmpty()) return Collections.emptyList();

        long maxQty = rawData.stream()
                .mapToLong(row -> ((Number) row[4]).longValue())
                .max()
                .orElse(1L);

        return rawData.stream().map(row -> {
            long qty = ((Number) row[4]).longValue();

            return HeatMapPoint.builder()
                    .cidade((String) row[0])
                    .estado((String) row[1])
                    .latitude((Double) row[2])
                    .longitude((Double) row[3])
                    .quantidade(qty)
                    .intensidade((double) qty / maxQty)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardData() {

        Map<String, Object> data = new LinkedHashMap<>();

        data.put("impacto", calcularImpactoAmbiental());
        data.put("heatmap", gerarHeatMap());
        data.put("recentesSolicitacoes",
                repository.findTop10ByOrderByDataSolicitacaoDesc());

        return data;
    }
}