# 🚀 Deployment Guide

This guide covers multiple deployment options for the RAJ AI AGENTS application.

## 📋 Prerequisites

- Node.js 18+ (recommended: 20+)
- AWS Account with Bedrock access
- Git
- Docker (for containerized deployment)

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**One-Click Deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/bedrock-agent-builder)

**Manual Deploy:**

1. **Fork the repository**
2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your forked repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Set Environment Variables:**
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   CLAUDE_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v2:0
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app.vercel.app`

### 2. Netlify

**One-Click Deploy:**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/rajshah9305/bedrock-agent-builder)

**Manual Deploy:**

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your Git repository

3. **Configure Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add the same variables as Vercel

### 3. AWS Amplify

1. **Connect Repository:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New App" → "Host web app"
   - Connect your GitHub repository

2. **Configure Build Settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

3. **Set Environment Variables:**
   - Go to App Settings → Environment Variables
   - Add your AWS credentials and configuration

### 4. Docker Deployment

**Using Docker Compose:**

1. **Clone and configure:**
   ```bash
   git clone https://github.com/rajshah9305/bedrock-agent-builder.git
   cd bedrock-agent-builder
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Deploy with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3001`
   - Health check: `http://localhost:3001/api/health`

**Using Docker directly:**

1. **Build the image:**
   ```bash
   docker build -t raj-ai-agents .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3001:3001 \
     -e AWS_ACCESS_KEY_ID=your_key \
     -e AWS_SECRET_ACCESS_KEY=your_secret \
     -e AWS_REGION=us-east-1 \
     raj-ai-agents
   ```

### 5. Self-Hosted VPS

**Using PM2 (Recommended):**

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Create PM2 ecosystem file:**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'raj-ai-agents',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3001
       },
       env_production: {
         NODE_ENV: 'production',
         PORT: 3001,
         AWS_ACCESS_KEY_ID: 'your_key',
         AWS_SECRET_ACCESS_KEY: 'your_secret',
         AWS_REGION: 'us-east-1'
       }
     }]
   }
   ```

4. **Start the application:**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

**Using Nginx (Reverse Proxy):**

1. **Install Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx:**
   ```nginx
   # /etc/nginx/sites-available/raj-ai-agents
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/raj-ai-agents /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🔧 Environment Configuration

### Required Variables

```env
# AWS Bedrock Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1

# Claude Model Configuration
CLAUDE_MODEL_ID=anthropic.claude-3-5-haiku-20241022-v2:0
CLAUDE_MAX_TOKENS=4000
CLAUDE_TEMPERATURE=0.1

# Server Configuration
PORT=3001
NODE_ENV=production
```

### Optional Variables

```env
# Frontend Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api

# Database Configuration (if using persistent storage)
DATABASE_URL=postgresql://username:password@localhost:5432/bedrock_agents

# Redis Configuration (if using caching)
REDIS_URL=redis://localhost:6379

# Monitoring and Analytics
SENTRY_DSN=your_sentry_dsn_here
ANALYTICS_ID=your_analytics_id_here
```

## 🔐 AWS Setup

### 1. Create IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam)
2. Click "Users" → "Create user"
3. Username: `bedrock-agent-builder`
4. Attach policies:
   - `AmazonBedrockFullAccess` (for full functionality)
   - Or create custom policy (see below)

### 2. Custom IAM Policy (Minimal Permissions)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:ListFoundationModels",
        "bedrock:CreateAgent",
        "bedrock:GetAgent",
        "bedrock:ListAgents",
        "bedrock:DeleteAgent"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Request Model Access

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock)
2. Navigate to "Model access"
3. Request access to:
   - Claude 3.5 Haiku
   - Claude 3.5 Sonnet
   - Claude 3 Opus
   - Other models as needed

## 🚨 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use secure secret management (AWS Secrets Manager, Vercel Secrets, etc.)
- Rotate credentials regularly

### 2. CORS Configuration
- Configure CORS for production domains only
- Update `server.js` CORS settings for your domain

### 3. Rate Limiting
- Consider implementing rate limiting for API endpoints
- Use AWS API Gateway for additional protection

### 4. HTTPS
- Always use HTTPS in production
- Configure SSL certificates (Let's Encrypt, AWS Certificate Manager)

## 📊 Monitoring and Logging

### 1. Health Checks
- Endpoint: `/api/health`
- Returns: `{ status: 'OK', timestamp: '...' }`

### 2. Logging
- Application logs are written to console
- Consider using structured logging (Winston, Pino)
- Set up log aggregation (CloudWatch, Datadog, etc.)

### 3. Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor AWS Bedrock usage and costs
- Track application performance metrics

## 🔄 CI/CD Pipeline

The repository includes GitHub Actions workflows for:
- Automated testing and linting
- Security scanning
- Automatic deployment to Vercel
- Preview deployments for pull requests

### Setup GitHub Actions

1. Go to repository Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

## 🆘 Troubleshooting

### Common Issues

1. **AWS Credentials Not Working**
   - Verify credentials are correct
   - Check IAM permissions
   - Ensure model access is granted

2. **CORS Errors**
   - Update CORS configuration in `server.js`
   - Check domain configuration

3. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

4. **Deployment Issues**
   - Check environment variables
   - Verify build output directory
   - Check deployment logs

### Getting Help

- Check the [Issues](https://github.com/rajshah9305/bedrock-agent-builder/issues) page
- Create a new issue with detailed information
- Include logs and error messages

## 📈 Performance Optimization

### 1. Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images and fonts

### 2. Backend
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use compression middleware

### 3. AWS Bedrock
- Monitor token usage
- Implement request batching
- Use appropriate model sizes
- Cache responses when possible

---

**Need help?** Open an issue or contact the maintainer!
