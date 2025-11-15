import express from 'express';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const router = express.Router();

// Função para obter cliente Supabase
const getSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase não está configurado');
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

// Função para verificar assinatura
const checkSubscription = async (userId, requiredPlan = 'starter') => {
  const supabase = getSupabaseClient();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single();

  if (!subscription || subscription.status !== 'active') {
    return { allowed: false, reason: 'Assinatura não ativa' };
  }

  const planHierarchy = { free: 0, starter: 1, premium: 2 };
  const userPlanLevel = planHierarchy[subscription.plan] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

  if (userPlanLevel < requiredPlanLevel) {
    return { allowed: false, reason: `Plano ${requiredPlan} necessário` };
  }

  return { allowed: true };
};

// Exportar PDF
router.post('/pdf', async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'userId e content são obrigatórios' });
    }

    // Verificar assinatura (Starter ou Premium)
    const subscriptionCheck = await checkSubscription(userId, 'starter');
    if (!subscriptionCheck.allowed) {
      return res.status(403).json({ 
        error: 'Funcionalidade disponível apenas para assinantes Starter ou Premium',
        code: 'SUBSCRIPTION_REQUIRED'
      });
    }

    // Gerar PDF usando pdfkit
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=proposta.pdf');
      res.send(pdfBuffer);
    });

    doc.fontSize(12);
    doc.font('Helvetica');
    
    // Dividir conteúdo em parágrafos e adicionar ao PDF
    const paragraphs = content.split('\n\n');
    paragraphs.forEach((paragraph, index) => {
      if (index > 0) {
        doc.moveDown();
      }
      doc.text(paragraph.trim(), {
        align: 'left',
        lineGap: 5
      });
    });
    
    doc.end();
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
});

// Exportar DOCX
router.post('/docx', async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'userId e content são obrigatórios' });
    }

    // Verificar assinatura (Starter ou Premium)
    const subscriptionCheck = await checkSubscription(userId, 'starter');
    if (!subscriptionCheck.allowed) {
      return res.status(403).json({ 
        error: 'Funcionalidade disponível apenas para assinantes Starter ou Premium',
        code: 'SUBSCRIPTION_REQUIRED'
      });
    }

    // Gerar DOCX usando docx library
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                font: 'Arial',
                size: 24, // 12pt
              }),
            ],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=proposta.docx');
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao exportar DOCX:', error);
    res.status(500).json({ error: 'Erro ao gerar DOCX' });
  }
});

export default router;

