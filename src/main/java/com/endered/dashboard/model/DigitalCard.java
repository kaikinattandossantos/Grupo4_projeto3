package com.endered.dashboard.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "digital_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100)
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    @Column(nullable = false)
    private String cpf;

    @NotBlank(message = "Telefone é obrigatório")
    @Column(nullable = false)
    private String telefone;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(nullable = false)
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCartao tipoCartao;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusSolicitacao status = StatusSolicitacao.PENDENTE;

    @Column(nullable = false)
    private LocalDateTime dataSolicitacao;

    private LocalDateTime dataAprovacao;

    @PrePersist
    protected void onCreate() {
        dataSolicitacao = LocalDateTime.now();
    }

    public enum TipoCartao {
        CARTAO_BENEFICIOS,
        CARTAO_PRESENTE,
        CARTAO_FIDELIDADE,
        CARTAO_CORPORATIVO
    }

    public enum StatusSolicitacao {
        PENDENTE,
        APROVADO,
        PROCESSANDO,
        ATIVO
    }
}