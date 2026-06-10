# System Design: Distributed Multi-Channel Notification Engine

This document outlines the architecture, data models, and resilience strategies for a highly-scalable, fault-tolerant, and low-latency Multi-Channel Notification Engine. It is designed to process and deliver real-time notifications (Push, SMS, Email, and WebSockets/SSE) at a rate of up to **10,000+ operations per second** with a guaranteed delivery SLA of 99.99%.

---

## 1. System Requirements & Goals

### Functional Requirements
* **Multi-Channel Dispatch**: Support for Web Push, App Push, SMS, Email, and active WebSocket/SSE messages.
* **User Preferences**: Honor explicit user settings (e.g., Opt-outs, Channel priorities, Quiet hours).
* **Prioritization**: Deliver urgent alerts (e.g., OTPs, train departure updates) immediately, while batching promotional or educational digests.
* **Dynamic Templates**: Render notifications on the fly using a centralized JSON dynamic template registry.

### Non-Functional Requirements
* **High Reliability**: Guaranteed at-least-once delivery; messages must not be dropped in transit.
* **Low Latency**: Under 2 seconds for high-priority channels (OTP, urgent notifications) under standard operating conditions.
* **Fault Tolerance & Resilience**: Resilient to third-party provider failures (e.g., SendGrid, Twilio, Firebase Cloud Messaging).
* **Idempotency & Deduplication**: Avoid sending duplicate notification copies for a single trigger event.
* **Rate Limiting**: Prevent spamming users on downstream provider levels.

---

## 2. High-Level Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                                 CLIENT CLIENTS                                  |
|     [ Web App ]         [ Mobile App (iOS/And) ]          [ Smart Wearables ]   |
+---------------------------------------------------------------------------------+
            |                       |                              |
            v                       v                              v
+---------------------------------------------------------------------------------+
|                          COMPASS LOAD BALANCER / NGINX                          |
+---------------------------------------------------------------------------------+
                                    |
                                    v
+---------------------------------------------------------------------------------+
|                                 API GATEWAY                                     |
|    - Auth Verification  - Rate Limiting (Redis)  - Routing  - SSL Termination   |
+---------------------------------------------------------------------------------+
            |
            v
+---------------------------------------------------------------------------------+
|                           NOTIFICATION APP SERVICE                              |
|   - Request Sanitization & Validation                                            |
|   - Template Retrieval (Renderer engine)                                        |
|   - Preference Checking (Database check via Cache layer)                       |
+---------------------------------------------------------------------------------+
            |
            +------------> [ Cache: Redis (Preferences/Registered Devices) ]
            |
            v
+---------------------------------------------------------------------------------+
|                                 MESSAGE BROKER                                  |
|   [ Topic: urgent-notification ]    [ Topic: bulk-notification ]  (Kafka/Rabbit)|
+---------------------------------------------------------------------------------+
       |                                          |
       ├───────────────┐                          ├──────────────┐
       v               v                          v              v
+--------------+ +--------------+          +--------------+ +--------------+
| Email Worker | |  SMS Worker  |          | Push Worker  | | Slack Worker |
+--------------+ +--------------+          +--------------+ +--------------+
       |               |                          |              |
       v               v                          v              v
+--------------+ +--------------+          +--------------+ +--------------+
| Third Party  | | Third Party  |          | Third Party  | | Third Party  |
| (SendGrid)   | | (Twilio/AWS) |          | (FCM/APNS)   | | (Slack Webk) |
+--------------+ +--------------+          +--------------+ +--------------+
```

---

## 3. Microservice Component Breakdown

### 3.1. API Gateway
* **Responsibilities**: Validates incoming client API calls, inspects JWT keys for client auth wrapper safety, and applies ingress rate-limiting (Token Bucket algorithm backed by Redis cluster).
* **Protocols**: Exposes REST interfaces (`POST /api/v1/notifications`) and establishes EventStreams/WebSockets for connected active web sessions.

### 3.2. Notification Main Handler (App Service)
* **Metadata Parsing**: Checks incoming payloads for target user ID, template name, and dynamic variables.
* **Preference Filter**: Reads user preference documents. If a user is currently in a "Do Not Disturb" (DND) slot or has opted out of "SMS Mode", the service either routes to alternate backup channels (e.g., Push only) or delays queue insertion.
* **Template Engine**: Hydrates localized variables with the stored template files (retains HTML and pure texts).

### 3.3. Decoupled Routing Queue (Kafka or RabbitMQ Broker)
* **Urgent Queue (Strict SLA)**: Dedicated to OTPs, secure transactions, or emergency dispatcher schedules. No batching, maximum concurrency.
* **Bulk Queue (Best Effort)**: Used for analytical trends, marketing campaigns, or daily round-ups. Leverages sliding cron dispatchers to schedule low-importance alerts.
* **Dead Letter Queue (DLQ) & Retry Queue**: Stores messages that failed delivery due to down third-party vendors. Equipped with exponential backoff and jitter algorithms before re-driving.

### 3.4. Specialized Worker Pools
* **Workers**: Standard stateless execution containers written in lightweight TS/Node. They ingest messages, make safe POST requests to third-party endpoints, and log status codes.
* **Provider Switching Circuit-Breaker**: In case SendGrid or Twilio encounters a prolonged outage, a circuit breaker closes the channel, routing messages to backup SMTP or alternative carriers automatically.

---

## 4. Database Schema Structure
Designed for storage in relational SQL (such as Postgres) or high-perf document model databases (such as Firestore/MongoDB):

### 4.1. Users Preferences Table
```sql
CREATE TABLE user_preferences (
  user_id VARCHAR(128) PRIMARY KEY,
  sms_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME, -- e.g., '22:00:00'
  quiet_hours_end TIME,   -- e.g., '07:00:00'
  timezone VARCHAR(64) DEFAULT 'UTC',
  preferred_channel VARCHAR(32) DEFAULT 'PUSH'
);
```

### 4.2. Device Registrations Table
```sql
CREATE TABLE device_registrations (
  registration_id VARCHAR(256) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  device_token VARCHAR(512) NOT NULL,
  device_type VARCHAR(16) NOT NULL, -- 'android' or 'ios' or 'web'
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3. Message Dispatch History Logs
```sql
CREATE TABLE notification_dispatch_logs (
  message_id VARCHAR(128) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  channel VARCHAR(16) NOT NULL, -- 'EMAIL', 'SMS', 'PUSH'
  payload JSONB NOT NULL,
  dispatch_status VARCHAR(32) NOT NULL, -- 'PENDING', 'SENT', 'FAILED', 'DELIVERED'
  provider_reference VARCHAR(256),
  retry_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP,
  failure_reason TEXT
);
```

---

## 5. Reliability & Advanced Topics

### 5.1. Idempotency Key Handling
To prevent duplicate text dispatch during network drops:
1. Each request includes an `idempotency-key` generated by the triggering upstream system.
2. The API gateway attempts to write `key -> "processing"` into Redis with a 5-minute TTL.
3. If the key exists, subsequent requests receive a `409 Conflict` or of-the-same-status code, avoiding duplicate execution.

### 5.2. Telemetry and Analytics Pipeline
* Prometheus monitors latency and error spikes.
* Grafana Dashboards display rates of SMS vs. Email dispatches with details on daily streak quotas.
* Critical log trails are indexed securely to Elasticsearch for auditing purposes.
