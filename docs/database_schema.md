# Database Schema (V1)

## users
- id (PK)
- username (unique, indexed)
- password_hash
- full_name
- role
- created_at
- updated_at

## work_reports
- id (PK)
- report_date (indexed)
- work_category (indexed)
- customer_name
- project_name
- location
- machine_model
- activity_description
- status (indexed)
- priority (indexed)
- pending_actions
- next_follow_up_date
- remarks
- created_by (FK -> users.id, indexed)
- created_at
- updated_at

## attachments
- id (PK)
- report_id (FK -> work_reports.id, indexed)
- file_name
- file_type
- file_path
- file_size
- uploaded_at

## activity_logs
- id (PK)
- user_id (FK -> users.id, indexed)
- action
- entity_type
- entity_id
- timestamp
- details

## Notes
- Current local default: SQLite database file.
- Production target: PostgreSQL by replacing DATABASE_URL.
- Attachment binaries stored in local upload directory; metadata stored in DB.
