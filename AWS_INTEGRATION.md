# AWS Bedrock Integration Guide 🚀

This guide will help you integrate your Bedrock Agent Builder with real AWS Bedrock services.

## 🔧 Setup Instructions

### 1. AWS Credentials Setup

Configure your AWS credentials:

```bash
AWS Account ID: your-account-id
AWS Region: us-east-1
Access Key ID: your-access-key-id
Secret Access Key: your-secret-access-key
```

### 2. Environment Configuration

Update your `.env` file with your AWS credentials:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCOUNT_ID=your-account-id

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# AWS Credentials (Backend only)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### 3. Start the Application

Run both frontend and backend:

```bash
# Option 1: Use the startup script
./start.sh

# Option 2: Manual start
pnpm run dev:full

# Option 3: Start separately
# Terminal 1 - Backend
pnpm run server

# Terminal 2 - Frontend  
pnpm run dev
```

## 🎯 Available Features

### ✅ Working Features
- **Foundation Model Listing**: Fetches real models from AWS Bedrock
- **Agent Creation**: Creates actual Bedrock agents
- **Agent Listing**: Lists your existing agents
- **Agent Details**: View agent configurations
- **Agent Deletion**: Remove agents from AWS

### 🔄 API Endpoints

The backend provides these endpoints:

- `GET /api/health` - Health check
- `GET /api/models` - List available foundation models
- `POST /api/agents/create` - Create new agent
- `GET /api/agents/list` - List all agents
- `GET /api/agents/:agentId` - Get specific agent
- `DELETE /api/agents/:agentId` - Delete agent

## 🛠️ Troubleshooting

### Common Issues

1. **"ValidationException: claude-3-sonnet-20240229 is not supported"**
   - This happens with older Claude models that require the Messages API
   - Use newer model IDs like `anthropic.claude-3-5-sonnet-20241022-v2:0`

2. **"Access Denied" Errors**
   - Ensure your IAM user has the `AmazonBedrockFullAccess` policy
   - Check that model access is requested in the AWS Console

3. **API Connection Issues**
   - Verify the backend is running on port 3001
   - Check that `.env` file has correct API URL
   - Look for CORS errors in browser console

### Model Access Request

If you get access denied errors for specific models:

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to "Model access" in the left sidebar
3. Request access for the models you want to use
4. Wait for approval (usually instant for most models)

## 🔒 Security Best Practices

1. **Never expose AWS credentials in frontend code**
2. **Use IAM roles in production instead of access keys**
3. **Implement proper authentication for your API**
4. **Use HTTPS in production**
5. **Rotate access keys regularly**

## 📊 Monitoring

Monitor your usage in the AWS Console:
- **CloudWatch**: View API call metrics
- **Bedrock Console**: Monitor agent performance
- **Cost Explorer**: Track usage costs

## 🚀 Production Deployment

For production deployment:

1. **Use IAM Roles**: Replace access keys with IAM roles
2. **Environment Variables**: Use secure environment variable management
3. **API Gateway**: Consider using AWS API Gateway for the backend
4. **Lambda**: Deploy backend as Lambda functions
5. **CloudFront**: Use CloudFront for frontend distribution

## 📝 Next Steps

1. **Test Agent Creation**: Create your first agent using the UI
2. **Add Action Groups**: Implement custom Lambda functions
3. **Knowledge Bases**: Connect vector databases
4. **Guardrails**: Add safety controls
5. **Testing**: Test agent responses and behavior

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Check the backend logs in terminal
3. Verify AWS credentials and permissions
4. Ensure all required services are enabled in your AWS account

---

**Happy Building! 🎉**