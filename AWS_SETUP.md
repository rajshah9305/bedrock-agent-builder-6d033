# AWS Bedrock Integration Guide

This guide will walk you through integrating real AWS Bedrock AI capabilities into your application.

## 🎯 Overview

The application can run in two modes:
1. **Simulated Mode** - Uses mock data (default, no AWS credentials needed)
2. **Live Mode** - Connects to real AWS Bedrock services

## 📋 Prerequisites

### 1. AWS Account Setup

1. **Create an AWS Account** (if you don't have one)
   - Visit [aws.amazon.com](https://aws.amazon.com)
   - Sign up for an account

2. **Enable AWS Bedrock**
   - Go to AWS Console → Bedrock
   - Request access to models (Claude, Titan, etc.)
   - This may take a few minutes to hours for approval

3. **Create IAM User with Bedrock Permissions**

   a. Go to IAM Console → Users → Create User
   
   b. Attach this policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:CreateAgent",
           "bedrock:ListAgents",
           "bedrock:GetAgent",
           "bedrock:UpdateAgent",
           "bedrock:DeleteAgent",
           "bedrock:CreateActionGroup",
           "bedrock:AssociateAgentKnowledgeBase",
           "bedrock:InvokeAgent"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
   
   c. Create access keys and save them securely

## 🚀 Local Development Setup

### Step 1: Install AWS SDK

```bash
# Using pnpm
pnpm add @aws-sdk/client-bedrock-agent

# Using npm
npm install @aws-sdk/client-bedrock-agent
```

### Step 2: Create Environment Files

1. **Create `.env` file in project root:**

```bash
# Copy from .env.example
cp .env.example .env
```

2. **Edit `.env` file:**

```bash
# Frontend Configuration
VITE_AWS_REGION=us-east-1
VITE_API_BASE_URL=http://localhost:3000/api

# DO NOT ADD AWS CREDENTIALS HERE - THEY GO IN VERCEL ONLY
```

### Step 3: Create API Directory Structure

```bash
mkdir -p api/agents
```

### Step 4: Add API Files

Create the following files in the `api/` directory:
- `api/agents/create.js` (provided in artifacts)
- `api/agents/list.js` (provided in artifacts)

### Step 5: Create API Service Layer

Create `src/services/api.js` (provided in artifacts)

### Step 6: Update AgentBuilder Component

Replace `src/components/AgentBuilder.jsx` with the updated version (provided in artifacts)

### Step 7: Test Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will run in **Simulated Mode** until you deploy with proper AWS credentials.

## 🌐 Vercel Deployment Setup

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add AWS Bedrock integration"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. **Before deploying**, add environment variables

### Step 3: Configure Environment Variables in Vercel

In your Vercel project dashboard:

**Settings → Environment Variables**

Add these variables:

```bash
# AWS Credentials (CRITICAL - KEEP SECRET!)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1

# Frontend Variables
VITE_AWS_REGION=us-east-1
VITE_API_BASE_URL=https://your-app.vercel.app/api
```

**Important Notes:**
- ✅ Set environment for: Production, Preview, Development
- ✅ AWS credentials should ONLY be in Vercel, never in code
- ✅ After adding variables, redeploy your application

### Step 4: Deploy

Click **Deploy** in Vercel dashboard.

## 🔒 Security Best Practices

### ❌ NEVER DO THIS:
```javascript
// DON'T put credentials in frontend code
const credentials = {
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE', // NEVER!
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' // NEVER!
}
```

### ✅ ALWAYS DO THIS:
- Keep AWS credentials in backend/serverless functions only
- Use environment variables in Vercel
- Frontend only calls your API, never AWS directly
- Use IAM roles with minimal permissions

## 📊 Vercel Serverless Functions

Your API routes automatically become serverless functions:
- `api/agents/create.js` → `https://your-app.vercel.app/api/agents/create`
- `api/agents/list.js` → `https://your-app.vercel.app/api/agents/list`

## 🧪 Testing the Integration

### Test API Endpoint

After deployment, test your API:

```bash
# Test list agents endpoint
curl https://your-app.vercel.app/api/agents/list

# Test create agent endpoint
curl -X POST https://your-app.vercel.app/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{
    "agentName": "Test Agent",
    "instructions": "You are a helpful assistant",
    "foundationModel": "anthropic.claude-3-5-sonnet-20241022-v2:0"
  }'
```

## 🐛 Troubleshooting

### Issue: "Running in Simulated Mode"

**Cause:** API endpoint not configured or not accessible

**Solution:**
1. Check `VITE_API_BASE_URL` is set correctly in Vercel
2. Verify environment variables are deployed
3. Check browser console for API errors

### Issue: "Access Denied" or 403 Error

**Cause:** AWS credentials incorrect or insufficient permissions

**Solution:**
1. Verify AWS credentials in Vercel are correct
2. Check IAM user has Bedrock permissions
3. Ensure Bedrock models are enabled in your AWS account

### Issue: "Model not found"

**Cause:** Model not enabled in AWS Bedrock

**Solution:**
1. Go to AWS Bedrock Console
2. Request access to specific models
3. Wait for approval (can take minutes to hours)

### Issue: API Calls Timeout

**Cause:** Vercel serverless function timeout (default 10s)

**Solution:**
1. Go to Vercel Settings → Functions
2. Increase timeout limit (Pro plan required for >10s)

## 💰 Cost Considerations

AWS Bedrock pricing varies by model:

**Claude 3.5 Sonnet:**
- Input: ~$3 per 1M tokens
- Output: ~$15 per 1M tokens

**Estimated Costs:**
- Creating an agent: ~$0.01-0.05
- 100 agents/day: ~$1-5/day

**Free Tier:**
- AWS Free Tier includes limited Bedrock usage
- Monitor usage in AWS Cost Explorer

## 📈 Monitoring & Logs

### Vercel Logs
- Go to Vercel Dashboard → Deployments → Select deployment → Functions
- View real-time logs of API calls

### AWS CloudWatch
- Go to AWS Console → CloudWatch
- Monitor Bedrock API usage and errors

## 🔄 Additional API Endpoints to Implement

Create these additional endpoints for full functionality:

1. **Get Agent Details**: `api/agents/[agentId].js`
2. **Delete Agent**: `api/agents/delete.js`
3. **Update Agent**: `api/agents/update.js`
4. **Create Action Group**: `api/agents/action-groups.js`
5. **Associate Knowledge Base**: `api/agents/knowledge-bases.js`

Example structure:
```
api/
├── agents/
│   ├── create.js          ✅ Created
│   ├── list.js            ✅ Created
│   ├── [agentId].js       ⏳ To implement
│   ├── delete.js          ⏳ To implement
│   ├── update.js          ⏳ To implement
│   ├── action-groups/
│   │   └── create.js      ⏳ To implement
│   └── knowledge-bases/
│       └── associate.js   ⏳ To implement
```

## ✅ Verification Checklist

Before going live, verify:

- [ ] AWS credentials are set in Vercel (not in code)
- [ ] `VITE_API_BASE_URL` points to your Vercel deployment
- [ ] IAM user has necessary Bedrock permissions
- [ ] Bedrock models are enabled in your AWS region
- [ ] API endpoints return successful responses
- [ ] Frontend shows "Live" mode (not "Simulated")
- [ ] Agent creation works end-to-end
- [ ] Agent list displays real agents from AWS

## 🎓 Next Steps

1. **Implement remaining endpoints** (delete, update, etc.)
2. **Add error handling and retry logic**
3. **Implement rate limiting** for API protection
4. **Add authentication** to protect your API
5. **Set up monitoring alerts** in AWS CloudWatch
6. **Implement agent testing capabilities**
7. **Add agent versioning support**

## 📚 Additional Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

## 💡 Tips

1. **Start with Simulated Mode** to test your UI
2. **Use AWS CloudShell** for quick AWS CLI testing
3. **Monitor costs** regularly in AWS Cost Explorer
4. **Enable CloudWatch alarms** for unusual usage patterns
5. **Test thoroughly** before deploying to production

---

Need help? Open an issue on GitHub or contact the maintainer.
