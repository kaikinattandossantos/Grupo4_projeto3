package com.endered.dashboard.dto.cartao;

public class CartaoResponseDTO {

    private Long id;
    private String status;

    public CartaoResponseDTO(Long id, String status) {
        this.id = id;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }
}