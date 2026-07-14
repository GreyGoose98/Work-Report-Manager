# API Contract (V1)

Base URL: /api/v1

## Authentication
- POST /auth/register
  - body: { username, password, full_name }
  - returns: user object

- POST /auth/login
  - body: { username, password }
  - returns: { access_token, token_type }

- GET /auth/me
  - auth: Bearer token
  - returns: user object

## Work Reports
- GET /reports
  - query params:
    - search
    - status
    - work_category
    - start_date
    - end_date
  - returns: { items: WorkReport[], total }

- GET /reports/{id}
  - returns: WorkReport

- POST /reports
  - body: WorkReportCreate
  - returns: WorkReport

- PUT /reports/{id}
  - body: WorkReportUpdate
  - returns: WorkReport

- DELETE /reports/{id}
  - returns: 204

## Attachments
- POST /reports/{id}/attachments
  - multipart/form-data with file
  - allowed mime types: image, pdf, excel, word, text
  - returns: Attachment

- GET /reports/{id}/attachments
  - returns: Attachment[]

- DELETE /attachments/{id}
  - returns: 204

## Dashboard
- GET /dashboard/summary
  - returns: {
      total_reports,
      reports_today,
      reports_this_week,
      pending_reports,
      recent_reports
    }
