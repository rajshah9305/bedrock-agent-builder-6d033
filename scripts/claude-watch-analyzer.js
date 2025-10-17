#!/usr/bin/env node

/**
 * Claude Haiku File Watcher
 * Monitors file changes and runs analysis on modified files
 */

import { watch } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { analyzeFile } from './claude-code-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const WATCH_CONFIG = {
  // Directories to watch
  WATCH_DIRS: [
    'src',
    'api',
    'scripts'
  ],
  
  // File patterns to watch
  WATCH_PATTERNS: [
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx'
  ],
  
  // Debounce delay (ms)
  DEBOUNCE_DELAY: 2000,
  
  // Maximum files to analyze per batch
  MAX_BATCH_SIZE: 5
};

// Track pending analyses
const pendingAnalyses = new Map();
let analysisQueue = [];

/**
 * Debounced analysis function
 */
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

/**
 * Add file to analysis queue
 */
function queueFileAnalysis(filePath) {
  if (analysisQueue.includes(filePath)) {
    return; // Already queued
  }
  
  analysisQueue.push(filePath);
  console.log(`📝 Queued for analysis: ${relative(projectRoot, filePath)}`);
  
  // Process queue if it's full or after a delay
  if (analysisQueue.length >= WATCH_CONFIG.MAX_BATCH_SIZE) {
    processAnalysisQueue();
  } else {
    setTimeout(processAnalysisQueue, WATCH_CONFIG.DEBOUNCE_DELAY);
  }
}

/**
 * Process the analysis queue
 */
async function processAnalysisQueue() {
  if (analysisQueue.length === 0) {
    return;
  }
  
  const filesToAnalyze = [...analysisQueue];
  analysisQueue = [];
  
  console.log(`\n🔍 Analyzing ${filesToAnalyze.length} modified files...`);
  
  for (const filePath of filesToAnalyze) {
    try {
      const analysis = await analyzeFile(filePath);
      
      if (analysis) {
        console.log(`\n✅ Analysis complete: ${relative(projectRoot, filePath)}`);
        
        // Display critical issues immediately
        const criticalIssues = extractCriticalIssues(analysis.analysis);
        if (criticalIssues.length > 0) {
          console.log(`🚨 Critical issues found:`);
          criticalIssues.forEach(issue => console.log(`   - ${issue}`));
        }
        
        // Display warnings
        const warnings = extractWarnings(analysis.analysis);
        if (warnings.length > 0) {
          console.log(`⚠️  Warnings:`);
          warnings.forEach(warning => console.log(`   - ${warning}`));
        }
        
        // Save analysis result
        saveQuickAnalysis(analysis);
      }
    } catch (error) {
      console.error(`❌ Failed to analyze ${relative(projectRoot, filePath)}:`, error.message);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ Batch analysis complete!`);
}

/**
 * Extract critical issues from analysis text
 */
function extractCriticalIssues(analysisText) {
  const criticalSection = analysisText.match(/### 🔴 Critical Issues[^#]*/s);
  if (!criticalSection) return [];
  
  const issues = [];
  const lines = criticalSection[0].split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') && trimmed.length > 1) {
      issues.push(trimmed.substring(1).trim());
    }
  }
  
  return issues;
}

/**
 * Extract warnings from analysis text
 */
function extractWarnings(analysisText) {
  const warningSection = analysisText.match(/### 🟡 Warnings[^#]*/s);
  if (!warningSection) return [];
  
  const warnings = [];
  const lines = warningSection[0].split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') && trimmed.length > 1) {
      warnings.push(trimmed.substring(1).trim());
    }
  }
  
  return warnings;
}

/**
 * Save quick analysis result
 */
function saveQuickAnalysis(analysis) {
  const fs = require('fs');
  const quickResultsFile = join(projectRoot, 'claude-watch-results.json');
  
  let existingResults = {};
  try {
    existingResults = JSON.parse(fs.readFileSync(quickResultsFile, 'utf8'));
  } catch (error) {
    // File doesn't exist yet
  }
  
  existingResults[analysis.filePath] = {
    ...analysis,
    analyzedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(quickResultsFile, JSON.stringify(existingResults, null, 2));
}

/**
 * Setup file watcher
 */
function setupWatcher() {
  console.log('👀 Setting up file watcher...');
  console.log(`📁 Watching directories: ${WATCH_CONFIG.WATCH_DIRS.join(', ')}`);
  console.log(`🔍 Watching patterns: ${WATCH_CONFIG.WATCH_PATTERNS.join(', ')}`);
  
  WATCH_CONFIG.WATCH_DIRS.forEach(dir => {
    const watchPath = join(projectRoot, dir);
    
    try {
      watch(watchPath, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        
        const fullPath = join(watchPath, filename);
        const ext = filename.split('.').pop();
        
        // Only watch specific file types
        if (!['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
          return;
        }
        
        // Only analyze on file changes (not deletions)
        if (eventType === 'change') {
          queueFileAnalysis(fullPath);
        }
      });
      
      console.log(`✅ Watching: ${dir}`);
    } catch (error) {
      console.warn(`⚠️  Could not watch directory ${dir}: ${error.message}`);
    }
  });
}

/**
 * Main function
 */
function startWatcher() {
  console.log('🚀 Starting Claude Haiku File Watcher');
  console.log(`📍 Project Root: ${projectRoot}`);
  
  // Check AWS credentials
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found!');
    console.error('Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
    process.exit(1);
  }
  
  console.log('✅ AWS credentials found');
  
  // Setup file watcher
  setupWatcher();
  
  console.log('\n🎯 File watcher is active!');
  console.log('📝 Modified files will be automatically analyzed');
  console.log('⏹️  Press Ctrl+C to stop\n');
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down file watcher...');
    
    // Process any remaining queue items
    if (analysisQueue.length > 0) {
      console.log(`📝 Processing ${analysisQueue.length} remaining files...`);
      processAnalysisQueue();
    }
    
    console.log('✅ File watcher stopped');
    process.exit(0);
  });
}

// Start watcher if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startWatcher();
}

export { startWatcher, queueFileAnalysis };
