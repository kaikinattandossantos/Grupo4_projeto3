package br.com.greenpayimpact.calculadora.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false)
    private Long qtdTransacoesAnuais;

    @Column(nullable = false, length = 14)
    private String cnpj;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "fator_fisico_id", nullable = false)
    private Long fatorFisicoId;

    @Column(name = "fator_digital_id", nullable = false)
    private Long fatorDigitalId;

    public Empresa() {
        this.criadoEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRazaoSocial() { return razaoSocial; }
    public void setRazaoSocial(String razaoSocial) { this.razaoSocial = razaoSocial; }

    public Long getQtdTransacoesAnuais() { return qtdTransacoesAnuais; }
    public void setQtdTransacoesAnuais(Long qtdTransacoesAnuais) { this.qtdTransacoesAnuais = qtdTransacoesAnuais; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getCriadoEm() { return criadoEm; }

    public Long getFatorFisicoId() { return fatorFisicoId; }
    public void setFatorFisicoId(Long fatorFisicoId) { this.fatorFisicoId = fatorFisicoId; }
    
    public Long getFatorDigitalId() { return fatorDigitalId; }
    public void setFatorDigitalId(Long fatorDigitalId) { this.fatorDigitalId = fatorDigitalId; }
}