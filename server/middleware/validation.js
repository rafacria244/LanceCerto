import { body, validationResult } from 'express-validator';

// Validação para geração de propostas
export const validateProposalInput = [
  body('perfil')
    .trim()
    .notEmpty()
    .withMessage('Perfil é obrigatório')
    .isLength({ max: 2000 })
    .withMessage('Perfil deve ter no máximo 2000 caracteres')
    .escape(),
  
  body('descricao_job')
    .trim()
    .notEmpty()
    .withMessage('Descrição do job é obrigatória')
    .isLength({ max: 5000 })
    .withMessage('Descrição do job deve ter no máximo 5000 caracteres')
    .escape(),
  
  body('propostas_antigas')
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage('Propostas antigas deve ter no máximo 3000 caracteres')
    .escape(),
  
  body('userId')
    .notEmpty()
    .withMessage('userId é obrigatório')
    .isUUID()
    .withMessage('userId deve ser um UUID válido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    next();
  }
];

// Validação para userId
export const validateUserId = [
  body('userId')
    .notEmpty()
    .withMessage('userId é obrigatório')
    .isUUID()
    .withMessage('userId deve ser um UUID válido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'userId inválido',
        details: errors.array() 
      });
    }
    next();
  }
];

// Validação para checkout
export const validateCheckout = [
  body('priceId')
    .notEmpty()
    .withMessage('priceId é obrigatório')
    .matches(/^price_[a-zA-Z0-9]+$/)
    .withMessage('priceId deve começar com "price_"'),
  
  body('userId')
    .notEmpty()
    .withMessage('userId é obrigatório')
    .isUUID()
    .withMessage('userId deve ser um UUID válido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }
    next();
  }
];
