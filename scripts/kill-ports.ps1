# Script para matar processos nas portas 3000 e 3001
Write-Host "🔍 Verificando processos nas portas 3000 e 3001..." -ForegroundColor Yellow

# Porta 3000
$port3000 = netstat -ano | findstr :3000 | Select-String "LISTENING"
if ($port3000) {
    $pid = ($port3000 -split '\s+')[-1]
    Write-Host "⚠️  Processo encontrado na porta 3000 (PID: $pid)" -ForegroundColor Red
    taskkill /F /PID $pid 2>$null
    Write-Host "✅ Processo na porta 3000 finalizado" -ForegroundColor Green
} else {
    Write-Host "✅ Porta 3000 está livre" -ForegroundColor Green
}

# Porta 3001
$port3001 = netstat -ano | findstr :3001 | Select-String "LISTENING"
if ($port3001) {
    $pid = ($port3001 -split '\s+')[-1]
    Write-Host "⚠️  Processo encontrado na porta 3001 (PID: $pid)" -ForegroundColor Red
    taskkill /F /PID $pid 2>$null
    Write-Host "✅ Processo na porta 3001 finalizado" -ForegroundColor Green
} else {
    Write-Host "✅ Porta 3001 está livre" -ForegroundColor Green
}

Write-Host "`n✨ Limpeza concluída! Agora você pode executar 'npm run dev'" -ForegroundColor Cyan

