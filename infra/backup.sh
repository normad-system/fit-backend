#!/usr/bin/env bash
# backup.sh — PostgreSQL daily backup to S3
# Cron: 0 2 * * * /opt/fit/shared/backup.sh prd

set -euo pipefail

ENV="${1:?Usage: $0 <dev|prd>}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/tmp/fit_${ENV}_${TIMESTAMP}.sql.gz"
S3_BUCKET="s3://fit-backups/${ENV}"

source "/opt/fit/${ENV}/.env"

docker exec "fit-postgres-${ENV}" pg_dump \
  -U "$DB_USERNAME" \
  -d "$DB_DATABASE" \
  --no-owner \
  --no-acl | gzip > "$BACKUP_FILE"

aws s3 cp "$BACKUP_FILE" "${S3_BUCKET}/${TIMESTAMP}.sql.gz"
rm -f "$BACKUP_FILE"

# Remove backups older than 30 days
aws s3 ls "${S3_BUCKET}/" | while read -r line; do
  BACKUP_DATE=$(echo "$line" | awk '{print $1}')
  if [[ $(date -d "$BACKUP_DATE" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$BACKUP_DATE" +%s) -lt $(date -d "-30 days" +%s 2>/dev/null || date -v-30d +%s) ]]; then
    FILE=$(echo "$line" | awk '{print $4}')
    aws s3 rm "${S3_BUCKET}/${FILE}"
  fi
done

echo "Backup completed: ${TIMESTAMP}"
