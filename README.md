# DailyDo

> **Your day. Your priorities. Your DailyDo.**

DailyDo is a global personal life-management platform designed to help people organize their everyday responsibilities, deadlines, plans, decisions, and important information in one simple place.

It is designed for **students, young people, professionals, freelancers, parents, and anyone managing a busy daily life.**

## Vision

People shouldn't have to keep their entire lives in their heads.

DailyDo aims to become a simple daily command center that helps users understand:

* What needs my attention today?
* What am I forgetting?
* What is coming next?
* What should I prioritize?
* What should I do about this situation?

## Core Features

### Daily Planning

Plan and organize the most important activities for each day.

### Smart Tasks

Create, organize, prioritize, and complete everyday tasks.

### Deadline Tracking

Keep track of assignments, work deadlines, appointments, renewals, and other important dates.

### Life Administration

Manage everyday responsibilities that are easy to forget.

### Decision Assistant

Structure everyday decisions by comparing options, costs, benefits, risks, and next steps.

### Personal Knowledge

Store notes, ideas, references, and important information in an organized space.

### Intelligent Planning

Use AI to transform natural-language input into structured tasks, plans, priorities, and actionable steps.

## Core User Flow

```text
Capture
   ↓
Understand
   ↓
Organize
   ↓
Prioritize
   ↓
Plan
   ↓
Do
```

Users should be able to describe what they need naturally, while DailyDo helps turn that information into something actionable.

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons

### Backend

* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Storage

### AI

* AgentRouter
* AI-powered task extraction
* Intelligent planning
* Goal breakdown
* Decision assistance

### Infrastructure

* GitHub
* Vercel

### Planned Services

* Resend for transactional email
* Web Push for browser notifications
* Calendar integrations
* Custom DailyDo domain

## Architecture

```text
                    DAILYDO
                       │
                       ▼
                Next.js Frontend
                       │
             ┌─────────┴─────────┐
             │                   │
         Supabase            AgentRouter
             │                   │
      ┌──────┼──────┐            │
      │      │      │            ▼
     Auth   DB   Storage      AI Models
      │      │
      │      ├── Tasks
      │      ├── Deadlines
      │      ├── Reminders
      │      ├── Notes
      │      ├── Decisions
      │      └── Calendar Events
      │
      ▼
     Users
```

## Design System

DailyDo uses a premium, minimal visual identity built around:

* **Black** — primary foundation
* **Blue** — primary interaction and action color
* **Gold** — important highlights and premium accents
* **White** — primary content
* **Muted gray** — secondary information

The interface should remain clean, calm, accessible, and easy to understand.

## Development Principles

* Mobile-first and fully responsive
* Simple user experience
* Accessibility-conscious design
* Modular and reusable components
* Secure user data
* Strong separation between frontend, backend, and AI services
* Global-ready architecture
* Localization-ready
* Timezone-aware
* Avoid unnecessary complexity

## Project Status

**Currently in development.**

The initial development focus is:

1. Frontend
2. Authentication
3. Database architecture
4. Core task and deadline management
5. AI integration
6. Notifications
7. Calendar integration
8. Production deployment

## Future Direction

DailyDo is intended to evolve beyond a traditional task manager into a **personal life-management system** that helps users organize information, responsibilities, decisions, and daily priorities.

The long-term goal is to make DailyDo useful regardless of:

* Age
* Profession
* Country
* Education
* Lifestyle

## License

This repository is currently **proprietary** and is not licensed for redistribution or commercial reuse.

---

**DailyDo**

*Your day. Your priorities. Your DailyDo.*
