package br.com.greenpayimpact.calculadora.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fatores_emissao")
public class FatorEmissao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransacao tipo;

    @Column(nullable = false, precision = 10, scale = 5)
    private BigDecimal valor;

    @Column(nullable = false)
    private String fonteMetodologia;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataVigencia;

    @Column(nullable = false)
    private Boolean ativo;

    public FatorEmissao() {
        this.dataVigencia = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoTransacao getTipo() { return tipo; }
    public void setTipo(TipoTransacao tipo) { this.tipo = tipo; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public String getFonteMetodologia() { return fonteMetodologia; }
    public void setFonteMetodologia(String fonteMetodologia) { this.fonteMetodologia = fonteMetodologia; }

    public LocalDateTime getDataVigencia() { return dataVigencia; }
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}