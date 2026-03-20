package com.endered.dashboard.service;

import com.endered.dashboard.dto.cartao.CartaoRequestDTO;
import com.endered.dashboard.dto.cartao.CartaoResponseDTO;
import com.endered.dashboard.model.DigitalCard;

import java.util.List;

public interface CartaoService {

    CartaoResponseDTO solicitarCartao(CartaoRequestDTO dto);

    List<DigitalCard> listarTodos();
}