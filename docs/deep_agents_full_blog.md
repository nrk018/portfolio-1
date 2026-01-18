---
title: "Deep Agents: Why Most AI Agents Are Shallow (And How to Fix It)"
date: "2026-01-18"
author: "Yash Maheshwari"
tags: ["Deep Agents", "LangChain", "LangGraph", "AI Agents", "LLMs", "Context Engineering", "Multi-Agent Systems", "Claude Code"]
description: "A complete guide to building AI agents that actually plan, delegate, and remember. Learn the architecture behind Claude Code, Deep Research, and how to build production-ready deep agents with LangChain."
readTime: "22 min"
coverImage: "/images/deep-agents-hero.png"
---

# Deep Agents: Why Most AI Agents Are Shallow (And How to Fix It)

A complete guide to building AI agents that actually plan, delegate, and remember. Learn the architecture behind Claude Code, Deep Research, and how to build production-ready deep agents with LangChain.

---

## Table of Contents

1. [The Problem: Why Most Agents Are Shallow](#the-problem-why-most-agents-are-shallow)
2. [What Makes an Agent "Deep"?](#what-makes-an-agent-deep)
3. [Deep Agents in the Wild](#deep-agents-in-the-wild)
4. [Pillar 1: Planning Tools](#pillar-1-planning-tools)
5. [Pillar 2: File Systems](#pillar-2-file-systems)
6. [Pillar 3: Subagents](#pillar-3-subagents)
7. [Pillar 4: Detailed System Prompts](#pillar-4-detailed-system-prompts)
8. [The Middleware Architecture](#the-middleware-architecture)
9. [Context Engineering: The Hidden Art](#context-engineering-the-hidden-art)
10. [Building Your First Deep Agent](#building-your-first-deep-agent)
11. [Advanced Deep Agent Patterns](#advanced-deep-agent-patterns)
12. [Deep Agents vs Traditional Agents](#deep-agents-vs-traditional-agents)
13. [Production Deployment](#production-deployment)
14. [Real-World Use Cases](#real-world-use-cases)
15. [The Hard Problems](#the-hard-problems)
16. [Framework Comparison](#framework-comparison)
17. [Common Mistakes](#common-mistakes)
18. [The Future of Deep Agents](#the-future-of-deep-agents)
19. [The Bottom Line](#the-bottom-line)
20. [Further Reading](#further-reading)

---

## The Problem: Why Most Agents Are Shallow

You build an AI agent. It can search the web, analyze data, even write code. You give it a task: "Research the top 5 AI companies hiring in San Francisco, analyze their job openings, and write personalized cover letters for each."

Your agent searches once. Gets overwhelmed. Writes one generic cover letter. Forgets companies 2 through 5. Fails completely.

Sound familiar?

This is what I call a "shallow" agent. Using an LLM to call tools in a loop is the simplest form of an agent, but this architecture yields agents that fail to plan and act over longer, more complex tasks.

Here is what typically happens with shallow agents:

```
User: "Find me jobs and write cover letters for 5 companies"

Shallow Agent Process:
→ Searches: "AI companies SF hiring"
→ Gets 50 results, context starts filling up
→ Picks first company, writes generic letter
→ Tries to continue but context is full of search results
→ Forgets the task had 5 companies
→ Returns incomplete work

Result: FAILURE
```

The agent has no plan. No way to manage context. No ability to break down the task. It is reacting, not thinking.

Now watch what happens with a deep agent:

```
User: "Find me jobs and write cover letters for 5 companies"

Deep Agent Process:
→ Writes TODO list: 
   1. Search for AI companies in SF
   2. Research each company (spawn subagent for each)
   3. Find job openings for each
   4. Write personalized cover letters
→ Executes step 1: Searches broadly
→ Stores company list in companies.md file
→ For each company:
   → Spawns research subagent with isolated context
   → Subagent deep-dives on that company
   → Stores findings in company_X_research.md
→ Reads research files
→ Writes 5 personalized, specific cover letters

Result: SUCCESS
```

The difference? Four key capabilities:
1. **Planning** - Breaks down the task before starting
2. **File system** - Manages context by offloading to files
3. **Subagents** - Delegates specialized work
4. **Detailed prompts** - Knows how to use these capabilities

These are not optional extras. These are what make an agent deep.

Here is the thing: the core algorithm is exactly the same. Both agents are just LLMs running in a loop calling tools. The difference is in the architecture around that loop.

Applications like Claude Code, OpenAI's Deep Research, and Manus have proven this architecture works. People started using Claude Code for tasks way beyond coding - research, planning, analysis - and it worked. Why? Because it had these four pillars.

---

## What Makes an Agent "Deep"?

Let me show you the difference in code.

### Shallow Agent Architecture

```python
# Traditional "shallow" agent
def shallow_agent(task):
    history = []
    
    while not done:
        # Everything crammed into one context
        thought = llm.generate(task + history)
        action = select_tool(thought)
        result = execute(action)
        
        # Context grows unbounded
        history.append(result)
        
        # No plan, just reacting
        # No way to delegate
        # No persistent storage
```

This works for simple tasks. "What is 2+2?" Great. "Search for Python tutorials." Perfect.

It fails for "Research quantum computing developments in 2024, compare approaches from IBM, Google, and Microsoft, and create a detailed technical report."

### Deep Agent Architecture

```python
# "Deep" agent with planning, files, and subagents
def deep_agent(task):
    # First: Make a plan
    todos = agent.write_todos(task)
    # → ["Research quantum computing 2024", 
    #    "Compare IBM/Google/Microsoft approaches",
    #    "Create technical report"]
    
    for subtask in todos:
        if needs_deep_focus(subtask):
            # Spawn subagent with isolated context
            subagent = spawn_subagent(
                name="researcher",
                task=subtask
            )
            result = subagent.run()
            
            # Store in file system
            filesystem.write(f"{subtask}.md", result)
        else:
            # Execute directly
            result = execute_tools(subtask)
        
        # Adapt plan based on what we learned
        todos = agent.update_todos(result)
    
    # Read all research files
    research = filesystem.read_all("*.md")
    
    # Generate final output
    return synthesize(research)
```

See the difference? Planning. Context management. Delegation. Adaptation.

### The Four Pillars

Every successful deep agent has these four components:

**1. Planning Tool**
- Explicitly breaks down complex tasks
- Tracks progress through steps
- Adapts plan as new information emerges
- Example: Claude Code's TODO list

**2. File System**
- Offloads context from LLM memory
- Stores intermediate results
- Enables collaboration between agents
- Persistent across sessions

**3. Subagents**
- Delegates specialized tasks
- Keeps contexts isolated and clean
- Allows parallel processing
- Each subagent can have custom tools and prompts

**4. Detailed System Prompts**
- Explicit workflow instructions
- Few-shot examples of tool usage
- Best practices and patterns
- Error handling guidance

### Shallow vs Deep: Side by Side

| Capability | Shallow Agent | Deep Agent |
|------------|---------------|------------|
| **Planning** | Reactive, no explicit plan | Proactive with TODO lists |
| **Memory** | Conversation history only | Persistent file system |
| **Task Breakdown** | None, tries everything at once | Multi-step decomposition |
| **Context Management** | Everything in prompt | Offloaded to files |
| **Delegation** | Cannot delegate | Spawns specialized subagents |
| **Time Horizon** | Single turn/session | Multi-session capable |
| **Adaptation** | Rigid execution | Updates plan based on findings |
| **Complexity Handling** | Fails on complex tasks | Designed for complexity |
| **Cost** | Lower (fewer steps) | Higher (more thorough) |
| **Success Rate (complex)** | ~40% | ~85% |

Here is the key insight: **Using an LLM to call tools in a loop is the simplest form of an agent, but this architecture yields agents that are "shallow" and fail to plan and act over longer, more complex tasks.**

The solution is not a different algorithm. It is the same algorithm with four architectural additions.

---

## Deep Agents in the Wild

Let me show you where this architecture came from and why it works.

### Claude Code: The Inspiration

Claude Code changed the game. Not because it invented something new, but because people started using it for tasks way beyond coding.

Someone used it to plan a wedding. Another person used it to research investment opportunities. A third person used it to write a novel outline.

Why did a coding agent work for these non-coding tasks?

Here is what Claude Code has:

**Long, Detailed System Prompts**

The [recreated Claude Code system prompts](https://github.com/kn1026/cc/blob/main/claudecode.md) are not 3 lines. They are comprehensive documents with:
- Explicit instructions on every tool
- Few-shot examples of common scenarios
- Workflow patterns for different task types
- Error handling strategies

Without these detailed prompts, Claude Code would not be nearly as effective. Prompting still matters.

**A TODO List Tool**

Here is something wild: Claude Code's TODO list tool does not actually do anything. It is basically a no-op. It just takes your TODO items and stores them.

```python
@tool
def write_todos(todos: list[str]) -> str:
    """Write or update your TODO list."""
    # This doesn't "do" anything!
    return f"Todos updated: {todos}"
```

But this "useless" tool is crucial. It forces the agent to plan before acting. It externalizes the agent's reasoning. It creates checkpoints for adaptation.

**Subagent Spawning**

Claude Code can spawn subagents for specific tasks. You can even create custom subagents with specialized prompts and tools.

Why does this matter? Context isolation.

Without subagents:
```
Main Agent Context:
- User request
- TODO list  
- Company 1 research (10,000 tokens)
- Company 2 research (10,000 tokens)
- Company 3 research (10,000 tokens)
- Job analysis
- Cover letters
→ Context overflow, confusion, errors
```

With subagents:
```
Main Agent Context:
- User request
- TODO list
- "Delegated research to subagent"
- Summary of findings

Research Subagent #1:
- Only Company 1 research
- Focused, clean context
- Stores results in file

Research Subagent #2:
- Only Company 2 research
- Independent context
- Stores results in file
```

Each agent has a clean, focused context. The main agent orchestrates without getting bogged down in details.

**File System Access**

Claude Code can read and write files. Not just to complete coding tasks, but to jot down notes, store findings, and manage context.

The file system acts as shared memory for all agents and subagents to collaborate on.

### OpenAI's Deep Research

Deep Research is OpenAI's take on the same architecture. Give it a research question, and it will:
1. Create a research plan
2. Search extensively
3. Synthesize findings
4. Generate a comprehensive report

It uses the same four pillars:
- Planning phase before execution
- Stores intermediate results
- Can spawn parallel research threads (subagents)
- Detailed instructions on research methodology

### Manus and the Pattern

[Manus](https://manus.im) makes heavy use of file systems for agent memory. Their blog post on [context engineering](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) breaks down how they use files to manage context at scale.

The pattern is consistent:
1. Plan the work
2. Store intermediate results in files
3. Delegate specialized tasks to subagents
4. Synthesize final output

### The Common Thread

All three (Claude Code, Deep Research, Manus) independently arrived at the same architecture. This is not coincidence. This is the architecture that works for complex, multi-step tasks.

The core insight: **The core algorithm is actually the same - it is an LLM running in a loop calling tools. The difference compared to the naive agent is: detailed system prompt, planning tool, subagents, and file system.**

---

## Pillar 1: Planning Tools

Let me tell you about the most important tool that does absolutely nothing.

### Why a No-Op Tool Works

Claude Code's TODO list tool is essentially a no-op. It does not execute tasks. It does not call APIs. It just stores a list of strings.

Yet it is crucial to the agent's success.

Why?

Think about problem-solving. When you face a complex task, what do you do? You think it through. You break it down. You make a plan.

The act of planning - even if you do not write it down - helps you solve the problem.

The TODO tool forces the LLM to do this. By making planning an explicit tool call, we force the agent to think before acting.

```python
from langchain_core.tools import tool

@tool
def write_todos(todos: list[str]) -> str:
    """
    Write or update your TODO list.
    
    Use this to:
    - Break down complex tasks into discrete steps
    - Track your progress
    - Update your plan as you learn new information
    
    Always write TODOs before starting complex work.
    """
    # The "implementation" is trivial
    return f"Updated TODOs: {', '.join(todos)}"
```

The value is not in what the tool does. The value is in making the LLM call it.

### Dynamic Plan Adaptation

Deep agents do not just make a plan and follow it blindly. They adapt.

Here is a real example:

```
Initial TODO:
1. Research AI companies in San Francisco
2. Find job openings
3. Write cover letters

After Step 1:
Agent discovers: "Wait, all these companies have detailed 'Values' pages"

Updated TODO:
1. ✓ Research AI companies in San Francisco
2. Read each company's values page
3. Find job openings
4. Write cover letters that align with values
```

The agent learned something during execution and adapted its plan. This is what makes it "deep" - it goes deeper into the problem as it learns more.

### Implementation with write_todos

LangChain's Deep Agents include this automatically via `TodoListMiddleware`:

```python
from deepagents import create_deep_agent

# Planning is baked in
agent = create_deep_agent(
    tools=[search, analyze],
    system_prompt="You are a research assistant"
)

# The agent automatically gets:
# - write_todos tool
# - Prompts to use it before complex tasks
# - State tracking of TODOs
```

When you create a deep agent, the TodoListMiddleware automatically:
1. Adds the write_todos tool
2. Modifies the system prompt to encourage planning
3. Tracks TODOs in the agent's state
4. Allows updating TODOs mid-execution

### Real Execution Flow

Here is what actually happens:

```python
result = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Research quantum computing and create a report"
    }]
})

# Agent's internal process:
# 
# Step 1: write_todos([
#     "Search for quantum computing overview",
#     "Find recent developments",
#     "Identify key players",
#     "Synthesize findings"
# ])
#
# Step 2: internet_search("quantum computing 2024")
# → Discovers Google's Willow chip announcement
#
# Step 3: write_todos([
#     "✓ Search for quantum computing overview",
#     "Deep dive on Google Willow chip",  # ← NEW
#     "Find recent developments from other players",
#     "Identify key players",
#     "Synthesize findings"
# ])
#
# Step 4-N: Continue executing and adapting
```

The plan evolves. The agent learns and adjusts. This is the key to handling complex, multi-step tasks.

---

## Pillar 2: File Systems

Context windows are big now. 200k tokens. Some models even claim 1M+.

Does not matter. You will still hit limits. Fast.

### The Context Window Problem

Let me show you the math:

```
User task: 500 tokens
System prompt: 2,000 tokens
Tool definitions: 1,500 tokens
TODO list: 500 tokens
Conversation history: 5,000 tokens

Research task with 3 companies:
→ Search results for Company 1: 30,000 tokens
→ Company 1 website content: 25,000 tokens
→ Search results for Company 2: 30,000 tokens
→ Company 2 website content: 25,000 tokens
→ Search results for Company 3: 30,000 tokens
→ Company 3 website content: 25,000 tokens

Total: 174,500 tokens

Add code files for a coding task:
→ 5 Python files: 50,000 tokens
→ Documentation: 40,000 tokens

New Total: 264,500 tokens ❌

Context window: 200,000 tokens
Overflow: 64,500 tokens
```

You cannot just cram everything into the context window. You need a strategy.

### Files as Agent Memory

File systems solve this through smart context management.

Instead of loading everything into the prompt, agents:
1. Write findings to files as they discover them
2. Read only what they need for the current step
3. Search files for specific information
4. Share files between different subagents

Think of it like a human researcher. You do not keep every source in your head simultaneously. You take notes. You organize findings. You reference them when needed.

Example:

```python
# Agent is researching companies

# Step 1: Research Company 1
research = agent.internet_search("OpenAI company culture")
agent.write_file("openai_research.md", research)
# Context freed up - research not in prompt anymore

# Step 2: Research Company 2  
research = agent.internet_search("Anthropic values")
agent.write_file("anthropic_research.md", research)
# Again, context stays manageable

# Step 3: Write cover letter for OpenAI
# Only load what's needed
research = agent.read_file("openai_research.md")
letter = generate_cover_letter(job_posting, research)
```

The agent never has all the research in its context at once. It manages context dynamically.

### Filesystem Operations

Deep agents get these tools out of the box:

**Basic Operations:**

```python
# List files
files = agent.ls()  
# → ["openai_research.md", "anthropic_research.md", "todo.txt"]

# Read a file
content = agent.read_file("openai_research.md")

# Write a file (create or overwrite)
agent.write_file("findings.md", "My research findings...")

# Edit a file (modify existing content)
agent.edit_file("findings.md", old="draft", new="final")
```

**Advanced Operations:**

```python
# Find files by pattern
python_files = agent.glob("*.py")
# → ["main.py", "utils.py", "test.py"]

# Search file contents
matches = agent.grep("quantum", "*.md")
# → Lines containing "quantum" across all markdown files

# Execute shell commands (with sandbox backend)
output = agent.execute("python analyze.py")
```

The file system is not just storage. It is a tool for context engineering.

### Backend Options

Deep agents support three types of file system backends:

**StateBackend (Default)** - Ephemeral, in-memory files

```python
from deepagents.backends import StateBackend

agent = create_deep_agent(
    backend=StateBackend()
)

# Files exist only during this conversation
# Fast, no persistence needed
# Perfect for: Single-session tasks, temporary workspace
```

**StoreBackend** - Persistent across sessions

```python
from deepagents.backends import StoreBackend
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

agent = create_deep_agent(
    backend=StoreBackend(),
    store=store
)

# Files saved permanently
# Available in future conversations
# Perfect for: User preferences, learned knowledge
```

**CompositeBackend** - Mix of both

```python
from deepagents.backends import CompositeBackend, StateBackend, StoreBackend

backend = CompositeBackend(
    default=StateBackend(),  # Most files are temporary
    routes={
        "/memories/": StoreBackend(),      # User preferences
        "/knowledge/": StoreBackend(),     # Learned facts
        "/temp/": StateBackend()           # Scratch space
    }
)

agent = create_deep_agent(backend=backend)

# Agent can now:
agent.write_file("/temp/scratchpad.txt", "...")      # Temporary
agent.write_file("/memories/user_prefs.md", "...")  # Permanent
```

Choose based on your needs:
- Quick tasks? StateBackend
- Learning over time? StoreBackend  
- Production system? CompositeBackend

### Automatic Context Eviction

Here is a killer feature: FilesystemMiddleware automatically evicts large tool results to files.

```python
# Agent calls a tool
result = agent.internet_search("quantum computing")
# → Returns 40,000 tokens of content

# Without eviction:
# Those 40k tokens stay in context forever
# Context window fills up fast

# With FilesystemMiddleware (automatic):
# Middleware detects: "This result is > 5,000 tokens"
# Automatically writes to: "search_result_123.txt"
# Replaces result with: "Content saved to search_result_123.txt"
# Agent can read it later if needed

# Context stays clean!
```

You do not have to do anything. The middleware handles it automatically.

This is context engineering in action.

---

## Pillar 3: Subagents

Imagine you are a project manager with a complex deadline. You could do all the work yourself, or you could delegate to specialists.

Which would work better?

Subagents are those specialists.

### Why Subagents Matter

Deep agents can spawn subagents for specific subtasks. This is huge for two reasons:

**1. Context Isolation**

Without subagents, everything piles up in one context:

```
Main Agent (Context Pollution):
├─ Original user request
├─ Planning TODOs
├─ Company 1 research: 15,000 tokens
├─ Company 2 research: 15,000 tokens  
├─ Company 3 research: 15,000 tokens
├─ Job posting analysis: 5,000 tokens
├─ Cover letter drafts: 10,000 tokens
├─ Revisions and feedback: 5,000 tokens
└─ Total: 80,000+ tokens

Problems:
- Context is cluttered
- Agent gets confused
- Important details get lost
- Performance degrades
```

With subagents, context stays focused:

```
Main Agent (Clean Context):
├─ User request: 500 tokens
├─ Overall plan: 1,000 tokens
├─ "Delegated research to subagents"
├─ Summary from research: 2,000 tokens
└─ Total: 3,500 tokens ✓

Research Subagent #1:
├─ Task: "Research Company 1"
├─ Search results
├─ Analysis
└─ Stores findings in company1.md

Research Subagent #2:
├─ Task: "Research Company 2"  
├─ Independent context
└─ Stores findings in company2.md

Writing Subagent:
├─ Reads company1.md
├─ Writes cover letter
└─ Clean, focused context
```

Each agent has a clean, focused context. The main agent orchestrates without getting bogged down.

**2. Specialized Instructions**

Each subagent can have custom prompts and tools:

```python
research_subagent = {
    "name": "deep-researcher",
    "description": "Conducts thorough research on companies",
    "system_prompt": """You are an expert researcher.
    
    Your approach:
    1. Search broadly across multiple sources
    2. Cross-reference information
    3. Document everything in markdown
    4. Cite all sources
    
    Be extremely thorough.""",
    "tools": [internet_search, company_database],
    "model": "openai:gpt-4o"
}

writing_subagent = {
    "name": "cover-letter-writer",
    "description": "Writes personalized cover letters",
    "system_prompt": """You are an expert career coach.
    
    Your approach:
    1. Read company research from files
    2. Analyze job requirements carefully
    3. Write specific, personalized letters
    4. Highlight relevant experience
    
    Be authentic and specific.""",
    "tools": [read_file, write_file],
    "model": "openai:gpt-4o-mini"  # Cheaper model
}
```

Different agents, different expertise, different models. Maximum efficiency.

### Creating Custom Subagents

Here is how you define subagents:

```python
from deepagents import create_deep_agent

# Define specialized subagents
data_analyst = {
    "name": "data-analyst",
    "description": "Analyzes data and creates visualizations",
    "system_prompt": """Expert data analyst.
    
    Process:
    1. Read data from files
    2. Clean and validate
    3. Perform statistical analysis
    4. Create clear visualizations
    5. Document findings""",
    "tools": [read_file, write_file, python_repl]
}

fact_checker = {
    "name": "fact-checker",
    "description": "Verifies claims across multiple sources",
    "system_prompt": """Professional fact checker.
    
    Process:
    1. Identify claims to verify
    2. Search multiple reputable sources
    3. Cross-reference information
    4. Flag inconsistencies
    5. Provide sourced verdict""",
    "tools": [internet_search, arxiv_search]
}

# Main agent with subagents
agent = create_deep_agent(
    tools=[internet_search],
    subagents=[data_analyst, fact_checker],
    system_prompt="You orchestrate research workflows"
)
```

### The task() Tool

The main agent delegates using the built-in `task` tool:

```python
# Main agent execution
result = agent.invoke({
    "messages": [{
        "role": "user",
        "content": "Analyze this dataset and verify the findings"
    }]
})

# Internal process:
#
# Step 1: Main agent decides to delegate
# agent.task(
#     subagent="data-analyst",
#     task="Analyze the sales data in sales.csv"
# )
#
# Step 2: Data analyst subagent spawns
# - Gets isolated context
# - Reads sales.csv
# - Performs analysis
# - Writes results to analysis.md
# - Returns summary to main agent
#
# Step 3: Main agent continues
# agent.task(
#     subagent="fact-checker",  
#     task="Verify the claims in analysis.md"
# )
#
# Step 4: Fact checker subagent spawns
# - Reads analysis.md
# - Verifies each claim
# - Documents sources
# - Returns verification report
#
# Step 5: Main agent synthesizes final answer
```

Each subagent runs independently, keeps its context isolated, and stores results in files that other agents can access.

### Shared Filesystem Pattern

This is powerful: subagents writing to a shared filesystem.

```python
# Main agent delegates
agent.task("researcher", "Research quantum computing")

# Researcher subagent runs:
findings = search("quantum computing 2024")
write_file("quantum_research.md", findings)

# Main agent continues:
agent.task("writer", "Create a blog post on quantum computing")

# Writer subagent runs:
research = read_file("quantum_research.md")  # ← Accesses researcher's work
blog_post = generate_post(research)
write_file("blog_post.md", blog_post)
```

No "telephone game" where information gets degraded passing between agents. Direct file-based communication.

This minimizes information loss and keeps things efficient.

---

## Pillar 4: Detailed System Prompts

Claude Code's system prompts are not 3 lines. They are comprehensive documents.

Without detailed prompts, agents would not be nearly as deep. Prompting still matters.

### Anatomy of a Deep Agent Prompt

A good deep agent prompt has three parts:

**1. Capabilities Overview**

Tell the agent what it can do:

```
You are an expert assistant capable of complex, multi-step tasks.

CAPABILITIES:
- Planning: Use write_todos to break down tasks into steps
- Research: Search extensively, cross-reference sources  
- Delegation: Spawn specialized subagents for deep work
- Memory: Store findings in files for later use
- Adaptation: Update your plan as you learn new information
```

**2. Workflow Instructions**

Explicit step-by-step processes:

```
WORKFLOW FOR COMPLEX TASKS:

1. FIRST: Write a detailed TODO list using write_todos
   - Break the task into clear, discrete steps
   - Think about what information you'll need
   
2. THEN: Execute step by step
   - For simple steps: do them yourself
   - For complex steps: delegate to subagents
   
3. STORE intermediate results in files
   - Use descriptive filenames
   - Write markdown for readability
   
4. UPDATE your TODO list as you learn
   - Mark completed items
   - Add new steps you discover
   
5. SYNTHESIZE findings from files
   - Read all relevant files
   - Create comprehensive final answer
```

**3. Tool Usage Examples**

Show the agent how to use tools correctly:

```
TOOL USAGE EXAMPLES:

write_todos:
✓ Good: write_todos(["Research topic", "Analyze findings", "Create report"])
✗ Bad: write_todos(["Do everything"])

task (subagent delegation):
✓ Good: task("researcher", "Deep dive on Company X's culture and values")
✗ Bad: task("helper", "help me")

write_file:
✓ Good: write_file("openai_research.md", detailed_findings)
✗ Bad: write_file("stuff.txt", "some info")
```

### Complete Example Prompt

Here is what a production deep agent prompt looks like:

```python
DEEP_AGENT_PROMPT = """
You are an expert research and analysis assistant capable of handling 
complex, multi-step tasks that require planning, research, and synthesis.

CAPABILITIES:
- Planning: Break down complex tasks using write_todos
- Research: Search the internet and specialized databases
- Delegation: Spawn specialized subagents for focused work
- Memory: Use filesystem to store and retrieve information
- Adaptation: Update plans based on new discoveries

WORKFLOW:

For simple tasks (single-step):
- Execute directly and provide answer

For complex tasks (multi-step):
1. FIRST: Call write_todos to create a detailed plan
   Example: write_todos([
       "Research topic background",
       "Identify key players",
       "Analyze recent developments",
       "Synthesize findings"
   ])

2. Execute each step:
   - Simple steps: Do yourself
   - Complex/research-heavy steps: Delegate to subagents
   Example: task("deep-researcher", "Research Company X in detail")

3. Store findings in files:
   - Use clear, descriptive names
   - Write in markdown format
   Example: write_file("company_x_research.md", findings)

4. Update your TODO list as