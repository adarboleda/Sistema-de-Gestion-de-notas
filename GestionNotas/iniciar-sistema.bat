@echo off
echo ============================================
echo Iniciando Sistema de Gestion de Notas
echo ============================================
echo.

REM Verificar si los servidores ya estan corriendo
echo Verificando servicios...
echo.

REM Iniciar oauth-api
echo [1/3] Iniciando Servicio de Autenticacion (puerto 3001)...
cd oauth-api
start "OAuth API - Puerto 3001" cmd /k "npm start"
timeout /t 3 /nobreak > nul
cd ..

REM Iniciar gestion-notas-orm
echo [2/3] Iniciando API Principal (puerto 3000)...
cd gestion-notas-orm
start "API Principal - Puerto 3000" cmd /k "npm start"
timeout /t 3 /nobreak > nul
cd ..

REM Iniciar frontend
echo [3/3] Iniciando Frontend (puerto 5173)...
cd gestion-notas-front
start "Frontend - Puerto 5173" cmd /k "npm run dev"
cd ..

echo.
echo ============================================
echo Servicios iniciados correctamente:
echo - OAuth API:      http://localhost:3001
echo - API Principal:  http://localhost:3000
echo - Frontend:       http://localhost:5173
echo ============================================
echo.
echo Abre tu navegador en: http://localhost:5173
echo.
echo Credenciales de administrador:
echo Email: admin@gestion.com
echo Password: 12345
echo.
pause
