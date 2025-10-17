# AWS Bedrock Integration - Deployment Checklist

Use this checklist to ensure proper setup and deployment of your AWS Bedrock Agent Builder with real AWS integration.

## 📋 Pre-Deployment Checklist

### AWS Setup
- [ ] AWS account created and verified
- [ ] AWS Bedrock service enabled
- [ ] Model access requested and approved (Claude, Titan, etc.)
- [ ] IAM user created with Bedrock permissions
- [ ] Access keys generated and securely stored
- [ ] AWS region selected (e.g., us-east-1)

### Local Development
- [ ] `.env.example` file created in project root
- [ ] `.env` file created (from .env.example)
- [ ] `.env` added to `.gitignore`
- [ ] AWS SDK installed: `@aws-sdk/client-bedrock-agent`
- [ ] API directory structure created: `api/agents/`
- [ ] API endpoint files created:
  - [ ] `api/agents/create.js`
  - [ ] `api/agents/list.js`
- [ ] API service layer created: `src/services/api.js`
- [ ] AgentBuilder.jsx updated with API integration
- [ ] Local testing completed successfully

### Code Quality
- [ ] No AWS credentials in code
- [ ] No `.env` files in Git repository
- [ ] ESLint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in development mode

## 🚀 Deployment Steps

### 1. GitHub Setup
- [ ] Code pushed to GitHub repository
- [ ] Repository is public or Vercel has access
- [ ] All changes committed
- [ ] `.gitignore` properly configured

### 2. Vercel Project Setup
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Framework preset: **Vite** (auto-detected)
- [ ] Build command: `pnpm build` or `npm run build`
- [ ] Output directory: `dist`

### 3. Environment Variables in Vercel

Navigate to: **Project Settings → Environment Variables**

#### Required Variables (All Environments):

**Backend Variables (KEEP SECRET!):**
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

**Frontend Variables:**
```bash
VITE_AWS_REGION=us-east-1
VITE_API_BASE_URL=https://your-project.vercel.app/api
```

- [ ] All environment variables added
- [ ] Variables set for: Production ✅
- [ ] Variables set for: Preview ✅
- [ ] Variables set for: Development ✅

### 4. Initial Deployment
- [ ] Click "Deploy" in Vercel
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Check deployment logs for errors
- [ ] Deployment successful ✅

### 5. Post-Deployment Verification

#### Test the Deployment:
- [ ] Visit deployed URL: `https://your-project.vercel.app`
- [ ] Application loads without errors
- [ ] No "Simulated Mode" warning visible
- [ ] Agent creation form appears correctly

#### Test API Endpoints:
```bash
# Test list endpoint
curl https://your-project.vercel.app/api/agents/list

# Test create endpoint
curl -X POST https://your-project.vercel.app/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{
    "agentName": "Test Agent",
    "instructions": "Test instructions",
    "foundationModel": "anthropic.claude-3-5-sonnet-20241022-v2:0"
  }'
```

- [ ] List endpoint returns 200 status
- [ ] Create endpoint accepts requests
- [ ] No CORS errors in browser console

#### Test Agent Creation:
- [ ] Fill out agent creation form
- [ ] Select a foundation model
- [ ] Add instructions
- [ ] Click "Create Agent"
- [ ] Success toast appears
- [ ] Agent appears in agent list
- [ ] Button shows "(Live)" not "(Simulated)"

## 🔍 Troubleshooting

### If "Simulated Mode" Still Shows:

1. **Check environment variables:**
   - [ ] Go to Vercel → Settings → Environment Variables
   - [ ] Verify `VITE_API_BASE_URL` is correct
   - [ ] Ensure it starts with `https://` not `http://`

2. **Redeploy after adding variables:**
   - [ ] Go to Deployments tab
   - [ ] Click ⋯ menu → Redeploy
   - [ ] Check "Use existing Build Cache" is OFF

3. **Check browser console:**
   - [ ] Open Developer Tools (F12)
   - [ ] Look for API errors
   - [ ] Verify API calls are going to correct URL

### If API Returns 403/401 Errors:

- [ ] Verify AWS credentials in Vercel are correct
- [ ] Check IAM user has Bedrock permissions
- [ ] Ensure Bedrock is enabled in AWS region
- [ ] Check AWS account has access to models

### If API Returns 404 Errors:

- [ ] Verify API files are in `api/` directory
- [ ] Check file names match exactly (create.js, list.js)
- [ ] Ensure files are committed to Git
- [ ] Redeploy to sync files

## 📊 Monitoring Setup

### Vercel
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking
- [ ] Monitor function execution times
- [ ] Check function logs regularly

### AWS CloudWatch
- [ ] Create CloudWatch dashboard
- [ ] Set up cost alarms
- [ ] Monitor Bedrock API usage
- [ ] Enable error notifications

## 🔒 Security Verification

- [ ] No AWS credentials in frontend code
- [ ] No `.env` files in repository
- [ ] Environment variables only in Vercel
- [ ] IAM user has minimal required permissions
- [ ] API endpoints use HTTPS only
- [ ] CORS properly configured

## 💰 Cost Management

- [ ] AWS Cost Explorer enabled
- [ ] Billing alerts configured
- [ ] Usage limits set (if needed)
- [ ] Monitor daily usage
- [ ] Set budget alerts in AWS

## 📱 Final Testing

### Desktop Testing:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Testing:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design works

### Functionality Testing:
- [ ] Create agent
- [ ] List agents
- [ ] View agent details
- [ ] Select models
- [ ] Add tools
- [ ] Configure action groups
- [ ] Associate knowledge bases

## 🎉 Launch Checklist

- [ ] All tests passing
- [ ] No errors in production
- [ ] Performance acceptable (< 3s load time)
- [ ] AWS integration working
- [ ] Monitoring in place
- [ ] Documentation updated
- [ ] README.md reflects live status
- [ ] Custom domain configured (optional)

## 📝 Post-Launch

- [ ] Share deployment URL
- [ ] Update README with live demo link
- [ ] Monitor for 24 hours
- [ ] Check AWS costs after first day
- [ ] Gather user feedback
- [ ] Plan next features

---

## Quick Reference

**Deployment URL Template:**
```
https://your-project.vercel.app
```

**API Endpoints:**
```
GET  /api/agents/list
POST /api/agents/create
```

**Support Resources:**
- AWS Support: https://console.aws.amazon.com/support
- Vercel Support: https://vercel.com/help
- GitHub Issues: https://github.com/your-username/your-repo/issues

---

✅ **Deployment Complete!** Your AWS Bedrock Agent Builder is now live!
