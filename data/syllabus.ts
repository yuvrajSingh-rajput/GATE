export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export const GATE_CS_SYLLABUS: Subject[] = [
  {
    id: "general-aptitude",
    name: "General Aptitude",
    topics: [
      { id: "ga-verbal", name: "Verbal Aptitude" },
      { id: "ga-quant", name: "Quantitative Aptitude" },
      { id: "ga-analytical", name: "Analytical Aptitude" },
      { id: "ga-spatial", name: "Spatial Aptitude" },
    ],
  },
  {
    id: "eng-math",
    name: "Engineering Mathematics",
    topics: [
      { id: "em-discrete", name: "Discrete Mathematics" },
      { id: "em-linear", name: "Linear Algebra" },
      { id: "em-calculus", name: "Calculus" },
      { id: "em-prob", name: "Probability and Statistics" },
    ],
  },
  {
    id: "digital-logic",
    name: "Digital Logic",
    topics: [
      { id: "dl-boolean", name: "Boolean Algebra" },
      { id: "dl-combinational", name: "Combinational and Sequential Circuits" },
      { id: "dl-minimization", name: "Minimization" },
      { id: "dl-number", name: "Number Representations and Computer Arithmetic" },
    ],
  },
  {
    id: "coa",
    name: "Computer Organization and Architecture",
    topics: [
      { id: "coa-instructions", name: "Machine Instructions and Addressing Modes" },
      { id: "coa-alu", name: "ALU, Data‐path and Control Unit" },
      { id: "coa-pipeline", name: "Instruction Pipelining, Pipeline Hazards" },
      { id: "coa-memory", name: "Memory Hierarchy: Cache, Main Memory and Secondary Storage" },
      { id: "coa-io", name: "I/O Interface (Interrupt and DMA mode)" },
    ],
  },
  {
    id: "prog-ds",
    name: "Programming and Data Structures",
    topics: [
      { id: "pds-c", name: "Programming in C" },
      { id: "pds-recursion", name: "Recursion" },
      { id: "pds-arrays", name: "Arrays, Stacks, Queues, Linked Lists" },
      { id: "pds-trees", name: "Trees, Binary Search Trees, Binary Heaps, Graphs" },
    ],
  },
  {
    id: "algorithms",
    name: "Algorithms",
    topics: [
      { id: "algo-search", name: "Searching, Sorting, Hashing" },
      { id: "algo-asymptotic", name: "Asymptotic Worst Case Time and Space Complexity" },
      { id: "algo-design", name: "Algorithm Design Techniques: Greedy, Dynamic Programming and Divide-and-Conquer" },
      { id: "algo-graphs", name: "Graph Traversals, Minimum Spanning Trees, Shortest Paths" },
    ],
  },
  {
    id: "toc",
    name: "Theory of Computation",
    topics: [
      { id: "toc-regex", name: "Regular Expressions and Finite Automata" },
      { id: "toc-cfg", name: "Context-Free Grammars and Push-down Automata" },
      { id: "toc-turing", name: "Regular and Context-Free Languages, Pumping Lemma" },
      { id: "toc-decidability", name: "Turing Machines and Undecidability" },
    ],
  },
  {
    id: "compiler",
    name: "Compiler Design",
    topics: [
      { id: "cd-lexical", name: "Lexical Analysis, Parsing, Syntax-Directed Translation" },
      { id: "cd-runtime", name: "Runtime Environments" },
      { id: "cd-intermediate", name: "Intermediate Code Generation" },
      { id: "cd-optimization", name: "Local Optimization, Data Flow Analyses" },
    ],
  },
  {
    id: "os",
    name: "Operating Systems",
    topics: [
      { id: "os-processes", name: "System Calls, Processes, Threads, Inter-process Communication, Concurrency and Synchronization" },
      { id: "os-deadlock", name: "Deadlock" },
      { id: "os-cpu", name: "CPU and I/O Scheduling" },
      { id: "os-memory", name: "Memory Management and Virtual Memory" },
      { id: "os-files", name: "File Systems" },
    ],
  },
  {
    id: "databases",
    name: "Databases",
    topics: [
      { id: "db-er", name: "ER-Model" },
      { id: "db-relational", name: "Relational Model: Relational Algebra, Tuple Calculus, SQL" },
      { id: "db-integrity", name: "Integrity Constraints, Normal Forms" },
      { id: "db-file", name: "File Organization, Indexing (e.g., B and B+ trees)" },
      { id: "db-transactions", name: "Transactions and Concurrency Control" },
    ],
  },
  {
    id: "cn",
    name: "Computer Networks",
    topics: [
      { id: "cn-iso", name: "Concept of Layering: OSI and TCP/IP MAC Protocols" },
      { id: "cn-lan", name: "LAN Technologies (Ethernet)" },
      { id: "cn-routing", name: "IPv4/IPv6 routers, Routing (Shortest Path, Flooding, Distance Vector, Link State)" },
      { id: "cn-tcp", name: "TCP/UDP and Sockets, Congestion Control" },
      { id: "cn-app", name: "Application Layer Protocols (DNS, SMTP, HTTP, FTP, Email)" },
    ],
  },
];
