package br.com.greenpayimpact.calculadora.repository;

import br.com.greenpayimpact.calculadora.model.ResultadoCalculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultadoCalculoRepository extends JpaRepository<ResultadoCalculo, Long> {
    
    @Query("SELECT r FROM ResultadoCalculo r JOIN FETCH r.empresa ORDER BY r.dataCalculo DESC")
    List<ResultadoCalculo> findByEmpresaIsNotNullOrderByDataCalculoDesc();
}