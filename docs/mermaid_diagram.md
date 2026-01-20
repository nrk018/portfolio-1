# Mermaid Diagrams for Deep Agents Blog

Use these Mermaid definitions to generate diagrams or visualize the concepts described in `images.md`.

## Diagram 1: Hero/Cover Concept (Structure)

```mermaid
graph LR
    subgraph Shallow [Shallow Agent]
        direction TB
        SA((Agent))
        T1[Tool 1]
        T2[Tool 2]
        T3[Tool 3]
        SA --> T1
        SA --> T2
        SA --> T3
        style SA fill:#3B82F6,stroke:#fff,color:#fff
    end

    subgraph Deep [Deep Agent]
        direction LR
        DA((Deep Agent))

        subgraph Pillars
            Plan[Planning<br/>(Checklist)]
            File[Files<br/>(Folder)]
            Sub[Subagents<br/>(Nodes)]
            Prompt[Prompts<br/>(Docs)]
        end

        DA === Plan
        DA === File
        DA === Sub
        DA === Prompt

        style DA fill:#F97316,stroke:#A855F7,stroke-width:4px,color:#fff
    end
```

## Diagram 2: Four Pillars Visualization

```mermaid
graph TD
    %% Central Node
    Core((Deep Agent<br/>Core))

    %% Pillars surrounding
    Plan[Planning Pillar<br/>Goal Decomposition]
    File[Files Pillar<br/>Memory]
    Sub[Subagents Pillar<br/>Delegation]
    Prompt[Prompts Pillar<br/>Instruction]

    %% Connections
    Core <--> Plan
    Core <--> File
    Core <--> Sub
    Core <--> Prompt

    %% Styling based on prompt colors
    style Core fill:#F97316,stroke:#fff,stroke-width:2px,color:#fff
    style Plan fill:#3B82F6,color:#fff
    style File fill:#10B981,color:#fff
    style Sub fill:#A855F7,color:#fff
    style Prompt fill:#F97316,color:#fff
```

## Diagram 3: Context Engineering

```mermaid
graph LR
    subgraph Chaos [Stage 1: Context Chaos]
        direction TB
        D1[Docs]
        D2[Code]
        D3[Search Results]
        D4[Databases]
        style Chaos fill:#1a1a1a,stroke:#EF4444,stroke-width:2px,color:#fff
    end

    subgraph Filter [Stage 2: Smart Selection]
        Engine((Context<br/>Engine))
        style Engine fill:#1a1a1a,stroke:#3B82F6,stroke-width:2px,color:#fff
    end

    subgraph Focused [Stage 3: Focused Context]
        direction TB
        R1[Relevant File]
        R2[Summary]
        style Focused fill:#1a1a1a,stroke:#10B981,stroke-width:2px,color:#fff
    end

    Chaos -.->|Filter| Engine
    Engine ===>|Inject| Focused

    style D1 fill:#333,stroke:#666
    style D2 fill:#333,stroke:#666
    style D3 fill:#333,stroke:#666
    style D4 fill:#333,stroke:#666
    style R1 fill:#064e3b,stroke:#10B981
    style R2 fill:#064e3b,stroke:#10B981
    style Engine fill:#1e3a8a,stroke:#3B82F6
```

## Diagram 4: Shallow vs Deep Workflow Comparison

```mermaid
graph TD
    subgraph Shallow [Shallow Agent Workflow]
        S_User([User]) --> S_Agent[Agent]
        S_Agent --> S_Tool[Tool]
        S_Tool --> S_Resp([Response])
        style Shallow fill:#f0f9ff,stroke:#3B82F6
    end

    subgraph Deep [Deep Agent Workflow]
        D_User([User]) --> D_Plan[Planning]
        D_Plan --> D_Loop{Execution Loop}

        D_Loop -->|Store| D_Files[(Files)]
        D_Loop -->|Delegate| D_Subs[[Subagents]]
        D_Loop -->|Execute| D_Tools[Tools]

        D_Files --> D_Synth[Synthesis]
        D_Subs --> D_Synth
        D_Tools --> D_Synth

        D_Synth --> D_Resp([Response])
        style Deep fill:#fff7ed,stroke:#F97316
    end
```

## Diagram 5: Subagent Delegation

```mermaid
graph TD
    Main((Main Agent))

    subgraph Subagents
        R[Research Subagent]
        A[Analysis Subagent]
        W[Writing Subagent]
    end

    FileSystem[(Shared File System)]

    %% Delegation
    Main -->|Task| R
    Main -->|Task| A
    Main -->|Task| W

    %% File System Collaboration
    R <-->|Read/Write| FileSystem
    A <-->|Read/Write| FileSystem
    W <-->|Read/Write| FileSystem

    %% Styling
    style Main fill:#F97316,color:#fff
    style R fill:#3B82F6,color:#fff
    style A fill:#10B981,color:#fff
    style W fill:#A855F7,color:#fff
    style FileSystem fill:#333,color:#fff
```

## Diagram 6: Cost vs Quality Tradeoff

```mermaid
graph LR
    subgraph Traditional ["Traditional Agent"]
        T_Cost[Low Cost: $0.05]
        T_Time[Fast: 45s]
        T_Success[Fail: 40% Success]
        style Traditional fill:#1a1a1a,stroke:#EF4444,color:#fff
        style T_Success fill:#450a0a,stroke:#EF4444
    end

    subgraph Deep ["Deep Agent"]
        D_Cost[Higher Cost: $0.85]
        D_Time[Slower: 2.5m]
        D_Success[High Success: 85%]
        style Deep fill:#1a1a1a,stroke:#10B981,color:#fff
        style D_Success fill:#064e3b,stroke:#10B981
    end

    Traditional -->|The Tradeoff: Thoroughness| Deep
```
