# Script para configurar push para GitHub
# Execute: .\configurar-push.ps1

Write-Host "🚀 Configurar Push para GitHub" -ForegroundColor Cyan
Write-Host ""

# Verificar remote atual
Write-Host "📋 Remote atual:" -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "⚠️  O remote está configurado com 'SEU_TOKEN' como placeholder." -ForegroundColor Red
Write-Host ""
Write-Host "📝 Para fazer push, você precisa:" -ForegroundColor White
Write-Host ""
Write-Host "1️⃣  Criar um Token de Acesso no GitHub:" -ForegroundColor Cyan
Write-Host "   https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host "   → Generate new token (classic)" -ForegroundColor Gray
Write-Host "   → Marque 'repo' e gere o token" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Configurar o remote com seu token:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   git remote set-url origin https://Faelzin09663:SEU_TOKEN_AQUI@github.com/Faelzin09663/Rafael.git" -ForegroundColor Green
Write-Host ""
Write-Host "   (Substitua SEU_TOKEN_AQUI pelo token que você copiou)" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Fazer push:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   git push -u origin main" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Veja SOLUCAO_PUSH_GITHUB.md para instruções detalhadas" -ForegroundColor Yellow
Write-Host ""

# Verificar se já tem commits
$hasCommits = git log --oneline -1 2>$null
if ($hasCommits) {
    Write-Host "✅ Você já tem commits locais prontos para push!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Você ainda não fez commits. Execute: git add . && git commit -m 'mensagem'" -ForegroundColor Yellow
}


