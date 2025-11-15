# Script para configurar Git para o repositório LanceCerto
# Execute: .\configurar-git.ps1

Write-Host "🔧 Configurando Git para LanceCerto.ai" -ForegroundColor Cyan
Write-Host ""

# Verificar se já está configurado
Write-Host "📋 Configuração atual:" -ForegroundColor Yellow
Write-Host "Usuário: $(git config --global user.name)"
Write-Host "Email: $(git config --global user.email)"
Write-Host ""

# Verificar remote
Write-Host "🔗 Remote configurado:" -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "⚠️  Para fazer push, você precisa:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Criar um Token de Acesso Pessoal no GitHub:" -ForegroundColor White
Write-Host "   https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Executar o comando abaixo (substitua SEU_TOKEN):" -ForegroundColor White
Write-Host ""
Write-Host "   git remote set-url origin https://Faelzin09663:SEU_TOKEN@github.com/Faelzin09663/Rafael.git" -ForegroundColor Green
Write-Host ""
Write-Host "3. Depois fazer push:" -ForegroundColor White
Write-Host ""
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Veja o arquivo CORRIGIR_GIT_AUTH.md para instruções detalhadas" -ForegroundColor Yellow


