# Blog Section Setup Prompt for Your Portfolio

Copy this entire prompt and paste it to Claude Sonnet 4.5 or use it as instructions for implementing the blog section.

---

## CONTEXT

I have a portfolio website (similar to https://yashmaheshwari.is-a.dev/) and need to add a blog section. I have a complete blog post about "Deep Agents" ready to publish.

**Current Portfolio Structure:**
- Main page with: Hero, About, Skills, Projects, Contact sections
- Clean, modern design with dark theme
- Responsive layout
- Smooth scrolling navigation

**Reference Blog Style:** https://aysh.me/blogs/sql-vs-nosql-databases
- Clean typography
- Code syntax highlighting
- Table of contents
- Reading time estimate
- Tag system
- Responsive design

---

## REQUIREMENTS

### 1. Main Page Updates

**Add "Blogs" navigation link** to the header:
```
Current: Home | About | Skills | Projects | Contact
New: Home | About | Skills | Projects | Blogs | Contact
```

**Add Blogs preview section** on main page (optional but recommended):
- Title: "Latest Insights"
- Shows 2-3 most recent blog posts as cards
- Each card shows: title, date, read time, excerpt, tags
- "View All Blogs →" button linking to `/blogs`

### 2. Blog Listing Page (`/blogs` or `/blogs.html`)

**Layout:**
- Page title: "Blog" or "Insights"
- Optional filter/search by tags
- Grid of blog post cards (2-3 columns on desktop, 1 on mobile)

**Each blog card should display:**
- Cover image (if available)
- Title
- Publication date
- Read time (e.g., "22 min read")
- Short excerpt (150 characters)
- Tags as pills/badges
- Hover effect
- Click goes to full blog post

**Example card structure:**
```html
<div class="blog-card">
  <img src="/images/deep-agents-hero.png" alt="Blog cover">
  <div class="blog-meta">
    <span class="date">January 18, 2026</span>
    <span class="read-time">22 min read</span>
  </div>
  <h3>Deep Agents: Why Most AI Agents Are Shallow</h3>
  <p class="excerpt">A complete guide to building AI agents that plan, delegate, and remember...</p>
  <div class="tags">
    <span class="tag">Deep Agents</span>
    <span class="tag">LangChain</span>
    <span class="tag">AI</span>
  </div>
</div>
```

### 3. Individual Blog Post Page (`/blogs/deep-agents.html`)

**Layout structure:**

```
┌─────────────────────────────────────┐
│ Navigation Header (same as main)    │
├─────────────────────────────────────┤
│ Blog Post Header:                   │
│ - Cover image (full width)          │
│ - Title (large, prominent)          │
│ - Metadata (author, date, read time)│
│ - Tags                              │
├─────────────────────────────────────┤
│ ┌───────────┬─────────────────────┐ │
│ │ Table of  │ Main Content:       │ │
│ │ Contents  │ - Markdown rendered │ │
│ │ (sticky)  │ - Code blocks       │ │
│ │           │ - Tables            │ │
│ │           │ - Images            │ │
│ │           │ - Mermaid diagrams  │ │
│ └───────────┴─────────────────────┘ │
├─────────────────────────────────────┤
│ Footer / Related Posts              │
└─────────────────────────────────────┘
```

**Features needed:**
- Responsive typography (larger on desktop)
- Code syntax highlighting (use Prism.js or Highlight.js)
- Mermaid diagram rendering (include mermaid.min.js)
- Smooth scroll to TOC sections
- Copy button for code blocks
- Dark theme consistent with main site
- Social share buttons (optional)

### 4. File Structure

Organize blog files like this:

```
project/
├── index.html (main portfolio page)
├── blogs.html (blog listing page)
├── blogs/
│   ├── deep-agents.html (individual blog post)
│   └── [future-posts].html
├── blog-content/
│   └── deep-agents.md (markdown source)
├── public/
│   └── images/
│       ├── deep-agents-hero.png
│       ├── four-pillars.png
│       └── [other-blog-images].png
├── css/
│   ├── main.css (existing styles)
│   └── blog.css (blog-specific styles)
└── js/
    ├── main.js (existing)
    └── blog.js (TOC, code copy, etc.)
```

### 5. Styling Requirements

**Match the portfolio's design:**
- Same color scheme (dark theme)
- Same fonts
- Same navbar style
- Smooth animations/transitions

**Blog-specific styling:**
```css
/* Typography */
- Blog title: 2.5-3rem, bold
- Headings: Clear hierarchy (h2, h3, h4)
- Body text: 1.1rem, line-height 1.7
- Code blocks: Monospace, dark background
- Max width: 800px for readability

/* Code blocks */
- Syntax highlighting
- Copy button in top-right
- Line numbers (optional)
- Language indicator

/* Tables */
- Bordered, striped rows
- Responsive (scroll on mobile)

/* Tags */
- Pill/badge style
- Hover effect
- Clickable (filter by tag)

/* Mermaid diagrams */
- Dark theme variant
- Responsive sizing
```

### 6. Technology Stack

**Recommended:**
- Static HTML/CSS/JS (no framework needed for start)
- Markdown to HTML conversion (can be manual or scripted)
- Prism.js for syntax highlighting
- Mermaid.js for diagrams
- (Optional) Static site generator like 11ty or Hugo for future scalability

**Libraries to include:**
```html
<!-- Syntax highlighting -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>

<!-- Mermaid diagrams -->
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: true, theme: 'dark' });</script>
```

### 7. Functionality

**Table of Contents:**
- Auto-generated from h2/h3 headings
- Sticky on scroll (desktop only)
- Highlights current section
- Smooth scroll on click

**Code Copy Button:**
```javascript
// Add copy button to all code blocks
document.querySelectorAll('pre').forEach(pre => {
  const button = document.createElement('button');
  button.textContent = 'Copy';
  button.onclick = () => {
    navigator.clipboard.writeText(pre.textContent);
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 2000);
  };
  pre.appendChild(button);
});
```

**Reading Progress Bar:**
- Fixed at top
- Shows % of article read
- Smooth animation

---

## IMPLEMENTATION STEPS

### Step 1: Update Main Portfolio
1. Add "Blogs" link to navigation
2. (Optional) Add "Latest Insights" section showing recent posts
3. Style blog cards to match portfolio design

### Step 2: Create Blog Listing Page
1. Create `blogs.html`
2. Design grid layout for blog cards
3. Add filtering by tags (optional)
4. Ensure responsive design

### Step 3: Create Blog Post Template
1. Create `blogs/deep-agents.html`
2. Convert markdown content to HTML
3. Add Table of Contents generation
4. Include syntax highlighting
5. Add Mermaid diagram rendering
6. Style everything to match main site

### Step 4: Add Blog Styles
1. Create `css/blog.css`
2. Style typography for readability
3. Style code blocks with copy button
4. Style tables
5. Style tags/metadata
6. Ensure mobile responsiveness

### Step 5: Add Interactivity
1. Create `js/blog.js`
2. Implement TOC auto-generation
3. Add code copy functionality
4. Add reading progress bar
5. Add smooth scrolling

### Step 6: Test
1. Test on desktop and mobile
2. Check all links work
3. Verify code highlighting works
4. Verify Mermaid diagrams render
5. Check performance/loading speed

---

## SPECIFIC REQUESTS

**Please provide:**
1. Complete HTML structure for `blogs.html` (listing page)
2. Complete HTML structure for `blogs/deep-agents.html` (post template)
3. Complete CSS for blog styling (`blog.css`)
4. JavaScript for TOC generation and code copy (`blog.js`)
5. Instructions for converting markdown to HTML (can use a tool or script)

**Design preferences:**
- Match the dark theme from my portfolio
- Clean, modern, minimal design
- Focus on readability
- Professional look
- Mobile-first responsive

**Don't include:**
- Complex build systems (keep it simple)
- Backend/database (static files only for now)
- Comments section (can add later)
- Analytics (can add later)

---

## EXAMPLE METADATA

For the Deep Agents blog post:

```yaml
title: "Deep Agents: Why Most AI Agents Are Shallow (And How to Fix It)"
date: "2026-01-18"
author: "Yash Maheshwari"
readTime: "22 min"
tags: ["Deep Agents", "LangChain", "LangGraph", "AI Agents", "LLMs"]
coverImage: "/images/deep-agents-hero.png"
excerpt: "A complete guide to building AI agents that actually plan, delegate, and remember. Learn the architecture behind Claude Code and Deep Research."
```

---

## OUTPUT FORMAT

Please provide:

1. **HTML Templates** (complete, copy-paste ready)
2. **CSS Styles** (blog-specific, organized)
3. **JavaScript Functions** (well-commented)
4. **Setup Instructions** (step-by-step)
5. **Folder Structure** (clear organization)

Make it production-ready and easy to maintain!

---

## ADDITIONAL NOTES

- I'll manually place the markdown content into the HTML template (or you can suggest a simple conversion method)
- I'll generate images separately and place in `/public/images/`
- I want to keep it simple for now but scalable for future blog posts
- Prioritize clean code and good comments

---

**This prompt should give you everything you need to add a professional blog section to your portfolio. Just paste it to Claude and you'll get complete implementation code!**