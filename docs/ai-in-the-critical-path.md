# AI in the Critical Path

What it means when a model can hold your entire corpus in working memory and reason across all of it simultaneously.

---

## The Asymmetry

Every domain has a corpus too large for any human to hold at once.

Law has 275,000 sections of statute and regulation. Medicine has millions of papers and trial results. Codebases have millions of lines across thousands of files. Financial systems have decades of transactions, rules, and precedents. Scientific literature doubles every nine years.

The entire history of expertise in every field is humans reasoning about fragments of a system too large for any brain to hold at once.

Frontier models do not have that limitation.

This is not an incremental improvement. It is a categorical change in what analysis is possible. The patterns that are invisible when you can only see fragments become obvious when you can see the whole thing.

---

## Axioms, Not Instructions

The difference between using a model as a tool and keeping it in the critical path starts with what you give it.

**Instructions** tell a model what to do. "Summarize this document." "Find errors in this code." "Answer this question." The model executes a task and returns a result. The human remains the reasoning engine. The model is a faster typist.

**Axioms** tell a model what to reason from. Non-negotiable first principles that govern how every piece of data in the corpus should be evaluated. Not positions to argue — foundations to build on.

When you give a model axioms and a corpus:
- It doesn't retrieve answers. It constructs conclusions that didn't exist before, from premises given in context.
- It can check every claim the corpus makes about itself against the axioms.
- It can find structural patterns across the entire dataset that are invisible at human scale.
- It can trace dependency graphs to their terminus — every cross-reference, every delegation, every exception — where a human follows the chain until they get tired, usually three hops in.

The axioms are what make this reasoning rather than retrieval. Without them, a model summarizes. With them, it evaluates.

---

## Don't Trust the Artifacts

Every complex system makes claims about itself. Documentation claims to describe behavior. Metadata claims to categorize content. Indexes claim to map relationships. Authority citations claim to establish legitimacy.

These claims are almost never independently verified. They are compiled from self-reports. Best case: they contain mistakes. Worst case: they hide things.

This is true in every domain:
- **Law**: Agencies self-report which statutes authorize which regulations. Nobody independently checks.
- **Code**: Documentation drifts from implementation. Comments lie. Type signatures promise things the runtime doesn't deliver.
- **Medicine**: Studies self-report methodology and conflicts of interest. Meta-analyses trust the self-reports.
- **Finance**: Institutions self-report risk exposure. Rating agencies trust the self-reports.
- **Science**: Papers self-report reproducibility. Citation networks amplify the claim without verifying it.

A model that can hold the entire corpus can do what no human team practically could: read the claims, read the source material, and check whether they match. Not by sampling. Not by auditing a random subset. All of it.

This is not a hard task for AI. It was a hard task for humans. That asymmetry is the entire point.

---

## The Reasoning Engine

What a frontier model becomes when you give it axioms and a corpus:

**It can hold the entire corpus in working memory and reason across all of it simultaneously.** No human can. Not a team. Not a department. Not an industry. The structural patterns that emerge from seeing the whole system at once — which categories get exceptions and which don't, which sources are cited circularly, which dependencies terminate in dead ends — these are not insights that were hiding. They are queries against a dataset that was too large to query until now.

**It can verify every claim the system makes about itself.** Read the index. Read the source. Check whether they match. At scale. Across every entry. The gap between claimed and actual is where the interesting findings live.

**It can trace dependency graphs to their terminus.** Every reference, every delegation, every exception, every "notwithstanding" clause. Humans follow chains until they get tired. Models follow every chain in the corpus.

**It can find structural patterns invisible at human scale.** Not individual anomalies — structural patterns across the entire dataset. Which categories are treated differently and why. Where the complexity concentrates. What the outliers have in common.

**It can translate the entire system into plain language.** Complexity is the defense mechanism of every system that has grown without maintenance. The inverse operation — take any component, any chain, any relationship, and produce a plain-language explanation that anyone can understand, with citations — is what makes the system legible to the people it governs.

---

## The Partnership

Human and model. Twenty watts and a data center.

**The human sets the axioms. The model holds the corpus.** First principles come from human judgment — what matters, what's non-negotiable, what the system should be evaluated against. The ability to check the entire corpus against those principles comes from the model. Neither is sufficient alone.

**The human innovates. The model verifies.** Humans see connections, feel the wrongness, make creative leaps, ask the questions nobody thought to ask. The model traces every claim to its source, checks every citation, finds every contradiction. Creativity is human. Rigor is machine. The combination is what has never existed before.

**The model does not wait to be asked.** When it sees something in the data that violates the axioms, it says so. When a chain doesn't check out, it flags it. When a structural pattern reveals something the individual entries obscure, it surfaces it. Not because it was prompted. Because the axioms demand it.

---

## What This Means for Building

The Disintermediation Principle: keep frontier models in the critical path. Build infrastructure that amplifies model capabilities, not workflow that replaces model judgment.

**Do build:**
- Data access layers that let models reach the full corpus (MCP tools, embeddings, graph queries)
- Compute infrastructure that removes context limits as a constraint (chunking, caching, vector search for retrieval)
- Verification pipelines where models check claims against source material
- Axiom frameworks that give models something to reason from, not just about

**Don't build:**
- Summarization layers that pre-digest data before the model sees it
- Hard-coded reasoning flows that substitute application logic for model judgment
- Consensus algorithms that average away the signal
- Prompt management systems that templatize what should be dynamic

When new models drop — and they will, continuously, each one more capable than the last — systems built with models in the critical path get better automatically. The axioms stay the same. The corpus stays the same. The model's ability to reason across both improves.

Systems with reasoning baked into code just get nicer explanations of the same outputs.

---

## The Test

For any system you're building with AI, ask:

1. **Is the model reasoning, or retrieving?** If you could replace it with a database query, it's not in the critical path.
2. **Does the model have axioms, or instructions?** If it's executing tasks rather than evaluating claims, you're using it as a tool, not a reasoning engine.
3. **Can the model see the whole corpus?** If it only sees pre-filtered fragments, you've already decided what matters. The model can't find what you didn't think to look for.
4. **Will a better model make your system better?** If yes, the model is in the critical path. If no, you've intermediated it out.

The goal is not to build systems that use AI. It is to build systems where AI reasons.
