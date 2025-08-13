#!/bin/bash

# Script di restore del database per BookLandingStack
# Permette di ripristinare da un backup specifico

set -e  # Exit on error

# Configurazione
BACKUP_DIR="/tmp/backups"
DB_PATH="/tmp/development.db"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Script di restore del database${NC}"

# Verifica che la directory backup esista
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ Directory backup non trovata: $BACKUP_DIR${NC}"
    exit 1
fi

# Lista backup disponibili
echo -e "${YELLOW}📋 Backup disponibili:${NC}"
BACKUP_FILES=($(ls -t "$BACKUP_DIR"/development.db.backup.* 2>/dev/null))

if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
    echo -e "${RED}❌ Nessun backup trovato in $BACKUP_DIR${NC}"
    exit 1
fi

# Mostra backup con numeri
for i in "${!BACKUP_FILES[@]}"; do
    BACKUP_FILE="${BACKUP_FILES[$i]}"
    BACKUP_NAME=$(basename "$BACKUP_FILE")
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    BACKUP_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$BACKUP_FILE" 2>/dev/null || stat -c "%y" "$BACKUP_FILE" 2>/dev/null | cut -d' ' -f1,2)
    
    echo -e "${BLUE}$((i+1)).${NC} $BACKUP_NAME (${BACKUP_SIZE}, ${BACKUP_DATE})"
done

# Chiedi quale backup ripristinare
echo ""
read -p "Seleziona il numero del backup da ripristinare (1-${#BACKUP_FILES[@]}): " SELECTION

# Validazione input
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#BACKUP_FILES[@]} ]; then
    echo -e "${RED}❌ Selezione non valida${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUP_FILES[$((SELECTION-1))]}"
BACKUP_NAME=$(basename "$SELECTED_BACKUP")

echo -e "${YELLOW}🔄 Ripristinando da: $BACKUP_NAME${NC}"

# Conferma l'operazione
echo -e "${RED}⚠️  ATTENZIONE: Questa operazione sovrascriverà il database corrente!${NC}"
read -p "Sei sicuro di voler continuare? (y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Operazione annullata${NC}"
    exit 0
fi

# Backup del database corrente prima del restore
echo -e "${YELLOW}📦 Creando backup del database corrente...${NC}"
CURRENT_BACKUP="$BACKUP_DIR/development.db.pre-restore.$(date +%Y%m%d_%H%M%S)"
cp "$DB_PATH" "$CURRENT_BACKUP" 2>/dev/null || echo -e "${YELLOW}⚠️  Database corrente non trovato, procedendo con restore${NC}"

# Stop del server se in esecuzione
echo -e "${YELLOW}🛑 Fermando server se in esecuzione...${NC}"
pkill -f "npm run dev" 2>/dev/null || echo -e "${YELLOW}ℹ️  Nessun server in esecuzione${NC}"

# Ripristina il backup
echo -e "${YELLOW}🔄 Ripristinando database...${NC}"
cp "$SELECTED_BACKUP" "$DB_PATH"

# Verifica che il restore sia andato a buon fine
if [ -f "$DB_PATH" ]; then
    DB_SIZE=$(du -h "$DB_PATH" | cut -f1)
    echo -e "${GREEN}✅ Database ripristinato con successo!${NC}"
    echo -e "${GREEN}📊 Dimensione database: $DB_SIZE${NC}"
    echo -e "${GREEN}📅 Backup utilizzato: $BACKUP_NAME${NC}"
else
    echo -e "${RED}❌ Errore nel ripristino del database${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Restore completato!${NC}"
echo -e "${YELLOW}💡 Puoi ora riavviare il server con: npm run dev${NC}"
