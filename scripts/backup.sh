#!/bin/bash

# Script di backup automatico per BookLandingStack
# Mantiene gli ultimi 10 backup per sicurezza

set -e  # Exit on error

# Configurazione
BACKUP_DIR="/tmp/backups"
DB_PATH="/tmp/development.db"
RETENTION_COUNT=10

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Iniziando backup del database...${NC}"

# Crea directory backup se non esiste
mkdir -p "$BACKUP_DIR"

# Verifica che il database esista
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}❌ Database non trovato: $DB_PATH${NC}"
    exit 1
fi

# Genera timestamp per il backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/development.db.backup.$TIMESTAMP"

# Esegui backup
echo -e "${YELLOW}📦 Creando backup: $BACKUP_FILE${NC}"
cp "$DB_PATH" "$BACKUP_FILE"

# Verifica che il backup sia stato creato
if [ -f "$BACKUP_FILE" ]; then
    echo -e "${GREEN}✅ Backup creato con successo${NC}"
    
    # Mostra dimensione del backup
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}📊 Dimensione backup: $BACKUP_SIZE${NC}"
else
    echo -e "${RED}❌ Errore nella creazione del backup${NC}"
    exit 1
fi

# Gestione retention (mantieni solo gli ultimi N backup)
echo -e "${YELLOW}🧹 Pulizia backup vecchi (mantiene ultimi $RETENTION_COUNT)...${NC}"

# Conta quanti backup esistono
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/development.db.backup.* 2>/dev/null | wc -l)

if [ "$BACKUP_COUNT" -gt "$RETENTION_COUNT" ]; then
    # Rimuovi i backup più vecchi
    ls -t "$BACKUP_DIR"/development.db.backup.* | tail -n +$((RETENTION_COUNT + 1)) | xargs rm -f
    echo -e "${GREEN}✅ Rimossi $(($BACKUP_COUNT - $RETENTION_COUNT)) backup vecchi${NC}"
else
    echo -e "${GREEN}✅ Nessun backup da rimuovere (attuali: $BACKUP_COUNT, limite: $RETENTION_COUNT)${NC}"
fi

# Mostra lista backup attuali
echo -e "${YELLOW}📋 Backup disponibili:${NC}"
ls -lh "$BACKUP_DIR"/development.db.backup.* 2>/dev/null | awk '{print $9, $5}' | sort -r || echo "Nessun backup trovato"

echo -e "${GREEN}🎉 Backup completato con successo!${NC}"
echo -e "${GREEN}⏰ Timestamp: $(date)${NC}"
