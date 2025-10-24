# Script para hacer push de imágenes a ECR
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("backend", "frontend", "both")]
    [string]$Service = "both"
)

Write-Host "=== Push to ECR ===" -ForegroundColor Cyan

# Configuración
$ECR_REGISTRY = "861455913678.dkr.ecr.us-east-2.amazonaws.com"
$ECR_REPOSITORY = "hpmm-sgi-repo"
$AWS_REGION = "us-east-2"
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"

# Función para push de imagen
function Push-Image {
    param($ImageName, $SourcePath)
    
    Write-Host "`n=== Procesando $ImageName ===" -ForegroundColor Magenta
    
    # Login a ECR
    Write-Host "`n1. Login a ECR..." -ForegroundColor Yellow
    try {
        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
        Write-Host "✅ Login exitoso" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error en login: $_" -ForegroundColor Red
        return $false
    }
    
    # Build
    Write-Host "`n2. Building Docker image..." -ForegroundColor Yellow
    $TAG_TIMESTAMP = "$ImageName-$TIMESTAMP"
    $TAG_LATEST = "$ImageName-latest"
    
    try {
        if ($ImageName -eq "backend") {
            docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_TIMESTAMP} -f ${SourcePath}/Dockerfile ${SourcePath}
        } else {
            # Para frontend, necesitamos el build arg
            $VITE_API_URL = Read-Host "Ingresa VITE_API_URL (o Enter para usar default)"
            if ([string]::IsNullOrEmpty($VITE_API_URL)) {
                $VITE_API_URL = "http://backend:3000"
            }
            docker build --build-arg VITE_API_URL=$VITE_API_URL -t ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_TIMESTAMP} -f ${SourcePath}/Dockerfile ${SourcePath}
        }
        Write-Host "✅ Build exitoso" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error en build: $_" -ForegroundColor Red
        return $false
    }
    
    # Tag latest
    Write-Host "`n3. Tagging image..." -ForegroundColor Yellow
    docker tag ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_TIMESTAMP} ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_LATEST}
    
    # Push
    Write-Host "`n4. Pushing to ECR..." -ForegroundColor Yellow
    try {
        docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_TIMESTAMP}
        docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_LATEST}
        Write-Host "✅ Push exitoso" -ForegroundColor Green
        
        Write-Host "`n📦 Imágenes pusheadas:" -ForegroundColor Cyan
        Write-Host "  - ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_TIMESTAMP}" -ForegroundColor White
        Write-Host "  - ${ECR_REGISTRY}/${ECR_REPOSITORY}:${TAG_LATEST}" -ForegroundColor White
        
        return $true
    } catch {
        Write-Host "❌ Error en push: $_" -ForegroundColor Red
        return $false
    }
}

# Ejecutar según parámetro
if ($Service -eq "backend" -or $Service -eq "both") {
    $result = Push-Image -ImageName "backend" -SourcePath "./hpmm-api"
    if (-not $result) {
        Write-Host "`n❌ Error al procesar backend" -ForegroundColor Red
        exit 1
    }
}

if ($Service -eq "frontend" -or $Service -eq "both") {
    $result = Push-Image -ImageName "frontend" -SourcePath "./hpmm-iu"
    if (-not $result) {
        Write-Host "`n❌ Error al procesar frontend" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ Proceso completado exitosamente!" -ForegroundColor Green
Write-Host "`nPara ver las imágenes en ECR:" -ForegroundColor Yellow
Write-Host "  aws ecr describe-images --repository-name $ECR_REPOSITORY --region $AWS_REGION" -ForegroundColor White
