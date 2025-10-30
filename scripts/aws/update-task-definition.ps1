# Script para actualizar Task Definition con variables de entorno
# Ejecutar DESPUÉS de tener las credenciales de Upstash Redis

param(
    [Parameter(Mandatory=$true)]
    [string]$RedisUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$DbHost = "localhost",
    
    [Parameter(Mandatory=$false)]
    [string]$DbPassword = "postgres",
    
    [Parameter(Mandatory=$false)]
    [string]$JwtSecret = "your-super-secret-jwt-key-change-this"
)

$env:Path += ";C:\Program Files\Amazon\AWSCLIV2"

Write-Host "`n=== Actualizando Task Definition con Variables de Entorno ===" -ForegroundColor Cyan

# 1. Obtener la Task Definition actual
Write-Host "`n1. Obteniendo Task Definition actual..." -ForegroundColor Yellow
$currentTaskDef = aws ecs describe-task-definition --task-definition mi-task-definition --region us-east-2 --output json | ConvertFrom-Json

$taskDef = $currentTaskDef.taskDefinition

# 2. Preparar nueva versión con variables de entorno
Write-Host "2. Preparando nueva configuración..." -ForegroundColor Yellow

# Actualizar container de backend con variables de entorno
$backendContainer = $taskDef.containerDefinitions | Where-Object { $_.name -eq "backend-sgi" }

if ($backendContainer) {
    Write-Host "   Configurando variables para backend-sgi..." -ForegroundColor White
    
    $backendContainer.environment = @(
        @{ name = "NODE_ENV"; value = "production" },
    @{ name = "PORT"; value = "8443" },
        @{ name = "REDIS_URL"; value = $RedisUrl },
        @{ name = "DB_HOST"; value = $DbHost },
        @{ name = "DB_PORT"; value = "5432" },
        @{ name = "DB_USER"; value = "postgres" },
        @{ name = "DB_PASSWORD"; value = $DbPassword },
        @{ name = "DB_NAME"; value = "hpmm_sgi" },
        @{ name = "SCHEMA"; value = "mi_esquema" },
        @{ name = "JWT_SECRET"; value = $JwtSecret },
        @{ name = "CORS_ORIGIN"; value = "*" }
    )
    
    Write-Host "   Variables configuradas:" -ForegroundColor Green
    Write-Host "     - NODE_ENV: production" -ForegroundColor Gray
    Write-Host "     - PORT: 8443" -ForegroundColor Gray
    Write-Host "     - REDIS_URL: $RedisUrl" -ForegroundColor Gray
    Write-Host "     - DB_HOST: $DbHost" -ForegroundColor Gray
    Write-Host "     - DB_NAME: hpmm_sgi" -ForegroundColor Gray
    Write-Host "     - SCHEMA: mi_esquema" -ForegroundColor Gray
}

# Limpiar campos que no se pueden usar en register-task-definition
$taskDef.PSObject.Properties.Remove('taskDefinitionArn')
$taskDef.PSObject.Properties.Remove('revision')
$taskDef.PSObject.Properties.Remove('status')
$taskDef.PSObject.Properties.Remove('requiresAttributes')
$taskDef.PSObject.Properties.Remove('compatibilities')
$taskDef.PSObject.Properties.Remove('registeredAt')
$taskDef.PSObject.Properties.Remove('registeredBy')

# 3. Guardar JSON temporal
Write-Host "`n3. Guardando configuración temporal..." -ForegroundColor Yellow
$tempFile = "task-definition-updated.json"
$taskDef | ConvertTo-Json -Depth 10 | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "   Archivo guardado: $tempFile" -ForegroundColor Green

# 4. Registrar nueva Task Definition
Write-Host "`n4. Registrando nueva Task Definition en AWS..." -ForegroundColor Yellow

$registerResult = aws ecs register-task-definition --cli-input-json "file://$tempFile" --region us-east-2 --output json | ConvertFrom-Json

if ($registerResult.taskDefinition) {
    $newRevision = $registerResult.taskDefinition.revision
    Write-Host "   Nueva revision registrada: mi-task-definition:$newRevision" -ForegroundColor Green
    
    # 5. Actualizar Service para usar nueva Task Definition
    Write-Host "`n5. Actualizando Service ECS..." -ForegroundColor Yellow
    
    $updateResult = aws ecs update-service `
        --cluster hpmm-sgi-cluster `
        --service hpmm-sgi `
        --task-definition "mi-task-definition:$newRevision" `
        --force-new-deployment `
        --region us-east-2 `
        --output json | ConvertFrom-Json
    
    if ($updateResult.service) {
        Write-Host "   Service actualizado exitosamente!" -ForegroundColor Green
        Write-Host "`n6. Esperando nuevo deployment..." -ForegroundColor Yellow
        Write-Host "   Esto tomara 2-3 minutos mientras:" -ForegroundColor White
        Write-Host "     - Se detiene la task antigua" -ForegroundColor Gray
        Write-Host "     - Se inicia la nueva task con variables configuradas" -ForegroundColor Gray
        Write-Host "     - Se validan health checks" -ForegroundColor Gray
        
        Write-Host "`n   Puedes monitorear el progreso en:" -ForegroundColor Cyan
        Write-Host "   https://console.aws.amazon.com/ecs/v2/clusters/hpmm-sgi-cluster/services/hpmm-sgi" -ForegroundColor Blue
        
        # Esperar un poco y obtener nueva IP
        Write-Host "`n   Esperando 30 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        Write-Host "`n7. Obteniendo nueva IP publica..." -ForegroundColor Yellow
        $TASK_ARN = (aws ecs list-tasks --cluster hpmm-sgi-cluster --region us-east-2 --query "taskArns[0]" --output text)
        
        if ($TASK_ARN -and $TASK_ARN -ne "None") {
            $ENI_ID = (aws ecs describe-tasks --cluster hpmm-sgi-cluster --tasks $TASK_ARN --region us-east-2 --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text)
            $PUBLIC_IP = (aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --region us-east-2 --query "NetworkInterfaces[0].Association.PublicIp" --output text)
            
            Write-Host "`n========================================" -ForegroundColor Green
            Write-Host "DEPLOYMENT COMPLETADO!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "`nNueva IP publica: $PUBLIC_IP" -ForegroundColor Cyan
            Write-Host "`nPrueba tu aplicacion:" -ForegroundColor Yellow
            Write-Host "  Frontend: http://$PUBLIC_IP" -ForegroundColor White
            Write-Host "  Backend:  https://$PUBLIC_IP:8443/health" -ForegroundColor White
            
            Write-Host "`nVerifica los logs:" -ForegroundColor Yellow
            Write-Host "  aws logs tail /ecs/mi-task-definition --region us-east-2 --follow" -ForegroundColor Gray
        } else {
            Write-Host "   La nueva task aun no esta lista. Espera 1-2 minutos mas." -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ERROR al actualizar el service" -ForegroundColor Red
    }
} else {
    Write-Host "   ERROR al registrar Task Definition" -ForegroundColor Red
}

# Limpiar archivo temporal
Remove-Item $tempFile -ErrorAction SilentlyContinue

Write-Host "`n========================================" -ForegroundColor Gray
