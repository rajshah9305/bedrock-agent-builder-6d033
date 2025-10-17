#!/usr/bin/env node

/**
 * Claude Haiku 4.5 Code Analyzer
 * Automated code error detection and analysis using AWS Bedrock
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const CONFIG = {
  // Claude Haiku 4.5 model ID (fallback to 3.5 Haiku if not available)
  MODEL_IDS: [
    "anthropic.claude-3-5-haiku-20241022-v2:0", // Latest Haiku 3.5
    "anthropic.claude-3-haiku-20240307-v1:0"    // Fallback to 3 Haiku
  ],
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.1, // Low temperature for consistent analysis
  
  // File patterns to analyze
  INCLUDE_PATTERNS: [
    '**/*.js',
    '**/*.jsx', 
    '**/*.ts',
    '**/*.tsx',
    '**/*.json',
    '**/*.md'
  ],
  
  // Directories to ignore
  IGNORE_DIRS: [
    'node_modules',
    'dist',
    'build',
    '.git',
    '.next',
    'coverage',
    '.nyc_output'
  ],
  
  // Files to ignore
  IGNORE_FILES: [
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock'
  ]
};

// Initialize AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: CONFIG.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Get all files to analyze
 */
function getAllFiles(dir, baseDir = dir) {
  const files = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const relativePath = relative(baseDir, fullPath);
      
      // Skip ignored directories
      if (CONFIG.IGNORE_DIRS.some(ignoreDir => relativePath.includes(ignoreDir))) {
        continue;
      }
      
      // Skip ignored files
      if (CONFIG.IGNORE_FILES.includes(item)) {
        continue;
      }
      
      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else {
        const ext = extname(item);
        if (['.js', '.jsx', '.ts', '.tsx', '.json', '.md'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Read file content safely
 */
function readFileContent(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Invoke Claude model for analysis
 */
async function invokeClaude(prompt, modelId) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: CONFIG.MAX_TOKENS,
    temperature: CONFIG.TEMPERATURE,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }]
      }
    ]
  };

  try {
    const response = await bedrockClient.send(
      new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: modelId,
      })
    );

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  } catch (error) {
    console.error(`❌ Error with model ${modelId}:`, error.message);
    throw error;
  }
}

/**
 * Analyze a single file for errors and issues
 */
async function analyzeFile(filePath) {
  const content = readFileContent(filePath);
  if (!content) return null;

  const relativePath = relative(projectRoot, filePath);
  const fileExtension = extname(filePath);
  
  // Skip very large files
  if (content.length > 50000) {
    console.log(`⏭️  Skipping large file: ${relativePath} (${content.length} chars)`);
    return null;
  }

  const prompt = `
Analyze this code file for errors, issues, and improvements:

File: ${relativePath}
Extension: ${fileExtension}
Size: ${content.length} characters

Code:
\`\`\`${fileExtension.slice(1)}
${content}
\`\`\`

Please provide a detailed analysis focusing on:

1. **Syntax Errors**: Any syntax issues that would prevent compilation/runtime
2. **Runtime Errors**: Potential runtime errors, null/undefined access, etc.
3. **Logic Issues**: Logical bugs or incorrect implementations
4. **Performance Issues**: Inefficient code, memory leaks, unnecessary re-renders
5. **Security Vulnerabilities**: XSS, injection attacks, sensitive data exposure
6. **Best Practices**: Code style, naming conventions, React/JS best practices
7. **Accessibility Issues**: Missing ARIA labels, keyboard navigation, etc.
8. **Dependencies**: Missing imports, circular dependencies, unused imports

Format your response as:
## Analysis for ${relativePath}

### 🔴 Critical Issues (Must Fix)
- List critical errors that break functionality

### 🟡 Warnings (Should Fix)  
- List warnings and potential issues

### 💡 Suggestions (Nice to Have)
- List improvement suggestions

### ✅ Good Practices Found
- List positive aspects of the code

Rate the overall code quality from 1-10 and provide a summary.
`;

  // Try models in order of preference
  for (const modelId of CONFIG.MODEL_IDS) {
    try {
      console.log(`🔍 Analyzing ${relativePath} with ${modelId}...`);
      const analysis = await invokeClaude(prompt, modelId);
      return {
        filePath: relativePath,
        fullPath: filePath,
        analysis,
        modelUsed: modelId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.log(`❌ Failed with ${modelId}, trying next model...`);
      continue;
    }
  }
  
  throw new Error(`All models failed for file: ${relativePath}`);
}

/**
 * Generate project-wide analysis summary
 */
async function generateProjectSummary(analyses) {
  const prompt = `
Based on the following code analysis results from multiple files in a React/Node.js project, provide a comprehensive project summary:

${analyses.map(analysis => `
## ${analysis.filePath}
${analysis.analysis}
`).join('\n')}

Please provide:

1. **Project Health Score** (1-10)
2. **Critical Issues Summary** - Top 5 most critical issues across the codebase
3. **Common Patterns** - Recurring issues or anti-patterns found
4. **Security Assessment** - Overall security posture
5. **Performance Concerns** - Major performance bottlenecks
6. **Architecture Recommendations** - High-level suggestions
7. **Priority Action Items** - What to fix first
8. **Technology Stack Assessment** - How well the stack is being used

Format as a comprehensive project report.
`;

  for (const modelId of CONFIG.MODEL_IDS) {
    try {
      console.log(`📊 Generating project summary with ${modelId}...`);
      const summary = await invokeClaude(prompt, modelId);
      return {
        summary,
        modelUsed: modelId,
        timestamp: new Date().toISOString(),
        filesAnalyzed: analyses.length
      };
    } catch (error) {
      console.log(`❌ Failed with ${modelId}, trying next model...`);
      continue;
    }
  }
  
  throw new Error("All models failed for project summary");
}

/**
 * Save analysis results to file
 */
function saveResults(analyses, summary) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const results = {
    timestamp: new Date().toISOString(),
    summary,
    fileAnalyses: analyses.filter(a => a !== null),
    config: CONFIG
  };

  const outputFile = join(projectRoot, `claude-analysis-${timestamp}.json`);
  writeFileSync(outputFile, JSON.stringify(results, null, 2));
  
  console.log(`\n💾 Analysis results saved to: ${relative(projectRoot, outputFile)}`);
  return outputFile;
}

/**
 * Display analysis results in console
 */
function displayResults(analyses, summary) {
  console.log('\n' + '='.repeat(80));
  console.log('🤖 CLAUDE HAIKU CODE ANALYSIS RESULTS');
  console.log('='.repeat(80));
  
  // Display project summary
  console.log('\n📊 PROJECT SUMMARY');
  console.log('-'.repeat(40));
  console.log(summary.summary);
  
  // Display file-specific issues
  console.log('\n📁 FILE-SPECIFIC ANALYSES');
  console.log('-'.repeat(40));
  
  analyses.filter(a => a !== null).forEach(analysis => {
    console.log(`\n🔍 ${analysis.filePath}`);
    console.log(`Model: ${analysis.modelUsed}`);
    console.log(analysis.analysis);
    console.log('-'.repeat(40));
  });
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Main analysis function
 */
async function runAnalysis() {
  console.log('🚀 Starting Claude Haiku Code Analysis');
  console.log(`📍 Project Root: ${projectRoot}`);
  console.log(`🌍 AWS Region: ${CONFIG.AWS_REGION}`);
  
  // Check AWS credentials
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found! Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
    process.exit(1);
  }
  
  try {
    // Get all files to analyze
    console.log('\n📂 Scanning project files...');
    const files = getAllFiles(projectRoot);
    console.log(`Found ${files.length} files to analyze`);
    
    if (files.length === 0) {
      console.log('No files found to analyze.');
      return;
    }
    
    // Analyze files (limit to first 10 files for demo, remove limit for full analysis)
    const filesToAnalyze = files.slice(0, 10);
    console.log(`Analyzing ${filesToAnalyze.length} files (limited for demo)...`);
    
    const analyses = [];
    for (const file of filesToAnalyze) {
      try {
        const analysis = await analyzeFile(file);
        analyses.push(analysis);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to analyze ${file}:`, error.message);
        analyses.push(null);
      }
    }
    
    // Generate project summary
    console.log('\n📊 Generating project summary...');
    const summary = await generateProjectSummary(analyses.filter(a => a !== null));
    
    // Save and display results
    const outputFile = saveResults(analyses, summary);
    displayResults(analyses, summary);
    
    console.log('\n✅ Analysis complete!');
    console.log(`📄 Full results saved to: ${relative(projectRoot, outputFile)}`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

// Run the analysis if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAnalysis().catch(console.error);
}

export { runAnalysis, analyzeFile, generateProjectSummary };
