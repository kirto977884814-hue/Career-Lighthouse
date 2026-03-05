# GLM API 集成说明

## 概述

职业灯塔 v5.0 集成了智谱AI (GLM) API，用于生成个性化的职业建议和分析内容。

## 功能特性

### 1. AI生成内容类型

- **个性化总结**：基于用户的困惑和测试结果，生成困境解答和核心发现
- **个性化建议**：根据用户背景和能力评估，生成3-5条具体可行的建议
- **反思引导**：提出引导性问题，帮助用户更好地认识自己

### 2. 智能降级机制

当GLM API未配置或调用失败时，系统会自动使用预设的fallback内容，确保用户体验不受影响。

## 配置步骤

### 1. 获取API Key

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并登录账号
3. 创建应用并获取 API Key
4. 记录你的API Key（格式类似：`xxxxxxxx.xxxxxxxx.xxxxxxxx`）

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# 复制示例配置
cp .env.example .env
```

编辑 `.env` 文件，填入你的API Key：

```env
GLM_API_KEY=your_actual_api_key_here
```

### 3. 验证配置

启动开发服务器：

```bash
npm run dev
```

访问 `http://localhost:3000/api/ai/generate`，如果返回以下内容说明配置成功：

```json
{
  "available": true,
  "message": "GLM API is configured and ready"
}
```

## 使用方式

### 方式1：使用React Hooks (推荐)

在组件中使用我们提供的hooks：

```tsx
import { usePersonalizedSummary } from '@/hooks/useAIGeneration';

function MyComponent() {
  const { generateSummary, isLoading, error } = usePersonalizedSummary();

  const handleGenerate = async () => {
    const summary = await generateSummary({
      userConfusion: '不知道考研还是工作',
      primaryPath: '技术研发型',
      primaryPathPercent: 85,
      dimensionScores: { S: 4.2, A: 4.5, R: 3.8, E: 2.5, X: 3.9, C: 2.8 },
      selfAwareness: 0.72
    });

    if (summary) {
      console.log('AI生成的总结:', summary);
    }
  };

  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? '生成中...' : '生成个性化总结'}
    </button>
  );
}
```

### 方式2：使用预设组件

直接使用我们提供的UI组件：

```tsx
import { PersonalizedSummaryCard } from '@/components/AIContentCards';

function ResultsPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ... 生成逻辑

  return (
    <PersonalizedSummaryCard
      summary={summary}
      isLoading={isLoading}
      error={null}
    />
  );
}
```

### 方式3：直接调用API

使用原生的fetch调用：

```tsx
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'summary',
    params: {
      userConfusion: '...',
      primaryPath: '...',
      // ... 其他参数
    }
  })
});

const data = await response.json();
console.log(data.data);
```

## API参数说明

### generatePersonalizedSummary

```typescript
{
  userConfusion?: string;          // 用户当前的困惑
  primaryPath: string;             // 主推荐路径名称
  primaryPathPercent: number;      // 匹配度百分比
  dimensionScores: {               // 维度得分
    S: number;
    A: number;
    R: number;
    E: number;
    X: number;
    C: number;
  };
  selfAwareness: number;           // 自我认知度 [0-1]
}
```

### generatePersonalizedAdvice

```typescript
{
  primaryPath: string;             // 推荐路径名称
  dimensionScores: {...};          // 维度得分
  userInfo: {
    grade: string;                 // 年级
    major: string;                 // 专业
    planPostgraduate?: boolean;    // 是否考研
    majorInterest?: string;        // 专业兴趣度
  };
}
```

### generateReflectionPrompt

```typescript
{
  primaryPath: string;             // 推荐路径
  evolvablePath?: string;          // 可演化路径
  selfAwareness: number;           // 自我认知度
  dimensionGaps: Array<{           // 维度差距
    dimension: string;
    gap: number;
  }>;
}
```

## 费用说明

- GLM API使用按token计费
- 推荐使用 `glm-4-flash` 模型（快速且经济）
- 估算费用：
  - 生成总结：~500 tokens ≈ ¥0.001
  - 生成建议：~400 tokens ≈ ¥0.001
  - 完整测试：~1500 tokens ≈ ¥0.003

## 部署注意事项

### Netlify

在Netlify后台设置环境变量：

1. 进入 Site settings → Environment variables
2. 添加 `GLM_API_KEY`
3. 重新部署项目

### Vercel

在Vercel后台设置环境变量：

1. 进入 Project Settings → Environment Variables
2. 添加 `GLM_API_KEY`
3. 重新部署项目

### 其他平台

确保在部署平台的环境变量配置中添加 `GLM_API_KEY`。

## 故障排除

### 问题1：API返回503错误

**原因**：未配置 `GLM_API_KEY`

**解决**：
1. 检查 `.env` 文件是否存在
2. 确认 `GLM_API_KEY` 已正确配置
3. 重启开发服务器

### 问题2：生成内容很慢

**原因**：API响应时间较长

**解决**：
- 这是正常现象，首次调用可能需要3-5秒
- 后续调用会更快（模型加载优化）
- 可以考虑添加loading状态提示用户

### 问题3：生成内容不理想

**原因**：模型输出的随机性

**解决**：
- 可以调整 `temperature` 参数（0.7是推荐值）
- 优化提示词（prompt）
- 提供更详细的用户信息

## 开发与调试

### 本地测试Mock响应

即使没有配置API Key，系统也会使用mock响应，方便开发和测试：

```typescript
// 在 lib/glm.ts 中
function getMockResponse(messages: GLMMessage[]): string {
  // 返回预设的mock内容
}
```

### 查看API调用日志

开发环境下可以在控制台查看API调用日志：

```typescript
console.log('GLM API call:', requestBody);
console.log('GLM API response:', data);
```

## 安全性

- ⚠️ **重要**：不要将 `.env` 文件提交到Git
- `.env` 已添加到 `.gitignore`
- 生产环境使用环境变量配置
- API Key仅在服务端使用，不会暴露给客户端

## 相关文件

- `/lib/glm.ts` - GLM API核心逻辑
- `/app/api/ai/generate/route.ts` - Next.js API路由
- `/hooks/useAIGeneration.ts` - React Hooks
- `/components/AIContentCards.tsx` - UI组件
- `.env.example` - 环境变量示例

## 更新日志

### v5.0 (2025-03-05)
- ✅ 集成智谱AI GLM-4-Flash模型
- ✅ 实现三种AI生成内容类型
- ✅ 智能降级机制
- ✅ React Hooks封装
- ✅ 预设UI组件
