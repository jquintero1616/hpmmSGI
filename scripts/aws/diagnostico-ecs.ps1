# Script de diagnóstico ECS para HPMM SGI
Write-Host "`n=== DIAGNOSTICO ECS - HPMM SGI ===" -ForegroundColor Cyan
Write-Host "Region: us-east-2`n" -ForegroundColor Yellow

# Verificar AWS CLI
Write-Host "Verificando AWS CLI..." -ForegroundColor Cyan
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "✅ Usuario: $($identity.UserId)" -ForegroundColor Green
    Write-Host "✅ Cuenta: $($identity.Account)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: AWS CLI no configurado correctamente" -ForegroundColor Red
    exit 1
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# 1. Verificar Cluster
Write-Host "`n1️⃣ CLUSTER ECS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$clusters = aws ecs list-clusters --region us-east-2 --output json | ConvertFrom-Json

if ($clusters.clusterArns.Count -eq 0) {
    Write-Host "❌ No se encontraron clusters" -ForegroundColor Red
} else {
    Write-Host "✅ Clusters encontrados:" -ForegroundColor Green
    foreach ($clusterArn in $clusters.clusterArns) {
        $clusterName = $clusterArn.Split('/')[-1]
        Write-Host "   • $clusterName" -ForegroundColor White
        
        # Detalles del cluster
        $clusterDetails = aws ecs describe-clusters --clusters $clusterArn --region us-east-2 --output json | ConvertFrom-Json
        $cluster = $clusterDetails.clusters[0]
        
        Write-Host "     Status: $($cluster.status)" -ForegroundColor $(if ($cluster.status -eq "ACTIVE") { "Green" } else { "Red" })
        Write-Host "     Running tasks: $($cluster.runningTasksCount)" -ForegroundColor White
        Write-Host "     Pending tasks: $($cluster.pendingTasksCount)" -ForegroundColor White
        Write-Host "     Registered container instances: $($cluster.registeredContainerInstancesCount)" -ForegroundColor White
    }
}

# 2. Verificar Task Definitions
Write-Host "`n2️⃣ TASK DEFINITIONS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$taskDefs = aws ecs list-task-definitions --region us-east-2 --output json | ConvertFrom-Json

if ($taskDefs.taskDefinitionArns.Count -eq 0) {
    Write-Host "❌ No se encontraron task definitions" -ForegroundColor Red
} else {
    Write-Host "✅ Task Definitions encontradas:" -ForegroundColor Green
    foreach ($taskDefArn in $taskDefs.taskDefinitionArns) {
        $taskDefName = $taskDefArn.Split('/')[-1]
        Write-Host "   • $taskDefName" -ForegroundColor White
        
        # Detalles de la task definition
        $taskDefDetails = aws ecs describe-task-definition --task-definition $taskDefArn --region us-east-2 --output json | ConvertFrom-Json
        $taskDef = $taskDefDetails.taskDefinition
        
        Write-Host "     Status: $($taskDef.status)" -ForegroundColor $(if ($taskDef.status -eq "ACTIVE") { "Green" } else { "Red" })
        Write-Host "     CPU: $($taskDef.cpu)" -ForegroundColor White
        Write-Host "     Memory: $($taskDef.memory)" -ForegroundColor White
        Write-Host "     Network Mode: $($taskDef.networkMode)" -ForegroundColor White
        Write-Host "     Launch Type: $($taskDef.requiresCompatibilities -join ', ')" -ForegroundColor White
        
        if ($taskDef.containerDefinitions) {
            Write-Host "     Containers:" -ForegroundColor Yellow
            foreach ($container in $taskDef.containerDefinitions) {
                Write-Host "       • $($container.name)" -ForegroundColor White
                Write-Host "         Image: $($container.image)" -ForegroundColor Gray
                if ($container.portMappings) {
                    Write-Host "         Ports: $($container.portMappings | ForEach-Object { "$($_.containerPort):$($_.protocol)" } | Join-String -Separator ', ')" -ForegroundColor Gray
                }
            }
        }
    }
}

# 3. Verificar Services
Write-Host "`n3️⃣ SERVICES" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

foreach ($clusterArn in $clusters.clusterArns) {
    $clusterName = $clusterArn.Split('/')[-1]
    Write-Host "Cluster: $clusterName" -ForegroundColor Yellow
    
    $services = aws ecs list-services --cluster $clusterArn --region us-east-2 --output json | ConvertFrom-Json
    
    if ($services.serviceArns.Count -eq 0) {
        Write-Host "⚠️  No hay services en este cluster" -ForegroundColor Yellow
    } else {
        $serviceDetails = aws ecs describe-services --cluster $clusterArn --services $services.serviceArns --region us-east-2 --output json | ConvertFrom-Json
        
        foreach ($service in $serviceDetails.services) {
            Write-Host "`n   Service: $($service.serviceName)" -ForegroundColor White
            Write-Host "   Status: $($service.status)" -ForegroundColor $(if ($service.status -eq "ACTIVE") { "Green" } else { "Red" })
            Write-Host "   Desired count: $($service.desiredCount)" -ForegroundColor White
            Write-Host "   Running count: $($service.runningCount)" -ForegroundColor $(if ($service.runningCount -eq $service.desiredCount) { "Green" } else { "Yellow" })
            Write-Host "   Pending count: $($service.pendingCount)" -ForegroundColor White
            Write-Host "   Task Definition: $($service.taskDefinition.Split('/')[-1])" -ForegroundColor White
            
            if ($service.loadBalancers -and $service.loadBalancers.Count -gt 0) {
                Write-Host "   Load Balancer: Sí (Target Group: $($service.loadBalancers[0].targetGroupArn.Split('/')[-1]))" -ForegroundColor Green
            } else {
                Write-Host "   Load Balancer: No" -ForegroundColor Yellow
            }
            
            # Verificar eventos recientes
            if ($service.events -and $service.events.Count -gt 0) {
                Write-Host "`n   Últimos eventos:" -ForegroundColor Yellow
                $service.events | Select-Object -First 5 | ForEach-Object {
                    $color = if ($_.message -match "ERROR|failed|unhealthy") { "Red" } elseif ($_.message -match "started|healthy") { "Green" } else { "Gray" }
                    Write-Host "     • $($_.createdAt): $($_.message)" -ForegroundColor $color
                }
            }
        }
    }
}

# 4. Verificar Tasks corriendo
Write-Host "`n4️⃣ TASKS CORRIENDO" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

foreach ($clusterArn in $clusters.clusterArns) {
    $clusterName = $clusterArn.Split('/')[-1]
    
    $tasks = aws ecs list-tasks --cluster $clusterArn --region us-east-2 --output json | ConvertFrom-Json
    
    if ($tasks.taskArns.Count -eq 0) {
        Write-Host "⚠️  No hay tasks corriendo en $clusterName" -ForegroundColor Yellow
    } else {
        Write-Host "Cluster: $clusterName" -ForegroundColor Yellow
        
        $taskDetails = aws ecs describe-tasks --cluster $clusterArn --tasks $tasks.taskArns --region us-east-2 --output json | ConvertFrom-Json
        
        foreach ($task in $taskDetails.tasks) {
            $taskId = $task.taskArn.Split('/')[-1]
            Write-Host "`n   Task: $taskId" -ForegroundColor White
            Write-Host "   Status: $($task.lastStatus)" -ForegroundColor $(if ($task.lastStatus -eq "RUNNING") { "Green" } else { "Yellow" })
            Write-Host "   Health: $($task.healthStatus)" -ForegroundColor $(if ($task.healthStatus -eq "HEALTHY") { "Green" } elseif ($task.healthStatus -eq "UNHEALTHY") { "Red" } else { "Yellow" })
            Write-Host "   Task Definition: $($task.taskDefinitionArn.Split('/')[-1])" -ForegroundColor White
            
            if ($task.containers) {
                Write-Host "   Containers:" -ForegroundColor Yellow
                foreach ($container in $task.containers) {
                    Write-Host "     • $($container.name)" -ForegroundColor White
                    Write-Host "       Status: $($container.lastStatus)" -ForegroundColor $(if ($container.lastStatus -eq "RUNNING") { "Green" } else { "Yellow" })
                    Write-Host "       Health: $($container.healthStatus)" -ForegroundColor $(if ($container.healthStatus -eq "HEALTHY") { "Green" } elseif ($container.healthStatus -eq "UNHEALTHY") { "Red" } else { "Yellow" })
                }
            }
            
            # Mostrar razón de stopped si existe
            if ($task.stoppedReason) {
                Write-Host "   ⚠️  Stopped Reason: $($task.stoppedReason)" -ForegroundColor Red
            }
        }
    }
}

# 5. Verificar VPC y Networking
Write-Host "`n5️⃣ NETWORKING" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Buscar VPC con nombre hpmm-sgi
$vpcs = aws ec2 describe-vpcs --region us-east-2 --filters "Name=tag:Name,Values=*hpmm-sgi*" --output json | ConvertFrom-Json

if ($vpcs.Vpcs.Count -eq 0) {
    Write-Host "⚠️  No se encontró VPC con nombre 'hpmm-sgi'" -ForegroundColor Yellow
    Write-Host "   Listando todas las VPCs..." -ForegroundColor Gray
    $allVpcs = aws ec2 describe-vpcs --region us-east-2 --output json | ConvertFrom-Json
    foreach ($vpc in $allVpcs.Vpcs) {
        $vpcName = ($vpc.Tags | Where-Object { $_.Key -eq "Name" }).Value
        Write-Host "   • $($vpc.VpcId) - $vpcName (CIDR: $($vpc.CidrBlock))" -ForegroundColor White
    }
} else {
    foreach ($vpc in $vpcs.Vpcs) {
        $vpcName = ($vpc.Tags | Where-Object { $_.Key -eq "Name" }).Value
        Write-Host "✅ VPC: $vpcName" -ForegroundColor Green
        Write-Host "   ID: $($vpc.VpcId)" -ForegroundColor White
        Write-Host "   CIDR: $($vpc.CidrBlock)" -ForegroundColor White
        
        # Listar subnets
        $subnets = aws ec2 describe-subnets --region us-east-2 --filters "Name=vpc-id,Values=$($vpc.VpcId)" --output json | ConvertFrom-Json
        Write-Host "   Subnets: $($subnets.Subnets.Count)" -ForegroundColor White
        foreach ($subnet in $subnets.Subnets) {
            $subnetName = ($subnet.Tags | Where-Object { $_.Key -eq "Name" }).Value
            Write-Host "     • $subnetName ($($subnet.CidrBlock)) - $($subnet.AvailabilityZone)" -ForegroundColor Gray
        }
    }
}

# 6. Verificar Security Groups
Write-Host "`n6️⃣ SECURITY GROUPS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$sgs = aws ec2 describe-security-groups --region us-east-2 --filters "Name=tag:Name,Values=*hpmm-sgi*" --output json | ConvertFrom-Json

if ($sgs.SecurityGroups.Count -eq 0) {
    Write-Host "⚠️  No se encontraron security groups con nombre 'hpmm-sgi'" -ForegroundColor Yellow
} else {
    foreach ($sg in $sgs.SecurityGroups) {
        $sgName = ($sg.Tags | Where-Object { $_.Key -eq "Name" }).Value
        Write-Host "✅ $sgName" -ForegroundColor Green
        Write-Host "   ID: $($sg.GroupId)" -ForegroundColor White
        Write-Host "   VPC: $($sg.VpcId)" -ForegroundColor White
        Write-Host "   Inbound Rules: $($sg.IpPermissions.Count)" -ForegroundColor White
        Write-Host "   Outbound Rules: $($sg.IpPermissionsEgress.Count)" -ForegroundColor White
    }
}

# 7. Verificar Load Balancers
Write-Host "`n7️⃣ LOAD BALANCERS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$albs = aws elbv2 describe-load-balancers --region us-east-2 --output json | ConvertFrom-Json

$hpmmAlbs = $albs.LoadBalancers | Where-Object { $_.LoadBalancerName -match "hpmm" }

if ($hpmmAlbs.Count -eq 0) {
    Write-Host "⚠️  No se encontraron ALBs con nombre 'hpmm'" -ForegroundColor Yellow
} else {
    foreach ($alb in $hpmmAlbs) {
        Write-Host "✅ ALB: $($alb.LoadBalancerName)" -ForegroundColor Green
        Write-Host "   DNS: $($alb.DNSName)" -ForegroundColor Cyan
        Write-Host "   State: $($alb.State.Code)" -ForegroundColor $(if ($alb.State.Code -eq "active") { "Green" } else { "Yellow" })
        Write-Host "   Scheme: $($alb.Scheme)" -ForegroundColor White
        Write-Host "   VPC: $($alb.VpcId)" -ForegroundColor White
    }
}

# 8. Verificar Target Groups
Write-Host "`n8️⃣ TARGET GROUPS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$tgs = aws elbv2 describe-target-groups --region us-east-2 --output json | ConvertFrom-Json

$hpmmTgs = $tgs.TargetGroups | Where-Object { $_.TargetGroupName -match "hpmm" }

if ($hpmmTgs.Count -eq 0) {
    Write-Host "⚠️  No se encontraron Target Groups con nombre 'hpmm'" -ForegroundColor Yellow
} else {
    foreach ($tg in $hpmmTgs) {
        Write-Host "✅ Target Group: $($tg.TargetGroupName)" -ForegroundColor Green
        Write-Host "   Protocol: $($tg.Protocol):$($tg.Port)" -ForegroundColor White
        Write-Host "   VPC: $($tg.VpcId)" -ForegroundColor White
        Write-Host "   Health Check: $($tg.HealthCheckProtocol) $($tg.HealthCheckPath)" -ForegroundColor White
        
        # Verificar targets registrados
        $targetHealth = aws elbv2 describe-target-health --target-group-arn $tg.TargetGroupArn --region us-east-2 --output json | ConvertFrom-Json
        
        if ($targetHealth.TargetHealthDescriptions.Count -eq 0) {
            Write-Host "   ⚠️  No hay targets registrados" -ForegroundColor Yellow
        } else {
            Write-Host "   Targets registrados: $($targetHealth.TargetHealthDescriptions.Count)" -ForegroundColor White
            foreach ($target in $targetHealth.TargetHealthDescriptions) {
                $healthColor = switch ($target.TargetHealth.State) {
                    "healthy" { "Green" }
                    "unhealthy" { "Red" }
                    "initial" { "Yellow" }
                    "draining" { "Yellow" }
                    default { "Gray" }
                }
                Write-Host "     • $($target.Target.Id):$($target.Target.Port) - $($target.TargetHealth.State)" -ForegroundColor $healthColor
                if ($target.TargetHealth.Reason) {
                    Write-Host "       Reason: $($target.TargetHealth.Reason)" -ForegroundColor Red
                }
            }
        }
    }
}

# 9. Verificar CloudWatch Logs
Write-Host "`n9️⃣ CLOUDWATCH LOGS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$logGroups = aws logs describe-log-groups --region us-east-2 --log-group-name-prefix "/ecs/hpmm" --output json 2>$null | ConvertFrom-Json

if ($logGroups.logGroups.Count -eq 0) {
    Write-Host "⚠️  No se encontraron log groups para ECS" -ForegroundColor Yellow
} else {
    foreach ($logGroup in $logGroups.logGroups) {
        Write-Host "✅ Log Group: $($logGroup.logGroupName)" -ForegroundColor Green
        Write-Host "   Size: $([math]::Round($logGroup.storedBytes / 1MB, 2)) MB" -ForegroundColor White
    }
}

# RESUMEN FINAL
Write-Host "`n========================================================" -ForegroundColor Gray
Write-Host "RESUMEN" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Gray

$summary = @()
$summary += "Clusters: $($clusters.clusterArns.Count)"
$summary += "Task Definitions: $($taskDefs.taskDefinitionArns.Count)"
$summary += "VPCs: $($vpcs.Vpcs.Count)"
$summary += "Security Groups: $($sgs.SecurityGroups.Count)"
$summary += "Load Balancers: $($hpmmAlbs.Count)"
$summary += "Target Groups: $($hpmmTgs.Count)"

$summaryText = $summary -join " | "
Write-Host $summaryText -ForegroundColor White

Write-Host "`n========================================================" -ForegroundColor Gray
Write-Host "Diagnostico completado" -ForegroundColor Green
Write-Host "`nPara ver logs de un container específico:" -ForegroundColor Yellow
Write-Host "aws logs tail /ecs/hpmm-sgi-backend --follow --region us-east-2" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White
