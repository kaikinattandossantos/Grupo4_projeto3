package br.com.greenpayimpact.calculadora.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fatores_conversao_analogia")
public class FatorConversaoAnalogia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nomeMetrica;

    @Column(nullable = false, precision = 12, scale = 5)
    private BigDecimal valor;

    @Column(nullable = false)
    private String unidade;

    @Column(nullable = false)
    private String fonteMetodologia;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataAtualizacao;

    public FatorConversaoAnalogia() {
        this.dataAtualizacao = LocalDateTime.now();
    }

    public FatorConversaoAnalogia(String nomeMetrica, BigDecimal valor, String unidade, String fonteMetodologia) {
        this.nomeMetrica = nomeMetrica;
        this.valor = valor;
        this.unidade = unidade;
        this.fonteMetodologia = fonteMetodologia;
        this.dataAtualizacao = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeMetrica() { return nomeMetrica; }
    public void setNomeMetrica(String nomeMetrica) { this.nomeMetrica = nomeMetrica; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public String getUnidade() { return unidade; }
    public void setUnidade(String unidade) { this.unidade = unidade; }

    public String getFonteMetodologia() { return fonteMetodologia; }
    public void setFonteMetodologia(String fonteMetodologia) { this.fonteMetodologia = fonteMetodologia; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}