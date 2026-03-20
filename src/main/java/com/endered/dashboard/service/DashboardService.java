package com.endered.dashboard.service;

import com.endered.dashboard.model.HeatMapPoint;
import com.endered.dashboard.model.ImpactoAmbiental;

import java.util.List;
import java.util.Map;

public interface DashboardService {

    ImpactoAmbiental calcularImpactoAmbiental();

    List<HeatMapPoint> gerarHeatMap();

    Map<String, Object> getDashboardData();
}