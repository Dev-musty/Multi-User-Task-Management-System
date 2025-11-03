
**Multi-User Task Management System**

Multi-User Task Management System- This agent allows tasks to be assigned tasks to team members, team members can see their assigned tasks, mark tasks complete when done with them and the assigner can see all tasks they've assigned, track completion status and gets overview of team progress.

## Features

Multi-User Task Management System
Overview of Features

✅ PM assigns tasks to team members
✅ Team members can see their assigned tasks
✅ PM can see all tasks they've assigned
✅ Track completion status
✅ Team members can mark tasks complete
✅ PM gets overview of team progress

- **AI-Powered Analysis**: Leverages Google Gemini 2.5 Flash for intelligent Professional but friendly responses,Clear confirmations and Celebrate completions
- **Team progress tracking**: Task assigners (e.g. product manager) can track task completion status and gets overview of team progress.
- **Natural Conversation**: Chat naturally with the agent to get repository information
- **Memory System**: Maintains conversation context using LibSQL storage and lowdb to persist task,assigner,assignee and due date.
- **Agent-to-Agent Protocol**: Supports A2A (Agent-to-Agent) communication via JSON-RPC 2.0
- **Observability**: Built-in AI tracing and monitoring

## Project structure

```
src/mastra/
├── index.ts              # Mastra configuration
├── database/
│   └── db.ts            #lowdb to persist task,assigner,assignee and due date.
├── agents/
│   └── tasKManagementSystem.ts     # Task Management System agent
├── tools/
│   └── completTaskTool.ts     # Task completion tool
│   └── getAssignedTaskTool.ts     # Assigned task tool
│   └── getTaskTool.ts     # Get user task tool [assigned and personal]
│   └── ReminderTool.ts     # GitHub API integration tool
├── routes/
│   └── routes.ts       # Agent-to-Agent API endpoint
└── workflows/
    └── tasKManagementWorkflows.ts    # TypeScript type definitions
```

### Prerequisites

- **Node.js**: Version 20.9.0 or higher
- **npm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Dev-musty/Multi-User-Task-Management-System.git
   cd Multi-User-Task-Management-System
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```


3. **Configure environment** (Optional)

   Create a `.env` file in the root directory:

   ```env
   # GOOGLE_API_KEY=your_google_api_key
   ```

### Running the Application

#### Development Mode

```bash
  npm run dev
```

The server will start on `http://localhost:4111`

#### Production Build

Build the application:

```bash
  npm run build
```

Run in production:

```bash
  npm start
```

## 📖 Usage

### Interactive Chat (Mastra Playground)

**Example conversations:**

```
Example 1 - PM assigning task:
    User: "My name is Sarah"
    Agent: "Hi Sarah! How can I help?"
    User: "Assign production bug fix to Bola, deadline next Monday"
    Agent:
      Calculate: next Monday = 2025-11-04T09:00:00
      reminderTool(
        assignedTo="Bola",
        assignedBy="Sarah",
        task="Production bug fix",
        dueDate="2025-11-04T09:00:00",
        priority="medium"
      )
      "Task assigned to Bola!
      Task: Production bug fix
      Due: Monday, November 4, 2025 at 9:00 AM
      Assigned by: Sarah"

    Example 2 - Team member checking tasks:
    User: "I'm Bola, what are my tasks?"
    Agent: getMyTasks(user="Bola")
      [Shows Bola's assigned tasks]

    Example 3 - PM checking team progress:
    User: "Sarah here, show me what I assigned"
    Agent: getAssignedTasks(assignedBy="Sarah")
      [Shows overview of all tasks Sarah assigned]

    Example 4 - Completing task:
    User: "I'm Bola, I finished the production bug"
    Agent: completeTask(user="Bola", taskDescription="production bug")
      "✅ Task completed! ~~Production bug fix~~
      Great work, Bola! 🎉"
```

### Agent-to-Agent API

RepoPulse supports the A2A protocol for programmatic agent interaction.

**Endpoint:** `POST /a2a/agent/taskManagementSystem`

**Request (JSON-RPC 2.0):**

```json
{
  "jsonrpc": "2.0",
  "id": "request-001",
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "Set up a meeting for me today by 10pm"
        }
      ],
      "messageId": "msg-001",
      "taskId": "task-001"
    },
    "configuration": {
      "blocking": true
    }
  }
}

```

**Response**

```json
{
    "jsonrpc": "2.0",
    "id": "request-001",
    "result": {
        "id": "task-001",
        "contextId": "3a4f4e11-42c4-4002-8599-6e056300b91b",
        "status": {
            "state": "completed",
            "timestamp": "2025-11-03T12:57:36.043Z",
            "message": {
                "messageId": "59ae1256-de8d-423e-b3e5-2212d3846f53",
                "role": "agent",
                "parts": [
                    {
                        "kind": "text",
                        "text": "OK. I've set up a meeting for you for today at 10pm.\n"
                    }
                ],
                "kind": "message"
            }
        },
        "artifacts": [
            {
                "artifactId": "45b5ca18-f289-4b76-8200-bc3c7dab5d2d",
                "name": "taskManagementSystemResponse",
                "parts": [
                    {
                        "kind": "text",
                        "text": "OK. I've set up a meeting for you for today at 10pm.\n"
                    }
                ]
            },
            {
                "artifactId": "e7520cf3-e3ad-4f2e-99a7-68befaa5b4da",
                "name": "ToolResults",
                "parts": [
                    {
                        "kind": "data",
                        "data": {
                            "type": "tool-result",
                            "runId": "a444658c-df67-4d8e-b0c7-041d79f788d1",
                            "from": "AGENT",
                            "payload": {
                                "args": {
                                    "dueDate": "2025-11-03T22:00:00",
                                    "task": "Meeting",
                                    "assignedTo": "unknown",
                                    "priority": "medium",
                                    "assignedBy": "unknown"
                                },
                                "toolCallId": "pFdx2GeaHR9HQsyg",
                                "toolName": "reminderTool",
                                "result": {
                                    "success": true,
                                    "message": "Task assigned to unknown!\n\nPriority: medium\nTask: Meeting\n Due: Monday, November 3, 2025 at 10:00 PM\nAssigned by: unknown",
                                    "taskId": "task_1762174655372_0t198xa7h"
                                }
                            }
                        }
                    }
                ]
            }
        ],
        "history": [
            {
                "kind": "message",
                "role": "user",
                "parts": [
                    {
                        "kind": "text",
                        "text": "Set up a meeting for me today by 10pm"
                    }
                ],
                "messageId": "msg-001",
                "taskId": "task-001"
            },
            {
                "kind": "message",
                "role": "agent",
                "parts": [
                    {
                        "kind": "text",
                        "text": "OK. I've set up a meeting for you for today at 10pm.\n"
                    }
                ],
                "messageId": "276ccc70-6041-4566-988c-3155dd2c171d",
                "taskId": "task-001"
            }
        ],
        "kind": "task"
    }
}
```

## 🛠️ Technology Stack

- **[Mastra.ai](https://mastra.ai)**: AI agent framework
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)**: LLM for natural language understanding
- **[LibSQL](https://github.com/tursodatabase/libsql)**: Embedded SQL database for memory/storage
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation
- **TypeScript**: Type-safe development

