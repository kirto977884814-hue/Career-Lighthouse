/**
 * GLM API 测试脚本
 * 用于验证 API Key 是否有效，以及能否正常生成内容
 */

import * as fs from 'fs';
import * as path from 'path';

// 手动读取 .env 文件
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

import { callGLMAPI, generatePersonalizedSummary, generatePersonalizedAdvice, generateReflectionPrompt } from './lib/glm';

// 测试数据
const testUser = {
  confusion: '不知道考研还是工作，感觉两个方向都有可能',
  primaryPath: '技术研发型',
  primaryPathPercent: 85,
  dimensionScores: { S: 4.2, A: 4.5, R: 3.8, E: 2.5, X: 3.9, C: 2.8 },
  selfAwareness: 0.72,
  userInfo: {
    grade: '大三',
    major: '计算机科学与技术',
    planPostgraduate: true,
    majorInterest: 'neutral'
  }
};

async function runTests() {
  console.log('🧪 开始测试 GLM API...\n');

  // 检查 API Key
  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    console.log('❌ 未找到 GLM_API_KEY 环境变量');
    console.log('请确保 .env 文件中已配置 GLM_API_KEY');
    return;
  }

  console.log('✅ GLM_API_KEY 已读取');
  console.log(`   Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}\n`);

  // 测试1：生成个性化总结
  console.log('📝 测试1：生成个性化总结');
  console.log('─'.repeat(50));
  try {
    const startTime = Date.now();
    const summary = await generatePersonalizedSummary({
      userConfusion: testUser.confusion,
      primaryPath: testUser.primaryPath,
      primaryPathPercent: testUser.primaryPathPercent,
      dimensionScores: testUser.dimensionScores,
      selfAwareness: testUser.selfAwareness
    });
    const duration = Date.now() - startTime;

    console.log('✅ 生成成功');
    console.log(`⏱️  耗时: ${duration}ms`);
    console.log(`📄 内容:\n${summary}\n`);
  } catch (error) {
    console.log('❌ 生成失败');
    console.log(`错误: ${error}\n`);
  }

  // 测试2：生成个性化建议
  console.log('📝 测试2：生成个性化建议');
  console.log('─'.repeat(50));
  try {
    const startTime = Date.now();
    const advice = await generatePersonalizedAdvice({
      primaryPath: testUser.primaryPath,
      dimensionScores: testUser.dimensionScores,
      userInfo: testUser.userInfo
    });
    const duration = Date.now() - startTime;

    console.log('✅ 生成成功');
    console.log(`⏱️  耗时: ${duration}ms`);
    console.log(`📄 内容:\n${advice}\n`);
  } catch (error) {
    console.log('❌ 生成失败');
    console.log(`错误: ${error}\n`);
  }

  // 测试3：生成反思引导
  console.log('📝 测试3：生成反思引导');
  console.log('─'.repeat(50));
  try {
    const startTime = Date.now();
    const reflection = await generateReflectionPrompt({
      primaryPath: testUser.primaryPath,
      evolvablePath: '稳定体制型',
      selfAwareness: testUser.selfAwareness,
      dimensionGaps: [
        { dimension: 'E', gap: 2.0 },
        { dimension: 'C', gap: 1.5 }
      ]
    });
    const duration = Date.now() - startTime;

    console.log('✅ 生成成功');
    console.log(`⏱️  耗时: ${duration}ms`);
    console.log(`📄 内容:\n${reflection}\n`);
  } catch (error) {
    console.log('❌ 生成失败');
    console.log(`错误: ${error}\n`);
  }

  console.log('─'.repeat(50));
  console.log('🎉 测试完成！');
}

runTests().catch(console.error);
