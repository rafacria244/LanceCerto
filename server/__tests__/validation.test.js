import { describe, it, expect } from '@jest/globals';

// Funções de validação que serão criadas
const validateProposalInput = (data) => {
  const errors = [];
  
  if (!data.perfil || typeof data.perfil !== 'string' || data.perfil.trim().length === 0) {
    errors.push('Perfil é obrigatório e deve ser uma string não vazia');
  }
  
  if (data.perfil && data.perfil.length > 2000) {
    errors.push('Perfil deve ter no máximo 2000 caracteres');
  }
  
  if (!data.descricao_job || typeof data.descricao_job !== 'string' || data.descricao_job.trim().length === 0) {
    errors.push('Descrição do job é obrigatória e deve ser uma string não vazia');
  }
  
  if (data.descricao_job && data.descricao_job.length > 5000) {
    errors.push('Descrição do job deve ter no máximo 5000 caracteres');
  }
  
  if (data.propostas_antigas && typeof data.propostas_antigas !== 'string') {
    errors.push('Propostas antigas deve ser uma string');
  }
  
  if (data.propostas_antigas && data.propostas_antigas.length > 3000) {
    errors.push('Propostas antigas deve ter no máximo 3000 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    return { isValid: false, error: 'userId é obrigatório e deve ser uma string' };
  }
  
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return { isValid: false, error: 'userId deve ser um UUID válido' };
  }
  
  return { isValid: true };
};

describe('Input Validation', () => {
  describe('validateProposalInput', () => {
    it('deve validar input correto', () => {
      const input = {
        perfil: 'Desenvolvedor Full Stack com 5 anos de experiência',
        descricao_job: 'Preciso de um site em React',
        propostas_antigas: 'Olá, tenho experiência...'
      };
      
      const result = validateProposalInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve rejeitar perfil vazio', () => {
      const input = {
        perfil: '',
        descricao_job: 'Preciso de um site'
      };
      
      const result = validateProposalInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Perfil é obrigatório e deve ser uma string não vazia');
    });

    it('deve rejeitar descrição do job vazia', () => {
      const input = {
        perfil: 'Desenvolvedor',
        descricao_job: ''
      };
      
      const result = validateProposalInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Descrição do job é obrigatória e deve ser uma string não vazia');
    });

    it('deve rejeitar perfil muito longo', () => {
      const input = {
        perfil: 'a'.repeat(2001),
        descricao_job: 'Preciso de um site'
      };
      
      const result = validateProposalInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Perfil deve ter no máximo 2000 caracteres');
    });

    it('deve rejeitar descrição muito longa', () => {
      const input = {
        perfil: 'Desenvolvedor',
        descricao_job: 'a'.repeat(5001)
      };
      
      const result = validateProposalInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Descrição do job deve ter no máximo 5000 caracteres');
    });
  });

  describe('validateUserId', () => {
    it('deve validar UUID correto', () => {
      const result = validateUserId('550e8400-e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(true);
    });

    it('deve rejeitar userId vazio', () => {
      const result = validateUserId('');
      expect(result.isValid).toBe(false);
    });

    it('deve rejeitar UUID inválido', () => {
      const result = validateUserId('invalid-uuid');
      expect(result.isValid).toBe(false);
    });
  });
});

export { validateProposalInput, validateUserId };
