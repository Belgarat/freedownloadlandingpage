#!/bin/bash

# Script per eseguire i test con timeout automatico
# Uso: ./scripts/run-tests.sh [test-type]

set -e  # Termina se qualsiasi comando fallisce

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Funzione per killare processi Node.js
cleanup() {
    log "Pulizia processi in background..."
    pkill -f "next dev" || true
    pkill -f "playwright" || true
    log "Pulizia completata"
}

# Trap per cleanup automatico
trap cleanup EXIT

# Controlla se il server è già in esecuzione
check_server() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log "Server già in esecuzione su porta 3000"
        return 0
    else
        log "Avvio server di sviluppo..."
        npm run dev &
        SERVER_PID=$!
        
        # Aspetta che il server sia pronto
        for i in {1..30}; do
            if curl -s http://localhost:3000 > /dev/null 2>&1; then
                log "Server pronto!"
                return 0
            fi
            sleep 2
        done
        
        error "Server non si è avviato entro 60 secondi"
        return 1
    fi
}

# Funzione per eseguire test con timeout
run_test_with_timeout() {
    local test_command="$1"
    local timeout_seconds="$2"
    local test_name="$3"
    
    log "Esecuzione: $test_name (timeout: ${timeout_seconds}s)"
    
    if timeout $timeout_seconds $test_command; then
        log "✅ $test_name completato con successo"
        return 0
    else
        local exit_code=$?
        if [ $exit_code -eq 124 ]; then
            error "⏰ $test_name timeout dopo ${timeout_seconds}s"
        else
            error "❌ $test_name fallito (exit code: $exit_code)"
        fi
        return $exit_code
    fi
}

# Main execution
main() {
    log "🚀 Avvio test automatici"
    
    # Controlla server
    if ! check_server; then
        exit 1
    fi
    
    # Determina tipo di test
    case "${1:-all}" in
        "component")
            run_test_with_timeout "npx playwright test tests/components/ --project=chromium" 60 "Component Tests"
            ;;
        "landing")
            run_test_with_timeout "npx playwright test tests/landing-page.spec.ts --project=chromium" 30 "Landing Page Tests"
            ;;
        "ab-testing")
            run_test_with_timeout "npx playwright test tests/ab-testing*.spec.ts --project=chromium" 60 "A/B Testing Tests"
            ;;
        "api")
            run_test_with_timeout "npx playwright test tests/api-*.spec.ts --project=chromium" 30 "API Tests"
            ;;
        "admin")
            run_test_with_timeout "npx playwright test tests/admin.spec.ts --project=chromium" 30 "Admin Tests"
            ;;
        "auth")
            run_test_with_timeout "npx playwright test tests/auth.spec.ts --project=chromium" 30 "Auth Tests"
            ;;
        "analytics")
            run_test_with_timeout "npx playwright test tests/analytics-*.spec.ts --project=chromium" 30 "Analytics Tests"
            ;;
        "cookie")
            run_test_with_timeout "npx playwright test tests/cookie-*.spec.ts --project=chromium" 30 "Cookie Tests"
            ;;
        "download")
            run_test_with_timeout "npx playwright test tests/landing-page.spec.ts --grep='Download Page' --project=chromium" 30 "Download Tests"
            ;;
        "all")
            run_test_with_timeout "npx playwright test --project=chromium" 600 "All Tests"
            ;;
        *)
            error "Tipo di test non riconosciuto: $1"
            echo "Tipi disponibili: component, landing, ab-testing, api, admin, auth, analytics, cookie, download, all"
            exit 1
            ;;
    esac
    
    log "🎉 Tutti i test completati!"
}

# Esegui main
main "$@"
