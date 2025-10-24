# Script para configurar AWS CLI
Write-Host "=== Configurando AWS CLI ===" -ForegroundColor Cyan

# Credenciales - REEMPLAZA CON TUS VALORES
$AWS_ACCESS_KEY_ID = "TU_ACCESS_KEY_ID_AQUI"
$AWS_SECRET_ACCESS_KEY = "TU_SECRET_ACCESS_KEY_AQUI"
$AWS_REGION = "us-east-2"

Write-Host "`n1. Configurando credenciales..." -ForegroundColor Yellow

# Crear directorio .aws si no existe
$AWS_DIR = "$env:USERPROFILE\.aws"
if (-not (Test-Path $AWS_DIR)) {
    New-Item -ItemType Directory -Path $AWS_DIR -Force | Out-Null
}

# Escribir credentials
$CREDENTIALS_CONTENT = @"
[default]
aws_access_key_id = $AWS_ACCESS_KEY_ID
aws_secret_access_key = $AWS_SECRET_ACCESS_KEY
"@

$CREDENTIALS_CONTENT | Out-File -FilePath "$AWS_DIR\credentials" -Encoding ascii -Force

# Escribir config
$CONFIG_CONTENT = @"
[default]
region = $AWS_REGION
output = json
"@

$CONFIG_CONTENT | Out-File -FilePath "$AWS_DIR\config" -Encoding ascii -Force

Write-Host "✅ Credenciales configuradas en: $AWS_DIR" -ForegroundColor Green

# Verificar si AWS CLI está instalado
Write-Host "`n2. Verificando AWS CLI..." -ForegroundColor Yellow
try {
    $AWS_VERSION = aws --version 2>&1
    Write-Host "✅ AWS CLI instalado: $AWS_VERSION" -ForegroundColor Green
    
    # Test de conexión
    Write-Host "`n3. Probando conexión..." -ForegroundColor Yellow
    $IDENTITY = aws sts get-caller-identity 2>&1 | ConvertFrom-Json
    
    Write-Host "`n✅ Conexión exitosa!" -ForegroundColor Green
    Write-Host "Account ID: $($IDENTITY.Account)" -ForegroundColor Cyan
    Write-Host "User ARN: $($IDENTITY.Arn)" -ForegroundColor Cyan
    Write-Host "Region: $AWS_REGION" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n⚠️  AWS CLI no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "`nInstala AWS CLI con:" -ForegroundColor Yellow
    Write-Host "  winget install Amazon.AWSCLI" -ForegroundColor White
    Write-Host "`nDespués, reinicia PowerShell y ejecuta este script de nuevo." -ForegroundColor Yellow
}
