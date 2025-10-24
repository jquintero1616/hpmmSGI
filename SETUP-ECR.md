# 🚀 Guía Rápida: Deploy a AWS ECR

## ✅ Lo que ya tienes configurado:

- **Usuario IAM**: HPMM (con permisos de Administrador)
- **Región AWS**: us-east-2 (Ohio)
- **Repositorio ECR**: hpmm-sgi-repo
- **ECR URI**: 861455913678.dkr.ecr.us-east-2.amazonaws.com/hpmm-sgi-repo
- **Account ID**: 861455913678

---

## 📋 Pasos para completar el setup

### **Paso 1: Instalar AWS CLI (si no lo tienes)**

```powershell
# Opción A: Con winget
winget install Amazon.AWSCLI

# Opción B: Descargar desde
# https://aws.amazon.com/cli/

# Después de instalar, REINICIA PowerShell
```

---

### **Paso 2: Configurar credenciales de AWS**

```powershell
# Ejecuta el script de configuración
.\scripts\configure-aws-cli.ps1
```

Este script:
- ✅ Configura tus credenciales automáticamente
- ✅ Verifica la conexión con AWS
- ✅ Muestra tu Account ID

---

### **Paso 3: Configurar GitHub Secrets**

Ve a tu repositorio en GitHub:

```
https://github.com/jquintero1616/hpmmSGI/settings/secrets/actions
```

Agrega estos secretos (Click en "New repository secret"):

| Name | Value |
|------|-------|
| `AWS_ACCESS_KEY_ID` | `Tu Access Key ID de IAM` |
| `AWS_SECRET_ACCESS_KEY` | `Tu Secret Access Key de IAM` |
| `VITE_API_URL` | `http://TU_BACKEND_IP:3000` (lo configuraremos después) |

⚠️ **IMPORTANTE**: Después de agregar los secrets, considera regenerar las credenciales por seguridad.

---

### **Paso 4: Push manual inicial (opcional)**

Si quieres probar antes de hacer commit:

```powershell
# Push solo backend
.\scripts\push-to-ecr.ps1 -Service backend

# Push solo frontend
.\scripts\push-to-ecr.ps1 -Service frontend

# Push ambos
.\scripts\push-to-ecr.ps1 -Service both
```

---

### **Paso 5: Deploy automático con GitHub Actions**

```powershell
# Hacer commit de los workflows
git add .github/workflows/
git commit -m "Add GitHub Actions for ECR deployment"
git push origin dockerizacion-de-fe-be-db-redis

# Merge a main para activar deployment
git checkout main
git merge dockerizacion-de-fe-be-db-redis
git push origin main
```

Esto disparará automáticamente:
- ✅ Build del backend
- ✅ Push a ECR con tag `backend-{git-sha}` y `backend-latest`
- ✅ Build del frontend  
- ✅ Push a ECR con tag `frontend-{git-sha}` y `frontend-latest`

---

## 🔍 Verificar imágenes en ECR

```powershell
# Ver todas las imágenes
aws ecr describe-images --repository-name hpmm-sgi-repo --region us-east-2

# Ver solo los tags
aws ecr list-images --repository-name hpmm-sgi-repo --region us-east-2
```

---

## 📊 Estructura de tags en ECR

```
hpmm-sgi-repo/
├── backend-20251023-143022      (timestamp específico)
├── backend-latest                (siempre apunta a la última versión)
├── frontend-20251023-143055
└── frontend-latest
```

---

## 🎯 Siguiente paso: ECS (Fargate)

Una vez que las imágenes estén en ECR, necesitamos:

1. **Crear Task Definitions** (configuración de cómo corren los contenedores)
2. **Crear ECS Cluster** (donde correrán las tareas)
3. **Crear RDS PostgreSQL** (base de datos)
4. **Configurar Redis** (Upstash o ElastiCache)
5. **Crear ECS Services** (mantienen las tareas corriendo)
6. **Configurar ALB** (Load Balancer - opcional)

---

## 🆘 Troubleshooting

### Error: "AWS CLI no encontrado"
```powershell
# Verifica instalación
aws --version

# Si no funciona, reinicia PowerShell o agrega al PATH:
$env:Path += ";C:\Program Files\Amazon\AWSCLIV2"
```

### Error: "No autorizado" al push
```powershell
# Re-login a ECR
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 861455913678.dkr.ecr.us-east-2.amazonaws.com
```

### Error: "Docker daemon no está corriendo"
```powershell
# Inicia Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

---

## 💡 Tips

- Los tags con timestamp te permiten hacer rollback fácilmente
- `latest` siempre apunta a la última versión
- GitHub Actions se dispara automáticamente en push a `main`
- Puedes ejecutar los workflows manualmente desde GitHub (tab Actions → workflow → Run workflow)

---

¿Listo para continuar? Avísame cuando hayas completado estos pasos. 🚀
