<#
  publish-to-github.ps1

  Helper script to help push local repository to GitHub.
  - prompts for GitHub token (or will use stored credentials if present)
  - optionally creates a remote origin if missing
  - performs initial push

  Usage: in PowerShell run:
    .\scripts\publish-to-github.ps1 -RepoOwner "Faelzin09663" -RepoName "Rafael"

  Warning: This script will not expose your token in logs; use with care.
#>

param(
    [string]$RepoOwner = "Faelzin09663",
    [string]$RepoName = "Rafael",
    [switch]$UseSSH
)

function Set-RemoteWithHttpsToken {
    param($owner, $repo)
    $token = Read-Host -Prompt "Digite seu GitHub Personal Access Token (será ocultado)" -AsSecureString
    $plainToken = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

    $url = "https://$owner:$plainToken@github.com/$owner/$repo.git"
    git remote remove origin -f 2>$null | Out-Null
    git remote add origin $url
    Write-Host "Remote origin set to HTTPS with token (hidden)" -ForegroundColor Green
}

function Set-RemoteWithSSH {
    param($owner, $repo)
    $url = "git@github.com:$owner/$repo.git"
    git remote remove origin -f 2>$null | Out-Null
    git remote add origin $url
    Write-Host "Remote origin set to SSH $url" -ForegroundColor Green
}

try {
    git status >$null 2>&1
} catch {
    Write-Host "ERRO: Este diretório não é um repositório Git. Execute 'git init' antes." -ForegroundColor Red
    exit 1
}

if (-not $UseSSH) {
    Write-Host "🔐 Preparando origem HTTPS com token..." -ForegroundColor Cyan
    Set-RemoteWithHttpsToken -owner $RepoOwner -repo $RepoName
} else {
    Write-Host "🔑 Preparando origem SSH..." -ForegroundColor Cyan
    Set-RemoteWithSSH -owner $RepoOwner -repo $RepoName
}

Write-Host "📦 Fazendo primeiro push para origin/main (branch principal: main)" -ForegroundColor Yellow
git add -A
git commit -m "chore: initial commit" -q 2>$null || Write-Host "Nenhuma mudança para commitar" -ForegroundColor DarkYellow
git push -u origin main

Write-Host "✅ Push realizado. Verifique seu repositório no GitHub." -ForegroundColor Green
