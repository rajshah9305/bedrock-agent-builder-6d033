#!/usr/bin/env node

/**
 * Claude Analysis Setup Script
 * Helps users configure Claude Haiku analysis for their project
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Setup script for Claude analysis
 */
async function setupClaudeAnalysis() {
  console.log('🚀 Setting up Claude Haiku Code Analysis');
  console.log('='.repeat(50));
  
  // Check if .env file exists
  const envPath = join(projectRoot, '.env');
  const envExamplePath = join(projectRoot, 'env.example');
  
  if (!existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    
    if (existsSync(envExamplePath)) {
      const envContent = readFileSync(envExamplePath, 'utf8');
      writeFileSync(envPath, envContent);
      console.log('✅ Created .env file from template');
      console.log('⚠️  Please edit .env file and add your AWS credentials');
    } else {
      // Create basic .env file
      const basicEnv = `# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1

# Claude Model Configuration
CLAUDE_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v2:0
CLAUDE_MAX_TOKENS=4000
CLAUDE_TEMPERATURE=0.1
`;
      writeFileSync(envPath, basicEnv);
      console.log('✅ Created basic .env file');
      console.log('⚠️  Please edit .env file and add your AWS credentials');
    }
  } else {
    console.log('✅ .env file already exists');
  }
  
  // Check AWS credentials
  console.log('\n🔑 Checking AWS credentials...');
  try {
    const envContent = readFileSync(envPath, 'utf8');
    const hasAccessKey = envContent.includes('AWS_ACCESS_KEY_ID=') && 
                        !envContent.includes('AWS_ACCESS_KEY_ID=your_access_key_here');
    const hasSecretKey = envContent.includes('AWS_SECRET_ACCESS_KEY=') && 
                        !envContent.includes('AWS_SECRET_ACCESS_KEY=your_secret_key_here');
    
    if (hasAccessKey && hasSecretKey) {
      console.log('✅ AWS credentials appear to be configured');
    } else {
      console.log('⚠️  AWS credentials need to be configured in .env file');
      console.log('   Please edit .env and replace placeholder values with your actual AWS credentials');
    }
  } catch (error) {
    console.log('❌ Could not read .env file');
  }
  
  // Check if scripts directory exists
  const scriptsDir = join(projectRoot, 'scripts');
  if (!existsSync(scriptsDir)) {
    console.log('\n📁 Creating scripts directory...');
    mkdirSync(scriptsDir, { recursive: true });
    console.log('✅ Created scripts directory');
  } else {
    console.log('✅ Scripts directory exists');
  }
  
  // Check if GitHub Actions directory exists
  const githubDir = join(projectRoot, '.github', 'workflows');
  if (!existsSync(githubDir)) {
    console.log('\n📁 Creating GitHub Actions directory...');
    mkdirSync(githubDir, { recursive: true });
    console.log('✅ Created .github/workflows directory');
  } else {
    console.log('✅ GitHub Actions directory exists');
  }
  
  // Display setup instructions
  console.log('\n📋 Setup Instructions:');
  console.log('='.repeat(50));
  
  console.log('\n1. 🔑 Configure AWS Credentials:');
  console.log('   - Edit .env file and add your AWS credentials');
  console.log('   - Get credentials from AWS IAM Console');
  console.log('   - Ensure your user has Bedrock access permissions');
  
  console.log('\n2. 🌐 Request Model Access:');
  console.log('   - Go to AWS Bedrock Console');
  console.log('   - Navigate to Model Access');
  console.log('   - Request access to Claude 3.5 Haiku');
  
  console.log('\n3. 🧪 Test the Setup:');
  console.log('   npm run analyze        # Run full analysis');
  console.log('   npm run analyze:ci     # Run CI analysis');
  console.log('   npm run analyze:watch  # Start file watcher');
  
  console.log('\n4. 🚀 GitHub Actions Setup:');
  console.log('   - Go to repository Settings → Secrets and variables → Actions');
  console.log('   - Add these secrets:');
  console.log('     * AWS_ACCESS_KEY_ID');
  console.log('     * AWS_SECRET_ACCESS_KEY');
  console.log('   - Optionally add variable:');
  console.log('     * AWS_REGION (defaults to us-east-1)');
  
  console.log('\n5. 📊 Available Commands:');
  console.log('   npm run analyze        # Full codebase analysis');
  console.log('   npm run analyze:ci     # Quick CI analysis');
  console.log('   npm run analyze:watch  # Watch files for changes');
  
  console.log('\n6. 📁 Output Files:');
  console.log('   claude-analysis-*.json     # Full analysis results');
  console.log('   claude-ci-results.json     # CI analysis results');
  console.log('   claude-watch-results.json  # File watcher results');
  
  console.log('\n✅ Setup complete!');
  console.log('🎯 Next steps: Configure AWS credentials and test the analysis');
  
  // Display AWS permissions needed
  console.log('\n🔐 Required AWS Permissions:');
  console.log('='.repeat(50));
  console.log('Your AWS user/role needs these permissions:');
  console.log('- bedrock:InvokeModel');
  console.log('- bedrock:ListFoundationModels (optional)');
  console.log('\nExample IAM policy:');
  console.log(`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:ListFoundationModels"
      ],
      "Resource": [
        "arn:aws:bedrock:*:*:model/anthropic.claude-3-5-haiku-*",
        "arn:aws:bedrock:*:*:model/anthropic.claude-3-haiku-*"
      ]
    }
  ]
}`);
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupClaudeAnalysis().catch(console.error);
}

export { setupClaudeAnalysis };
