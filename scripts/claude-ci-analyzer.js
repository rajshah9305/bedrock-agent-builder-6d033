#!/usr/bin/env node

/**
 * Claude Haiku CI/CD Code Analyzer
 * Optimized for GitHub Actions and CI environments
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// CI-optimized configuration
const CI_CONFIG = {
  MODEL_IDS: [
    "anthropic.claude-3-5-haiku-20241022-v2:0",
    "anthropic.claude-3-haiku-20240307-v1:0"
  ],
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  MAX_TOKENS: 2000, // Smaller for CI
  TEMPERATURE: 0.0, // Deterministic for CI
  
  // Focus on critical files only
  CRITICAL_FILES: [
    'package.json',
    'server.js',
    'src/App.jsx',
    'src/main.jsx',
    'vite.config.js',
    'eslint.config.js'
  ],
  
  // File patterns for CI analysis
  INCLUDE_PATTERNS: ['**/*.js', '**/*.jsx', '**/*.json'],
  IGNORE_DIRS: ['node_modules', 'dist', 'build', '.git'],
  
  // Exit codes for CI
  EXIT_CODES: {
    SUCCESS: 0,
    WARNINGS: 1,
    CRITICAL_ERRORS: 2,
    ANALYSIS_FAILED: 3
  }
};

const bedrockClient = new BedrockRuntimeClient({
  region: CI_CONFIG.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Get critical files for CI analysis
 */
function getCriticalFiles() {
  const files = [];
  
  // Add critical files
  CI_CONFIG.CRITICAL_FILES.forEach(file => {
    const fullPath = join(projectRoot, file);
    try {
      if (statSync(fullPath).isFile()) {
        files.push(fullPath);
      }
    } catch (error) {
      console.warn(`Warning: Critical file not found: ${file}`);
    }
  });
  
  // Add other important files
  try {
    const srcFiles = getFilesInDirectory(join(projectRoot, 'src'));
    files.push(...srcFiles.slice(0, 5)); // Limit for CI
  } catch (error) {
    console.warn('Warning: Could not scan src directory');
  }
  
  return [...new Set(files)]; // Remove duplicates
}

/**
 * Get files in directory (recursive, limited depth)
 */
function getFilesInDirectory(dir, maxDepth = 2, currentDepth = 0) {
  if (currentDepth >= maxDepth) return [];
  
  const files = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      
      if (CI_CONFIG.IGNORE_DIRS.includes(item)) {
        continue;
      }
      
      const stats = statSync(fullPath);
      
      if (stats.isDirectory()) {
        files.push(...getFilesInDirectory(fullPath, maxDepth, currentDepth + 1));
      } else {
        const ext = extname(item);
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
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
 * Quick file analysis for CI
 */
async function quickAnalyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const relativePath = relative(projectRoot, filePath);
  
  // Skip very large files in CI
  if (content.length > 10000) {
    return {
      filePath: relativePath,
      status: 'skipped',
      reason: 'File too large for CI analysis'
    };
  }

  const prompt = `
Quick CI analysis for this file:

File: ${relativePath}
Size: ${content.length} characters

Code:
\`\`\`${extname(filePath).slice(1)}
${content}
\`\`\`

Provide ONLY a JSON response with this exact format:
{
  "status": "pass|warn|fail",
  "critical_errors": ["list of critical errors"],
  "warnings": ["list of warnings"],
  "score": 1-10,
  "summary": "brief summary"
}

Focus on:
1. Syntax errors that break builds
2. Runtime errors that crash the app
3. Security vulnerabilities
4. Performance issues
5. Missing dependencies

Be concise and actionable.
`;

  for (const modelId of CI_CONFIG.MODEL_IDS) {
    try {
      const response = await bedrockClient.send(
        new InvokeModelCommand({
          contentType: "application/json",
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: CI_CONFIG.MAX_TOKENS,
            temperature: CI_CONFIG.TEMPERATURE,
            messages: [{ role: "user", content: [{ type: "text", text: prompt }] }]
          }),
          modelId: modelId,
        })
      );

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const analysisText = responseBody.content[0].text;
      
      // Try to parse JSON response
      try {
        const analysis = JSON.parse(analysisText);
        return {
          filePath: relativePath,
          ...analysis,
          modelUsed: modelId
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          filePath: relativePath,
          status: 'warn',
          critical_errors: [],
          warnings: ['Could not parse AI response'],
          score: 5,
          summary: 'Analysis response parsing failed',
          rawResponse: analysisText
        };
      }
    } catch (error) {
      console.log(`❌ Failed with ${modelId}, trying next model...`);
      continue;
    }
  }
  
  return {
    filePath: relativePath,
    status: 'fail',
    critical_errors: ['Analysis failed - all models unavailable'],
    warnings: [],
    score: 0,
    summary: 'Unable to analyze file'
  };
}

/**
 * Run CI analysis
 */
async function runCIAnalysis() {
  console.log('🚀 Starting Claude Haiku CI Analysis');
  
  // Check AWS credentials
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found!');
    process.exit(CI_CONFIG.EXIT_CODES.ANALYSIS_FAILED);
  }
  
  try {
    const files = getCriticalFiles();
    console.log(`📂 Analyzing ${files.length} critical files...`);
    
    const results = [];
    let hasCriticalErrors = false;
    let hasWarnings = false;
    
    for (const file of files) {
      console.log(`🔍 Analyzing ${relative(projectRoot, file)}...`);
      
      const result = await quickAnalyzeFile(file);
      results.push(result);
      
      // Check status
      if (result.status === 'fail') {
        hasCriticalErrors = true;
      } else if (result.status === 'warn') {
        hasWarnings = true;
      }
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Display results
    console.log('\n📊 CI ANALYSIS RESULTS');
    console.log('='.repeat(50));
    
    results.forEach(result => {
      const statusIcon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
      console.log(`\n${statusIcon} ${result.filePath} (Score: ${result.score}/10)`);
      console.log(`   Summary: ${result.summary}`);
      
      if (result.critical_errors.length > 0) {
        console.log('   🔴 Critical Errors:');
        result.critical_errors.forEach(error => console.log(`      - ${error}`));
      }
      
      if (result.warnings.length > 0) {
        console.log('   🟡 Warnings:');
        result.warnings.forEach(warning => console.log(`      - ${warning}`));
      }
    });
    
    // Calculate overall score
    const validResults = results.filter(r => r.score > 0);
    const avgScore = validResults.length > 0 
      ? validResults.reduce((sum, r) => sum + r.score, 0) / validResults.length 
      : 0;
    
    console.log('\n📈 OVERALL RESULTS');
    console.log('='.repeat(50));
    console.log(`Average Score: ${avgScore.toFixed(1)}/10`);
    console.log(`Files Analyzed: ${results.length}`);
    console.log(`Critical Errors: ${results.filter(r => r.status === 'fail').length}`);
    console.log(`Warnings: ${results.filter(r => r.status === 'warn').length}`);
    
    // Determine exit code
    let exitCode = CI_CONFIG.EXIT_CODES.SUCCESS;
    
    if (hasCriticalErrors) {
      console.log('\n❌ CRITICAL ERRORS FOUND - Build should fail');
      exitCode = CI_CONFIG.EXIT_CODES.CRITICAL_ERRORS;
    } else if (hasWarnings) {
      console.log('\n⚠️  WARNINGS FOUND - Build should pass with warnings');
      exitCode = CI_CONFIG.EXIT_CODES.WARNINGS;
    } else {
      console.log('\n✅ ALL CHECKS PASSED - Code quality is good');
    }
    
    // Save results for GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      const fs = await import('fs');
      const summary = {
        timestamp: new Date().toISOString(),
        avgScore,
        results,
        exitCode,
        hasCriticalErrors,
        hasWarnings
      };
      
      fs.writeFileSync(
        join(projectRoot, 'claude-ci-results.json'), 
        JSON.stringify(summary, null, 2)
      );
      
      // Set GitHub Actions output
      console.log(`\n::set-output name=score::${avgScore.toFixed(1)}`);
      console.log(`::set-output name=status::${exitCode === 0 ? 'pass' : exitCode === 1 ? 'warn' : 'fail'}`);
      console.log(`::set-output name=critical_errors::${results.filter(r => r.status === 'fail').length}`);
      console.log(`::set-output name=warnings::${results.filter(r => r.status === 'warn').length}`);
    }
    
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ CI Analysis failed:', error.message);
    process.exit(CI_CONFIG.EXIT_CODES.ANALYSIS_FAILED);
  }
}

// Run CI analysis if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCIAnalysis().catch(console.error);
}

export { runCIAnalysis, quickAnalyzeFile };
